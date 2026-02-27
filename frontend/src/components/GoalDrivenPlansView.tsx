import React, { useState } from 'react';
import { CheckCircle2, Dumbbell, Utensils, Calendar, TrendingUp } from 'lucide-react';
import { FitnessGoal } from '../backend';
import type { Profile } from '../backend';
import { useGetProfile, useSaveProfile, useGenerateWorkoutPlan, useGenerateMealPlan } from '../hooks/useLocalQueries';
import { PowerpalMascot } from './PowerpalMascot';

interface GoalDrivenPlansViewProps {
  onNavigateToWorkout: () => void;
  onNavigateToMeal: () => void;
  onNavigateToSchedule: () => void;
  onNavigateToAdaptive: () => void;
}

const goals = [
  { value: FitnessGoal.weightLoss, label: 'Weight Loss', icon: '🔥', desc: 'Burn fat and slim down' },
  { value: FitnessGoal.muscleGain, label: 'Muscle Gain', icon: '💪', desc: 'Build strength and size' },
  { value: FitnessGoal.endurance, label: 'Endurance', icon: '🏃', desc: 'Improve stamina and cardio' },
  { value: FitnessGoal.flexibility, label: 'Flexibility', icon: '🧘', desc: 'Increase mobility and range' },
  { value: FitnessGoal.generalFitness, label: 'General Fitness', icon: '⚡', desc: 'Overall health and wellness' },
];

export default function GoalDrivenPlansView({
  onNavigateToWorkout,
  onNavigateToMeal,
  onNavigateToSchedule,
  onNavigateToAdaptive,
}: GoalDrivenPlansViewProps) {
  const { data: profile } = useGetProfile();
  const saveProfile = useSaveProfile();
  const generateWorkout = useGenerateWorkoutPlan();
  const generateMeal = useGenerateMealPlan();

  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal>(
    profile?.goal ?? FitnessGoal.generalFitness
  );
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isLoading = saveProfile.isPending || generateWorkout.isPending || generateMeal.isPending;

  const getLoadingLabel = () => {
    if (saveProfile.isPending) return 'Saving profile...';
    if (generateWorkout.isPending) return 'Generating workout...';
    if (generateMeal.isPending) return 'Generating meal plan...';
    return '';
  };

  const handleApply = async () => {
    if (!profile) return;
    setError('');
    setSuccess(false);
    const updated: Profile = { ...profile, goal: selectedGoal };
    try {
      saveProfile.mutate(updated);
      await generateWorkout.mutateAsync(updated);
      await generateMeal.mutateAsync(updated);
      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <img
            src="/assets/generated/powerpal-logo.dim_600x200.png"
            alt="Powerpal"
            className="h-10 object-contain"
            style={{
              filter:
                'drop-shadow(0 0 10px oklch(0.65 0.25 145 / 0.6)) hue-rotate(80deg) saturate(1.6) brightness(1.1)',
            }}
          />
          <span className="text-muted-foreground font-barlow text-sm hidden sm:block">Hey, {profile?.name}!</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <PowerpalMascot size="sm" context="plan" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-barlow-condensed font-bold text-foreground tracking-wide">
              GOAL-DRIVEN PLANS
            </h1>
            <p className="text-muted-foreground font-barlow text-sm">Change your goal to regenerate your plans</p>
          </div>
        </div>

        {/* Nav */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          <button
            onClick={onNavigateToWorkout}
            className="flex items-center gap-2 justify-center border border-border text-foreground font-barlow text-sm px-3 py-2 rounded-xl hover:bg-muted transition-colors"
          >
            <Dumbbell className="w-4 h-4 text-primary" /> Workout
          </button>
          <button
            onClick={onNavigateToMeal}
            className="flex items-center gap-2 justify-center border border-border text-foreground font-barlow text-sm px-3 py-2 rounded-xl hover:bg-muted transition-colors"
          >
            <Utensils className="w-4 h-4 text-primary" /> Meal Plan
          </button>
          <button
            onClick={onNavigateToSchedule}
            className="flex items-center gap-2 justify-center border border-border text-foreground font-barlow text-sm px-3 py-2 rounded-xl hover:bg-muted transition-colors"
          >
            <Calendar className="w-4 h-4 text-primary" /> Schedule
          </button>
          <button
            onClick={onNavigateToAdaptive}
            className="flex items-center gap-2 justify-center border border-border text-foreground font-barlow text-sm px-3 py-2 rounded-xl hover:bg-muted transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-primary" /> Levels
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {goals.map((g) => (
            <button
              key={g.value}
              onClick={() => { setSelectedGoal(g.value); setSuccess(false); }}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all font-barlow flex items-center gap-3 ${
                selectedGoal === g.value
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <span className="text-2xl">{g.icon}</span>
              <div>
                <div className="font-semibold text-foreground">{g.label}</div>
                <div className="text-sm text-muted-foreground">{g.desc}</div>
              </div>
              {selectedGoal === g.value && (
                <CheckCircle2 className="w-5 h-5 text-primary ml-auto" />
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-xl p-3 mb-4 font-barlow text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-primary/10 border border-primary/30 text-primary rounded-xl p-3 mb-4 font-barlow text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Plans updated successfully!
          </div>
        )}

        <button
          onClick={handleApply}
          disabled={isLoading || selectedGoal === profile?.goal}
          className="w-full bg-primary text-primary-foreground font-barlow-condensed font-bold tracking-widest py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
              {getLoadingLabel()}
            </>
          ) : (
            'APPLY & REGENERATE'
          )}
        </button>
      </main>

      <footer className="border-t border-border mt-12 py-6 text-center text-muted-foreground text-xs font-barlow">
        <p>
          © {new Date().getFullYear()} Powerpal · Built with{' '}
          <span className="text-destructive">♥</span> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
