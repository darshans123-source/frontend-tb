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
      nodeBg: 'bg-emerald-500 ring-4 ring-emerald-100',
      cardBorder: 'border-emerald-400/80 bg-emerald-50/20 shadow-xs ring-2 ring-emerald-500/10',
      btnClass: 'bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xs',
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
      nodeBg: 'bg-emerald-600 ring-4 ring-emerald-100',
      cardBorder: 'border-emerald-300 bg-emerald-50/20 shadow-xs ring-2 ring-emerald-500/10',
      btnClass: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black shadow-xs',
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
      nodeBg: 'bg-slate-300 border-2 border-slate-400',
      cardBorder: 'border-slate-200/90 bg-slate-50/50',
      btnClass: 'bg-slate-200 text-slate-400 font-bold cursor-not-allowed',
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
      nodeBg: 'bg-slate-300 border-2 border-slate-400',
      cardBorder: 'border-slate-200/90 bg-slate-50/50',
      btnClass: 'bg-slate-200 text-slate-400 font-bold cursor-not-allowed',
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
      nodeBg: 'bg-slate-300 border-2 border-slate-400',
      cardBorder: 'border-slate-200/90 bg-slate-50/50',
      btnClass: 'bg-slate-200 text-slate-400 font-bold cursor-not-allowed',
      btnText: 'LOCKED'
    }
  ];

  return (
    <div className="bg-white border border-[#D8E9FF] rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(15,111,255,0.06)] space-y-4 relative overflow-hidden">
      {/* Top Header & Stepper Track */}
      <div className="relative text-center pb-2">
        {/* Continuous Connecting Line behind nodes */}
        <div className="hidden md:block absolute top-2.5 left-10 right-10 h-0.5 bg-[#D8E9FF] -z-0" />

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
        <h2 className="text-xs sm:text-sm font-black text-[#1E293B] uppercase tracking-widest bg-white inline-block px-4 relative z-10 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#0F6FFF]" />
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
                  ? 'border-[#EBF3FE] bg-[#F8FCFF]/60 opacity-80'
                  : 'border-[#D8E9FF] bg-white shadow-[0_4px_15px_rgba(15,111,255,0.04)] hover:shadow-[0_10px_25px_rgba(15,111,255,0.1)] hover:border-[#0F6FFF]/40'
              }`}
            >
              {/* Icon Illustration */}
              <div className="w-12 h-12 flex items-center justify-center shrink-0">
                {step.iconType === 'book' && (
                  <div className="text-[#0F6FFF] bg-[#F2F8FD] p-2.5 rounded-xl border border-[#D8E9FF]">
                    <BookOpen size={24} className="text-[#0F6FFF]" />
                  </div>
                )}
                {step.iconType === 'target' && (
                  <div className="text-[#0F6FFF] bg-[#F2F8FD] p-2.5 rounded-xl border border-[#D8E9FF]">
                    <Target size={24} className="text-[#0F6FFF]" />
                  </div>
                )}
                {step.iconType === 'lock' && (
                  <div className="text-slate-400 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                    <Lock size={22} className="text-slate-400" />
                  </div>
                )}
                {step.iconType === 'brain' && (
                  <div className="text-slate-400 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                    <Brain size={22} className="text-slate-400" />
                  </div>
                )}
                {step.iconType === 'hospital' && (
                  <div className="text-slate-400 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                    <Building2 size={22} className="text-slate-400" />
                  </div>
                )}
                {step.iconType === 'trophy' && (
                  <div className="text-slate-400 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                    <Trophy size={22} className="text-slate-400" />
                  </div>
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="min-h-[42px] flex flex-col justify-center space-y-0.5">
                <h3 className="text-xs font-extrabold text-[#1E293B] leading-tight uppercase tracking-tight">
                  {step.title}
                </h3>
                {step.subtitle && (
                  <p className="text-[10px] font-bold text-[#64748B] uppercase leading-tight tracking-tight">
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
                    <div className="flex items-center justify-center gap-1.5 text-[#64748B]">
                      <span className={`w-1.5 h-1.5 rounded-full ${step.isCompleted ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span>{step.isCompleted ? 'COMPLETED' : 'NOT STARTED'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-[#0F6FFF]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0F6FFF]" />
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
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    isLocked
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-gradient-to-r from-[#0F6FFF] to-[#2563EB] hover:from-[#0D62E0] hover:to-[#1D4ED8] text-white shadow-md shadow-blue-500/20 hover:scale-[1.02]'
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

