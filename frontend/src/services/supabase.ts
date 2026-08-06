import { createClient } from '@supabase/supabase-js';

// Safely access environment variables across Vite & Node
const env = (import.meta as any).env || (typeof process !== 'undefined' ? process.env : {}) || {};

const supabaseUrl = env.VITE_SUPABASE_URL || 'https://ulhpwvoehhuecddbjohs.supabase.co';
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Rf3z8gCm1vpYRoKXxerCyQ__3UyWAJg';

// Export Centralized Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

// Database Types for Supabase Tables
export interface ProfileTable {
  id: string;
  full_name?: string;
  name?: string;
  email?: string;
  role?: 'student' | 'faculty' | 'admin';
  avatar_url?: string;
  xp?: number;
  level?: number;
  total_quizzes?: number;
  correct_answers?: number;
  wrong_answers?: number;
  unanswered?: number;
  progress_percentage?: number;
  current_question?: number;
  current_quiz_id?: string;
  last_activity?: string;
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
  created_at?: string;
  updated_at?: string;
}

export interface QuizAttemptTable {
  id: string;
  user_id: string;
  quiz_id?: string;
  score?: number;
  correct_answers?: number;
  wrong_answers?: number;
  unanswered?: number;
  xp_earned?: number;
  completed?: boolean;
  started_at?: string;
  completed_at?: string;
}

export interface QuizAnswerTable {
  id?: string;
  attempt_id: string;
  question_number: number;
  selected_option: string;
  correct: boolean;
  answered: boolean;
  created_at?: string;
}

export interface XPHistoryTable {
  id?: string;
  user_id: string;
  reason: string;
  xp: number;
  created_at?: string;
}

export interface LevelTable {
  level: number;
  min_xp: number;
  max_xp: number;
}
