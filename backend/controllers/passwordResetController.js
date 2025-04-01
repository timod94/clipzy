const User = require('../models/User');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../services/emailService');
const { generateToken, verifyToken } = require('../utils/tokenUtils');

const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User with this email does not exist' });
        }


        const resetToken = generateToken(user._id, '1h'); 
        const resetTokenExpires = Date.now() + 3600000;

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpires;
        await user.save();

        const resetUrl = `${process.env.VITE_APP_URL}/reset?token=${resetToken}`;
        await sendPasswordResetEmail(user.email, resetUrl);

        res.status(200).json({ 
            message: 'Password reset link has been sent to your email',
            token: resetToken
        });
    } catch (error) {
        console.error('Error in requestPasswordReset:', error);
        res.status(500).json({ error: 'Error processing password reset request' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;

        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        const user = await User.findOne({
            _id: decoded.userId,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password has been successfully reset' });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ error: 'Error resetting password' });
    }
};

module.exports = {
    requestPasswordReset,
    resetPassword
};