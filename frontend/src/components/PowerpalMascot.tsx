import React, { useState, useEffect } from 'react';

type MascotContext = 'home' | 'onboarding' | 'plan' | 'meal';

interface PowerpalMascotProps {
  context: MascotContext;
  customMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const MESSAGES: Record<MascotContext, string[]> = {
  home: [
    "Hey champ! Ready to crush your goals today? 💪",
    "I'm Powerpal — your personal fitness buddy! Let's get started!",
    "Every rep counts. Every day matters. Let's GO! 🔥",
    "Your best workout is the one you haven't done yet!",
  ],
  onboarding: [
    "Let's build YOUR perfect plan together! 🏋️",
    "Tell me about yourself — I'll create something amazing!",
    "What's your fitness level? No judgment here!",
    "What's your goal? I've got the perfect plan for you!",
    "Almost there! Your personalized plan is coming up! ⚡",
  ],
  plan: [
    "This plan was built just for YOU! Own it! 🔥",
    "Consistency is the key to transformation!",
    "Every workout brings you closer to your goal! 💪",
    "You've got this! I believe in you, champ!",
    "Rest days are part of the plan — recovery is gains! 😤",
  ],
  meal: [
    "Fuel your body right! Here's your personalized meal plan! 🥗",
    "Great nutrition = great performance. Eat well, train hard! 💪",
    "Your meals are tailored to your fitness goal. Enjoy! 🍽️",
    "Food is fuel — make every bite count! ⚡",
    "Healthy eating doesn't have to be boring. Dig in! 😋",
  ],
};

export function PowerpalMascot({
  context,
  customMessage,
  size = 'md',
  animate = true,
}: PowerpalMascotProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!customMessage) {
      const interval = setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % MESSAGES[context].length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [context, customMessage]);

  const message = customMessage || MESSAGES[context][messageIndex];

  const sizeClasses = {
    sm: { img: 'w-20 h-20', container: 'gap-2', bubble: 'text-xs max-w-[180px]' },
    md: { img: 'w-28 h-28 md:w-32 md:h-32', container: 'gap-3', bubble: 'text-sm max-w-[220px]' },
    lg: { img: 'w-36 h-36 md:w-44 md:h-44', container: 'gap-4', bubble: 'text-base max-w-[280px]' },
  };

  const sc = sizeClasses[size];

  return (
    <div
      className={`flex items-end ${sc.container} ${visible ? 'animate-fade-in' : 'opacity-0'}`}
    >
      {/* Speech Bubble */}
      <div
        key={message}
        className={`relative ${sc.bubble} animate-speech-pop`}
      >
        <div
          className="
            bg-dark-elevated border border-primary/40 rounded-2xl rounded-bl-sm
            px-4 py-3 font-body font-semibold text-foreground leading-snug
            shadow-glow-sm
          "
        >
          {message}
        </div>
        {/* Bubble tail */}
        <div
          className="
            absolute -bottom-2 left-4 w-0 h-0
            border-l-[8px] border-l-transparent
            border-r-[8px] border-r-transparent
            border-t-[10px] border-t-primary/40
          "
        />
      </div>

      {/* Mascot Image */}
      <div className={`${animate ? 'animate-bounce-slow' : ''} flex-shrink-0`}>
        <img
          src="/assets/generated/powerpal-mascot.dim_400x400.png"
          alt="Powerpal mascot"
          className={`${sc.img} object-contain drop-shadow-lg`}
          style={{ filter: 'drop-shadow(0 0 12px oklch(0.7 0.22 40 / 0.5))' }}
        />
      </div>
    </div>
  );
}
