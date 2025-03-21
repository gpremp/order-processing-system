const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const orderService = require("../services/order.service");

/**
 * Create a new order.
 */
const createOrder = asyncHandler(async (req, res) => {
  const orderData = req.body;
  const order = await orderService.createOrder(orderData);

  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order created and queued for processing"));
});

/**
 * Get all orders.
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await orderService.getAllOrders();

  return res
    .status(200)
    .json(new ApiResponse(200, orders, "Orders retrieved successfully"));
});

/**
 * Get a single order by ID.
 */
const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const order = await orderService.getOrderById(orderId);

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order retrieved successfully"));
});

/**
 * Update an order by ID.
 */
const updateOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const order = await orderService.updateOrder(orderId, status);

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order updated successfully"));
});

/**
 * Delete an order by ID.
 */
const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  await orderService.deleteOrder(orderId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Order deleted successfully"));
});

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};