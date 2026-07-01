const express = require('express');
const authController = require('../controllers/auth.controller.js');

const router = express.Router();

// User routes
router.post('/user/register', authController.registerUser)
router.post('/user/login', authController.loginUser)
router.post('/user/logout', authController.logoutUser)

// Food Partner routes
router.post('/food-partner/register', authController.registerFoodPartner)
router.post('/food-partner/login', authController.loginFoodPartner)
router.post('/food-partner/logout', authController.logoutFoodPartner)

// Session check
router.get('/me', authController.getMe)

module.exports = router;   