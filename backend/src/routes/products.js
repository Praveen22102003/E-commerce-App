const express = require('express');
const router = express.Router();
const {
  getProducts, getProduct,
  createProduct, updateProduct, deleteProduct
} = require('../controllers/productController');
const { verifyAdmin } = require('../middleware/auth');

// Public
router.get('/', getProducts);
router.get('/:id', getProduct);

// Admin only
router.post('/', verifyAdmin, createProduct);
router.put('/:id', verifyAdmin, updateProduct);
router.delete('/:id', verifyAdmin, deleteProduct);

module.exports = router;