'use strict';

const RatingModel = require('../models/rating.model');

async function getForRecipe(recipeId, callerId) {
  return RatingModel.getSummary(recipeId, callerId);
}

async function rate(userId, recipeId, score) {
  const s = Number(score);
  if (!Number.isInteger(s) || s < 1 || s > 5)
    throw { status: 400, message: 'Score must be an integer between 1 and 5.' };
  await RatingModel.upsert(userId, recipeId, s);
  return RatingModel.getSummary(recipeId, userId);
}

module.exports = { getForRecipe, rate };
