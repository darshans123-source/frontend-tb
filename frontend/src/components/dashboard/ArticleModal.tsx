import React, { useEffect } from 'react';
import { X, ExternalLink, BookOpen, ShieldAlert, Award, FileText } from 'lucide-react';
import { soundService } from '../../services/soundService';

export interface ArticleData {
  title: string;
  category: string;
  readTime: string;
  image?: string;
  content: string[];
  keyHighlights: string[];
  externalUrl?: string;
}

interface ArticleModalProps {
  article: ArticleData | null;
  onClose: () => void;
}

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
  useEffect(() => {
    if (article) {
      soundService.playPageFlip();
    }
  }, [article]);

  if (!article) return null;

  const handleClose = () => {
    soundService.playArticleClose();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="tq-card rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.2)] min-w-0">
        {/* Header */}
        <div className="sticky top-0 z-10 p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white/90 dark:bg-[#111c30]/90 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="tq-chip tq-chip-teal px-3 py-1 text-xs font-semibold border border-teal-500/30 uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">• {article.readTime} read</span>
          </div>
          <button
            onClick={handleClose}
            className="tq-btn-ghost touch-target min-h-11 min-w-11 p-2 text-slate-500 dark:text-slate-300 hover:text-ink-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-600 dark:text-slate-200 min-w-0">
          <h2 className="tq-display text-2xl sm:text-3xl font-black text-ink-900 dark:text-white leading-tight">
            {article.title}
          </h2>

          {article.image && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 flex items-center justify-center min-h-[200px]">
              <img
                src={article.image}
                alt={article.title}
                className="tq-img object-cover aspect-[16/9] w-full max-h-72 rounded-2xl p-1"
                loading="lazy"
              />
            </div>
          )}

          <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {article.keyHighlights.length > 0 && (
            <div className="p-4 bg-teal-50 dark:bg-teal-950/40 border border-teal-500/20 dark:border-teal-500/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-brand-teal-deep dark:text-teal-300 font-bold text-sm">
                <ShieldAlert size={18} /> Key Takeaways
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {article.keyHighlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-brand-teal dark:text-teal-300 font-bold">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 p-4 border-t border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-[#111c30]/90 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Skill Development Center • NIT Raichur
          </p>
          <button
            onClick={handleClose}
            className="tq-btn-primary touch-target min-h-11 px-5 py-2 text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
          >
            Close Article
          </button>
        </div>
      </div>
    </div>
  );
}
