const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expecting format: 'Bearer TOKEN'
  
    if (token == null) return res.sendStatus(401); // No token provided
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error('Token verification failed:', err);
        return res.sendStatus(403); // Forbidden
      }
      req.user = user;
      next();
    });
  }
  exports.authenticateToken = authenticateToken;