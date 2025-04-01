const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const dotenv = require('dotenv');
const { requestPasswordReset, resetPassword } = require('../controllers/passwordResetController');

dotenv.config();

const router = express.Router();


router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    console.log('Register request received:', { username, email, password});
    try {
        
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or Email already exists' });
        }

      
        const user = new User({ username, email, password });
        await user.save();

        console.log('User saved:', user);
        
        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(201).json({ token });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ message: 'Registration failed:', error: error.message });
    }
});


router.post('/login', async (req, res) => {
    const { login, password } = req.body;
    try {
        
        const user = await User.findOne({
            $or: [{ username: login }, { email: login }],
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid User credentials' });
        }


        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password credentials' });
        }

        
        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ token });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Login failed:', error: error.message });
    }
});


router.post('/logout', (req, res) => {
    req.logout(err => {
      if (err) return res.status(500).json({ error: 'Logout failed' });
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Successfully logged out' });
      });
    });
  });

router.post('/request-password-reset', requestPasswordReset);

router.post('/reset-password', resetPassword);

module.exports = router;
