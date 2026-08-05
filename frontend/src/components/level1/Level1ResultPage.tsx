import React, { useEffect } from 'react';
import {
  Trophy,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Zap,
  BookOpen
} from 'lucide-react';
import { soundService } from '../../services/soundService';

interface Level1ResultPageProps {
  stats: {
    totalScore: number;
    percentage: number;
    correctCount: number;
    wrongCount: number;
    xpEarned: number;
    badge: string;
    passed: boolean;
    durationSeconds: number;
  };
  onRetry: () => void;
  onProceedToLevel2?: () => void;
  onBackToModules: () => void;
}

export default function Level1ResultPage({
  stats,
  onRetry,
  onProceedToLevel2,
  onBackToModules
}: Level1ResultPageProps) {
  useEffect(() => {
    if (stats.passed) {
      soundService.playTrophy();
    } else {
      soundService.playIncorrect();
    }
  }, [stats.passed]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto space-y-6 sm:space-y-8 text-white min-h-screen">
      {/* Top Banner Card */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border text-center space-y-3 relative overflow-hidden shadow-2xl ${
          stats.passed
            ? 'bg-gradient-to-b from-slate-900 via-emerald-950/60 to-slate-900 border-emerald-500/50 shadow-[0_0_35px_rgba(16,185,129,0.2)]'
            : 'bg-gradient-to-b from-slate-900 via-rose-950/60 to-slate-900 border-rose-500/50 shadow-[0_0_35px_rgba(244,63,94,0.2)]'
        }`}
      >
        {/* Background Sparkles Effect */}
        {stats.passed && (
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none text-emerald-400">
            <Sparkles size={260} />
          </div>
        )}

        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-mono font-bold border">
          {stats.passed ? (
            <span className="bg-emerald-950 text-emerald-400 border-emerald-500/40 flex items-center gap-1.5 px-3 py-0.5 rounded-full">
              <ShieldCheck size={14} /> Official Level 1 Assessment Passed
            </span>
          ) : (
            <span className="bg-rose-950 text-rose-400 border-rose-500/40 flex items-center gap-1.5 px-3 py-0.5 rounded-full">
              <XCircle size={14} /> Score Below 80 Marks (80%)
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          {stats.passed ? 'Assessment Passed!' : 'Official Assessment Result'}
        </h1>
        <p className="text-slate-300 text-xs sm:text-base max-w-xl mx-auto leading-relaxed">
          {stats.passed
            ? 'You have successfully passed the Official Level 1 Assessment and met all WHO/NTEP core proficiency standards.'
            : 'You scored below the 80-mark (80%) passing threshold. Review the core curriculum and retry to unlock Level 2.'}
        </p>

        {/* Badge Tier */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-slate-950 border border-amber-500/40 text-amber-300 font-bold text-sm shadow-md">
            <Trophy size={18} className="text-amber-400" />
            <span>Badge Tier: 🏆 {stats.badge}</span>
          </div>
        </div>
      </div>

      {/* Score Metrics Bento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Score */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Total Score</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-amber-400">{stats.totalScore} / 100</span>
        </div>

        {/* Percentage */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Percentage</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400">{stats.percentage}%</span>
        </div>

        {/* XP Earned */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">XP Earned</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400">+{stats.xpEarned} XP</span>
        </div>

        {/* Time Taken */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl text-center space-y-1">
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider block">Time Taken</span>
          <span className="text-2xl sm:text-3xl font-extrabold text-purple-400">{formatTime(stats.durationSeconds)}</span>
        </div>
      </div>

      {/* Performance Breakdown */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">Detailed Examination Breakdown</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-emerald-500/30">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <CheckCircle2 size={16} /> Correct Answers
            </div>
            <span className="text-sm font-extrabold text-white">{stats.correctCount} / 50</span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-950 rounded-2xl border border-rose-500/30">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <XCircle size={16} /> Incorrect / Unanswered
            </div>
            <span className="text-sm font-extrabold text-white">{stats.wrongCount} / 50</span>
          </div>
        </div>

        {/* Mini Game Unlock Alert */}
        {stats.passed && (
          <div className="p-5 bg-gradient-to-r from-slate-950 via-amber-950/50 to-slate-950 border border-amber-500/50 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <div className="flex items-center gap-3 text-left">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                <Sparkles size={24} className="animate-pulse text-amber-400" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-amber-400 uppercase tracking-wide">
                  🏆 MINI GAME UNLOCKED
                </div>
                <h4 className="text-base font-black text-white">Spot the TB Clues Mini Game</h4>
                <p className="text-xs text-slate-300">Identify clinical clues before time runs out to automatically unlock Level 2!</p>
              </div>
            </div>
            {onProceedToLevel2 && (
              <button
                onClick={onProceedToLevel2}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-105 shrink-0"
              >
                <span>Start Mini Game Challenge</span>
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <button
          onClick={onRetry}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold rounded-2xl text-xs sm:text-sm transition-all cursor-pointer"
        >
          <RotateCcw size={16} />
          <span>Retry Assessment (New Shuffled Questions)</span>
        </button>

        {stats.passed && onProceedToLevel2 ? (
          <button
            onClick={onProceedToLevel2}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-500 hover:from-amber-400 hover:to-teal-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer hover:scale-105"
          >
            <span>Play Spot the TB Clues Mini Game</span>
            <ArrowRight size={18} />
          </button>
        ) : (
          <button
            onClick={onBackToModules}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
          >
            <BookOpen size={16} />
            <span>Return to Learning Modules</span>
          </button>
        )}
      </div>
    </div>
  );
}

