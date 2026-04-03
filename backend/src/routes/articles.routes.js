const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articles.controller');

// GET    /api/articles
router.get('/',     articlesController.getAll);

// GET    /api/articles/:id
router.get('/:id',  articlesController.getById);

// POST   /api/articles
router.post('/',    articlesController.create);

// PUT    /api/articles/:id
router.put('/:id',  articlesController.update);

// DELETE /api/articles/:id
router.delete('/:id', articlesController.remove);

module.exports = router;
