// const { pool } = require('../config/db');

async function getAll(userId) {
  // TODO: query all meal logs for the user
}

async function getByDate(userId, date) {
  // TODO: query meals for a specific date
}

async function create(userId, data) {
  // TODO: insert meal log entry
}

async function update(id, data) {
  // TODO: update meal log entry
}

async function remove(id) {
  // TODO: delete meal log entry
}

module.exports = { getAll, getByDate, create, update, remove };
