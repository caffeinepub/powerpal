import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Profile, WeeklyPlan, WeeklyMealPlan } from '../backend';

// ─── Profile ────────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Profile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: Profile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useGetProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<Profile | null>({
    queryKey: ['profile'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: Profile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

// ─── Workout Plan ────────────────────────────────────────────────────────────

export function useGetWorkoutPlan() {
  const { actor, isFetching } = useActor();

  return useQuery<WeeklyPlan | null>({
    queryKey: ['workoutPlan'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getWorkoutPlan();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGenerateWorkoutPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<WeeklyPlan, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available. Please log in.');
      return actor.generateWorkoutPlan();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['workoutPlan'], data);
      queryClient.invalidateQueries({ queryKey: ['workoutPlan'] });
    },
    onError: (error) => {
      console.error('Failed to generate workout plan:', error);
    },
  });
}

// ─── Meal Plan ───────────────────────────────────────────────────────────────

export function useGetMealPlan() {
  const { actor, isFetching } = useActor();

  return useQuery<WeeklyMealPlan | null>({
    queryKey: ['mealPlan'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getMealPlan();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
  });
}

export function useGenerateMealPlan() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<WeeklyMealPlan, Error, void>({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available. Please log in.');
      return actor.generateMealPlan();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['mealPlan'], data);
      queryClient.invalidateQueries({ queryKey: ['mealPlan'] });
    },
    onError: (error) => {
      console.error('Failed to generate meal plan:', error);
    },
  });
}
