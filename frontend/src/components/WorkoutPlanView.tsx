import { useState } from 'react';
import { useGetWorkoutPlan, useGenerateWorkoutPlan, useGetCallerUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { PowerpalMascot } from './PowerpalMascot';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  RefreshCw,
  Utensils,
  Layers,
  Calendar,
  Target,
  Dumbbell,
  Clock,
  RotateCcw,
  LogOut,
  AlertCircle,
} from 'lucide-react';

interface WorkoutPlanViewProps {
  onBack: () => void;
  onViewMealPlan: () => void;
  onViewAdaptiveLevels: () => void;
  onViewWeeklySchedule: () => void;
  onViewGoalDrivenPlans: () => void;
}

export default function WorkoutPlanView({
  onBack,
  onViewMealPlan,
  onViewAdaptiveLevels,
  onViewWeeklySchedule,
  onViewGoalDrivenPlans,
}: WorkoutPlanViewProps) {
  const { data: plan, isLoading: planLoading } = useGetWorkoutPlan();
  const { data: userProfile } = useGetCallerUserProfile();
  const generatePlan = useGenerateWorkoutPlan();
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [generateError, setGenerateError] = useState<string | null>(null);

  const isAuthenticated = !!identity;

  const handleGenerate = async () => {
    setGenerateError(null);
    try {
      await generatePlan.mutateAsync();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setGenerateError(msg || 'Failed to generate workout plan. Please try again.');
    }
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const canGenerate = !!userProfile && isAuthenticated;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/30 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-primary" />
            <h1 className="font-display text-lg font-black uppercase tracking-widest text-foreground">
              My Plan
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors text-sm font-body"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Mascot */}
        <div className="flex justify-center">
          <PowerpalMascot context="plan" size="sm" animate={true} />
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Button
            onClick={handleGenerate}
            disabled={generatePlan.isPending || !canGenerate}
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-display uppercase tracking-wide text-xs"
          >
            {generatePlan.isPending ? (
              <>
                <span className="w-3 h-3 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Building...
              </>
            ) : (
              <>
                <RefreshCw className="w-3 h-3" />
                {plan ? 'Regenerate' : 'Build My Plan'}
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onViewMealPlan}
            className="flex items-center gap-2 border-border/60 font-display uppercase tracking-wide text-xs"
          >
            <Utensils className="w-3 h-3" />
            Meal Plan
          </Button>
          <Button
            variant="ghost"
            onClick={onViewWeeklySchedule}
            className="flex items-center gap-2 font-display uppercase tracking-wide text-xs text-muted-foreground hover:text-foreground"
          >
            <Calendar className="w-3 h-3" />
            Schedule
          </Button>
          <Button
            variant="ghost"
            onClick={onViewGoalDrivenPlans}
            className="flex items-center gap-2 font-display uppercase tracking-wide text-xs text-muted-foreground hover:text-foreground"
          >
            <Target className="w-3 h-3" />
            Goals
          </Button>
        </div>

        {/* Adaptive levels button */}
        <Button
          variant="ghost"
          onClick={onViewAdaptiveLevels}
          className="w-full flex items-center gap-2 font-display uppercase tracking-wide text-xs text-muted-foreground hover:text-foreground border border-border/30"
        >
          <Layers className="w-3 h-3" />
          Adaptive Levels
        </Button>

        {/* Error */}
        {generateError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{generateError}</AlertDescription>
          </Alert>
        )}

        {/* No profile warning */}
        {!userProfile && !planLoading && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please complete your profile setup to build a workout plan.
            </AlertDescription>
          </Alert>
        )}

        {/* Loading */}
        {planLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground font-body">Loading your plan...</p>
          </div>
        )}

        {/* No plan yet */}
        {!planLoading && !plan && !generatePlan.isPending && (
          <div className="text-center py-16 space-y-4">
            <Dumbbell className="w-16 h-16 text-primary/30 mx-auto" />
            <h2 className="font-display text-2xl font-black uppercase tracking-tight text-foreground">
              No Plan Yet
            </h2>
            <p className="text-muted-foreground font-body max-w-sm mx-auto">
              Click "Build My Plan" above to generate your personalized workout plan based on your goals.
            </p>
            <Button
              onClick={handleGenerate}
              disabled={generatePlan.isPending || !canGenerate}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-display uppercase tracking-widest"
            >
              Build My Plan
            </Button>
          </div>
        )}

        {/* Generating state */}
        {generatePlan.isPending && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground font-body">Building your personalized plan...</p>
          </div>
        )}

        {/* Plan display */}
        {plan && !generatePlan.isPending && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-black uppercase tracking-tight text-foreground">
                Weekly Schedule
              </h2>
              {userProfile && (
                <Badge
                  variant="outline"
                  className="font-body text-xs border-primary/40 text-primary"
                >
                  {userProfile.goal}
                </Badge>
              )}
            </div>

            <div className="space-y-3">
              {plan.days.map((day, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl border p-4 transition-all ${
                    day.rest ? 'border-border/30 bg-card/50' : 'border-border/60 bg-card'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-bold uppercase tracking-wide text-foreground">
                      {day.day}
                    </h3>
                    {day.rest ? (
                      <Badge variant="secondary" className="font-body text-xs">
                        Rest Day
                      </Badge>
                    ) : (
                      <Badge className="font-body text-xs bg-primary/20 text-primary border-primary/30">
                        Active
                      </Badge>
                    )}
                  </div>

                  {!day.rest && day.exercises.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {day.exercises.map((exercise, eIdx) => (
                        <div
                          key={eIdx}
                          className="flex items-center justify-between bg-background/60 rounded-lg px-3 py-2"
                        >
                          <div className="flex items-center gap-2">
                            <Dumbbell className="w-3 h-3 text-primary flex-shrink-0" />
                            <span className="font-body text-sm text-foreground">
                              {exercise.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
                            {Number(exercise.sets) > 0 && (
                              <span>
                                <RotateCcw className="w-3 h-3 inline mr-1" />
                                {Number(exercise.sets)}×{Number(exercise.reps)}
                              </span>
                            )}
                            {Number(exercise.durationMinutes) > 0 && (
                              <span>
                                <Clock className="w-3 h-3 inline mr-1" />
                                {Number(exercise.durationMinutes)}min
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {day.rest && (
                    <p className="text-sm text-muted-foreground font-body mt-1">
                      Recovery & rest — your muscles grow on rest days!
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center border-t border-border/30 mt-8">
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} Powerpal. Built with{' '}
          <span className="text-red-400">♥</span> using{' '}
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
