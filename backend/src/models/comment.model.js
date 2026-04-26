'use strict';

const { pool } = require('../config/db');

const SELECT_WITH_USER = `
  c.id, c.user_id, c.recipe_id, c.article_id, c.content,
  DATE_FORMAT(c.created_at, '%Y-%m-%dT%T.000Z') AS created_at,
  u.username
`;

// Maps target type string to the FK column name in the comments table.
const COLUMN_FOR_TYPE = { recipe: 'recipe_id', article: 'article_id' };

async function findByTarget(targetType, targetId) {
  const col = COLUMN_FOR_TYPE[targetType];
  if (!col) throw new Error(`Unknown comment target type: ${targetType}`);
  const [rows] = await pool.query(
    `SELECT ${SELECT_WITH_USER}
     FROM comments c JOIN users u ON u.id = c.user_id
     WHERE c.${col} = ?
     ORDER BY c.created_at DESC`,
    [targetId]
  );
  return rows;
}

async function create({ userId, targetType, targetId, content }) {
  const recipeId  = targetType === 'recipe'  ? targetId : null;
  const articleId = targetType === 'article' ? targetId : null;
  const [result] = await pool.query(
    `INSERT INTO comments (user_id, recipe_id, article_id, content)
     VALUES (?, ?, ?, ?)`,
    [userId, recipeId, articleId, content]
  );
  const [rows] = await pool.query(
    `SELECT ${SELECT_WITH_USER}
     FROM comments c JOIN users u ON u.id = c.user_id
     WHERE c.id = ?`,
    [result.insertId]
  );
  return rows[0];
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, user_id, recipe_id, article_id FROM comments WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function removeById(id) {
  await pool.query('DELETE FROM comments WHERE id = ?', [id]);
}

module.exports = { findByTarget, create, findById, removeById };
