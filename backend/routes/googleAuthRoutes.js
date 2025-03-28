const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
require('dotenv').config()

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id, username: req.user.username, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    req.session.user = req.user;
    res.redirect(`${process.env.FRONTEND_URL}/profile?token=${token}`);
  }
);


module.exports = router;
