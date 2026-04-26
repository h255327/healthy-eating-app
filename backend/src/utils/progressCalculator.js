'use strict';

// Common estimate: 7700 kcal ≈ 1 kg of body weight change
const KCAL_PER_KG = 7700;

/**
 * Calculates day-by-day progress from a user profile and a sorted array of
 * daily nutrition logs.
 *
 * @param {object} user
 *   { goal: 'lose_weight'|'gain_muscle'|'maintain'|null,
 *     calorie_target: number|null,
 *     weight: number|null }
 *
 * @param {Array<{date: string, calories: number, protein: number, carbs: number, fat: number}>} dailyLogs
 *   Must be sorted ascending by date. Missing days should be filled with zeros
 *   before calling this function.
 *
 * @returns {Array} One object per day — see structure below.
 */
function calculateProgress(user, dailyLogs) {
  if (!Array.isArray(dailyLogs) || dailyLogs.length === 0) return [];

  const calorieTarget  = Math.max(0, Number(user?.calorie_target) || 0);
  const startingWeight = user?.weight != null ? Number(user.weight) : null;
  const goal           = user?.goal  || null;

  const r1 = (n) => Math.round(n * 10)  / 10;   // 1 decimal
  const r3 = (n) => Math.round(n * 1000) / 1000; // 3 decimals (kg)

  let cumulativeDifference = 0;

  return dailyLogs.map((day) => {
    const caloriesConsumed = r1(Number(day.calories) || 0);
    const protein          = r1(Number(day.protein)  || 0);
    const carbs            = r1(Number(day.carbs)    || 0);
    const fat              = r1(Number(day.fat)      || 0);

    // Days with no logged food are excluded from cumulative math — treating
    // them as 0 kcal would falsely create a large deficit every unlogged day.
    const hasData = caloriesConsumed > 0;

    // Negative → deficit (consumed < target) → weight loss direction
    // Positive → surplus (consumed > target) → weight gain direction
    const calorieDifference = hasData ? caloriesConsumed - calorieTarget : 0;
    cumulativeDifference   += calorieDifference;

    // Only meaningful when a calorie target is set
    const estimatedWeightChangeKg = calorieTarget > 0
      ? r3(cumulativeDifference / KCAL_PER_KG)
      : null;

    const estimatedWeightKg =
      startingWeight !== null && estimatedWeightChangeKg !== null
        ? Math.round((startingWeight + estimatedWeightChangeKg) * 100) / 100
        : null;

    // onTrack is null for unlogged days — we have nothing to judge
    let onTrack = null;
    if (hasData && calorieTarget > 0) {
      if (goal === 'lose_weight') onTrack = calorieDifference <= 0;
      if (goal === 'gain_muscle') onTrack = calorieDifference >= 0;
      if (goal === 'maintain')    onTrack = Math.abs(calorieDifference) <= calorieTarget * 0.10;
    }

    return {
      date:                    day.date,
      caloriesConsumed,
      calorieTarget,
      calorieDifference:       Math.round(calorieDifference),
      cumulativeDifference:    Math.round(cumulativeDifference),
      estimatedWeightChangeKg,
      estimatedWeightKg,
      onTrack,
      protein,
      carbs,
      fat,
    };
  });
}

module.exports = { calculateProgress };
