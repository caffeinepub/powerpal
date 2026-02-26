import React, { useState } from 'react';
import { useGetWorkoutPlan, useGetProfile, useGenerateWorkoutPlan } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Calendar,
  Dumbbell,
  Moon,
  Zap,
  Clock,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  RefreshCw,
  Loader2,
  ChevronRight,
} from 'lucide-react';
import type { WorkoutDay, Exercise } from '../backend';
import { toast } from 'sonner';

interface WeeklyScheduleViewProps {
  onBack: () => void;
  onViewPlan: () => void;
}

const DAY_COLORS: Record<string, string> = {
  Monday: 'border-l-primary',
  Tuesday: 'border-l-blue-500',
  Wednesday: 'border-l-primary',
  Thursday: 'border-l-purple-500',
  Friday: 'border-l-primary',
  Saturday: 'border-l-accent',
  Sunday: 'border-l-primary',
};

const DAY_ACCENT: Record<string, string> = {
  Monday: 'text-primary',
  Tuesday: 'text-blue-400',
  Wednesday: 'text-primary',
  Thursday: 'text-purple-400',
  Friday: 'text-primary',
  Saturday: 'text-accent',
  Sunday: 'text-primary',
};

function ExerciseDetail({ exercise }: { exercise: Exercise }) {
  const hasReps = Number(exercise.reps) > 0;
  const hasDuration = Number(exercise.durationMinutes) > 0;
  const hasSets = Number(exercise.sets) > 0;

  return (
    <div className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Dumbbell className="w-3 h-3 text-primary" />
        </div>
        <span className="font-body text-sm text-foreground">{exercise.name}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {hasSets && hasReps && (
          <Badge variant="outline" className="border-primary/40 text-primary font-heading text-xs px-1.5 py-0">
            {String(exercise.sets)}×{String(exercise.reps)}
          </Badge>
        )}
        {hasDuration && (
          <Badge variant="outline" className="border-accent/40 text-accent font-heading text-xs px-1.5 py-0 flex items-center gap-0.5">
            <Clock className="w-2.5 h-2.5" />
            {String(exercise.durationMinutes)}m
          </Badge>
        )}
      </div>
    </div>
  );
}

