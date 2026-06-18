const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
  updateCustomerStatus
} = require('../controllers/adminController');
const { verifyAdmin } = require('../middleware/auth');

router.use(verifyAdmin);

router.get('/dashboard',           getDashboardStats);
router.get('/orders',              getAllOrders);
router.put('/orders/:id/status',   updateOrderStatus);
router.get('/customers',           getAllCustomers);
router.put('/customers/:id/status',updateCustomerStatus);

module.exports = router;