const recommendationsService = require('../services/recommendations.service');

async function getRecommendations(req, res) {
  // TODO: return recipe recommendations based on user's diet type and history
  res.json({ message: 'getRecommendations – not implemented' });
}

module.exports = { getRecommendations };
