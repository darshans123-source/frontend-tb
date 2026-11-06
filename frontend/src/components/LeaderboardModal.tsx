import { Trophy, Award, X, Medal, Star } from 'lucide-react';
import { LeaderboardEntry } from '../types';

interface LeaderboardModalProps {
  onClose: () => void;
  entries: LeaderboardEntry[];
  badges: string[];
  onChallenge: (name: string) => void;
}

export default function LeaderboardModal({ onClose, entries, badges, onChallenge }: LeaderboardModalProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="tq-card w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-auto custom-scrollbar rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-[0_0_40px_rgba(245,158,11,0.2)] relative tq-fade-up">
        <div className="sticky top-0 z-10 flex justify-between items-center mb-4 sm:mb-6 bg-white/95 dark:bg-[#111c30]/95 backdrop-blur rounded-2xl p-2 -m-2">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2.5 sm:p-3 bg-amber-950 border border-amber-500/40 rounded-xl sm:rounded-2xl text-amber-400">
              <Trophy size={24} className="sm:w-7 sm:h-7" />
            </div>
            <div>
              <h2 className="tq-display text-lg sm:text-2xl font-bold text-ink-900 dark:text-white">Global Leaderboard & Badges</h2>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono">Peer rankings & diagnostic expert certifications</p>
            </div>
          </div>
          <button onClick={onClose} className="touch-target p-1.5 sm:p-2 text-slate-500 dark:text-slate-400 hover:text-ink-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl shrink-0">
            <X size={18} />
          </button>
        </div>

        {/* Badges Section */}
        <div className="tq-card mb-4 sm:mb-6 p-3 sm:p-4">
          <h3 className="text-xs sm:text-sm font-semibold text-ink-900 dark:text-slate-300 uppercase mb-2.5 flex items-center gap-2">
            <Award className="text-amber-400" size={16} /> Earned Badges ({badges.length})
          </h3>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {badges.map((b, i) => (
              <div key={i} className="tq-chip tq-chip-amber flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-medium">
                <Star size={12} className="fill-amber-400 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <div className="min-w-[480px]">
              <div className="grid grid-cols-5 p-3 sm:p-4 text-[10px] sm:text-xs font-mono uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#111c30]">
                <span>Rank</span>
                <span>Student Name</span>
                <span className="text-right">Score</span>
                <span className="text-right">XP</span>
                <span className="text-right">Action</span>
              </div>
              <div className="divide-y divide-slate-200 dark:divide-slate-800/60 max-h-60 overflow-y-auto overflow-auto">
                {entries.map((entry) => (
                  <div key={entry.rank} className="grid grid-cols-5 p-3 sm:p-4 items-center text-xs sm:text-sm hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors rounded-xl">
                    <span className="font-mono flex items-center gap-1.5 sm:gap-2">
                      {entry.rank === 1 && <Medal className="text-amber-400 shrink-0" size={16} />}
                      {entry.rank === 2 && <Medal className="text-slate-300 shrink-0" size={16} />}
                      {entry.rank === 3 && <Medal className="text-amber-700 shrink-0" size={16} />}
                      <span className={entry.rank <= 3 ? 'font-bold text-ink-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}>#{entry.rank}</span>
                    </span>
                    <span className="font-medium text-ink-900 dark:text-slate-200 truncate min-w-0">{entry.name}</span>
                    <span className="text-right font-mono text-brand-teal-deep dark:text-cyan-400 font-semibold">{entry.score}</span>
                    <span className="text-right font-mono text-brand-amber-deep dark:text-amber-400">+{entry.xp} XP</span>
                    <div className="text-right">
                      {!entry.name.includes('You') && (
                        <button
                          onClick={() => onChallenge(entry.name)}
                          className="tq-chip tq-chip-teal touch-target text-[10px] px-2.5 py-1 transition-colors font-mono font-bold uppercase"
                        >
                          Challenge
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
