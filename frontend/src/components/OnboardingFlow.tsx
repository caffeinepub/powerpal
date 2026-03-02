import React, { useState } from 'react';
import { FitnessLevel, FitnessGoal } from '../backend';
import type { Profile } from '../backend';
import { useSaveProfile, useGenerateWorkoutPlan, useGenerateMealPlan } from '../hooks/useLocalQueries';
import { PowerpalMascot } from './PowerpalMascot';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');

  const saveProfile = useSaveProfile();
  const generateWorkout = useGenerateWorkoutPlan();
  const generateMeal = useGenerateMealPlan();

  const isLoading = saveProfile.isPending || generateWorkout.isPending || generateMeal.isPending;

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 120) {
      setError('Please enter a valid age (10–120).');
      return;
    }
    setError('');

    const profile: Profile = {
      name: name.trim(),
      age: BigInt(ageNum),
      fitnessLevel: FitnessLevel.beginner,
      goal: FitnessGoal.generalFitness,
    };

    try {
      saveProfile.mutate(profile);
      // Wait a tick for the profile to be saved before generating plans
      await new Promise((resolve) => setTimeout(resolve, 50));
      await generateWorkout.mutateAsync(profile);
      await generateMeal.mutateAsync(profile);
      onComplete();
    } catch (err) {
      console.error('Onboarding error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src="/assets/generated/powerpal-logo.dim_600x200.png"
            alt="Powerpal"
            className="h-16 mx-auto mb-4 object-contain"
          />
          <div className="flex justify-center mb-4">
            <PowerpalMascot size="md" context="onboarding" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-barlow-condensed font-bold text-foreground mb-1 tracking-wide">
            WELCOME TO POWERPAL
          </h2>
          <p className="text-muted-foreground font-barlow mb-6">
            Enter your name and age to get your personalized fitness plan.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-barlow font-semibold text-foreground mb-1">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Enter your name"
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground font-barlow focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-barlow font-semibold text-foreground mb-1">
                Your Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Enter your age"
                min={10}
                max={120}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground font-barlow focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <p className="text-destructive text-sm mt-3 font-barlow">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-6 w-full bg-primary text-primary-foreground font-barlow-condensed font-bold tracking-widest py-3 rounded-xl hover:bg-primary/90 transition-colors text-lg disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                BUILDING YOUR PLAN...
              </>
            ) : (
              'GET STARTED'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
