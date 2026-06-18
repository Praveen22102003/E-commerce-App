const db = require('../config/db');

// Dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [[{ totalOrders }]] = await db.execute(
      'SELECT COUNT(*) as totalOrders FROM orders'
    );
    const [[{ totalRevenue }]] = await db.execute(
      'SELECT COALESCE(SUM(final_amount), 0) as totalRevenue FROM orders WHERE status != "cancelled"'
    );
    const [[{ totalCustomers }]] = await db.execute(
      'SELECT COUNT(*) as totalCustomers FROM users WHERE role = "customer"'
    );
    const [[{ totalProducts }]] = await db.execute(
      'SELECT COUNT(*) as totalProducts FROM products WHERE status = "active"'
    );

    // Recent orders
    const [recentOrders] = await db.execute(
      `SELECT o.*, u.name as customer_name 
       FROM orders o 
       JOIN users u ON o.user_id = u.id 
       ORDER BY o.created_at DESC LIMIT 5`
    );

    // Sales by month (last 6 months)
    const [monthlySales] = await db.execute(
      `SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as total_orders,
        SUM(final_amount) as total_revenue
       FROM orders
       WHERE status != 'cancelled'
       AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY month ASC`
    );

    // Top products
    const [topProducts] = await db.execute(
      `SELECT p.name, SUM(oi.quantity) as total_sold,
              SUM(oi.total) as total_revenue
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       GROUP BY oi.product_id
       ORDER BY total_sold DESC LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        stats: { totalOrders, totalRevenue, totalCustomers, totalProducts },
        recentOrders,
        monthlySales,
        topProducts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders (admin)
const getAllOrders = async (req, res) => {
  try {
    const [orders] = await db.execute(
      `SELECT o.*, u.name as customer_name, u.email as customer_email
       FROM orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    await db.execute(
      'UPDATE orders SET status = ? WHERE id = ?',
      [status, req.params.id]
    );

    res.json({ success: true, message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all customers (admin)
const getAllCustomers = async (req, res) => {
  try {
    const [customers] = await db.execute(
      `SELECT id, name, email, phone, city, state, status, created_at
       FROM users WHERE role = 'customer'
       ORDER BY created_at DESC`
    );
    res.json({ success: true, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update customer status (admin)
const updateCustomerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await db.execute(
      'UPDATE users SET status = ? WHERE id = ? AND role = "customer"',
      [status, req.params.id]
    );
    res.json({ success: true, message: 'Customer status updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllCustomers,
  updateCustomerStatus
};