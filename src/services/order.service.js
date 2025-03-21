const Order = require("../models/order.model");
const Inventory = require("../models/inventory.model");
const ApiError = require("../utils/ApiError");
const { setRedisData, getRedisData, deleteRedisData } = require("../helper/redis.helper");
const { sendSQSMessage } = require("../helper/sqs.helper");
const logger = require("../utils/logger");
const userSchema = require("../models/user.model.js");

/**
 * Generate a unique order ID.
 * @returns {string} - The generated order ID.
 */
const generateOrderId = () => {
  const timestamp = Date.now().toString(); // Get current timestamp
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0"); // Random 3-digit number
  return `ORD-${timestamp}-${random}`; // Combine to create a unique order ID
};

/**
 * Create a new order.
 * @param {Object} orderData - The order data (userId, items).
 * @returns {Promise<Object>} - The created order.
 */
const createOrder = async (orderData) => {
  const { userId, items } = orderData;

  // Validate required fields
  if (!userId || !items) {
    throw new ApiError(400, "All fields (userId, items) are required");
  }

  // Validate items array
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Items must be a non-empty array");
  }

  // Validate each item in the items array
  for (const item of items) {
    if (!item.productId || !item.quantity) {
      throw new ApiError(400, "Each item must have a productId and quantity");
    }
  }

  const user = await userSchema.findById(userId)
  if(!user){
    throw new ApiError(404, "User does not exist");
  }

  // Check stock and calculate total amount
  let totalAmount = 0;
  for (const item of items) {
    const product = await Inventory.findOne({ productId: item.productId });

    // Check if product exists
    if (!product) {
      throw new ApiError(404, `Product with ID ${item.productId} not found`);
    }

    // Check if product is in stock
    if (product.stock < item.quantity) {
      throw new ApiError(400, `Product ${product.name} is out of stock`);
    }

    // Calculate total amount (assuming price is stored in the inventory)
    totalAmount += product.price * item.quantity;
  }

  // Generate a unique order ID
  const orderId = generateOrderId();

  // Create new order
  const order = await Order.create({
    orderId,
    userId,
    items,
    totalAmount,
    status: "Pending", // Default status
  });

  // Update inventory stock after order is placed
  for (const item of items) {
    await Inventory.findOneAndUpdate(
      { productId: item.productId },
      { $inc: { stock: -item.quantity } } // Decrease stock by the ordered quantity
    );
  }

  // Send order to SQS for further processing
  const status = await sendSQSMessage({ 
    orderId: order.orderId,
    totalAmount: order.totalAmount,
    status: order.status,
    userEmail:user.email });
  if (status.$metadata.httpStatusCode !== 200) {
    // Save failed order details in the database
    throw new ApiError(500, "Failed to send order to SQS");
  }

  return order;
};

/**
 * Get all orders.
 * @returns {Promise<Array>} - The list of orders.
 */
const getAllOrders = async () => {
  const orders = await Order.find();
  return orders;
};

/**
 * Get a single order by ID.
 * @param {string} orderId - The order ID.
 * @returns {Promise<Object>} - The order details.
 */
const getOrderById = async (orderId) => {
  // Validate orderId
  if (!orderId) {
    throw new ApiError(400, "Order ID is required");
  }

  // Check if the order is cached in Redis
  const cachedOrder = await getRedisData(`order:${orderId}`);
  if (cachedOrder) {
    return JSON.parse(cachedOrder);
  }

  // Find the order by orderId
  const order = await Order.findOne({ orderId });
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Cache the order in Redis with an expiration time of 10 minutes
  await setRedisData(`order:${orderId}`, JSON.stringify(order), 600);

  return order;
};

/**
 * Update an order by ID.
 * @param {string} orderId - The order ID.
 * @param {string} status - The new status.
 * @returns {Promise<Object>} - The updated order.
 */
const updateOrder = async (orderId, status) => {
  // Validate status
  if (!["Pending", "Processed", "Failed"].includes(status)) {
    throw new ApiError(400, "Invalid status. Must be one of: Pending, Processed, Failed");
  }

  // Check if order exists
  const order = await Order.findOne({ orderId });
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Update status
  order.status = status;
  await order.save();

  // Delete the order from Redis cache
  await deleteRedisData(`order:${orderId}`);

  return order;
};

/**
 * Delete an order by ID.
 * @param {string} orderId - The order ID.
 * @returns {Promise<void>}
 */
const deleteOrder = async (orderId) => {
  const order = await Order.findOne({ orderId });
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Delete the order from Redis cache
  await deleteRedisData(`order:${orderId}`);

  await Order.deleteOne({ orderId });
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};