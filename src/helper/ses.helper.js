const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
require("dotenv").config();

// Initialize SES Client
const sesClient = new SESClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Send Email Function
const sendEmail = async (toEmail, subject, body) => {
  const params = {
    Source: process.env.SES_SENDER_EMAIL,
    Destination: {
      ToAddresses: [toEmail],
    },
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: { Data: body }, // Use Html for rich formatting
      },
    },
  };

  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log(`✅ Email sent! MessageId: ${data.MessageId}`);
    return data;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
};

// Export function for use in other modules
module.exports = { sendEmail };

