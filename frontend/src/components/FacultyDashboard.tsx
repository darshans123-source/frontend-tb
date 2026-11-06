import React, { useState, useEffect } from 'react';
import { BarChart3, Users, FileText, Download, CheckCircle, AlertTriangle, Upload, Plus, BookOpen, Layers, LogOut } from 'lucide-react';
import { supabase } from '../services/supabase';

interface FacultyDashboardProps {
  onLogout?: () => void;
}

export default function FacultyDashboard({ onLogout }: FacultyDashboardProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'content' | 'cases'>('analytics');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceCategory, setResourceCategory] = useState('NTEP Guideline');
  const [resourceContent, setResourceContent] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Real student data from Supabase
  const [students, setStudents] = useState<any[]>([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);
  const [avgXp, setAvgXp] = useState(0);
  const [avgAccuracy, setAvgAccuracy] = useState(0);
  const [totalCasesCompleted, setTotalCasesCompleted] = useState(0);

  useEffect(() => {
    if (activeTab === 'analytics') fetchStudentAnalytics();
  }, [activeTab]);

  async function fetchStudentAnalytics() {
    setStatsLoading(true);
    try {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('xp', { ascending: false })
        .limit(20);
      if (data && data.length > 0) {
        setStudents(data);
        setTotalStudents(data.length);
        setAvgXp(Math.round(data.reduce((s: number, r: any) => s + (r.xp || 0), 0) / data.length));
        setAvgAccuracy(Math.round(data.reduce((s: number, r: any) => s + (r.accuracy || 0), 0) / data.length));
        setTotalCasesCompleted(data.reduce((s: number, r: any) => s + (r.completed_cases || 0), 0));
      }
    } catch (e) {}
    setStatsLoading(false);
  }


  const handleUploadResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceTitle.trim()) return;
    setSuccessMessage(`Learning Resource "${resourceTitle}" published successfully.`);
    setResourceTitle('');
    setResourceContent('');
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 min-h-screen overflow-hidden bg-alabaster dark:bg-[#0b1220] text-ink-900 dark:text-slate-100 font-sans tq-fade-up">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <img
            src="/nit_logo.png"
            alt="TB Quest Official Logo"
            className="tq-img w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] md:w-[48px] md:h-[48px] object-contain aspect-square bg-white p-1 sm:p-1.5 rounded-2xl shadow-md shrink-0"
          />
          <div>
            <h1 className="tq-display text-2xl sm:text-3xl font-extrabold text-ink-900 dark:text-white tracking-tight">
              TB QUEST
            </h1>
            <p className="tq-eyebrow text-[10px] sm:text-xs font-extrabold uppercase tracking-wider">
              TB DIAGNOSTIC LEARNING PLATFORM • FACULTY PORTAL
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => alert("Exporting student analytics PDF report...")}
            className="tq-btn-primary touch-target flex items-center gap-2 px-4 py-2.5 font-semibold text-xs sm:text-sm transition-all shrink-0 cursor-pointer"
          >
            <Download size={18} />
            <span>Export Analytics PDF</span>
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="tq-btn-coral touch-target flex items-center gap-2 px-4 py-2.5 font-semibold text-xs sm:text-sm transition-all shrink-0 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`touch-target flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'analytics' ? 'tq-btn-primary shadow-md' : 'tq-btn-secondary dark:bg-[#111c30] dark:text-slate-400 dark:border-slate-700 hover:text-ink-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 size={16} /> Student Analytics & Progress
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`touch-target flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'content' ? 'tq-btn-primary shadow-md' : 'tq-btn-secondary dark:bg-[#111c30] dark:text-slate-400 dark:border-slate-700 hover:text-ink-900 dark:hover:text-white'
          }`}
        >
          <BookOpen size={16} /> Resource & Image CMS
        </button>

        <button
          onClick={() => setActiveTab('cases')}
          className={`touch-target flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'cases' ? 'tq-btn-primary shadow-md' : 'tq-btn-secondary dark:bg-[#111c30] dark:text-slate-400 dark:border-slate-700 hover:text-ink-900 dark:hover:text-white'
          }`}
        >
          <Layers size={16} /> Clinical Cases & Quizzes
        </button>
      </div>

      {/* Tab 1: Analytics */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 sm:space-y-8">
          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="tq-card tq-lift p-4 sm:p-6">
              <div className="tq-accent-bar mb-3"></div>
              <div className="flex items-center gap-3 text-brand-teal mb-2">
                <Users size={20} />
                <span className="tq-chip tq-chip-teal uppercase font-mono">Enrolled Students</span>
              </div>
              <p className="tq-display text-2xl sm:text-3xl font-extrabold font-mono text-ink-900 dark:text-white">{statsLoading ? '—' : totalStudents}</p>
              <p className="text-xs text-brand-emerald dark:text-emerald-400 mt-1">Live from Supabase</p>
            </div>

            <div className="tq-card tq-lift p-4 sm:p-6">
              <div className="tq-accent-bar mb-3"></div>
              <div className="flex items-center gap-3 text-brand-emerald mb-2">
                <CheckCircle size={20} />
                <span className="tq-chip tq-chip-teal uppercase font-mono">Avg. Accuracy</span>
              </div>
              <p className="tq-display text-2xl sm:text-3xl font-extrabold font-mono text-ink-900 dark:text-white">{statsLoading ? '—' : `${avgAccuracy}%`}</p>
              <p className="text-xs text-brand-emerald dark:text-emerald-400 mt-1">All clinical cases</p>
            </div>

            <div className="tq-card tq-lift p-4 sm:p-6">
              <div className="tq-accent-bar mb-3"></div>
              <div className="flex items-center gap-3 text-brand-amber mb-2">
                <BarChart3 size={20} />
                <span className="tq-chip tq-chip-amber uppercase font-mono">Total XP Avg</span>
              </div>
              <p className="tq-display text-2xl sm:text-3xl font-extrabold font-mono text-ink-900 dark:text-white">{statsLoading ? '—' : avgXp}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Per student</p>
            </div>

            <div className="tq-card tq-lift p-4 sm:p-6">
              <div className="tq-accent-bar mb-3"></div>
              <div className="flex items-center gap-3 text-brand-royal mb-2">
                <AlertTriangle size={20} />
                <span className="tq-chip tq-chip-royal uppercase font-mono">Cases Completed</span>
              </div>
              <p className="tq-display text-2xl sm:text-3xl font-extrabold font-mono text-ink-900 dark:text-white">{statsLoading ? '—' : totalCasesCompleted}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Across all students</p>
            </div>
          </div>

          {/* Live Student Table */}
          <div className="tq-card p-4 sm:p-6 sm:rounded-3xl">
            <h3 className="tq-display text-base sm:text-lg font-bold text-ink-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="text-cyan-400" /> Live Student Progress Leaderboard
            </h3>
            {statsLoading ? (
              <div className="text-center text-slate-500 dark:text-slate-400 py-8 text-sm">Loading live student data from Supabase...</div>
            ) : students.length === 0 ? (
              <div className="text-center text-slate-500 dark:text-slate-400 py-8 text-sm">No students registered yet.</div>
            ) : (
              <div className="overflow-x-auto overflow-auto custom-scrollbar">
                <table className="w-full text-left text-xs min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-mono text-xs uppercase">
                      <th className="pb-3">Rank</th>
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">College</th>
                      <th className="pb-3">Level</th>
                      <th className="pb-3">XP</th>
                      <th className="pb-3">Cases</th>
                      <th className="pb-3">Accuracy</th>
                      <th className="pb-3">Streak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                    {students.map((s, i) => (
                      <tr key={s.id} className="hover:bg-teal-50 dark:hover:bg-slate-800/60 transition-colors">
                        <td className="py-3 font-mono text-slate-500 dark:text-slate-400">#{i + 1}</td>
                        <td className="py-3 font-semibold text-ink-900 dark:text-white">{s.name || '—'}</td>
                        <td className="py-3 text-slate-500 dark:text-slate-400 truncate max-w-[120px] min-w-0">{s.college || '—'}</td>
                        <td className="py-3"><span className="tq-chip tq-chip-teal font-mono text-[10px]">L{s.level ?? 1}</span></td>
                        <td className="py-3 font-black text-amber-400 font-mono">{s.xp ?? 0}</td>
                        <td className="py-3 text-purple-400 font-mono">{s.completed_cases ?? 0}</td>
                        <td className="py-3 text-emerald-400 font-mono">{s.accuracy ?? 0}%</td>
                        <td className="py-3 text-emerald-400 font-mono">{s.streak ?? 0}🔥</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}


      {/* Tab 2: Resource & Image CMS */}
      {activeTab === 'content' && (
        <div className="tq-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="tq-display text-lg font-bold text-ink-900 dark:text-white flex items-center gap-2">
                <BookOpen className="text-brand-royal shrink-0" /> Faculty Learning Resource & Image CMS
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Upload educational reference materials, clinical guidelines, and high-res radiology images.</p>
            </div>
          </div>

          {successMessage && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/90 border border-emerald-500/50 rounded-2xl text-emerald-700 dark:text-emerald-200 text-xs font-mono">
              ✓ {successMessage}
            </div>
          )}

          <form onSubmit={handleUploadResource} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase font-mono text-slate-500 dark:text-slate-400 mb-2">Resource Title</label>
                <input
                  type="text"
                  value={resourceTitle}
                  onChange={(e) => setResourceTitle(e.target.value)}
                  placeholder="e.g. NTEP 2026 Upfront CBNAAT Protocol"
                  className="tq-input w-full px-4 py-3 text-xs min-h-11"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-slate-500 dark:text-slate-400 mb-2">Category</label>
                <select
                  value={resourceCategory}
                  onChange={(e) => setResourceCategory(e.target.value)}
                  className="tq-input w-full px-4 py-3 text-xs min-h-11"
                >
                  <option value="NTEP Guideline">NTEP Guideline</option>
                  <option value="WHO Standard">WHO Standard</option>
                  <option value="Radiology Case">Radiology Case</option>
                  <option value="Drug Regimen">Drug Regimen</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-mono text-slate-500 dark:text-slate-400 mb-2">Resource Description / Content</label>
              <textarea
                rows={4}
                value={resourceContent}
                onChange={(e) => setResourceContent(e.target.value)}
                placeholder="Enter detailed clinical notes or resource documentation..."
                className="tq-input w-full p-4 text-xs min-h-11"
                required
              />
            </div>

            <div className="tq-card border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-6 text-center space-y-2 hover:border-brand-teal/50 transition-colors">
              <Upload className="mx-auto text-slate-500" size={28} />
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">Drag & drop radiology scans, CXR images, or diagnostic flowcharts</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">Supports PNG, JPG, WEBP, PDF (Max 15MB)</p>
            </div>

            <button
              type="submit"
              className="tq-btn-primary touch-target px-6 py-3 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus size={16} /> Publish Resource
            </button>
          </form>
        </div>
      )}

      {/* Tab 3: Clinical Cases & Quizzes */}
      {activeTab === 'cases' && (
        <div className="tq-card p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="tq-display text-lg font-bold text-ink-900 dark:text-white flex items-center gap-2">
                <Layers className="text-brand-royal shrink-0" /> Clinical Case & Quiz Creator
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Author interactive patient simulations, diagnostic decision trees, and Level 1 quiz questions.</p>
            </div>
            <button
              onClick={() => alert("Launching Case Builder...")}
              className="tq-btn-primary touch-target px-4 py-2.5 font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer shrink-0"
            >
              <Plus size={16} /> Create New Case
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="tq-card tq-lift p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-ink-900 dark:text-white">Pulmonary TB Simulation Module</h4>
                <span className="tq-chip tq-chip-teal font-mono text-[10px]">Active</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">10 interactive clinical cases covering smear-positive, smear-negative, and CBNAAT workflows.</p>
              <button onClick={() => alert("Editing Pulmonary TB Cases...")} className="touch-target text-xs text-brand-teal-deep dark:text-cyan-400 hover:underline font-semibold inline-flex items-center">Manage 10 Cases →</button>
            </div>

            <div className="tq-card tq-lift p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-ink-900 dark:text-white">Pediatric TB Simulation Module</h4>
                <span className="tq-chip tq-chip-teal font-mono text-[10px]">Active</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Gastric aspirate interpretation, contact tracing, and pediatric dosing calculators.</p>
              <button onClick={() => alert("Editing Pediatric Cases...")} className="touch-target text-xs text-brand-teal-deep dark:text-cyan-400 hover:underline font-semibold inline-flex items-center">Manage 8 Cases →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

