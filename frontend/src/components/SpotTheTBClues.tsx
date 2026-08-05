import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Moon,
  TrendingDown,
  Thermometer,
  Users,
  Home,
  Bone,
  Eye,
  Scissors,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  User,
  HeartPulse,
  Search,
  BookOpen,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { soundService } from '../services/soundService';
import { supabaseData } from '../services/supabaseData';

export interface ClueCardItem {
  id: string;
  title: string;
  isCorrect: boolean;
  icon: React.ElementType;
  description: string;
}

const CLUE_DATABASE: ClueCardItem[] = [
  // 6 Correct TB Clues
  {
    id: 'cough',
    title: 'Persistent cough',
    isCorrect: true,
    icon: Stethoscope,
    description: 'Cough lasting > 2 weeks'
  },
  {
    id: 'sweats',
    title: 'Night sweats',
    isCorrect: true,
    icon: Moon,
    description: 'Drenching nocturnal sweating'
  },
  {
    id: 'weight-loss',
    title: 'Weight loss',
    isCorrect: true,
    icon: TrendingDown,
    description: 'Unexplained weight reduction'
  },
  {
    id: 'fever',
    title: 'Fever',
    isCorrect: true,
    icon: Thermometer,
    description: 'Low-grade evening pyrexia'
  },
  {
    id: 'contact',
    title: 'Contact with TB patient',
    isCorrect: true,
    icon: Users,
    description: 'Close exposure to active case'
  },
  {
    id: 'crowded',
    title: 'Crowded living conditions',
    isCorrect: true,
    icon: Home,
    description: 'Overcrowded poorly ventilated area'
  },

  // 3 Incorrect Clues
  {
    id: 'broken-arm',
    title: 'Broken arm',
    isCorrect: false,
    icon: Bone,
    description: 'Orthopedic fracture'
  },
  {
    id: 'blue-eyes',
    title: 'Blue eye colour',
    isCorrect: false,
    icon: Eye,
    description: 'Normal genetic variation'
  },
  {
    id: 'hair-loss',
    title: 'Hair loss',
    isCorrect: false,
    icon: Scissors,
    description: 'Dermatological alopecia'
  }
];

