const express = require('express');
const router = express.Router();
const plannerController = require('../controllers/planner.controller');

// GET    /api/planner/week/:date
router.get('/week/:date', plannerController.getWeeklyPlan);

// POST   /api/planner
router.post('/',          plannerController.addMeal);

// DELETE /api/planner/:id
router.delete('/:id',     plannerController.removeMeal);

module.exports = router;
