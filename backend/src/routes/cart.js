const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCart, removeFromCart, clearCart } = require('../controllers/cartController');
const { verifyToken } = require('../middleware/auth');

// All cart routes need login
router.use(verifyToken);

router.get('/',           getCart);
router.post('/',          addToCart);
router.put('/:id',        updateCart);
router.delete('/clear',   clearCart);
router.delete('/:id',     removeFromCart);

module.exports = router;