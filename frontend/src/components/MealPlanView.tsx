import React, { useState } from 'react';
import { useGetMealPlan, useGetProfile, useGenerateMealPlan } from '../hooks/useQueries';
import { PowerpalMascot } from './PowerpalMascot';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  RefreshCw,
  Dumbbell,
  RotateCcw,
  Loader2,
  Utensils,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Flame,
  Beef,
  Wheat,
  Droplets,
  TrendingUp,
  Calendar,
  Target,
} from 'lucide-react';
import type { DailyMealPlan, Meal } from '../backend';

interface MealPlanViewProps {
  onEditProfile: () => void;
  onViewWorkout: () => void;
  onViewAdaptiveLevels: () => void;
  onViewWeeklySchedule: () => void;
  onViewGoalDrivenPlans: () => void;
}

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MEAL_ICONS = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  dessert: Cookie,
};

const MEAL_COLORS = {
  breakfast: 'border-l-accent text-accent',
  lunch: 'border-l-primary text-primary',
  dinner: 'border-l-primary/60 text-primary/60',
  dessert: 'border-l-accent/60 text-accent/60',
};

const MEAL_BG = {
  breakfast: 'bg-accent/10',
  lunch: 'bg-primary/10',
  dinner: 'bg-primary/5',
  dessert: 'bg-accent/5',
};

function MacroBadge({
  icon: Icon,
  value,
  label,
  colorClass,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  colorClass: string;
}) {
  return (
    <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${colorClass}`}>
      <Icon className="w-3 h-3 flex-shrink-0" />
      <span className="font-heading text-xs font-bold">{value}g</span>
      <span className="text-xs text-muted-foreground font-body hidden sm:inline">{label}</span>
    </div>
  );
}

function MealCard({
  meal,
  type,
}: {
  meal: Meal;
  type: 'breakfast' | 'lunch' | 'dinner' | 'dessert';
}) {
  const Icon = MEAL_ICONS[type];
  const colorClass = MEAL_COLORS[type];
  const bgClass = MEAL_BG[type];
  const [iconColor, borderColor] = colorClass.split(' ');

  return (
    <div className={`card-athletic border-l-4 ${borderColor} p-4 flex flex-col gap-3`}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${bgClass} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-heading text-xs uppercase tracking-widest ${iconColor} mb-0.5`}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </p>
          <h4 className="font-heading text-base text-foreground leading-tight truncate">
            {meal.name}
          </h4>
        </div>
        <Badge
          variant="outline"
          className="border-primary/30 text-primary font-heading text-xs flex items-center gap-1 flex-shrink-0"
        >
          <Flame className="w-3 h-3" />
          {Number(meal.calories)} kcal
        </Badge>
      </div>

      {/* Macros */}
      <div className="flex flex-wrap gap-2">
        <MacroBadge
          icon={Beef}
          value={Number(meal.protein)}
          label="protein"
          colorClass="text-primary bg-primary/10"
        />
        <MacroBadge
          icon={Wheat}
          value={Number(meal.carbs)}
          label="carbs"
          colorClass="text-accent bg-accent/10"
        />
        <MacroBadge
          icon={Droplets}
          value={Number(meal.fat)}
          label="fat"
          colorClass="text-foreground/70 bg-secondary"
        />
      </div>
    </div>
  );
}

