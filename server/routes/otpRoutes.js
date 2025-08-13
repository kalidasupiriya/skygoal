const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');
const rateLimiter = require('../middleware/rateLimiter');
// Route to request OTP
router.post('/request-otp', rateLimiter, otpController.sendOtp);
// Route to verify OTP
router.post('/verify-otp', rateLimiter, otpController.verifyOtp);
module.exports = router;