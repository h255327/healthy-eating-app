const MealModel = require('../models/meal.model');

function calcTotals(meals) {
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  for (const meal of meals) {
    for (const item of meal.items) {
      totals.calories += Number(item.calories);
      totals.protein  += Number(item.protein);
      totals.carbs    += Number(item.carbs);
      totals.fat      += Number(item.fat);
    }
  }
  for (const key of Object.keys(totals)) {
    totals[key] = Math.round(totals[key] * 100) / 100;
  }
  return totals;
}

async function getByDate(userId, date) {
  if (!date) throw { status: 400, message: 'date query parameter is required (YYYY-MM-DD).' };
  const meals = await MealModel.findByDate(userId, date);
  return { date, meals, totals: calcTotals(meals) };
}

async function createMeal(userId, { meal_date, meal_type }) {
  if (!meal_date) throw { status: 400, message: 'meal_date is required.' };
  if (!meal_type) throw { status: 400, message: 'meal_type is required.' };
  return MealModel.createMeal({ userId, meal_date, meal_type });
}

async function addItem(mealId, userId, data) {
  const meal = await MealModel.findById(mealId);
  if (!meal)                  throw { status: 404, message: 'Meal not found.' };
  if (meal.user_id !== userId) throw { status: 403, message: 'Access denied.' };
  if (!data.name)             throw { status: 400, message: 'name is required.' };
  return MealModel.addItem(mealId, data);
}

async function updateItem(mealId, itemId, userId, data) {
  const meal = await MealModel.findById(mealId);
  if (!meal)                  throw { status: 404, message: 'Meal not found.' };
  if (meal.user_id !== userId) throw { status: 403, message: 'Access denied.' };

  const item = await MealModel.findItemById(itemId);
  if (!item || item.meal_id !== mealId) throw { status: 404, message: 'Item not found.' };

  return MealModel.updateItem(itemId, data);
}

async function deleteItem(mealId, itemId, userId) {
  const meal = await MealModel.findById(mealId);
  if (!meal)                  throw { status: 404, message: 'Meal not found.' };
  if (meal.user_id !== userId) throw { status: 403, message: 'Access denied.' };

  const item = await MealModel.findItemById(itemId);
  if (!item || item.meal_id !== mealId) throw { status: 404, message: 'Item not found.' };

  await MealModel.removeItem(itemId);
}

module.exports = { getByDate, createMeal, addItem, updateItem, deleteItem };
