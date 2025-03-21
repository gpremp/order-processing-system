const redis = require('redis');
const dotenv = require("dotenv");
dotenv.config();

// Create a Redis client
const redisClient = redis.createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

// Handle Redis connection errors
redisClient.on('error', (err) => {
  console.error(`Redis error: ${err}`);
});

// Connect to Redis
redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

module.exports = redisClient;