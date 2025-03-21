const orderSchema = require("../models/order.model");
const {deleteSQSMessage, receiveSQSMessages} = require('./sqs.helper')
const inventorySchema = require('../models/inventory.model')
const {sendEmail} = require('./ses.helper')
// Function to process an order
const processOrder = async (orderId,totalAmount,status,userEmail) => {
    try {
      const order = await orderSchema.findOne({ orderId });
  
      if (!order) {
        console.error(`Order ${orderId} not found`);
        return;
      }
  
      // Check if the order is already processed
      if (order.status === "Processed" || order.status === "Failed") {
        console.error(`Order ${orderId} is already processed`);
        return;
      }
  
      // Simulate order processing (e.g., payment, shipping, etc.)
      // For simplicity, we'll randomly set the status to Processed or Failed
      const status = Math.random() > 0.2 ? "Processed" : "Failed";
  
      // Update the order status
      order.status = status;
      await order.save();
  
      console.log(`Order ${orderId} processed with status: ${status}`);
  
      // If the order failed, revert the inventory stock changes
      if (status === "Failed") {
        for (const item of order.items) {
          await inventorySchema.findOneAndUpdate(
            { productId: item.productId },
            { $inc: { stock: item.quantity } } // Increase stock by the ordered quantity
          );
        }
        console.log(`Inventory stock reverted for failed order ${orderId}`);
      }
      // Send email notification
    const emailSubject = `Order ${order.orderId} Status Update`;
    const emailBody = `
      <h1>Order Status Update</h1>
      <p>Your order has been ${status.toLowerCase()}.</p>
      <h2>Order Details</h2>
      <ul>
        <li><strong>Order ID:</strong> ${order.orderId}</li>
        <li><strong>Status:</strong> ${status}</li>
        <li><strong>Items:</strong>
          <ul>
            ${order.items
              .map(
                (item) => `
              <li>${item.productId} (Quantity: ${item.quantity})</li>
            `
              )
              .join("")}
              </ul>
        </li>
        <li><strong>Total Amount:</strong> $${order.totalAmount}</li>
      </ul>
    `;

    await sendEmail(userEmail, emailSubject, emailBody);
    console.log(`Email notification sent for order ${order.orderId}`);
    } catch (error) {
      console.error(`Error processing order ${orderId}:`, error);
    }
  };

// Function to poll messages from SQS
const pollSQS = async () => {

  try {
    const data = await receiveSQSMessages();

    if (data.Messages && data.Messages.length > 0) {
      for (const message of data.Messages) {
        const { orderId,totalAmount,status, userEmail } = JSON.parse(message.Body);

        // Process the order

        await processOrder(orderId,totalAmount,status,userEmail);

        // Delete the message from the queue after processing
        await deleteSQSMessage(message.ReceiptHandle);
      }
    }
  } catch (error) {
    console.error("Error polling SQS:", error);
  }
};

// Start the worker
const startSQSWorker = () => {
  console.log("Order Processor Worker started...");
  setInterval(pollSQS, 50000); // Poll SQS every 10 seconds
};

module.exports = {startSQSWorker};
