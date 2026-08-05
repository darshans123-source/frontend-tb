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
    <header className="bg-white/90 backdrop-blur-md border-b border-[#D8E9FF] shadow-xs fixed top-0 left-0 right-0 z-40 h-16 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Logo & Subtitle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg lg:hidden"
          title="Toggle Menu"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentTab && setCurrentTab('dashboard')}>
          <img
            src="/nit_logo.png"
            alt="TB Quest Official Logo"
            className="w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] md:w-[48px] md:h-[48px] object-contain rounded-[8px] shadow-md shadow-blue-500/10 shrink-0"
          />
          <div className="flex flex-col justify-center">
            <h1 className="text-base sm:text-lg font-extrabold text-[#1E293B] tracking-tight leading-none">
              TB QUEST
            </h1>
            <p className="text-[9px] sm:text-[10px] font-extrabold text-[#0F6FFF] uppercase tracking-wider leading-tight mt-0.5">
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
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#0F6FFF] to-[#2563EB] text-white shadow-md shadow-blue-500/20 rounded-full font-bold'
                  : 'text-[#64748B] hover:text-[#0F6FFF] hover:bg-[#F2F8FD] rounded-full font-semibold'
              }`}
            >
              <IconComp size={15} className={isActive ? 'text-white' : 'text-[#64748B]'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right: Notifications & User Profile Pill */}
      <div className="flex items-center gap-3">
        {/* Notification Bell with Red Badge */}
        <button
          className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors"
          title="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white font-mono text-[9px] font-bold flex items-center justify-center shadow-xs">
            3
          </span>
        </button>

        {/* User Avatar & Info */}
        <div 
          onClick={() => setCurrentTab && setCurrentTab('profile')}
          className="flex items-center gap-2.5 pl-2 border-l border-slate-200 cursor-pointer hover:opacity-90 transition-opacity"
          title="View Profile"
        >
          <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-800 font-bold text-xs shrink-0 shadow-xs">
            {userData.name ? userData.name.charAt(0).toUpperCase() : 'S'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-black text-slate-900 leading-tight">
              {userData.name || 'Student'}
            </p>
            <p className="text-[10px] font-semibold text-blue-600 leading-tight">
              Level {userData.level || 1}
            </p>
          </div>
        </div>

        {/* Direct Log Out / Back to Login Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-red-50 border border-slate-200 hover:border-red-300 text-slate-700 hover:text-red-600 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ml-1"
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
