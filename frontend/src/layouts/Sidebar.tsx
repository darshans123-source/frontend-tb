import React from 'react';
import { LayoutDashboard, Stethoscope, Map, Brain, BookOpen, Trophy, Award, BarChart3, User, LogOut, X } from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, tab: 'dashboard' },
  { name: 'Clinical Cases', icon: Stethoscope, tab: 'cases' },
  { name: 'Algorithm Flowcharts', icon: Map, tab: 'flowcharts' },
  { name: 'AI Clinical Tutor', icon: Brain, tab: 'ai-tutor' },
  { name: 'Learning Modules', icon: BookOpen, tab: 'modules' },
  { name: 'Leaderboards', icon: Trophy, tab: 'leaderboard' },
  { name: 'Analytics', icon: BarChart3, tab: 'analytics' },
  { name: 'Certificate', icon: Award, tab: 'certificate' },
  { name: 'Profile', icon: User, tab: 'profile' },
];

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (t: any) => void;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function Sidebar({ currentTab, setCurrentTab, onLogout, isOpenMobile = false, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`w-72 max-w-[85vw] h-screen bg-navy-900 dark:bg-ink-950 border-r border-slate-800/80 dark:border-slate-800 flex flex-col p-4 fixed left-0 top-0 z-50 transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Institutional Branding Header */}
        <div className="mb-6 p-2 pb-4 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            {/* Uploaded NIT Logo */}
            <img
              src="/nit_logo.png"
              alt="TB Quest Official Logo"
              className="tq-img w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] md:w-[48px] md:h-[48px] object-contain rounded-xl bg-white p-1 aspect-square shrink-0"
            />
            
            {/* Text Hierarchy */}
            <div className="flex flex-col justify-center min-w-0">
              <h1 className="tq-display text-xl font-extrabold text-white leading-none tracking-tight">
                TB QUEST
              </h1>
              <p className="text-[10px] font-extrabold text-teal-300 uppercase leading-tight mt-1 truncate">
                TB DIAGNOSTIC LEARNING PLATFORM
              </p>
              <p className="text-[12px] font-medium text-slate-300 leading-tight truncate">
                Navodaya Institute of Technology
              </p>
              <p className="text-[12px] font-medium text-slate-400 leading-tight">
                Raichur
              </p>
            </div>
          </div>

          {/* Close button on mobile */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="touch-target p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl lg:hidden shrink-0 flex items-center justify-center"
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar" aria-label="Main Navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => {
                  setCurrentTab(item.tab);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`tq-lift touch-target w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-teal min-h-11 ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-teal via-brand-emerald to-brand-royal text-white shadow-lg shadow-teal-950/50'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-slate-900">
          <button
            onClick={() => {
              onLogout();
              if (onCloseMobile) onCloseMobile();
            }}
            className="tq-lift touch-target w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-400 hover:text-brand-coral hover:bg-brand-coral/10 rounded-xl transition-all font-semibold outline-none focus-visible:ring-2 focus-visible:ring-brand-coral min-h-11"
          >
            <LogOut size={18} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
