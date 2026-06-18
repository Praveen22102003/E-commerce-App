const db = require('../config/db');

// Get all categories
const getCategories = async (req, res) => {
  try {
    const [categories] = await db.execute(
      'SELECT * FROM categories WHERE status = "active" ORDER BY name'
    );
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single category
const getCategory = async (req, res) => {
  try {
    const [categories] = await db.execute(
      'SELECT * FROM categories WHERE id = ?', [req.params.id]
    );
    if (categories.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: categories[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create category (admin)
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    const [result] = await db.execute(
      'INSERT INTO categories (name, description) VALUES (?, ?)',
      [name, description || null]
    );
    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: { id: result.insertId, name, description }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update category (admin)
const updateCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    await db.execute(
      'UPDATE categories SET name=?, description=?, status=? WHERE id=?',
      [name, description, status, req.params.id]
    );
    res.json({ success: true, message: 'Category updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete category (admin)
const deleteCategory = async (req, res) => {
  try {
    await db.execute('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };