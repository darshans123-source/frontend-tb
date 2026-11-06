import React from 'react';

interface SkeletonProps {
  type?: 'card' | 'table' | 'dashboard' | 'dossier';
  count?: number;
}

export default function SkeletonLoader({ type = 'card', count = 3 }: SkeletonProps) {
  const items = Array.from({ length: count });

  if (type === 'table') {
    return (
      <div className="space-y-3 w-full animate-pulse">
        <div className="tq-card h-10 bg-white dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 rounded-[20px] w-full" />
        {items.map((_, i) => (
          <div key={i} className="tq-card h-16 bg-white dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 rounded-[20px] w-full flex items-center px-4 justify-between">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/5" />
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'dashboard') {
    return (
      <div className="space-y-6 w-full animate-pulse p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="tq-card h-24 bg-white dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 rounded-[20px] w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="tq-card h-32 bg-white dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 rounded-[20px]" />
          ))}
        </div>
        <div className="tq-card h-64 bg-white dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 rounded-[20px] w-full" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full animate-pulse">
      {items.map((_, i) => (
        <div key={i} className="tq-card p-5 bg-white dark:bg-[#111c30] border border-slate-200 dark:border-slate-800 rounded-[20px] space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded-full w-16" />
          </div>
          <div className="h-4 bg-slate-200 dark:bg-slate-700/60 rounded w-3/4" />
          <div className="h-4 bg-slate-200 dark:bg-slate-700/60 rounded w-2/3" />
          <div className="pt-2 flex justify-between items-center">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded-xl w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
