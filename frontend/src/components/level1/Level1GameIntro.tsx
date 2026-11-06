import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Award,
  Zap,
  BookOpen,
  Lock,
  Unlock,
  Activity,
  Layers,
  Sparkles,
  Check,
  X,
  Play
} from 'lucide-react';
import { soundService } from '../../services/soundService';

interface Level1GameIntroProps {
  onStartGame: () => void;
  onBackToIntro?: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

const TOTAL_SCREENS = 6;

export default function Level1GameIntro({
  onStartGame,
  onBackToIntro,
  isModal = false,
  onClose
}: Level1GameIntroProps) {
  const [currentScreen, setCurrentScreen] = useState<number>(1);
  const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');
  const [musicEnabled, setMusicEnabled] = useState<boolean>(() => {
    try {
      return soundService.getMusicEnabled();
    } catch {
      return true;
    }
  });
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(() => {
    try {
      return soundService.getSfxEnabled();
    } catch {
      return true;
    }
  });

  // Interactive Mini Simulations
  const [miniDice, setMiniDice] = useState<number>(4);
  const [miniPos, setMiniPos] = useState<number>(18);
  const [isMiniRolling, setIsMiniRolling] = useState<boolean>(false);

  // Ladder / Snake simulation state
  const [ladderSimPos, setLadderSimPos] = useState<number>(18);
  const [ladderActive, setLadderActive] = useState<boolean>(false);
  const [snakeSimPos, setSnakeSimPos] = useState<number>(52);
  const [snakeActive, setSnakeActive] = useState<boolean>(false);

  useEffect(() => {
    // Screen 2 Mini Simulation
    if (currentScreen === 2) {
      const interval = setInterval(() => {
        setIsMiniRolling(true);
        const roll = Math.floor(Math.random() * 6) + 1;
        setTimeout(() => {
          setMiniDice(roll);
          setIsMiniRolling(false);
          setMiniPos(prev => (prev + roll > 40 ? 12 : prev + roll));
        }, 500);
      }, 3500);
      return () => clearInterval(interval);
    }

    // Screen 4 Ladder/Snake Simulation
    if (currentScreen === 4) {
      const ladderInterval = setInterval(() => {
        setLadderActive(true);
        setLadderSimPos(37);
        setTimeout(() => {
          setLadderActive(false);
          setLadderSimPos(18);
        }, 1800);
      }, 3800);

      const snakeInterval = setInterval(() => {
        setSnakeActive(true);
        setSnakeSimPos(31);
        setTimeout(() => {
          setSnakeActive(false);
          setSnakeSimPos(52);
        }, 1800);
      }, 3800);

      return () => {
        clearInterval(ladderInterval);
        clearInterval(snakeInterval);
      };
    }
  }, [currentScreen]);

  const handleNext = () => {
    try {
      soundService.playClick();
    } catch (e) {}
    if (currentScreen < TOTAL_SCREENS) {
      setSlideDirection('forward');
      setCurrentScreen(prev => prev + 1);
    } else {
      handleLaunch();
    }
  };

  const handleBack = () => {
    try {
      soundService.playClick();
    } catch (e) {}
    if (currentScreen > 1) {
      setSlideDirection('backward');
      setCurrentScreen(prev => prev - 1);
    } else if (onBackToIntro) {
      onBackToIntro();
    }
  };

  const handleLaunch = () => {
    try {
      soundService.playBonusEarned();
    } catch (e) {}
    if (isModal) {
      if (onClose) onClose();
      else if (onStartGame) onStartGame();
    } else {
      if (onStartGame) onStartGame();
    }
  };

  const handleToggleMusic = () => {
    try {
      const newState = soundService.toggleMusic();
      setMusicEnabled(newState);
    } catch (e) {}
  };

  const handleToggleSfx = () => {
    try {
      const newState = soundService.toggleSfx();
      setSfxEnabled(newState);
    } catch (e) {}
  };

  return (
    <div className={isModal 
      ? "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      : "min-h-screen bg-alabaster dark:bg-[#0b1220] flex flex-col justify-center items-center p-3 sm:p-6 text-ink-900 dark:text-slate-100 relative overflow-hidden"
    }>
      {/* Background medical grid aura */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-100/60 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container Card */}
      <div className="tq-card w-full max-w-3xl rounded-3xl overflow-hidden flex flex-col relative my-4 max-w-full">
        {/* TOP BAR: Header Navigation, Audio Toggles, Step Indicator & Skip */}
        <div className="relative z-10 px-5 sm:px-7 py-3.5 border-b border-slate-200 dark:border-slate-700/80 bg-slate-50/90 backdrop-blur-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-royal via-brand-teal to-brand-emerald flex items-center justify-center text-sm shadow-md shadow-blue-500/20 text-white">
              🐍
            </div>
            <div>
              <span className="text-xs font-black tracking-tight text-ink-900 dark:text-slate-100 uppercase block leading-none">
                TB QUEST
              </span>
              <span className="text-[10px] font-mono text-brand-royal dark:text-blue-400 font-bold">
                LEVEL 1 GAME INTRO • STEP {currentScreen} OF {TOTAL_SCREENS}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Toggles */}
            <button
              onClick={handleToggleMusic}
              title={musicEnabled ? 'Music: ON' : 'Music: OFF'}
              className={`touch-target p-1.5 rounded-lg border text-xs transition-colors min-h-11 min-w-11 ${
                musicEnabled
                  ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-300 dark:border-blue-500/50 text-blue-700 dark:text-blue-300 shadow-sm'
                  : 'bg-white border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:text-slate-200'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleToggleSfx}
              title={sfxEnabled ? 'SFX: ON' : 'SFX: OFF'}
              className={`touch-target p-1.5 rounded-lg border text-xs transition-colors min-h-11 min-w-11 ${
                sfxEnabled
                  ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-300 dark:border-teal-500/50 text-teal-700 dark:text-teal-300 shadow-sm'
                  : 'bg-white border-slate-200 dark:border-slate-700 text-slate-400 hover:text-slate-700 dark:text-slate-200'
              }`}
            >
              {sfxEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Skip Direct to Game */}
            <button
              onClick={handleLaunch}
              className="ml-2 text-xs font-mono font-bold text-slate-500 dark:text-slate-400 hover:text-brand-royal dark:text-blue-400 hover:bg-blue-50 transition-colors px-2.5 py-1 rounded-lg"
            >
              SKIP INTRO
            </button>
          </div>
        </div>

        {/* SCREEN CONTENT CONTAINER WITH ANIMATION */}
        <div 
          key={currentScreen}
          className={`relative z-10 p-5 sm:p-8 flex-1 min-h-[440px] flex flex-col justify-center transition-all duration-300 ${
            slideDirection === 'forward' ? 'animate-in fade-in slide-in-from-right-4' : 'animate-in fade-in slide-in-from-left-4'
          }`}
        >
          {/* ========================================================================= */}
          {/* SCREEN 1: WELCOME & BOARD PREVIEW */}
          {/* ========================================================================= */}
          {currentScreen === 1 && (
            <div className="text-center space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-brand-royal dark:text-blue-400 font-mono text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-brand-royal dark:text-blue-400" />
                PATH TO TB AWARENESS
              </div>

              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-ink-900 dark:text-slate-100 tracking-tight leading-tight">
                  🐍 TB QUEST
                </h2>
                <p className="text-base sm:text-lg font-bold text-brand-royal dark:text-blue-400 mt-1">
                  "Learn TB by playing, not by memorizing."
                </p>
              </div>

              {/* Realistic Board Preview Representation */}
              <div className="tq-card w-full max-w-md mx-auto p-4 relative overflow-hidden">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2 font-bold">
                  <span className="flex items-center gap-1.5 text-brand-royal dark:text-blue-400">
                    <Activity className="w-3.5 h-3.5" /> 10 × 10 BOARD PREVIEW
                  </span>
                  <span>100 CLINICAL SQUARES</span>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono font-bold">
                  {[
                    { num: 1, type: 'start', label: '🟢 Start' },
                    { num: 18, type: 'ladder', label: '🪜 +19' },
                    { num: 37, type: 'top', label: '⭐ Climb' },
                    { num: 52, type: 'snake', label: '🐍 -21' },
                    { num: 100, type: 'final', label: '🏆 Finale' }
                  ].map((tile, i) => (
                    <div
                      key={i}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        tile.type === 'start'
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-200 shadow-sm'
                          : tile.type === 'ladder'
                          ? 'bg-teal-50 dark:bg-teal-950/50 border-teal-300 dark:border-teal-500/50 text-teal-800 dark:text-teal-200 shadow-sm'
                          : tile.type === 'snake'
                          ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-500/50 text-rose-800 dark:text-rose-200 shadow-sm'
                          : tile.type === 'final'
                          ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-500/50 text-amber-800 dark:text-amber-200 shadow-sm'
                          : 'bg-white border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-sm'
                      }`}
                    >
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Sq {tile.num}</span>
                      <span className="text-xs">{tile.label}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
                  <span>🎲 Physical 3D Dice</span>
                  <span>•</span>
                  <span>🪜 7 Ladders</span>
                  <span>•</span>
                  <span>🐍 6 Snakes</span>
                  <span>•</span>
                  <span>🏆 Finale</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed font-medium">
                "Travel across a 100-square clinical journey, discover important TB clues, answer challenges and build your clinical reasoning."
              </p>

              <div className="pt-2">
                <button
                  onClick={handleNext}
                  className="px-8 py-3.5 rounded-xl tq-btn-primary text-white font-mono text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center gap-2 mx-auto active:scale-95 transition-all"
                >
                  <span>NEXT</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 2: HOW THE GAME WORKS (4 Visual Steps) */}
          {/* ========================================================================= */}
          {currentScreen === 2 && (
            <div className="space-y-5">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-brand-royal dark:text-blue-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
                  GAMEPLAY MECHANICS
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-ink-900 dark:text-slate-100 tracking-tight">
                  🎲 HOW THE GAME WORKS
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 font-medium">Master the 4 core steps across your clinical journey</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {/* 1. ROLL */}
                <div className="p-4 rounded-2xl tq-card shadow-sm flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">🎲</span>
                      <span className="tq-chip tq-chip-royal px-2 py-0.5 font-mono">STEP 1</span>
                    </div>
                    <h4 className="text-xs font-black font-mono text-ink-900 dark:text-slate-100 uppercase mb-1">1. ROLL</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                      <strong>🎲 Roll the dice.</strong> Physical 3D rolling determines how many spaces you advance.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center gap-2 text-xs font-mono font-bold text-blue-600">
                    <span className={`w-5 h-5 rounded bg-blue-100 border border-blue-200 flex items-center justify-center text-xs ${isMiniRolling ? 'animate-spin' : ''}`}>
                      {miniDice}
                    </span>
                    <span>Rolled {miniDice}</span>
                  </div>
                </div>

                {/* 2. MOVE */}
                <div className="p-4 rounded-2xl tq-card shadow-sm flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">🧑‍⚕️</span>
                      <span className="tq-chip tq-chip-teal px-2 py-0.5 font-mono">STEP 2</span>
                    </div>
                    <h4 className="text-xs font-black font-mono text-ink-900 dark:text-slate-100 uppercase mb-1">2. MOVE</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                      <strong>🧑 Move your token across the board.</strong> Step-by-step animation traverses the 100 squares.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-xs font-mono font-bold text-teal-700">
                    <span>Position: Sq {miniPos}</span>
                  </div>
                </div>

                {/* 3. CHALLENGE */}
                <div className="tq-card tq-lift p-4 flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">🧠</span>
                      <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-md">STEP 3</span>
                    </div>
                    <h4 className="text-xs font-black font-mono text-ink-900 dark:text-slate-100 uppercase mb-1">3. CHALLENGE</h4>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-snug font-medium">
                      <strong>🧠 Answer TB learning challenges.</strong> Encounter 25 integrated diagnostic vignettes.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-blue-200/60 text-xs font-mono font-bold text-indigo-700">
                    <span>+10 Marks & +20 XP</span>
                  </div>
                </div>

                {/* 4. PROGRESS */}
                <div className="tq-card tq-lift p-4 flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">🪜</span>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">STEP 4</span>
                    </div>
                    <h4 className="text-xs font-black font-mono text-ink-900 dark:text-slate-100 uppercase mb-1">4. PROGRESS</h4>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-snug font-medium">
                      <strong>🪜 Climb ladders and avoid snakes.</strong> Correct answers boost you up, missed clues slide you down.
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-teal-200/60 text-xs font-mono font-bold text-emerald-800">
                    <span>Knowledge Boost</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">The game is a real 100-square board — NOT a boring textbook quiz!</span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 3: YOUR ANSWER MATTERS */}
          {/* ========================================================================= */}
          {currentScreen === 3 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-brand-royal dark:text-blue-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
                  FEEDBACK ARCHITECTURE
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-ink-900 dark:text-slate-100 tracking-tight">
                  🟢 YOUR ANSWER MATTERS
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 font-medium">Immediate, transparent scoring and clinical pearls after every question</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* CORRECT */}
                <div className="tq-card p-4 rounded-2xl border-2 border-emerald-400 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1.5 text-emerald-800 font-black font-mono text-sm uppercase">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 🟢 CORRECT
                      </span>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        +10 MARKS • +20 XP
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                      Answers turn bright GREEN with checkmark and floating XP animation toward HUD.
                    </p>
                  </div>
                  <div className="tq-glass mt-3 p-2.5 rounded-xl text-xs font-mono font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>🟢 Correct: Prolonged cough (&gt;2 weeks)</span>
                  </div>
                </div>

                {/* WRONG / REVIEW */}
                <div className="tq-card p-4 rounded-2xl border-2 border-rose-300 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1.5 text-rose-800 font-black font-mono text-sm uppercase">
                        <XCircle className="w-4 h-4 text-rose-600" /> 🔴 REVIEW
                      </span>
                      <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                        0 MARKS • 0 XP
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                      Soft shake on error, and the correct answer is always highlighted in GREEN!
                    </p>
                  </div>
                  <div className="mt-3 space-y-1 text-xs font-mono">
                    <div className="tq-glass p-1.5 rounded-lg text-rose-900 dark:text-rose-200 flex items-center gap-1.5 font-bold">
                      <X className="w-3.5 h-3.5 text-rose-600 stroke-[3]" />
                      <span>🔴 Your answer: Eye colour</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-emerald-100/70 border border-emerald-300 text-emerald-950 flex items-center gap-1.5 font-bold">
                      <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                      <span>🟢 Correct answer: Prolonged cough</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 💡 WHAT YOU LEARNED Box */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-300 shadow-sm">
                <div className="text-[11px] font-mono font-black text-amber-800 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <span>💡</span> WHAT YOU LEARNED
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-semibold">
                  "Persistent cough can be an important clue when considering pulmonary TB."
                </p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 4: SNAKES & LADDERS */}
          {/* ========================================================================= */}
          {currentScreen === 4 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-brand-royal dark:text-blue-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
                  BOARD ACCELERATION & PITFALLS
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-ink-900 dark:text-slate-100 tracking-tight">
                  🐍 SNAKES & 🪜 LADDERS
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 font-medium">Your diagnostic decisions determine whether you surge upward or slide back</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 🪜 LADDER */}
                <div className="tq-card p-4 rounded-2xl border-2 border-teal-400 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1.5 text-teal-800 font-black font-mono text-sm uppercase">
                        <span>🪜</span> LADDER
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 border border-teal-300">
                        KNOWLEDGE BOOST
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                      "Correct knowledge and clinical reasoning can move you forward."
                    </p>
                  </div>

                  {/* Visual Demonstration: SQUARE 18 -> LADDER -> SQUARE 37 */}
                  <div className="tq-glass mt-4 p-3 rounded-xl text-center font-mono">
                    <div className="flex items-center justify-center gap-3 font-bold text-xs">
                      <span className={`px-2.5 py-1 rounded-lg border transition-all ${ladderSimPos === 18 ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 dark:text-slate-200'}`}>
                        SQUARE 18
                      </span>
                      <span className={`text-base transition-transform ${ladderActive ? 'scale-125' : ''}`}>🪜 ➔</span>
                      <span className={`px-2.5 py-1 rounded-lg border transition-all ${ladderSimPos === 37 ? 'bg-teal-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 dark:text-slate-200'}`}>
                        SQUARE 37
                      </span>
                    </div>
                    <span className="text-[11px] text-teal-700 block mt-2 font-bold">+19 Squares Climb!</span>
                  </div>
                </div>

                {/* 🐍 SNAKE */}
                <div className="tq-card p-4 rounded-2xl border-2 border-rose-300 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="flex items-center gap-1.5 text-rose-800 font-black font-mono text-sm uppercase">
                        <span>🐍</span> SNAKE
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                        CLUE MISSED
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                      "Missing an important clue or making an incorrect game decision can move you backward."
                    </p>
                  </div>

                  {/* Visual Demonstration: SQUARE 52 -> SNAKE -> SQUARE 31 */}
                  <div className="tq-glass mt-4 p-3 rounded-xl text-center font-mono">
                    <div className="flex items-center justify-center gap-3 font-bold text-xs">
                      <span className={`px-2.5 py-1 rounded-lg border transition-all ${snakeSimPos === 52 ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 dark:text-slate-200'}`}>
                        SQUARE 52
                      </span>
                      <span className={`text-base transition-transform ${snakeActive ? 'scale-125' : ''}`}>🐍 ➔</span>
                      <span className={`px-2.5 py-1 rounded-lg border transition-all ${snakeSimPos === 31 ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 dark:text-slate-200'}`}>
                        SQUARE 31
                      </span>
                    </div>
                    <span className="text-[11px] text-rose-700 block mt-2 font-bold">-21 Squares Learning Moment</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 5: 25 TB CHALLENGES */}
          {/* ========================================================================= */}
          {currentScreen === 5 && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-brand-royal dark:text-blue-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
                  CURRICULUM ARCHITECTURE
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-ink-900 dark:text-slate-100 tracking-tight">
                  🧠 25 TB CHALLENGES
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 font-medium">
                  Integrated naturally during gameplay across 4 clinical zones
                </p>
              </div>

              <div className="space-y-2 max-w-lg mx-auto font-mono text-xs">
                {/* EASY */}
                <div className="tq-glass p-2.5 sm:p-3 rounded-xl border border-emerald-300 dark:border-emerald-500/40 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="font-bold text-emerald-900">🟢 EASY • Squares 1–30</span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400 font-sans text-xs font-semibold">Symptoms</span>
                </div>

                <div className="text-center text-slate-400 text-xs">↓</div>

                {/* MEDIUM */}
                <div className="tq-glass p-2.5 sm:p-3 rounded-xl border border-amber-300 dark:border-amber-500/40 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="font-bold text-amber-900">🟡 MEDIUM • Squares 31–60</span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400 font-sans text-xs font-semibold">Risk Factors & Exposure</span>
                </div>

                <div className="text-center text-slate-400 text-xs">↓</div>

                {/* HARD */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-orange-50 border border-orange-300 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-orange-500" />
                    <span className="font-bold text-orange-900">🟠 HARD • Squares 61–85</span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400 font-sans text-xs font-semibold">Clinical Clues & Patient History</span>
                </div>

                <div className="text-center text-slate-400 text-xs">↓</div>

                {/* ADVANCED */}
                <div className="tq-glass p-2.5 sm:p-3 rounded-xl border border-rose-300 dark:border-rose-500/40 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="font-bold text-rose-900">🔴 ADVANCED • Squares 86–99</span>
                  </div>
                  <span className="text-slate-600 dark:text-slate-400 font-sans text-xs font-semibold">Clinical Reasoning & Presumptive TB</span>
                </div>

                <div className="text-center text-slate-400 text-xs">↓</div>

                {/* FINAL */}
                <div className="p-2.5 sm:p-3 rounded-xl bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-400 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏆</span>
                    <span className="font-black text-amber-950">FINAL • Square 100</span>
                  </div>
                  <span className="text-amber-900 font-sans text-xs font-black">TB Mastery Challenge</span>
                </div>
              </div>

              <div className="tq-glass p-3 rounded-xl text-center text-xs font-semibold text-blue-900 dark:text-blue-200">
                "Every challenge teaches you something immediately after you answer."
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SCREEN 6: MASTER LEVEL 1 & UNLOCK LEVEL 2 */}
          {/* ========================================================================= */}
          {currentScreen === 6 && (
            <div className="space-y-4 text-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-brand-royal dark:text-blue-400 font-mono text-[11px] font-bold uppercase tracking-wider mb-1">
                  MASTERY BENCHMARK
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-ink-900 dark:text-slate-100 tracking-tight">
                  🏆 MASTER LEVEL 1
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-400 font-medium">
                  "Reaching Square 100 is not enough."
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left font-mono">
                {/* UNLOCK CONDITIONS */}
                <div className="tq-card p-4 rounded-2xl border-2 border-blue-300 shadow-sm">
                  <div className="flex items-center gap-2 text-brand-royal dark:text-blue-400 font-black text-sm mb-2">
                    <Unlock className="w-4 h-4 text-brand-royal dark:text-blue-400" />
                    <span>TO UNLOCK LEVEL 2:</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                      <span>Complete the journey</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                      <span>Achieve at least <strong>80% accuracy</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                      <span>Pass the <strong>Final TB Challenge</strong></span>
                    </li>
                  </ul>
                  <div className="mt-3 pt-2 border-t border-blue-200 text-[11px] text-brand-royal dark:text-blue-400 font-black">
                    🔓 LEVEL 2: INVESTIGATION LEARNING
                  </div>
                </div>

                {/* SCORING BENCHMARK */}
                <div className="p-4 rounded-2xl bg-alabaster dark:bg-[#0b1220] border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 mb-1">SCORING BREAKDOWN</div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Total Questions:</span>
                        <span className="font-bold text-ink-900 dark:text-slate-100">25</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Marks Each:</span>
                        <span className="font-bold text-blue-600">10 Marks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Maximum Marks:</span>
                        <span className="font-bold text-amber-700">250 Marks</span>
                      </div>
                    </div>
                  </div>
                  <div className="tq-glass mt-2.5 p-2 rounded-xl text-[11px] text-emerald-900 dark:text-emerald-200 font-bold text-center">
                    20 / 25 Correct = 200 / 250 = 80%
                  </div>
                </div>
              </div>

              {/* BELOW 80% REPLAY NOTICE */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 dark:border-slate-700 max-w-lg mx-auto text-xs text-slate-600 dark:text-slate-400 leading-snug">
                <span className="font-bold text-amber-800">If below 80%:</span> 🔒 Level 2 remains locked. "Review the concepts you missed and replay your weak areas."
              </div>

              {/* FINAL START GAME ACTION */}
              <div className="pt-2">
                <button
                  onClick={handleLaunch}
                  className="px-10 py-4 rounded-2xl tq-btn-primary text-white font-mono text-sm font-black uppercase tracking-wider shadow-xl shadow-blue-500/30 flex items-center gap-3 mx-auto active:scale-95 transition-all transform hover:scale-[1.02]"
                >
                  <span className="text-lg">🎲</span>
                  <span>START LEVEL 1</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM CONTROLS: Back, 6-Dot Indicator (● ○ ○ ○ ○ ○) & Next/Start */}
        <div className="relative z-10 px-5 sm:px-7 py-3.5 border-t border-slate-200 dark:border-slate-700/80 bg-slate-50/90 backdrop-blur-md flex items-center justify-between">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-colors ${
              currentScreen === 1 && !onBackToIntro
                ? 'text-slate-400 cursor-not-allowed opacity-50'
                : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 tq-card shadow-sm'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>BACK</span>
          </button>

          {/* Dots Indicator: ● ○ ○ ○ ○ ○ */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2">
              {Array.from({ length: TOTAL_SCREENS }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => {
                    soundService.playClick();
                    setSlideDirection(num > currentScreen ? 'forward' : 'backward');
                    setCurrentScreen(num);
                  }}
                  title={`Step ${num} of ${TOTAL_SCREENS}`}
                  className={`transition-all rounded-full ${
                    currentScreen === num
                      ? 'w-6 h-2 bg-gradient-to-r from-brand-royal to-brand-teal'
                      : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
              STEP {currentScreen} OF {TOTAL_SCREENS}
            </span>
          </div>

          {/* Next / Start Button */}
          {currentScreen < TOTAL_SCREENS ? (
            <button
              onClick={handleNext}
              className="tq-btn-primary touch-target px-5 py-2 rounded-xl text-white text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-all"
            >
              <span>NEXT</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleLaunch}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-bold uppercase flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
            >
              <span>START GAME</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
