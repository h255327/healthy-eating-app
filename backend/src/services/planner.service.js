// const { pool } = require('../config/db');

async function getWeeklyPlan(userId, startDate) {
  // TODO: fetch 7-day plan starting from startDate
}

async function addMeal(userId, data) {
  // TODO: add a recipe to a planned day
}

async function removeMeal(id) {
  // TODO: remove a meal from the plan
}

module.exports = { getWeeklyPlan, addMeal, removeMeal };
