import { useState } from 'react';
import { useSaveCallerUserProfile, useGenerateWorkoutPlan } from '../hooks/useQueries';
import { FitnessLevel, FitnessGoal } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, ArrowRight, Dumbbell, Target, User, AlertCircle } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: () => void;
  onBack: () => void;
}

type Step = 'personal' | 'fitness-level' | 'goal';

const fitnessLevels = [
  { value: FitnessLevel.beginner, label: 'Beginner', desc: 'New to fitness or returning after a break' },
  { value: FitnessLevel.intermediate, label: 'Intermediate', desc: 'Consistent training for 6+ months' },
  { value: FitnessLevel.advanced, label: 'Advanced', desc: 'Years of dedicated training' },
];

const goals = [
  { value: FitnessGoal.weightLoss, label: 'Weight Loss', desc: 'Burn fat and slim down' },
  { value: FitnessGoal.muscleGain, label: 'Muscle Gain', desc: 'Build strength and size' },
  { value: FitnessGoal.endurance, label: 'Endurance', desc: 'Improve stamina and cardio' },
  { value: FitnessGoal.flexibility, label: 'Flexibility', desc: 'Increase mobility and range' },
  { value: FitnessGoal.generalFitness, label: 'General Fitness', desc: 'Overall health and wellness' },
];

export default function OnboardingFlow({ onComplete, onBack }: OnboardingFlowProps) {
  const [step, setStep] = useState<Step>('personal');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(FitnessLevel.beginner);
  const [goal, setGoal] = useState<FitnessGoal>(FitnessGoal.generalFitness);
  const [error, setError] = useState<string | null>(null);

  const saveProfile = useSaveCallerUserProfile();
  const generatePlan = useGenerateWorkoutPlan();

  const isSubmitting = saveProfile.isPending || generatePlan.isPending;

  const handleFinish = async () => {
    setError(null);
    try {
      await saveProfile.mutateAsync({
        name,
        age: BigInt(parseInt(age, 10)),
        fitnessLevel,
        goal,
      });
      await generatePlan.mutateAsync();
      onComplete();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 border-b border-border/30 flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <div className="flex-1 flex items-center justify-center gap-2">
          <Dumbbell className="w-5 h-5 text-primary" />
          <h1 className="font-display text-lg font-black uppercase tracking-widest text-foreground">
            Setup
          </h1>
        </div>
        <div className="w-16" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-md space-y-6">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2">
            {(['personal', 'fitness-level', 'goal'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-display transition-colors ${
                    step === s
                      ? 'bg-primary text-primary-foreground'
                      : ['personal', 'fitness-level', 'goal'].indexOf(step) > i
                      ? 'bg-primary/40 text-primary-foreground'
                      : 'bg-card border border-border text-muted-foreground'
                  }`}
                >
                  {i + 1}
                </div>
                {i < 2 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-5">
            {step === 'personal' && (
              <>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
                    Personal Info
                  </h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-body text-foreground/80">Your Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-background border-border/60"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="font-body text-foreground/80">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="Enter your age"
                    min="10"
                    max="100"
                    className="bg-background border-border/60"
                  />
                </div>
                <Button
                  onClick={() => setStep('fitness-level')}
                  disabled={!name.trim() || !age || parseInt(age) < 10}
                  className="w-full font-display uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Next <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </>
            )}

            {step === 'fitness-level' && (
              <>
                <div className="flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
                    Fitness Level
                  </h2>
                </div>
                <div className="space-y-3">
                  {fitnessLevels.map(level => (
                    <button
                      key={level.value}
                      onClick={() => setFitnessLevel(level.value)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        fitnessLevel === level.value
                          ? 'border-primary bg-primary/10 shadow-[0_0_12px_oklch(0.7_0.22_142/0.3)]'
                          : 'border-border/40 bg-background hover:border-primary/50'
                      }`}
                    >
                      <div className="font-display font-bold uppercase tracking-wide text-foreground">
                        {level.label}
                      </div>
                      <div className="text-sm text-muted-foreground font-body mt-1">{level.desc}</div>
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('personal')}
                    className="flex-1 font-display uppercase tracking-widest border-border/60"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep('goal')}
                    className="flex-1 font-display uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    Next <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </>
            )}

            {step === 'goal' && (
              <>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <h2 className="font-display text-xl font-bold uppercase tracking-wide text-foreground">
                    Your Goal
                  </h2>
                </div>
                <div className="space-y-3">
                  {goals.map(g => (
                    <button
                      key={g.value}
                      onClick={() => setGoal(g.value)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        goal === g.value
                          ? 'border-primary bg-primary/10 shadow-[0_0_12px_oklch(0.7_0.22_142/0.3)]'
                          : 'border-border/40 bg-background hover:border-primary/50'
                      }`}
                    >
                      <div className="font-display font-bold uppercase tracking-wide text-foreground">
                        {g.label}
                      </div>
                      <div className="text-sm text-muted-foreground font-body mt-1">{g.desc}</div>
                    </button>
                  ))}
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep('fitness-level')}
                    disabled={isSubmitting}
                    className="flex-1 font-display uppercase tracking-widest border-border/60"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleFinish}
                    disabled={isSubmitting}
                    className="flex-1 font-display uppercase tracking-widest bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                        {saveProfile.isPending ? 'Saving...' : 'Building...'}
                      </span>
                    ) : (
                      'Build My Plan'
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
