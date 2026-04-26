'use strict';

// ── Constants ─────────────────────────────────────────────────────────────────

const ACTIVITY_MULTIPLIERS = {
  sedentary:         1.2,    // desk job, little or no exercise
  lightly_active:    1.375,  // light exercise 1–3 days/week
  moderately_active: 1.55,   // moderate exercise 3–5 days/week
  very_active:       1.725,  // hard exercise 6–7 days/week
  extra_active:      1.9,    // physical job or twice-a-day training
};

const ACTIVITY_LABELS = {
  sedentary:         'sedentary',
  lightly_active:    'lightly active',
  moderately_active: 'moderately active',
  very_active:       'very active',
  extra_active:      'extra active',
};

const GOAL_ADJUSTMENTS = {
  lose_weight:  -500,
  maintain:        0,
  gain_muscle:   300,
};

const GOAL_LABELS = {
  lose_weight:  'weight loss',
  maintain:     'maintenance',
  gain_muscle:  'muscle gain',
};

// Minimum safe daily calorie targets to prevent dangerously low recommendations.
const SAFE_MINIMUMS = {
  male:    1500,
  female:  1200,
  default: 1200,
};

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Calculates a recommended daily calorie target using Mifflin-St Jeor BMR,
 * an activity multiplier (TDEE), and a goal-based adjustment.
 *
 * @param {object} userDetails
 *   { weight, height, age, sex, activity_level }
 *
 * @param {string|null} goal
 *   'lose_weight' | 'maintain' | 'gain_muscle' | null
 *
 * @returns {{
 *   bmr, tdee, goalAdjustment, rawRecommended,
 *   safeMinimum, wasClamped, recommendedCalories, explanation
 * }} or null when any required field is missing or invalid.
 */
function calculateRecommendedCalories(userDetails, goal) {
  const { weight, height, age, sex, activity_level } = userDetails || {};

  const w = Number(weight);
  const h = Number(height);
  const a = Number(age);

  // All four biometric inputs are required for Mifflin-St Jeor
  if (!w || !h || !a || w <= 0 || h <= 0 || a <= 0) return null;
  if (sex !== 'male' && sex !== 'female') return null;
  if (!ACTIVITY_MULTIPLIERS[activity_level]) return null;

  // Mifflin-St Jeor BMR
  // Male:   10w + 6.25h − 5a + 5
  // Female: 10w + 6.25h − 5a − 161
  const sexOffset = sex === 'male' ? 5 : -161;
  const bmr       = Math.round(10 * w + 6.25 * h - 5 * a + sexOffset);

  const multiplier = ACTIVITY_MULTIPLIERS[activity_level];
  const tdee       = Math.round(bmr * multiplier);

  const normalizedGoal = Object.prototype.hasOwnProperty.call(GOAL_ADJUSTMENTS, goal) ? goal : 'maintain';
  const goalAdjustment = GOAL_ADJUSTMENTS[normalizedGoal];
  const rawRecommended = Math.round(tdee + goalAdjustment);

  // Clamp to the sex-specific safe minimum
  const safeMinimum         = SAFE_MINIMUMS[sex] ?? SAFE_MINIMUMS.default;
  const recommendedCalories = Math.max(rawRecommended, safeMinimum);
  const wasClamped          = recommendedCalories !== rawRecommended;

  const goalLabel = GOAL_LABELS[normalizedGoal];

  let explanation =
    `Your estimated daily energy need is ${tdee} kcal` +
    (goalAdjustment !== 0
      ? ` (${goalAdjustment > 0 ? '+' : ''}${goalAdjustment} kcal for ${goalLabel})`
      : '') +
    `, giving a recommended target of ${recommendedCalories} kcal/day.`;

  if (wasClamped) {
    explanation += ` Adjusted to the safe minimum of ${safeMinimum} kcal/day.`;
  }

  return {
    bmr,
    tdee,
    goalAdjustment,
    rawRecommended,
    safeMinimum,
    wasClamped,
    recommendedCalories,
    explanation,
  };
}

module.exports = { calculateRecommendedCalories, ACTIVITY_MULTIPLIERS, GOAL_ADJUSTMENTS, SAFE_MINIMUMS };
