import React from 'react';
import { PowerpalMascot } from '../components/PowerpalMascot';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, Calendar, ChevronRight, Dumbbell, Utensils, TrendingUp } from 'lucide-react';

interface HomePageProps {
  hasProfile: boolean;
  profileName?: string;
  onStartOnboarding: () => void;
  onViewPlan: () => void;
  onViewMealPlan: () => void;
  onViewAdaptiveLevels: () => void;
  onViewWeeklySchedule: () => void;
  onViewGoalDrivenPlans: () => void;
}

const FEATURES = [
  {
    icon: Target,
    title: 'Goal-Driven Plans',
    desc: 'Personalized to your exact fitness goals',
    action: 'onViewGoalDrivenPlans' as const,
  },
  {
    icon: Calendar,
    title: 'Weekly Schedule',
    desc: 'Structured day-by-day workout plan',
    action: 'onViewWeeklySchedule' as const,
  },
  {
    icon: Utensils,
    title: 'Meal Planning',
    desc: 'Nutrition tailored to your fitness goal',
    action: 'onViewMealPlan' as const,
  },
  {
    icon: Zap,
    title: 'Adaptive Levels',
    desc: 'Beginner to advanced — we got you',
    action: 'onViewAdaptiveLevels' as const,
  },
];

export function HomePage({
  hasProfile,
  profileName,
  onStartOnboarding,
  onViewPlan,
  onViewMealPlan,
  onViewAdaptiveLevels,
  onViewWeeklySchedule,
  onViewGoalDrivenPlans,
}: HomePageProps) {
  const featureHandlers = {
    onViewGoalDrivenPlans,
    onViewWeeklySchedule,
    onViewMealPlan,
    onViewAdaptiveLevels,
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
        {/* Logo */}
        <div className="mb-6 animate-fade-in">
          <img
            src="/assets/generated/powerpal-logo.dim_600x200.png"
            alt="Powerpal"
            className="h-16 md:h-20 object-contain mx-auto"
            style={{ filter: 'drop-shadow(0 0 20px oklch(0.7 0.22 40 / 0.5))' }}
          />
        </div>

        {/* Tagline */}
        <div className="mb-8 animate-slide-up">
          <Badge
            variant="outline"
            className="border-primary/40 text-primary font-heading text-xs tracking-widest mb-4 px-4 py-1"
          >
            ⚡ YOUR AI FITNESS BUDDY
          </Badge>
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-foreground leading-none mb-3">
            TRAIN SMARTER.
            <br />
            <span className="text-primary text-glow-orange">REACH FURTHER.</span>
          </h1>
          <p className="text-muted-foreground font-body text-lg md:text-xl max-w-md mx-auto">
            Powerpal creates personalized workout plans and meal plans tailored to your goals, level, and lifestyle.
          </p>
        </div>

        {/* Mascot */}
        <div className="mb-10 animate-fade-in">
          <PowerpalMascot
            context="home"
            size="lg"
            animate={true}
            customMessage={
              hasProfile && profileName
                ? `Welcome back, ${profileName}! Ready to crush it today? 💪`
                : undefined
            }
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm animate-slide-up">
          {hasProfile ? (
            <>
              <Button
                onClick={onViewPlan}
                className="flex-1 gradient-orange text-primary-foreground font-heading text-xl py-6 glow-orange hover:opacity-90 transition-opacity border-0"
              >
                <Dumbbell className="w-5 h-5 mr-2" />
                Workout Plan
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
              <Button
                onClick={onViewMealPlan}
                variant="outline"
                className="flex-1 border-primary/40 text-primary hover:bg-primary/10 font-heading text-xl py-6"
              >
                <Utensils className="w-5 h-5 mr-2" />
                Meal Plan
                <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </>
          ) : (
            <Button
              onClick={onStartOnboarding}
              className="flex-1 gradient-orange text-primary-foreground font-heading text-xl py-6 glow-orange hover:opacity-90 transition-opacity border-0"
            >
              Start Your Journey
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>

        {hasProfile && (
          <>
            {/* Secondary nav buttons */}
            <div className="flex flex-wrap gap-3 mt-4 justify-center animate-slide-up">
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

            <button
              onClick={onStartOnboarding}
              className="mt-3 text-muted-foreground font-body text-sm hover:text-foreground transition-colors underline underline-offset-4"
            >
              Update Goals
            </button>
          </>
        )}

        {/* Feature Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 w-full max-w-2xl animate-fade-in">
          {FEATURES.map(({ icon: Icon, title, desc, action }) => (
            <button
              key={title}
              onClick={hasProfile ? featureHandlers[action] : onStartOnboarding}
              className="card-athletic p-4 text-left hover:border-primary/30 transition-colors cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading text-sm text-foreground mb-1">{title}</h3>
              <p className="text-muted-foreground font-body text-xs leading-snug">{desc}</p>
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center">
        <p className="text-muted-foreground font-body text-sm">
          Built with{' '}
          <span className="text-primary">♥</span>{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'powerpal')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
        <p className="text-muted-foreground/50 font-body text-xs mt-1">
          © {new Date().getFullYear()} Powerpal. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
