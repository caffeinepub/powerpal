import React, { useState } from 'react';
import { useGetCallerUserProfile, useSaveCallerUserProfile, useGenerateWorkoutPlan } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  TrendingUp,
  Zap,
  Star,
  Trophy,
  CheckCircle2,
  Loader2,
  Dumbbell,
  ChevronRight,
} from 'lucide-react';
import { FitnessLevel } from '../backend';
import { toast } from 'sonner';

interface AdaptiveLevelsViewProps {
  onBack: () => void;
  onViewPlan: () => void;
}

const LEVEL_CONFIG = {
  [FitnessLevel.beginner]: {
    label: 'Beginner',
    icon: Star,
    color: 'text-accent',
    borderColor: 'border-accent',
    bgColor: 'bg-accent/10',
    glowClass: 'glow-yellow',
    description:
      'Perfect for those just starting their fitness journey. Focus on building habits and learning proper form.',
    workoutStyle: 'Light weights, bodyweight exercises, shorter sessions (20–30 min)',
    frequency: '3 days per week',
    criteria: [
      'Complete 12 workouts consistently',
      'Hold a plank for 30 seconds',
      'Complete 10 push-ups with good form',
      'Feel comfortable with basic movements',
    ],
    nextLevel: FitnessLevel.intermediate,
  },
  [FitnessLevel.intermediate]: {
    label: 'Intermediate',
    icon: TrendingUp,
    color: 'text-primary',
    borderColor: 'border-primary',
    bgColor: 'bg-primary/10',
    glowClass: 'glow-orange',
    description:
      'You have a solid foundation. Time to increase intensity and challenge your body in new ways.',
    workoutStyle: 'Moderate weights, compound movements, medium sessions (30–45 min)',
    frequency: '4 days per week',
    criteria: [
      'Complete 24 workouts at intermediate level',
      'Hold a plank for 60 seconds',
      'Complete 20 push-ups with good form',
      'Squat your bodyweight for 10 reps',
    ],
    nextLevel: FitnessLevel.advanced,
  },
  [FitnessLevel.advanced]: {
    label: 'Advanced',
    icon: Trophy,
    color: 'text-accent',
    borderColor: 'border-accent',
    bgColor: 'bg-accent/10',
    glowClass: 'glow-yellow',
    description: 'Elite level training. High intensity, complex movements, and peak performance focus.',
    workoutStyle: 'Heavy weights, advanced techniques, longer sessions (45–60 min)',
    frequency: '5–6 days per week',
    criteria: [
      "You've reached the pinnacle!",
      'Focus on performance optimization',
      'Explore specialized training styles',
      'Consider competing or coaching others',
    ],
    nextLevel: null,
  },
};

const LEVEL_ORDER = [FitnessLevel.beginner, FitnessLevel.intermediate, FitnessLevel.advanced];

