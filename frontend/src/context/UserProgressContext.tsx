import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProgressData {
  xp: number;
  level: number;
  correct: number;
  wrong: number;
  remaining: number;
  answered: number;
  progress: number;
  quizCompleted: boolean;
  lastActivity: string;
  miniGameUnlocked: boolean;
}

export const STORAGE_KEY = 'tbquest_user_progress';

export const DEFAULT_PROGRESS: UserProgressData = {
  xp: 0,
  level: 1,
  correct: 0,
  wrong: 0,
  remaining: 50,
  answered: 0,
  progress: 0,
  quizCompleted: false,
  lastActivity: '',
  miniGameUnlocked: false
};

interface ProgressContextType {
  progressData: UserProgressData;
  recordQuestionAnswer: (isCorrect: boolean) => void;
  resetProgress: () => void;
  unlockMiniGame: () => void;
  completeQuiz: () => void;
  setProgressData: React.Dispatch<React.SetStateAction<UserProgressData>>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progressData, setProgressData] = useState<UserProgressData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_PROGRESS,
          ...parsed
        };
      }
    } catch (e) {
      console.warn('Error reading user progress from localStorage:', e);
    }
    return DEFAULT_PROGRESS;
  });

  // Save to localStorage whenever progressData updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
    } catch (e) {
      console.warn('Error saving user progress to localStorage:', e);
    }
  }, [progressData]);

  // Requirement 2 & 3: Every correct answer (+2 XP, +1 Correct, +1 Answered, -1 Remaining, Progress = (Answered/50)*100)
  const recordQuestionAnswer = (isCorrect: boolean) => {
    setProgressData(prev => {
      const newXp = isCorrect ? prev.xp + 2 : prev.xp;
      const newCorrect = isCorrect ? prev.correct + 1 : prev.correct;
      const newWrong = isCorrect ? prev.wrong : prev.wrong + 1;
      const newAnswered = prev.answered + 1;
      const newRemaining = Math.max(0, 50 - newAnswered);
      const newProgress = Math.min(100, Math.round((newAnswered / 50) * 100));

      // Requirement 4: Calculate level (Level 1 = 0-99 XP)
      const newLevel = Math.floor(newXp / 100) + 1;

      // Requirement 8: When 50 questions completed
      const isQuizDone = newAnswered >= 50;

      const updated: UserProgressData = {
        ...prev,
        xp: newXp,
        level: newLevel,
        correct: newCorrect,
        wrong: newWrong,
        answered: newAnswered,
        remaining: newRemaining,
        progress: newProgress,
        quizCompleted: isQuizDone || prev.quizCompleted,
        miniGameUnlocked: isQuizDone || prev.miniGameUnlocked,
        lastActivity: new Date().toISOString()
      };

      if (isQuizDone) {
        localStorage.setItem('tbquest_level1_quiz_passed', 'true');
      }

      return updated;
    });
  };

  const unlockMiniGame = () => {
    setProgressData(prev => ({ ...prev, miniGameUnlocked: true }));
    localStorage.setItem('tbquest_level1_quiz_passed', 'true');
  };

  const completeQuiz = () => {
    setProgressData(prev => ({
      ...prev,
      progress: 100,
      quizCompleted: true,
      miniGameUnlocked: true,
      lastActivity: new Date().toISOString()
    }));
    localStorage.setItem('tbquest_level1_quiz_passed', 'true');
  };

  const resetProgress = () => {
    setProgressData(DEFAULT_PROGRESS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ProgressContext.Provider value={{ progressData, recordQuestionAnswer, resetProgress, unlockMiniGame, completeQuiz, setProgressData }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useUserProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    // Return safe fallback if used outside provider
    return {
      progressData: DEFAULT_PROGRESS,
      recordQuestionAnswer: () => {},
      resetProgress: () => {},
      unlockMiniGame: () => {},
      completeQuiz: () => {},
      setProgressData: () => {}
    };
  }
  return context;
};
