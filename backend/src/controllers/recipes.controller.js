const recipesService = require('../services/recipes.service');

async function getAll(req, res) {
  try {
    const { search, category } = req.query;
    const recipes = await recipesService.getAll({ search, category });
    return res.json({ recipes });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch recipes.' });
  }
}

async function getCategories(_req, res) {
  try {
    const categories = await recipesService.getCategories();
    return res.json({ categories });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch categories.' });
  }
}

async function getById(req, res) {
  try {
    const recipe = await recipesService.getById(Number(req.params.id));
    return res.json({ recipe });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Failed to fetch recipe.' });
  }
}

async function create(req, res) {
  try {
    const recipe = await recipesService.create(req.user.id, req.body);
    return res.status(201).json({ message: 'Recipe created.', recipe });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Failed to create recipe.' });
  }
}

async function update(req, res) {
  try {
    const recipe = await recipesService.update(Number(req.params.id), req.user.id, req.body);
    return res.json({ message: 'Recipe updated.', recipe });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Failed to update recipe.' });
  }
}

async function remove(req, res) {
  try {
    await recipesService.remove(Number(req.params.id), req.user.id);
    return res.json({ message: 'Recipe deleted.' });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Failed to delete recipe.' });
  }
}

async function getNutrition(req, res) {
  try {
    const result = await recipesService.getNutrition(Number(req.params.id));
    return res.json(result);
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Failed to calculate nutrition.' });
  }
}

module.exports = { getAll, getCategories, getById, getNutrition, create, update, remove };
