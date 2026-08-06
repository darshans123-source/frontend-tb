import React from 'react';
import {
  LayoutDashboard,
  Image,
  Megaphone,
  BookOpen,
  Stethoscope,
  GitCommit,
  Grid,
  FileText,
  Trophy,
  Users,
  UserCheck,
  Lightbulb,
  Award,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
  ShieldAlert,
  HeartHandshake,
  Building2
} from 'lucide-react';
import { soundService } from '../../services/soundService';

export type AdminTab =
  | 'dashboard'
  | 'hero'
  | 'nikshay'
  | 'ntep'
  | 'awareness'
  | 'news'
  | 'facts'
  | 'modules'
  | 'cases'
  | 'flowcharts'
  | 'gallery'
  | 'resources'
  | 'leaderboard'
  | 'students'
  | 'faculty'
  | 'certificates'
  | 'analytics'
  | 'settings';

interface AdminSidebarProps {
  currentTab: AdminTab;
  setCurrentTab: (tab: AdminTab) => void;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function AdminSidebar({
  currentTab,
  setCurrentTab,
  onLogout,
  isOpenMobile,
  onCloseMobile
}: AdminSidebarProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'hero', label: 'Hero Manager', icon: Image },
    { id: 'nikshay', label: 'Ni-Kshay Mitra', icon: HeartHandshake },
    { id: 'ntep', label: 'NTEP Manager', icon: Building2 },
    { id: 'awareness', label: 'Awareness Manager', icon: Megaphone },
    { id: 'news', label: 'News Manager', icon: Megaphone },
    { id: 'facts', label: 'TB Facts', icon: Lightbulb },
    { id: 'modules', label: 'Learning Modules', icon: BookOpen },
    { id: 'cases', label: 'Clinical Cases', icon: Stethoscope },
    { id: 'flowcharts', label: 'Algorithm Flowcharts', icon: GitCommit },
    { id: 'gallery', label: 'Gallery', icon: Grid },
    { id: 'resources', label: 'Resources', icon: FileText },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'faculty', label: 'Faculty Manager', icon: UserCheck },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 z-40 w-72 h-screen bg-[#0c1329] text-slate-200 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ${
        isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      {/* Sidebar Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-[#0c1329] rounded-[10px] flex items-center justify-center">
              <ShieldAlert size={20} className="text-purple-400" />
            </div>
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-white tracking-wide">TB QUEST CMS</h2>
            <p className="text-[10px] font-mono text-purple-400">Admin Control Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const IconComp = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                soundService.playClick();
                setCurrentTab(item.id as AdminTab);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full p-2.5 rounded-xl font-medium text-xs flex items-center justify-between transition-all group ${
                isActive
                  ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <IconComp size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'} />
                <span>{item.label}</span>
              </div>
              <ChevronRight
                size={14}
                className={`transition-transform ${isActive ? 'text-white translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'}`}
              />
            </button>
          );
        })}
      </div>

      {/* Footer Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <button
          onClick={() => {
            soundService.playClick();
            onLogout();
          }}
          className="w-full p-2.5 bg-slate-900 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 border border-slate-800 hover:border-rose-800/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut size={16} /> Logout Admin
        </button>
      </div>
    </aside>
  );
}
