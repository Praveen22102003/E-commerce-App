const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getOrder, cancelOrder } = require('../controllers/orderController');
const { verifyToken } = require('../middleware/auth');

router.use(verifyToken);

router.post('/',           createOrder);
router.get('/',            getMyOrders);
router.get('/:id',         getOrder);
router.put('/:id/cancel',  cancelOrder);

module.exports = router;