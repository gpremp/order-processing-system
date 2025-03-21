// routes/orderRoutes.js
const express = require("express");
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require("../controllers/order.controller");
const {verifyJWT} = require('../middlewares/auth.middleware')
const router = express.Router();

// Create a new order
router.post("/",verifyJWT, createOrder);

// Get all orders
router.get("/",verifyJWT, getAllOrders);

// Get a single order by ID
router.get("/:orderId",verifyJWT, getOrderById);

// Update an order by ID
router.put("/:orderId",verifyJWT, updateOrder);

// Delete an order by ID
router.delete("/:orderId",verifyJWT, deleteOrder);

module.exports = router;