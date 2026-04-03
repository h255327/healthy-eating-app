// const { pool } = require('../config/db');

async function getList(userId) {
  // TODO: fetch the user's shopping list
}

async function generateFromMeals(userId) {
  // TODO: aggregate ingredients from the weekly meal plan
}

async function addItem(userId, data) {
  // TODO: insert a shopping list item
}

async function removeItem(id) {
  // TODO: delete a shopping list item
}

module.exports = { getList, generateFromMeals, addItem, removeItem };
