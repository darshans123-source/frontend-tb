import React, { useState, useEffect } from 'react';
import { Megaphone, ChevronRight } from 'lucide-react';
import { supabaseData } from '../../services/supabaseData';

interface NewsTickerProps {
  onSelectNewsItem: (text: string) => void;
}

export default function NewsTicker({ onSelectNewsItem }: NewsTickerProps) {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    async function loadNews() {
      const live = await supabaseData.fetchLiveNews();
      if (live && live.length > 0) {
        setNews(live);
      } else {
        setNews([
          { text: 'TB MUKT BHARAT ABHIYAN 2026: 100 Days Intensified Campaign across rural and urban districts.' },
          { text: 'EARLY DETECTION (CBNAAT / TRUENAT): Free upfront molecular diagnostics mandated under NTEP guidelines.' },
          { text: 'NI-KSHAY POSHAN YOJANA: Direct benefit transfer of ₹500/month for nutritional support to registered TB patients.' }
        ]);
      }
    }
    loadNews();

    const unsubscribe = supabaseData.subscribeNews((freshNews) => {
      if (freshNews && freshNews.length > 0) {
        setNews(freshNews);
      }
    });

    return () => unsubscribe();
  }, []);

  // Format ticker text with cyan highlighted keywords
  const formattedItems = news.length > 0
    ? news.map(item => item.text)
    : [
        'TB MUKT BHARAT ABHIYAN 2026: 100 Days Intensified Campaign across rural and urban districts nationwide.',
        'EARLY DETECTION (CBNAAT / TRUENAT): Free upfront molecular diagnostics mandated under NTEP guidelines.',
        'NI-KSHAY POSHAN YOJANA: Direct benefit transfer of ₹500/month for nutritional support to registered TB patients.'
      ];

  const primaryText = formattedItems[0] || 'TB MUKT BHARAT ABHIYAN 2026: 100 Days Intensified Campaign across rural and urban districts nationwide.';

  const renderTickerContent = (text: string) => {
    // Highlight key terms in cyan
    const parts = text.split(/(TB MUKT BHARAT ABHIYAN 2026|EARLY DETECTION \(CBNAAT \/ TRUENAT\)|NI-KSHAY POSHAN YOJANA|NATIONAL TUBERCULOSIS ELIMINATION PROGRAMME)/g);
    return parts.map((part, i) => {
      if (
        part === 'TB MUKT BHARAT ABHIYAN 2026' ||
        part === 'EARLY DETECTION (CBNAAT / TRUENAT)' ||
        part === 'NI-KSHAY POSHAN YOJANA' ||
        part === 'NATIONAL TUBERCULOSIS ELIMINATION PROGRAMME'
      ) {
        return (
          <span key={i} className="text-cyan-300 font-extrabold drop-shadow-[0_0_10px_rgba(6,182,212,0.6)] px-1">
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="bg-[#0B1329] border border-slate-800/90 rounded-2xl text-white text-xs py-2.5 px-3 sm:px-4 flex items-center justify-between shadow-md overflow-hidden relative group backdrop-blur-md">
      {/* Fixed Left Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600/20 border border-red-500/40 text-red-400 font-extrabold rounded-full text-[10px] uppercase tracking-wider shrink-0 z-20 shadow-xs backdrop-blur-md">
        <Megaphone size={13} className="text-red-400 animate-pulse" />
        <span>LIVE UPDATES</span>
      </div>

      {/* Edge Vignette Fades */}
      <div className="pointer-events-none absolute inset-y-0 left-[125px] sm:left-[140px] w-6 sm:w-10 bg-gradient-to-r from-[#0B1329] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-[150px] sm:right-[175px] w-6 sm:w-10 bg-gradient-to-l from-[#0B1329] to-transparent z-10" />

      {/* Center Scrolling Track (Right to Left Continuous Loop) */}
      <div
        onClick={() => onSelectNewsItem(primaryText)}
        className="flex-1 overflow-hidden relative mx-2 sm:mx-4 cursor-pointer h-6 flex items-center select-none"
      >
        <div className="animate-live-ticker whitespace-nowrap font-bold text-xs sm:text-sm text-slate-100 tracking-wide flex items-center gap-6 group-hover:[animation-play-state:paused]">
          {formattedItems.map((itemText, idx) => (
            <React.Fragment key={idx}>
              <span className="inline-flex items-center gap-2">
                {renderTickerContent(itemText)}
              </span>
              {idx < formattedItems.length - 1 && (
                <span className="text-cyan-500/60 font-black text-xs">•••</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Fixed Right Button */}
      <button
        type="button"
        onClick={() => onSelectNewsItem(primaryText)}
        className="text-[11px] font-extrabold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 shrink-0 z-20 cursor-pointer bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 px-3 py-1 rounded-full shadow-xs hover:scale-105 transition-all"
      >
        <span>Read Announcement</span>
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