const shuffleArray = <T,>(arr: T[]): T[] => {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface SpotTheTBCluesProps {
  currentUserId?: string | null;
  onProceedToLevel2?: () => void;
  onReturnToDashboard?: () => void;
}

export default function SpotTheTBClues({
  currentUserId,
  onProceedToLevel2,
  onReturnToDashboard
}: SpotTheTBCluesProps) {
  const [stage, setStage] = useState<'unlock' | 'playing' | 'result'>('unlock');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [cards, setCards] = useState<ClueCardItem[]>(() => shuffleArray(CLUE_DATABASE));
  const [selectedClues, setSelectedClues] = useState<Set<string>>(new Set());
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Start / Reset Game Flow
  const startGame = () => {
    setCards(shuffleArray(CLUE_DATABASE));
    setSelectedClues(new Set());
    setTimeLeft(30);
    setStartTime(Date.now());
    setStage('playing');
    soundService.playClick();
  };

  // Timer Countdown Effect
  useEffect(() => {
    if (stage !== 'playing') return;

    if (timeLeft <= 0) {
      finishGame();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          finishGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [stage, timeLeft]);

  // Auto-finish when all 6 correct clues are selected
  useEffect(() => {
    if (stage !== 'playing') return;
    const correctCount = cards.filter(c => c.isCorrect && selectedClues.has(c.id)).length;
    if (correctCount === 6) {
      finishGame();
    }
  }, [selectedClues, stage, cards]);

  const handleCardClick = (card: ClueCardItem) => {
    if (selectedClues.has(card.id) || stage !== 'playing') return;

    const nextSet = new Set(selectedClues);
    nextSet.add(card.id);
    setSelectedClues(nextSet);

    if (card.isCorrect) {
      soundService.playCorrect();
    } else {
      soundService.playIncorrect();
    }
  };

  const finishGame = async () => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    setStage('result');
    soundService.playTrophy();

    // Educational progression sync to Supabase without points or XP
    if (currentUserId) {
      try {
        await supabaseData.updateUserProfile(currentUserId, {
          level: Math.max(2, 2),
          updated_at: new Date().toISOString()
        });
        await supabaseData.saveQuizResult(currentUserId, 'mini-game-spot-tb-clues', 100, 0, elapsed);
      } catch (e) {
        console.warn('Mini game sync note:', e);
      }
    }
    localStorage.setItem('tbquest_minigame_completed', 'true');
    localStorage.setItem('tbquest_level2_unlocked', 'true');
  };

  // Timer Color State
  const getTimerColor = (sec: number) => {
    if (sec > 15) {
      return {
        text: 'text-emerald-400',
        stroke: '#10B981',
        bg: 'bg-emerald-950/30 border-emerald-500/40'
      };
    } else if (sec >= 7) {
      return {
        text: 'text-amber-400',
        stroke: '#F59E0B',
        bg: 'bg-amber-950/30 border-amber-500/40'
      };
    } else {
      return {
        text: 'text-rose-500',
        stroke: '#EF4444',
        bg: 'bg-rose-950/40 border-rose-500/60 animate-pulse'
      };
    }
  };

  // 1. UNLOCK SCREEN
  if (stage === 'unlock') {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 md:p-8 flex items-center justify-center relative overflow-hidden">
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-2xl w-full bg-slate-900/90 border border-cyan-500/40 rounded-3xl p-6 sm:p-10 text-center space-y-6 shadow-[0_0_50px_rgba(6,182,212,0.2)] backdrop-blur-xl relative z-10">
          {/* Unlock Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-300 font-extrabold text-xs tracking-wider uppercase shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>🏆 MINI GAME UNLOCKED</span>
          </div>

          <div className="space-y-2">
            <p className="text-cyan-400 font-extrabold text-sm sm:text-base tracking-wide uppercase">
              Congratulations!
            </p>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Spot the TB Clues
            </h1>
          </div>

          {/* 4 Feature Illustration Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2">
            <div className="p-3 bg-slate-950 border border-cyan-500/30 rounded-2xl flex flex-col items-center gap-2 shadow-xs">
              <HeartPulse className="w-8 h-8 text-cyan-400 animate-pulse" />
              <span className="text-[11px] font-bold text-slate-300">Healthy Lungs</span>
            </div>
            <div className="p-3 bg-slate-950 border border-amber-500/30 rounded-2xl flex flex-col items-center gap-2 shadow-xs">
              <Search className="w-8 h-8 text-amber-400" />
              <span className="text-[11px] font-bold text-slate-300">Magnifying Glass</span>
            </div>
            <div className="p-3 bg-slate-950 border border-emerald-500/30 rounded-2xl flex flex-col items-center gap-2 shadow-xs">
              <ShieldCheck className="w-8 h-8 text-emerald-400" />
              <span className="text-[11px] font-bold text-slate-300">Medical Shield</span>
            </div>
            <div className="p-3 bg-slate-950 border border-purple-500/30 rounded-2xl flex flex-col items-center gap-2 shadow-xs">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <span className="text-[11px] font-bold text-slate-300">Confetti</span>
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-1">
            <p className="text-xs font-bold text-amber-400 uppercase tracking-wide">Final Challenge</p>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              Identify the clinical clues that indicate Tuberculosis before time runs out.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={startGame}
              className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-base rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.4)] flex items-center justify-center gap-3 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Start Challenge</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. RESULT SCREEN
  if (stage === 'result') {
    const correctIdentified = CLUE_DATABASE.filter(c => c.isCorrect);
    const notTBClues = CLUE_DATABASE.filter(c => !c.isCorrect);

    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        {/* Top Banner Card */}
        <div className="bg-gradient-to-b from-slate-900 via-emerald-950/60 to-slate-900 border border-emerald-500/50 rounded-3xl p-6 sm:p-10 text-center space-y-4 shadow-[0_0_40px_rgba(16,185,129,0.2)] relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none text-emerald-400">
            <Sparkles className="w-72 h-72 animate-spin-slow" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Mission Accomplished</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Spot the TB Clues Completed
          </h1>

          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            You successfully identified the important clinical features of Tuberculosis.
          </p>

          {/* Large Medical Shield Badge */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-slate-950 border border-amber-500/50 text-amber-300 font-bold text-sm shadow-lg">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <span>Official TB Clues Recognition Passed</span>
            </div>
          </div>
        </div>

        {/* Identified Clues Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Correctly Identified */}
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-base">
              <CheckCircle2 className="w-5 h-5" />
              <span>Correctly Identified TB Clues ({correctIdentified.length})</span>
            </div>
            <ul className="space-y-2 text-xs font-bold text-slate-200">
              {correctIdentified.map(item => (
                <li key={item.id} className="p-2.5 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✔</span> {item.title}
                  </span>
                  <span className="text-[10px] text-emerald-400/80 font-mono">TB Symptom</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Not TB Clues */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-base">
              <XCircle className="w-5 h-5" />
              <span>Not TB Clues ({notTBClues.length})</span>
            </div>
            <ul className="space-y-2 text-xs font-bold text-slate-400">
              {notTBClues.map(item => (
                <li key={item.id} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-rose-400 font-bold">✖</span> {item.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Unrelated</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Educational Card */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950/80 to-slate-900 border border-cyan-500/40 rounded-3xl p-6 space-y-3 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <HeartPulse className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-black text-cyan-300">Key Learning</h3>
              <p className="text-xs text-slate-300 font-medium">Core Clinical Warning Signs of Tuberculosis</p>
            </div>
          </div>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-medium pt-1">
            Persistent cough lasting more than two weeks, fever, night sweats, weight loss, and close contact with a TB patient are important warning signs. Early identification leads to timely diagnosis and treatment.
          </p>
        </div>

        {/* Learning Roadmap Stepper */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-white text-base">Progress Journey</h3>
            <span className="text-xs text-emerald-400 font-mono font-bold">Level 2 Unlocked!</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
            {[
              { title: 'TB Introduction', status: 'completed' },
              { title: 'Level 1 Quiz Completed', status: 'completed' },
              { title: 'Spot the TB Clues', status: 'completed' },
              { title: 'Level 2 Investigation Interpreter', status: 'unlocked' },
              { title: 'Level 3 Diagnostic Decision Maker', status: 'locked' },
              { title: 'Level 4 Case Simulation', status: 'locked' },
              { title: 'Level 5 TB Diagnostic Expert', status: 'locked' }
            ].map((step, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-xl border text-center space-y-1 transition-all ${
                  step.status === 'completed'
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                    : step.status === 'unlocked'
                    ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300 ring-2 ring-cyan-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-500 opacity-60'
                }`}
              >
                <div className="flex justify-center">
                  {step.status === 'completed' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : step.status === 'unlocked' ? (
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <p className="text-[10px] font-extrabold leading-tight">{step.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={startGame}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold rounded-2xl text-xs sm:text-sm transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Play Again</span>
          </button>

          {onProceedToLevel2 ? (
            <button
              onClick={onProceedToLevel2}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
            >
              <span>Continue to Level 2</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : onReturnToDashboard ? (
            <button
              onClick={onReturnToDashboard}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  // 3. GAME SCREEN
  const timerColor = getTimerColor(timeLeft);
  const strokeDashoffset = 283 - (283 * timeLeft) / 30;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Navbar */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-black text-white text-lg leading-tight">Spot the TB Clues</h2>
            <p className="text-xs text-slate-400 font-mono">Clinical Medical Learning Mini Game</p>
          </div>
        </div>

        {onReturnToDashboard && (
          <button
            onClick={onReturnToDashboard}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
        )}
      </div>

      {/* 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Panel: Animated Circular Timer + How to Play */}
        <div className="lg:col-span-3 space-y-5">
          {/* Circular Animated Timer Card */}
          <div className={`p-6 rounded-3xl border text-center space-y-3 ${timerColor.bg} shadow-xl transition-colors duration-500`}>
            <div className="flex flex-col items-center justify-center relative">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="45"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="45"
                  stroke={timerColor.stroke}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="283"
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className={`text-3xl font-black font-mono ${timerColor.text}`}>
                  {timeLeft}s
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">30 Seconds</span>
              </div>
            </div>

            <div className="pt-1">
              <span className="text-xs font-bold text-slate-300">Time Remaining</span>
            </div>
          </div>

          {/* Instruction Card */}
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-sm">
              <BookOpen className="w-4 h-4" />
              <span>How to Play</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed font-medium">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold mt-0.5">✓</span>
                <span>Click <strong>ONLY</strong> the clues that indicate Tuberculosis.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold mt-0.5">✕</span>
                <span>Avoid selecting unrelated clues.</span>
              </li>
            </ul>
            <div className="pt-2 text-[11px] text-slate-400 border-t border-slate-800 font-mono">
              Educational Only — No scoring or penalty.
            </div>
          </div>
        </div>

        {/* Center Panel: Patient Profile & Details */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base">Patient Profile</h3>
                <p className="text-xs text-slate-400">Clinical Case Study</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-500/30 rounded-full text-xs font-mono font-bold">
              Case #TB-2026
            </span>
          </div>

          {/* Demographic Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Age</span>
              <span className="text-white font-extrabold">28 Years</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Gender</span>
              <span className="text-white font-extrabold">Male</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Occupation</span>
              <span className="text-white font-extrabold">Factory Worker</span>
            </div>
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Residence</span>
              <span className="text-white font-extrabold">Urban</span>
            </div>
          </div>

          {/* Chief Complaint */}
          <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl space-y-1">
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wide">Chief Complaint</span>
            <p className="text-xs font-extrabold text-amber-200">
              Persistent cough for 3 weeks
            </p>
          </div>

          {/* History */}
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold text-slate-300 uppercase tracking-wide">History</span>
            <ul className="grid grid-cols-2 gap-1.5 text-xs font-medium text-slate-300">
              <li className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-1.5">
                <span className="text-cyan-400 font-bold">•</span> Weight loss
              </li>
              <li className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-1.5">
                <span className="text-cyan-400 font-bold">•</span> Night sweats
              </li>
              <li className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-1.5">
                <span className="text-cyan-400 font-bold">•</span> Fever
              </li>
              <li className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-1.5">
                <span className="text-cyan-400 font-bold">•</span> Loss of appetite
              </li>
              <li className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-1.5">
                <span className="text-cyan-400 font-bold">•</span> Fatigue
              </li>
              <li className="p-2 bg-slate-950 rounded-lg border border-slate-800 flex items-center gap-1.5">
                <span className="text-cyan-400 font-bold">•</span> Contact with TB patient
              </li>
            </ul>
          </div>

          {/* Bottom Prompt */}
          <div className="pt-2 text-center text-xs font-bold text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800">
            Identify all TB-related clues before the timer ends.
          </div>
        </div>

        {/* Right Panel: 3x3 Grid of Clickable Clue Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">3×3 Clue Cards Grid</span>
            <span className="text-xs text-cyan-400 font-mono font-bold">
              Found: {cards.filter(c => c.isCorrect && selectedClues.has(c.id)).length} / 6
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {cards.map((card) => {
              const isSelected = selectedClues.has(card.id);
              const IconComp = card.icon;

              let cardStyle = "bg-slate-900 border-slate-800 text-white hover:border-cyan-500/50 hover:scale-105 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]";

              if (isSelected) {
                if (card.isCorrect) {
                  cardStyle = "bg-emerald-950/70 border-emerald-500 text-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-100";
                } else {
                  cardStyle = "bg-rose-950/70 border-rose-500 text-rose-200 shadow-[0_0_20px_rgba(244,63,94,0.4)] scale-100";
                }
              }

              return (
                <button
                  key={card.id}
                  disabled={isSelected}
                  onClick={() => handleCardClick(card)}
                  className={`p-3 rounded-2xl border transition-all duration-200 flex flex-col items-center justify-between text-center min-h-[115px] sm:min-h-[130px] relative group cursor-pointer ${cardStyle}`}
                >
                  {/* Selection Indicator Badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      {card.isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400 animate-pulse" />
                      )}
                    </div>
                  )}

                  <div className="pt-2 flex justify-center">
                    <div className={`p-2.5 rounded-xl ${isSelected ? (card.isCorrect ? 'bg-emerald-900/50 text-emerald-300' : 'bg-rose-900/50 text-rose-300') : 'bg-slate-950 text-cyan-400 group-hover:text-cyan-300'}`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="space-y-0.5 pb-1">
                    <p className="font-extrabold text-xs leading-tight">
                      {card.title}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
