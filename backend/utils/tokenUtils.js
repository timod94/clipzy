const jwt = require('jsonwebtoken');

module.exports = {
  generateToken: (userId, expiresIn = '1h') => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn });
  },
  
  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return null;
    }
  }
};