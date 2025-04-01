// backend/services/emailService.js
const { PublishCommand } = require('@aws-sdk/client-sns');
const { sns } = require('../aws/clients');

const sendPasswordResetEmail = async (email, resetUrl) => {
  const htmlContent = `
    <html>
      <body>
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your Clipzy account.</p>
        <p>Click the button below to set a new password:</p>
        <a href="${resetUrl}" 
           style="background-color: #5187dd; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>If you didn't request this, please ignore this email.</p>
        <hr>
        <p>Clipzy Team</p>
      </body>
    </html>
  `;

  const params = {
    Message: htmlContent,
    Subject: 'Clipzy Password Reset',
    TopicArn: process.env.SNS_TOPIC_ARN,
    MessageAttributes: {
      'email': {
        DataType: 'String',
        StringValue: email
      },
      'contentType': {
        DataType: 'String',
        StringValue: 'HTML'
      }
    }
  };

  try {
    await sns.send(new PublishCommand(params));
    console.log(`Password reset link sent to ${email}`);
    return true;
  } catch (error) {
    console.error('SNS Error:', error);
    throw new Error('Failed to send password reset email');
  }
};

module.exports = { sendPasswordResetEmail };