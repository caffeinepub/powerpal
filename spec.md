# Specification

## Summary
**Goal:** Fix the "Build My Plan" functionality in WorkoutPlanView so users can successfully generate and save a workout plan.

**Planned changes:**
- Fix the "Build My Plan" button/action to correctly call the backend plan-generation method with the user's profile data (fitness level, goal)
- Add a loading indicator while the workout plan is being generated
- Display the generated workout plan on success
- Show a clear error message on failure
- Ensure the "Build My Plan" button is only enabled when the user profile is available and complete
- Fix the plan-generation mutation in useQueries.ts to correctly pass user profile data to the backend actor
- Fix the backend `generateWorkoutPlan` method to return a valid plan structure without silent failures or trapped errors

**User-visible outcome:** Users can click "Build My Plan" and successfully generate a workout plan, seeing a loading state during generation, the resulting plan on success, or a clear error message on failure.
