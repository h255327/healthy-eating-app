'use strict';

const { pool } = require('../config/db');

async function upsert(userId, recipeId, score) {
  await pool.query(
    `INSERT INTO ratings (user_id, recipe_id, score) VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE score = VALUES(score)`,
    [userId, recipeId, score]
  );
}

async function getSummary(recipeId, callerId) {
  const [[row]] = await pool.query(
    `SELECT COUNT(*) AS count, ROUND(AVG(score), 1) AS average
     FROM ratings WHERE recipe_id = ?`,
    [recipeId]
  );

  let userScore = null;
  if (callerId) {
    const [[r]] = await pool.query(
      'SELECT score FROM ratings WHERE user_id = ? AND recipe_id = ?',
      [callerId, recipeId]
    );
    userScore = r?.score ?? null;
  }

  return {
    average:   row.count > 0 ? Number(row.average) : null,
    count:     Number(row.count),
    userScore,
  };
}

module.exports = { upsert, getSummary };
