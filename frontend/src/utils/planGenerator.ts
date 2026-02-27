import type { Profile, WeeklyPlan, WeeklyMealPlan, Exercise, WorkoutDay, Meal, DailyMealPlan } from '../backend';
import { FitnessGoal } from '../backend';

export function generateWorkoutPlan(profile: Profile): WeeklyPlan {
  const goal = profile.goal;

  let exercises: Exercise[] = [];

  switch (goal) {
    case FitnessGoal.weightLoss:
      exercises = [
        { name: 'Cardio', sets: 0n, reps: 0n, durationMinutes: 30n },
        { name: 'Bodyweight Circuit', sets: 3n, reps: 12n, durationMinutes: 0n },
      ];
      break;
    case FitnessGoal.muscleGain:
      exercises = [
        { name: 'Weight Lifting', sets: 4n, reps: 8n, durationMinutes: 0n },
        { name: 'Compound Movements', sets: 4n, reps: 10n, durationMinutes: 0n },
      ];
      break;
    case FitnessGoal.endurance:
      exercises = [
        { name: 'Long-Distance Running', sets: 0n, reps: 0n, durationMinutes: 45n },
        { name: 'Interval Training', sets: 0n, reps: 0n, durationMinutes: 20n },
      ];
      break;
    case FitnessGoal.flexibility:
      exercises = [
        { name: 'Yoga', sets: 0n, reps: 0n, durationMinutes: 60n },
        { name: 'Stretching', sets: 0n, reps: 0n, durationMinutes: 30n },
      ];
      break;
    case FitnessGoal.generalFitness:
    default:
      exercises = [
        { name: 'Mixed Cardio & Strength', sets: 3n, reps: 10n, durationMinutes: 20n },
      ];
      break;
  }

  const days: WorkoutDay[] = [
    { day: 'Monday', exercises, rest: false },
    { day: 'Tuesday', exercises: [], rest: true },
    { day: 'Wednesday', exercises, rest: false },
    { day: 'Thursday', exercises: [], rest: true },
    { day: 'Friday', exercises, rest: false },
    { day: 'Saturday', exercises: [], rest: true },
    { day: 'Sunday', exercises, rest: false },
  ];

  return { days };
}

