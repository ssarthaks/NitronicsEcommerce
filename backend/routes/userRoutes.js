const express = require('express');
const { register, login, refreshToken,viewAllUsers,viewUserById, verifyOtp, sendOtp } = require('../controllers/userController');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token',refreshToken );

router.post('/send-otp', sendOtp)

router.post('/verify-otp',verifyOtp )

router.get('/allUsers', adminMiddleware, viewAllUsers); 
router.get('/findUser/:id', viewUserById); 

module.exports = router;
