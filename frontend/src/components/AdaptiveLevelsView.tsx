import React, { useState } from 'react';
import { CheckCircle2, Dumbbell, Utensils, Calendar, Target } from 'lucide-react';
import { FitnessLevel } from '../backend';
import type { Profile } from '../backend';
import { useGetProfile, useSaveProfile, useGenerateWorkoutPlan } from '../hooks/useLocalQueries';

interface AdaptiveLevelsViewProps {
  onNavigateToWorkout: () => void;
  onNavigateToMeal: () => void;
  onNavigateToSchedule: () => void;
  onNavigateToGoals: () => void;
}

const levels = [
  {
    value: FitnessLevel.beginner,
    label: 'Beginner',
    icon: '🌱',
    desc: 'New to fitness or returning after a long break',
    criteria: ['0–6 months of training', 'Focus on form and consistency', 'Lower intensity workouts'],
  },
  {
    value: FitnessLevel.intermediate,
    label: 'Intermediate',
    icon: '⚡',
    desc: 'Consistent training for 6+ months',
    criteria: ['6 months – 2 years of training', 'Comfortable with compound movements', 'Moderate intensity workouts'],
  },
  {
    value: FitnessLevel.advanced,
    label: 'Advanced',
    icon: '🔥',
    desc: 'Years of dedicated training experience',
    criteria: ['2+ years of consistent training', 'Strong foundation in all movements', 'High intensity workouts'],
  },
];

export default function AdaptiveLevelsView({
  onNavigateToWorkout,
  onNavigateToMeal,
  onNavigateToSchedule,
  onNavigateToGoals,
}: AdaptiveLevelsViewProps) {
  const { data: profile } = useGetProfile();
  const saveProfile = useSaveProfile();
  const generateWorkout = useGenerateWorkoutPlan();

  const [selectedLevel, setSelectedLevel] = useState<FitnessLevel>(
    profile?.fitnessLevel ?? FitnessLevel.beginner
  );
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const isLoading = saveProfile.isPending || generateWorkout.isPending;

  const handleApply = async () => {
    if (!profile) return;
    setError('');
    setSuccess(false);
    const updated: Profile = { ...profile, fitnessLevel: selectedLevel };
    try {
      saveProfile.mutate(updated);
      await generateWorkout.mutateAsync(updated);
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
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-barlow-condensed font-bold text-foreground tracking-wide mb-1">
            ADAPTIVE LEVELS
          </h1>
          <p className="text-muted-foreground font-barlow text-sm">Adjust your fitness level to adapt your workout plan</p>
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
            onClick={onNavigateToGoals}
            className="flex items-center gap-2 justify-center border border-border text-foreground font-barlow text-sm px-3 py-2 rounded-xl hover:bg-muted transition-colors"
          >
            <Target className="w-4 h-4 text-primary" /> Goals
          </button>
        </div>

        <div className="space-y-4 mb-6">
          {levels.map((level) => (
            <button
              key={level.value}
              onClick={() => { setSelectedLevel(level.value); setSuccess(false); }}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                selectedLevel === level.value
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-card hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{level.icon}</span>
                  <div>
                    <div className="font-barlow-condensed font-bold text-lg text-foreground tracking-wide">
                      {level.label.toUpperCase()}
                    </div>
                    <div className="text-sm font-barlow text-muted-foreground">{level.desc}</div>
                  </div>
                </div>
                {selectedLevel === level.value && (
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                )}
              </div>
              <ul className="space-y-1 mt-2">
                {level.criteria.map((c, i) => (
                  <li key={i} className="text-xs font-barlow text-muted-foreground flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary inline-block" />
                    {c}
                  </li>
                ))}
              </ul>
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
            Workout plan updated for your new level!
          </div>
        )}

        <button
          onClick={handleApply}
          disabled={isLoading || selectedLevel === profile?.fitnessLevel}
          className="w-full bg-primary text-primary-foreground font-barlow-condensed font-bold tracking-widest py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
              {saveProfile.isPending ? 'Saving...' : 'Regenerating...'}
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
