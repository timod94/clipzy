const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { authenticateToken } = require('../middleware/auth');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', authenticateToken, getUserProfile);

module.exports = router;
