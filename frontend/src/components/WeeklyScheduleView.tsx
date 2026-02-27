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
    if (profile) generatePlan.mutate(profile);
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
          <p className="text-muted-foreground font-barlow text-sm">Track your weekly training progress</p>
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

        {/* Progress + Regenerate */}
        <div className="flex items-center justify-between mb-6 gap-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="font-barlow text-sm text-muted-foreground">Weekly Progress</span>
              <span className="font-barlow-condensed font-bold text-primary text-sm">
                {completedCount}/{trainingDays} days
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: trainingDays > 0 ? `${(completedCount / trainingDays) * 100}%` : '0%' }}
              />
            </div>
          </div>
          <button
            onClick={handleRegenerate}
            disabled={generatePlan.isPending}
            className="flex items-center gap-2 bg-primary text-primary-foreground font-barlow-condensed font-bold tracking-widest px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 text-sm flex-shrink-0"
          >
            {generatePlan.isPending ? (
              <span className="animate-spin w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
            REGENERATE
          </button>
        </div>

        {isLoading && (
          <div className="text-center py-12 text-muted-foreground font-barlow animate-pulse">Loading schedule...</div>
        )}

        {!isLoading && !plan && (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-barlow">No plan yet. Go to Workout Plan to build one!</p>
          </div>
        )}

        {plan && (
          <div className="space-y-2">
            {plan.days.map((day, idx) => {
              const isExpanded = expandedDay === idx;
              const isCompleted = completedDays.has(idx);
              const isTraining = !day.rest;

              return (
                <div
                  key={idx}
                  className={`rounded-xl border transition-all ${
                    isCompleted
                      ? 'border-primary/40 bg-primary/5'
                      : day.rest
                      ? 'border-border bg-muted/20'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-center gap-3 p-4">
                    {/* Complete toggle */}
                    {isTraining && (
                      <button
                        onClick={() => toggleComplete(idx)}
                        className="flex-shrink-0 text-primary hover:text-primary/80 transition-colors"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground" />
                        )}
                      </button>
                    )}
                    {day.rest && <div className="w-5 h-5 flex-shrink-0" />}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-barlow-condensed font-bold text-foreground tracking-wide">
                          {day.day.toUpperCase()}
                        </span>
                        {day.rest ? (
                          <span className="text-xs font-barlow text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            REST
                          </span>
                        ) : (
                          <span className={`text-xs font-barlow font-semibold px-2 py-0.5 rounded-full ${
                            isCompleted ? 'text-primary bg-primary/10' : 'text-primary bg-primary/10'
                          }`}>
                            {isCompleted ? '✓ DONE' : `${day.exercises.length} EXERCISES`}
                          </span>
                        )}
                      </div>
                    </div>

                    {isTraining && day.exercises.length > 0 && (
                      <button
                        onClick={() => setExpandedDay(isExpanded ? null : idx)}
                        className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    )}
                  </div>

                  {isExpanded && isTraining && (
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
              );
            })}
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
