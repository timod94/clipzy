const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', authenticateJWT, getUserProfile);

module.exports = router;
