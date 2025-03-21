const express = require('express');
const router = express.Router();

// Import route files
const userRoutes = require('./users.routes.js');
const orderRoutes = require('./order.routes.js');
const inventoryRoutes = require('./inventory.routes.js')

// Use routes
router.use('/api/auth', userRoutes);
router.use('/api/inventory',inventoryRoutes)
router.use('/api/orders', orderRoutes);

module.exports = router;