function DayScheduleCard({
  workoutDay,
  isCompleted,
  onToggleComplete,
}: {
  workoutDay: WorkoutDay;
  isCompleted: boolean;
  onToggleComplete: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const borderColor = DAY_COLORS[workoutDay.day] || 'border-l-primary';
  const accentColor = DAY_ACCENT[workoutDay.day] || 'text-primary';

  return (
    <div
      className={`card-athletic border-l-4 ${borderColor} transition-all duration-200 ${
        isCompleted ? 'opacity-70' : ''
      }`}
    >
      {/* Day Header */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Completion Toggle */}
            <button
              onClick={onToggleComplete}
              className="flex-shrink-0 transition-transform hover:scale-110"
              title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-primary" />
              ) : (
                <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />
              )}
            </button>

            <div>
              <h3 className={`font-heading text-xl ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {workoutDay.day}
              </h3>
              {workoutDay.rest ? (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Moon className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground font-body text-xs">Rest Day</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Zap className={`w-3.5 h-3.5 ${accentColor}`} />
                  <span className={`font-body text-xs font-semibold uppercase tracking-wide ${accentColor}`}>
                    {workoutDay.exercises.length} Exercise{workoutDay.exercises.length !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isCompleted && (
              <Badge className="gradient-orange text-primary-foreground font-heading border-0 text-xs">
                Done ✓
              </Badge>
            )}
            {!workoutDay.rest && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center hover:bg-primary/10 transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Expanded Exercise List */}
      {isExpanded && !workoutDay.rest && (
        <div className="px-4 pb-4 border-t border-border/50 pt-3">
          <div className="space-y-0">
            {workoutDay.exercises.map((exercise, idx) => (
              <ExerciseDetail key={idx} exercise={exercise} />
            ))}
          </div>
        </div>
      )}

      {/* Rest day message */}
      {workoutDay.rest && (
        <div className="px-4 pb-3">
          <p className="text-muted-foreground text-xs font-body italic">
            Recovery is part of the process. Rest up, champ! 💤
          </p>
        </div>
      )}
    </div>
  );
}

export function WeeklyScheduleView({ onBack, onViewPlan }: WeeklyScheduleViewProps) {
  const { data: plan, isLoading } = useGetWorkoutPlan();
  const { data: profile } = useGetProfile();
  const generatePlan = useGenerateWorkoutPlan();
  const [completedDays, setCompletedDays] = useState<Set<string>>(new Set());

  const handleToggleComplete = (day: string) => {
    setCompletedDays((prev) => {
      const next = new Set(prev);
      if (next.has(day)) {
        next.delete(day);
        toast.info(`${day} marked as incomplete`);
      } else {
        next.add(day);
        toast.success(`${day} workout completed! 🎉`);
      }
      return next;
    });
  };

  const handleRegenerate = async () => {
    try {
      await generatePlan.mutateAsync();
      setCompletedDays(new Set());
      toast.success('Workout plan regenerated!');
    } catch (err) {
      toast.error('Failed to regenerate plan.');
    }
  };

  const workoutDays = plan?.days.filter((d) => !d.rest) ?? [];
  const completedCount = workoutDays.filter((d) => completedDays.has(d.day)).length;
  const totalWorkoutDays = workoutDays.length;
  const progressPct = totalWorkoutDays > 0 ? Math.round((completedCount / totalWorkoutDays) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header Banner */}
      <div className="relative w-full h-40 md:h-52 overflow-hidden">
        <img
          src="/assets/generated/plan-banner.dim_1200x300.png"
          alt="Weekly Schedule Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="/assets/generated/powerpal-logo.dim_600x200.png"
            alt="Powerpal"
            className="h-10 md:h-14 object-contain"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))' }}
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pb-16 -mt-4">
        {/* Back + Title */}
        <div className="flex items-center gap-3 mb-6 animate-slide-up">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground font-heading"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <div className="flex-1">
            <h1 className="font-heading text-3xl md:text-4xl text-foreground flex items-center gap-2">
              <Calendar className="w-7 h-7 text-primary" />
              Weekly Schedule
            </h1>
            {profile && (
              <p className="text-muted-foreground font-body text-sm mt-0.5">
                {profile.name}'s 7-day plan
              </p>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-xl bg-secondary" />
            ))}
          </div>
        ) : plan ? (
          <>
            {/* Progress Summary */}
            <div className="card-athletic p-5 mb-6 animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-heading text-lg text-foreground">Weekly Progress</h3>
                  <p className="text-muted-foreground font-body text-xs">
                    {completedCount} of {totalWorkoutDays} workouts completed
                  </p>
                </div>
                <div className="text-right">
                  <span className="font-heading text-3xl text-primary">{progressPct}%</span>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full gradient-orange rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              {completedCount === totalWorkoutDays && totalWorkoutDays > 0 && (
                <p className="text-primary font-heading text-sm mt-2 text-center animate-slide-up">
                  🏆 WEEK COMPLETE! INCREDIBLE WORK!
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6 flex-wrap">
              <Button
                onClick={handleRegenerate}
                disabled={generatePlan.isPending}
                variant="outline"
                className="border-primary/40 text-primary hover:bg-primary/10 font-heading text-base"
              >
                {generatePlan.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    New Schedule
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={onViewPlan}
                className="border-border text-foreground hover:bg-secondary font-heading text-base"
              >
                <Dumbbell className="w-4 h-4 mr-2" />
                Full Plan
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Day Cards */}
            <div className="space-y-3">
              {plan.days.map((day, idx) => (
                <DayScheduleCard
                  key={idx}
                  workoutDay={day}
                  isCompleted={completedDays.has(day.day)}
                  onToggleComplete={() => handleToggleComplete(day.day)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="card-athletic p-8 text-center animate-slide-up">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-body mb-4">
              No workout plan yet. Generate one to see your weekly schedule!
            </p>
            <Button
              onClick={handleRegenerate}
              disabled={generatePlan.isPending}
              className="gradient-orange text-primary-foreground font-heading glow-orange hover:opacity-90 transition-opacity border-0"
            >
              {generatePlan.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Dumbbell className="w-4 h-4 mr-2" />
                  Generate Workout Plan
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
