import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Activity, Sparkles, Dna } from 'lucide-react';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [loadingText, setLoadingText] = useState('Initializing...');
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const textTimer1 = setTimeout(() => {
      setLoadingText('Loading AI Clinical Engine...');
    }, 800);

    const textTimer2 = setTimeout(() => {
      setLoadingText('Loading Clinical Modules...');
    }, 1600);

    const textTimer3 = setTimeout(() => {
      setLoadingText('Connecting Secure Database...');
    }, 2400);

    const textTimer4 = setTimeout(() => {
      setLoadingText('Preparing Skill Development Center...');
    }, 3100);

    const textTimer5 = setTimeout(() => {
      setLoadingText('Ready.');
    }, 3600);

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3500);

    const finishTimer = setTimeout(() => {
      onFinish();
    }, 4000);

    return () => {
      clearTimeout(textTimer1);
      clearTimeout(textTimer2);
      clearTimeout(textTimer3);
      clearTimeout(textTimer4);
      clearTimeout(textTimer5);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 w-screen h-screen z-[999999] flex flex-col justify-between items-center bg-gradient-to-b from-[#eaf4fd] via-[#f7fafc] to-[#e4f0fb] overflow-hidden select-none p-4 sm:p-6 md:p-8 font-sans"
          style={{ width: '100vw', height: '100vh' }}
        >
          {/* Subtle Ambient Medical Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[600px] sm:h-[600px] bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Background SVG Medical DNA/Network Overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <pattern id="medical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0284c7" strokeWidth="1" />
              <circle cx="40" cy="40" r="1.5" fill="#0284c7" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#medical-grid)" />
          </svg>

          {/* Top Eyebrow Header */}
          <div className="w-full flex items-center justify-between max-w-5xl z-10 pt-2 px-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-blue-100 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-slate-600">
                Official Clinical DSS • Live Portal
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-mono font-semibold">
              <Dna size={14} className="text-cyan-600" />
              <span>WHO / NTEP Standards</span>
            </div>
          </div>

          {/* Center Main Glassmorphic Hero Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex-1 flex items-center justify-center w-full max-w-xl my-auto z-10 py-2"
          >
            <div className="w-full backdrop-blur-xl bg-white/85 border border-white/90 rounded-3xl shadow-[0_25px_60px_-15px_rgba(14,116,144,0.18)] p-6 sm:p-10 flex flex-col items-center text-center space-y-5 sm:space-y-6 relative overflow-hidden">
              {/* Card Subtle Top Highlight */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600" />

              {/* Top Dual Logo Display (Uploaded NIT Shield Logo) */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="relative flex items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-blue-50/80 to-white border border-blue-100 shadow-md shadow-blue-500/10 group"
              >
                <img
                  src="/nit_logo.png"
                  alt="TB Quest Official Logo"
                  className="w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] md:w-[48px] md:h-[48px] object-contain rounded-[8px] drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                />
              </motion.div>

              {/* Title & Institutional Hierarchy */}
              <div className="space-y-1.5 w-full">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#1E293B] font-sans">
                  TB QUEST
                </h1>
                
                <p className="text-xs sm:text-sm font-extrabold text-[#0F6FFF] tracking-wider uppercase font-sans">
                  TB DIAGNOSTIC LEARNING PLATFORM
                </p>

                <div className="pt-1">
                  <p className="text-xs sm:text-sm font-semibold text-slate-700 font-sans">
                    Skill Development Center
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-500 font-medium font-sans">
                    Navodaya Institute of Technology, Raichur
                  </p>
                </div>
              </div>

              {/* Clinical Tagline Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50/90 text-blue-900 text-xs sm:text-sm font-bold border border-blue-200/80 shadow-sm">
                <Activity size={14} className="text-blue-600 shrink-0" />
                <span>Detect • Prevent • Defeat TB</span>
              </div>

              {/* Interactive Loading Bar & Dynamic Text */}
              <div className="w-full max-w-md space-y-2 pt-2">
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/80 p-0.5">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3.6, ease: 'easeInOut' }}
                    className="h-full bg-gradient-to-r from-blue-700 via-cyan-500 to-indigo-600 rounded-full shadow-sm"
                  />
                </div>

                <div className="h-5 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadingText}
                      initial={{ opacity: 0, y: 3 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -3 }}
                      transition={{ duration: 0.2 }}
                      className="text-[11px] sm:text-xs font-mono font-bold text-slate-600 tracking-wide flex items-center gap-1.5"
                    >
                      <Sparkles size={12} className="text-cyan-600 animate-spin" style={{ animationDuration: '3s' }} />
                      <span>{loadingText}</span>
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              {/* National Vision Mission Badge */}
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-950 text-white font-semibold text-[11px] sm:text-xs shadow-md tracking-wide">
                  <ShieldCheck size={14} className="text-cyan-300 shrink-0" />
                  <span>A Step Towards a TB-Free India</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* Footer Institutional Banner */}
          <div className="w-full text-center pb-2 z-10 shrink-0">
            <p className="text-[10px] sm:text-xs text-slate-500 font-mono">
              TB Quest © 2026 • Skill Development Center • Navodaya Institute of Technology, Raichur
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
