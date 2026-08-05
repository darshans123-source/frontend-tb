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
    <div className="p-4 sm:p-8 max-w-7xl mx-auto min-h-[80vh] flex flex-col justify-center">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">
          TB Quest – Case Selection
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm font-mono">Choose a TB Case Module to Begin Your Diagnostic Journey</p>
      </div>

      {!isUnlocked && (
        <div className="max-w-3xl mx-auto mb-8 bg-amber-950/80 border-2 border-amber-500/70 p-5 rounded-2xl text-center space-y-3 shadow-xl">
          <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-base">
            <Lock size={20} />
            <span>Clinical Cases Locked</span>
          </div>
          <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-semibold">
            Complete the Learning Module and Quiz to unlock Clinical Cases.
          </p>
          {onOpenLearningModule && (
            <button
              onClick={onOpenLearningModule}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-colors shadow-md"
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
              className={`p-5 sm:p-8 bg-gradient-to-br ${c.color} border rounded-2xl sm:rounded-3xl shadow-lg flex flex-col justify-between group relative ${
                isCardDisabled ? 'opacity-60 grayscale-[40%]' : ''
              }`}
            >
              <button
                onClick={() => onToggleBookmark(c.id)}
                disabled={isCardDisabled}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                  isBookmarked ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
              <div>
                <div className="p-2.5 sm:p-3 w-12 sm:w-16 bg-slate-900/60 rounded-2xl mb-4 sm:mb-6 shadow-inner flex items-center justify-center">
                  <Icon size={28} className="sm:w-8 sm:h-8" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{c.title}</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{c.desc}</p>
                
                {/* Difficulty Toggles */}
                <div className="mt-4 flex flex-wrap gap-1.5 sm:gap-2">
                  {(['Beginner', 'Intermediate', 'Advanced'] as const).map(d => (
                    <button
                      key={d}
                      disabled={isCardDisabled}
                      onClick={() => setSelectedDifficulty(prev => ({ ...prev, [c.id]: d }))}
                      className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-mono border transition-all ${
                        diff === d ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200' : 'bg-slate-800 border-slate-700 text-slate-500'
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
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-slate-900/60 text-cyan-300 hover:bg-slate-900'
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
          className="px-5 sm:px-6 py-2 sm:py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 text-xs sm:text-sm font-medium transition-colors"
        >
          ← Return to Dashboard
        </button>
      </div>
    </div>
  );
}
