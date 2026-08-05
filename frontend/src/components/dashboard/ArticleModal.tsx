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
      <div className="bg-slate-900 border border-cyan-500/30 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.2)]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-cyan-950 text-cyan-400 text-xs font-semibold rounded-full border border-cyan-500/30 uppercase tracking-wider">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 font-mono">• {article.readTime} read</span>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200">
          <h2 className="text-2xl font-black text-white leading-tight">
            {article.title}
          </h2>

          {article.image && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center min-h-[200px]">
              <img
                src={article.image}
                alt={article.title}
                className="w-full max-h-72 object-contain rounded-xl p-1"
                loading="lazy"
              />
            </div>
          )}

          <div className="space-y-4 text-sm leading-relaxed text-slate-300">
            {article.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          {article.keyHighlights.length > 0 && (
            <div className="p-4 bg-cyan-950/40 border border-cyan-500/20 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <ShieldAlert size={18} /> Key Takeaways
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {article.keyHighlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-cyan-400 font-bold">•</span>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-mono">
            Skill Development Center • NIT Raichur
          </p>
          <button
            onClick={handleClose}
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
          >
            Close Article
          </button>
        </div>
      </div>
    </div>
  );
}
