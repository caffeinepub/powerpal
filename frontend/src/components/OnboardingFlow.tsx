import React, { useState } from 'react';
import { FitnessLevel, FitnessGoal } from '../backend';
import type { Profile } from '../backend';
import { useSaveProfile, useGenerateWorkoutPlan, useGenerateMealPlan } from '../hooks/useLocalQueries';
import { PowerpalMascot } from './PowerpalMascot';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const fitnessLevels = [
  { value: FitnessLevel.beginner, label: 'Beginner', desc: 'New to fitness or returning after a long break' },
  { value: FitnessLevel.intermediate, label: 'Intermediate', desc: 'Consistent training for 6+ months' },
  { value: FitnessLevel.advanced, label: 'Advanced', desc: 'Years of dedicated training experience' },
];

const fitnessGoals = [
  { value: FitnessGoal.weightLoss, label: 'Weight Loss', icon: '🔥', desc: 'Burn fat and slim down' },
  { value: FitnessGoal.muscleGain, label: 'Muscle Gain', icon: '💪', desc: 'Build strength and size' },
  { value: FitnessGoal.endurance, label: 'Endurance', icon: '🏃', desc: 'Improve stamina and cardio' },
  { value: FitnessGoal.flexibility, label: 'Flexibility', icon: '🧘', desc: 'Increase mobility and range' },
  { value: FitnessGoal.generalFitness, label: 'General Fitness', icon: '⚡', desc: 'Overall health and wellness' },
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(FitnessLevel.beginner);
  const [goal, setGoal] = useState<FitnessGoal>(FitnessGoal.generalFitness);
  const [error, setError] = useState('');

  const saveProfile = useSaveProfile();
  const generateWorkout = useGenerateWorkoutPlan();
  const generateMeal = useGenerateMealPlan();

  const isLoading = saveProfile.isPending || generateWorkout.isPending || generateMeal.isPending;

  const handleStep1 = () => {
    if (!name.trim()) { setError('Please enter your name.'); return; }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 120) { setError('Please enter a valid age (10–120).'); return; }
    setError('');
    setStep(2);
  };

  const handleStep2 = () => {
    setError('');
    setStep(3);
  };

  const handleComplete = async () => {
    setError('');
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 120) {
      setError('Please enter a valid age.');
      return;
    }
    const profile: Profile = {
      name: name.trim(),
      age: BigInt(ageNum),
      fitnessLevel,
      goal,
    };
    try {
      await saveProfile.mutateAsync(profile);
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
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <img src="/assets/generated/powerpal-logo.dim_600x200.png" alt="Powerpal" className="h-16 mx-auto mb-4 object-contain" />
          <div className="flex justify-center mb-4">
            <PowerpalMascot size="md" context="onboarding" />
          </div>
          <div className="flex gap-2 justify-center mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 w-12 rounded-full transition-all ${s <= step ? 'bg-primary' : 'bg-muted'}`}
              />
            ))}
          </div>
          <p className="text-muted-foreground text-sm font-barlow">Step {step} of 3</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-lg">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-barlow-condensed font-bold text-foreground mb-1 tracking-wide">
                WELCOME TO POWERPAL
              </h2>
              <p className="text-muted-foreground font-barlow mb-6">Let's get to know you first.</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-barlow font-semibold text-foreground mb-1">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStep1()}
                    placeholder="Enter your name"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground font-barlow focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-barlow font-semibold text-foreground mb-1">Your Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStep1()}
                    placeholder="Enter your age"
                    min={10}
                    max={120}
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground font-barlow focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
              {error && <p className="text-destructive text-sm mt-3 font-barlow">{error}</p>}
              <button
                onClick={handleStep1}
                className="mt-6 w-full bg-primary text-primary-foreground font-barlow-condensed font-bold tracking-widest py-3 rounded-xl hover:bg-primary/90 transition-colors text-lg"
              >
                CONTINUE
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-barlow-condensed font-bold text-foreground mb-1 tracking-wide">
                FITNESS LEVEL
              </h2>
              <p className="text-muted-foreground font-barlow mb-6">Where are you starting from?</p>
              <div className="space-y-3">
                {fitnessLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setFitnessLevel(level.value)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all font-barlow ${
                      fitnessLevel === level.value
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    <div className="font-semibold text-foreground">{level.label}</div>
                    <div className="text-sm text-muted-foreground">{level.desc}</div>
                  </button>
                ))}
              </div>
              {error && <p className="text-destructive text-sm mt-3 font-barlow">{error}</p>}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border border-border text-foreground font-barlow-condensed font-bold tracking-widest py-3 rounded-xl hover:bg-muted transition-colors"
                >
                  BACK
                </button>
                <button
                  onClick={handleStep2}
                  className="flex-1 bg-primary text-primary-foreground font-barlow-condensed font-bold tracking-widest py-3 rounded-xl hover:bg-primary/90 transition-colors"
                >
                  CONTINUE
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-barlow-condensed font-bold text-foreground mb-1 tracking-wide">
                YOUR GOAL
              </h2>
              <p className="text-muted-foreground font-barlow mb-6">What do you want to achieve?</p>
              <div className="space-y-2">
                {fitnessGoals.map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGoal(g.value)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all font-barlow flex items-center gap-3 ${
                      goal === g.value
                        ? 'border-primary bg-primary/10 text-foreground'
                        : 'border-border bg-background text-muted-foreground hover:border-primary/50'
                    }`}
                  >
                    <span className="text-2xl">{g.icon}</span>
                    <div>
                      <div className="font-semibold text-foreground">{g.label}</div>
                      <div className="text-sm text-muted-foreground">{g.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              {error && <p className="text-destructive text-sm mt-3 font-barlow">{error}</p>}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(2)}
                  disabled={isLoading}
                  className="flex-1 border border-border text-foreground font-barlow-condensed font-bold tracking-widest py-3 rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
                >
                  BACK
                </button>
                <button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className="flex-1 bg-primary text-primary-foreground font-barlow-condensed font-bold tracking-widest py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                      BUILDING...
                    </>
                  ) : (
                    'BUILD MY PLAN'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
