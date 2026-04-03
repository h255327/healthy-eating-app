const shoppingService = require('../services/shopping.service');

async function getList(req, res) {
  // TODO: return the user's current shopping list
  res.json({ message: 'getList – not implemented' });
}

async function generateFromMeals(req, res) {
  // TODO: auto-generate shopping list from the weekly meal plan
  res.json({ message: 'generateFromMeals – not implemented' });
}

async function addItem(req, res) {
  // TODO: manually add an item to the shopping list
  res.json({ message: 'addItem – not implemented' });
}

async function removeItem(req, res) {
  // TODO: remove an item from the shopping list
  res.json({ message: 'removeItem – not implemented' });
}

module.exports = { getList, generateFromMeals, addItem, removeItem };
