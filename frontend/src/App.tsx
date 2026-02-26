import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useQueries';
import { HomePage } from './pages/HomePage';
import OnboardingFlow from './components/OnboardingFlow';
import WorkoutPlanView from './components/WorkoutPlanView';
import { MealPlanView } from './components/MealPlanView';
import { AdaptiveLevelsView } from './components/AdaptiveLevelsView';
import { WeeklyScheduleView } from './components/WeeklyScheduleView';
import GoalDrivenPlansView from './components/GoalDrivenPlansView';
import LoginScreen from './components/LoginScreen';
import ProfileSetupModal from './components/ProfileSetupModal';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

type View =
  | 'home'
  | 'onboarding'
  | 'plan'
  | 'meal-plan'
  | 'adaptive-levels'
  | 'weekly-schedule'
  | 'goal-driven-plans';

function AppContent() {
  const [view, setView] = useState<View>('home');
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();

  // Show loading while identity is initializing
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-body">Loading Powerpal...</p>
        </div>
      </div>
    );
  }

  // Not authenticated — show login screen
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Authenticated but profile not yet fetched
  if (profileLoading && !profileFetched) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground font-body">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Authenticated but no profile — show profile setup
  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  if (showProfileSetup) {
    return (
      <ProfileSetupModal
        onComplete={() => {
          setView('plan');
        }}
      />
    );
  }

  const goHome = () => setView('home');
  const goPlan = () => setView('plan');
  const goMealPlan = () => setView('meal-plan');
  const goAdaptiveLevels = () => setView('adaptive-levels');
  const goWeeklySchedule = () => setView('weekly-schedule');
  const goGoalDrivenPlans = () => setView('goal-driven-plans');
  const goOnboarding = () => setView('onboarding');

  const renderView = () => {
    switch (view) {
      case 'home':
        return (
          <HomePage
            hasProfile={!!userProfile}
            profileName={userProfile?.name}
            onStartOnboarding={goOnboarding}
            onViewPlan={goPlan}
            onViewMealPlan={goMealPlan}
            onViewAdaptiveLevels={goAdaptiveLevels}
            onViewWeeklySchedule={goWeeklySchedule}
            onViewGoalDrivenPlans={goGoalDrivenPlans}
          />
        );
      case 'onboarding':
        return <OnboardingFlow onComplete={goPlan} onBack={goHome} />;
      case 'plan':
        return (
          <WorkoutPlanView
            onBack={goHome}
            onViewMealPlan={goMealPlan}
            onViewAdaptiveLevels={goAdaptiveLevels}
            onViewWeeklySchedule={goWeeklySchedule}
            onViewGoalDrivenPlans={goGoalDrivenPlans}
          />
        );
      case 'meal-plan':
        return (
          <MealPlanView
            onEditProfile={goOnboarding}
            onViewWorkout={goPlan}
            onViewAdaptiveLevels={goAdaptiveLevels}
            onViewWeeklySchedule={goWeeklySchedule}
            onViewGoalDrivenPlans={goGoalDrivenPlans}
          />
        );
      case 'adaptive-levels':
        return (
          <AdaptiveLevelsView
            onBack={goPlan}
            onViewPlan={goPlan}
          />
        );
      case 'weekly-schedule':
        return (
          <WeeklyScheduleView
            onBack={goPlan}
            onViewPlan={goPlan}
          />
        );
      case 'goal-driven-plans':
        return (
          <GoalDrivenPlansView
            onBack={goPlan}
            onViewMealPlan={goMealPlan}
            onViewAdaptiveLevels={goAdaptiveLevels}
            onViewWeeklySchedule={goWeeklySchedule}
            onPlanApplied={goPlan}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderView()}
      <Toaster />
    </>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
