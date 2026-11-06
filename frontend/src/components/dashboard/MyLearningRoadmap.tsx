import React from 'react';
import { BookOpen, Target, Lock, Brain, Building2, Trophy } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface MyLearningRoadmapProps {
  userLevel?: number;
  completedCases?: number;
  onStartLevel: (levelId: number) => void;
  onStartIntroduction: () => void;
}

export default function MyLearningRoadmap({
  userLevel = 1,
  completedCases = 0,
  onStartLevel,
  onStartIntroduction
}: MyLearningRoadmapProps) {
  const steps = [
    {
      id: 0,
      title: 'TB INTRODUCTION',
      iconType: 'book',
      color: 'green',
      status: 'AVAILABLE',
      isCompleted: completedCases > 0,
      nodeBg: 'bg-brand-teal ring-4 ring-teal-100 dark:ring-teal-500/30',
      cardBorder: 'border-teal-400/80 bg-teal-50/40 dark:bg-teal-950/30 shadow-xs ring-2 ring-teal-500/10',
      btnClass: 'bg-brand-teal-deep hover:bg-brand-teal text-white font-black shadow-xs',
      btnText: 'START'
    },
    {
      id: 1,
      title: 'LEVEL 1',
      subtitle: 'SNAKE & LADDER • TB AWARENESS',
      iconType: 'target',
      color: 'blue',
      status: 'AVAILABLE',
      isCompleted: userLevel > 1 || (typeof window !== 'undefined' && localStorage.getItem('tbquest_level2_unlocked') === 'true'),
      nodeBg: 'bg-brand-emerald ring-4 ring-emerald-100 dark:ring-emerald-500/30',
      cardBorder: 'border-emerald-300 bg-emerald-50/40 dark:bg-emerald-950/30 shadow-xs ring-2 ring-emerald-500/10',
      btnClass: 'bg-gradient-to-r from-brand-teal to-brand-emerald hover:from-teal-500 hover:to-emerald-500 text-white font-black shadow-xs',
      btnText: 'PLAY 🐍'
    },
    {
      id: 2,
      title: 'LEVEL 2',
      subtitle: 'INVESTIGATION INTERPRETER',
      iconType: (userLevel >= 2 || localStorage.getItem('tbquest_level2_unlocked') === 'true') ? 'target' : 'lock',
      color: (userLevel >= 2 || localStorage.getItem('tbquest_level2_unlocked') === 'true') ? 'emerald' : 'gray',
      status: (userLevel >= 2 || localStorage.getItem('tbquest_level2_unlocked') === 'true') ? 'AVAILABLE' : 'LOCKED',
      isCompleted: userLevel > 2,
      nodeBg: (userLevel >= 2 || localStorage.getItem('tbquest_level2_unlocked') === 'true') ? 'bg-emerald-600 ring-4 ring-emerald-100' : 'bg-slate-300 border-2 border-slate-400',
      cardBorder: (userLevel >= 2 || localStorage.getItem('tbquest_level2_unlocked') === 'true') ? 'border-emerald-300 bg-emerald-50/20 shadow-xs ring-2 ring-emerald-500/10' : 'border-slate-200/90 bg-slate-50/50',
      btnClass: (userLevel >= 2 || localStorage.getItem('tbquest_level2_unlocked') === 'true') ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xs' : 'bg-slate-200 text-slate-400 font-bold cursor-not-allowed',
      btnText: (userLevel >= 2 || localStorage.getItem('tbquest_level2_unlocked') === 'true') ? 'START' : 'LOCKED'
    },
    {
      id: 3,
      title: 'LEVEL 3',
      subtitle: 'DIAGNOSTIC DECISION MAKER',
      iconType: 'brain',
      color: 'gray',
      status: 'LOCKED',
      isCompleted: userLevel > 3,
      nodeBg: 'bg-slate-300 dark:bg-slate-700 border-2 border-slate-400 dark:border-slate-600',
      cardBorder: 'border-slate-200/90 dark:border-slate-700 bg-slate-50/50 dark:bg-[#111c30]/60',
      btnClass: 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold cursor-not-allowed',
      btnText: 'LOCKED'
    },
    {
      id: 4,
      title: 'LEVEL 4',
      subtitle: 'CASE SIMULATION',
      iconType: 'hospital',
      color: 'gray',
      status: 'LOCKED',
      isCompleted: userLevel > 4,
      nodeBg: 'bg-slate-300 dark:bg-slate-700 border-2 border-slate-400 dark:border-slate-600',
      cardBorder: 'border-slate-200/90 dark:border-slate-700 bg-slate-50/50 dark:bg-[#111c30]/60',
      btnClass: 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold cursor-not-allowed',
      btnText: 'LOCKED'
    },
    {
      id: 5,
      title: 'LEVEL 5',
      subtitle: 'TB DIAGNOSTIC EXPERT',
      iconType: 'trophy',
      color: 'gray',
      status: 'LOCKED',
      isCompleted: userLevel > 5,
      nodeBg: 'bg-slate-300 dark:bg-slate-700 border-2 border-slate-400 dark:border-slate-600',
      cardBorder: 'border-slate-200/90 dark:border-slate-700 bg-slate-50/50 dark:bg-[#111c30]/60',
      btnClass: 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 font-bold cursor-not-allowed',
      btnText: 'LOCKED'
    }
  ];

  return (
    <div className="tq-card tq-lift rounded-2xl p-5 sm:p-6 space-y-4 relative overflow-hidden min-w-0">
      {/* Top Header & Stepper Track */}
      <div className="relative text-center pb-2">
        {/* Continuous Connecting Line behind nodes */}
        <div className="hidden md:block absolute top-2.5 left-10 right-10 h-0.5 bg-gradient-to-r from-brand-teal via-brand-royal to-brand-coral -z-0" />

        {/* Stepper Nodes */}
        <div className="hidden md:flex items-center justify-between px-8 relative z-10 mb-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`w-4 h-4 rounded-full ${step.nodeBg} shadow-xs flex items-center justify-center transition-all`}
            >
              {step.color === 'gray' && <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />}
            </div>
          ))}
        </div>

        {/* Title */}
        <h2 className="tq-eyebrow text-xs sm:text-sm font-black text-ink-900 dark:text-slate-100 uppercase tracking-widest bg-white dark:bg-[#111c30] inline-block px-4 relative z-10 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-teal" />
          <span>MY TB QUEST JOURNEY</span>
        </h2>
      </div>

      {/* 6 Responsive Level Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
        {steps.map((step) => {
          const isLocked = step.status === 'LOCKED';

          return (
            <div
              key={step.id}
              className={`rounded-2xl p-3.5 border flex flex-col justify-between items-center text-center space-y-3 transition-all duration-300 hover:-translate-y-1 ${
                isLocked
                  ? 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-[#111c30]/60 opacity-80'
                  : 'tq-card border-slate-200 dark:border-slate-700 bg-white dark:bg-[#111c30] shadow-[0_4px_15px_rgba(15,111,255,0.04)] hover:shadow-[0_10px_25px_rgba(15,111,255,0.1)] hover:border-teal-400/60'
              }`}
            >
              {/* Icon Illustration */}
              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                {step.iconType === 'book' && (
                  <div className="text-brand-teal-deep dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 p-2.5 rounded-xl border border-teal-200 dark:border-teal-500/40">
                    <BookOpen size={24} className="text-brand-teal-deep dark:text-teal-300" />
                  </div>
                )}
                {step.iconType === 'target' && (
                  <div className="text-brand-teal-deep dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 p-2.5 rounded-xl border border-teal-200 dark:border-teal-500/40">
                    <Target size={24} className="text-brand-teal-deep dark:text-teal-300" />
                  </div>
                )}
                {step.iconType === 'lock' && (
                  <div className="text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <Lock size={22} className="text-slate-400 dark:text-slate-500" />
                  </div>
                )}
                {step.iconType === 'brain' && (
                  <div className="text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <Brain size={22} className="text-slate-400 dark:text-slate-500" />
                  </div>
                )}
                {step.iconType === 'hospital' && (
                  <div className="text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <Building2 size={22} className="text-slate-400 dark:text-slate-500" />
                  </div>
                )}
                {step.iconType === 'trophy' && (
                  <div className="text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
                    <Trophy size={22} className="text-slate-400 dark:text-slate-500" />
                  </div>
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="min-h-[42px] flex flex-col justify-center space-y-0.5">
                <h3 className="text-xs font-extrabold text-ink-900 dark:text-slate-100 leading-tight uppercase tracking-tight">
                  {step.title}
                </h3>
                {step.subtitle && (
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase leading-tight tracking-tight">
                    {step.subtitle}
                  </p>
                )}
              </div>

              {/* Status Indicators */}
              <div className="w-full space-y-2 pt-1">
                {isLocked ? (
                  <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                    <Lock size={11} className="text-slate-400" />
                    <span>LOCKED</span>
                  </div>
                ) : (
                  <div className="space-y-0.5 text-[9px] font-bold uppercase tracking-tight">
                    <div className="flex items-center justify-center gap-1.5 text-slate-500 dark:text-slate-400">
                      <span className={`w-1.5 h-1.5 rounded-full ${step.isCompleted ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span>{step.isCompleted ? 'COMPLETED' : 'NOT STARTED'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-brand-teal-deep dark:text-teal-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                      <span>AVAILABLE</span>
                    </div>
                  </div>
                )}

                {/* Button */}
                <button
                  disabled={isLocked}
                  onClick={() => {
                    soundService.playClick();
                    if (step.id === 0) onStartIntroduction();
                    else onStartLevel(step.id);
                  }}
                  className={`touch-target min-h-11 w-full py-2 px-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    isLocked
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                      : 'tq-btn-primary text-white shadow-md shadow-blue-500/20 hover:scale-[1.02]'
                  }`}
                >
                  {step.btnText}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

