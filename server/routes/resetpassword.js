const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../tools/db'); // Ensure this is the correct path to your DB pool setup

// Route to reset password
router.put('/reset-password', async (req, res) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const client = await pool.connect();

    try {
        // Check if user exists
        const check = await client.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );
        console.log(check)

        if (check.rows.length === 0) {
            return res.status(400).json({ error: 'User does not exist.' });
        }

        const newPassword = await bcrypt.hash(password, 10);//hashing new passowrd

        //update the user's password in the database
        const update = await client.query(
            `UPDATE users SET password = $1 WHERE email = $2`,
            [newPassword, email]
        );

        return res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    } finally {
        client.release();
    }
});

module.exports = router;
