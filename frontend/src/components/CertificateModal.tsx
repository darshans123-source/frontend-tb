import React from 'react';
import { Trophy, Award, CheckCircle2, Download, Printer, X, ShieldCheck } from 'lucide-react';
import { CertificateData } from '../types';

interface CertificateModalProps {
  certificateData: CertificateData;
  onClose: () => void;
}

export default function CertificateModal({ certificateData, onClose }: CertificateModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="tq-card w-full max-w-4xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col my-4 sm:my-8 max-h-[95vh] tq-fade-up">
        {/* Modal Top Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-[#111c30] border-b border-slate-200 dark:border-slate-800 flex justify-between items-center print:hidden shrink-0">
          <div className="flex items-center gap-2 text-brand-amber-deep dark:text-amber-400 font-mono text-xs uppercase font-bold truncate min-w-0">
            <Award size={18} className="shrink-0" /> <span className="truncate">Official Institutional Certificate</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={handlePrint}
              className="tq-btn-coral touch-target flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 font-bold rounded-xl text-xs shadow-md transition-all shrink-0"
            >
              <Printer size={16} /> <span className="hidden sm:inline">Print / Save PDF</span><span className="sm:hidden">PDF</span>
            </button>
            <button
              onClick={onClose}
              className="touch-target p-1.5 sm:p-2 text-slate-500 dark:text-slate-400 hover:text-ink-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Render Body (Printable area) */}
        <div className="p-4 sm:p-10 bg-white dark:bg-slate-900 text-ink-900 dark:text-white relative border-4 sm:border-8 border-double border-amber-500/30 m-2 sm:m-4 rounded-2xl flex flex-col justify-between min-h-0 sm:min-h-[580px] overflow-y-auto overflow-auto custom-scrollbar print:m-0 print:border-amber-600 max-w-full">
          {/* Subtle Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <ShieldCheck className="w-48 h-48 sm:w-96 sm:h-96 text-amber-400" />
          </div>

          {/* Institutional Header */}
          <div className="text-center space-y-1.5 sm:space-y-2 relative z-10">
            <div className="flex justify-center items-center gap-3 mb-2">
              <div className="p-2.5 sm:p-3 bg-amber-950/80 border border-amber-500/40 rounded-2xl text-amber-400 shadow-inner">
                <Trophy size={28} className="sm:w-9 sm:h-9" />
              </div>
            </div>
            <h2 className="tq-eyebrow text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-mono font-bold">
              Skill Development Center • NIT Raichur
            </h2>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300">
              National Institute of Technology, Raichur
            </h3>
            <div className="w-32 sm:w-48 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto my-2 sm:my-3"></div>
          </div>

          {/* Certificate Title & Presentation */}
          <div className="text-center space-y-2 sm:space-y-4 relative z-10 my-4 sm:my-6">
            <p className="tq-eyebrow text-[10px] sm:text-xs uppercase font-mono tracking-wider">This is to certify that</p>
            <h1 className="tq-display text-2xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 dark:from-amber-200 dark:via-yellow-400 dark:to-amber-500 tracking-wide">
              {certificateData.studentName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              has successfully completed all levels and clinical decision-making simulations in <br className="hidden sm:inline" />
              <span className="font-bold text-brand-teal-deep dark:text-cyan-400">"TB Quest: Gamified Learning Platform for Tuberculosis Diagnostic Algorithms"</span> <br className="hidden sm:inline" />
              demonstrating mastery over national pulmonary and pediatric diagnostic pathways.
            </p>
          </div>

          {/* Performance Summary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 bg-amber-50/60 dark:bg-slate-950/80 border border-amber-200 dark:border-slate-800 p-3 sm:p-4 rounded-2xl max-w-xl mx-auto text-center font-mono relative z-10 w-full">
            <div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 uppercase">Cases Completed</p>
              <p className="tq-display text-base sm:text-lg font-bold text-brand-amber-deep dark:text-amber-400">{certificateData.casesMastered}</p>
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 uppercase">Total XP Score</p>
              <p className="tq-display text-base sm:text-lg font-bold text-brand-teal-deep dark:text-cyan-400">{certificateData.totalXp} XP</p>
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 uppercase">Diagnostic Accuracy</p>
              <p className="tq-display text-base sm:text-lg font-bold text-brand-emerald dark:text-emerald-400">{certificateData.accuracy}%</p>
            </div>
          </div>

          {/* Signatures & Verification Footnote */}
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 pt-6 sm:pt-8 relative z-10 border-t border-slate-200 dark:border-slate-800/80 mt-4 sm:mt-6 text-center sm:text-left">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-ink-900 dark:text-slate-200">Skill Development Center</p>
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono">Clinical Faculty & Mentors</p>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 font-mono">Skill Development Center, NIT Raichur</p>
            </div>

            <div className="space-y-1">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-amber-50 dark:bg-slate-950 border border-amber-500/40 rounded-2xl p-2 mx-auto flex items-center justify-center tq-lift">
                <CheckCircle2 size={28} className="text-emerald-400" />
              </div>
              <p className="tq-chip tq-chip-amber font-mono text-[8px] sm:text-[9px]">VERIFIED OFFICIAL</p>
            </div>

            <div className="space-y-0.5 font-mono text-center sm:text-right">
              <p className="text-[10px] sm:text-[11px] text-slate-600 dark:text-slate-300">Issue Date: {certificateData.issueDate}</p>
              <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400">ID: {certificateData.certificateId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
