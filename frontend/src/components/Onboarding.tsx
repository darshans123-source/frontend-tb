import { useState } from 'react';
import { Shield, Stethoscope, Trophy, Bot, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { soundService } from '../services/soundService';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      icon: Stethoscope,
      title: "Welcome to TB Quest",
      desc: "Learn tuberculosis diagnosis through immersive, interactive clinical case simulations designed for medical students.",
      color: "text-cyan-400 bg-cyan-950/60 border-cyan-500/40"
    },
    {
      icon: Trophy,
      title: "Real Patient Scenarios",
      desc: "Evaluate pulmonary, pediatric, and MDR-TB cases. Earn XP, badges, and track your diagnostic accuracy.",
      color: "text-amber-400 bg-amber-950/60 border-amber-500/40"
    },
    {
      icon: Bot,
      title: "AI Clinical Mentor",
      desc: "Get instant guidance, guideline explanations, and clinical reasoning feedback powered by Gemini AI.",
      color: "text-purple-400 bg-purple-950/60 border-purple-500/40"
    }
  ];

  const currentSlide = slides[step];
  const Icon = currentSlide.icon;

  const handleNext = () => {
    soundService.playClick();
    if (step < slides.length - 1) {
      setStep(prev => prev + 1);
    } else {
      soundService.playTrophy();
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-900 via-[#0c1b33] to-brand-teal-deep/30 dark:bg-ink-950 text-white font-sans flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden max-w-full">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 sm:w-80 h-64 sm:h-80 bg-brand-teal/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Top Bar */}
      <div className="flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <Shield className="text-teal-300" size={22} />
          <span className="tq-display font-bold tracking-wider text-xs sm:text-sm">TB QUEST</span>
        </div>
        <button
          onClick={() => {
            soundService.playClick();
            onComplete();
          }}
          className="tq-btn-ghost touch-target text-xs text-slate-300 hover:text-white font-mono px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15"
        >
          Skip
        </button>
      </div>

      {/* Slide Content */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-2 sm:px-4 z-10 my-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center space-y-4 sm:space-y-6 max-w-sm"
          >
            <div className={`tq-lift p-4 sm:p-6 rounded-3xl border shadow-xl ${currentSlide.color}`}>
              <Icon size={48} className="sm:w-14 sm:h-14" />
            </div>
            <h2 className="tq-display text-xl sm:text-2xl font-bold tracking-wide">{currentSlide.title}</h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{currentSlide.desc}</p>
          </motion.div>
        </AnimatePresence>

        {/* Indicators */}
        <div className="flex gap-2 mt-6 sm:mt-8">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-brand-teal shadow-[0_0_10px_rgba(13,148,136,0.5)]' : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Footer Button */}
      <div className="z-10 pb-2 sm:pb-4 w-full max-w-md mx-auto">
        <button
          onClick={handleNext}
          className="tq-btn-primary touch-target w-full py-3.5 sm:py-4 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-[0_0_20px_rgba(13,148,136,0.3)] flex items-center justify-center gap-2 transition-all active:scale-[0.99] min-h-11"
        >
          <span>{step === slides.length - 1 ? 'Get Started' : 'Next'}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
