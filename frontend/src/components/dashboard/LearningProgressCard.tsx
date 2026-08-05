import React from 'react';

interface LearningProgressCardProps {
  overallProgress: number;
  xp: number;
  badgesCount: number;
  completedLevels: number;
  completedCases: number;
  streak: number;
}

export default function LearningProgressCard({
  overallProgress,
  xp,
  badgesCount,
  completedLevels
}: LearningProgressCardProps) {
  const roundedProgress = Math.round(overallProgress);

  return (
    <div className="bg-white border border-[#D8E9FF] rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(15,111,255,0.06)] hover:shadow-[0_20px_40px_rgba(15,111,255,0.12)] hover:border-[#0F6FFF]/35 transition-all duration-300 flex flex-col justify-between h-full space-y-4">
      {/* Title */}
      <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1E293B] flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#0F6FFF] animate-pulse" />
        <span>YOUR LEARNING PROGRESS</span>
      </h3>

      {/* Circle Gauge + Progress Bar Row */}
      <div className="flex items-center gap-4 py-1">
        {/* Left Circle Percentage Ring */}
        <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
          <svg className="w-16 h-16 transform -rotate-90">
            <defs>
              <linearGradient id="blueProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0F6FFF" />
                <stop offset="100%" stopColor="#2563EB" />
              </linearGradient>
            </defs>
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="#EBF3FE"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="32"
              cy="32"
              r="26"
              stroke="url(#blueProgressGrad)"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray="163"
              strokeDashoffset={163 - (163 * roundedProgress) / 100}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <span className="absolute text-sm font-extrabold text-[#0F6FFF]">
            {roundedProgress}%
          </span>
        </div>

        {/* Right Label & Horizontal Bar */}
        <div className="flex-1 space-y-1.5">
          <p className="text-xs font-bold text-[#1E293B]">Overall Mastery</p>
          <div className="w-full bg-[#F2F8FD] border border-[#D8E9FF] h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#0F6FFF] to-[#2563EB] h-full rounded-full transition-all duration-500 shadow-xs"
              style={{ width: `${Math.max(4, roundedProgress)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bottom 3 Metrics Separated by Vertical Lines */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#D8E9FF]/60 text-center">
        {/* Metric 1 */}
        <div className="space-y-0.5">
          <p className="text-lg font-black text-[#0F6FFF] font-mono">{xp}</p>
          <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">XP Earned</p>
        </div>

        {/* Metric 2 */}
        <div className="space-y-0.5 border-x border-[#D8E9FF]">
          <p className="text-lg font-black text-[#1E293B] font-mono">{badgesCount}</p>
          <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Badges</p>
        </div>

        {/* Metric 3 */}
        <div className="space-y-0.5">
          <p className="text-lg font-black text-[#1E293B] font-mono">{completedLevels}</p>
          <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Levels Done</p>
        </div>
      </div>
    </div>
  );
}
