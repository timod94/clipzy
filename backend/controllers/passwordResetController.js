const crypto = require('crypto');
const User = require('../models/User');
const sns = require('../config/aws'); 
const { PublishCommand } = require('@aws-sdk/client-sns');

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(200).json({ message: 'If the e-mail exists, a message has been sent.' });
  }


  const token = crypto.randomBytes(32).toString('hex');

 
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; 
  await user.save();


  const resetURL = `${process.env.VITE_APP_URL}/reset-password/${token}`;


  const message = `You have submitted a request to reset your password. 
  Click on the following link to reset your password:
  ${resetURL}`;

 
  const params = {
    Message: message,
    Subject: 'Reset Password',
    TopicArn: 'arn:aws:sns:eu-central-1:202533538428:clipzy-password-reset-topic', 
  };

  try {
    await sns.send(new PublishCommand(params));
    res.status(200).json({ message: 'Password reset link has been sent' });
  } catch (error) {
    console.error('SNS Error: ', error);
    res.status(500).json({ error: 'Error when sending the message' });
  }
};
