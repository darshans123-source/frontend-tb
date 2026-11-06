import React, { useState } from 'react';
import { ShieldCheck, Award, Bell, LogOut, Sparkles, Sun, Moon, Edit3, Save, X, User, Phone, MapPin, Building, GraduationCap, Calendar, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { supabaseData } from '../services/supabaseData';

import { useSupabaseProfile } from '../hooks/useSupabaseProfile';

interface ProfileProps {
  userName: string;
  userEmail: string;
  userLevel: number;
  xp: number;
  badgesCount: number;
  streak: number;
  completedCases: number;
  completedModules?: number;
  completedQuizzes?: number;
  usn?: string;
  college?: string;
  department?: string;
  semester?: string;
  phone?: string;
  gender?: string;
  dob?: string;
  address?: string;
  district?: string;
  state?: string;
  currentUserId?: string | null;
  onLogout: () => void;
  onOpenProgressReport: () => void;
}

export default function Profile({
  userName,
  userEmail,
  userLevel,
  xp,
  badgesCount,
  streak,
  completedCases,
  completedModules = 1,
  completedQuizzes = 1,
  usn = 'USN-2026-NITR',
  college = 'Navodaya Institute of Technology',
  department = 'Community Medicine & Respiratory Medicine',
  semester = '7th Semester MBBS',
  phone = '+91 98765 43210',
  gender = 'Not Specified',
  dob = '2002-05-15',
  address = 'NIT Raichur Campus, Station Road',
  district = 'Raichur',
  state = 'Karnataka',
  currentUserId,
  onLogout,
  onOpenProgressReport
}: ProfileProps) {
  const { mode, toggleTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Section 7: Fetch Live Supabase Profile
  const { profile } = useSupabaseProfile(currentUserId);

  const liveName = profile?.full_name || profile?.name || userName;
  const liveEmail = profile?.email || userEmail;
  const liveXp = profile?.xp ?? xp;
  const liveLevel = profile?.level ?? userLevel;
  const liveProgress = profile?.progress_percentage ?? 0;
  const liveCorrect = profile?.correct_answers ?? 0;
  const liveWrong = profile?.wrong_answers ?? 0;
  const liveQuizzes = profile?.total_quizzes ?? completedQuizzes;
  const liveLastActivity = profile?.last_activity
    ? new Date(profile.last_activity).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Active Now';

  // Form states
  const [formData, setFormData] = useState({
    name: liveName,
    usn: profile?.usn || usn,
    college: profile?.college || college,
    department: profile?.department || department,
    semester: profile?.semester || semester,
    phone: profile?.phone || phone,
    gender: profile?.gender || gender,
    dob: profile?.dob || dob,
    address: profile?.address || address,
    district: profile?.district || district,
    state: profile?.state || state
  });

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    if (currentUserId) {
      await supabaseData.updateUserProfile(currentUserId, {
        full_name: formData.name,
        name: formData.name,
        usn: formData.usn,
        college: formData.college,
        department: formData.department,
        semester: formData.semester,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob,
        address: formData.address,
        district: formData.district,
        state: formData.state
      });
    }

    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 1500);
  };

  return (
    <div className="p-4 sm:p-6 pb-24 space-y-4 sm:space-y-6 text-ink-900 dark:text-slate-100 bg-alabaster dark:bg-ink-950 max-w-4xl mx-auto min-w-0 overflow-hidden tq-fade-up">
      {/* Header Profile Summary */}
      <div className="text-center pt-2 sm:pt-4 pb-2 relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-brand-teal via-brand-emerald to-brand-royal rounded-2xl sm:rounded-3xl mx-auto flex items-center justify-center text-2xl sm:text-3xl font-black text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] ring-4 ring-teal-400/50 dark:ring-teal-500/50 ring-offset-4 ring-offset-white dark:ring-offset-[#0b1220] mb-3 sm:mb-4">
          {liveName ? liveName.charAt(0) : 'S'}
        </div>
        <h2 className="tq-display text-xl sm:text-2xl lg:text-3xl font-bold text-ink-900 dark:text-white">{liveName}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{liveEmail}</p>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
          <span className="tq-chip tq-chip-teal inline-flex items-center gap-1.5 px-3 py-1 border border-teal-500/40 text-xs font-semibold">
            <Sparkles size={13} /> Level {liveLevel} • TB Diagnostic Expert
          </span>
          <span className="tq-chip tq-chip-slate inline-flex items-center gap-1.5 px-3 py-1 border border-slate-700 dark:border-slate-600 text-xs font-mono">
            Last Active: {liveLastActivity}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="tq-btn-secondary touch-target min-h-11 inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-[#111c30] hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200 dark:border-slate-700 rounded-full text-ink-900 dark:text-slate-200 text-xs font-medium cursor-pointer transition-all"
          >
            <Edit3 size={13} className="text-brand-teal dark:text-teal-300" /> Edit Profile Details
          </button>
        </div>
      </div>

      {/* 6 Stats Cards (Section 7 - Live Supabase Data) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        <div className="tq-card tq-lift p-3 rounded-2xl text-center shadow-xs min-w-0">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Total XP</p>
          <p className="tq-display text-xl font-black text-brand-teal-deep dark:text-teal-300 font-mono mt-1">{liveXp}</p>
        </div>
        <div className="tq-card tq-lift p-3 rounded-2xl text-center shadow-xs min-w-0">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Current Level</p>
          <p className="tq-display text-xl font-black text-brand-royal dark:text-blue-300 font-mono mt-1">Level {liveLevel}</p>
        </div>
        <div className="tq-card tq-lift p-3 rounded-2xl text-center shadow-xs min-w-0">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Progress %</p>
          <p className="tq-display text-xl font-black text-brand-emerald dark:text-emerald-300 font-mono mt-1">{liveProgress}%</p>
        </div>
        <div className="tq-card tq-lift p-3 rounded-2xl text-center shadow-xs min-w-0">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Correct</p>
          <p className="tq-display text-xl font-black text-brand-emerald dark:text-emerald-300 font-mono mt-1">{liveCorrect}</p>
        </div>
        <div className="tq-card tq-lift p-3 rounded-2xl text-center shadow-xs min-w-0">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Wrong</p>
          <p className="tq-display text-xl font-black text-rose-500 dark:text-rose-300 font-mono mt-1">{liveWrong}</p>
        </div>
        <div className="tq-card tq-lift p-3 rounded-2xl text-center shadow-xs min-w-0">
          <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-mono">Total Quizzes</p>
          <p className="tq-display text-xl font-black text-brand-amber dark:text-amber-300 font-mono mt-1">{liveQuizzes}</p>
        </div>
      </div>

      {/* Student Academic & Institutional Profile Section */}
      <div className="tq-card p-5 sm:p-6 rounded-2xl sm:rounded-3xl space-y-4 shadow-sm min-w-0">
        <div className="tq-accent-bar" />
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
          <h3 className="text-sm sm:text-base font-bold text-ink-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="text-brand-teal dark:text-teal-300" /> Academic & Institutional Identification
          </h3>
          <span className="tq-chip tq-chip-teal text-[10px] font-mono uppercase border border-teal-500/30 px-2.5 py-1 rounded-full">
            Verified Record
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-[#0b1220]/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-1 min-w-0 hover:border-teal-400/60 transition-colors">
            <span className="tq-eyebrow text-[10px] uppercase font-mono">USN / Registration No.</span>
            <p className="font-bold text-ink-900 dark:text-slate-200 font-mono break-words">{formData.usn}</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#0b1220]/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-1 min-w-0 hover:border-teal-400/60 transition-colors">
            <span className="tq-eyebrow text-[10px] uppercase font-mono">Institution / College</span>
            <p className="font-bold text-ink-900 dark:text-slate-200 leading-tight">{formData.college}</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#0b1220]/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-1 min-w-0 hover:border-teal-400/60 transition-colors">
            <span className="tq-eyebrow text-[10px] uppercase font-mono">Department</span>
            <p className="font-bold text-ink-900 dark:text-slate-200 leading-tight">{formData.department}</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#0b1220]/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-1 min-w-0 hover:border-teal-400/60 transition-colors">
            <span className="tq-eyebrow text-[10px] uppercase font-mono">Academic Semester</span>
            <p className="font-bold text-ink-900 dark:text-slate-200">{formData.semester}</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#0b1220]/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-1 min-w-0 hover:border-teal-400/60 transition-colors">
            <span className="tq-eyebrow text-[10px] uppercase font-mono">Phone Number</span>
            <p className="font-bold text-ink-900 dark:text-slate-200 font-mono break-words">{formData.phone}</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-[#0b1220]/60 rounded-xl border border-slate-200 dark:border-slate-700/80 space-y-1 min-w-0 hover:border-teal-400/60 transition-colors">
            <span className="tq-eyebrow text-[10px] uppercase font-mono">District & State</span>
            <p className="font-bold text-ink-900 dark:text-slate-200">{formData.district}, {formData.state}</p>
          </div>
        </div>
      </div>

      {/* Activity Calendar */}
      <div className="tq-card p-4 rounded-2xl min-w-0">
        <h3 className="tq-eyebrow text-xs sm:text-sm font-semibold text-ink-900 dark:text-slate-100 mb-3">Activity Calendar</h3>
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 justify-items-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
            <div key={d} className="text-[10px] text-slate-500 dark:text-slate-400 text-center font-mono">
              {d}
            </div>
          ))}
          {Array.from({ length: 30 }).map((_, i) => {
            const day = i + 1;
            const isActive = day <= streak;
            return (
              <div
                key={day}
                className={`h-6 w-6 sm:h-7 sm:w-7 rounded-lg flex items-center justify-center text-[9px] sm:text-[10px] font-mono ${
                  isActive ? 'bg-gradient-to-br from-brand-teal to-brand-emerald text-white shadow-[0_0_10px_rgba(13,148,136,0.5)]' : 'bg-slate-100 dark:bg-[#0b1220] text-slate-500 dark:text-slate-600'
                }`}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* Menu Options & Settings */}
      <div className="space-y-3">
        {/* Dark / Light Theme Toggle Option */}
        <div className="tq-card p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm min-w-0">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-amber-950 text-amber-400 rounded-xl shrink-0">
              {mode === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div>
              <p className="font-semibold text-xs sm:text-sm">App Theme Mode</p>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">Current mode: {mode === 'dark' ? 'Dark Navy (#0B1120)' : 'Clean Light (#FFFFFF)'}</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="tq-btn-secondary touch-target min-h-11 w-full sm:w-auto px-4 py-2 bg-white dark:bg-[#111c30] hover:bg-teal-50 dark:hover:bg-teal-950/40 text-brand-teal-deep dark:text-teal-300 font-bold rounded-xl text-xs font-mono border border-slate-200 dark:border-slate-700 transition-all text-center cursor-pointer"
          >
            Switch to {mode === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>

        <button
          onClick={onOpenProgressReport}
          className="touch-target min-h-11 w-full p-3.5 sm:p-4 tq-card hover:bg-teal-50/50 dark:hover:bg-teal-950/30 rounded-2xl flex items-center justify-between gap-2 text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-emerald-950 text-emerald-400 rounded-xl shrink-0"><Award size={18} /></div>
            <span className="font-semibold text-left">Download Clinical Progress Report</span>
          </div>
          <span className="text-slate-500 dark:text-slate-400 shrink-0">→</span>
        </button>

        <div className="tq-card p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-2 text-xs sm:text-sm min-w-0 hover:border-teal-400/60 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-cyan-950 text-cyan-400 rounded-xl shrink-0"><ShieldCheck size={18} /></div>
            <div>
              <p className="font-semibold">Badges Earned</p>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">{badgesCount} Expert Certifications</p>
            </div>
          </div>
          <span className="tq-chip tq-chip-teal font-mono font-bold">{badgesCount}</span>
        </div>

        <div className="tq-card p-3.5 sm:p-4 rounded-2xl flex items-center justify-between gap-2 text-xs sm:text-sm min-w-0 hover:border-teal-400/60 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-purple-950 text-purple-400 rounded-xl shrink-0"><Bell size={18} /></div>
            <span className="font-semibold">Clinical Push Notifications</span>
          </div>
          <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 shrink-0" />
        </div>
      </div>

      <button
        onClick={onLogout}
        className="tq-btn-coral touch-target min-h-11 w-full py-3.5 sm:py-4 border border-rose-500/30 text-white font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all mt-4 sm:mt-6 shadow-[0_0_15px_rgba(244,63,94,0.15)] cursor-pointer"
      >
        <LogOut size={18} />
        <span>Logout Session</span>
      </button>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="tq-card rounded-2xl p-6 w-full max-w-xl shadow-[0_0_50px_rgba(6,182,212,0.2)] space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
              <h3 className="tq-display text-base font-bold text-ink-900 dark:text-white flex items-center gap-2">
                <Edit3 className="text-brand-teal dark:text-teal-300" /> Edit Student Profile
              </h3>
              <button onClick={() => setIsEditing(false)} className="tq-btn-ghost touch-target min-h-11 min-w-11 text-slate-500 dark:text-slate-300 hover:text-ink-900 dark:hover:text-white cursor-pointer flex items-center justify-center rounded-full">
                <X size={20} />
              </button>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950 border border-emerald-500/50 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle size={16} /> Profile details saved directly to Supabase.
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="tq-input w-full px-3 py-2.5 min-h-11"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-1">USN / Reg No.</label>
                  <input
                    type="text"
                    value={formData.usn}
                    onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
                    className="tq-input w-full px-3 py-2.5 min-h-11 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-1">College / Institution</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="tq-input w-full px-3 py-2.5 min-h-11"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="tq-input w-full px-3 py-2.5 min-h-11"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-1">Semester</label>
                  <input
                    type="text"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="tq-input w-full px-3 py-2.5 min-h-11"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="tq-input w-full px-3 py-2.5 min-h-11 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="tq-input w-full px-3 py-2.5 min-h-11"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="tq-input w-full px-3 py-2.5 min-h-11"
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="tq-btn-secondary touch-target min-h-11 px-4 py-2 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="tq-btn-primary touch-target min-h-11 px-6 py-2 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Save size={16} />
                  <span>{isSaving ? 'Saving...' : 'Save to Supabase'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

