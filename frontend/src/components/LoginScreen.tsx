import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Dumbbell, Zap, Target, TrendingUp } from 'lucide-react';

export default function LoginScreen() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  const features = [
    { icon: Dumbbell, label: 'Personalized Workout Plans' },
    { icon: Target, label: 'Goal-Driven Training' },
    { icon: TrendingUp, label: 'Adaptive Fitness Levels' },
    { icon: Zap, label: 'Weekly Meal Plans' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-border/30">
        <div className="flex items-center gap-3">
          <img src="/assets/generated/powerpal-logo.dim_600x200.png" alt="Powerpal" className="h-8 object-contain" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="w-full max-w-md flex flex-col items-center gap-8">
          {/* Mascot */}
          <div className="relative">
            <img
              src="/assets/generated/powerpal-mascot.dim_400x400.png"
              alt="Powerpal Mascot"
              className="w-40 h-40 object-contain drop-shadow-[0_0_24px_oklch(0.7_0.22_142/0.5)]"
            />
          </div>

          {/* Headline */}
          <div className="text-center space-y-3">
            <h1 className="font-display text-4xl font-black uppercase tracking-tight text-foreground">
              Welcome to{' '}
              <span className="text-primary glow-primary">Powerpal</span>
            </h1>
            <p className="text-muted-foreground font-body text-lg">
              Your AI-powered fitness companion. Log in to build your personalized workout and meal plans.
            </p>
          </div>

          {/* Features list */}
          <div className="w-full grid grid-cols-2 gap-3">
            {features.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-card border border-border/40 rounded-xl px-4 py-3"
              >
                <Icon className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm font-body text-foreground/80">{label}</span>
              </div>
            ))}
          </div>

          {/* Login button */}
          <div className="w-full flex flex-col items-center gap-3">
            <Button
              onClick={() => login()}
              disabled={isLoggingIn}
              size="lg"
              className="w-full font-display uppercase tracking-widest text-base font-bold py-6 bg-primary text-primary-foreground hover:bg-primary/90 glow-primary"
            >
              {isLoggingIn ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </span>
              ) : (
                'Login to Get Started'
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center font-body">
              Secure login powered by Internet Identity. No password required.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-4 text-center border-t border-border/30">
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
