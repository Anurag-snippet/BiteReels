const express = require('express');
const foodController = require('../controllers/food.controller.js');
const authMiddleware = require('../middlewares/auth.middleware.js');
const router = express.Router();
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
})

// POST /api/food/ [protected]
router.post('/', 
    authMiddleware.authFoodPartnerMiddleware,
    upload.single('video'), 
    foodController.createFood);

// GET /api/food/ [protected]
router.get('/', 
    authMiddleware.authUserMiddleware, 
    foodController.getFoodItems);

// GET /api/food/partner/:id [protected]
router.get('/partner/:id',
    authMiddleware.authUserMiddleware,
    foodController.getFoodPartnerProfile);

module.exports = router;