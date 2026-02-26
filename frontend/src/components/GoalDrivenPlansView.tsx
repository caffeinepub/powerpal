import { useState } from 'react';
import {
  useSaveCallerUserProfile,
  useGenerateWorkoutPlan,
  useGenerateMealPlan,
  useGetCallerUserProfile,
} from '../hooks/useQueries';
import { FitnessGoal } from '../backend';
import { PowerpalMascot } from './PowerpalMascot';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Target,
  Zap,
  Dumbbell,
  Wind,
  Leaf,
  Activity,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface GoalDrivenPlansViewProps {
  onBack: () => void;
  onViewMealPlan: () => void;
  onViewAdaptiveLevels: () => void;
  onViewWeeklySchedule: () => void;
  onPlanApplied: () => void;
}

const goalOptions = [
  {
    value: FitnessGoal.weightLoss,
    label: 'Weight Loss',
    icon: Zap,
    desc: 'Burn fat with cardio-focused training and caloric deficit meal plans.',
    details: ['30-min cardio sessions', 'Bodyweight circuits', 'Low-calorie meal plans', '3-4 active days/week'],
    color: 'text-yellow-400',
  },
  {
    value: FitnessGoal.muscleGain,
    label: 'Muscle Gain',
    icon: Dumbbell,
    desc: 'Build strength and size with progressive overload and high-protein nutrition.',
    details: ['Heavy compound lifts', '4×8-10 rep ranges', 'High-protein meals', '4 active days/week'],
    color: 'text-primary',
  },
  {
    value: FitnessGoal.endurance,
    label: 'Endurance',
    icon: Wind,
    desc: 'Improve stamina and cardiovascular fitness with long-distance and interval training.',
    details: ['Long-distance running', 'Interval training', 'Carb-rich meal plans', '4 active days/week'],
    color: 'text-blue-400',
  },
  {
    value: FitnessGoal.flexibility,
    label: 'Flexibility',
    icon: Leaf,
    desc: 'Increase mobility and range of motion with yoga and stretching routines.',
    details: ['60-min yoga sessions', 'Daily stretching', 'Anti-inflammatory meals', '4 active days/week'],
    color: 'text-emerald-400',
  },
  {
    value: FitnessGoal.generalFitness,
    label: 'General Fitness',
    icon: Activity,
    desc: 'Balanced approach to overall health combining cardio, strength, and nutrition.',
    details: ['Mixed cardio & strength', 'Balanced meal plans', 'Moderate intensity', '4 active days/week'],
    color: 'text-accent',
  },
];

export default function GoalDrivenPlansView({
  onBack,
  onViewMealPlan,
  onViewAdaptiveLevels,
  onViewWeeklySchedule,
  onPlanApplied,
}: GoalDrivenPlansViewProps) {
  const { data: userProfile } = useGetCallerUserProfile();
  const [selectedGoal, setSelectedGoal] = useState<FitnessGoal>(
    userProfile?.goal ?? FitnessGoal.generalFitness
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const saveProfile = useSaveCallerUserProfile();
  const generateWorkout = useGenerateWorkoutPlan();
  const generateMeal = useGenerateMealPlan();

  const isApplying =
    saveProfile.isPending || generateWorkout.isPending || generateMeal.isPending;

  const handleApply = async () => {
    if (!userProfile) return;
    setError(null);
    setSuccess(false);
    try {
      await saveProfile.mutateAsync({ ...userProfile, goal: selectedGoal });
      await generateWorkout.mutateAsync();
      await generateMeal.mutateAsync();
      setSuccess(true);
      setTimeout(() => onPlanApplied(), 1200);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Failed to apply goal. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border/30 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <h1 className="font-display text-lg font-black uppercase tracking-widest text-foreground">
              Goal-Driven Plans
            </h1>
          </div>
          <div className="w-16" />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Mascot */}
        <div className="flex justify-center">
          <PowerpalMascot context="plan" size="sm" animate={true} />
        </div>

        {/* Nav buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="ghost"
            onClick={onViewMealPlan}
            size="sm"
            className="font-display uppercase tracking-wide text-xs text-muted-foreground hover:text-foreground border border-border/30"
          >
            Meal Plan
          </Button>
          <Button
            variant="ghost"
            onClick={onViewAdaptiveLevels}
            size="sm"
            className="font-display uppercase tracking-wide text-xs text-muted-foreground hover:text-foreground border border-border/30"
          >
            Adaptive Levels
          </Button>
          <Button
            variant="ghost"
            onClick={onViewWeeklySchedule}
            size="sm"
            className="font-display uppercase tracking-wide text-xs text-muted-foreground hover:text-foreground border border-border/30"
          >
            Weekly Schedule
          </Button>
        </div>

        <div>
          <h2 className="font-display text-2xl font-black uppercase tracking-tight text-foreground mb-1">
            Choose Your Goal
          </h2>
          <p className="text-muted-foreground font-body text-sm">
            Select a goal to regenerate your workout and meal plans.
          </p>
        </div>

        {/* Goal cards */}
        <div className="space-y-3">
          {goalOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedGoal === option.value;
            const isCurrent = userProfile?.goal === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setSelectedGoal(option.value)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-[0_0_16px_oklch(0.7_0.22_142/0.3)]'
                    : 'border-border/40 bg-card hover:border-primary/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${option.color}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display font-bold uppercase tracking-wide text-foreground">
                        {option.label}
                      </span>
                      {isCurrent && (
                        <Badge
                          variant="outline"
                          className="text-xs border-primary/40 text-primary font-body"
                        >
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground font-body mb-2">{option.desc}</p>
                    <div className="flex flex-wrap gap-1">
                      {option.details.map((detail) => (
                        <span
                          key={detail}
                          className="text-xs bg-background/60 border border-border/40 rounded-full px-2 py-0.5 text-muted-foreground font-body"
                        >
                          {detail}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Error / Success */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-primary/40 bg-primary/10">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <AlertDescription className="text-primary">
              Goal applied! Redirecting to your new plan...
            </AlertDescription>
          </Alert>
        )}

        {/* Apply button */}
        <Button
          onClick={handleApply}
          disabled={isApplying || !userProfile || success}
          size="lg"
          className="w-full font-display uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isApplying ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              {saveProfile.isPending
                ? 'Saving Goal...'
                : generateWorkout.isPending
                ? 'Building Workout...'
                : 'Building Meal Plan...'}
            </span>
          ) : (
            'Apply Goal & Regenerate Plans'
          )}
        </Button>
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
