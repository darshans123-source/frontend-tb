import React from 'react';
import {
  Code2,
  HeartPulse,
  Building2,
  GraduationCap,
  ShieldCheck,
  MapPin,
} from 'lucide-react';

export default function FooterMarquee() {
  const marqueeItems = [
    {
      id: 'dev-team',
      icon: <Code2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />,
      content: (
        <span className="marquee-white-text font-bold flex items-center gap-1.5">
          <span className="text-xs">👨‍💻</span>
          <span>
            Designed & Developed by{' '}
            <span className="font-extrabold text-amber-300 drop-shadow-[0_0_8px_rgba(252,211,77,0.6)]">
              Darshan Team
            </span>
          </span>
        </span>
      ),
    },
    {
      id: 'tb-quest',
      icon: <HeartPulse className="w-3.5 h-3.5 text-cyan-300 shrink-0 animate-pulse" />,
      content: (
        <span className="marquee-white-text font-bold flex items-center gap-1.5">
          <span className="text-xs">💙</span>
          <span>
            <span className="text-cyan-200 font-extrabold">TB Quest</span> – TB Diagnostic Learning Platform
          </span>
        </span>
      ),
    },
    {
      id: 'nit',
      icon: <Building2 className="w-3.5 h-3.5 text-blue-300 shrink-0" />,
      content: (
        <span className="marquee-white-text font-bold flex items-center gap-1.5">
          <span className="text-xs">🏛️</span>
          <span>Navodaya Institute of Technology, Raichur</span>
        </span>
      ),
    },
    {
      id: 'sdc',
      icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-300 shrink-0" />,
      content: (
        <span className="marquee-white-text font-bold flex items-center gap-1.5">
          <span className="text-xs">🎓</span>
          <span>Skill Development Centre (SDC)</span>
        </span>
      ),
    },
    {
      id: 'rights',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />,
      content: (
        <span className="marquee-white-text font-bold flex items-center gap-1.5">
          <span className="text-xs">©</span>
          <span>All Rights Reserved 2026</span>
        </span>
      ),
    },
    {
      id: 'location',
      icon: <MapPin className="w-3.5 h-3.5 text-emerald-300 shrink-0" />,
      content: (
        <span className="marquee-white-text font-bold flex items-center gap-1.5">
          <span className="text-xs">📍</span>
          <span>Raichur, Karnataka, India</span>
        </span>
      ),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full px-2 pb-1 pt-0 pointer-events-auto select-none">
      {/* Outer Marquee Container (38px height, 10px rounded corners, enterprise gradient & glow) */}
      <div className="relative w-full h-[38px] rounded-[10px] bg-gradient-to-r from-[#0F4CFF] via-[#0E3FE0] to-[#0B2E8A] border border-white/20 shadow-[0_-3px_18px_rgba(15,76,255,0.35),0_0_12px_rgba(11,46,138,0.25)] backdrop-blur-md overflow-hidden flex items-center group">
        
        {/* Edge Vignette Fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#0F4CFF] to-transparent z-10 rounded-l-[10px]" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#0B2E8A] to-transparent z-10 rounded-r-[10px]" />

        {/* Marquee Track (Right to Left Continuous Loop) */}
        <div className="animate-marquee-rtl flex items-center whitespace-nowrap h-full">
          {/* Render array 3 times for 100% gapless infinite loop */}
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
            <React.Fragment key={`${item.id}-${index}`}>
              <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-4 text-[11px] sm:text-xs font-bold tracking-wide text-white transition-transform duration-200 hover:scale-105">
                {item.icon}
                {item.content}
              </div>
              {/* Soft Glowing Vertical Separator */}
              <span className="text-cyan-300/60 px-2.5 sm:px-4 text-xs sm:text-sm font-light select-none drop-shadow-[0_0_6px_rgba(103,232,249,0.7)]">
                │
              </span>
            </React.Fragment>
          ))}
        </div>

      </div>
    </div>
  );
}


