const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController')
const adminMiddleware = require('../middleware/adminMiddleware')

router.post('/create', OrderController.createOrderFromCart);

router.get('/all', adminMiddleware, OrderController.getAllOrders)

router.get('/user/:userId', OrderController.getUserOrders);

router.get('/user/:userId/order/:orderId', OrderController.getOrderById);

router.put('/:orderId/status', adminMiddleware, OrderController.updateOrderStatus);

module.exports = router