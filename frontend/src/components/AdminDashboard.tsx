import React, { useState, useEffect } from 'react';
import { Settings, Users, Shield, Cpu, Database, RefreshCw, FileText, LogOut, BarChart2, BookOpen, Plus, Trash2, Edit3, CheckCircle, AlertCircle, Image } from 'lucide-react';
import AdminQuestionManager from './admin/AdminQuestionManager';
import MyLearningRoadmap from './dashboard/MyLearningRoadmap';
import { supabase } from '../services/supabase';
import { supabaseData } from '../services/supabaseData';

interface AdminDashboardProps {
  onLogout?: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'questions' | 'students' | 'articles' | 'announcements' | 'settings'>('students');

  // Student list state
  const [students, setStudents] = useState<any[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(false);

  // Articles CMS state
  const [articles, setArticles] = useState<any[]>([]);
  const [articleForm, setArticleForm] = useState({ title: '', category: 'TB BASICS', summary: '', content: '', keyHighlights: '' });
  const [articleSaving, setArticleSaving] = useState(false);
  const [articleMsg, setArticleMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // Announcements CMS state
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', category: 'ANNOUNCEMENT', content: '' });
  const [announcementSaving, setAnnouncementSaving] = useState(false);
  const [announcementMsg, setAnnouncementMsg] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (activeTab === 'students') fetchStudents();
    if (activeTab === 'articles') fetchArticles();
    if (activeTab === 'announcements') fetchAnnouncements();
  }, [activeTab]);

