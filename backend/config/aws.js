const { S3Client } = require('@aws-sdk/client-s3');
const { SNSClient } = require('@aws-sdk/client-sns');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    sessionToken: process.env.AWS_SESSION_TOKEN,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const sns = new SNSClient({
  region: process.env.AWS_REGION,
  credentials: {
    sessionToken: process.env.AWS_SESSION_TOKEN,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

module.exports = { s3, sns };

