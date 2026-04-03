const express = require('express');
const router = express.Router();
const mealsController = require('../controllers/meals.controller');

// GET    /api/meals
router.get('/',       mealsController.getAll);

// GET    /api/meals/date/:date
router.get('/date/:date', mealsController.getByDate);

// POST   /api/meals
router.post('/',      mealsController.create);

// PUT    /api/meals/:id
router.put('/:id',    mealsController.update);

// DELETE /api/meals/:id
router.delete('/:id', mealsController.remove);

module.exports = router;
