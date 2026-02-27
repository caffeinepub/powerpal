import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Profile, WeeklyPlan, WeeklyMealPlan } from '../backend';
import {
  getProfile,
  saveProfile,
  getWorkoutPlan,
  saveWorkoutPlan,
  getMealPlan,
  saveMealPlan,
} from '../utils/localStorage';
import { generateWorkoutPlan, generateMealPlan } from '../utils/planGenerator';

export function useGetProfile() {
  return useQuery<Profile | null>({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
    staleTime: Infinity,
  });
}

export function useSaveProfile() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, Profile>({
    mutationFn: async (profile: Profile) => {
      saveProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useGetWorkoutPlan() {
  return useQuery<WeeklyPlan | null>({
    queryKey: ['workoutPlan'],
    queryFn: () => getWorkoutPlan(),
    staleTime: Infinity,
  });
}

export function useGenerateWorkoutPlan() {
  const queryClient = useQueryClient();
  return useMutation<WeeklyPlan, Error, Profile>({
    mutationFn: async (profile: Profile) => {
      const plan = generateWorkoutPlan(profile);
      saveWorkoutPlan(plan);
      return plan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workoutPlan'] });
    },
  });
}

export function useGetMealPlan() {
  return useQuery<WeeklyMealPlan | null>({
    queryKey: ['mealPlan'],
    queryFn: () => getMealPlan(),
    staleTime: Infinity,
  });
}

export function useGenerateMealPlan() {
  const queryClient = useQueryClient();
  return useMutation<WeeklyMealPlan, Error, Profile>({
    mutationFn: async (profile: Profile) => {
      const plan = generateMealPlan(profile);
      saveMealPlan(plan);
      return plan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlan'] });
    },
  });
}
