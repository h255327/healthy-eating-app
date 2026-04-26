const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments.controller');
const { authenticate } = require('../middleware/auth.middleware');

// DELETE /api/comments/:id  — own comment or admin
router.delete('/:id', authenticate, commentsController.remove);

module.exports = router;
