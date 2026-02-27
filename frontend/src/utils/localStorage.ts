import type { Profile, WeeklyPlan, WeeklyMealPlan } from '../backend';

const KEYS = {
  PROFILE: 'powerpal_profile',
  WORKOUT_PLAN: 'powerpal_workout_plan',
  MEAL_PLAN: 'powerpal_meal_plan',
};

// Custom replacer: serialize BigInt as { __bigint__: "value" }
function bigintReplacer(_key: string, value: unknown): unknown {
  if (typeof value === 'bigint') {
    return { __bigint__: value.toString() };
  }
  return value;
}

// Custom reviver: deserialize { __bigint__: "value" } back to BigInt
function bigintReviver(_key: string, value: unknown): unknown {
  if (
    value !== null &&
    typeof value === 'object' &&
    '__bigint__' in (value as object) &&
    typeof (value as Record<string, unknown>)['__bigint__'] === 'string'
  ) {
    return BigInt((value as Record<string, string>)['__bigint__']);
  }
  return value;
}

export function getProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE);
    if (!raw) return null;
    return JSON.parse(raw, bigintReviver) as Profile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: Profile): void {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile, bigintReplacer));
}

export function getWorkoutPlan(): WeeklyPlan | null {
  try {
    const raw = localStorage.getItem(KEYS.WORKOUT_PLAN);
    if (!raw) return null;
    return JSON.parse(raw, bigintReviver) as WeeklyPlan;
  } catch {
    return null;
  }
}

export function saveWorkoutPlan(plan: WeeklyPlan): void {
  localStorage.setItem(KEYS.WORKOUT_PLAN, JSON.stringify(plan, bigintReplacer));
}

export function getMealPlan(): WeeklyMealPlan | null {
  try {
    const raw = localStorage.getItem(KEYS.MEAL_PLAN);
    if (!raw) return null;
    return JSON.parse(raw, bigintReviver) as WeeklyMealPlan;
  } catch {
    return null;
  }
}

export function saveMealPlan(plan: WeeklyMealPlan): void {
  localStorage.setItem(KEYS.MEAL_PLAN, JSON.stringify(plan, bigintReplacer));
}

export function clearAllData(): void {
  localStorage.removeItem(KEYS.PROFILE);
  localStorage.removeItem(KEYS.WORKOUT_PLAN);
  localStorage.removeItem(KEYS.MEAL_PLAN);
}
