const { pool } = require('../config/db');

// ── Meals ─────────────────────────────────────────────────────────────────────

async function findByDate(userId, date) {
  const [meals] = await pool.query(
    `SELECT id, user_id, meal_date, meal_type, created_at
     FROM meals
     WHERE user_id = ? AND meal_date = ?
     ORDER BY FIELD(meal_type, 'breakfast', 'lunch', 'dinner', 'snack')`,
    [userId, date]
  );

  if (meals.length === 0) return meals;

  const mealIds = meals.map((m) => m.id);
  const [items] = await pool.query(
    `SELECT id, meal_id, name, quantity, unit, calories, protein, carbs, fat
     FROM meal_items WHERE meal_id IN (?)`,
    [mealIds]
  );

  const itemsByMeal = {};
  for (const item of items) {
    if (!itemsByMeal[item.meal_id]) itemsByMeal[item.meal_id] = [];
    itemsByMeal[item.meal_id].push(item);
  }

  return meals.map((m) => ({ ...m, items: itemsByMeal[m.id] || [] }));
}

async function findById(id) {
  const [rows] = await pool.query(
    'SELECT id, user_id, meal_date, meal_type FROM meals WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function createMeal({ userId, meal_date, meal_type }) {
  const [result] = await pool.query(
    'INSERT INTO meals (user_id, meal_date, meal_type) VALUES (?, ?, ?)',
    [userId, meal_date, meal_type]
  );
  const [rows] = await pool.query(
    'SELECT id, user_id, meal_date, meal_type, created_at FROM meals WHERE id = ?',
    [result.insertId]
  );
  return { ...rows[0], items: [] };
}

// ── Meal items ────────────────────────────────────────────────────────────────

async function findItemById(id) {
  const [rows] = await pool.query(
    'SELECT id, meal_id, name, quantity, unit, calories, protein, carbs, fat FROM meal_items WHERE id = ?',
    [id]
  );
  return rows[0] || null;
}

async function addItem(mealId, { name, quantity, unit, calories, protein, carbs, fat }) {
  const [result] = await pool.query(
    `INSERT INTO meal_items (meal_id, name, quantity, unit, calories, protein, carbs, fat)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [mealId, name, quantity ?? 1, unit ?? 'g', calories ?? 0, protein ?? 0, carbs ?? 0, fat ?? 0]
  );
  return findItemById(result.insertId);
}

const ITEM_FIELDS = ['name', 'quantity', 'unit', 'calories', 'protein', 'carbs', 'fat'];

async function updateItem(id, data) {
  const fields = Object.keys(data).filter((k) => ITEM_FIELDS.includes(k));
  if (fields.length === 0) return findItemById(id);

  const setClause = fields.map((k) => `${k} = ?`).join(', ');
  await pool.query(
    `UPDATE meal_items SET ${setClause} WHERE id = ?`,
    [...fields.map((k) => data[k]), id]
  );
  return findItemById(id);
}

async function removeItem(id) {
  await pool.query('DELETE FROM meal_items WHERE id = ?', [id]);
}

module.exports = { findByDate, findById, createMeal, findItemById, addItem, updateItem, removeItem };
