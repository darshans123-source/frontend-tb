import { supabaseData } from './supabaseData';

const LOCAL_STORAGE_KEY_INTRO = 'tbquest_level1_intro_completed';
const LOCAL_STORAGE_KEY_ATTEMPT = 'tbquest_level1_active_attempt';

export interface Level1AttemptState {
  questions: any[];
  currentQuestionIndex: number;
  userAnswers: Record<number, number>;
  visitedQuestions?: number[];
  score: number;
  startTime: number;
  elapsedSeconds: number;
  isCompleted: boolean;
  finalStats?: {
    totalScore: number;
    percentage: number;
    correctCount: number;
    wrongCount: number;
    unansweredCount?: number;
    xpEarned: number;
    badge: string;
    passed: boolean;
    durationSeconds: number;
    questions?: any[];
    userAnswers?: Record<number, number>;
  };
}

class Level1Service {
  /**
   * Check if user completed 100% reading of TB Introduction
   */
  isIntroCompleted(): boolean {
    return localStorage.getItem(LOCAL_STORAGE_KEY_INTRO) === 'true';
  }

  /**
   * Mark TB Introduction reading as 100% completed
   */
  setIntroCompleted(): void {
    localStorage.setItem(LOCAL_STORAGE_KEY_INTRO, 'true');
  }

  /**
   * Save active quiz attempt to LocalStorage for resilience
   */
  saveActiveAttempt(state: Level1AttemptState): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_ATTEMPT, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to auto-save Level 1 attempt:', e);
    }
  }

  /**
   * Retrieve active saved quiz attempt from LocalStorage if present
   */
  loadActiveAttempt(): Level1AttemptState | null {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY_ATTEMPT);
      if (!data) return null;
      const state = JSON.parse(data) as Level1AttemptState;
      if (state && state.questions && !state.isCompleted) {
        return state;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Clear active attempt state from LocalStorage upon quiz completion or reset
   */
  clearActiveAttempt(): void {
    localStorage.removeItem(LOCAL_STORAGE_KEY_ATTEMPT);
  }

  /**
   * Sync completed quiz results to Supabase profile, quiz_results, & achievements
   */
  async syncCompletedResultToSupabase(
    userId: string | null | undefined,
    stats: {
      totalScore: number;
      percentage: number;
      correctCount: number;
      wrongCount: number;
      xpEarned: number;
      badge: string;
      passed: boolean;
      durationSeconds: number;
    }
  ): Promise<void> {
    if (!userId) return;

    try {
      // 1. Save Quiz Result
      await supabaseData.saveQuizResult(
        userId,
        'level1-quiz',
        stats.totalScore,
        stats.xpEarned,
        stats.durationSeconds
      );

      // 2. Fetch existing profile to update XP & Level
      const existingProfile = await supabaseData.fetchUserProfile(userId);
      const currentXp = existingProfile?.xp || 0;
      const currentLevel = existingProfile?.level || 1;
      const newXp = currentXp + stats.xpEarned;
      const newLevel = stats.passed ? Math.max(2, currentLevel) : currentLevel;

      await supabaseData.updateUserProfile(userId, {
        xp: newXp,
        level: newLevel,
        completed_cases: (existingProfile?.completed_cases || 0) + 1,
        accuracy: Math.round(((existingProfile?.accuracy || 0) + stats.percentage) / 2)
      });

      // 3. Save achievement badge if passed
      if (stats.passed && stats.badge) {
        await supabaseData.saveAchievement(userId, `Level 1: ${stats.badge}`);
      }
    } catch (e) {
      console.warn('Level1Service Supabase sync error:', e);
    }
  }
}

export const level1Service = new Level1Service();
