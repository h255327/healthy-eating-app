const express = require('express');
const router = express.Router();
const recipesController = require('../controllers/recipes.controller');

// GET    /api/recipes
router.get('/',     recipesController.getAll);

// GET    /api/recipes/:id
router.get('/:id',  recipesController.getById);

// POST   /api/recipes
router.post('/',    recipesController.create);

// PUT    /api/recipes/:id
router.put('/:id',  recipesController.update);

// DELETE /api/recipes/:id
router.delete('/:id', recipesController.remove);

module.exports = router;
