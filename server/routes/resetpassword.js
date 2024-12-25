const express = require('express');
const router = express.Router();
const argon2 = require('argon2');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const pool = require('../utils/db'); 
const { sendAuthEmail } = require('../utils/mailer'); 
const rateLimit = require('express-rate-limit');

const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, //only 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many password reset attempts from this IP, please try again after 15 minutes.'
});

// POST /api/reset/request-password-reset
router.post('/request-password-reset',resetPasswordLimiter , [
    body('email').isEmail().withMessage('Please enter a valid email address.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const { email } = req.body;
    const client = await pool.connect();

    try {
        // Check if user exists
        const userResult = await client.query('SELECT user_id FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            // To prevent email enumeration, respond with the same message
            return res.status(200).json({ message: 'Account does not exist, please signup to continue.' });
        }

        const userId = userResult.rows[0].user_id;

        // Generate a secure token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Set token expiration time (e.g., 1 hour)
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

        // Store the token in the database
        await client.query(
            'INSERT INTO password_resets (user_id, token, expires_at) VALUES ($1, $2, $3)',
            [userId, resetToken, expiresAt]
        );

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`; // Corrected frontend route
        // Email content
        const emailHtml = `
            <h1>Password Reset</h1>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetUrl}">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
        `;

        // Send the password reset email
        await sendAuthEmail(email, 'Password Reset', emailHtml);

        res.status(200).json({ message: `The email has been sent to ${email}. Please open to begin the reset process.` });
    } catch (err) {
        console.error('Error in /request-password-reset:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
});

// POST /api/reset/reset-password
router.post('/reset-password', resetPasswordLimiter, [
    body('token').notEmpty().withMessage('Token is required.'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
        .matches(/[A-Za-z]/).withMessage('Password must contain letters.')
        .matches(/[0-9]/).withMessage('Password must contain numbers.')//password validation
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain symbols (!, #, $, etc.).')//password validation
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { token, password } = req.body;
    const client = await pool.connect();

    try {
        // Find the token in the database
        const tokenResult = await client.query(
            'SELECT user_id, expires_at FROM password_resets WHERE token = $1',
            [token]
        );
        
        if (tokenResult.rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired token.' });
        }

        const { user_id, expires_at } = tokenResult.rows[0];

        // Check if the token has expired
        if (new Date() > expires_at) {
            // Delete the expired token
            await client.query('DELETE FROM password_resets WHERE token = $1', [token]);
            return res.status(400).json({ error: 'Token has expired.' });
        }

        // Hash the new password
        const hashedPassword = await argon2.hash(password);

        // Update the user's password
        await client.query(
            'UPDATE users SET password = $1 WHERE user_id = $2',
            [hashedPassword, user_id]
        );

        // Delete the token after successful reset
        await client.query('DELETE FROM password_resets WHERE token = $1', [token]);

        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        console.error('Error in /reset-password:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
});

module.exports = router;
