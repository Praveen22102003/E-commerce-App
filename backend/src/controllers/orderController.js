const db = require('../config/db');

// Create order
const createOrder = async (req, res) => {
  try {
    const {
      shipping_name, shipping_phone, shipping_address,
      shipping_city, shipping_state, shipping_pincode,
      payment_method = 'cod', notes
    } = req.body;

    if (!shipping_name || !shipping_phone || !shipping_address) {
      return res.status(400).json({
        success: false,
        message: 'Shipping details are required'
      });
    }

    // Get cart items
    const [cartItems] = await db.execute(
      `SELECT c.*, p.price, p.sale_price, p.stock, p.name
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.id]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Calculate total
    let totalAmount = 0;
    for (const item of cartItems) {
      const price = item.sale_price || item.price;
      totalAmount += price * item.quantity;
    }

    const shippingAmount = totalAmount > 500 ? 0 : 50;
    const finalAmount = totalAmount + shippingAmount;

    // Create order
    const [orderResult] = await db.execute(
      `INSERT INTO orders 
       (user_id, total_amount, shipping_amount, final_amount,
        payment_method, shipping_name, shipping_phone,
        shipping_address, shipping_city, shipping_state,
        shipping_pincode, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, totalAmount, shippingAmount, finalAmount,
       payment_method, shipping_name, shipping_phone,
       shipping_address, shipping_city, shipping_state,
       shipping_pincode, notes || null]
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of cartItems) {
      const price = item.sale_price || item.price;
      const total = price * item.quantity;
      await db.execute(
        `INSERT INTO order_items (order_id, product_id, quantity, price, total)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, price, total]
      );

      // Update stock
      await db.execute(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Clear cart
    await db.execute('DELETE FROM cart WHERE user_id = ?', [req.user.id]);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        order_id: orderId,
        total_amount: totalAmount,
        shipping_amount: shippingAmount,
        final_amount: finalAmount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get my orders
const getMyOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(
      `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single order
const getOrder = async (req, res) => {
  try {
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const [items] = await db.execute(
      `SELECT oi.*, p.name, p.image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({
      success: true,
      data: { ...orders[0], items }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orders[0].status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Only pending orders can be cancelled'
      });
    }

    await db.execute(
      'UPDATE orders SET status = "cancelled" WHERE id = ?',
      [req.params.id]
    );

    res.json({ success: true, message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrder, cancelOrder };