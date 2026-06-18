const express = require('express');
const router = express.Router();
const {
  getCategories, getCategory,
  createCategory, updateCategory, deleteCategory
} = require('../controllers/categoryController');
const { verifyAdmin } = require('../middleware/auth');

// Public
router.get('/', getCategories);
router.get('/:id', getCategory);

// Admin only
router.post('/', verifyAdmin, createCategory);
router.put('/:id', verifyAdmin, updateCategory);
router.delete('/:id', verifyAdmin, deleteCategory);

module.exports = router;