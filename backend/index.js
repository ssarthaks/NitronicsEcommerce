const express = require('express');
const path = require('path');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const helmet = require('helmet');
const morgan = require('morgan');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoute');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes')
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes')
require('dotenv').config();
const PORT = process.env.PORT || 5558;

const app = express();

app.use(helmet()); 
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use('/uploads', express.static('uploads'));
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use('/api/images', express.static(path.join(__dirname, 'uploads')));

app.use(morgan('combined')); 

app.use('/api/admin', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/users', userRoutes)
app.use('/api/cart',cartRoutes)
app.use('/api/orders', orderRoutes)

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
