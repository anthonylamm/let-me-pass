const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../utils/db'); 
const argon2 = require('argon2');
const { sendAuthEmail } = require('../utils/mailer'); // sendAuthEmail function
const jwt = require('jsonwebtoken');
const crypto = require('crypto');


router.post('/register', [
    body('username').trim().isLength({ min: 3 }).escape().withMessage('Username must be at least 3 characters long'), //replaces invalid characters with escape() method
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/[A-Za-z]/).withMessage('Password must contain letters.')
        .matches(/[0-9]/).withMessage('Password must contain numbers.')
        .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain symbols (!, #, $, etc.)')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array()); // Debug log
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, email, password } = req.body;

    const client = await pool.connect();
    try {
        const checkUser = await client.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);//checking to see if user already exists
        if (checkUser.rows.length > 0) {
            return res.status(400).json({ errors: [{ msg: 'Email or username already exists', param: 'username/email' }] });        }

        const hashedPassword = await argon2.hash(password);//algorithm to hash password
        const salt = crypto.randomBytes(16).toString('base64');

        const result = await client.query('INSERT INTO users (username, email, password, salt, email_verified) VALUES ($1, $2, $3, $4, $5) RETURNING *', [username, email, hashedPassword, salt, false]);//inserting user into database
        console.log(result.rows[0]);

        const token = jwt.sign({ username: result.rows[0].username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(token);
        const verificationUrl = `${process.env.FRONTEND_URL}/email-verified?token=${token}`;

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

// Email Verification Route
router.get('/verify-email', async (req, res) => {
    const { token } = req.query;


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded); // Log the decoded token

        const client = await pool.connect();
        try {
            const result = await client.query(
                'UPDATE users SET email_verified = true WHERE username = $1 RETURNING *',
                [decoded.username]
            );
            if (result.rows.length === 0) {
                console.log('No user found with the provided username'); 
                return res.status(400).json({ error: 'Invalid or expired token' });
            }

            res.json({ message: 'Email verified successfully' });
        } catch (err) {
            console.error('Database error:', err); 
            res.status(500).json({ error: 'Internal Server Error' });
        } finally {
            client.release();
        }
    } catch (err) {
        console.error('Token verification error:', err); 
        res.status(400).json({ error: 'Invalid or expired token' });
    }
});

router.post('/login', [
    body('username').trim().escape(), // replaces invalid characters with escape() method
    body('password').trim().escape()// replaces invalid characters with escape() method
], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    const client = await pool.connect();
    try {
        const results = await client.query('SELECT * FROM users WHERE username =$1', [username]); //getting results from database
        const user = results.rows[0];

        if (!user) //checking to see if user exists
            return res.status(400).json({ error: 'Invalid username or password' });

        if (!user.email_verified) {
            return res.status(400).json({ error: 'Please verify your email' });
        }
        const passwordMatch = await argon2.verify(user.password, password); //unhashing the password and comparing it to the password in the database
        if (!passwordMatch)
            return res.status(400).json({ error: 'Invalid username or password' });

        jwt.sign({ user_id: user.user_id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => { //creating a token to be used for authentication
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json({ message: "login success", token: token, salt: user.salt });
        });

    } catch (error) {
        console.error("Database query error:", error);
        return res.status(500).json({ error: 'Internal server error.' });
    } finally {
        client.release();
    }
});

module.exports = router;