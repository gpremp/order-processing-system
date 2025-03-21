const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const redisClient = require("./config/redis");
const routes = require("./routes/index");
const ApiError = require("./utils/ApiError")
const {deleteSQSMessage, receiveSQSMessages,listSQSQueues} = require('./helper/sqs.helper')
const {startSQSWorker} = require('./helper/orderProcessor.helper')
const { sendEmail } = require('./helper/ses.helper')

dotenv.config();

// Initialize Express App
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Database & Cache Connection
connectDB();
redisClient.connect().catch(console.error);

// Routes
app.use("/", routes);

// start the sqs worker
startSQSWorker()


// Health Check
app.get("/", async (req, res) => {
  sendEmail("gpremp7736@gmail.com", "Test Email", "<h1>Hello from AWS SES!</h1>");
  // const messages = await receiveSQSMessages();
  // if(messages.length <= 0){
  //   console.log("asjhdhk")
  // }
  // await listSQSQueues();

    // Delete the message after processing
    // await deleteSQSMessage(messages[0].ReceiptHandle)
  res.send("🚀 Order Processing API is Running!");
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("❌ Error:", err); // Log the error
  
    // Check if the error is an instance of ApiError
    if (err instanceof ApiError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        errors: err.errors, // Include additional error details (if any)
      });
    }
  
    // Handle generic errors (non-ApiError instances)
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  });

module.exports = app;
