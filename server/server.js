require('dotenv').config({ path: './data/.env' });

const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.PORT;
const { Pool } = require('pg');

require('dotenv').config({ path: './data/.env' });



// Middleware to parse JSON
app.use(express.json());

// Import routes
const usersRouter = require('./routes/user');
const publicRouter = require('./routes/public');
const resetRouter = require('./routes/resetpassword')

// Use routes
app.use(cors());
app.use('/api/user', usersRouter);
app.use('/api/public', publicRouter);
app.use('/api/reset', resetRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.get('/', (req, res) => {
    res.send('Hello World!');
});
module.exports = app; // Export the app for testing
