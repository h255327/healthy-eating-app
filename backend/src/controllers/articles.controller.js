const articlesService = require('../services/articles.service');

async function getAll(req, res) {
  // TODO: return list of articles
  res.json({ message: 'getAll articles – not implemented' });
}

async function getById(req, res) {
  // TODO: return single article by id
  res.json({ message: 'getById article – not implemented' });
}

async function create(req, res) {
  // TODO: create new article
  res.json({ message: 'create article – not implemented' });
}

async function update(req, res) {
  // TODO: update article by id
  res.json({ message: 'update article – not implemented' });
}

async function remove(req, res) {
  // TODO: delete article by id
  res.json({ message: 'remove article – not implemented' });
}

module.exports = { getAll, getById, create, update, remove };
