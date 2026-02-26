import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Meal {
    fat: bigint;
    carbs: bigint;
    calories: bigint;
    name: string;
    protein: bigint;
}
export interface Exercise {
    name: string;
    reps: bigint;
    sets: bigint;
    durationMinutes: bigint;
}
export interface WeeklyMealPlan {
    days: Array<DailyMealPlan>;
}
export interface WeeklyPlan {
    days: Array<WorkoutDay>;
}
export interface DailyMealPlan {
    dessert?: Meal;
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
}
export interface Profile {
    age: bigint;
    fitnessLevel: FitnessLevel;
    goal: FitnessGoal;
    name: string;
}
export interface WorkoutDay {
    day: string;
    rest: boolean;
    exercises: Array<Exercise>;
}
export enum FitnessGoal {
    generalFitness = "generalFitness",
    weightLoss = "weightLoss",
    flexibility = "flexibility",
    muscleGain = "muscleGain",
    endurance = "endurance"
}
export enum FitnessLevel {
    intermediate = "intermediate",
    beginner = "beginner",
    advanced = "advanced"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    generateMealPlan(): Promise<WeeklyMealPlan>;
    generateWorkoutPlan(): Promise<WeeklyPlan>;
    getAllProfiles(): Promise<Array<Profile>>;
    getCallerUserProfile(): Promise<Profile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMealPlan(): Promise<WeeklyMealPlan>;
    getProfile(): Promise<Profile>;
    getUserProfile(user: Principal): Promise<Profile | null>;
    getWorkoutPlan(): Promise<WeeklyPlan>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: Profile): Promise<void>;
    updateProfile(name: string, age: bigint, fitnessLevel: FitnessLevel, goal: FitnessGoal): Promise<void>;
}
