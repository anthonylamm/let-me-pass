const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../utils/jwtauthentication'); 
const pool = require('../utils/db')
const argon2 = require('argon2');
const { body, validationResult } = require('express-validator');

router.use(authenticateToken);

router.post('/add-password',[
    body('sitename').trim().escape(),
    body('username').trim().escape(),
    body('siturl').trim().escape(),
    body('password').trim().escape(),
    body('notes').trim().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const user_id = req.user.user_id;
    const { sitename, username, siteurl, password, notes } = req.body;
    const client = await pool.connect();
    try {
        
        const encryptedPassword = await argon2.hash(password);

        console.log('Inserting:', { user_id, sitename, siteurl, username, encryptedPassword, notes });

        await client.query(`
            INSERT INTO passwordvault 
            (user_id, sitename, siteurl, username, encryptedPassword, notes)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [user_id, sitename, siteurl, username, encryptedPassword, notes]);

        res.status(200).json({ message: "Password successfully added to your vault" });
    } catch (error) {
        console.error('Error adding password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
});

router.get('/user-information', async(req, res) => {
    const user_id = req.user.user_id;
    const client = await pool.connect();


    try {
        const results = await client.query(`
            SELECT password_id, sitename, siteurl, username, encryptedPassword, notes
            FROM passwordvault
            WHERE user_id = $1
        `, [user_id]
        );
        
        res.status(200).json({message: 'Query successful sending user data',results: results.rows});
    }catch(error){
        console.error(`Error with getting user's password `, error);
        res.status(500).json({error: 'Internal Server Error'});
    }finally {
        client.release();
    }
});
router.delete('/delete-password', async(req, res) => {
    const {password_id} = req.body;
    const user_id = req.user.user_id;

    const client = await pool.connect();
    try{
        await client.query(`
            DELETE FROM passwordvault
            WHERE password_id = $1 AND user_id = $2
            `, [password_id, user_id]
        );
        res.status(200).json({ message: "Password successfully delted to from your vault" });

    }catch(error){
        console.error('Error deleting password:', error);

        res.status(500).json({error: 'Internal Server Error'})
    }finally{
        client.release();
    }
})

router.put('/modify-data', [
    body('password_id').isInt(),
    body('attribute').trim().escape(),
    body('collum').trim().escape()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { password_id, attribute, collum } = req.body;
    const user_id = req.user.user_id;
    const client = await pool.connect();
    try {
        let updatedAttribute = attribute;
        if (collum === 'encryptedpassword') {
            updatedAttribute = await argon2.hash(attribute);
        }

        await client.query(`
            UPDATE passwordvault
            SET ${collum} = $1
            WHERE password_id = $2 AND user_id = $3
        `, [updatedAttribute, password_id, user_id]);

        res.status(200).json({ message: "Password successfully updated in your vault" });
    } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
});

module.exports = router;