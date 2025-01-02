require('dotenv').config({ path: './data/.env' });

const express = require('express');
const app = express();
const cors = require('cors');

const port = process.env.PORT || 3000; // Fallback to 3000 if PORT isn't set
const { Pool } = require('pg');

// Middleware to parse JSON and handle CORS
app.use(express.json());

app.use(cors({
  origin: [
    'https://let-me-pass-client.vercel.app', // Your frontend URL
    /^https:\/\/let-me-pass-client-[a-z0-9\-]+\.vercel\.app$/ // Regex for Vercel preview URLs
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Import routes
const usersRouter = require('./routes/user');
const publicRouter = require('./routes/public');
const resetRouter = require('./routes/resetpassword');

// Use routes without extra /api prefix since Render handles /api/* routing
app.use('/api/user', usersRouter);
app.use('/api/public', publicRouter);
app.use('/api/reset', resetRouter);

// Default route (optional)
app.get('/', (req, res) => {
  res.send('API is running');
});

// Error handlers
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

module.exports = app; // Export the app for testing

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
