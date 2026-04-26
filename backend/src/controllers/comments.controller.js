'use strict';

const commentsService = require('../services/comments.service');

function makeHandlers(targetType) {
  return {
    getComments: async (req, res) => {
      try {
        const comments = await commentsService.getComments(targetType, Number(req.params.id));
        res.json({ comments });
      } catch (err) {
        res.status(err.status || 500).json({ error: err.message || 'Failed to fetch comments.' });
      }
    },
    addComment: async (req, res) => {
      try {
        const comment = await commentsService.addComment(
          req.user.id, targetType, Number(req.params.id), req.body.content
        );
        res.status(201).json({ comment });
      } catch (err) {
        res.status(err.status || 500).json({ error: err.message || 'Failed to add comment.' });
      }
    },
  };
}

const recipe  = makeHandlers('recipe');
const article = makeHandlers('article');

async function remove(req, res) {
  try {
    await commentsService.remove(Number(req.params.id), req.user.id, req.user.role);
    res.json({ message: 'Comment deleted.' });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Failed to delete comment.' });
  }
}

// Named exports match existing route imports — no route files need to change.
module.exports = {
  getForRecipe:  recipe.getComments,
  addToRecipe:   recipe.addComment,
  getForArticle: article.getComments,
  addToArticle:  article.addComment,
  remove,
};