export function AdaptiveLevelsView({ onBack, onViewPlan }: AdaptiveLevelsViewProps) {
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const generateWorkoutPlan = useGenerateWorkoutPlan();
  const [selectedLevel, setSelectedLevel] = useState<FitnessLevel | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const currentLevel = profile?.fitnessLevel ?? FitnessLevel.beginner;
  const activeLevel = selectedLevel ?? currentLevel;
  const config = LEVEL_CONFIG[activeLevel];
  const LevelIcon = config.icon;

  const handleSaveLevel = async () => {
    if (!profile || !selectedLevel || selectedLevel === currentLevel) return;
    setIsSaving(true);
    try {
      await saveProfile.mutateAsync({
        name: profile.name,
        age: profile.age,
        fitnessLevel: selectedLevel,
        goal: profile.goal,
      });
      await generateWorkoutPlan.mutateAsync();
      toast.success(
        `Level updated to ${LEVEL_CONFIG[selectedLevel].label}! Your workout plan has been regenerated.`
      );
      setSelectedLevel(null);
    } catch {
      toast.error('Failed to update level. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges = selectedLevel !== null && selectedLevel !== currentLevel;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative w-full h-40 md:h-52 overflow-hidden">
        <img
          src="/assets/generated/plan-banner.dim_1200x300.png"
          alt="Adaptive Levels Banner"
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
              <TrendingUp className="w-7 h-7 text-primary" />
              Adaptive Levels
            </h1>
            <p className="text-muted-foreground font-body text-sm mt-0.5">
              Your fitness level shapes every workout plan
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full rounded-xl bg-secondary" />
            <Skeleton className="h-48 w-full rounded-xl bg-secondary" />
          </div>
        ) : (
          <>
            {/* Current Level Banner */}
            <div
              className={`card-athletic border-2 ${LEVEL_CONFIG[currentLevel].borderColor} p-5 mb-6 animate-slide-up`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${LEVEL_CONFIG[currentLevel].bgColor} flex items-center justify-center flex-shrink-0 ${LEVEL_CONFIG[currentLevel].glowClass}`}
                >
                  {React.createElement(LEVEL_CONFIG[currentLevel].icon, {
                    className: `w-7 h-7 ${LEVEL_CONFIG[currentLevel].color}`,
                  })}
                </div>
                <div className="flex-1">
                  <p className="text-muted-foreground font-body text-xs uppercase tracking-widest mb-0.5">
                    Current Level
                  </p>
                  <h2 className={`font-heading text-2xl ${LEVEL_CONFIG[currentLevel].color}`}>
                    {LEVEL_CONFIG[currentLevel].label}
                  </h2>
                  <p className="text-muted-foreground font-body text-sm mt-1">
                    {LEVEL_CONFIG[currentLevel].description}
                  </p>
                </div>
              </div>
            </div>

            {/* Level Selector */}
            <div className="mb-6 animate-slide-up">
              <h3 className="font-heading text-lg text-foreground mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Choose Your Level
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {LEVEL_ORDER.map((level) => {
                  const cfg = LEVEL_CONFIG[level];
                  const LvlIcon = cfg.icon;
                  const isActive = activeLevel === level;
                  const isCurrent = currentLevel === level;
                  return (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level === currentLevel ? null : level)}
                      className={`card-athletic p-4 text-center transition-all duration-200 border-2 ${
                        isActive
                          ? `${cfg.borderColor} ${cfg.bgColor}`
                          : 'border-border hover:border-primary/30'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl mx-auto mb-2 flex items-center justify-center ${
                          isActive ? cfg.bgColor : 'bg-secondary'
                        }`}
                      >
                        <LvlIcon
                          className={`w-5 h-5 ${isActive ? cfg.color : 'text-muted-foreground'}`}
                        />
                      </div>
                      <p
                        className={`font-heading text-sm ${
                          isActive ? cfg.color : 'text-muted-foreground'
                        }`}
                      >
                        {cfg.label}
                      </p>
                      {isCurrent && (
                        <Badge className="mt-1 gradient-orange text-primary-foreground font-heading border-0 text-xs px-1.5 py-0">
                          Current
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level Details */}
            <div className="card-athletic p-5 mb-6 animate-slide-up">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl ${config.bgColor} flex items-center justify-center`}
                >
                  <LevelIcon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div>
                  <h3 className={`font-heading text-xl ${config.color}`}>{config.label} Details</h3>
                  <p className="text-muted-foreground font-body text-xs">{config.frequency}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-2">
                  <Dumbbell className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-foreground font-body text-sm">{config.workoutStyle}</p>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <p className="font-heading text-sm text-muted-foreground uppercase tracking-widest mb-3">
                  {config.nextLevel
                    ? `Criteria to reach ${LEVEL_CONFIG[config.nextLevel].label}`
                    : "You've reached the top!"}
                </p>
                <div className="space-y-2">
                  {config.criteria.map((criterion, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-foreground font-body text-sm">{criterion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Button */}
            {hasChanges && (
              <div className="animate-slide-up mb-4">
                <Button
                  onClick={handleSaveLevel}
                  disabled={isSaving}
                  className="w-full gradient-orange text-primary-foreground font-heading text-lg py-6 glow-orange hover:opacity-90 transition-opacity border-0"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Updating & Regenerating Plan...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Set Level to {selectedLevel ? LEVEL_CONFIG[selectedLevel].label : ''}
                    </>
                  )}
                </Button>
                <p className="text-muted-foreground font-body text-xs text-center mt-2">
                  This will regenerate your workout plan for the new level
                </p>
              </div>
            )}

            {/* View Plan Button */}
            <Button
              variant="outline"
              onClick={onViewPlan}
              className="w-full border-primary/40 text-primary hover:bg-primary/10 font-heading text-base"
            >
              <Dumbbell className="w-4 h-4 mr-2" />
              View Workout Plan
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
