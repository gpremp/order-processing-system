const redisClient = require("../config/redis");
const logger = require("../utils/logger"); // Import logger utility

/**
 * Set data in Redis with an optional expiration time.
 * @param {string} key - The key to store the data under.
 * @param {any} value - The data to store (will be stringified).
 * @param {number} [expiration] - Expiration time in seconds (optional).
 * @returns {Promise<void>}
 * @throws {Error} If Redis operation fails.
 */
const setRedisData = async (key, value, expiration) => {
  try {
    const stringifiedValue = JSON.stringify(value);

    if (expiration) {
      await redisClient.set(key, stringifiedValue, { EX: expiration });
    } else {
      await redisClient.set(key, stringifiedValue);
    }

    logger.info(`Data set in Redis for key: ${key}`); // Log successful operation
  } catch (error) {
    logger.error(`Error setting data in Redis for key: ${key}`, error); // Log error
    throw new Error("Failed to set data in Redis");
  }
};

/**
 * Get data from Redis.
 * @param {string} key - The key to retrieve data for.
 * @returns {Promise<any>} - The parsed data or null if the key does not exist.
 * @throws {Error} If Redis operation fails.
 */
const getRedisData = async (key) => {
  try {
    const data = await redisClient.get(key);

    if (data) {
      logger.info(`Data retrieved from Redis for key: ${key}`); // Log successful operation
      return JSON.parse(data);
    }

    logger.warn(`No data found in Redis for key: ${key}`); // Log cache miss
    return null;
  } catch (error) {
    logger.error(`Error getting data from Redis for key: ${key}`, error); // Log error
    throw new Error("Failed to get data from Redis");
  }
};

/**
 * Delete data from Redis.
 * @param {string} key - The key to delete.
 * @returns {Promise<void>}
 * @throws {Error} If Redis operation fails.
 */
const deleteRedisData = async (key) => {
  try {
    await redisClient.del(key);
    logger.info(`Data deleted from Redis for key: ${key}`); // Log successful operation
  } catch (error) {
    logger.error(`Error deleting data from Redis for key: ${key}`, error); // Log error
    throw new Error("Failed to delete data from Redis");
  }
};

module.exports = {
  setRedisData,
  getRedisData,
  deleteRedisData,
};