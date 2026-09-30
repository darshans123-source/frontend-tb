export type ChallengeCategory = 
  | 'symptoms'
  | 'clinicalClues'
  | 'riskFactors'
  | 'patientHistory'
  | 'exposure'
  | 'clinicalReasoning'
  | 'presumptiveTB';

export type SquareType =
  | 'normal'
  | 'learning'
  | 'tb-clue'
  | 'risk-factor'
  | 'exposure'
  | 'clinical-reasoning'
  | 'snake'
  | 'ladder'
  | 'bonus'
  | 'rapid'
  | 'final';

export type LearnerStage =
  | 'TB Learner'
  | 'TB Clue Finder'
  | 'TB Investigator'
  | 'TB Awareness Champion';

export interface BoardSquare {
  number: number;
  type: SquareType;
  label: string;
  category?: ChallengeCategory;
  ladderTo?: number;
  snakeTo?: number;
  zone: 1 | 2 | 3 | 4; // 1: 1-30, 2: 31-60, 3: 61-85, 4: 86-100
  microPearl?: {
    title: string;
    content: string;
    clinicalTip: string;
  };
}

export interface SnakeLadderChallenge {
  id: string;
  category: ChallengeCategory;
  difficulty: 'easy' | 'medium' | 'hard' | 'advanced';
  type: SquareType;
  title: string;
  question: string;
  patientScenario?: {
    age?: number;
    gender?: string;
    occupation?: string;
    complaint?: string;
    duration?: string;
    details?: string;
  };
  options: string[];
  correctIndex: number;
  learning: string; // "💡 WHAT YOU LEARNED"
  whyOthersNotAppropriate: string; // "❌ WHY THE OTHER CHOICE IS NOT APPROPRIATE"
  explanation: string;
  xp: number;
  isRapid?: boolean;
  timeLimitSeconds?: number;
  bonusSteps?: number;
  ladderTo?: number;
  snakeTo?: number;
}

export interface SnakeLadderGameState {
  currentSquare: number;
  xp: number;
  accuracy: number;
  correctAnswers: number;
  wrongAnswers: number;
  totalChallenges: number;
  completedChallenges: string[];
  weakTopics: Record<ChallengeCategory, number>;
  finalChallengePassed: boolean;
  level1Completed: boolean;
  level2Unlocked: boolean;
  gameCompleted: boolean;
  visitedSquares: number[];
  lastRoll: number | null;
  history: string[];
}
