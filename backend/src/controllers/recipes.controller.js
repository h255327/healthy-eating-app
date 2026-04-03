const recipesService = require('../services/recipes.service');

async function getAll(req, res) {
  // TODO: return paginated list of recipes
  res.json({ message: 'getAll recipes – not implemented' });
}

async function getById(req, res) {
  // TODO: return single recipe by id
  res.json({ message: 'getById recipe – not implemented' });
}

async function create(req, res) {
  // TODO: create new recipe for authenticated user
  res.json({ message: 'create recipe – not implemented' });
}

async function update(req, res) {
  // TODO: update recipe by id
  res.json({ message: 'update recipe – not implemented' });
}

async function remove(req, res) {
  // TODO: delete recipe by id
  res.json({ message: 'remove recipe – not implemented' });
}

module.exports = { getAll, getById, create, update, remove };
