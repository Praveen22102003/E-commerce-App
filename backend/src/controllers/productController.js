const db = require('../config/db');

// Get all products
const getProducts = async (req, res) => {
  try {
    const [products] = await db.execute(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.status = 'active'
      ORDER BY p.created_at DESC
    `);

    res.json({
      success: true,
      data: products,
      total: products.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product
const getProduct = async (req, res) => {
  try {
    const [products] = await db.execute(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, data: products[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create product (admin)
const createProduct = async (req, res) => {
  try {
    const { category_id, name, description, price, sale_price, stock, sku } = req.body;

    if (!name || !price || !category_id) {
      return res.status(400).json({
        success: false,
        message: 'Name, price and category are required'
      });
    }

    const [result] = await db.execute(
      `INSERT INTO products 
       (category_id, name, description, price, sale_price, stock, sku) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [category_id, name, description || null, price, sale_price || null, stock || 0, sku || null]
    );

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { id: result.insertId, name, price }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update product (admin)
const updateProduct = async (req, res) => {
  try {
    const { category_id, name, description, price, sale_price, stock, status, sku } = req.body;

    await db.execute(
      `UPDATE products SET 
       category_id=?, name=?, description=?, price=?, 
       sale_price=?, stock=?, status=?, sku=? 
       WHERE id=?`,
      [category_id, name, description || null, price, sale_price || null, stock, status || 'active', sku || null, req.params.id]
    );

    res.json({ success: true, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete product (admin)
const deleteProduct = async (req, res) => {
  try {
    await db.execute('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };