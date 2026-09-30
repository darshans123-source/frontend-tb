import React, { useState } from 'react';
import { Sparkles, Lock, ArrowRight, Gamepad2, Trophy, Puzzle } from 'lucide-react';
import NewsTicker from './dashboard/NewsTicker';
import WelcomeHero from './dashboard/WelcomeHero';
import LearningProgressCard from './dashboard/LearningProgressCard';
import TBFactCard from './dashboard/TBFactCard';
import TBIndiaGrid from './dashboard/TBIndiaGrid';
import MyLearningRoadmap from './dashboard/MyLearningRoadmap';
import ArticleModal, { ArticleData } from './dashboard/ArticleModal';
import DashboardFooter from './dashboard/DashboardFooter';
import { soundService } from '../services/soundService';

import { useSupabaseProfile } from '../hooks/useSupabaseProfile';

interface StudentDashboardProps {
  userId?: string | null;
  onStartLearning: () => void;
  onSelectLevel1: () => void;
  onStartSnakeLadder?: () => void;
  onStartMiniGame?: () => void;
  onStartCase: () => void;
  onOpenAITutor: () => void;
  onOpenLeaderboard: () => void;
  onOpenProgressReport: () => void;
  onOpenAudioSettings: () => void;
  isQuizPassed?: boolean;
  userName: string;
  userLevel: number;
  userProgress: number;
  xp: number;
  badgesCount: number;
  streak: number;
  completedCases: number;
  accuracy?: number;
  onLogout: () => void;
}

import { useUserProgress } from '../context/UserProgressContext';

