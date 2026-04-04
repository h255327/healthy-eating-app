const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipes.controller');
const { authenticate } = require('../middleware/auth.middleware');

// GET    /api/recipes?search=...&category=...
router.get('/',            recipesController.getAll);

// GET    /api/recipes/categories
router.get('/categories',  recipesController.getCategories);

// GET    /api/recipes/:id
router.get('/:id',         recipesController.getById);

// POST   /api/recipes  (auth required)
router.post('/',    authenticate, recipesController.create);

// PUT    /api/recipes/:id  (auth + ownership enforced in service)
router.put('/:id',  authenticate, recipesController.update);

// DELETE /api/recipes/:id  (auth + ownership enforced in service)
router.delete('/:id', authenticate, recipesController.remove);

module.exports = router;
