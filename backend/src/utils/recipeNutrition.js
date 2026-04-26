'use strict';

const { pool } = require('../config/db');

// ── Unit → grams conversion table ─────────────────────────────────────────────
const UNIT_TO_G = {
  g: 1, kg: 1000,
  ml: 1, l: 1000,          // treat ml as g (close enough for water-based liquids)
  tbsp: 15, tsp: 5,
  cup: 240, cups: 240,
  oz: 28.35, lb: 453.6, lbs: 453.6,
};

// Descriptors to remove before searching the food DB
const STRIP_RE = /\b(ripe|large|small|medium|fresh|frozen|raw|cooked|drained|rinsed|canned|tinned|baby|whole|boneless|skinless|shredded|chopped|diced|sliced|minced|grated|cubed|peeled|pitted|toasted|dried|crushed|plain|unsalted|salted|organic|low-fat|lean|halved|quartered|florets|chunks|pieces|fillet|fillets|breast|thighs?|bone-in|shelled|torn|crumbled|mixed|washed|coarsely|finely)\b/gi;

// ── Ingredient string parser ───────────────────────────────────────────────────
// Returns { qty: number_in_grams, raw: ingredient_name_string }
// qty === 0 means the quantity could not be determined (skip from calculation).

function parseIngredient(str) {
  str = String(str).trim();

  // Remove trailing "to serve / taste / garnish / top"
  str = str.replace(/\s+to\s+(serve|taste|top|garnish).*/i, '').trim();
  // Remove "(optional)"
  str = str.replace(/\(optional\).*/gi, '').trim();

  // Pattern 1: "300g chicken" or "400ml coconut milk"  (digit+unit glued together)
  let m = str.match(/^(\d+(?:\.\d+)?)\s*(g|kg|ml|l)\s+(.+)/i);
  if (m) {
    const qty = parseFloat(m[1]) * (UNIT_TO_G[m[2].toLowerCase()] ?? 1);
    return { qty, raw: m[3] };
  }

  // Pattern 2: "2 tbsp olive oil" or "1 cup oats"  (digit space word-unit name)
  m = str.match(/^(\d+(?:\.\d+)?)\s+(tbsp|tsp|cups?|oz|lbs?|g|kg|ml|l)\s+(.+)/i);
  if (m) {
    const qty = parseFloat(m[1]) * (UNIT_TO_G[m[2].toLowerCase()] ?? 1);
    return { qty, raw: m[3] };
  }

  // No recognised unit — count items ("2 salmon fillets") can't be converted to grams reliably
  return { qty: 0, raw: str };
}

// ── Name cleaner ──────────────────────────────────────────────────────────────

function cleanName(raw) {
  let name = raw.toLowerCase();
  name = name.split(',')[0];           // "chicken thighs, bone-in" → "chicken thighs"
  name = name.replace(STRIP_RE, '');  // remove descriptors
  name = name.replace(/[^a-z\s]/g, '') // remove punctuation
             .replace(/\s+/g, ' ')
             .trim();
  return name;
}

// ── Single food lookup ────────────────────────────────────────────────────────

async function findFood(rawName) {
  const name = cleanName(rawName);
  if (!name) return null;

  const words = name.split(/\s+/).filter((w) => w.length > 2);
  if (!words.length) return null;

  // 1. Full cleaned name substring — prefer shorter food names (more specific match)
  const [r1] = await pool.query(
    'SELECT * FROM foods WHERE LOWER(name) LIKE ? ORDER BY LENGTH(name) ASC LIMIT 1',
    [`%${name}%`]
  );
  if (r1[0]) return r1[0];

  // 2. First two words together
  if (words.length >= 2) {
    const twoWords = words.slice(0, 2).join(' ');
    const [r2] = await pool.query(
      'SELECT * FROM foods WHERE LOWER(name) LIKE ? ORDER BY LENGTH(name) ASC LIMIT 1',
      [`%${twoWords}%`]
    );
    if (r2[0]) return r2[0];
  }

  // 3. First word only
  const [r3] = await pool.query(
    'SELECT * FROM foods WHERE LOWER(name) LIKE ? ORDER BY LENGTH(name) ASC LIMIT 1',
    [`%${words[0]}%`]
  );
  return r3[0] || null;
}

// ── Main exported function ────────────────────────────────────────────────────

async function calculateRecipeNutrition(recipe) {
  const servings = Math.max(1, Number(recipe.servings) || 1);

  let ingredients;
  try {
    ingredients = Array.isArray(recipe.ingredients)
      ? recipe.ingredients
      : JSON.parse(recipe.ingredients || '[]');
  } catch {
    ingredients = [];
  }

  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const matched   = [];
  const unmatched = [];

  for (const ingStr of ingredients) {
    const { qty, raw } = parseIngredient(ingStr);

    if (qty <= 0) {
      unmatched.push(ingStr);
      continue;
    }

    const food = await findFood(raw);
    if (!food) {
      unmatched.push(ingStr);
      continue;
    }

    const ratio = qty / 100;
    totals.calories += food.calories_per_100g * ratio;
    totals.protein  += food.protein_per_100g  * ratio;
    totals.carbs    += food.carbs_per_100g    * ratio;
    totals.fat      += food.fat_per_100g      * ratio;
    matched.push(ingStr);
  }

  const r1 = (n) => Math.round(n * 10) / 10;

  const total = {
    calories: r1(totals.calories),
    protein:  r1(totals.protein),
    carbs:    r1(totals.carbs),
    fat:      r1(totals.fat),
  };

  const perServing = {
    calories: r1(totals.calories / servings),
    protein:  r1(totals.protein  / servings),
    carbs:    r1(totals.carbs    / servings),
    fat:      r1(totals.fat      / servings),
  };

  if (unmatched.length) {
    console.warn(
      `[recipeNutrition] Recipe "${recipe.title}" — ${unmatched.length} ingredient(s) ` +
      `not matched: ${unmatched.map((s) => `"${s}"`).join(', ')}`
    );
  }

  return { total, perServing, servings, matched, unmatched };
}

module.exports = { calculateRecipeNutrition };
