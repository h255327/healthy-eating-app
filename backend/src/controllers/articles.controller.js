const articlesService = require('../services/articles.service');

async function getAll(_req, res) {
  try {
    const articles = await articlesService.getAll();
    return res.json({ articles });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch articles.' });
  }
}

async function getById(req, res) {
  try {
    const article = await articlesService.getById(Number(req.params.id));
    return res.json({ article });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Failed to fetch article.' });
  }
}

async function create(req, res) {
  try {
    const article = await articlesService.create(req.user.id, req.body);
    return res.status(201).json({ message: 'Article created.', article });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Failed to create article.' });
  }
}

async function update(req, res) {
  try {
    const article = await articlesService.update(Number(req.params.id), req.body);
    return res.json({ message: 'Article updated.', article });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Failed to update article.' });
  }
}

async function remove(req, res) {
  try {
    await articlesService.remove(Number(req.params.id));
    return res.json({ message: 'Article deleted.' });
  } catch (err) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message || 'Failed to delete article.' });
  }
}

module.exports = { getAll, getById, create, update, remove };
