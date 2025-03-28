const { SQSClient } = require("@aws-sdk/client-sqs");

const sqsClient = new SQSClient({
  region: process.env.REGION, // Change to your AWS region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, 
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

module.exports = sqsClient
