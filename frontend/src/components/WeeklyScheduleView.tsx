import React, { useState } from 'react';
import { RefreshCw, ChevronDown, ChevronUp, Dumbbell, Utensils, Target, TrendingUp, CheckCircle2, Circle } from 'lucide-react';
import { useGetProfile, useGetWorkoutPlan, useGenerateWorkoutPlan } from '../hooks/useLocalQueries';

interface WeeklyScheduleViewProps {
  onNavigateToWorkout: () => void;
  onNavigateToMeal: () => void;
  onNavigateToGoals: () => void;
  onNavigateToAdaptive: () => void;
}

export default function WeeklyScheduleView({
  onNavigateToWorkout,
  onNavigateToMeal,
  onNavigateToGoals,
  onNavigateToAdaptive,
}: WeeklyScheduleViewProps) {
  const { data: profile } = useGetProfile();
  const { data: plan, isLoading } = useGetWorkoutPlan();
  const generatePlan = useGenerateWorkoutPlan();
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

  const handleRegenerate = () => {
    generatePlan.mutate(undefined);
  };

  const toggleComplete = (idx: number) => {
    setCompletedDays((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const trainingDays = plan?.days.filter((d) => !d.rest).length ?? 0;
  const completedCount = [...completedDays].filter((idx) => plan?.days[idx] && !plan.days[idx].rest).length;

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
            WEEKLY SCHEDULE
          </h1>
          <p className="text-muted-foreground font-barlow text-sm">Track your workouts day by day</p>
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

        {/* Progress */}
        {plan && (
          <div className="bg-card border border-border rounded-xl p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-barlow-condensed font-bold text-foreground tracking-wide">WEEKLY PROGRESS</span>
              <span className="text-primary font-barlow font-semibold text-sm">
                {completedCount}/{trainingDays} days
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: trainingDays > 0 ? `${(completedCount / trainingDays) * 100}%` : '0%' }}
              />
            </div>
          </div>
        )}

        {/* Regenerate */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleRegenerate}
            disabled={generatePlan.isPending}
            className="flex items-center gap-2 bg-primary text-primary-foreground font-barlow-condensed font-bold tracking-widest px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {generatePlan.isPending ? (
              <span className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {plan ? 'REGENERATE' : 'BUILD PLAN'}
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-12 text-muted-foreground font-barlow animate-pulse">Loading...</div>
        )}

        {!isLoading && !plan && (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-barlow">No plan yet. Hit "BUILD PLAN" to get started!</p>
          </div>
        )}

        {plan && (
          <div className="space-y-3">
            {plan.days.map((day, idx) => (
              <div
                key={idx}
                className={`rounded-xl border transition-all ${
                  day.rest
                    ? 'border-border bg-muted/30'
                    : completedDays.has(idx)
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border bg-card'
                }`}
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => !day.rest && setExpandedDay(expandedDay === idx ? null : idx)}
                >
                  <div className="flex items-center gap-3">
                    {!day.rest && (
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleComplete(idx); }}
                        className="text-primary hover:text-primary/80 transition-colors"
                      >
                        {completedDays.has(idx) ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                    )}
                    <h3 className="font-barlow-condensed font-bold text-lg tracking-wide text-foreground">
                      {day.day.toUpperCase()}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {day.rest ? (
                      <span className="text-xs font-barlow font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        REST DAY
                      </span>
                    ) : (
                      <>
                        <span className="text-xs font-barlow font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          TRAINING
                        </span>
                        {expandedDay === idx ? (
                          <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        )}
                      </>
                    )}
                  </div>
                </div>

                {expandedDay === idx && !day.rest && day.exercises.length > 0 && (
                  <div className="px-4 pb-4 space-y-2 border-t border-border pt-3">
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
