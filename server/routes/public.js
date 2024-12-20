const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../tools/db'); // Adjust the path as needed
const bcrypt = require('bcrypt');

console.log('Public routes set up');

router.get('/users', async (req, res) => {//connection test
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT * FROM users');
        console.log(result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
});

router.post('/register', [
    body('username').trim().isLength({ min: 3 }).escape().withMessage('Username must be at least 3 characters long'), //replaces invalid characters with escape() method
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
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


        res.json({ message: 'User registered please verify account', user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
}); 

router.post('/auth', async (req, res) => {
    
});

module.exports = router;