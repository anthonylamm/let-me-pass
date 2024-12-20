const express = require('express');
const router = express.Router();

// Define user routes
router.get('/', (req, res) => {
    res.send('hello');
});

router.get('/:id', (req, res) => {
    res.send(`User ${req.params.id}`);
});

module.exports = router;