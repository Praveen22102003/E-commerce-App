const db = require('../config/db');

// Get cart items
const getCart = async (req, res) => {
  try {
    const [items] = await db.execute(
      `SELECT c.id, c.quantity, c.product_id,
              p.name, p.price, p.sale_price, p.image, p.stock
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );

    const total = items.reduce((sum, item) => {
      const price = item.sale_price || item.price;
      return sum + (price * item.quantity);
    }, 0);

    res.json({ success: true, data: items, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add to cart
const addToCart = async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    // Check product exists
    const [products] = await db.execute(
      'SELECT * FROM products WHERE id = ? AND status = "active"', [product_id]
    );
    if (products.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check stock
    if (products[0].stock < quantity) {
      return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    // Add or update cart
    await db.execute(
      `INSERT INTO cart (user_id, product_id, quantity) 
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
      [req.user.id, product_id, quantity, quantity]
    );

    res.json({ success: true, message: 'Product added to cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update cart quantity
const updateCart = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    await db.execute(
      'UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, req.params.id, req.user.id]
    );

    res.json({ success: true, message: 'Cart updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from cart
const removeFromCart = async (req, res) => {
  try {
    await db.execute(
      'DELETE FROM cart WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    await db.execute('DELETE FROM cart WHERE user_id = ?', [req.user.id]);
    res.json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCart, addToCart, updateCart, removeFromCart, clearCart };