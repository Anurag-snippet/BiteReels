const express = require('express');
const saveController = require('../controllers/save.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// POST /api/save/toggle/:foodId [protected]
router.post('/toggle/:foodId', 
    authMiddleware.authUserMiddleware, 
    saveController.toggleSave
);

// GET /api/save/items [protected]
router.get('/items', 
    authMiddleware.authUserMiddleware, 
    saveController.getSavedFoodItems
);

module.exports = router;
