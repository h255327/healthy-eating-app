const mealsService = require('../services/meals.service');

async function getAll(req, res) {
  // TODO: return all meal logs for authenticated user
  res.json({ message: 'getAll meals – not implemented' });
}

async function getByDate(req, res) {
  // TODO: return meals for a specific date
  res.json({ message: 'getByDate meals – not implemented' });
}

async function create(req, res) {
  // TODO: log a new meal
  res.json({ message: 'create meal – not implemented' });
}

async function update(req, res) {
  // TODO: update a meal log entry
  res.json({ message: 'update meal – not implemented' });
}

async function remove(req, res) {
  // TODO: delete a meal log entry
  res.json({ message: 'remove meal – not implemented' });
}

module.exports = { getAll, getByDate, create, update, remove };
