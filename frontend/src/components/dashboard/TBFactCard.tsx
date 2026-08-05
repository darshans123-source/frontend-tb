import React from 'react';
import { ArticleData } from './ArticleModal';
import { Lightbulb, Stethoscope } from 'lucide-react';

interface TBFactCardProps {
  onOpenArticle: (article: ArticleData) => void;
}

export default function TBFactCard({ onOpenArticle }: TBFactCardProps) {
  return (
    <div className="bg-white border border-[#D8E9FF] border-l-4 border-l-[#0F6FFF] rounded-2xl p-5 sm:p-6 shadow-[0_10px_30px_rgba(15,111,255,0.06)] hover:shadow-[0_20px_40px_rgba(15,111,255,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full space-y-4 relative overflow-hidden">
      {/* Header with Lightbulb Icon */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#1E293B] flex items-center gap-2">
          <div className="p-1.5 bg-[#F2F8FD] text-[#0F6FFF] rounded-lg">
            <Lightbulb size={16} />
          </div>
          <span>DID YOU KNOW?</span>
        </h3>
        <Stethoscope size={16} className="text-[#0F6FFF]/40" />
      </div>

      {/* Body Text */}
      <div className="space-y-1.5 py-1">
        <p className="text-xs font-extrabold text-[#1E293B] leading-snug">
          TB is 100% preventable and curable.
        </p>
        <p className="text-xs text-[#64748B] leading-relaxed">
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
        className="w-full py-2.5 px-4 bg-gradient-to-r from-[#0F6FFF] to-[#2563EB] hover:from-[#0D62E0] hover:to-[#1D4ED8] text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all text-center shadow-md shadow-blue-500/20 hover:scale-[1.02] cursor-pointer"
      >
        LEARN MORE
      </button>
    </div>
  );
}
