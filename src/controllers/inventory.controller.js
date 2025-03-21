const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const inventoryService = require("../services/inventory.service");

/**
 * Create a new inventory item.
 */
const createInventory = asyncHandler(async (req, res) => {
  const inventoryData = req.body;
  const inventory = await inventoryService.createInventory(inventoryData);

  return res
    .status(201)
    .json(new ApiResponse(201, inventory, "Inventory item created successfully"));
});

/**
 * Get all inventory items.
 */
const getAllInventory = asyncHandler(async (req, res) => {
  const inventory = await inventoryService.getAllInventory();

  return res
    .status(200)
    .json(new ApiResponse(200, inventory, "Inventory items retrieved successfully"));
});

/**
 * Get a single inventory item by ID.
 */
const getInventoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const inventory = await inventoryService.getInventoryById(id);

  return res
    .status(200)
    .json(new ApiResponse(200, inventory, "Inventory item retrieved successfully"));
});

/**
 * Update an inventory item by ID.
 */
const updateInventory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const inventory = await inventoryService.updateInventory(id, updateData);

  return res
    .status(200)
    .json(new ApiResponse(200, inventory, "Inventory item updated successfully"));
});

/**
 * Delete an inventory item by ID.
 */
const deleteInventory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await inventoryService.deleteInventory(id);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Inventory item deleted successfully"));
});

module.exports = {
  createInventory,
  getAllInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
};