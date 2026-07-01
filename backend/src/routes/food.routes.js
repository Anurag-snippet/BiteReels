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

// GET /api/food/ [protected for actions, public/optional for feed]
router.get('/', 
    authMiddleware.optionalAuthUserMiddleware, 
    foodController.getFoodItems);

// GET /api/food/partner/:id [accessible by both users and food partners]
router.get('/partner/:id',
    authMiddleware.authAnyMiddleware,
    foodController.getFoodPartnerProfile);

module.exports = router;