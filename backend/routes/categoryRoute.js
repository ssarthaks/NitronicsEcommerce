const express = require('express');
const {
  addCategory,
  removeCategory,
  viewAllCategories,
  addSubCategory,
  addChildCategory,
  removeSubCategory, 
  removeChildCategory 
} = require('../controllers/categoryController');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Category routes
router.post('/', adminMiddleware, addCategory); 
router.delete('/:id', adminMiddleware, removeCategory);
router.get('/', viewAllCategories);

// Subcategory routes
// Subcategory routes
router.post('/:categoryId/subcategory', adminMiddleware, addSubCategory);
router.delete('/:categoryId/subcategory/:subCategoryId', adminMiddleware, removeSubCategory);  // New route for removing subcategory

// Child category routes
router.post('/:categoryId/subcategory/:subCategoryId/childcategory', adminMiddleware, addChildCategory);
router.delete('/:categoryId/subcategory/:subCategoryId/childcategory/:childCategoryId', adminMiddleware, removeChildCategory);  // New route for removing child category

module.exports = router;
