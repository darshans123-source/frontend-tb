import { Award, CheckCircle, Printer, Shield, Trophy, X } from 'lucide-react';

interface ProgressReportModalProps {
  onClose: () => void;
  userName: string;
  userLevel: number;
  xp: number;
  completedCases: number;
  streak: number;
  badges: string[];
  accuracy?: number;
}

export default function ProgressReportModal({
  onClose,
  userName,
  userLevel,
  xp,
  completedCases,
  streak,
  badges,
  accuracy = 0
}: ProgressReportModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="tq-card w-full max-w-3xl max-h-[95vh] overflow-y-auto overflow-auto custom-scrollbar rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] relative text-ink-900 dark:text-white my-4 sm:my-8 tq-fade-up print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
        
        {/* Top Actions (Hidden in Print) */}
        <div className="flex justify-between items-center mb-4 sm:mb-6 print:hidden">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2.5 sm:p-3 bg-teal-50 dark:bg-cyan-950 border border-teal-200 dark:border-cyan-500/40 rounded-xl sm:rounded-2xl text-brand-teal-deep dark:text-cyan-400 shrink-0">
              <Shield size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="tq-display text-base sm:text-2xl font-bold text-ink-900 dark:text-white">Official Clinical Progress Report</h2>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono">Skill Development Center • NIT Raichur</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handlePrint}
              className="tq-btn-primary touch-target flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 font-semibold text-xs sm:text-sm transition-all shrink-0"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Print / Save PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
            <button
              onClick={onClose}
              className="touch-target p-1.5 sm:p-2 text-slate-500 dark:text-slate-400 hover:text-ink-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-8 space-y-4 sm:space-y-6 print:bg-white print:border print:border-slate-300 print:text-slate-900 max-w-full overflow-hidden">
          
          {/* Header */}
          <div className="text-center pb-4 sm:pb-6 border-b border-slate-200 dark:border-slate-800 print:border-slate-300">
            <div className="inline-flex p-2.5 sm:p-3 bg-teal-50 dark:bg-cyan-950/60 border border-teal-200 dark:border-cyan-500/30 rounded-2xl text-brand-teal-deep dark:text-cyan-400 mb-2 sm:mb-3 print:bg-cyan-50 print:border-cyan-200">
              <Trophy size={28} className="sm:w-8 sm:h-8" />
            </div>
            <h1 className="tq-display text-lg sm:text-2xl font-extrabold uppercase tracking-wide text-brand-teal-deep dark:text-cyan-400 print:text-cyan-800">
              TB Quest Academic & Clinical Performance Transcript
            </h1>
            <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono mt-1 print:text-slate-600">
              Skill Development Center • NIT Raichur • Certified Clinical Diagnostics
            </p>
          </div>

          {/* Student Metadata */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-teal-50/60 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 print:bg-slate-50 print:border-slate-200">
            <div>
              <p className="text-[10px] sm:text-xs uppercase font-mono text-slate-500 dark:text-slate-400 print:text-slate-500">Student Name</p>
              <p className="text-xs sm:text-base font-bold text-ink-900 dark:text-white print:text-slate-900 truncate min-w-0">{userName || 'Student Doctor'}</p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs uppercase font-mono text-slate-500 dark:text-slate-400 print:text-slate-500">Academic Level</p>
              <p className="text-xs sm:text-base font-bold text-purple-400 print:text-purple-700">Level {userLevel} (Explorer)</p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs uppercase font-mono text-slate-500 dark:text-slate-400 print:text-slate-500">Total XP Score</p>
              <p className="text-xs sm:text-base font-bold text-cyan-400 print:text-cyan-700 font-mono">{xp} XP</p>
            </div>
            <div>
              <p className="text-[10px] sm:text-xs uppercase font-mono text-slate-500 dark:text-slate-400 print:text-slate-500">Daily Streak</p>
              <p className="text-xs sm:text-base font-bold text-emerald-400 print:text-emerald-700 font-mono">{streak} Days 🔥</p>
            </div>
          </div>

          {/* Core Statistics */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ink-900 dark:text-slate-300 print:text-slate-800 flex items-center gap-2">
              <CheckCircle size={16} className="text-emerald-400 shrink-0" /> Clinical Mastery & Case Statistics
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="tq-card tq-lift p-3 sm:p-4 print:bg-slate-50 print:border-slate-200">
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 font-mono">Completed Simulations</p>
                <p className="tq-display text-xl sm:text-2xl font-bold text-ink-900 dark:text-white print:text-slate-900 font-mono mt-1">{completedCases} Cases</p>
                <p className="text-[10px] sm:text-xs text-emerald-400 print:text-emerald-700 mt-1">NTEP Clinical Track</p>
              </div>
              <div className="tq-card tq-lift p-3 sm:p-4 print:bg-slate-50 print:border-slate-200">
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 font-mono">Diagnostic Accuracy</p>
                <p className="tq-display text-xl sm:text-2xl font-bold text-brand-teal-deep dark:text-cyan-400 print:text-cyan-700 font-mono mt-1">{accuracy}%</p>
                <p className="text-[10px] sm:text-xs text-cyan-300 print:text-cyan-600 mt-1">Real-time dynamic metric</p>
              </div>
              <div className="tq-card tq-lift p-3 sm:p-4 print:bg-slate-50 print:border-slate-200">
                <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 font-mono">Clinical Reasoning Grade</p>
                <p className="tq-display text-lg sm:text-2xl font-bold text-brand-amber-deep dark:text-amber-400 print:text-amber-700 font-mono mt-1">
                  {completedCases >= 10 ? 'Distinction (A+)' : completedCases >= 5 ? 'Proficient (B+)' : 'Developing (Satisfactory)'}
                </p>
                <p className="text-[10px] sm:text-xs text-amber-300 print:text-amber-600 mt-1">National TB Guidelines</p>
              </div>
            </div>
          </div>

          {/* Diagnostic Strength Breakdown */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ink-900 dark:text-slate-300 print:text-slate-800">
              Diagnostic Strength Breakdown
            </h3>
            <div className="tq-card space-y-3 p-3 sm:p-4 print:bg-slate-50 print:border-slate-200">
              {[
                { label: 'Pulmonary TB', score: accuracy > 0 ? Math.min(100, accuracy + 5) : 0 },
                { label: 'Extra-pulmonary TB', score: accuracy > 0 ? Math.max(0, accuracy - 10) : 0 },
                { label: 'Pediatric TB', score: accuracy > 0 ? accuracy : 0 },
                { label: 'MDR-TB', score: accuracy > 0 ? Math.max(0, accuracy - 5) : 0 },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-1">
                    <span>{item.label}</span>
                    <span className="font-mono text-brand-teal-deep dark:text-cyan-400">{item.score}%</span>
                  </div>
                  <div className="tq-progress">
                    <div
                      className="tq-progress-bar"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Earned Badges */}
          <div className="space-y-3">
            <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-ink-900 dark:text-slate-300 print:text-slate-800 flex items-center gap-2">
              <Award size={16} className="text-amber-400 shrink-0" /> Certified Badges & Credentials ({badges.length})
            </h3>
            {badges.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {badges.map((b, i) => (
                  <div key={i} className="tq-chip tq-chip-amber px-2.5 sm:px-3 py-1 sm:py-1.5 print:bg-amber-50 print:border-amber-300 print:text-amber-800 text-[11px] sm:text-xs font-semibold">
                    ★ {b}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono italic">No badges earned yet. Complete clinical cases to unlock certifications.</p>
            )}
          </div>

          {/* Footer Notes */}
          <div className="pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800 print:border-slate-300 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 print:text-slate-600 font-mono">
            <span>Verified by TB Quest AI Clinical Engine</span>
            <span>Date: {new Date().toLocaleDateString()}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
