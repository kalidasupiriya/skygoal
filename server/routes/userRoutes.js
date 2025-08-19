const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const rateLimiter = require('../middleware/rateLimiter');
const authMiddleware = require('../middleware/authMiddleware');
// Route to register a new user
router.post('/register', rateLimiter, userController.registerUser);
router.post('/login', rateLimiter, userController.loginUser);
router.get('/profile', authMiddleware, rateLimiter, userController.getProfile);
router.post('/logout', userController.logoutUser);
router.post('/update-password', authMiddleware, userController.updatePassword);
router.post('/reset-password', userController.resetPassword);

module.exports = router;