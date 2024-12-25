const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/jwtauthentication'); 
const pool = require('../utils/db')
const argon2 = require('argon2');

router.use(authenticateToken);
// Define user routes
router.post('/add-password', async(req, res) => {
    const user_id = req.user.user_id;
    const {sitename, username, siturl, password, notes} = req.body 

    try{
        const client = await pool.connection();

        const encryptedpassword = await argon2.hash(password)
        

        await client.query(`
            INSERT INTO passwordvault 
            (user_id, sitename, siteurl, username, encryptedpassword, notes)
            `, [user_id, sitename, username, siturl, encryptedpassword, notes]);
        res.status(200).json({message: "password sucessfully added to your vault"})


    }catch(error){
        res.status(500).json({ error: 'Internal Server Error' });

    }
});

router.get('/addnewpassword', (req, res) => {
    res.send(`User ${req.params.id}`);
});

module.exports = router;