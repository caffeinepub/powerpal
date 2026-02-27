// No changes needed - mascot change is entirely frontend!
import Map "mo:core/Map";
import Array "mo:core/Array";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type FitnessLevel = {
    #beginner;
    #intermediate;
    #advanced;
  };

  module FitnessLevel {
    public func toText(l : FitnessLevel) : Text {
      switch (l) {
        case (#beginner) { "Beginner" };
        case (#intermediate) { "Intermediate" };
        case (#advanced) { "Advanced" };
      };
    };
  };

  type FitnessGoal = {
    #weightLoss;
    #muscleGain;
    #endurance;
    #flexibility;
    #generalFitness;
  };

  module FitnessGoal {
    public func toText(g : FitnessGoal) : Text {
      switch (g) {
        case (#weightLoss) { "Weight Loss" };
        case (#muscleGain) { "Muscle Gain" };
        case (#endurance) { "Endurance" };
        case (#flexibility) { "Flexibility" };
        case (#generalFitness) { "General Fitness" };
      };
    };
  };

  type Profile = {
    name : Text;
    age : Nat;
    fitnessLevel : FitnessLevel;
    goal : FitnessGoal;
  };

  module Profile {
    public func compare(p1 : Profile, p2 : Profile) : Order.Order {
      switch (Text.compare(p1.name, p2.name)) {
        case (#equal) { Nat.compare(p1.age, p2.age) };
        case (other) { other };
      };
    };
  };

  type Exercise = {
    name : Text;
    sets : Nat;
    reps : Nat;
    durationMinutes : Nat;
  };

  type WorkoutDay = {
    day : Text;
    exercises : [Exercise];
    rest : Bool;
  };

  type WeeklyPlan = { days : [WorkoutDay] };

  // ---------- Profile functions required by frontend ----------

  let profiles = Map.empty<Principal, Profile>();
  let plans = Map.empty<Principal, WeeklyPlan>();

  public query ({ caller }) func getCallerUserProfile() : async ?Profile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    profiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?Profile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    profiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : Profile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    profiles.add(caller, profile);
  };

  // ---------- Existing profile/workout functions ----------

  public shared ({ caller }) func updateProfile(name : Text, age : Nat, fitnessLevel : FitnessLevel, goal : FitnessGoal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };
    let profile : Profile = {
      name;
      age;
      fitnessLevel;
      goal;
    };
    profiles.add(caller, profile);
  };

  public query ({ caller }) func getProfile() : async Profile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their profile");
    };
    switch (profiles.get(caller)) {
      case (null) { Runtime.trap("No profile found") };
      case (?profile) { profile };
    };
  };

  public query ({ caller }) func getAllProfiles() : async [Profile] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all profiles");
    };
    profiles.values().toArray().sort();
  };

  public shared ({ caller }) func generateWorkoutPlan() : async WeeklyPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate workout plans");
    };
    let profile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("No profile found") };
      case (?p) { p };
    };

    let exercises = switch (profile.goal) {
      case (#weightLoss) {
        [
          { name = "Cardio"; sets = 0; reps = 0; durationMinutes = 30 },
          { name = "Bodyweight Circuit"; sets = 3; reps = 12; durationMinutes = 0 },
        ];
      };
      case (#muscleGain) {
        [
          { name = "Weight Lifting"; sets = 4; reps = 8; durationMinutes = 0 },
          { name = "Compound Movements"; sets = 4; reps = 10; durationMinutes = 0 },
        ];
      };
      case (#endurance) {
        [
          { name = "Long-Distance Running"; sets = 0; reps = 0; durationMinutes = 45 },
          { name = "Interval Training"; sets = 0; reps = 0; durationMinutes = 20 },
        ];
      };
      case (#flexibility) {
        [
          { name = "Yoga"; sets = 0; reps = 0; durationMinutes = 60 },
          { name = "Stretching"; sets = 0; reps = 0; durationMinutes = 30 },
        ];
      };
      case (#generalFitness) {
        [
          { name = "Mixed Cardio & Strength"; sets = 3; reps = 10; durationMinutes = 20 },
        ];
      };
    };

    let days = [
      { day = "Monday"; exercises; rest = false },
      { day = "Tuesday"; exercises : [Exercise] = []; rest = true },
      { day = "Wednesday"; exercises; rest = false },
      { day = "Thursday"; exercises : [Exercise] = []; rest = true },
      { day = "Friday"; exercises; rest = false },
      { day = "Saturday"; exercises : [Exercise] = []; rest = true },
      { day = "Sunday"; exercises; rest = false },
    ];

    let plan = { days };

    plans.add(caller, plan);
    plan;
  };

  public query ({ caller }) func getWorkoutPlan() : async WeeklyPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their workout plan");
    };
    switch (plans.get(caller)) {
      case (null) { Runtime.trap("No plan found") };
      case (?plan) { plan };
    };
  };

  // ---------- Meal Plan Structs and Logic ----------

  type Meal = {
    name : Text;
    calories : Nat;
    protein : Nat;
    carbs : Nat;
    fat : Nat;
  };

  type MealType = {
    #breakfast;
    #lunch;
    #dinner;
    #snack;
    #dessert;
  };

  type DailyMealPlan = {
    breakfast : Meal;
    lunch : Meal;
    dinner : Meal;
    dessert : ?Meal;
  };

  type WeeklyMealPlan = { days : [DailyMealPlan] };

  let userMealPlans = Map.empty<Principal, WeeklyMealPlan>();

  func getMealsForGoal(goal : FitnessGoal) : {
    breakfasts : [Meal];
    lunches : [Meal];
    dinners : [Meal];
    desserts : [Meal];
  } {
    switch (goal) {
      case (#weightLoss) {
        {
          breakfasts = [
            { name = "Oatmeal with Berries"; calories = 300; protein = 10; carbs = 50; fat = 5 },
            { name = "Egg White Omelet"; calories = 250; protein = 20; carbs = 5; fat = 8 },
            { name = "Greek Yogurt Parfait"; calories = 280; protein = 15; carbs = 30; fat = 6 },
          ];
          lunches = [
            { name = "Grilled Chicken Salad"; calories = 350; protein = 30; carbs = 15; fat = 12 },
            { name = "Turkey Wrap"; calories = 400; protein = 25; carbs = 35; fat = 10 },
            { name = "Quinoa Bowl"; calories = 380; protein = 12; carbs = 65; fat = 7 },
          ];
          dinners = [
            { name = "Baked Salmon"; calories = 420; protein = 35; carbs = 10; fat = 20 },
            { name = "Stir-Fry Veggies & Tofu"; calories = 350; protein = 18; carbs = 45; fat = 9 },
            { name = "Grilled Chicken Breast"; calories = 380; protein = 40; carbs = 12; fat = 8 },
          ];
          desserts = [
            { name = "Fruit Salad"; calories = 120; protein = 2; carbs = 30; fat = 0 },
            { name = "Yogurt with Honey"; calories = 150; protein = 6; carbs = 20; fat = 3 },
            { name = "Dark Chocolate Square"; calories = 100; protein = 1; carbs = 10; fat = 7 },
          ];
        };
      };
      case (#muscleGain) {
        {
          breakfasts = [
            { name = "Protein Pancakes"; calories = 400; protein = 25; carbs = 50; fat = 10 },
            { name = "Bacon & Eggs"; calories = 500; protein = 35; carbs = 10; fat = 35 },
            { name = "Breakfast Burrito"; calories = 450; protein = 30; carbs = 40; fat = 15 },
          ];
          lunches = [
            { name = "Steak Wrap"; calories = 550; protein = 45; carbs = 45; fat = 20 },
            { name = "Chicken Alfredo Pasta"; calories = 600; protein = 40; carbs = 70; fat = 18 },
            { name = "Chili"; calories = 500; protein = 38; carbs = 40; fat = 15 },
          ];
          dinners = [
            { name = "Salmon with Potatoes"; calories = 650; protein = 45; carbs = 50; fat = 25 },
            { name = "Chicken & Rice"; calories = 600; protein = 40; carbs = 75; fat = 10 },
            { name = "Beef Stir-Fry"; calories = 580; protein = 38; carbs = 60; fat = 16 },
          ];
          desserts = [
            { name = "Protein Bar"; calories = 200; protein = 16; carbs = 18; fat = 6 },
            { name = "Peanut Butter Cookies"; calories = 250; protein = 8; carbs = 20; fat = 14 },
            { name = "Banana Nut Muffin"; calories = 220; protein = 6; carbs = 30; fat = 8 },
          ];
        };
      };
      case (#endurance) {
        {
          breakfasts = [
            { name = "Whole Wheat Toast & Eggs"; calories = 350; protein = 18; carbs = 48; fat = 8 },
            { name = "Fruit Smoothie"; calories = 320; protein = 12; carbs = 60; fat = 4 },
            { name = "Oatmeal & Banana"; calories = 380; protein = 13; carbs = 67; fat = 7 },
          ];
          lunches = [
            { name = "Rice & Beans Bowl"; calories = 480; protein = 20; carbs = 75; fat = 10 },
            { name = "Chicken Pasta Salad"; calories = 520; protein = 30; carbs = 70; fat = 16 },
            { name = "Tofu Wrap"; calories = 420; protein = 12; carbs = 65; fat = 10 },
          ];
          dinners = [
            { name = "Veggie Stir-Fry & Rice"; calories = 530; protein = 16; carbs = 90; fat = 11 },
            { name = "Grilled Salmon & Quinoa"; calories = 560; protein = 32; carbs = 46; fat = 18 },
            { name = "Chicken Fajitas"; calories = 520; protein = 35; carbs = 55; fat = 16 },
          ];
          desserts = [
            { name = "Fruit Parfait"; calories = 170; protein = 5; carbs = 30; fat = 2 },
            { name = "Yogurt & Granola"; calories = 200; protein = 7; carbs = 28; fat = 5 },
            { name = "Energy Bites"; calories = 230; protein = 6; carbs = 35; fat = 8 },
          ];
        };
      };
      case (#flexibility) {
        {
          breakfasts = [
            { name = "Vegetable Omelet"; calories = 330; protein = 16; carbs = 18; fat = 18 },
            { name = "Smoothie Bowl"; calories = 360; protein = 14; carbs = 66; fat = 6 },
            { name = "Porridge & Berries"; calories = 320; protein = 12; carbs = 58; fat = 4 },
          ];
          lunches = [
            { name = "Grilled Veggie Wrap"; calories = 450; protein = 18; carbs = 68; fat = 12 },
            { name = "Chicken & Sweet Potatoes"; calories = 470; protein = 28; carbs = 48; fat = 14 },
            { name = "Bean & Rice Bowl"; calories = 430; protein = 16; carbs = 60; fat = 10 },
          ];
          dinners = [
            { name = "Grilled Fish & Veggies"; calories = 480; protein = 36; carbs = 38; fat = 14 },
            { name = "Stir-Fry Shrimp & Rice"; calories = 500; protein = 30; carbs = 56; fat = 13 },
            { name = "Lentil Stew"; calories = 420; protein = 18; carbs = 62; fat = 8 },
          ];
          desserts = [
            { name = "Frozen Yogurt"; calories = 160; protein = 4; carbs = 28; fat = 3 },
            { name = "Apple Granola Crunch"; calories = 200; protein = 6; carbs = 33; fat = 6 },
            { name = "Fruit Salad"; calories = 100; protein = 2; carbs = 24; fat = 1 },
          ];
        };
      };
      case (#generalFitness) {
        {
          breakfasts = [
            { name = "Egg & Toast"; calories = 350; protein = 19; carbs = 45; fat = 12 },
            { name = "Smoothie"; calories = 320; protein = 14; carbs = 57; fat = 5 },
            { name = "Pancakes & Fruit"; calories = 380; protein = 11; carbs = 67; fat = 12 },
          ];
          lunches = [
            { name = "Chicken Salad"; calories = 420; protein = 25; carbs = 37; fat = 14 },
            { name = "Pasta Bowl"; calories = 450; protein = 20; carbs = 70; fat = 9 },
            { name = "Tofu Stir-Fry"; calories = 410; protein = 17; carbs = 54; fat = 13 },
          ];
          dinners = [
            { name = "Grilled Chicken & Veggies"; calories = 430; protein = 32; carbs = 29; fat = 13 },
            { name = "Salmon & Rice"; calories = 480; protein = 27; carbs = 46; fat = 16 },
            { name = "Steak & Potatoes"; calories = 520; protein = 32; carbs = 38; fat = 19 },
          ];
          desserts = [
            { name = "Yogurt"; calories = 120; protein = 5; carbs = 19; fat = 2 },
            { name = "Fruit Mix"; calories = 110; protein = 2; carbs = 28; fat = 1 },
            { name = "Dark Chocolate"; calories = 100; protein = 3; carbs = 14; fat = 6 },
          ];
        };
      };
    };
  };

  func shuffleArray(array : [Meal], seed : Nat) : [Meal] {
    let tempArray = array.toVarArray<Meal>();
    let n = tempArray.size();
    var seedVar = seed;

    func randomIndex(range : Nat, seed : Nat) : Nat {
      if (range <= 1) { return 0 };
      (seed % range);
    };

    for (i in Nat.range(0, n - 1)) {
      let j = randomIndex(n - i, seedVar) + i;
      seedVar += i;

      if (i < n and j < n) {
        let temp = tempArray[i];
        tempArray[i] := tempArray[j];
        tempArray[j] := temp;
      };
    };

    tempArray.toArray();
  };

  public shared ({ caller }) func generateMealPlan() : async WeeklyMealPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can generate meal plans");
    };
    let profile = switch (profiles.get(caller)) {
      case (null) { Runtime.trap("No profile found") };
      case (?p) { p };
    };

    let meals = getMealsForGoal(profile.goal);

    let seed = (caller.toText().size() + profile.name.size() + profile.age + profile.name.size()) % 179;

    let shuffledBreakfasts = shuffleArray(meals.breakfasts, seed);
    let shuffledLunches = shuffleArray(meals.lunches, seed + 1);
    let shuffledDinners = shuffleArray(meals.dinners, seed + 2);
    let shuffledDesserts = shuffleArray(meals.desserts, seed + 3);

    let days = [
      {
        breakfast = shuffledBreakfasts[0];
        lunch = shuffledLunches[0];
        dinner = shuffledDinners[0];
        dessert = ?shuffledDesserts[0];
      },
      {
        breakfast = shuffledBreakfasts[1];
        lunch = shuffledLunches[1];
        dinner = shuffledDinners[1];
        dessert = ?shuffledDesserts[1];
      },
      {
        breakfast = shuffledBreakfasts[2];
        lunch = shuffledLunches[2];
        dinner = shuffledDinners[2];
        dessert = ?shuffledDesserts[2];
      },
      {
        breakfast = shuffledBreakfasts[0];
        lunch = shuffledLunches[1];
        dinner = shuffledDinners[2];
        dessert = null;
      },
      {
        breakfast = shuffledBreakfasts[1];
        lunch = shuffledLunches[2];
        dinner = shuffledDinners[0];
        dessert = ?shuffledDesserts[1];
      },
      {
        breakfast = shuffledBreakfasts[2];
        lunch = shuffledLunches[0];
        dinner = shuffledDinners[1];
        dessert = ?shuffledDesserts[2];
      },
      {
        breakfast = shuffledBreakfasts[0];
        lunch = shuffledLunches[1];
        dinner = shuffledDinners[2];
        dessert = null;
      },
    ];

    let weeklyPlan = { days };

    userMealPlans.add(caller, weeklyPlan);
    weeklyPlan;
  };

  public query ({ caller }) func getMealPlan() : async WeeklyMealPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get their meal plan");
    };
    switch (userMealPlans.get(caller)) {
      case (null) { Runtime.trap("No meal plan found") };
      case (?plan) { plan };
    };
  };
};

