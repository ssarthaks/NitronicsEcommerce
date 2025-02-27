const express = require('express');
const { adminLogin, verifyToken, refreshAdminToken } = require('../controllers/authController');

const router = express.Router();

router.post('/login', adminLogin);

router.get('/protected', verifyToken, (req, res) => {
  res.status(200).json({ message: 'This is a protected route!', admin: req.admin });
});

router.post('/refresh-token', refreshAdminToken);

module.exports = router;
