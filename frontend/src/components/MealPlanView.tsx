import React, { useState } from 'react';
import { RefreshCw, Dumbbell, Calendar, Target, TrendingUp } from 'lucide-react';
import { useGetProfile, useGetMealPlan, useGenerateMealPlan } from '../hooks/useLocalQueries';

interface MealPlanViewProps {
  onNavigateToWorkout: () => void;
  onNavigateToSchedule: () => void;
  onNavigateToGoals: () => void;
  onNavigateToAdaptive: () => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function MealPlanView({
  onNavigateToWorkout,
  onNavigateToSchedule,
  onNavigateToGoals,
  onNavigateToAdaptive,
}: MealPlanViewProps) {
  const { data: profile } = useGetProfile();
  const { data: mealPlan, isLoading } = useGetMealPlan();
  const generateMeal = useGenerateMealPlan();
  const [selectedDay, setSelectedDay] = useState(0);

  const handleGenerate = () => {
    if (profile) generateMeal.mutate(profile);
  };

  const dayPlan = mealPlan?.days[selectedDay];

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
            MEAL PLAN
          </h1>
          <p className="text-muted-foreground font-barlow text-sm">Your personalized weekly nutrition guide</p>
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

        {/* Regenerate */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleGenerate}
            disabled={generateMeal.isPending}
            className="flex items-center gap-2 bg-primary text-primary-foreground font-barlow-condensed font-bold tracking-widest px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {generateMeal.isPending ? (
              <span className="animate-spin w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {mealPlan ? 'REGENERATE' : 'BUILD PLAN'}
          </button>
        </div>

        {/* Day selector */}
        {mealPlan && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {DAYS.map((day, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedDay(idx)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full font-barlow text-sm font-semibold transition-colors ${
                  selectedDay === idx
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12 text-muted-foreground font-barlow animate-pulse">Loading...</div>
        )}

        {!isLoading && !mealPlan && (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-barlow">No meal plan yet. Hit "BUILD PLAN" to get started!</p>
          </div>
        )}

        {dayPlan && (
          <div className="space-y-4">
            <h2 className="font-barlow-condensed font-bold text-xl tracking-wide text-foreground">
              {DAYS[selectedDay].toUpperCase()}
            </h2>
            {[
              { label: '🌅 Breakfast', meal: dayPlan.breakfast },
              { label: '☀️ Lunch', meal: dayPlan.lunch },
              { label: '🌙 Dinner', meal: dayPlan.dinner },
              ...(dayPlan.dessert ? [{ label: '🍰 Dessert', meal: dayPlan.dessert }] : []),
            ].map(({ label, meal }) => (
              <div key={label} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-barlow font-semibold text-muted-foreground text-sm">{label}</span>
                  <span className="text-primary font-barlow-condensed font-bold text-sm">
                    {Number(meal.calories)} kcal
                  </span>
                </div>
                <p className="font-barlow font-semibold text-foreground mb-3">{meal.name}</p>
                <div className="flex gap-3 flex-wrap">
                  <span className="text-xs bg-primary/10 text-primary font-barlow font-semibold px-2 py-0.5 rounded-full">
                    P: {Number(meal.protein)}g
                  </span>
                  <span className="text-xs bg-accent/10 text-accent font-barlow font-semibold px-2 py-0.5 rounded-full">
                    C: {Number(meal.carbs)}g
                  </span>
                  <span className="text-xs bg-muted text-muted-foreground font-barlow font-semibold px-2 py-0.5 rounded-full">
                    F: {Number(meal.fat)}g
                  </span>
                </div>
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
