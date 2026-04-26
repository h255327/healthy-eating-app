const MealModel   = require('../models/meal.model');
const FoodModel   = require('../models/food.model');
const RecipeModel = require('../models/recipe.model');
const UserModel   = require('../models/user.model');
const { calculateRecipeNutrition } = require('../utils/recipeNutrition');
const { calculateProgress }        = require('../utils/progressCalculator');

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

async function addItemFromFood(mealId, userId, { food_id, quantity }) {
  const meal = await MealModel.findById(mealId);
  if (!meal)                  throw { status: 404, message: 'Meal not found.' };
  if (meal.user_id !== userId) throw { status: 403, message: 'Access denied.' };
  if (!food_id)               throw { status: 400, message: 'food_id is required.' };
  if (!quantity || quantity <= 0) throw { status: 400, message: 'quantity must be a positive number.' };

  const food = await FoodModel.findById(food_id);
  if (!food) throw { status: 404, message: 'Food not found.' };

  const ratio = quantity / 100;
  const round1 = (n) => Math.round(n * 10) / 10;

  return MealModel.addItem(mealId, {
    name:     food.name,
    quantity: quantity,
    unit:     food.default_unit,
    calories: round1(food.calories_per_100g * ratio),
    protein:  round1(food.protein_per_100g  * ratio),
    carbs:    round1(food.carbs_per_100g    * ratio),
    fat:      round1(food.fat_per_100g      * ratio),
  });
}

async function addItemFromRecipe(mealId, userId, { recipe_id, servings }) {
  const meal = await MealModel.findById(mealId);
  if (!meal)                   throw { status: 404, message: 'Meal not found.' };
  if (meal.user_id !== userId) throw { status: 403, message: 'Access denied.' };
  if (!recipe_id)              throw { status: 400, message: 'recipe_id is required.' };

  const qty = Math.max(0.1, Number(servings) || 1);

  const recipe = await RecipeModel.findById(recipe_id);
  if (!recipe) throw { status: 404, message: 'Recipe not found.' };

  const { perServing } = await calculateRecipeNutrition(recipe);
  const r1 = (n) => Math.round(n * qty * 10) / 10;

  return MealModel.addItem(mealId, {
    name:     recipe.title,
    quantity: qty,
    unit:     'serving',
    calories: r1(perServing.calories),
    protein:  r1(perServing.protein),
    carbs:    r1(perServing.carbs),
    fat:      r1(perServing.fat),
  });
}

const VALID_MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

async function logRecipeDirectly(userId, { recipe_id, meal_type, meal_date, servings }) {
  if (!recipe_id) throw { status: 400, message: 'recipe_id is required.' };
  if (!meal_type || !VALID_MEAL_TYPES.includes(meal_type))
    throw { status: 400, message: `meal_type must be one of: ${VALID_MEAL_TYPES.join(', ')}.` };

  const date = meal_date || new Date().toISOString().slice(0, 10);
  const qty  = Math.max(0.1, Number(servings) || 1);

  const recipe = await RecipeModel.findById(recipe_id);
  if (!recipe) throw { status: 404, message: 'Recipe not found.' };

  const { perServing } = await calculateRecipeNutrition(recipe);
  const r1 = (n) => Math.round(n * qty * 10) / 10;

  let meal = await MealModel.findByDateAndType(userId, date, meal_type);
  if (!meal) meal = await MealModel.createMeal({ userId, meal_date: date, meal_type });

  const item = await MealModel.addItem(meal.id, {
    name:     recipe.title,
    quantity: qty,
    unit:     'serving',
    calories: r1(perServing.calories),
    protein:  r1(perServing.protein),
    carbs:    r1(perServing.carbs),
    fat:      r1(perServing.fat),
  });

  return { meal_id: meal.id, meal_type, meal_date: date, item };
}

// ── Date helpers ──────────────────────────────────────────────────────────────
// All date math is UTC so timezone offset of the server doesn't matter.

function isoDateUTC(d) {
  const y  = d.getUTCFullYear();
  const m  = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function utcDaysAgo(n) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  return d;
}

// ── History / progress ────────────────────────────────────────────────────────

async function getHistory(userId, days) {
  const numDays = Math.max(1, Math.min(90, Number(days) || 7));

  const toDate   = isoDateUTC(new Date());
  const fromDate = isoDateUTC(utcDaysAgo(numDays - 1));

  const [user, rows] = await Promise.all([
    UserModel.findById(userId),
    MealModel.findDailyTotals(userId, fromDate, toDate),
  ]);

  if (!user) throw { status: 404, message: 'User not found.' };

  // Index DB rows by date string
  const rowMap = {};
  for (const row of rows) rowMap[row.date] = row;

  // Build a complete list for every date in the range, filling zeros for days
  // where the user logged nothing.
  const allDates = [];
  for (let i = 0; i < numDays; i++) {
    const d = isoDateUTC(utcDaysAgo(numDays - 1 - i));
    allDates.push({
      date:     d,
      calories: Number(rowMap[d]?.calories) || 0,
      protein:  Number(rowMap[d]?.protein)  || 0,
      carbs:    Number(rowMap[d]?.carbs)    || 0,
      fat:      Number(rowMap[d]?.fat)      || 0,
    });
  }

  const data = calculateProgress(user, allDates);

  return {
    goal:            user.goal           || null,
    calorie_target:  user.calorie_target || 0,
    starting_weight: user.weight         || null,
    days:            numDays,
    data,
  };
}

module.exports = { getByDate, getHistory, createMeal, addItem, addItemFromFood, addItemFromRecipe, logRecipeDirectly, updateItem, deleteItem };
