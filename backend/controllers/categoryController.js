const { Category, SubCategory, ChildCategory } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Add Category
const addCategory = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Category name is required.' });
  }

  try {
    const newCategory = await Category.create({
      id: uuidv4(),
      name
    });

    res.status(201).json({
      message: 'Category added successfully!',
      category: newCategory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding category', error: error.message });
  }
};

// Add SubCategory
const addSubCategory = async (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Subcategory name is required.' });
  }

  try {
    const category = await Category.findByPk(categoryId);

    if (!category) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    const newSubCategory = await SubCategory.create({
      id: uuidv4(),
      name,
      categoryId: category.id
    });

    res.status(201).json({
      message: 'Subcategory added successfully!',
      subCategory: newSubCategory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding subcategory', error: error.message });
  }
};

// Add Child Category
const addChildCategory = async (req, res) => {
  const { categoryId, subCategoryId } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Child category name is required.' });
  }

  try {
    const subCategory = await SubCategory.findOne({
      where: { id: subCategoryId, categoryId }
    });

    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found.' });
    }

    const newChildCategory = await ChildCategory.create({
      id: uuidv4(),
      name,
      subCategoryId: subCategory.id
    });

    res.status(201).json({
      message: 'Child category added successfully!',
      childCategory: newChildCategory,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding child category', error: error.message });
  }
};

// Remove Category
const removeCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Category.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).json({ message: 'Category not found.' });
    }

    res.status(200).json({ message: 'Category removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing category', error: error.message });
  }
};

// Remove SubCategory
const removeSubCategory = async (req, res) => {
  const { categoryId, subCategoryId } = req.params;

  try {
    const subCategory = await SubCategory.findOne({
      where: { id: subCategoryId, categoryId }
    });

    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found.' });
    }

    await SubCategory.destroy({ where: { id: subCategoryId } });

    res.status(200).json({ message: 'Subcategory removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing subcategory', error: error.message });
  }
};

// Remove Child Category
const removeChildCategory = async (req, res) => {
  const { subCategoryId, childCategoryId } = req.params;

  try {
    const childCategory = await ChildCategory.findOne({
      where: { id: childCategoryId, subCategoryId }
    });

    if (!childCategory) {
      return res.status(404).json({ message: 'Child category not found.' });
    }

    await ChildCategory.destroy({ where: { id: childCategoryId } });

    res.status(200).json({ message: 'Child category removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing child category', error: error.message });
  }
};

const viewAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: {
        model: SubCategory,
        as: 'subCategories',
        include: {
          model: ChildCategory,
          as: 'childCategories'
        }
      }
    });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving categories', error: error.message });
  }
};

module.exports = {
  addCategory,
  addSubCategory,
  addChildCategory,
  removeCategory,
  removeSubCategory,
  removeChildCategory,
  viewAllCategories,
};
