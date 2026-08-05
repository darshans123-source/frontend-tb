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
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 min-h-screen text-white">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <img
            src="/nit_logo.png"
            alt="TB Quest Official Logo"
            className="w-[40px] h-[40px] sm:w-[44px] sm:h-[44px] md:w-[48px] md:h-[48px] object-contain rounded-[8px] shadow-md shrink-0"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight">
              TB QUEST
            </h1>
            <p className="text-[10px] sm:text-xs font-extrabold text-[#0F6FFF] uppercase tracking-wider">
              TB DIAGNOSTIC LEARNING PLATFORM • ADMIN CONTROL PANEL
            </p>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={async () => { await fetchStudents(); await fetchArticles(); await fetchAnnouncements(); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-200 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            <RefreshCw size={16} /> Sync All
          </button>
          {onLogout && (
            <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 rounded-xl text-rose-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer">
              <LogOut size={16} /> Logout
            </button>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === tab.id
                ? `bg-${tab.color}-950 text-${tab.color}-300 border border-${tab.color}-500/50 shadow-md`
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
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
            <h2 className="text-lg font-bold text-white flex items-center gap-2"><Users className="text-cyan-400" /> Registered Students</h2>
            <span className="text-xs text-slate-400 font-mono bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full">{students.length} Students</span>
          </div>
          {studentsLoading ? (
            <div className="text-center text-slate-400 py-12 text-sm">Loading from Supabase...</div>
          ) : students.length === 0 ? (
            <div className="text-center text-slate-500 py-12 text-sm">No students registered yet. Share the platform link to get enrollments.</div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase font-mono">
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">College</th>
                    <th className="px-4 py-3 text-center">Level</th>
                    <th className="px-4 py-3 text-center">XP</th>
                    <th className="px-4 py-3 text-center">Cases</th>
                    <th className="px-4 py-3 text-center">Streak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {students.map((s, i) => (
                    <tr key={s.id} className={`${i % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900/40'} hover:bg-slate-800/60 transition-colors`}>
                      <td className="px-4 py-3 font-semibold text-white">{s.name || '—'}</td>
                      <td className="px-4 py-3 text-slate-400 font-mono">{s.email || '—'}</td>
                      <td className="px-4 py-3 text-slate-400">{s.college || '—'}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 rounded-full font-mono font-bold">L{s.level ?? 1}</span>
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
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><BookOpen className="text-emerald-400" /> Articles CMS — Publish to Students</h2>

          <form onSubmit={handlePublishArticle} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-emerald-400">Create New Article</h3>
            {articleMsg && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${articleMsg.ok ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300' : 'bg-rose-950 border border-rose-500/40 text-rose-300'}`}>
                {articleMsg.ok ? <CheckCircle size={15} /> : <AlertCircle size={15} />} {articleMsg.text}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 uppercase font-mono mb-1.5">Article Title</label>
                <input type="text" required value={articleForm.title} onChange={e => setArticleForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white" placeholder="e.g. CBNAAT Testing Protocol 2026" />
              </div>
              <div>
                <label className="block text-slate-400 uppercase font-mono mb-1.5">Category</label>
                <select value={articleForm.category} onChange={e => setArticleForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white">
                  {['TB BASICS', 'DIAGNOSIS', 'TREATMENT', 'PREVENTION', 'STATISTICS', 'POLICY', 'NTEP', 'WHO GUIDELINES', 'CLINICAL CASE'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-xs">
              <label className="block text-slate-400 uppercase font-mono mb-1.5">Summary (1 line)</label>
              <input type="text" value={articleForm.summary} onChange={e => setArticleForm(p => ({ ...p, summary: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white" placeholder="Brief summary visible on the dashboard card" />
            </div>
            <div className="text-xs">
              <label className="block text-slate-400 uppercase font-mono mb-1.5">Full Content (one paragraph per line)</label>
              <textarea rows={5} value={articleForm.content} onChange={e => setArticleForm(p => ({ ...p, content: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white resize-none" placeholder="Each line becomes a paragraph in the full article reader..." />
            </div>
            <div className="text-xs">
              <label className="block text-slate-400 uppercase font-mono mb-1.5">Key Highlights (one per line)</label>
              <textarea rows={3} value={articleForm.keyHighlights} onChange={e => setArticleForm(p => ({ ...p, keyHighlights: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white resize-none" placeholder="Each line is a bullet point in Key Takeaways..." />
            </div>
            <button type="submit" disabled={articleSaving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md">
              <Plus size={16} /> {articleSaving ? 'Publishing...' : 'Publish Article to Students'}
            </button>
          </form>

          {/* Published Articles List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase font-mono">Published Articles ({articles.length})</h3>
            {articles.length === 0 ? (
              <p className="text-slate-500 text-xs">No articles published yet.</p>
            ) : articles.map(a => (
              <div key={a.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <span className="text-[10px] text-cyan-400 font-mono uppercase bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">{a.category}</span>
                  <p className="text-sm font-bold text-white truncate">{a.title}</p>
                  <p className="text-[11px] text-slate-400">{a.summary || 'No summary'}</p>
                  <p className="text-[10px] text-slate-600 font-mono">{new Date(a.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => handleDeleteArticle(a.id)} className="p-2 text-rose-400 hover:bg-rose-950/60 rounded-xl cursor-pointer shrink-0">
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
          <h2 className="text-lg font-bold text-white flex items-center gap-2"><AlertCircle className="text-amber-400" /> Announcements — Live Broadcast to Students</h2>

          <form onSubmit={handlePublishAnnouncement} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-amber-400">Create Announcement</h3>
            {announcementMsg && (
              <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${announcementMsg.ok ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300' : 'bg-rose-950 border border-rose-500/40 text-rose-300'}`}>
                {announcementMsg.ok ? <CheckCircle size={15} /> : <AlertCircle size={15} />} {announcementMsg.text}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-400 uppercase font-mono mb-1.5">Title</label>
                <input type="text" required value={announcementForm.title} onChange={e => setAnnouncementForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white" placeholder="e.g. New Clinical Cases Available" />
              </div>
              <div>
                <label className="block text-slate-400 uppercase font-mono mb-1.5">Category</label>
                <select value={announcementForm.category} onChange={e => setAnnouncementForm(p => ({ ...p, category: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white">
                  {['ANNOUNCEMENT', 'URGENT', 'NEW FEATURE', 'MAINTENANCE', 'EVENT', 'SCHOLARSHIP', 'EXAM'].map(c => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="text-xs">
              <label className="block text-slate-400 uppercase font-mono mb-1.5">Message Content</label>
              <textarea rows={4} value={announcementForm.content} onChange={e => setAnnouncementForm(p => ({ ...p, content: e.target.value }))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-white resize-none" placeholder="Full announcement message..." />
            </div>
            <button type="submit" disabled={announcementSaving}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md">
              <Plus size={16} /> {announcementSaving ? 'Broadcasting...' : 'Broadcast to All Students'}
            </button>
          </form>

          {/* Announcements List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase font-mono">Active Announcements ({announcements.length})</h3>
            {announcements.length === 0 ? (
              <p className="text-slate-500 text-xs">No announcements yet.</p>
            ) : announcements.map(a => (
              <div key={a.id} className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <span className="text-[10px] text-amber-400 font-mono uppercase bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">{a.category}</span>
                  <p className="text-sm font-bold text-white">{a.title}</p>
                  <p className="text-xs text-slate-400">{a.content || '—'}</p>
                  <p className="text-[10px] text-slate-600 font-mono">{new Date(a.created_at).toLocaleString()}</p>
                </div>
                <button onClick={() => handleDeleteAnnouncement(a.id)} className="p-2 text-rose-400 hover:bg-rose-950/60 rounded-xl cursor-pointer shrink-0">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Platform Settings */}
      {activeTab === 'settings' && (
        <div className="p-4 sm:p-8 bg-slate-900/80 border border-slate-800 rounded-2xl sm:rounded-3xl space-y-4 sm:space-y-6">
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Settings className="text-purple-400" /> Platform Configuration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs">
            <div>
              <label className="block text-slate-400 uppercase font-mono mb-2">Platform Name</label>
              <input type="text" defaultValue="TB Quest - AI Powered Diagnostic Learning" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs sm:text-sm" />
            </div>
            <div>
              <label className="block text-slate-400 uppercase font-mono mb-2">Default XP Multiplier</label>
              <input type="number" defaultValue="1.0" step="0.1" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs sm:text-sm" />
            </div>
            <div>
              <label className="block text-slate-400 uppercase font-mono mb-2">Passing Score Threshold (%)</label>
              <input type="number" defaultValue="80" min="50" max="100" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs sm:text-sm" />
            </div>
            <div>
              <label className="block text-slate-400 uppercase font-mono mb-2">Max Level</label>
              <input type="number" defaultValue="6" min="1" max="10" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-xs sm:text-sm" />
            </div>
          </div>
          <button onClick={() => alert('Settings saved!')} className="px-6 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-semibold text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)] cursor-pointer">
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
