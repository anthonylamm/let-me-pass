const express = require('express');
const router = express.Router();
const pool = require('./db'); // Adjust the path as needed

console.log('Public routes set up');

router.get('/users', async (req, res) => {
    const client = await pool.connect();
    try {
        console.log('Connected to database');
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

router.post('/register', async (req, res) => {
    console.log('Received request:', req.body); // Debug log
    const { username, email, password } = req.body;
    const client = await pool.connect();

    try {
        console.log('Connected to database');
        const result = await client.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *', [username, email, password]);
        console.log(result.rows[0]);
        res.json({ message: 'User registered', user: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
});

module.exports = router;