function getMealsForGoal(goal: FitnessGoal): {
  breakfasts: Meal[];
  lunches: Meal[];
  dinners: Meal[];
  desserts: Meal[];
} {
  switch (goal) {
    case FitnessGoal.weightLoss:
      return {
        breakfasts: [
          { name: 'Oatmeal with Berries', calories: 300n, protein: 10n, carbs: 50n, fat: 5n },
          { name: 'Egg White Omelet', calories: 250n, protein: 20n, carbs: 5n, fat: 8n },
          { name: 'Greek Yogurt Parfait', calories: 280n, protein: 15n, carbs: 30n, fat: 6n },
        ],
        lunches: [
          { name: 'Grilled Chicken Salad', calories: 350n, protein: 30n, carbs: 15n, fat: 12n },
          { name: 'Turkey Wrap', calories: 400n, protein: 25n, carbs: 35n, fat: 10n },
          { name: 'Quinoa Bowl', calories: 380n, protein: 12n, carbs: 65n, fat: 7n },
        ],
        dinners: [
          { name: 'Baked Salmon', calories: 420n, protein: 35n, carbs: 10n, fat: 20n },
          { name: 'Stir-Fry Veggies & Tofu', calories: 350n, protein: 18n, carbs: 45n, fat: 9n },
          { name: 'Grilled Chicken Breast', calories: 380n, protein: 40n, carbs: 12n, fat: 8n },
        ],
        desserts: [
          { name: 'Fruit Salad', calories: 120n, protein: 2n, carbs: 30n, fat: 0n },
          { name: 'Yogurt with Honey', calories: 150n, protein: 6n, carbs: 20n, fat: 3n },
          { name: 'Dark Chocolate Square', calories: 100n, protein: 1n, carbs: 10n, fat: 7n },
        ],
      };
    case FitnessGoal.muscleGain:
      return {
        breakfasts: [
          { name: 'Protein Pancakes', calories: 400n, protein: 25n, carbs: 50n, fat: 10n },
          { name: 'Bacon & Eggs', calories: 500n, protein: 35n, carbs: 10n, fat: 35n },
          { name: 'Breakfast Burrito', calories: 450n, protein: 30n, carbs: 40n, fat: 15n },
        ],
        lunches: [
          { name: 'Steak Wrap', calories: 550n, protein: 45n, carbs: 45n, fat: 20n },
          { name: 'Chicken Alfredo Pasta', calories: 600n, protein: 40n, carbs: 70n, fat: 18n },
          { name: 'Chili', calories: 500n, protein: 38n, carbs: 40n, fat: 15n },
        ],
        dinners: [
          { name: 'Salmon with Potatoes', calories: 650n, protein: 45n, carbs: 50n, fat: 25n },
          { name: 'Chicken & Rice', calories: 600n, protein: 40n, carbs: 75n, fat: 10n },
          { name: 'Beef Stir-Fry', calories: 580n, protein: 38n, carbs: 60n, fat: 16n },
        ],
        desserts: [
          { name: 'Protein Bar', calories: 200n, protein: 16n, carbs: 18n, fat: 6n },
          { name: 'Peanut Butter Cookies', calories: 250n, protein: 8n, carbs: 20n, fat: 14n },
          { name: 'Banana Nut Muffin', calories: 220n, protein: 6n, carbs: 30n, fat: 8n },
        ],
      };
    case FitnessGoal.endurance:
      return {
        breakfasts: [
          { name: 'Whole Wheat Toast & Eggs', calories: 350n, protein: 18n, carbs: 48n, fat: 8n },
          { name: 'Fruit Smoothie', calories: 320n, protein: 12n, carbs: 60n, fat: 4n },
          { name: 'Oatmeal & Banana', calories: 380n, protein: 13n, carbs: 67n, fat: 7n },
        ],
        lunches: [
          { name: 'Rice & Beans Bowl', calories: 480n, protein: 20n, carbs: 75n, fat: 10n },
          { name: 'Chicken Pasta Salad', calories: 520n, protein: 30n, carbs: 70n, fat: 16n },
          { name: 'Tofu Wrap', calories: 420n, protein: 12n, carbs: 65n, fat: 10n },
        ],
        dinners: [
          { name: 'Veggie Stir-Fry & Rice', calories: 530n, protein: 16n, carbs: 90n, fat: 11n },
          { name: 'Grilled Salmon & Quinoa', calories: 560n, protein: 32n, carbs: 46n, fat: 18n },
          { name: 'Chicken Fajitas', calories: 520n, protein: 35n, carbs: 55n, fat: 16n },
        ],
        desserts: [
          { name: 'Fruit Parfait', calories: 170n, protein: 5n, carbs: 30n, fat: 2n },
          { name: 'Yogurt & Granola', calories: 200n, protein: 7n, carbs: 28n, fat: 5n },
          { name: 'Energy Bites', calories: 230n, protein: 6n, carbs: 35n, fat: 8n },
        ],
      };
    case FitnessGoal.flexibility:
      return {
        breakfasts: [
          { name: 'Vegetable Omelet', calories: 330n, protein: 16n, carbs: 18n, fat: 18n },
          { name: 'Smoothie Bowl', calories: 360n, protein: 14n, carbs: 66n, fat: 6n },
          { name: 'Porridge & Berries', calories: 320n, protein: 12n, carbs: 58n, fat: 4n },
        ],
        lunches: [
          { name: 'Grilled Veggie Wrap', calories: 450n, protein: 18n, carbs: 68n, fat: 12n },
          { name: 'Chicken & Sweet Potatoes', calories: 470n, protein: 28n, carbs: 48n, fat: 14n },
          { name: 'Bean & Rice Bowl', calories: 430n, protein: 16n, carbs: 60n, fat: 10n },
        ],
        dinners: [
          { name: 'Grilled Fish & Veggies', calories: 480n, protein: 36n, carbs: 38n, fat: 14n },
          { name: 'Stir-Fry Shrimp & Rice', calories: 500n, protein: 30n, carbs: 56n, fat: 13n },
          { name: 'Lentil Stew', calories: 420n, protein: 18n, carbs: 62n, fat: 8n },
        ],
        desserts: [
          { name: 'Frozen Yogurt', calories: 160n, protein: 4n, carbs: 28n, fat: 3n },
          { name: 'Apple Granola Crunch', calories: 200n, protein: 6n, carbs: 33n, fat: 6n },
          { name: 'Fruit Salad', calories: 100n, protein: 2n, carbs: 24n, fat: 1n },
        ],
      };
    case FitnessGoal.generalFitness:
    default:
      return {
        breakfasts: [
          { name: 'Egg & Toast', calories: 350n, protein: 19n, carbs: 45n, fat: 12n },
          { name: 'Smoothie', calories: 320n, protein: 14n, carbs: 57n, fat: 5n },
          { name: 'Pancakes & Fruit', calories: 380n, protein: 11n, carbs: 67n, fat: 12n },
        ],
        lunches: [
          { name: 'Chicken Salad', calories: 420n, protein: 25n, carbs: 37n, fat: 14n },
          { name: 'Pasta Bowl', calories: 450n, protein: 20n, carbs: 70n, fat: 9n },
          { name: 'Tofu Stir-Fry', calories: 410n, protein: 17n, carbs: 54n, fat: 13n },
        ],
        dinners: [
          { name: 'Grilled Chicken & Veggies', calories: 430n, protein: 32n, carbs: 29n, fat: 13n },
          { name: 'Salmon & Rice', calories: 480n, protein: 27n, carbs: 46n, fat: 16n },
          { name: 'Steak & Potatoes', calories: 520n, protein: 32n, carbs: 38n, fat: 19n },
        ],
        desserts: [
          { name: 'Yogurt', calories: 120n, protein: 5n, carbs: 19n, fat: 2n },
          { name: 'Fruit Mix', calories: 110n, protein: 2n, carbs: 28n, fat: 1n },
          { name: 'Dark Chocolate', calories: 100n, protein: 3n, carbs: 14n, fat: 6n },
        ],
      };
  }
}

