import { supabase } from './supabase';
import { LeaderboardEntry, CertificateData } from '../types';

export interface UserModuleProgressRecord {
  module_id: string;
  completed: boolean;
  score: number;
}

export interface UserDataAggregate {
  profile: any;
  achievements: string[];
  bookmarks: string[];
  moduleProgress: UserModuleProgressRecord[];
  certificates: any[];
  quizResults: any[];
}

class SupabaseDataService {
  /**
   * Fetch User Profile from Supabase `profiles` table
   */
  async fetchUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Supabase fetchUserProfile note:', error.message);
      }
      return data || null;
    } catch (e) {
      console.warn('Supabase profile fetch error:', e);
      return null;
    }
  }

  /**
   * Create or Update User Profile in Supabase
   */
  async updateUserProfile(userId: string, updates: Record<string, any>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          ...updates,
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) console.warn('Supabase updateUserProfile note:', error.message);
      return data;
    } catch (e) {
      console.warn('Supabase profile update error:', e);
      return null;
    }
  }

  /**
   * Calculate and award XP automatically based on activity type, update level, and sync with Supabase `profiles`
   */
  async awardXP(
    userId: string,
    activityType: 'module' | 'quiz' | 'case' | 'daily_login' | 'perfect_quiz' | 'level_complete',
    score: number = 0
  ) {
    let gainedXp = 0;
    if (activityType === 'module') gainedXp = 20;
    else if (activityType === 'quiz') gainedXp = score === 100 ? 80 : 50; // +50 XP or +80 for perfect quiz
    else if (activityType === 'case') gainedXp = 100;
    else if (activityType === 'daily_login') gainedXp = 10;
    else if (activityType === 'perfect_quiz') gainedXp = 30;
    else if (activityType === 'level_complete') gainedXp = 200;

    const currentProfile = await this.fetchUserProfile(userId);
    const currentXp = currentProfile?.xp || 0;
    const newXp = currentXp + gainedXp;
    const newLevel = Math.floor(newXp / 500) + 1;

    const updates: Record<string, any> = {
      xp: newXp,
      level: newLevel,
      updated_at: new Date().toISOString()
    };

    if (activityType === 'module') {
      updates.completed_modules = (currentProfile?.completed_modules || 0) + 1;
    } else if (activityType === 'quiz') {
      updates.completed_quizzes = (currentProfile?.completed_quizzes || 0) + 1;
    } else if (activityType === 'case') {
      updates.completed_cases = (currentProfile?.completed_cases || 0) + 1;
    }

    const updatedProfile = await this.updateUserProfile(userId, updates);
    return { gainedXp, newXp, newLevel, updatedProfile };
  }


  /**
   * Fetch Realtime Leaderboard from Supabase `profiles`
   */
  async fetchLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, xp, completed_cases, accuracy')
        .order('xp', { ascending: false })
        .limit(20);

      if (error || !data || data.length === 0) {
        return [];
      }

      return data.map((item, idx) => ({
        rank: idx + 1,
        name: item.name || 'Anonymous Doctor',
        score: item.xp || 0,
        xp: item.xp || 0,
        badges: Math.floor((item.completed_cases || 0) / 3),
        accuracy: item.accuracy || 0,
        institution: 'Skill Development Center, NIT Raichur'
      }));
    } catch (e) {
      return [];
    }
  }

  /**
   * Subscribe to Realtime Leaderboard updates
   */
  subscribeLeaderboard(onUpdate: (entries: LeaderboardEntry[]) => void) {
    const channel = supabase
      .channel('public:profiles')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        async () => {
          const freshData = await this.fetchLeaderboard();
          onUpdate(freshData);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // ==========================================
  // LIVE DASHBOARD CARDS CRUD (SUPABASE TABLE: `dashboard_cards`)
  // ==========================================

  async fetchDashboardCards(): Promise<Record<string, any>> {
    try {
      const { data, error } = await supabase
        .from('dashboard_cards')
        .select('*');

      if (error || !data || data.length === 0) return {};
      const cardMap: Record<string, any> = {};
      data.forEach(item => {
        cardMap[item.id] = {
          id: item.id,
          title: item.title,
          category: item.category || 'Community Support',
          description: item.description || '',
          imageUrl: item.image_url || '',
          btnText: item.btn_text || 'READ ARTICLE',
          btnLink: item.btn_link || ''
        };
      });
      return cardMap;
    } catch (e) {
      return {};
    }
  }

  async fetchDashboardCardById(id: string) {
    try {
      const { data, error } = await supabase
        .from('dashboard_cards')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) return null;
      return {
        id: data.id,
        title: data.title,
        category: data.category,
        description: data.description,
        imageUrl: data.image_url,
        btnText: data.btn_text,
        btnLink: data.btn_link
      };
    } catch (e) {
      return null;
    }
  }

  async upsertDashboardCard(card: { id: string; title: string; category?: string; description?: string; imageUrl?: string; btnText?: string; btnLink?: string }) {
    try {
      const { data, error } = await supabase
        .from('dashboard_cards')
        .upsert({
          id: card.id,
          title: card.title,
          category: card.category || 'Community Support',
          description: card.description || '',
          image_url: card.imageUrl || '',
          btn_text: card.btnText || 'READ ARTICLE',
          btn_link: card.btnLink || '',
          updated_at: new Date().toISOString()
        })
        .select();

      if (error) console.warn('Supabase upsertDashboardCard note:', error.message);
      return data;
    } catch (e) {
      return null;
    }
  }

  async deleteDashboardCardImage(id: string) {
    try {
      const { data, error } = await supabase
        .from('dashboard_cards')
        .update({
          image_url: '',
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select();

      if (error) console.warn('Supabase deleteDashboardCardImage note:', error.message);
      return data;
    } catch (e) {
      return null;
    }
  }

  subscribeDashboardCards(onUpdate: (cards: Record<string, any>) => void) {
    const channel = supabase
      .channel('public:dashboard_cards')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'dashboard_cards' },
        async () => {
          const fresh = await this.fetchDashboardCards();
          onUpdate(fresh);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // ==========================================
  // LIVE NEWS CRUD (SUPABASE TABLE: `news`)
  // ==========================================

  async fetchLiveNews() {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data.map((item) => ({
        id: item.id,
        text: item.text,
        description: item.description || '',
        priority: item.priority || 'normal',
        category: item.category || 'National Health Mission',
        imageUrl: item.image_url,
        isPublished: item.is_published ?? true,
        createdAt: item.created_at?.split('T')[0] || '2026-08-04'
      }));
    } catch (e) {
      return [];
    }
  }

  async insertNewsItem(item: any) {
    try {
      const { data, error } = await supabase
        .from('news')
        .insert({
          id: item.id,
          text: item.text,
          description: item.description,
          priority: item.priority,
          category: item.category,
          image_url: item.imageUrl,
          is_published: item.isPublished,
          created_at: new Date().toISOString()
        })
        .select();

      if (error) console.warn('Supabase insertNewsItem note:', error.message);
      return data;
    } catch (e) {
      return null;
    }
  }

  async updateNewsItem(id: string, updates: any) {
    try {
      const { data, error } = await supabase
        .from('news')
        .update({
          text: updates.text,
          description: updates.description,
          priority: updates.priority,
          category: updates.category,
          image_url: updates.imageUrl,
          is_published: updates.isPublished
        })
        .eq('id', id);

      if (error) console.warn('Supabase updateNewsItem note:', error.message);
      return data;
    } catch (e) {
      return null;
    }
  }

  async deleteNewsItem(id: string) {
    try {
      const { data, error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) console.warn('Supabase deleteNewsItem note:', error.message);
      return data;
    } catch (e) {
      return null;
    }
  }

  subscribeNews(onUpdate: (newsItems: any[]) => void) {
    const channel = supabase
      .channel('public:news')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'news' },
        async () => {
          const fresh = await this.fetchLiveNews();
          onUpdate(fresh);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // ==========================================
  // LIVE TB FACTS CRUD (SUPABASE TABLE: `tb_facts`)
  // ==========================================

  async fetchLiveTBFacts() {
    try {
      const { data, error } = await supabase
        .from('tb_facts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data.map((item) => ({
        id: item.id,
        factText: item.fact_text,
        category: item.category || 'Diagnostic Standard',
        scheduleDate: item.schedule_date || '2026-08-04'
      }));
    } catch (e) {
      return [];
    }
  }

  async insertTBFact(fact: any) {
    try {
      const { data, error } = await supabase
        .from('tb_facts')
        .insert({
          id: fact.id,
          fact_text: fact.factText,
          category: fact.category,
          schedule_date: fact.scheduleDate || new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString()
        });

      if (error) console.warn('Supabase insertTBFact note:', error.message);
      return data;
    } catch (e) {
      return null;
    }
  }

  async deleteTBFact(id: string) {
    try {
      const { data, error } = await supabase
        .from('tb_facts')
        .delete()
        .eq('id', id);

      if (error) console.warn('Supabase deleteTBFact note:', error.message);
      return data;
    } catch (e) {
      return null;
    }
  }

  // ==========================================
  // LIVE MODULES CRUD (SUPABASE TABLE: `learning_modules`)
  // ==========================================

  async fetchLiveModules() {
    try {
      const { data, error } = await supabase
        .from('learning_modules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data.map((m) => ({
        id: m.id,
        title: m.title,
        category: m.category,
        xpReward: m.xp_reward || 100,
        badgeName: m.badge_name || 'TB Diagnostician',
        isLocked: m.is_locked ?? false,
        description: m.description || '',
        pdfUrl: m.pdf_url,
        videoUrl: m.video_url
      }));
    } catch (e) {
      return [];
    }
  }

  async insertModule(mod: any) {
    try {
      const { data, error } = await supabase
        .from('learning_modules')
        .insert({
          id: mod.id,
          title: mod.title,
          category: mod.category,
          xp_reward: mod.xpReward,
          badge_name: mod.badgeName,
          is_locked: mod.isLocked,
          description: mod.description,
          pdf_url: mod.pdfUrl,
          video_url: mod.videoUrl,
          created_at: new Date().toISOString()
        });

      if (error) console.warn('Supabase insertModule note:', error.message);
      return data;
    } catch (e) {
      return null;
    }
  }

  async deleteModule(id: string) {
    try {
      const { data, error } = await supabase
        .from('learning_modules')
        .delete()
        .eq('id', id);

      if (error) console.warn('Supabase deleteModule note:', error.message);
      return data;
    } catch (e) {
      return null;
    }
  }

  // ==========================================
  // LIVE CLINICAL CASES CRUD (SUPABASE TABLE: `clinical_cases`)
  // ==========================================

  async fetchLiveCases() {
    try {
      const { data, error } = await supabase
        .from('clinical_cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data.map((c) => ({
        id: c.id,
        patientName: c.patient_name,
        age: c.age,
        gender: c.gender,
        symptoms: c.symptoms || '',
        history: c.history || '',
        vitals: c.vitals || '',
        cxrResult: c.cxr_result || '',
        cbnaatResult: c.cbnaat_result || '',
        smearResult: c.smear_result || '',
        diagnosis: c.diagnosis,
        treatment: c.treatment || '',
        difficulty: c.difficulty || 'Medium',
        xpReward: c.xp_reward || 200
      }));
    } catch (e) {
      return [];
    }
  }

  async insertCase(cs: any) {
    try {
      const { data, error } = await supabase
        .from('clinical_cases')
        .insert({
          id: cs.id,
          patient_name: cs.patientName,
          age: cs.age,
          gender: cs.gender,
          symptoms: cs.symptoms,
          history: cs.history,
          vitals: cs.vitals,
          cxr_result: cs.cxrResult,
          cbnaat_result: cs.cbnaatResult,
          smear_result: cs.smearResult,
          diagnosis: cs.diagnosis,
          treatment: cs.treatment,
          difficulty: cs.difficulty,
          xp_reward: cs.xpReward,
          created_at: new Date().toISOString()
        });

      if (error) console.warn('Supabase insertCase note:', error.message);
      return data;
    } catch (e) {
      return null;
    }
  }

  async deleteCase(id: string) {
    try {
      const { data, error } = await supabase
        .from('clinical_cases')
        .delete()
        .eq('id', id);

      if (error) console.warn('Supabase deleteCase note:', error.message);
      return data;
    } catch (e) {
      return null;
    }
  }

  // ==========================================
  // USER METRICS & ATTACHMENTS
  // ==========================================

  async saveQuizResult(userId: string, caseType: string, score: number, xpGained: number, durationSeconds: number = 0) {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .insert({
          user_id: userId,
          case_type: caseType,
          score,
          xp_gained: xpGained,
          duration_seconds: durationSeconds,
          created_at: new Date().toISOString()
        });

      if (error) console.warn('Supabase saveQuizResult note:', error.message);
      return data;
    } catch (e) {
      return null;
    }
  }

  async fetchQuizResults(userId: string) {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data;
    } catch (e) {
      return [];
    }
  }

  async saveAchievement(userId: string, badgeName: string) {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          badge_name: badgeName,
          earned_at: new Date().toISOString()
        });

      if (error) console.warn('Supabase saveAchievement note:', error.message);
      return data;
    } catch (e) {
      return null;
    }
  }

  async fetchAchievements(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select('badge_name')
        .eq('user_id', userId);

      if (error || !data) return [];
      return data.map(item => item.badge_name);
    } catch (e) {
      return [];
    }
  }

  async addBookmark(userId: string, caseId: string) {
    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .insert({
          user_id: userId,
          case_id: caseId,
          created_at: new Date().toISOString()
        });

      if (error) console.warn('Supabase addBookmark note:', error.message);
      return data;
    } catch (e) {
      return null;
    }
  }

  async removeBookmark(userId: string, caseId: string) {
    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .delete()
        .eq('user_id', userId)
        .eq('case_id', caseId);

      if (error) console.warn('Supabase removeBookmark note:', error.message);
      return data;
    } catch (e) {
      return null;
    }
  }

  async fetchBookmarks(userId: string): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('case_id')
        .eq('user_id', userId);

      if (error || !data) return [];
      return data.map(item => item.case_id);
    } catch (e) {
      return [];
    }
  }

  async fetchModuleProgress(userId: string): Promise<UserModuleProgressRecord[]> {
    try {
      const { data, error } = await supabase
        .from('user_module_progress')
        .select('module_id, completed, score')
        .eq('user_id', userId);

      if (error || !data) return [];
      return data.map(item => ({
        module_id: item.module_id,
        completed: item.completed ?? false,
        score: item.score ?? 0
      }));
    } catch (e) {
      return [];
    }
  }

  async saveModuleProgress(userId: string, moduleId: string, completed: boolean, score: number) {
    try {
      const { data, error } = await supabase
        .from('user_module_progress')
        .upsert({
          user_id: userId,
          module_id: moduleId,
          completed,
          score,
          updated_at: new Date().toISOString()
        });

      if (error) console.warn('Supabase saveModuleProgress note:', error.message);
      return data;
    } catch (e) {
      return null;
    }
  }

  async saveCertificate(userId: string, cert: CertificateData) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .insert({
          user_id: userId,
          certificate_id: cert.certificateId,
          student_name: cert.studentName,
          total_xp: cert.totalXp,
          cases_mastered: cert.casesMastered,
          accuracy: cert.accuracy,
          issue_date: cert.issueDate,
          created_at: new Date().toISOString()
        });

      if (error) console.warn('Supabase saveCertificate note:', error.message);
      return data;
    } catch (e) {
      return null;
    }
  }

  async fetchCertificates(userId: string) {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error || !data) return [];
      return data;
    } catch (e) {
      return [];
    }
  }

  async fetchUserData(userId: string): Promise<UserDataAggregate> {
    const [profile, achievements, bookmarks, moduleProgress, certificates, quizResults] = await Promise.all([
      this.fetchUserProfile(userId),
      this.fetchAchievements(userId),
      this.fetchBookmarks(userId),
      this.fetchModuleProgress(userId),
      this.fetchCertificates(userId),
      this.fetchQuizResults(userId)
    ]);

    return {
      profile,
      achievements,
      bookmarks,
      moduleProgress,
      certificates,
      quizResults
    };
  }
}

export const supabaseData = new SupabaseDataService();
