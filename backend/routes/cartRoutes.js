const express = require('express');
const router = express.Router();
const { addToCart,viewCart,removeItemFromCart } = require('../controllers/cartController');

router.post('/add-to-cart', addToCart);
router.get('/view-cart/:userId',viewCart)
router.delete('/remove-item/:cartItemId',removeItemFromCart )

module.exports = router;
