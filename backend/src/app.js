const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ── Middleware ──────────────────────────────
app.use(cors({
  origin: [
    process.env.CUSTOMER_URL,
    process.env.ADMIN_URL
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static Files (for uploaded images) ─────
app.use('/uploads', express.static('uploads'));

// ── Health Check Route ──────────────────────
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'eCommerce API is running!',
    version: '1.0.0'
  });
});

// ── API Routes (we will add these next) ─────
app.use('/api/auth',       require('./routes/auth'));
 app.use('/api/products',   require('./routes/products'));
 app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart',       require('./routes/cart'));
app.use('/api/orders',     require('./routes/orders'));
 app.use('/api/admin',      require('./routes/admin'));

// ── 404 Handler ─────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// ── Error Handler ────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

module.exports = app;