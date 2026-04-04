const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articles.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const adminOnly = [authenticate, authorize('admin')];

// GET    /api/articles          (public)
router.get('/',     articlesController.getAll);

// GET    /api/articles/:id      (public)
router.get('/:id',  articlesController.getById);

// POST   /api/articles          (admin only)
router.post('/',    ...adminOnly, articlesController.create);

// PUT    /api/articles/:id      (admin only)
router.put('/:id',  ...adminOnly, articlesController.update);

// DELETE /api/articles/:id      (admin only)
router.delete('/:id', ...adminOnly, articlesController.remove);

module.exports = router;