  async function fetchStudents() {
    setStudentsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'student')
        .order('xp', { ascending: false });
      if (!error && data) setStudents(data);
    } catch (e) { console.warn(e); }
    setStudentsLoading(false);
  }

  async function fetchArticles() {
    try {
      const { data } = await supabase.from('cms_articles').select('*').order('created_at', { ascending: false });
      if (data) setArticles(data);
    } catch (e) {}
  }

  async function fetchAnnouncements() {
    try {
      const { data } = await supabase.from('cms_announcements').select('*').order('created_at', { ascending: false });
      if (data) setAnnouncements(data);
    } catch (e) {}
  }

  async function handlePublishArticle(e: React.FormEvent) {
    e.preventDefault();
    setArticleSaving(true);
    setArticleMsg(null);
    try {
      const { error } = await supabase.from('cms_articles').insert({
        title: articleForm.title,
        category: articleForm.category,
        summary: articleForm.summary,
        content: articleForm.content.split('\n').filter(Boolean),
        key_highlights: articleForm.keyHighlights.split('\n').filter(Boolean),
        read_time: `${Math.ceil(articleForm.content.split(' ').length / 200)} min`
      });
      if (error) throw error;
      setArticleMsg({ ok: true, text: 'Article published to Supabase. Students can see it now.' });
      setArticleForm({ title: '', category: 'TB BASICS', summary: '', content: '', keyHighlights: '' });
      fetchArticles();
    } catch (err: any) {
      setArticleMsg({ ok: false, text: `Error: ${err?.message || 'Failed to publish'}` });
    }
    setArticleSaving(false);
  }

  async function handleDeleteArticle(id: string) {
    if (!window.confirm('Delete this article?')) return;
    await supabase.from('cms_articles').delete().eq('id', id);
    fetchArticles();
  }

  async function handlePublishAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    setAnnouncementSaving(true);
    setAnnouncementMsg(null);
    try {
      const { error } = await supabase.from('cms_announcements').insert({
        title: announcementForm.title,
        category: announcementForm.category,
        content: announcementForm.content
      });
      if (error) throw error;
      setAnnouncementMsg({ ok: true, text: 'Announcement published. Students see it instantly via Realtime.' });
      setAnnouncementForm({ title: '', category: 'ANNOUNCEMENT', content: '' });
      fetchAnnouncements();
    } catch (err: any) {
      setAnnouncementMsg({ ok: false, text: `Error: ${err?.message || 'Failed to publish'}` });
    }
    setAnnouncementSaving(false);
  }

  async function handleDeleteAnnouncement(id: string) {
    if (!window.confirm('Delete this announcement?')) return;
    await supabase.from('cms_announcements').delete().eq('id', id);
    fetchAnnouncements();
  }

  const tabs = [
    { id: 'students', label: 'Student Manager', icon: Users, color: 'cyan' },
    { id: 'questions', label: 'Question Bank', icon: FileText, color: 'indigo' },
    { id: 'articles', label: 'Articles CMS', icon: BookOpen, color: 'emerald' },
    { id: 'announcements', label: 'Announcements', icon: AlertCircle, color: 'amber' },
    { id: 'settings', label: 'Platform Settings', icon: Settings, color: 'purple' }
  ] as const;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 min-h-screen overflow-hidden bg-alabaster dark:bg-[#0b1220] text-ink-900 dark:text-slate-100 font-sans tq-fade-up">
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
              TB DIAGNOSTIC LEARNING PLATFORM • ADMIN CONTROL PANEL
            </p>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={async () => { await fetchStudents(); await fetchArticles(); await fetchAnnouncements(); }}
            className="tq-btn-secondary touch-target flex items-center gap-2 px-4 py-2.5 dark:bg-[#111c30] dark:text-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <RefreshCw size={16} /> Sync All
          </button>
          {onLogout && (
            <button onClick={onLogout} className="tq-btn-coral touch-target flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-colors cursor-pointer">
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`touch-target flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? `tq-btn-primary shadow-md`
                : 'tq-btn-secondary dark:bg-[#111c30] dark:text-slate-400 dark:border-slate-700 hover:text-ink-900 dark:hover:text-white'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Student Manager */}
      {activeTab === 'students' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="tq-display text-lg font-bold text-ink-900 dark:text-white flex items-center gap-2 min-w-0"><Users className="text-brand-teal shrink-0" /> Registered Students</h2>
            <span className="tq-chip tq-chip-teal">{students.length} Students</span>
          </div>
          {studentsLoading ? (
            <div className="tq-card text-center text-slate-500 dark:text-slate-400 py-12 text-sm px-4">Loading from Supabase...</div>
          ) : students.length === 0 ? (
            <div className="tq-card text-center text-slate-500 dark:text-slate-400 py-12 text-sm px-4">No students registered yet. Share the platform link to get enrollments.</div>
          ) : (
            <div className="tq-card overflow-x-auto overflow-auto rounded-2xl">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-teal-50/80 dark:bg-[#111c30] border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-mono">
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">College</th>
                    <th className="px-4 py-3 text-center">Level</th>
                    <th className="px-4 py-3 text-center">XP</th>
                    <th className="px-4 py-3 text-center">Cases</th>
                    <th className="px-4 py-3 text-center">Streak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
                  {students.map((s, i) => (
                    <tr key={s.id} className={`${i % 2 === 0 ? 'bg-white dark:bg-[#0b1220]' : 'bg-slate-50 dark:bg-[#111c30]/60'} hover:bg-teal-50 dark:hover:bg-slate-800/60 transition-colors`}>
                      <td className="px-4 py-3 font-semibold text-ink-900 dark:text-white">{s.name || '—'}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono">{s.email || '—'}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{s.college || '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="tq-chip tq-chip-teal font-mono">L{s.level ?? 1}</span>
                      </td>
                      <td className="px-4 py-3 text-center font-black text-amber-400 font-mono">{s.xp ?? 0}</td>
                      <td className="px-4 py-3 text-center text-purple-400 font-mono">{s.completed_cases ?? 0}</td>
                      <td className="px-4 py-3 text-center text-emerald-400 font-mono">{s.streak ?? 0}🔥</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Tab: Question Bank */}
      {activeTab === 'questions' && <AdminQuestionManager />}

      {/* Tab: Articles CMS */}
      {activeTab === 'articles' && (
        <div className="space-y-6">
          <h2 className="tq-display text-lg font-bold text-ink-900 dark:text-white flex items-center gap-2 min-w-0"><BookOpen className="text-brand-emerald shrink-0" /> Articles CMS — Publish to Students</h2>

          <form onSubmit={handlePublishArticle} className="tq-card tq-lift p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-brand-emerald dark:text-emerald-400">Create New Article</h3>
            {articleMsg && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${articleMsg.ok ? 'bg-emerald-50 dark:bg-emerald-950 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950 border border-rose-500/40 text-rose-700 dark:text-rose-300'}`}>
                {articleMsg.ok ? <CheckCircle size={15} /> : <AlertCircle size={15} />} {articleMsg.text}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-1.5">Article Title</label>
                <input type="text" required value={articleForm.title} onChange={e => setArticleForm(p => ({ ...p, title: e.target.value }))}
                  className="tq-input w-full px-3 py-2.5 text-sm min-h-11" placeholder="e.g. CBNAAT Testing Protocol 2026" />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-1.5">Category</label>
                <select value={articleForm.category} onChange={e => setArticleForm(p => ({ ...p, category: e.target.value }))}
                  className="tq-input w-full px-3 py-2.5 text-sm min-h-11">
                  {['TB BASICS', 'DIAGNOSIS', 'TREATMENT', 'PREVENTION', 'STATISTICS', 'POLICY', 'NTEP', 'WHO GUIDELINES', 'CLINICAL CASE'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-xs">
              <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-1.5">Summary (1 line)</label>
              <input type="text" value={articleForm.summary} onChange={e => setArticleForm(p => ({ ...p, summary: e.target.value }))}
                className="tq-input w-full px-3 py-2.5 text-sm min-h-11" placeholder="Brief summary visible on the dashboard card" />
            </div>
            <div className="text-xs">
              <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-1.5">Full Content (one paragraph per line)</label>
              <textarea rows={5} value={articleForm.content} onChange={e => setArticleForm(p => ({ ...p, content: e.target.value }))}
                className="tq-input w-full px-3 py-2.5 text-sm min-h-11 resize-none" placeholder="Each line becomes a paragraph in the full article reader..." />
            </div>
            <div className="text-xs">
              <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-1.5">Key Highlights (one per line)</label>
              <textarea rows={3} value={articleForm.keyHighlights} onChange={e => setArticleForm(p => ({ ...p, keyHighlights: e.target.value }))}
                className="tq-input w-full px-3 py-2.5 text-sm min-h-11 resize-none" placeholder="Each line is a bullet point in Key Takeaways..." />
            </div>
            <button type="submit" disabled={articleSaving}
              className="tq-btn-primary touch-target px-6 py-2.5 text-xs flex items-center gap-2 cursor-pointer shadow-md">
              <Plus size={16} /> {articleSaving ? 'Publishing...' : 'Publish Article to Students'}
            </button>
          </form>

          {/* Published Articles List */}
          <div className="space-y-3">
            <h3 className="tq-eyebrow text-xs font-bold uppercase font-mono">Published Articles ({articles.length})</h3>
            {articles.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-xs">No articles published yet.</p>
            ) : articles.map(a => (
              <div key={a.id} className="tq-card tq-lift p-4 flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <span className="tq-chip tq-chip-teal font-mono uppercase">{a.category}</span>
                  <p className="text-sm font-bold text-ink-900 dark:text-white truncate">{a.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{a.summary || 'No summary'}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-500 font-mono">{new Date(a.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => handleDeleteArticle(a.id)} className="touch-target p-2 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl cursor-pointer shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Announcements CMS */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <h2 className="tq-display text-lg font-bold text-ink-900 dark:text-white flex items-center gap-2 min-w-0"><AlertCircle className="text-brand-amber shrink-0" /> Announcements — Live Broadcast to Students</h2>

          <form onSubmit={handlePublishAnnouncement} className="tq-card tq-lift p-5 sm:p-6 space-y-4">
            <h3 className="text-sm font-bold text-brand-amber dark:text-amber-400">Create Announcement</h3>
            {announcementMsg && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${announcementMsg.ok ? 'bg-emerald-50 dark:bg-emerald-950 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300' : 'bg-rose-50 dark:bg-rose-950 border border-rose-500/40 text-rose-700 dark:text-rose-300'}`}>
                {announcementMsg.ok ? <CheckCircle size={15} /> : <AlertCircle size={15} />} {announcementMsg.text}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-1.5">Title</label>
                <input type="text" required value={announcementForm.title} onChange={e => setAnnouncementForm(p => ({ ...p, title: e.target.value }))}
                  className="tq-input w-full px-3 py-2.5 text-sm min-h-11" placeholder="e.g. New Clinical Cases Available" />
              </div>
              <div>
                <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-1.5">Category</label>
                <select value={announcementForm.category} onChange={e => setAnnouncementForm(p => ({ ...p, category: e.target.value }))}
                  className="tq-input w-full px-3 py-2.5 text-sm min-h-11">
                  {['ANNOUNCEMENT', 'URGENT', 'NEW FEATURE', 'MAINTENANCE', 'EVENT', 'SCHOLARSHIP', 'EXAM'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-xs">
              <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-1.5">Message Content</label>
              <textarea rows={4} value={announcementForm.content} onChange={e => setAnnouncementForm(p => ({ ...p, content: e.target.value }))}
                className="tq-input w-full px-3 py-2.5 text-sm min-h-11 resize-none" placeholder="Full announcement message..." />
            </div>
            <button type="submit" disabled={announcementSaving}
              className="tq-btn-coral touch-target px-6 py-2.5 text-xs flex items-center gap-2 cursor-pointer shadow-md">
              <Plus size={16} /> {announcementSaving ? 'Broadcasting...' : 'Broadcast to All Students'}
            </button>
          </form>

          {/* Announcements List */}
          <div className="space-y-3">
            <h3 className="tq-eyebrow text-xs font-bold uppercase font-mono">Active Announcements ({announcements.length})</h3>
            {announcements.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-xs">No announcements yet.</p>
            ) : announcements.map(a => (
              <div key={a.id} className="tq-card tq-lift p-4 flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <span className="tq-chip tq-chip-amber font-mono uppercase">{a.category}</span>
                  <p className="text-sm font-bold text-ink-900 dark:text-white">{a.title}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{a.content || '—'}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-500 font-mono">{new Date(a.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => handleDeleteAnnouncement(a.id)} className="touch-target p-2 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 rounded-xl cursor-pointer shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Platform Settings */}
      {activeTab === 'settings' && (
        <div className="tq-card p-4 sm:p-8 space-y-4 sm:space-y-6">
          <h3 className="tq-display text-lg sm:text-xl font-bold text-ink-900 dark:text-white flex items-center gap-2">
            <Settings className="text-purple-400" /> Platform Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-2">Platform Name</label>
              <input type="text" defaultValue="TB Quest - AI Powered Diagnostic Learning" className="tq-input w-full px-4 py-3 text-xs sm:text-sm min-h-11" />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-2">Default XP Multiplier</label>
              <input type="number" defaultValue="1.0" step="0.1" className="tq-input w-full px-4 py-3 text-xs sm:text-sm min-h-11" />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-2">Passing Score Threshold (%)</label>
              <input type="number" defaultValue="80" min="50" max="100" className="tq-input w-full px-4 py-3 text-xs sm:text-sm min-h-11" />
            </div>
            <div>
              <label className="block text-slate-500 dark:text-slate-400 uppercase font-mono mb-2">Max Level</label>
              <input type="number" defaultValue="6" min="1" max="10" className="tq-input w-full px-4 py-3 text-xs sm:text-sm min-h-11" />
            </div>
          </div>
          <button onClick={() => alert('Settings saved!')} className="tq-btn-primary touch-target px-6 py-3 text-xs sm:text-sm font-semibold transition-all cursor-pointer">
            Save Configuration
          </button>
        </div>
      )}

      {/* MY TB QUEST JOURNEY Roadmap Bar */}
      <div className="pt-2">
        <MyLearningRoadmap
          userLevel={1}
          completedCases={0}
          onStartLevel={(lvl) => alert(`Selected Level ${lvl}`)}
          onStartIntroduction={() => alert('Selected TB Introduction')}
        />
      </div>
    </div>
  );
}
