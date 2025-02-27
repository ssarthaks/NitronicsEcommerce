const { Product } = require('../models');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { Op } = require('sequelize');
const fs = require('fs').promises; // Use promise-based fs methods for easier async handling

// Upload product and images
exports.uploadProduct = async (req, res) => {
  const { name, description, price, category, subCategory, childCategory } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Name is required.' });
  }

  const files = req.files?.images;
  if (!files || (Array.isArray(files) && files.length === 0)) {
    return res.status(400).json({ message: 'At least one image is required.' });
  }

  const images = Array.isArray(files) ? files : [files];
  const productId = uuidv4(); // Generate UUID for the product
  const productDir = path.join(__dirname, '../uploads/products', productId); // Create directory path

  try {
    // Create the directory for the product images
    await fs.mkdir(productDir, { recursive: true });

    const imagePaths = await Promise.all(
      images.map(async (file) => {
        const extension = path.extname(file.name);
        const imagePath = path.join(productDir, `${uuidv4()}${extension}`); // Store images inside the product folder

        // Move the file
        await file.mv(imagePath);

        return `/api/images/products/${productId}/${path.basename(imagePath)}`; // Update image path for the response
      })
    );

    // Create product in the database
    const newProduct = await Product.create({
      id: productId,
      name,
      description: description || '',
      price: price ? parseFloat(price) : null,
      category,
      subCategory,
      childCategory,
      images: imagePaths,
      isFeatured: req.body.isFeatured || false,
    });

    res.status(201).json({
      message: 'Product uploaded successfully!',
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload product.', error });
  }
};

// View all products
exports.viewAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products.', error });
  }
};

// View a single product by ID
exports.viewProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product.', error });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const productDir = path.join(__dirname, '../uploads/products', product.id); // Use product's UUID to find folder

    // First, delete the product from the database
    await product.destroy();

    // Then, remove the directory and its contents
    try {
      await fs.rm(productDir, { recursive: true, force: true });
    } catch (err) {
      console.error(`Failed to delete product images: ${productDir}`, err);
      return res.status(500).json({ message: 'Failed to delete product images.', error: err });
    }

    res.status(200).json({ message: 'Product deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product.', error });
  }
};

// Feature/Unfeature a product
exports.featureProducts = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    const updatedStatus = !product.isFeatured;
    await product.update({ isFeatured: updatedStatus });

    res.status(200).json({
      message: `Product ${updatedStatus ? 'featured' : 'unfeatured'} successfully!`,
      product,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle product feature status.', error });
  }
};

exports.searchProducts = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: 'Name query parameter is required' });
  }

  try {
    const products = await Product.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
    });

    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({ message: 'No products found' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error searching for products' });
  }
};
