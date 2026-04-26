const express = require('express');
const router = express.Router();
const recipesController  = require('../controllers/recipes.controller');
const commentsController = require('../controllers/comments.controller');
const ratingsController  = require('../controllers/ratings.controller');
const { authenticate, authenticateOptional } = require('../middleware/auth.middleware');

// GET    /api/recipes?search=...&category=...
router.get('/',            recipesController.getAll);

// GET    /api/recipes/categories
router.get('/categories',  recipesController.getCategories);

// GET    /api/recipes/:id
router.get('/:id',           recipesController.getById);

// GET    /api/recipes/:id/nutrition
router.get('/:id/nutrition', recipesController.getNutrition);

// POST   /api/recipes  (auth required)
router.post('/',    authenticate, recipesController.create);

// PUT    /api/recipes/:id  (auth + ownership enforced in service)
router.put('/:id',  authenticate, recipesController.update);

// DELETE /api/recipes/:id  (auth + ownership enforced in service)
router.delete('/:id', authenticate, recipesController.remove);

// GET  /api/recipes/:id/comments  (public)
router.get('/:id/comments',  commentsController.getForRecipe);

// POST /api/recipes/:id/comments  (auth required)
router.post('/:id/comments', authenticate, commentsController.addToRecipe);

// GET  /api/recipes/:id/ratings   (public, includes userScore if authenticated)
router.get('/:id/ratings',   authenticateOptional, ratingsController.getForRecipe);

// PUT  /api/recipes/:id/ratings   (auth required, upsert)
router.put('/:id/ratings',   authenticate, ratingsController.rate);

module.exports = router;