function shuffleMeals(arr: Meal[], seed: number): Meal[] {
  const copy = [...arr];
  let s = seed;
  for (let i = copy.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateMealPlan(profile: Profile): WeeklyMealPlan {
  const meals = getMealsForGoal(profile.goal);
  const seed = (profile.name.length + Number(profile.age) + profile.name.length) % 179;

  const sb = shuffleMeals(meals.breakfasts, seed);
  const sl = shuffleMeals(meals.lunches, seed + 1);
  const sd = shuffleMeals(meals.dinners, seed + 2);
  const sds = shuffleMeals(meals.desserts, seed + 3);

  const days: DailyMealPlan[] = [
    { breakfast: sb[0], lunch: sl[0], dinner: sd[0], dessert: sds[0] },
    { breakfast: sb[1], lunch: sl[1], dinner: sd[1], dessert: sds[1] },
    { breakfast: sb[2], lunch: sl[2], dinner: sd[2], dessert: sds[2] },
    { breakfast: sb[0], lunch: sl[1], dinner: sd[2], dessert: undefined },
    { breakfast: sb[1], lunch: sl[2], dinner: sd[0], dessert: sds[1] },
    { breakfast: sb[2], lunch: sl[0], dinner: sd[1], dessert: sds[2] },
    { breakfast: sb[0], lunch: sl[1], dinner: sd[2], dessert: undefined },
  ];

  return { days };
}
