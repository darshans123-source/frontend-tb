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

export interface SnakeLadderProgress {
  currentSquare: number;
  score: number;
  xp: number;
  accuracy: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalAnswered: number;
  completed: boolean;
  completedQuestionIds: string[];
  missedQuestionIds: string[];
  lastPlayedAt: string;
}

// Add to Level1Service: Snake & Ladders Supabase progress sync.
// All calls are best-effort and never throw: when the
// snake_ladder_progress table has not been migrated yet (or the player is
// a PIN student with no auth.users row), the game keeps working from
// localStorage and reports the save as unavailable.
export async function saveSnakeProgressToSupabase(
  userId: string | null | undefined,
  state: SnakeLadderProgress
): Promise<boolean> {
  if (!userId) return false;
  try {
    const ok = await supabaseData.saveSnakeProgress(userId, {
      currentSquare: state.currentSquare,
      score: state.score,
      xp: state.xp,
      accuracy: state.accuracy,
      correctAnswers: state.correctAnswers,
      wrongAnswers: state.wrongAnswers,
      questionsAnswered: state.totalAnswered,
      completed: state.completed,
      completedQuestionIds: state.completedQuestionIds,
      missedQuestionIds: state.missedQuestionIds,
      lastPlayedAt: new Date().toISOString()
    });
    // Mirror the headline result into the existing tables so the dashboard
    // and module progress stay consistent with the board game.
    if (ok) {
      await supabaseData.saveModuleProgress(userId, 'level1-snake', state.completed, state.score);
    }
    return ok;
  } catch (e) {
    return false;
  }
}

export async function loadSnakeProgressFromSupabase(
  userId: string | null | undefined
): Promise<SnakeLadderProgress | null> {
  if (!userId) return null;
  try {
    const row = await supabaseData.loadSnakeProgress(userId);
    if (!row) return null;
    return {
      currentSquare: row.current_square ?? 1,
      score: row.score ?? 0,
      xp: row.xp ?? 0,
      accuracy: row.accuracy ?? 0,
      correctAnswers: row.correct_answers ?? 0,
      wrongAnswers: row.wrong_answers ?? 0,
      totalAnswered: row.questions_answered ?? 0,
      completed: row.completed ?? false,
      completedQuestionIds: Array.isArray(row.completed_question_ids) ? row.completed_question_ids : [],
      missedQuestionIds: Array.isArray(row.missed_question_ids) ? row.missed_question_ids : [],
      lastPlayedAt: row.last_played_at ?? ''
    };
  } catch (e) {
    return null;
  }
}

/**
 * Save a finished Snake & Ladders run to Supabase: quiz result row, the
 * snake progress row, the completion achievement, and the profile
 * (XP + level). Existing behaviour preserved: +500 XP completion reward
 * and Level 2 unlock when the student passed (20+ correct answers).
 */
export async function syncSnakeCompletionToSupabase(
  userId: string | null | undefined,
  state: SnakeLadderProgress,
  durationSeconds: number
): Promise<void> {
  if (!userId) return;
  try {
    await supabaseData.saveQuizResult(userId, 'level1-snake', state.score, state.xp, durationSeconds);
    await saveSnakeProgressToSupabase(userId, state);
    if (state.completed && state.correctAnswers >= 20) {
      await supabaseData.saveAchievement(userId, 'Level 1: TB Awareness Champion');
      const existingProfile = await supabaseData.fetchUserProfile(userId);
      // Same as the previous inline behaviour: profile XP becomes the
      // game's XP plus the +500 completion reward.
      await supabaseData.updateUserProfile(userId, {
        xp: state.xp + 500,
        level: Math.max(2, existingProfile?.level || 1),
        completed_cases: (existingProfile?.completed_cases || 0) + 1,
        accuracy: state.accuracy
      });
    }
  } catch (e) {
    console.warn('Snake completion Supabase sync error:', e);
  }
}

export const level1Service = new Level1Service();