export default function StudentDashboard({
  userId,
  onStartLearning,
  onSelectLevel1,
  onStartSnakeLadder,
  onStartMiniGame,
  onStartCase,
  onOpenAITutor,
  onOpenLeaderboard,
  onOpenProgressReport,
  onOpenAudioSettings,
  isQuizPassed = false,
  userName,
  userLevel,
  userProgress,
  xp,
  badgesCount,
  streak,
  completedCases,
  accuracy,
  onLogout
}: StudentDashboardProps) {
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);

  // Live Supabase Realtime Profile Hook & Global LocalStorage Context (Requirement 1, 8, 9)
  const { profile } = useSupabaseProfile(userId);
  const { progressData } = useUserProgress();

  const liveXp = progressData.xp || profile?.xp || xp;
  const liveLevel = progressData.level || profile?.level || userLevel;
  const liveProgress = progressData.progress || profile?.progress_percentage || userProgress;
  const liveCorrect = progressData.correct || profile?.correct_answers || 0;
  const liveWrong = progressData.wrong || profile?.wrong_answers || 0;
  const liveUnanswered = progressData.remaining ?? profile?.unanswered ?? Math.max(0, 50 - (liveCorrect + liveWrong));
  const liveTotalQuizzes = (progressData.quizCompleted ? 1 : 0) || profile?.total_quizzes || 0;
  const liveLastActivity = progressData.lastActivity || profile?.last_activity;

  // Unlock condition check: prop, profile, or localStorage context flag (Requirement 8 & 9)
  const isUnlocked = isQuizPassed || progressData.miniGameUnlocked || progressData.quizCompleted || (profile?.xp && profile.xp >= 80) || (typeof window !== 'undefined' && localStorage.getItem('tbquest_level1_quiz_passed') === 'true');

  return (
    <div className="space-y-6 pb-20 px-4 sm:px-6 md:px-8 max-w-[1600px] mx-auto font-sans">
      {/* Top Scrolling Dark Navy News Ribbon */}
      <NewsTicker
        onSelectNewsItem={(itemText) => {
          setSelectedArticle({
            title: itemText,
            category: 'LATEST UPDATE',
            readTime: '2 min',
            content: [
              `Official announcement regarding ${itemText} under National Tuberculosis Elimination Programme guidelines.`,
              'All medical students, healthcare practitioners, and diagnostic teams are encouraged to follow updated WHO & NTEP algorithms for rapid case notification and treatment initiation.'
            ],
            keyHighlights: [
              'Upfront molecular testing for presumptive cases.',
              'Free treatment and nutritional support under Ni-kshay scheme.'
            ]
          });
        }}
      />

      {/* Row 1: Welcome Hero Card + Learning Progress Card + Did You Know Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Welcome Hero Card */}
        <div className="lg:col-span-5 xl:col-span-6">
          <WelcomeHero
            userName={profile?.full_name || profile?.name || userName}
            onLearnClick={onStartLearning}
            onExploreClick={onOpenAITutor}
            onPracticeClick={onStartCase}
            onApplyClick={onOpenProgressReport}
          />
        </div>

        {/* Learning Progress Card (Section 9 - Real Supabase Data) */}
        <div className="lg:col-span-4 xl:col-span-3">
          <LearningProgressCard
            overallProgress={liveProgress}
            xp={liveXp}
            level={liveLevel}
            badgesCount={badgesCount}
            completedLevels={liveLevel > 1 ? liveLevel - 1 : (completedCases > 0 ? 1 : 0)}
            completedCases={completedCases}
            streak={streak}
            correctAnswers={liveCorrect}
            wrongAnswers={liveWrong}
            unanswered={liveUnanswered}
            totalQuizzes={liveTotalQuizzes}
            lastActivity={liveLastActivity}
            isCompleted={liveProgress >= 100 || (liveCorrect + liveWrong >= 50)}
          />
        </div>

        {/* Did You Know Card */}
        <div className="lg:col-span-3 xl:col-span-3">
          <TBFactCard
            onOpenArticle={(article) => setSelectedArticle(article)}
          />
        </div>
      </div>

      {/* 🐍 TB QUEST LEVEL 1 — SNAKE & LADDER & LEVEL 2 HERO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Card 1: 🐍 TB QUEST - PATH TO TB AWARENESS */}
        <div className="lg:col-span-7 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-2 border-emerald-500/50 rounded-2xl p-6 shadow-xl relative overflow-hidden text-white flex flex-col justify-between">
          <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-emerald-400 text-2xl shrink-0 shadow-md">
                🐍
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-widest block">
                  LEVEL 1 LEARNING MODE
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  TB QUEST: PATH TO TB AWARENESS
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Learn clinical TB awareness through gameplay! Journey from <strong>🧑‍🎓 TB Learner</strong> to <strong>🛡️ Awareness Champion</strong> on a 100-square board. Climb ladders with clinical reasoning, avoid distraction snakes, and master presumptive TB diagnosis.
            </p>
          </div>

          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 relative z-10 border-t border-slate-700/60 mt-3">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold">
              <span>🎯 100 Squares</span>
              <span>•</span>
              <span>🪜 Ladders</span>
              <span>•</span>
              <span>🐍 Snakes</span>
              <span>•</span>
              <span>⭐ XP Rewards</span>
            </div>

            <button
              type="button"
              onClick={() => {
                soundService.playClick();
                if (onStartSnakeLadder) onStartSnakeLadder();
              }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer hover:scale-105 flex items-center gap-2"
            >
              <Sparkles size={18} className="text-slate-950" />
              <span>PLAY LEVEL 1</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Card 2: 🔓 LEVEL 2 - INVESTIGATION LEARNING */}
        <div className={`lg:col-span-5 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between transition-all ${
          isUnlocked
            ? 'bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 border-2 border-cyan-400/50 text-white'
            : 'bg-slate-50 border-2 border-slate-200 text-slate-700'
        }`}>
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md ${
                isUnlocked ? 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-300' : 'bg-slate-200 text-slate-600'
              }`}>
                {isUnlocked ? '🔓 UNLOCKED' : '🔒 LEVEL 2 LOCKED'}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                CLINICAL CASES
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              LEVEL 2: INVESTIGATION LEARNING
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed">
              {isUnlocked
                ? 'Level 1 mastered! You now have access to comprehensive clinical simulations, lab reader tools, CBNAAT interpretation, and pediatric cases.'
                : 'Master Level 1 by completing the Snake & Ladder journey with ≥ 80% accuracy to unlock clinical investigation cases.'}
            </p>
          </div>

          <div className="pt-4 relative z-10 border-t border-slate-200/50 mt-3">
            {isUnlocked ? (
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  onStartCase();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-blue-500/25 transition-all cursor-pointer hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>START LEVEL 2 →</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <div className="flex items-center justify-between gap-2 p-3 bg-slate-100 rounded-xl text-slate-500 text-xs font-bold font-mono">
                <span className="flex items-center gap-1.5"><Lock size={16} /> LOCKED</span>
                <span>Requires Level 1 (≥80%)</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 🎮 MINI GAME CARD (Directly on Student Dashboard) */}
      <div className="bg-white border border-[#D8E9FF] rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(15,111,255,0.06)] hover:shadow-[0_20px_40px_rgba(15,111,255,0.12)] hover:border-[#0F6FFF]/35 transition-all duration-300 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-600 shrink-0">
                <Gamepad2 size={24} />
              </div>
              <div>
                <span className="text-[11px] font-mono font-bold text-amber-700 uppercase tracking-wider block">
                  🎮 Interactive Challenge
                </span>
                <h3 className="text-lg sm:text-2xl font-extrabold text-[#1E293B] flex items-center gap-2">
                  <span>Mini Game</span>
                  <span className="text-[#2563EB] font-bold">• Spot the TB Clues</span>
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl font-medium">
              Test your TB knowledge by identifying the correct clinical clues through an interactive challenge.
            </p>
          </div>

          <div className="shrink-0 w-full md:w-auto">
            {isUnlocked ? (
              <button
                type="button"
                onClick={() => {
                  soundService.playClick();
                  if (onStartMiniGame) onStartMiniGame();
                }}
                className="w-full md:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:scale-105 flex items-center justify-center gap-2"
              >
                <Sparkles size={18} className="text-slate-950" />
                <span>Start Mini Game</span>
                <ArrowRight size={18} />
              </button>
            ) : (
              <div className="flex flex-col items-center md:items-end gap-1.5">
                <button
                  type="button"
                  disabled
                  className="w-full md:w-auto px-6 py-3.5 bg-slate-100 border border-slate-300 text-slate-400 font-bold rounded-xl text-xs sm:text-sm cursor-not-allowed flex items-center justify-center gap-2 shadow-xs"
                >
                  <Lock size={16} />
                  <span>🔒 Complete the Quiz to Unlock</span>
                </button>
                <span className="text-[11px] text-amber-700 font-mono font-semibold text-center md:text-right">
                  Complete Level 1 Quiz to unlock
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: TB IN INDIA - 2026 Grid + Right Column (TB Awareness & Quick Links) */}
      <div>
        <TBIndiaGrid
          onOpenArticle={(article) => setSelectedArticle(article)}
          onOpenQuickLink={(linkId) => {
            if (linkId === 'intro') onStartLearning();
            else if (linkId === 'forum') onOpenAITutor();
            else if (linkId === 'resources') onOpenProgressReport();
            else onStartLearning();
          }}
        />
      </div>

      {/* Row 3: MY TB QUEST JOURNEY Stepper Roadmap Bar */}
      <div>
        <MyLearningRoadmap
          userLevel={userLevel}
          completedCases={completedCases}
          onStartLevel={(lvl) => {
            if (lvl === 1) onSelectLevel1();
            else onStartCase();
          }}
          onStartIntroduction={onStartLearning}
        />
      </div>

      {/* Article Modal */}
      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}
