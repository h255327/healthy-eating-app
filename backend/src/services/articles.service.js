// const { pool } = require('../config/db');

async function getAll() {
  // TODO: query all articles
}

async function getById(id) {
  // TODO: fetch article + comments by id
}

async function create(userId, data) {
  // TODO: insert article
}

async function update(id, data) {
  // TODO: update article
}

async function remove(id) {
  // TODO: delete article
}

module.exports = { getAll, getById, create, update, remove };
