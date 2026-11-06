import { useState } from 'react';
import { Stethoscope, Baby, ShieldAlert, Dices, ArrowRight, Bookmark, Lock, AlertTriangle } from 'lucide-react';
import { CaseType } from '../types';

interface CaseSelectionProps {
  onSelectCase: (type: CaseType, difficulty: 'Beginner' | 'Intermediate' | 'Advanced') => void;
  onBack: () => void;
  bookmarkedCases: string[];
  onToggleBookmark: (id: string) => void;
  isUnlocked?: boolean;
  onOpenLearningModule?: () => void;
}

export default function CaseSelection({
  onSelectCase,
  onBack,
  bookmarkedCases,
  onToggleBookmark,
  isUnlocked = true,
  onOpenLearningModule
}: CaseSelectionProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Record<CaseType, 'Beginner' | 'Intermediate' | 'Advanced'>>({
    pulmonary: 'Beginner',
    pediatric: 'Beginner',
    mdr: 'Beginner',
    hiv: 'Beginner',
    'time-critical': 'Beginner',
    random: 'Beginner'
  });

  const cases = [
    {
      id: 'pulmonary' as CaseType,
      title: 'Pulmonary TB Case',
      desc: 'Adult TB diagnostic scenario with symptoms, smear, CBNAAT, CXR & diagnosis.',
      icon: Stethoscope,
      color: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/40 text-cyan-400'
    },
    {
      id: 'pediatric' as CaseType,
      title: 'Pediatric TB Case',
      desc: 'Childhood TB case challenges with age-specific diagnostic approach and TB score.',
      icon: Baby,
      color: 'from-purple-500/20 to-pink-600/20 border-purple-500/40 text-purple-400'
    },
    {
      id: 'mdr' as CaseType,
      title: 'MDR-TB Case',
      desc: 'Drug-resistant TB management with advanced clinical decision-making & DST.',
      icon: ShieldAlert,
      color: 'from-amber-500/20 to-red-600/20 border-amber-500/40 text-amber-400'
    },
    {
      id: 'random' as CaseType,
      title: 'Random Case Challenge',
      desc: 'System loads a surprise clinical scenario for adaptive learning & timed mission.',
      icon: Dices,
      color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/40 text-emerald-400'
    }
  ];

  return (
    <div className="tq-fade-up overflow-hidden bg-alabaster p-4 font-sans dark:bg-[#0b1220] sm:p-8 max-w-7xl mx-auto min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="tq-display text-2xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-teal via-brand-emerald to-brand-royal mb-2">
          TB Quest – Case Selection
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-mono">Choose a TB Case Module to Begin Your Diagnostic Journey</p>
      </div>

      {!isUnlocked && (
        <div className="tq-card max-w-3xl mx-auto mb-8 border-2 border-brand-amber/60 bg-amber-50 dark:bg-amber-950/40 p-5 rounded-2xl text-center space-y-3 shadow-xl">
          <div className="flex items-center justify-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-base">
            <Lock size={20} />
            <span>Clinical Cases Locked</span>
          </div>
          <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm leading-relaxed font-semibold">
            Complete the Learning Module and Quiz to unlock Clinical Cases.
          </p>
          {onOpenLearningModule && (
            <button
              onClick={onOpenLearningModule}
              className="tq-btn-coral touch-target px-5 py-2.5 text-xs uppercase tracking-wider shadow-md"
            >
              Launch Level 1 Learning & Quiz
            </button>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {cases.map((c) => {
          const Icon = c.icon;
          const diff = selectedDifficulty[c.id];
          const isBookmarked = bookmarkedCases.includes(c.id);
          const isCardDisabled = !isUnlocked;

          return (
            <div
              key={c.id}
              className={`tq-card tq-lift max-w-full overflow-hidden p-5 sm:p-8 rounded-2xl sm:rounded-3xl flex flex-col justify-between group relative ${
                isCardDisabled ? 'opacity-60 grayscale-[40%]' : ''
              }`}
            >
              <div className="tq-accent-bar mb-4 shrink-0 sm:mb-6" />
              <button
                onClick={() => onToggleBookmark(c.id)}
                disabled={isCardDisabled}
                className={`touch-target absolute top-4 right-4 p-2 rounded-full transition-colors ${
                  isBookmarked ? 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-400/10' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
              <div>
                <div className="p-2.5 sm:p-3 w-12 sm:w-16 rounded-2xl mb-4 sm:mb-6 shadow-inner flex items-center justify-center border border-teal-100 bg-teal-50 text-brand-teal dark:border-teal-800/60 dark:bg-teal-950/60 dark:text-teal-300">
                  <Icon size={28} className="sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-ink-900 dark:text-white mb-2">{c.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">{c.desc}</p>
                
                {/* Difficulty Toggles */}
                <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map(d => (
                    <button
                      key={d}
                      disabled={isCardDisabled}
                      onClick={() => setSelectedDifficulty(prev => ({ ...prev, [c.id]: d }))}
                      className={`min-h-9 px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-mono border transition-all ${
                        diff === d ? 'bg-teal-100 dark:bg-teal-950/70 border-brand-teal text-teal-700 dark:text-teal-200' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <button
                disabled={isCardDisabled}
                onClick={() => {
                  if (isCardDisabled) {
                    alert("Complete the Learning Module and Quiz to unlock Clinical Cases.");
                    if (onOpenLearningModule) onOpenLearningModule();
                  } else {
                    onSelectCase(c.id, diff);
                  }
                }}
                className={`mt-5 sm:mt-6 flex items-center justify-center gap-2 p-3 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  isCardDisabled
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-700'
                    : 'tq-btn-primary touch-target text-white'
                }`}
              >
                {isCardDisabled ? (
                  <>
                    <Lock size={16} />
                    <span>Locked — Quiz Required</span>
                  </>
                ) : (
                  <>
                    <span>Start {diff} Simulation</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 sm:mt-8 text-center">
        <button
          onClick={onBack}
          className="tq-btn-secondary touch-target px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm dark:bg-[#111c30] dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          ← Return to Dashboard
        </button>
      </div>
    </div>
  );
}
