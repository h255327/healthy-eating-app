'use strict';

const ratingsService = require('../services/ratings.service');

async function getForRecipe(req, res) {
  try {
    // req.user is set by authenticateOptional — may be undefined for public requests
    const callerId = req.user?.id ?? null;
    const data = await ratingsService.getForRecipe(Number(req.params.id), callerId);
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Failed to fetch ratings.' });
  }
}

async function rate(req, res) {
  try {
    const data = await ratingsService.rate(
      req.user.id,
      Number(req.params.id),
      req.body.score
    );
    res.json(data);
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Failed to submit rating.' });
  }
}

module.exports = { getForRecipe, rate };
