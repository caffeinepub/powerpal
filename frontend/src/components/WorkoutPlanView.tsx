import React from 'react';
import { Dumbbell, RefreshCw, Utensils, Calendar, Target, TrendingUp } from 'lucide-react';
import { useGetProfile, useGetWorkoutPlan, useGenerateWorkoutPlan } from '../hooks/useLocalQueries';
import { PowerpalMascot } from './PowerpalMascot';

interface WorkoutPlanViewProps {
  onNavigateToMeal: () => void;
  onNavigateToSchedule: () => void;
  onNavigateToGoals: () => void;
  onNavigateToAdaptive: () => void;
}

export default function WorkoutPlanView({
  onNavigateToMeal,
  onNavigateToSchedule,
  onNavigateToGoals,
  onNavigateToAdaptive,
}: WorkoutPlanViewProps) {
  const { data: profile } = useGetProfile();
  const { data: plan, isLoading: planLoading } = useGetWorkoutPlan();
  const generatePlan = useGenerateWorkoutPlan();

  const handleGenerate = () => {
    if (profile) {
      generatePlan.mutate(profile);
    }
  };

  const isGenerating = generatePlan.isPending;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground font-barlow text-sm hidden sm:block">
              Hey, {profile?.name}!
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-6">
          <img
            src="/assets/generated/plan-banner.dim_1200x300.png"
            alt="Workout Plan"
            className="w-full h-32 sm:h-48 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-700/90 via-green-600/70 to-green-500/40 flex items-center px-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-barlow-condensed font-bold text-white tracking-wide drop-shadow-md">
                YOUR WORKOUT PLAN
              </h1>
              <p className="text-green-100 font-barlow text-sm drop-shadow">
                {profile?.goal?.replace(/([A-Z])/g, ' $1').trim()} · {profile?.fitnessLevel}
              </p>
            </div>
          </div>
        </div>

        {/* Mascot + Generate */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
          <PowerpalMascot size="sm" context="plan" />
          <div className="flex-1 flex flex-wrap gap-2 justify-center sm:justify-start">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 bg-primary text-primary-foreground font-barlow-condensed font-bold tracking-widest px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {isGenerating ? (
                <span className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {plan ? 'REGENERATE' : 'BUILD PLAN'}
            </button>
          </div>
        </div>

        {/* Nav buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
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
          <button
            onClick={onNavigateToAdaptive}
            className="flex items-center gap-2 justify-center border border-border text-foreground font-barlow text-sm px-3 py-2 rounded-xl hover:bg-muted transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-primary" /> Levels
          </button>
        </div>

        {/* Plan */}
        {planLoading && (
          <div className="text-center py-12 text-muted-foreground font-barlow animate-pulse">Loading plan...</div>
        )}

        {!planLoading && !plan && (
          <div className="text-center py-12">
            <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-barlow">No plan yet. Hit "BUILD PLAN" to get started!</p>
          </div>
        )}

        {plan && (
          <div className="space-y-3">
            {plan.days.map((day, idx) => (
              <div
                key={idx}
                className={`rounded-xl border p-4 ${day.rest ? 'border-border bg-muted/30' : 'border-border bg-card'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-barlow-condensed font-bold text-lg tracking-wide text-foreground">
                    {day.day.toUpperCase()}
                  </h3>
                  {day.rest ? (
                    <span className="text-xs font-barlow font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      REST DAY
                    </span>
                  ) : (
                    <span className="text-xs font-barlow font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                      TRAINING
                    </span>
                  )}
                </div>
                {!day.rest && day.exercises.length > 0 && (
                  <div className="space-y-2">
                    {day.exercises.map((ex, eIdx) => (
                      <div key={eIdx} className="flex items-center justify-between text-sm font-barlow">
                        <span className="text-foreground font-semibold">{ex.name}</span>
                        <span className="text-muted-foreground">
                          {Number(ex.durationMinutes) > 0
                            ? `${ex.durationMinutes} min`
                            : `${ex.sets}×${ex.reps}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {generatePlan.isError && (
          <p className="text-destructive text-sm mt-4 font-barlow text-center">
            Failed to generate plan. Please try again.
          </p>
        )}
      </main>

      {/* Footer */}
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
