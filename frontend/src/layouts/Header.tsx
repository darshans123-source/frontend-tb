import React from 'react';
import { Home, BookOpen, BarChart2, Award, FileText, Bell, LogOut, Menu } from 'lucide-react';

interface HeaderProps {
  userData: any;
  currentTab?: string;
  setCurrentTab?: (tab: any) => void;
  onLogout?: () => void;
  onToggleMobileMenu?: () => void;
}

export default function Header({ userData, currentTab = 'dashboard', setCurrentTab, onLogout, onToggleMobileMenu }: HeaderProps) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'modules', label: 'My Learning', icon: BookOpen },
    { id: 'analytics', label: 'Progress', icon: BarChart2 },
    { id: 'leaderboard', label: 'Badges', icon: Award },
    { id: 'certificate', label: 'TB Resources', icon: FileText }
  ];

  return (
    <header className="tq-nav fixed top-0 left-0 right-0 z-40 h-16 px-4 sm:px-8 flex items-center justify-between max-w-full overflow-hidden">
      {/* Left: Logo & Subtitle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="touch-target p-1.5 text-slate-600 hover:text-brand-teal-deep dark:text-slate-300 dark:hover:text-teal-300 rounded-xl lg:hidden flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-teal"
          title="Toggle Menu"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab && setCurrentTab('dashboard')}>
          <img
            src="/nit_logo.png"
            alt="TB Quest Official Logo"
            className="tq-img w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] md:w-[48px] md:h-[48px] object-contain rounded-xl bg-white p-1 aspect-square shrink-0"
          />
          <div className="flex flex-col justify-center">
            <h1 className="tq-display text-base sm:text-lg font-extrabold text-ink-900 dark:text-white tracking-tight leading-none">
              TB QUEST
            </h1>
            <p className="tq-eyebrow text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider leading-tight mt-0.5">
              TB DIAGNOSTIC LEARNING PLATFORM
            </p>
          </div>
        </div>
      </div>

      {/* Center: Navigation Links */}
      <nav className="hidden lg:flex items-center gap-2">
        {navItems.map((item) => {
          const IconComp = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab && setCurrentTab(item.id)}
              className={`tq-lift touch-target flex items-center gap-1.5 px-4 py-1.5 text-xs transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-brand-teal ${
                isActive
                  ? 'tq-btn-primary rounded-full font-bold shadow-md'
                  : 'tq-chip-slate text-slate-500 dark:text-slate-300 hover:text-brand-teal-deep dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-full font-semibold'
              }`}
            >
              <IconComp size={15} className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-300'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right: Notifications & User Profile Pill */}
      <div className="flex items-center gap-3">
        {/* Notification Bell with Red Badge */}
        <button
          className="touch-target relative p-2 text-slate-600 hover:text-brand-teal-deep dark:text-slate-300 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 rounded-full transition-colors flex items-center justify-center focus-visible:ring-2 focus-visible:ring-brand-teal"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-brand-coral text-white font-mono text-[9px] font-bold flex items-center justify-center shadow-xs">
            3
          </span>
        </button>

        {/* User Avatar & Info */}
        <div 
          onClick={() => setCurrentTab && setCurrentTab('profile')}
          className="touch-target flex items-center gap-2.5 pl-2 border-l border-slate-200 dark:border-slate-700 cursor-pointer hover:opacity-90 transition-opacity rounded-xl focus-visible:ring-2 focus-visible:ring-brand-teal"
          title="View Profile"
        >
          <div className="w-9 h-9 rounded-full bg-brand-teal-soft dark:bg-teal-950 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-brand-teal-deep dark:text-teal-300 font-bold text-xs shrink-0 shadow-xs">
            {userData.name ? userData.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-black text-ink-900 dark:text-white leading-tight">
              {userData.name || 'Student'}
            </p>
            <p className="text-[10px] font-semibold text-brand-teal-deep dark:text-teal-300 leading-tight">
              Level {userData.level || 1}
            </p>
          </div>
        </div>

        {/* Direct Log Out / Back to Login Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="tq-btn-secondary touch-target tq-lift flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold transition-all shrink-0 cursor-pointer ml-1 dark:bg-[#111c30] dark:text-slate-200 dark:border-slate-700 dark:hover:border-brand-coral"
            title="Log Out & Switch User"
          >
            <LogOut size={14} />
            <span className="hidden md:inline">Log Out</span>
          </button>
        )}
      </div>
    </header>
  );
}
