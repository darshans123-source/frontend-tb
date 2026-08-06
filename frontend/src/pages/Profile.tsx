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
    <div className="p-4 sm:p-6 pb-24 space-y-4 sm:space-y-6 text-white max-w-4xl mx-auto">
      {/* Header Profile Summary */}
      <div className="text-center pt-2 sm:pt-4 pb-2 relative">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 rounded-2xl sm:rounded-3xl mx-auto flex items-center justify-center text-2xl sm:text-3xl font-black shadow-[0_0_30px_rgba(6,182,212,0.4)] mb-3 sm:mb-4">
          {liveName ? liveName.charAt(0) : 'S'}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold">{liveName}</h2>
        <p className="text-xs text-slate-400 font-mono mt-0.5">{liveEmail}</p>
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-950/80 border border-cyan-500/40 rounded-full text-cyan-300 text-xs font-semibold">
            <Sparkles size={13} /> Level {liveLevel} • TB Diagnostic Expert
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-slate-700 rounded-full text-slate-300 text-xs font-mono">
            Last Active: {liveLastActivity}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-slate-200 text-xs font-medium cursor-pointer transition-all"
          >
            <Edit3 size={13} className="text-cyan-400" /> Edit Profile Details
          </button>
        </div>
      </div>

      {/* 6 Stats Cards (Section 7 - Live Supabase Data) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-center shadow-xs">
          <p className="text-[10px] text-slate-400 uppercase font-mono">Total XP</p>
          <p className="text-xl font-black text-cyan-400 font-mono mt-1">{liveXp}</p>
        </div>
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-center shadow-xs">
          <p className="text-[10px] text-slate-400 uppercase font-mono">Current Level</p>
          <p className="text-xl font-black text-blue-400 font-mono mt-1">Level {liveLevel}</p>
        </div>
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-center shadow-xs">
          <p className="text-[10px] text-slate-400 uppercase font-mono">Progress %</p>
          <p className="text-xl font-black text-emerald-400 font-mono mt-1">{liveProgress}%</p>
        </div>
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-center shadow-xs">
          <p className="text-[10px] text-slate-400 uppercase font-mono">Correct</p>
          <p className="text-xl font-black text-emerald-400 font-mono mt-1">{liveCorrect}</p>
        </div>
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-center shadow-xs">
          <p className="text-[10px] text-slate-400 uppercase font-mono">Wrong</p>
          <p className="text-xl font-black text-rose-400 font-mono mt-1">{liveWrong}</p>
        </div>
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl text-center shadow-xs">
          <p className="text-[10px] text-slate-400 uppercase font-mono">Total Quizzes</p>
          <p className="text-xl font-black text-amber-400 font-mono mt-1">{liveQuizzes}</p>
        </div>
      </div>

      {/* Student Academic & Institutional Profile Section */}
      <div className="p-5 sm:p-6 bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <GraduationCap className="text-cyan-400" /> Academic & Institutional Identification
          </h3>
          <span className="text-[10px] text-cyan-400 font-mono uppercase bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-full">
            Verified Record
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-mono">USN / Registration No.</span>
            <p className="font-bold text-slate-200 font-mono">{formData.usn}</p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Institution / College</span>
            <p className="font-bold text-slate-200 leading-tight">{formData.college}</p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Department</span>
            <p className="font-bold text-slate-200 leading-tight">{formData.department}</p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Academic Semester</span>
            <p className="font-bold text-slate-200">{formData.semester}</p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Phone Number</span>
            <p className="font-bold text-slate-200 font-mono">{formData.phone}</p>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-mono">District & State</span>
            <p className="font-bold text-slate-200">{formData.district}, {formData.state}</p>
          </div>
        </div>
      </div>

      {/* Activity Calendar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <h3 className="text-xs sm:text-sm font-semibold text-slate-300 mb-3">Activity Calendar</h3>
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 justify-items-center">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
            <div key={d} className="text-[10px] text-slate-500 text-center font-mono">
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
                  isActive ? 'bg-cyan-600 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-slate-950 text-slate-600'
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
        <div className="p-3.5 sm:p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-amber-950 text-amber-400 rounded-xl shrink-0">
              {mode === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div>
              <p className="font-semibold text-xs sm:text-sm">App Theme Mode</p>
              <p className="text-[10px] sm:text-xs text-slate-400">Current mode: {mode === 'dark' ? 'Dark Navy (#0B1120)' : 'Clean Light (#FFFFFF)'}</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="w-full sm:w-auto px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold rounded-xl text-xs font-mono border border-slate-700 transition-all text-center cursor-pointer"
          >
            Switch to {mode === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>

        <button
          onClick={onOpenProgressReport}
          className="w-full p-3.5 sm:p-4 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-2xl flex items-center justify-between text-xs sm:text-sm transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-emerald-950 text-emerald-400 rounded-xl shrink-0"><Award size={18} /></div>
            <span className="font-semibold text-left">Download Clinical Progress Report</span>
          </div>
          <span className="text-slate-500">→</span>
        </button>

        <div className="p-3.5 sm:p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-cyan-950 text-cyan-400 rounded-xl shrink-0"><ShieldCheck size={18} /></div>
            <div>
              <p className="font-semibold">Badges Earned</p>
              <p className="text-[10px] sm:text-xs text-slate-400">{badgesCount} Expert Certifications</p>
            </div>
          </div>
          <span className="text-cyan-400 font-mono font-bold">{badgesCount}</span>
        </div>

        <div className="p-3.5 sm:p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-purple-950 text-purple-400 rounded-xl shrink-0"><Bell size={18} /></div>
            <span className="font-semibold">Clinical Push Notifications</span>
          </div>
          <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0 shrink-0" />
        </div>
      </div>

      <button
        onClick={onLogout}
        className="w-full py-3.5 sm:py-4 bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/30 text-rose-400 font-bold text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all mt-4 sm:mt-6 shadow-[0_0_15px_rgba(244,63,94,0.15)] cursor-pointer"
      >
        <LogOut size={18} />
        <span>Logout Session</span>
      </button>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 w-full max-w-xl shadow-[0_0_50px_rgba(6,182,212,0.2)] space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Edit3 className="text-cyan-400" /> Edit Student Profile
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle size={16} /> Profile details saved directly to Supabase.
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1">USN / Reg No.</label>
                  <input
                    type="text"
                    value={formData.usn}
                    onChange={(e) => setFormData({ ...formData, usn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1">College / Institution</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1">Semester</label>
                  <input
                    type="text"
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 uppercase font-mono mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
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

