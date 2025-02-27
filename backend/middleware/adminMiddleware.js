const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const adminMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
  
    if (!token) {
      return res.status(403).json({ message: 'Access denied. No token provided.' });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.username !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Not an admin.' });
      }
      req.user = decoded; 
      next();
    } catch (error) {
      return res.status(400).json({ message: 'Invalid token.' });
    }
  };

module.exports = adminMiddleware;
