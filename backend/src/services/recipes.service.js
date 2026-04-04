const RecipeModel = require('../models/recipe.model');

async function getAll(filters) {
  return RecipeModel.findAll(filters);
}

async function getCategories() {
  return RecipeModel.findAllCategories();
}

async function getById(id) {
  const recipe = await RecipeModel.findById(id);
  if (!recipe) throw { status: 404, message: 'Recipe not found.' };
  return recipe;
}

async function create(userId, data) {
  if (!data.title) throw { status: 400, message: 'title is required.' };
  return RecipeModel.create({ userId, ...data });
}

async function update(id, userId, data) {
  const recipe = await RecipeModel.findById(id);
  if (!recipe) throw { status: 404, message: 'Recipe not found.' };
  if (recipe.user_id !== userId) throw { status: 403, message: 'Access denied.' };
  return RecipeModel.updateById(id, data);
}

async function remove(id, userId) {
  const recipe = await RecipeModel.findById(id);
  if (!recipe) throw { status: 404, message: 'Recipe not found.' };
  if (recipe.user_id !== userId) throw { status: 403, message: 'Access denied.' };
  await RecipeModel.removeById(id);
}

module.exports = { getAll, getCategories, getById, create, update, remove };
