import { supabase } from './supabase';
import { supabaseData } from './supabaseData';
import { Level1Question, getStoredQuestionBank, saveStoredQuestionBank } from '../data/level1QuestionBank';


export interface HeroConfig {
  welcomeTitle: string;
  welcomeSubtitle: string;
  description: string;
  btnLearnText: string;
  btnExploreText: string;
  btnPracticeText: string;
  btnApplyText: string;
  footerText: string;
  heroImageUrl: string;
}

export interface NewsItemConfig {
  id: string;
  text: string;
  description?: string;
  priority: 'high' | 'normal' | 'low';
  category: string;
  imageUrl?: string;
  isPublished: boolean;
  createdAt?: string;
}

export interface PlatformSettings {
  instituteName: string;
  instituteLogoUrl: string;
  tbQuestLogoUrl: string;
  themeMode: 'light' | 'dark' | 'system';
  primaryColor: string;
  footerCopyright: string;
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
  socialLinkedin: string;
  adminEmail: string;
}

class AdminService {
  private STORAGE_KEY_HERO = 'tb_quest_admin_hero';
  private STORAGE_KEY_NEWS = 'tb_quest_admin_news';
  private STORAGE_KEY_SETTINGS = 'tb_quest_admin_settings';

  getHeroConfig(): HeroConfig {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY_HERO);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return {
      welcomeTitle: 'Welcome to TB Quest',
      welcomeSubtitle: 'An Interactive Gamified Learning Platform for TB Diagnostic Education',
      description: 'Master pulmonary and pediatric tuberculosis clinical algorithms, interpret Diagnostic GeneXpert & CBNAAT tests, and solve realistic clinical cases.',
      btnLearnText: 'Learn',
      btnExploreText: 'Explore',
      btnPracticeText: 'Practice',
      btnApplyText: 'Apply',
      footerText: 'Your learning journey begins here.',
      heroImageUrl: ''
    };
  }

  saveHeroConfig(config: HeroConfig): void {
    localStorage.setItem(this.STORAGE_KEY_HERO, JSON.stringify(config));
  }

  getNewsItems(): NewsItemConfig[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY_NEWS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return [
      {
        id: '1',
        text: 'TB MUKT BHARAT ABHIYAN 2026',
        description: 'National campaign for ending tuberculosis in India by 2026 with intensified active case finding.',
        priority: 'high',
        category: 'National Health Mission',
        imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=300&q=80',
        isPublished: true,
        createdAt: '2026-08-04'
      },
      {
        id: '2',
        text: 'EARLY DETECTION (CBNAAT / TRUENAT)',
        description: 'Automated rapid molecular diagnostic testing for M. tuberculosis and rifampicin resistance.',
        priority: 'high',
        category: 'Diagnostic Guidelines',
        imageUrl: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=300&q=80',
        isPublished: true,
        createdAt: '2026-08-03'
      }
    ];
  }

  async saveNewsItems(items: NewsItemConfig[]): Promise<void> {
    localStorage.setItem(this.STORAGE_KEY_NEWS, JSON.stringify(items));
    for (const item of items) {
      await supabaseData.insertNewsItem(item);
    }
  }

  getSettings(): PlatformSettings {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    return {
      instituteName: 'Navodaya Institute of Technology, Raichur',
      instituteLogoUrl: '',
      tbQuestLogoUrl: '',
      themeMode: 'light',
      primaryColor: '#2563eb',
      footerCopyright: 'Copyright © 2026 TB Quest',
      socialFacebook: 'https://facebook.com',
      socialInstagram: 'https://instagram.com',
      socialYoutube: 'https://youtube.com',
      socialLinkedin: 'https://linkedin.com',
      adminEmail: 'admin@nitraichur.ac.in'
    };
  }

  saveSettings(settings: PlatformSettings): void {
    localStorage.setItem(this.STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }

  /**
   * Upload file directly to Supabase Storage public bucket (`dashboard-images` or `tb-assets`)
   */
  async uploadFile(file: File, folder: string = 'dashboard', maxMb: number = 10, bucketName: string = 'dashboard-images'): Promise<string | null> {
    try {
      if (file.size > maxMb * 1024 * 1024) {
        alert(`File size exceeds maximum limit of ${maxMb} MB.`);
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${folder}/${fileName}`;

      // 1. Upload to specified bucket (default: `dashboard-images`)
      let { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (error) {
        // Fallback to tb-assets bucket
        const res = await supabase.storage
          .from('tb-assets')
          .upload(filePath, file);
        data = res.data;
        error = res.error;
        if (!error) {
          bucketName = 'tb-assets';
        }
      }

      if (error) {
        console.warn('Supabase storage note:', error.message);
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (e) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }

  /**
   * Question Bank Management Methods (Level 1)
   */
  getQuestionBank() {
    return getStoredQuestionBank();
  }

  saveQuestionBank(questions: Level1Question[]) {
    saveStoredQuestionBank(questions);
  }

  addQuestion(newQuestion: Level1Question) {
    const bank = getStoredQuestionBank();
    const updated = [newQuestion, ...bank];
    saveStoredQuestionBank(updated);
    return updated;
  }

  updateQuestion(id: string, updatedQ: Partial<Level1Question>) {
    const bank = getStoredQuestionBank();
    const updated = bank.map(q => q.id === id ? { ...q, ...updatedQ } : q);
    saveStoredQuestionBank(updated);
    return updated;
  }

  deleteQuestion(id: string) {
    const bank = getStoredQuestionBank();
    const updated = bank.filter(q => q.id !== id);
    saveStoredQuestionBank(updated);
    return updated;
  }

  importQuestions(jsonString: string): { success: boolean; count: number; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!Array.isArray(parsed)) {
        return { success: false, count: 0, message: 'Invalid JSON format. Expected an array of questions.' };
      }
      const existing = getStoredQuestionBank();
      const merged = [...parsed, ...existing];
      saveStoredQuestionBank(merged);
      return { success: true, count: parsed.length, message: `Successfully imported ${parsed.length} questions.` };
    } catch (e: any) {
      return { success: false, count: 0, message: `Failed to parse JSON: ${e.message}` };
    }
  }

  exportQuestions(): string {
    const bank = getStoredQuestionBank();
    return JSON.stringify(bank, null, 2);
  }
}

export const adminService = new AdminService();

