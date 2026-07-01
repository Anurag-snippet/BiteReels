const express = require('express');
const likesController = require('../controllers/likes.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// POST /api/likes/toggle/:foodId [protected]
router.post('/toggle/:foodId', 
    authMiddleware.authUserMiddleware, 
    likesController.toggleLike
);

module.exports = router;
