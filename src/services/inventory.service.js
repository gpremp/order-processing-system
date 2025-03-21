const Inventory = require("../models/inventory.model");
const ApiError = require("../utils/ApiError");
const logger = require("../utils/logger");

/**
 * Create a new inventory item.
 * @param {Object} inventoryData - The inventory data (productId, name, price, stock).
 * @returns {Promise<Object>} - The created inventory item.
 * @throws {ApiError} If validation fails or productId already exists.
 */
const createInventory = async (inventoryData) => {
  const { productId, name, price, stock } = inventoryData;

  // Validate required fields
  if (!productId || !name || !price || !stock) {
    throw new ApiError(400, "All fields (productId, name, price, stock) are required");
  }

  // Check if productId already exists
  const existingInventory = await Inventory.findOne({ productId });
  if (existingInventory) {
    throw new ApiError(409, "Product with this ID already exists");
  }

  // Create new inventory item
  const inventory = await Inventory.create({ productId, name, price, stock });

  logger.info(`Inventory item created: ${inventory.productId}`); // Log success
  return inventory;
};

/**
 * Get all inventory items.
 * @returns {Promise<Array>} - The list of inventory items.
 * @throws {ApiError} If no items are found.
 */
const getAllInventory = async () => {
  const inventory = await Inventory.find();

  if (inventory.length === 0) {
    throw new ApiError(404, "No inventory items found");
  }

  logger.info("Retrieved all inventory items"); // Log success
  return inventory;
};

/**
 * Get a single inventory item by ID.
 * @param {string} id - The inventory item ID.
 * @returns {Promise<Object>} - The inventory item.
 * @throws {ApiError} If the ID is invalid or the item is not found.
 */
const getInventoryById = async (id) => {
  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid inventory ID");
  }

  const inventory = await Inventory.findById(id);

  if (!inventory) {
    throw new ApiError(404, "Inventory item not found");
  }

  logger.info(`Retrieved inventory item: ${inventory.productId}`); // Log success
  return inventory;
};

/**
 * Update an inventory item by ID.
 * @param {string} id - The inventory item ID.
 * @param {Object} updateData - The fields to update (productId, name, price, stock).
 * @returns {Promise<Object>} - The updated inventory item.
 * @throws {ApiError} If the ID is invalid, the item is not found, or validation fails.
 */
const updateInventory = async (id, updateData) => {
  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid inventory ID");
  }

  // Check if inventory item exists
  const inventory = await Inventory.findById(id);
  if (!inventory) {
    throw new ApiError(404, "Inventory item not found");
  }

  // Update fields if provided
  if (updateData.productId) inventory.productId = updateData.productId;
  if (updateData.name) inventory.name = updateData.name;
  if (updateData.price) inventory.price = updateData.price;
  if (updateData.stock) inventory.stock = updateData.stock;

  await inventory.save();

  logger.info(`Updated inventory item: ${inventory.productId}`); // Log success
  return inventory;
};

/**
 * Delete an inventory item by ID.
 * @param {string} id - The inventory item ID.
 * @returns {Promise<void>}
 * @throws {ApiError} If the ID is invalid or the item is not found.
 */
const deleteInventory = async (id) => {
  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, "Invalid inventory ID");
  }

  const inventory = await Inventory.findByIdAndDelete(id);

  if (!inventory) {
    throw new ApiError(404, "Inventory item not found");
  }

  logger.info(`Deleted inventory item: ${inventory.productId}`); // Log success
};

module.exports = {
  createInventory,
  getAllInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
};