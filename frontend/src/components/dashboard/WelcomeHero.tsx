import React, { useState } from 'react';
import { Lock, Shuffle, Component, Briefcase } from 'lucide-react';
import { soundService } from '../../services/soundService';
import { adminService } from '../../services/adminService';
import tbLungsHero from '../../assets/tb_lungs_hero.png';

interface WelcomeHeroProps {
  userName: string;
  onLearnClick: () => void;
  onExploreClick: () => void;
  onPracticeClick: () => void;
  onApplyClick: () => void;
}

export default function WelcomeHero({
  userName,
  onLearnClick,
  onExploreClick,
  onPracticeClick,
  onApplyClick
}: WelcomeHeroProps) {
  const heroConfig = adminService.getHeroConfig();
  const [imgSrc, setImgSrc] = useState(heroConfig.heroImageUrl || tbLungsHero);

  return (
    <div className="tq-card tq-lift rounded-2xl p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-6 h-full relative overflow-hidden min-w-0">
      {/* Background Soft Glow */}
      <div className="absolute -top-24 -left-24 w-60 h-60 rounded-full bg-gradient-to-br from-[#0F6FFF]/10 via-[#2563EB]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Left Side Content */}
      <div className="space-y-3.5 flex-1 min-w-0 z-10 w-full md:w-auto">
        <div>
          <span className="tq-chip tq-chip-royal inline-flex items-center gap-1.5 px-3 py-1 uppercase tracking-wider mb-2">
            <span>✨</span> Skill Development Center • NIT Raichur
          </span>
          <h1 className="tq-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-ink-900 dark:text-slate-100 tracking-tight">
            Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-teal via-brand-emerald to-brand-royal">{userName ? userName.toUpperCase() : 'DARSHAN'}</span> 👋
          </h1>
        </div>

        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-200 leading-tight">
            Welcome to <span className="text-brand-teal-deep dark:text-teal-300 font-extrabold">TB Quest</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed mt-1 max-w-md">
            An Interactive Gamified Learning Platform for TB Diagnostic Education
          </p>
        </div>

        {/* 4 Premium Rounded Pill Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              onLearnClick();
            }}
            className="tq-btn-primary touch-target min-h-11 flex items-center gap-1.5 px-4 py-2 text-white font-bold text-xs rounded-full shadow-md shadow-blue-500/25 hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            <Lock size={13} className="text-white" />
            <span>Learn</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              onExploreClick();
            }}
            className="touch-target min-h-11 flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-full shadow-md shadow-emerald-500/25 hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            <Shuffle size={13} className="text-white" />
            <span>Explore</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              onPracticeClick();
            }}
            className="touch-target min-h-11 flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-full shadow-md shadow-amber-500/25 hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            <Component size={13} className="text-white" />
            <span>Practice</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundService.playClick();
              onApplyClick();
            }}
            className="touch-target min-h-11 flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-full shadow-md shadow-purple-500/25 hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
          >
            <Briefcase size={13} className="text-white" />
            <span>Apply</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold pt-0.5">
          Your learning journey begins here.
        </p>
      </div>

      {/* Right Side - Lungs Image with Glow */}
      <div className="tq-glass rounded-2xl relative shrink-0 flex items-center justify-center self-center p-3 sm:p-4 z-10 w-full md:w-auto min-w-0">
        <div className="absolute w-[85%] h-[85%] rounded-full bg-gradient-to-tr from-sky-200/60 via-blue-200/50 to-indigo-100/60 blur-3xl pointer-events-none -z-10" />

        <img
          src={imgSrc}
          onError={() => setImgSrc(tbLungsHero)}
          alt="3D Lungs Hero Illustration"
          className="tq-img-hero tq-img object-cover aspect-square w-[180px] md:w-[230px] lg:w-[280px] xl:w-[320px] h-auto rounded-2xl drop-shadow-[0_12px_24px_rgba(15,111,255,0.18)] animate-float transition-all duration-300 relative z-10 max-w-full"
        />
      </div>
    </div>
  );
}

