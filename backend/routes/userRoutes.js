const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { requestPasswordReset, resetPassword } = require('../controllers/passwordResetController');

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/profile', authenticateJWT, getUserProfile);

router.post('/request-password-reset', requestPasswordReset);

router.post('/reset-password', resetPassword);

module.exports = router;
