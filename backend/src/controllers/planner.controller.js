const plannerService = require('../services/planner.service');

async function getWeeklyPlan(req, res) {
  // TODO: return the week's meal plan starting from :date
  res.json({ message: 'getWeeklyPlan – not implemented' });
}

async function addMeal(req, res) {
  // TODO: add a recipe to the plan for a given day
  res.json({ message: 'addMeal – not implemented' });
}

async function removeMeal(req, res) {
  // TODO: remove a meal from the plan
  res.json({ message: 'removeMeal – not implemented' });
}

module.exports = { getWeeklyPlan, addMeal, removeMeal };
