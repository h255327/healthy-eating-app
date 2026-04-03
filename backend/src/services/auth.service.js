// TODO: import pool from config/db when implementing queries
// const { pool } = require('../config/db');

async function register(data) {
  // TODO: hash password, insert user into DB, return created user
}

async function login(credentials) {
  // TODO: find user by email, verify password, return signed JWT
}

module.exports = { register, login };
