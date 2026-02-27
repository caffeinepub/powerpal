import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetProfile } from './hooks/useLocalQueries';
import OnboardingFlow from './components/OnboardingFlow';
import WorkoutPlanView from './components/WorkoutPlanView';
import MealPlanView from './components/MealPlanView';
import WeeklyScheduleView from './components/WeeklyScheduleView';
import GoalDrivenPlansView from './components/GoalDrivenPlansView';
import AdaptiveLevelsView from './components/AdaptiveLevelsView';

const queryClient = new QueryClient();

type AppView =
  | 'workout'
  | 'meal'
  | 'schedule'
  | 'goals'
  | 'adaptive';

function AppContent() {
  const { data: profile, isLoading } = useGetProfile();
  const [currentView, setCurrentView] = useState<AppView>('workout');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary text-xl font-barlow-condensed tracking-widest animate-pulse">
          LOADING...
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <OnboardingFlow
        onComplete={() => {
          setCurrentView('workout');
        }}
      />
    );
  }

  switch (currentView) {
    case 'meal':
      return (
        <MealPlanView
          onNavigateToWorkout={() => setCurrentView('workout')}
          onNavigateToSchedule={() => setCurrentView('schedule')}
          onNavigateToGoals={() => setCurrentView('goals')}
          onNavigateToAdaptive={() => setCurrentView('adaptive')}
        />
      );
    case 'schedule':
      return (
        <WeeklyScheduleView
          onNavigateToWorkout={() => setCurrentView('workout')}
          onNavigateToMeal={() => setCurrentView('meal')}
          onNavigateToGoals={() => setCurrentView('goals')}
          onNavigateToAdaptive={() => setCurrentView('adaptive')}
        />
      );
    case 'goals':
      return (
        <GoalDrivenPlansView
          onNavigateToWorkout={() => setCurrentView('workout')}
          onNavigateToMeal={() => setCurrentView('meal')}
          onNavigateToSchedule={() => setCurrentView('schedule')}
          onNavigateToAdaptive={() => setCurrentView('adaptive')}
        />
      );
    case 'adaptive':
      return (
        <AdaptiveLevelsView
          onNavigateToWorkout={() => setCurrentView('workout')}
          onNavigateToMeal={() => setCurrentView('meal')}
          onNavigateToSchedule={() => setCurrentView('schedule')}
          onNavigateToGoals={() => setCurrentView('goals')}
        />
      );
    case 'workout':
    default:
      return (
        <WorkoutPlanView
          onNavigateToMeal={() => setCurrentView('meal')}
          onNavigateToSchedule={() => setCurrentView('schedule')}
          onNavigateToGoals={() => setCurrentView('goals')}
          onNavigateToAdaptive={() => setCurrentView('adaptive')}
        />
      );
  }
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
