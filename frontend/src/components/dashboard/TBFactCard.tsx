import React from 'react';
import { ArticleData } from './ArticleModal';
import { Lightbulb, Stethoscope } from 'lucide-react';

interface TBFactCardProps {
  onOpenArticle: (article: ArticleData) => void;
}

export default function TBFactCard({ onOpenArticle }: TBFactCardProps) {
  return (
    <div className="tq-card tq-lift rounded-2xl p-5 sm:p-6 flex flex-col justify-between h-full space-y-4 relative overflow-hidden min-w-0">
      <div className="tq-accent-bar" />
      {/* Header with Lightbulb Icon */}
      <div className="flex items-center justify-between">
        <h3 className="tq-eyebrow text-xs font-extrabold uppercase tracking-wider text-ink-900 dark:text-slate-100 flex items-center gap-2">
          <div className="tq-chip tq-chip-amber p-1.5 rounded-lg">
            <Lightbulb size={16} />
          </div>
          <span>DID YOU KNOW?</span>
        </h3>
        <Stethoscope size={16} className="text-brand-teal/50 dark:text-teal-300/50" />
      </div>

      {/* Body Text */}
      <div className="space-y-1.5 py-1">
        <p className="tq-display text-sm sm:text-base font-extrabold text-ink-900 dark:text-slate-100 leading-snug">
          TB is 100% preventable and curable.
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          Early detection with rapid molecular CBNAAT testing & DOTS treatment saves lives.
        </p>
      </div>

      {/* Blue Pill Button */}
      <button
        type="button"
        onClick={() => {
          onOpenArticle({
            title: 'Did You Know? Essential TB Facts',
            category: 'HEALTH FACTS',
            readTime: '2 min',
            content: [
              'Tuberculosis (TB) is caused by bacteria (Mycobacterium tuberculosis) that most often affect the lungs.',
              'TB is curable and preventable. About 85% of people who develop TB disease can be successfully treated with a 6-month drug regimen.',
              'Early molecular diagnostic testing (CBNAAT / Truenat) significantly reduces disease transmission.'
            ],
            keyHighlights: [
              '85%+ treatment success rate with standard DOTS regimen.',
              'Free testing available at all government health centers under NTEP.',
              'Airborne infection control reduces household transmission.'
            ]
          });
        }}
        className="tq-btn-primary touch-target min-h-11 w-full py-2.5 px-4 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all text-center shadow-md shadow-blue-500/20 hover:scale-[1.02] cursor-pointer"
      >
        LEARN MORE
      </button>
    </div>
  );
}
