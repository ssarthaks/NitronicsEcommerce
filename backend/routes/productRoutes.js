const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/', adminMiddleware, productController.uploadProduct); 

router.get('/', productController.viewAllProducts);

router.get('/search', productController.searchProducts)

router.get('/:id', productController.viewProduct);

router.delete('/:id', adminMiddleware, productController.deleteProduct);

router.put('/:id/feature',adminMiddleware, productController.featureProducts)

module.exports = router;