const ArticleModel = require('../models/article.model');

async function getAll() {
  return ArticleModel.findAll();
}

async function getById(id) {
  const article = await ArticleModel.findById(id);
  if (!article) throw { status: 404, message: 'Article not found.' };
  return article;
}

async function create(userId, data) {
  if (!data.title)   throw { status: 400, message: 'title is required.' };
  if (!data.content) throw { status: 400, message: 'content is required.' };
  return ArticleModel.create({ userId, ...data });
}

async function update(id, data) {
  const article = await ArticleModel.findById(id);
  if (!article) throw { status: 404, message: 'Article not found.' };
  return ArticleModel.updateById(id, data);
}

async function remove(id) {
  const article = await ArticleModel.findById(id);
  if (!article) throw { status: 404, message: 'Article not found.' };
  await ArticleModel.removeById(id);
}

module.exports = { getAll, getById, create, update, remove };
