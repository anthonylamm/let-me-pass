const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const pool = require('../utils/db'); // Adjust the path as needed
const bcrypt = require('bcrypt');
const { sendAuthEmail } = require('../utils/mailer'); // sendAuthEmail function
const jwt = require('jsonwebtoken');


router.post('/register', [
    body('username').trim().isLength({ min: 3 }).escape().withMessage('Username must be at least 3 characters long'), //replaces invalid characters with escape() method
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
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

        const hashedPassword = await bcrypt.hash(password, 10);//algorithm to hash password

        const result = await client.query('INSERT INTO users (username, email, password, email_verified) VALUES ($1, $2, $3, $4) RETURNING *', [username, email, hashedPassword, false]);//inserting user into database
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

router.get('/verify-email', 
    async (req, res) => {
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

router.post('/login', [
    body('username').trim().escape(),
    body('password').trim().escape()
], async (req,res)=> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {username,password} = req.body;
    const client = await pool.connect();
    try { 
        console.log(username, password)
        const results = await client.query('SELECT * FROM users WHERE username =$1', [username]);//getting results from database 
        if (results.rows.length === 0) //checking to see if user exists
            return res.status(400).json({ error: 'Invalid username or password' });
        if (!results.email_verified)
            return res.status(400).json({error: 'Please verify your email'})
        
        const user = results.rows[0];
        const passwordMatch = await bcrypt.compare(password, user.password);//unhashing the password and comparing it to the password in the database
        if (!passwordMatch) 
            return res.status(400).json({ error: 'Invalid username or password' });
        
        jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '3h' }, (err, token) => {//creating a token to be used for authentication
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.json({message:"login success", token: token});
        });
       
    }catch (error) {
        console.error("Database query error:", error);
        return res.status(500).json({ error: 'Internal server error.' });
      } finally {
        client.release();
      }
});


module.exports = router;