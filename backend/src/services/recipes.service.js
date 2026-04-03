// const { pool } = require('../config/db');

async function getAll(filters) {
  // TODO: query recipes with optional diet_type / search filters
}

async function getById(id) {
  // TODO: fetch recipe + ingredients by id
}

async function create(userId, data) {
  // TODO: insert recipe and its ingredients
}

async function update(id, data) {
  // TODO: update recipe fields
}

async function remove(id) {
  // TODO: delete recipe
}

module.exports = { getAll, getById, create, update, remove };
