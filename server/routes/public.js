const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../tools/db'); // Adjust the path as needed
const bcrypt = require('bcrypt');
const { sendAuthEmail } = require('../tools/mailer'); // sendAuthEmail function
const jwt = require('jsonwebtoken');


router.post('/register', [
    body('username').trim().isLength({ min: 3 }).escape().withMessage('Username must be at least 3 characters long'), //replaces invalid characters with escape() method
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    console.log('Received request:', req.body); // Debug log
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array()); // Debug log
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;

    const client = await pool.connect();
    try {
        const checkUser = await client.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
        if (checkUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email or username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);//algorithm to hash password

        const result = await client.query('INSERT INTO users (username, email, password, email_verified) VALUES ($1, $2, $3, $4) RETURNING *', [username, email, hashedPassword, false]);
        console.log(result.rows[0]);

        const token = jwt.sign({ username: result.rows[0].username }, process.env.JWT_SECRET, { expiresIn: '3h' });
        console.log(token);
        const verificationUrl = `${process.env.APP_URL}/api/public/verify-email?token=${token}`;

        const emailHtml = `
            <h1>Email Verification</h1>
            <p>Please verify your email by clicking the following link:</p>
            <a href="${verificationUrl}">${verificationUrl}</a>
        `;

        await sendAuthEmail(email, 'Email Verification', emailHtml);

        res.json({ message: 'User registered. Please verify your email.', user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
}); 

router.get('/verify-email', async (req, res) => {
    const { token } = req.query;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const client = await pool.connect();
        try {
            const result = await client.query('UPDATE users SET email_verified = true WHERE username = $1 RETURNING *', [decoded.username]);
            if (result.rows.length === 0) {
                return res.status(400).json({ error: 'Invalid or expired token' });
            }
            res.json({ message: 'Email verified successfully', user: result.rows[0] });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Invalid or expired token' });
    }
});

router.post('/auth', async (req, res) => {
    
});

module.exports = router;