function DayMealCard({ day, dayIndex }: { day: DailyMealPlan; dayIndex: number }) {
  return (
    <div className="animate-slide-up" style={{ animationDelay: `${dayIndex * 50}ms` }}>
      <div className="card-athletic p-5">
        {/* Day Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full gradient-orange flex items-center justify-center flex-shrink-0 glow-orange">
            <span className="font-heading text-primary-foreground text-sm font-bold">
              {dayIndex + 1}
            </span>
          </div>
          <div>
            <h3 className="font-heading text-xl text-foreground">{DAYS_OF_WEEK[dayIndex]}</h3>
            <p className="text-muted-foreground font-body text-xs">
              {Number(day.breakfast.calories) +
                Number(day.lunch.calories) +
                Number(day.dinner.calories) +
                (day.dessert ? Number(day.dessert.calories) : 0)}{' '}
              kcal total
            </p>
          </div>
        </div>

        {/* Meals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <MealCard meal={day.breakfast} type="breakfast" />
          <MealCard meal={day.lunch} type="lunch" />
          <MealCard meal={day.dinner} type="dinner" />
          {day.dessert ? (
            <MealCard meal={day.dessert} type="dessert" />
          ) : (
            <div className="card-athletic border-l-4 border-l-border p-4 flex items-center gap-3 opacity-50">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Cookie className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-heading text-xs uppercase tracking-widest text-muted-foreground mb-0.5">
                  Dessert
                </p>
                <p className="font-body text-sm text-muted-foreground italic">Rest day — no dessert</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function MealPlanView({
  onEditProfile,
  onViewWorkout,
  onViewAdaptiveLevels,
  onViewWeeklySchedule,
  onViewGoalDrivenPlans,
}: MealPlanViewProps) {
  const { data: mealPlan, isLoading: planLoading } = useGetMealPlan();
  const { data: profile } = useGetProfile();
  const generateMealPlan = useGenerateMealPlan();
  const [activeDay, setActiveDay] = useState<number | null>(null);

  const handleRegenerate = async () => {
    try {
      await generateMealPlan.mutateAsync();
    } catch (err) {
      console.error('Failed to regenerate meal plan:', err);
    }
  };

  const goalLabel = profile?.goal
    ? {
        weightLoss: 'Weight Loss',
        muscleGain: 'Muscle Gain',
        endurance: 'Endurance',
        flexibility: 'Flexibility',
        generalFitness: 'General Fitness',
      }[profile.goal as string] || profile.goal
    : '';

  const displayedDays = mealPlan?.days ?? [];
  const visibleDays = activeDay !== null ? [displayedDays[activeDay]] : displayedDays;
  const visibleIndices = activeDay !== null ? [activeDay] : displayedDays.map((_, i) => i);

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="relative w-full h-40 md:h-52 overflow-hidden">
        <img
          src="/assets/generated/plan-banner.dim_1200x300.png"
          alt="Meal Plan Banner"
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
        {/* Profile Summary + Mascot */}
        <div className="flex items-end justify-between mb-6">
          <div>
            {profile && (
              <div className="animate-slide-up">
                <h1 className="font-heading text-3xl md:text-4xl text-foreground">
                  {profile.name}'s Meal Plan
                </h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className="border-primary/40 text-primary font-heading text-xs"
                  >
                    <Utensils className="w-3 h-3 mr-1" />
                    7-Day Plan
                  </Badge>
                  <Badge
                    variant="outline"
                    className="border-accent/40 text-accent font-heading text-xs"
                  >
                    {goalLabel}
                  </Badge>
                </div>
              </div>
            )}
          </div>
          <PowerpalMascot context="meal" size="sm" animate={true} />
        </div>

        {/* Primary Action Buttons */}
        <div className="flex gap-3 mb-3 flex-wrap">
          <Button
            onClick={handleRegenerate}
            disabled={generateMealPlan.isPending}
            className="gradient-orange text-primary-foreground font-heading text-base glow-orange hover:opacity-90 transition-opacity border-0 flex-1"
          >
            {generateMealPlan.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate Plan
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onViewWorkout}
            className="border-primary/40 text-primary hover:bg-primary/10 font-heading text-base"
          >
            <Dumbbell className="w-4 h-4 mr-2" />
            Workout Plan
          </Button>
          <Button
            variant="outline"
            onClick={onEditProfile}
            className="border-border text-foreground hover:bg-secondary font-heading text-base"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Secondary Navigation Buttons */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewWeeklySchedule}
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 font-heading text-sm"
          >
            <Calendar className="w-4 h-4 mr-1.5" />
            Weekly Schedule
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewAdaptiveLevels}
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 font-heading text-sm"
          >
            <TrendingUp className="w-4 h-4 mr-1.5" />
            Adaptive Levels
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onViewGoalDrivenPlans}
            className="text-muted-foreground hover:text-primary hover:bg-primary/10 font-heading text-sm"
          >
            <Target className="w-4 h-4 mr-1.5" />
            Goal-Driven Plans
          </Button>
        </div>

        {/* Day Filter Pills */}
        {!planLoading && displayedDays.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setActiveDay(null)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full font-heading text-sm transition-all duration-200 ${
                activeDay === null
                  ? 'gradient-orange text-primary-foreground glow-orange-sm border-0'
                  : 'border border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
              }`}
            >
              All Days
            </button>
            {DAYS_OF_WEEK.slice(0, displayedDays.length).map((day, idx) => (
              <button
                key={day}
                onClick={() => setActiveDay(activeDay === idx ? null : idx)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full font-heading text-sm transition-all duration-200 ${
                  activeDay === idx
                    ? 'gradient-orange text-primary-foreground glow-orange-sm border-0'
                    : 'border border-border text-muted-foreground hover:border-primary/40 hover:text-primary'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        )}

        {/* Meal Plan Content */}
        {planLoading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl bg-secondary" />
            ))}
          </div>
        ) : displayedDays.length > 0 ? (
          <div className="space-y-6">
            {visibleDays.map((day, i) =>
              day ? (
                <DayMealCard key={visibleIndices[i]} day={day} dayIndex={visibleIndices[i]} />
              ) : null
            )}
          </div>
        ) : (
          <div className="card-athletic p-8 text-center">
            <Utensils className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-body mb-4">
              No meal plan yet. Generate one to fuel your fitness journey!
            </p>
            <Button
              onClick={handleRegenerate}
              disabled={generateMealPlan.isPending}
              className="gradient-orange text-primary-foreground font-heading glow-orange hover:opacity-90 transition-opacity border-0"
            >
              {generateMealPlan.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Utensils className="w-4 h-4 mr-2" />
                  Generate Meal Plan
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
