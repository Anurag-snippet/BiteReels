const express = require('express');
const commentController = require('../controllers/comment.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// POST /api/comment/:foodId [protected]
router.post('/:foodId', 
    authMiddleware.authUserMiddleware, 
    commentController.addComment
);

// GET /api/comment/:foodId [protected]
router.get('/:foodId', 
    authMiddleware.authUserMiddleware, 
    commentController.getComments
);

module.exports = router;
