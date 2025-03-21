const express = require("express");
const {
  createInventory,
  getAllInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
} = require("../controllers/inventory.controller");
const {verifyJWT} = require('../middlewares/auth.middleware')

const router = express.Router();

// Create a new inventory item
router.post("/",verifyJWT, createInventory);

// Get all inventory items
router.get("/",verifyJWT, getAllInventory);

// Get a single inventory item by ID
router.get("/:id",verifyJWT, getInventoryById);

// Update an inventory item by ID
router.put("/:id",verifyJWT, updateInventory);

// Delete an inventory item by ID
router.delete("/:id",verifyJWT, deleteInventory);

module.exports = router;