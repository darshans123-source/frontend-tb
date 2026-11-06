import React from 'react';
import { Trophy, Star, CheckCircle2, XCircle, FileText, Clock, Activity } from 'lucide-react';
import { useUserProgress } from '../../context/UserProgressContext';

interface LearningProgressCardProps {
  overallProgress?: number;
  xp?: number;
  level?: number;
  badgesCount?: number;
  completedLevels?: number;
  completedCases?: number;
  streak?: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  unanswered?: number;
  totalQuizzes?: number;
  lastActivity?: string;
  isCompleted?: boolean;
}

export default function LearningProgressCard({}: LearningProgressCardProps) {
  // Read live data directly from localStorage via UserProgressContext (Requirements 1, 5, 6, 7, 10)
  const { progressData } = useUserProgress();

  const {
    xp,
    level,
    correct,
    wrong,
    remaining,
    answered,
    progress,
    quizCompleted,
    lastActivity
  } = progressData;

  const roundedProgress = Math.min(100, Math.max(0, Math.round(progress)));
  const completedQuestions = Math.min(50, answered);
  const isZeroState = answered === 0 && xp === 0 && !quizCompleted;

  // Requirement 5 & 7: Relative Time Formatter for Last Activity
  const formatRelativeTime = (dateStr?: string) => {
    if (!dateStr) return 'Just Now';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Just Now';

    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffMin = Math.floor(diffSec / 60);

    if (diffSec < 60) return 'Just Now';
    if (diffMin < 60) return `${diffMin} Minute${diffMin > 1 ? 's' : ''} Ago`;

    const isToday = now.toDateString() === date.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = yesterday.toDateString() === date.toDateString();

    const timeString = date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', hour12: true });

    if (isToday) return `Today ${timeString}`;
    if (isYesterday) return `Yesterday ${timeString}`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Requirement 4: Level 1 = 0-99 XP
  const nextLevelXpTarget = level >= 5 ? 500 : level * 100;
  const remainingXpNeeded = Math.max(0, nextLevelXpTarget - xp);

  return (
    <div className="tq-card tq-lift rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full space-y-4 font-sans relative overflow-hidden min-w-0">
      {/* Background Soft Glow */}
      <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br from-[#0F6FFF]/10 via-[#2563EB]/5 to-transparent blur-2xl pointer-events-none" />

      {/* Card Header: Title & Status Badge */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <h3 className="tq-eyebrow text-xs font-extrabold uppercase tracking-wider text-ink-900 dark:text-slate-100 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] animate-pulse shadow-xs" />
          <span>Your Live Progress</span>
        </h3>

        {/* Current Quiz Status Badge (Requirement 8 & 9) */}
        {quizCompleted || roundedProgress >= 100 ? (
          <span className="tq-chip tq-chip-teal px-3 py-1 border border-emerald-300 dark:border-teal-500/40 text-[11px] font-mono font-bold flex items-center gap-1 shadow-xs">
            🎉 Quiz Completed
          </span>
        ) : isZeroState ? (
          <span className="tq-chip tq-chip-slate px-3 py-1 border border-slate-300 dark:border-slate-600 text-[11px] font-mono font-bold">
            No Quiz Started Yet
          </span>
        ) : (
          <span className="tq-chip tq-chip-royal px-3 py-1 border border-blue-200 dark:border-blue-500/40 text-[11px] font-mono font-bold flex items-center gap-1">
            <Activity size={13} className="animate-spin text-[#2563EB]" /> Live Sync
          </span>
        )}
      </div>

      {/* Empty State Banner (Requirement 9) */}
      {isZeroState && (
        <div className="p-3 bg-blue-50/60 dark:bg-[#111c30] border border-blue-200 dark:border-slate-700 rounded-xl text-center space-y-1 relative z-10">
          <span className="text-xs font-bold text-brand-royal dark:text-blue-300 block">Welcome to TB Quest Diagnostic Portal</span>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 font-medium">Start your first quiz to begin earning XP and leveling up!</p>
        </div>
      )}

      {/* Progress Ring + Level Card Row */}
      <div className="grid grid-cols-12 gap-3 items-center relative z-10 py-1">
        {/* Left: Animated Progress Ring (Requirement 5) */}
        <div className="col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <svg className="w-20 h-20 transform -rotate-90">
              <defs>
                <linearGradient id="liveRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#0F6FFF" />
                </linearGradient>
              </defs>
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="#EFF6FF"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                stroke="url(#liveRingGradient)"
                strokeWidth="7"
                fill="transparent"
                strokeDasharray="201"
                strokeDashoffset={201 - (201 * roundedProgress) / 100}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="tq-display text-base font-black text-brand-teal-deep dark:text-teal-300 font-mono leading-none">
                {roundedProgress}%
              </span>
              <span className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter mt-0.5">Progress</span>
            </div>
          </div>
        </div>

        {/* Right: Level Card (Requirement 4 & 5) */}
        <div className="col-span-7 bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-700 p-3 rounded-xl space-y-1.5 shadow-2xs min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-ink-900 dark:text-slate-100 flex items-center gap-1.5">
              <Trophy size={15} className="text-amber-500" /> 🏆 Level {level}
            </span>
            <span className="tq-chip tq-chip-royal text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-500/40">
              {xp} XP / {nextLevelXpTarget} XP
            </span>
          </div>

          <p className="text-[11px] font-mono font-semibold text-slate-600 dark:text-slate-300">
            {level >= 5 ? (
              <span className="text-emerald-700 dark:text-emerald-300 font-bold">✨ Max Level Reached!</span>
            ) : (
              <span><strong className="text-[#2563EB]">{remainingXpNeeded} XP</strong> needed for Level {level + 1}</span>
            )}
          </p>
        </div>
      </div>

      {/* Overall Progress Bar (Requirement 5) */}
      <div className="space-y-1.5 relative z-10 pt-1 border-t border-slate-200/70 dark:border-slate-700/70">
        <div className="flex justify-between items-center text-xs font-mono">
          <span className="font-bold text-ink-900 dark:text-slate-100">Overall Progress</span>
          <span className="font-extrabold text-brand-teal-deep dark:text-teal-300">
            {completedQuestions} / 50 Questions Completed
          </span>
        </div>
        <div className="tq-progress w-full border border-slate-200 dark:border-slate-700 h-3 rounded-full overflow-hidden p-0.5">
          <div
            className="tq-progress-bar bg-gradient-to-r from-brand-teal via-brand-emerald to-brand-royal h-full rounded-full transition-all duration-500 ease-out shadow-xs"
            style={{ width: `${Math.max(2, roundedProgress)}%` }}
          />
        </div>
      </div>

      {/* Four Live Statistics Cards (Requirement 5 & 10) */}
      <div className="grid grid-cols-4 gap-2 pt-1 relative z-10 font-mono text-xs">
        <div className="bg-slate-50 dark:bg-[#111c30] p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-center shadow-2xs min-w-0">
          <span className="text-[10px] text-amber-700 uppercase block font-extrabold flex items-center justify-center gap-1">
            <Star size={11} className="text-amber-500 fill-amber-500" /> ⭐ XP
          </span>
          <span className="tq-display font-black text-ink-900 dark:text-slate-100 text-sm mt-0.5 block">{xp}</span>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-500/40 text-center shadow-2xs min-w-0">
          <span className="text-[10px] text-emerald-700 uppercase block font-extrabold flex items-center justify-center gap-1">
            <CheckCircle2 size={11} className="text-emerald-600" /> ✅ Correct
          </span>
          <span className="tq-display font-black text-emerald-800 dark:text-emerald-300 text-sm mt-0.5 block">{correct}</span>
        </div>

        <div className="bg-rose-50 dark:bg-rose-950/40 p-2.5 rounded-xl border border-rose-200 dark:border-rose-500/40 text-center shadow-2xs min-w-0">
          <span className="text-[10px] text-rose-700 uppercase block font-extrabold flex items-center justify-center gap-1">
            <XCircle size={11} className="text-rose-600" /> ❌ Wrong
          </span>
          <span className="tq-display font-black text-rose-800 dark:text-rose-300 text-sm mt-0.5 block">{wrong}</span>
        </div>

        <div className="bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-xl border border-blue-200 dark:border-blue-500/40 text-center shadow-2xs min-w-0">
          <span className="text-[10px] text-[#2563EB] uppercase block font-extrabold flex items-center justify-center gap-1">
            <FileText size={11} className="text-[#2563EB]" /> 📄 Remain
          </span>
          <span className="tq-display font-black text-brand-royal dark:text-blue-300 text-sm mt-0.5 block">{remaining}</span>
        </div>
      </div>

      {/* Last Activity Footer (Requirement 5 & 6) */}
      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono flex items-center justify-between gap-2 pt-2 border-t border-slate-200/70 dark:border-slate-700/70 relative z-10">
        <span className="flex items-center gap-1">
          <Clock size={13} className="text-slate-400" /> Last Activity:
        </span>
        <strong className="text-ink-900 dark:text-slate-100">{formatRelativeTime(lastActivity)}</strong>
      </div>
    </div>
  );
}
