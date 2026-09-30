import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Activity,
  Award,
  ChevronRight,
  Lock,
  Unlock,
  BookOpen,
  Info,
  Layers,
  Zap,
  RotateCw,
  Check,
  X,
  Stethoscope,
  HeartPulse
} from 'lucide-react';
import {
  LEVEL1_25_CLINICAL_QUESTIONS,
  Level1ClinicalQuestion,
  getChallengeForSquareNumber,
  getChallengeById,
  CATEGORY_TOTALS,
  CATEGORY_LABELS
} from '../../data/level1_25_questions';
import {
  LADDERS,
  SNAKES,
  getLearnerStage,
  getLearnerStageDetails
} from '../../data/snakeLadderData';
import { ChallengeCategory } from '../../types/snakeLadder';
import { soundService } from '../../services/soundService';
import { supabaseData } from '../../services/supabaseData';
import Level1HowToPlayModal from './Level1HowToPlayModal';

interface SnakeLadderGameProps {
  currentUserId?: string | null;
  onProceedToLevel2?: () => void;
  onBackToDashboard?: () => void;
  onUnlockLevel1?: () => void;
}

const STORAGE_KEY = 'tbquest_snake_ladder_progress_v4';

interface SavedGameState {
  currentSquare: number;
  score: number; // Marks: max 250 (correctAnswers * 10)
  xp: number;
  accuracy: number; // (correctAnswers / 25) * 100
  correctAnswers: number;
  wrongAnswers: number;
  totalAnswered: number;
  completedQuestionIds: string[];
  missedQuestionIds: string[];
  userAnswers: Record<string, { selectedIndex: number; isCorrect: boolean }>;
  finalChallengePassed: boolean;
  gameCompleted: boolean;
  level2Unlocked: boolean;
  visitedSquares: number[];
  lastRoll: number | null;
}

const INITIAL_STATE: SavedGameState = {
  currentSquare: 1,
  score: 0,
  xp: 0,
  accuracy: 100,
  correctAnswers: 0,
  wrongAnswers: 0,
  totalAnswered: 0,
  completedQuestionIds: [],
  missedQuestionIds: [],
  userAnswers: {},
  finalChallengePassed: false,
  gameCompleted: false,
  level2Unlocked: false,
  visitedSquares: [1],
  lastRoll: null
};

// Automatic ladders & snakes without questions
const AUTOMATIC_LADDERS: Record<number, { to: number; title: string; xp: number }> = {
  9: { to: 22, title: 'TB KNOWLEDGE BOOST', xp: 10 }
};

const AUTOMATIC_SNAKES: Record<number, { to: number; title: string }> = {
  96: { to: 72, title: 'CLINICAL CLUE MISSED' }
};

// Detailed descriptions for ladder accelerations
const LADDER_REASONS: Record<number, string> = {
  4: 'Early Sputum Acid-Fast Recognition',
  9: 'TB Knowledge Boost • Healthy Lung Awareness',
  12: 'Airborne Aerosol Containment Protocol',
  25: 'Prompt Hemoptysis Recognition & Diagnostic Triage',
  37: 'Molecular CBNAAT Rifampicin Resistance Detection',
  54: 'Pre-Biologic Immunosuppressive TB Screening',
  69: 'Airborne Droplet Nuclei Containment Adherence',
  78: 'Prioritizing Cardinal Signs Over Distractors'
};

// Detailed descriptions for snake pitfalls
const SNAKE_REASONS: Record<number, string> = {
  28: 'Overlooked Cervical Scrofula Clue',
  44: 'Dismissed Diabetes Comorbidity Risk Factor',
  62: 'Ignored Intimate Household Exposure Contact',
  74: 'Sub-Standard Mask Leakage in Airborne Isolation Ward',
  88: 'Inappropriate Therapy Cessation for Benign Drug Tinting',
  96: 'Clinical Clue Missed • Returning for Reinforcement'
};

export default function SnakeLadderGame({
  currentUserId,
  onProceedToLevel2,
  onBackToDashboard,
  onUnlockLevel1
}: SnakeLadderGameProps) {
  // Game State
  const [gameState, setGameState] = useState<SavedGameState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STATE,
          ...parsed,
          completedQuestionIds: Array.isArray(parsed.completedQuestionIds) ? parsed.completedQuestionIds : [],
          missedQuestionIds: Array.isArray(parsed.missedQuestionIds) ? parsed.missedQuestionIds : [],
          visitedSquares: Array.isArray(parsed.visitedSquares) ? parsed.visitedSquares : [1],
          userAnswers: parsed.userAnswers && typeof parsed.userAnswers === 'object' ? parsed.userAnswers : {}
        };
      }
    } catch (e) {
      console.warn('Failed to load snake ladder state', e);
    }
    return INITIAL_STATE;
  });

  // UI Interactive States
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [displayedDice, setDisplayedDice] = useState<number>(gameState.lastRoll || 1);
  const [diceRotation, setDiceRotation] = useState<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const [rollAnnouncement, setRollAnnouncement] = useState<{ number: number; text: string } | null>(null);

  // Audio Controls (independent toggles, persisted)
  const [musicEnabled, setMusicEnabled] = useState<boolean>(() => soundService.getMusicEnabled());
  const [sfxEnabled, setSfxEnabled] = useState<boolean>(() => soundService.getSfxEnabled());

  // Game Introduction / How to Play Modal (auto-opens for new players)
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(() => {
    try {
      const dismissed = localStorage.getItem('tbquest_intro_dismissed_v2');
      return !dismissed;
    } catch (e) {
      return true;
    }
  });

  // Active Clinical Challenge Modal
  const [activeChallenge, setActiveChallenge] = useState<Level1ClinicalQuestion | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [challengeResult, setChallengeResult] = useState<{
    isCorrect: boolean;
    earnedMarks: number;
    earnedXp: number;
    chosenIndex: number;
  } | null>(null);

  // Floating score feedback animation trigger
  const [showFloatingScore, setShowFloatingScore] = useState<boolean>(false);

  // Pending movement action after question modal is dismissed
  const [pendingAction, setPendingAction] = useState<{
    type: 'ladder' | 'snake' | 'none';
    from: number;
    to: number;
    wasCorrect?: boolean;
  } | null>(null);

  // Rapid countdown timer (10 seconds)
  const [rapidSecondsRemaining, setRapidSecondsRemaining] = useState<number>(10);
  const rapidTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Event Notification Overlay (Ladder / Snake activation)
  const [eventNotification, setEventNotification] = useState<{
    type: 'ladder' | 'snake' | 'avoided';
    from: number;
    to: number;
    title: string;
    description: string;
    xp?: number;
    marks?: number;
  } | null>(null);

  // Square 100 Grand Finale & Diagnostic Cascade State
  const [cascadeStep, setCascadeStep] = useState<number>(0);
  const [showGrandMastery, setShowGrandMastery] = useState(false);

  // Replay Weak Areas Mode
  const [isReplayingWeakAreas, setIsReplayingWeakAreas] = useState(false);
  const [weakQueueIndex, setWeakQueueIndex] = useState(0);

  // Restart Confirmation Dialog
  const [showRestartConfirm, setShowRestartConfirm] = useState(false);

  // Active Snake / Ladder Highlight Animation States
  const [highlightedSnake, setHighlightedSnake] = useState<number | null>(null);
  const [highlightedLadder, setHighlightedLadder] = useState<number | null>(null);

  // Sync ambient music on mount & updates
  useEffect(() => {
    if (musicEnabled && !showHowToPlay) {
      soundService.startAmbientMusic();
    } else {
      soundService.stopAmbientMusic();
    }
    return () => {
      soundService.stopAmbientMusic();
    };
  }, [musicEnabled, showHowToPlay]);

  // Persist game state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
    } catch (e) {
      console.error('Failed to save snake ladder state', e);
    }
  }, [gameState]);

  // Dice face 3D angles
  const getFaceRotation = (face: number) => {
    switch (face) {
      case 1: return { x: 0, y: 0, z: 0 };
      case 2: return { x: 90, y: 0, z: 0 };
      case 3: return { x: 0, y: -90, z: 0 };
      case 4: return { x: 0, y: 90, z: 0 };
      case 5: return { x: -90, y: 0, z: 0 };
      case 6: return { x: 180, y: 0, z: 0 };
      default: return { x: 0, y: 0, z: 0 };
    }
  };

  // Sound Toggles
  const handleToggleMusic = () => {
    const next = soundService.toggleMusic();
    setMusicEnabled(next);
  };

  const handleToggleSfx = () => {
    const next = soundService.toggleSfx();
    setSfxEnabled(next);
  };

  // Roll Dice Logic
  const handleRollDice = async () => {
    if (isRolling || isMoving || activeChallenge || showGrandMastery) return;

    setIsRolling(true);
    setRollAnnouncement(null);
    soundService.playDiceRoll();

    // Random roll between 1 and 6
    const roll = Math.floor(Math.random() * 6) + 1;

    // Spin dice with multi-axis tumble
    const spinsX = 720 + Math.floor(Math.random() * 360);
    const spinsY = 1080 + Math.floor(Math.random() * 360);
    const spinsZ = 360;
    setDiceRotation({ x: spinsX, y: spinsY, z: spinsZ });

    // Wait for physical roll animation
    setTimeout(async () => {
      const finalRot = getFaceRotation(roll);
      setDiceRotation(finalRot);
      setDisplayedDice(roll);
      setIsRolling(false);

      setRollAnnouncement({
        number: roll,
        text: `MOVE ${roll} SPACES`
      });

      // Begin step-by-step piece movement
      await movePieceStepByStep(roll);
    }, 1000);
  };

  // Step-by-step token movement: e.g. 42 -> 43 -> 44 -> 45 -> 46
  const movePieceStepByStep = async (steps: number) => {
    setIsMoving(true);
    let current = gameState.currentSquare;
    const target = Math.min(100, current + steps);

    for (let pos = current + 1; pos <= target; pos++) {
      await new Promise(r => setTimeout(r, 220));
      current = pos;
      soundService.playMoveStep();
      setGameState(prev => ({
        ...prev,
        currentSquare: pos,
        lastRoll: steps,
        visitedSquares: Array.from(new Set([...prev.visitedSquares, pos]))
      }));
    }

    setIsMoving(false);
    await handleSquareArrival(target);
  };

  // Handle arrival at destination square
  const handleSquareArrival = async (squareNum: number) => {
    // 1. Check for Square 100 (Grand Finale)
    if (squareNum === 100) {
      const uncompletedPrior = LEVEL1_25_CLINICAL_QUESTIONS.filter(
        q => q.questionNumber < 25 && !gameState.completedQuestionIds.includes(q.id)
      );

      if (uncompletedPrior.length > 0) {
        const nextQ = uncompletedPrior[0];
        triggerClinicalChallenge(nextQ);
        return;
      }

      const q25 = getChallengeForSquareNumber(100);
      if (q25) {
        triggerClinicalChallenge(q25);
      }
      return;
    }

    // 2. Check for Automatic Bonus Ladder (e.g. Square 9)
    if (AUTOMATIC_LADDERS[squareNum]) {
      const bonus = AUTOMATIC_LADDERS[squareNum];
      setHighlightedLadder(squareNum);
      soundService.playLadderClimb();
      setEventNotification({
        type: 'ladder',
        from: squareNum,
        to: bonus.to,
        title: bonus.title,
        description: LADDER_REASONS[squareNum] || 'TB Knowledge Boost',
        xp: bonus.xp
      });

      setGameState(prev => ({
        ...prev,
        xp: prev.xp + bonus.xp
      }));

      setTimeout(async () => {
        setEventNotification(null);
        setHighlightedLadder(null);
        await movePieceDirect(bonus.to);
        checkSquareChallenge(bonus.to);
      }, 2200);
      return;
    }

    // 3. Check for Automatic Snake (e.g. Square 96)
    if (AUTOMATIC_SNAKES[squareNum]) {
      const snake = AUTOMATIC_SNAKES[squareNum];
      setHighlightedSnake(squareNum);
      soundService.playSnakeSlide();
      setEventNotification({
        type: 'snake',
        from: squareNum,
        to: snake.to,
        title: snake.title,
        description: SNAKE_REASONS[squareNum] || 'Clinical Clue Missed'
      });

      setTimeout(async () => {
        setEventNotification(null);
        setHighlightedSnake(null);
        await movePieceDirect(snake.to);
        checkSquareChallenge(snake.to);
      }, 2400);
      return;
    }

    // 4. Check for Ladder with Question
    if (LADDERS[squareNum]) {
      const ladderTo = LADDERS[squareNum];
      const challenge = getChallengeForSquareNumber(squareNum);
      if (challenge && !gameState.completedQuestionIds.includes(challenge.id)) {
        setPendingAction({
          type: 'ladder',
          from: squareNum,
          to: ladderTo
        });
        triggerClinicalChallenge(challenge);
        return;
      }
    }

    // 5. Check for Snake with Question
    if (SNAKES[squareNum]) {
      const snakeTo = SNAKES[squareNum];
      const challenge = getChallengeForSquareNumber(squareNum);
      if (challenge && !gameState.completedQuestionIds.includes(challenge.id)) {
        setPendingAction({
          type: 'snake',
          from: squareNum,
          to: snakeTo
        });
        triggerClinicalChallenge(challenge);
        return;
      }
    }

    // 6. Direct question check or pacing check
    checkSquareChallenge(squareNum);
  };

  const movePieceDirect = async (toSquare: number) => {
    setGameState(prev => ({
      ...prev,
      currentSquare: toSquare,
      visitedSquares: Array.from(new Set([...prev.visitedSquares, toSquare]))
    }));
  };

  // Check if square triggers an uncompleted challenge
  const checkSquareChallenge = (squareNum: number) => {
    const directChallenge = getChallengeForSquareNumber(squareNum);
    if (directChallenge && !gameState.completedQuestionIds.includes(directChallenge.id)) {
      setPendingAction(null);
      triggerClinicalChallenge(directChallenge);
      return;
    }

    const uncompleted = LEVEL1_25_CLINICAL_QUESTIONS.find(
      q => !gameState.completedQuestionIds.includes(q.id) && q.squareNumber <= squareNum
    );
    if (uncompleted) {
      setPendingAction(null);
      triggerClinicalChallenge(uncompleted);
    }
  };

  // Launch Question Modal
  const triggerClinicalChallenge = (challenge: Level1ClinicalQuestion) => {
    setActiveChallenge(challenge);
    setSelectedOptionIndex(null);
    setChallengeResult(null);
    setShowFloatingScore(false);

    if (challenge.isRapid) {
      setRapidSecondsRemaining(10);
      if (rapidTimerRef.current) clearInterval(rapidTimerRef.current);
      rapidTimerRef.current = setInterval(() => {
        setRapidSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(rapidTimerRef.current!);
            handleTimeExpired();
            return 0;
          }
          soundService.playTimerTick();
          return prev - 1;
        });
      }, 1000);
    }
  };

  // Handle timeout on rapid challenge
  const handleTimeExpired = () => {
    if (!activeChallenge || challengeResult) return;
    submitAnswer(-1);
  };

  // Submit Answer
  const handleSelectOption = (index: number) => {
    if (challengeResult || !activeChallenge) return;
    setSelectedOptionIndex(index);
    submitAnswer(index);
  };

  const submitAnswer = (chosenIdx: number) => {
    if (rapidTimerRef.current) {
      clearInterval(rapidTimerRef.current);
      rapidTimerRef.current = null;
    }

    if (!activeChallenge) return;

    const isCorrect = chosenIdx === activeChallenge.correctIndex;
    const earnedMarks = isCorrect ? activeChallenge.marks : 0;
    const earnedXp = isCorrect ? activeChallenge.xp : 0;

    if (isCorrect) {
      soundService.playCorrect();
      soundService.playXpEarned();
      setShowFloatingScore(true);
    } else {
      soundService.playIncorrect();
      setShowFloatingScore(false);
    }

    setChallengeResult({
      isCorrect,
      earnedMarks,
      earnedXp,
      chosenIndex: chosenIdx
    });

    if (pendingAction) {
      setPendingAction(prev => (prev ? { ...prev, wasCorrect: isCorrect } : null));
    }

    setGameState(prev => {
      const nextCorrect = prev.correctAnswers + (isCorrect ? 1 : 0);
      const nextWrong = prev.wrongAnswers + (isCorrect ? 0 : 1);
      const nextTotal = prev.totalAnswered + 1;
      const nextScore = nextCorrect * 10;
      const nextAccuracy = Math.round((nextCorrect / 25) * 100);
      const nextXp = prev.xp + earnedXp;

      const completedIds = Array.from(new Set([...prev.completedQuestionIds, activeChallenge.id]));
      const missedIds = isCorrect
        ? prev.missedQuestionIds.filter(id => id !== activeChallenge.id)
        : Array.from(new Set([...prev.missedQuestionIds, activeChallenge.id]));

      const isFinal = activeChallenge.questionNumber === 25;

      return {
        ...prev,
        score: nextScore,
        xp: nextXp,
        correctAnswers: nextCorrect,
        wrongAnswers: nextWrong,
        totalAnswered: nextTotal,
        accuracy: nextAccuracy,
        completedQuestionIds: completedIds,
        missedQuestionIds: missedIds,
        userAnswers: {
          ...prev.userAnswers,
          [activeChallenge.id]: {
            selectedIndex: chosenIdx,
            isCorrect
          }
        },
        finalChallengePassed: isFinal ? isCorrect : prev.finalChallengePassed
      };
    });
  };

  // Dismiss challenge modal after review & trigger ladder/snake
  const handleChallengeDismiss = async () => {
    const isFinalChallenge = activeChallenge?.questionNumber === 25;
    const wasCorrect = challengeResult?.isCorrect;
    const currentAction = pendingAction;

    setActiveChallenge(null);
    setChallengeResult(null);
    setPendingAction(null);
    setShowFloatingScore(false);

    if (isReplayingWeakAreas) {
      handleNextWeakAreaQuestion();
      return;
    }

    // 1. If on Ladder Square and Correct -> 🪜 LADDER ACTIVATED!
    if (currentAction && currentAction.type === 'ladder' && wasCorrect) {
      setHighlightedLadder(currentAction.from);
      soundService.playLadderClimb();
      setEventNotification({
        type: 'ladder',
        from: currentAction.from,
        to: currentAction.to,
        title: '🪜 LADDER ACTIVATED!',
        description: LADDER_REASONS[currentAction.from] || 'Great TB Clinical Reasoning! Climbing upward!',
        marks: 10,
        xp: 20
      });

      setTimeout(async () => {
        setEventNotification(null);
        setHighlightedLadder(null);
        await movePieceDirect(currentAction.to);
        checkSquareChallenge(currentAction.to);
      }, 2300);
      return;
    }

    // 2. If on Snake Square and Wrong -> 🐍 TB CLUE MISSED!
    if (currentAction && currentAction.type === 'snake' && !wasCorrect) {
      setHighlightedSnake(currentAction.from);
      soundService.playSnakeSlide();
      setEventNotification({
        type: 'snake',
        from: currentAction.from,
        to: currentAction.to,
        title: '🐍 TB CLUE MISSED!',
        description: SNAKE_REASONS[currentAction.from] || 'Clinical pitfall encountered. Sliding down to reinforce concept.',
        marks: 0
      });

      setTimeout(async () => {
        setEventNotification(null);
        setHighlightedSnake(null);
        await movePieceDirect(currentAction.to);
        checkSquareChallenge(currentAction.to);
      }, 2500);
      return;
    }

    // 3. If on Snake Square and Correct -> 🛡️ Avoided Snake!
    if (currentAction && currentAction.type === 'snake' && wasCorrect) {
      soundService.playBonusEarned();
      setEventNotification({
        type: 'avoided',
        from: currentAction.from,
        to: currentAction.from,
        title: '🛡️ PITFALL AVOIDED!',
        description: 'You correctly identified the clinical clue and safely avoided the snake trap!'
      });

      setTimeout(() => {
        setEventNotification(null);
      }, 1800);
      return;
    }

    // 4. If Square 100 Final Challenge was just passed
    if (isFinalChallenge && wasCorrect) {
      startDiagnosticCascade();
    } else if (isFinalChallenge && !wasCorrect) {
      setShowGrandMastery(true);
    }
  };

  // Grand Finale 5-step diagnostic cascade
  const startDiagnosticCascade = () => {
    setCascadeStep(1);
    soundService.playBonusEarned();

    const interval = setInterval(() => {
      setCascadeStep(prev => {
        if (prev >= 5) {
          clearInterval(interval);
          setTimeout(() => {
            soundService.playQuizComplete();
            setShowGrandMastery(true);

            const passed = gameState.correctAnswers >= 20;
            if (passed) {
              soundService.playLevelUnlock();
              setGameState(st => ({
                ...st,
                xp: st.xp + 500,
                gameCompleted: true,
                level2Unlocked: true
              }));
              if (onUnlockLevel1) onUnlockLevel1();
              if (currentUserId) {
                supabaseData.updateUserProfile(currentUserId, {
                  xp: gameState.xp + 500,
                  level: 2
                }).catch(() => {});
              }
            }
          }, 800);
          return 5;
        }
        soundService.playMoveStep();
        return prev + 1;
      });
    }, 600);
  };

  // Replay Weak Areas Mode
  const handleStartReplayWeakAreas = () => {
    setShowGrandMastery(false);
    setIsReplayingWeakAreas(true);
    setWeakQueueIndex(0);

    if (gameState.missedQuestionIds.length > 0) {
      const firstMissedId = gameState.missedQuestionIds[0];
      const q = getChallengeById(firstMissedId);
      if (q) {
        triggerClinicalChallenge(q);
      }
    }
  };

  const handleNextWeakAreaQuestion = () => {
    const nextIdx = weakQueueIndex + 1;
    if (nextIdx < gameState.missedQuestionIds.length) {
      setWeakQueueIndex(nextIdx);
      const q = getChallengeById(gameState.missedQuestionIds[nextIdx]);
      if (q) {
        triggerClinicalChallenge(q);
      }
    } else {
      setIsReplayingWeakAreas(false);
      setShowGrandMastery(true);

      if (gameState.correctAnswers >= 20) {
        soundService.playLevelUnlock();
        setGameState(st => ({
          ...st,
          xp: st.xp + 500,
          gameCompleted: true,
          level2Unlocked: true
        }));
        if (onUnlockLevel1) onUnlockLevel1();
        if (currentUserId) {
          supabaseData.updateUserProfile(currentUserId, {
            xp: gameState.xp + 500,
            level: 2
          }).catch(() => {});
        }
      }
    }
  };

  // Reset Journey
  const handleRestartJourney = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGameState(INITIAL_STATE);
    setShowRestartConfirm(false);
    setShowGrandMastery(false);
    setCascadeStep(0);
  };

  // Grid coordinates for S-Curve (Boustrophedon 10x10)
  const getSquareCoordinates = (squareNum: number) => {
    const rFromBottom = Math.floor((squareNum - 1) / 10);
    const isEvenRow = rFromBottom % 2 === 0;
    const col = isEvenRow ? ((squareNum - 1) % 10) : (9 - ((squareNum - 1) % 10));
    const rFromTop = 9 - rFromBottom;

    return {
      xPercent: (col + 0.5) * 10,
      yPercent: (rFromTop + 0.5) * 10,
      col,
      row: rFromTop
    };
  };

  const currentCoords = useMemo(() => getSquareCoordinates(gameState.currentSquare), [gameState.currentSquare]);
  const currentStage = getLearnerStage(gameState.currentSquare);
  const stageDetails = getLearnerStageDetails(currentStage);

  // Score Ranking based ONLY on student's own score
  const getScoreRanking = (accuracyPct: number) => {
    if (accuracyPct >= 80) return 'TB Awareness Champion';
    if (accuracyPct >= 70) return 'TB Investigator';
    if (accuracyPct >= 50) return 'TB Clue Finder';
    return 'TB Learner';
  };

  // SVG Ladders definition
  const renderedLadders = useMemo(() => {
    return Object.entries(LADDERS).map(([fromStr, toNum]) => {
      const fromNum = parseInt(fromStr, 10);
      const start = getSquareCoordinates(fromNum);
      const end = getSquareCoordinates(toNum);
      return { fromNum, toNum, start, end };
    });
  }, []);

  // SVG Snakes definition
  const renderedSnakes = useMemo(() => {
    return Object.entries(SNAKES).map(([fromStr, toNum]) => {
      const fromNum = parseInt(fromStr, 10);
      const start = getSquareCoordinates(fromNum);
      const end = getSquareCoordinates(toNum);
      return { fromNum, toNum, start, end };
    });
  }, []);

  // Category counts calculation for final screen
  const categoryStats = useMemo(() => {
    const stats: Record<ChallengeCategory, { correct: number; total: number }> = {
      symptoms: { correct: 0, total: 7 },
      clinicalClues: { correct: 0, total: 4 },
      riskFactors: { correct: 0, total: 4 },
      patientHistory: { correct: 0, total: 3 },
      exposure: { correct: 0, total: 2 },
      clinicalReasoning: { correct: 0, total: 3 },
      presumptiveTB: { correct: 0, total: 2 }
    };

    const answers = gameState.userAnswers || {};
    LEVEL1_25_CLINICAL_QUESTIONS.forEach(q => {
      const ans = answers[q.id];
      if (ans && ans.isCorrect && stats[q.category]) {
        stats[q.category].correct += 1;
      }
    });

    return stats;
  }, [gameState.userAnswers]);

  // Stage theme colors
  const getStageHeaderStyles = (stage: string) => {
    switch (stage) {
      case 'TB Learner':
        return {
          bg: 'from-sky-50 to-blue-50 border-sky-200 text-sky-950',
          badge: 'bg-sky-100 text-sky-700 border-sky-300',
          accent: 'text-sky-600'
        };
      case 'TB Clue Finder':
        return {
          bg: 'from-teal-50 to-emerald-50 border-teal-200 text-teal-950',
          badge: 'bg-teal-100 text-teal-700 border-teal-300',
          accent: 'text-teal-600'
        };
      case 'TB Investigator':
        return {
          bg: 'from-blue-50 to-indigo-50 border-indigo-200 text-indigo-950',
          badge: 'bg-indigo-100 text-indigo-700 border-indigo-300',
          accent: 'text-indigo-600'
        };
      case 'TB Awareness Champion':
        return {
          bg: 'from-amber-50 via-purple-50 to-cyan-50 border-amber-300 text-amber-950',
          badge: 'bg-amber-100 text-amber-700 border-amber-300',
          accent: 'text-amber-600'
        };
      default:
        return {
          bg: 'from-blue-50 to-slate-50 border-blue-200 text-slate-900',
          badge: 'bg-blue-100 text-blue-700 border-blue-300',
          accent: 'text-blue-600'
        };
    }
  };

  const stageStyle = getStageHeaderStyles(stageDetails.stage);

  return (
    <div className="min-h-screen bg-[#F4F8FC] text-[#102A43] font-sans selection:bg-blue-500/20 selection:text-blue-900 relative overflow-hidden flex flex-col">
      {/* ========================================================================= */}
      {/* 13. BEAUTIFUL LIGHT MEDICAL BACKGROUND (Subtle & High-End) */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        {/* Soft Radial Ambient Color Glows */}
        <div className="absolute -top-40 left-1/4 w-[700px] h-[700px] bg-blue-300/15 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-[650px] h-[650px] bg-teal-300/15 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 left-1/3 w-[800px] h-[800px] bg-cyan-300/15 rounded-full blur-[180px]" />

        {/* Anatomical Lung Outline Silhouette (Subtle Line-Art) */}
        <svg className="absolute top-16 right-8 w-96 h-96 text-blue-500/[0.04] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 4v16m0-16c-2.5 0-5 1.5-6.5 4C4 10.5 4 14 5.5 17c1.5 3 4 3 6.5 3m0-20c2.5 0 5 1.5 6.5 4 1.5 2.5 1.5 6 0 9-1.5 3-4 3-6.5 3" />
          <path d="M9 10c-1 1-1.5 3-.5 5m6-5c1 1 1.5 3 .5 5" />
        </svg>

        {/* Microscope Laboratory Silhouette */}
        <svg className="absolute bottom-16 left-6 w-80 h-80 text-teal-600/[0.035] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M6 18h8m-4-4v4m0-12a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3 3 3 0 0 1-3-3V9a3 3 0 0 1 3-3zm0 0V4m-5 8h10" />
        </svg>

        {/* Medical DNA Helix Graphic */}
        <svg className="absolute top-1/2 left-8 w-48 h-80 text-cyan-600/[0.03] pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M4 4c4 4 12 4 16 0M4 12c4 4 12 4 16 0M4 20c4-4 12-4 16 0M6 8h12M6 16h12" />
        </svg>

        {/* Clean Medical Micro-Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle, #0284c7 1px, transparent 1px)`,
            backgroundSize: '28px 28px'
          }}
        />
      </div>

      {/* ========================================================================= */}
      {/* 7. TOP HUD: BRIGHT, COLORFUL STAT CARDS */}
      {/* ========================================================================= */}
      <header className="relative z-20 border-b border-slate-200/90 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 shadow-[0_4px_20px_rgba(16,42,67,0.04)]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Level Banner */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1677FF] via-[#00B8A9] to-teal-500 flex items-center justify-center shadow-md shadow-blue-500/25 border border-white text-xl">
              🐍
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight text-[#102A43] uppercase">TB QUEST</span>
                <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700">
                  LEVEL 1
                </span>
              </div>
              <div className="text-xs text-[#64748B] font-medium">Path to TB Awareness</div>
            </div>
          </div>

          {/* Core HUD Metrics: Colorful Pill Cards */}
          <div className="flex items-center flex-wrap gap-2.5 sm:gap-3 text-xs font-mono">
            {/* 🟡 SCORE: Gold / Yellow */}
            <div className="flex items-center gap-2 bg-gradient-to-br from-amber-50 to-yellow-50/80 px-3.5 py-1.5 rounded-xl border border-amber-200 shadow-sm">
              <span className="text-base leading-none">🟡</span>
              <div>
                <span className="text-[#64748B] text-[10px] uppercase block leading-none font-bold">SCORE</span>
                <span className="text-sm font-black text-amber-900">
                  {gameState.score} <span className="text-[11px] text-amber-600/80 font-normal">/ 250</span>
                </span>
              </div>
            </div>

            {/* 🟣 XP: Purple / Cyan */}
            <div className="flex items-center gap-2 bg-gradient-to-br from-purple-50 to-indigo-50/80 px-3.5 py-1.5 rounded-xl border border-purple-200 shadow-sm">
              <span className="text-base leading-none">🟣</span>
              <div>
                <span className="text-[#64748B] text-[10px] uppercase block leading-none font-bold">XP</span>
                <span className="text-sm font-black text-purple-900">{gameState.xp}</span>
              </div>
            </div>

            {/* 🟢 ACCURACY: Green */}
            <div className="flex items-center gap-2 bg-gradient-to-br from-emerald-50 to-teal-50/80 px-3.5 py-1.5 rounded-xl border border-emerald-200 shadow-sm">
              <span className="text-base leading-none">🟢</span>
              <div>
                <span className="text-[#64748B] text-[10px] uppercase block leading-none font-bold">ACCURACY</span>
                <span className={`text-sm font-black ${gameState.accuracy >= 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {gameState.accuracy}%
                </span>
              </div>
            </div>

            {/* 🔵 SQUARE: Blue */}
            <div className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-sky-50/80 px-3.5 py-1.5 rounded-xl border border-blue-200 shadow-sm">
              <span className="text-base leading-none">🔵</span>
              <div>
                <span className="text-[#64748B] text-[10px] uppercase block leading-none font-bold">SQUARE</span>
                <span className="text-sm font-black text-blue-900">
                  {gameState.currentSquare} <span className="text-[11px] text-blue-600/80 font-normal">/ 100</span>
                </span>
              </div>
            </div>

            {/* 🟣 QUESTIONS: Purple */}
            <div className="flex items-center gap-2 bg-gradient-to-br from-indigo-50 to-purple-50/80 px-3.5 py-1.5 rounded-xl border border-indigo-200 shadow-sm">
              <span className="text-base leading-none">🟣</span>
              <div>
                <span className="text-[#64748B] text-[10px] uppercase block leading-none font-bold">QUESTIONS</span>
                <span className="text-sm font-black text-indigo-900">
                  {(gameState.completedQuestionIds || []).length} <span className="text-[11px] text-indigo-600/80 font-normal">/ 25</span>
                </span>
              </div>
            </div>
          </div>

          {/* Controls: How to Play, Sound, Music, Reset, Exit */}
          <div className="flex items-center gap-2">
            {/* How to Play Guide Button */}
            <button
              onClick={() => setShowHowToPlay(true)}
              title="How to Play / Tutorial"
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-mono font-bold text-[#102A43] hover:text-[#1677FF] hover:border-blue-300 shadow-sm transition-all flex items-center gap-1.5 active:scale-95"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#1677FF]" />
              <span className="hidden sm:inline">How to Play</span>
            </button>

            {/* Music Toggle */}
            <button
              onClick={handleToggleMusic}
              title={musicEnabled ? 'Atmospheric Music: ON' : 'Atmospheric Music: OFF'}
              className={`p-2 rounded-xl border text-xs transition-all ${
                musicEnabled 
                  ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
            </button>

            {/* Sound FX Toggle */}
            <button
              onClick={handleToggleSfx}
              title={sfxEnabled ? 'Sound FX: ON' : 'Sound FX: OFF'}
              className={`p-2 rounded-xl border text-xs transition-all ${
                sfxEnabled 
                  ? 'bg-teal-50 border-teal-300 text-teal-700 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-700'
              }`}
            >
              {sfxEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Restart Confirmation Button */}
            <button
              onClick={() => setShowRestartConfirm(true)}
              title="Reset Board Progress"
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Back to Dashboard */}
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
              >
                Exit
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 8. PROGRESS BAR: VIBRANT GRADIENT WITH MOVING SHINE */}
        {/* ========================================================================= */}
        <div className="max-w-7xl mx-auto mt-2.5">
          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#64748B] mb-1">
            <span className="flex items-center gap-1.5 text-blue-700">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              LEVEL 1 PROGRESS
            </span>
            <span>{gameState.currentSquare} / 100 SQUARES ({Math.min(100, gameState.currentSquare)}%)</span>
          </div>

          <div className="h-2.5 w-full bg-slate-200/90 rounded-full overflow-hidden p-0.5 shadow-inner relative">
            <div 
              className="h-full bg-gradient-to-r from-[#1677FF] via-[#00B8A9] to-[#22C55E] rounded-full transition-all duration-500 shadow-sm relative overflow-hidden"
              style={{ width: `${Math.min(100, gameState.currentSquare)}%` }}
            >
              {/* Moving shine reflection animation */}
              <div className="progress-shine" />
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN GAME WORKSPACE */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ========================================================================= */}
        {/* 2. GAME BOARD: THE VISUAL HERO OF THE PAGE */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full max-w-[680px] aspect-square relative rounded-3xl bg-white border-2 border-slate-200/90 p-2.5 sm:p-3.5 shadow-[0_20px_50px_-10px_rgba(22,119,255,0.12),0_10px_20px_-5px_rgba(0,0,0,0.05)] backdrop-blur-xl">
            {/* Subtle Metallic Corner Guides */}
            <div className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-blue-400 rounded-tl-sm pointer-events-none" />
            <div className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-blue-400 rounded-tr-sm pointer-events-none" />
            <div className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-blue-400 rounded-bl-sm pointer-events-none" />
            <div className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-blue-400 rounded-br-sm pointer-events-none" />

            {/* 10 x 10 Grid */}
            <div className="w-full h-full grid grid-cols-10 grid-rows-10 gap-1 sm:gap-1.5 relative">
              {Array.from({ length: 100 }, (_, idx) => {
                const squareNum = idx + 1;
                const coords = getSquareCoordinates(squareNum);
                const isCurrent = gameState.currentSquare === squareNum;
                const isVisited = gameState.visitedSquares.includes(squareNum);
                const hasLadder = !!LADDERS[squareNum];
                const hasSnake = !!SNAKES[squareNum];
                const isAutoBonus = !!AUTOMATIC_LADDERS[squareNum];
                const isAutoSnake = !!AUTOMATIC_SNAKES[squareNum];
                const challenge = getChallengeForSquareNumber(squareNum);
                const isCompletedQuestion = challenge && gameState.completedQuestionIds.includes(challenge.id);
                const isMissedQuestion = challenge && gameState.missedQuestionIds.includes(challenge.id);

                // Alternating Soft Educational Colors
                let squareStyle = 'bg-white border-slate-200/90 text-slate-800 shadow-[0_1px_3px_rgba(0,0,0,0.03)]';

                if (squareNum === 1) {
                  // Start: Green accent
                  squareStyle = 'bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-500 text-emerald-950 font-black shadow-sm';
                } else if (squareNum === 100) {
                  // Finish: Gold / Purple accent
                  squareStyle = 'bg-gradient-to-br from-amber-100 via-yellow-100 to-purple-100 border-2 border-amber-400 text-amber-950 font-black shadow-md';
                } else if (hasLadder || isAutoBonus) {
                  // Ladder: Very light green / teal
                  squareStyle = 'bg-gradient-to-br from-emerald-50/90 to-teal-50/90 border border-emerald-300 text-emerald-900 shadow-sm';
                } else if (hasSnake || isAutoSnake) {
                  // Snake: Very light coral / red
                  squareStyle = 'bg-gradient-to-br from-rose-50/90 to-red-50/90 border border-rose-300 text-rose-900 shadow-sm';
                } else if (challenge) {
                  // Question: Light purple / blue
                  squareStyle = isCompletedQuestion
                    ? 'bg-emerald-50/90 border border-emerald-300 text-emerald-900'
                    : isMissedQuestion
                    ? 'bg-rose-50/90 border border-rose-300 text-rose-900'
                    : 'bg-indigo-50/80 border border-indigo-200 text-indigo-900';
                } else if ([3, 7, 14, 22, 30, 38, 48, 59, 68, 79, 86, 97].includes(squareNum)) {
                  // Learning / Pearl: Light cyan
                  squareStyle = 'bg-cyan-50/80 border border-cyan-200 text-cyan-900';
                } else if (isVisited) {
                  // Visited
                  squareStyle = 'bg-slate-50/90 border-slate-200 text-slate-700';
                } else {
                  // Normal: Alternating white and soft blue tint
                  squareStyle = (coords.row + coords.col) % 2 === 0
                    ? 'bg-white border-slate-200/80 text-slate-800'
                    : 'bg-blue-50/40 border-slate-200/80 text-slate-800';
                }

                // Current player highlight
                if (isCurrent) {
                  squareStyle += ' ring-4 ring-blue-500/40 border-2 border-blue-600 shadow-[0_0_20px_rgba(22,119,255,0.45)] z-20';
                }

                return (
                  <div
                    key={squareNum}
                    style={{
                      gridColumnStart: coords.col + 1,
                      gridRowStart: coords.row + 1
                    }}
                    className={`relative rounded-lg flex flex-col justify-between p-1 select-none transition-all duration-300 border ${squareStyle}`}
                  >
                    {/* Top Row: Square Number & Icon */}
                    <div className="flex items-center justify-between leading-none">
                      <span className={`text-[10px] sm:text-[11px] font-mono font-bold ${
                        isCurrent 
                          ? 'text-blue-700 font-black' 
                          : squareNum === 100 
                          ? 'text-amber-800 font-black' 
                          : squareNum === 1
                          ? 'text-emerald-800 font-black'
                          : 'text-[#102A43]'
                      }`}>
                        {squareNum}
                      </span>

                      {/* Square Status Icon */}
                      {squareNum === 100 ? (
                        <Award className="w-3 h-3 text-amber-600 animate-bounce" />
                      ) : squareNum === 1 ? (
                        <span className="text-[9px] font-black text-emerald-700 uppercase">START</span>
                      ) : isAutoBonus ? (
                        <span className="text-[10px] text-amber-500 font-bold leading-none" title="Bonus Ladder">⭐</span>
                      ) : isAutoSnake ? (
                        <span className="text-[10px] text-rose-500 font-bold leading-none" title="Snake Pitfall">🐍</span>
                      ) : hasLadder ? (
                        <span className="text-[10px] text-teal-600 font-bold leading-none">🪜</span>
                      ) : hasSnake ? (
                        <span className="text-[10px] text-rose-600 font-bold leading-none">🐍</span>
                      ) : isCompletedQuestion ? (
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                      ) : isMissedQuestion ? (
                        <XCircle className="w-2.5 h-2.5 text-rose-600" />
                      ) : challenge ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" title={`Q${challenge.questionNumber}`} />
                      ) : null}
                    </div>

                    {/* Bottom Label for Ladder / Snake */}
                    <div className="text-[8px] sm:text-[9px] font-mono truncate leading-none">
                      {hasLadder ? (
                        <span className="text-emerald-700 font-extrabold">+{LADDERS[squareNum]}</span>
                      ) : hasSnake ? (
                        <span className="text-rose-700 font-extrabold">-{SNAKES[squareNum]}</span>
                      ) : null}
                    </div>
                  </div>
                );
              })}

              {/* ========================================================================= */}
              {/* 3 & 4. REALISTIC SVG LADDERS & SNAKES WITH 3D DEPTH */}
              {/* ========================================================================= */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                <defs>
                  {/* Ladder 3D Metallic Teal / Blue Gradient */}
                  <linearGradient id="ladderMetallic" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#0d9488" />
                    <stop offset="50%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>

                  {/* Snake 3D Textured Coral / Red Gradient */}
                  <linearGradient id="snakeSkin" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f43f5e" />
                    <stop offset="50%" stopColor="#e11d48" />
                    <stop offset="100%" stopColor="#9f1239" />
                  </linearGradient>

                  {/* Soft Drop Shadow for Real 3D Appearance */}
                  <filter id="elementShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="1.5" dy="3" stdDeviation="2.5" floodColor="#0f172a" floodOpacity="0.22" />
                  </filter>

                  {/* Activated Glow Filters */}
                  <filter id="ladderGlowPulse" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#06b6d4" floodOpacity="0.8" />
                  </filter>

                  <filter id="snakeGlowPulse" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#f43f5e" floodOpacity="0.85" />
                  </filter>
                </defs>

                {/* 4. REALISTIC LADDERS */}
                {renderedLadders.map(({ fromNum, toNum, start, end }) => {
                  const dx = end.xPercent - start.xPercent;
                  const dy = end.yPercent - start.yPercent;
                  const len = Math.sqrt(dx * dx + dy * dy);
                  const angle = Math.atan2(dy, dx) + Math.PI / 2;
                  const offset = 1.35;

                  const ox = Math.cos(angle) * offset;
                  const oy = Math.sin(angle) * offset;

                  const leftRail = {
                    x1: start.xPercent - ox,
                    y1: start.yPercent - oy,
                    x2: end.xPercent - ox,
                    y2: end.yPercent - oy
                  };
                  const rightRail = {
                    x1: start.xPercent + ox,
                    y1: start.yPercent + oy,
                    x2: end.xPercent + ox,
                    y2: end.yPercent + oy
                  };

                  const rungCount = Math.max(3, Math.floor(len / 4.2));
                  const rungs = [];
                  for (let i = 1; i <= rungCount; i++) {
                    const frac = i / (rungCount + 1);
                    const rx1 = leftRail.x1 + (leftRail.x2 - leftRail.x1) * frac;
                    const ry1 = leftRail.y1 + (leftRail.y2 - leftRail.y1) * frac;
                    const rx2 = rightRail.x1 + (rightRail.x2 - rightRail.x1) * frac;
                    const ry2 = rightRail.y1 + (rightRail.y2 - rightRail.y1) * frac;
                    rungs.push({ x1: rx1, y1: ry1, x2: rx2, y2: ry2 });
                  }

                  const isHighlighted = highlightedLadder === fromNum;

                  return (
                    <g 
                      key={`ladder-${fromNum}`} 
                      filter={isHighlighted ? 'url(#ladderGlowPulse)' : 'url(#elementShadow)'}
                      className={isHighlighted ? 'animate-pulse' : 'opacity-95'}
                    >
                      {/* Left Rail */}
                      <line
                        x1={`${leftRail.x1}%`}
                        y1={`${leftRail.y1}%`}
                        x2={`${leftRail.x2}%`}
                        y2={`${leftRail.y2}%`}
                        stroke="url(#ladderMetallic)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {/* Right Rail */}
                      <line
                        x1={`${rightRail.x1}%`}
                        y1={`${rightRail.y1}%`}
                        x2={`${rightRail.x2}%`}
                        y2={`${rightRail.y2}%`}
                        stroke="url(#ladderMetallic)"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                      {/* Rungs */}
                      {rungs.map((rung, rIdx) => (
                        <g key={rIdx}>
                          <line
                            x1={`${rung.x1}%`}
                            y1={`${rung.y1}%`}
                            x2={`${rung.x2}%`}
                            y2={`${rung.y2}%`}
                            stroke="#0ea5e9"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                          {/* Small rivet bolts on ladder */}
                          <circle cx={`${rung.x1}%`} cy={`${rung.y1}%`} r="0.75" fill="#f8fafc" />
                          <circle cx={`${rung.x2}%`} cy={`${rung.y2}%`} r="0.75" fill="#f8fafc" />
                        </g>
                      ))}
                    </g>
                  );
                })}

                {/* 3. REALISTIC 3D SNAKES */}
                {renderedSnakes.map(({ fromNum, toNum, start, end }) => {
                  const mx = (start.xPercent + end.xPercent) / 2 + 6.5;
                  const my = (start.yPercent + end.yPercent) / 2;
                  const isHighlighted = highlightedSnake === fromNum;

                  return (
                    <g 
                      key={`snake-${fromNum}`} 
                      filter={isHighlighted ? 'url(#snakeGlowPulse)' : 'url(#elementShadow)'}
                      className={isHighlighted ? 'animate-pulse' : 'opacity-95'}
                    >
                      {/* Thick Coral / Red Body */}
                      <path
                        d={`M ${start.xPercent} ${start.yPercent} Q ${mx} ${my} ${end.xPercent} ${end.yPercent}`}
                        fill="none"
                        stroke="url(#snakeSkin)"
                        strokeWidth="4.5"
                        strokeLinecap="round"
                      />
                      {/* Subtle Dorsal Highlight Stripe */}
                      <path
                        d={`M ${start.xPercent} ${start.yPercent} Q ${mx} ${my} ${end.xPercent} ${end.yPercent}`}
                        fill="none"
                        stroke="#fecdd3"
                        strokeWidth="1.2"
                        strokeDasharray="2 3"
                        strokeLinecap="round"
                        opacity="0.8"
                      />
                      {/* Realistic Snake Head */}
                      <circle
                        cx={`${start.xPercent}%`}
                        cy={`${start.yPercent}%`}
                        r="4"
                        fill="#be123c"
                        stroke="#fff"
                        strokeWidth="1"
                      />
                      {/* Snake Eyes */}
                      <circle
                        cx={`${start.xPercent - 1}%`}
                        cy={`${start.yPercent - 1}%`}
                        r="0.9"
                        fill="#fef08a"
                      />
                      <circle
                        cx={`${start.xPercent + 1}%`}
                        cy={`${start.yPercent - 1}%`}
                        r="0.9"
                        fill="#fef08a"
                      />
                      {/* Snake Tail Tip */}
                      <circle
                        cx={`${end.xPercent}%`}
                        cy={`${end.yPercent}%`}
                        r="2"
                        fill="#9f1239"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* ========================================================================= */}
              {/* 5. REALISTIC 3D PLAYER TOKEN WITH SHADOW & GLOW */}
              {/* ========================================================================= */}
              <div
                className="absolute z-30 pointer-events-none transition-all duration-200"
                style={{
                  left: `${currentCoords.xPercent}%`,
                  top: `${currentCoords.yPercent}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className={`relative flex items-center justify-center ${isMoving ? '-translate-y-3' : 'translate-y-0'} transition-transform duration-200`}>
                  {/* Soft Ground Contact Shadow */}
                  <div className="absolute top-7 w-8 h-2.5 bg-slate-900/35 rounded-full blur-[2px]" />

                  {/* 3D Glossy Game Piece */}
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-[#38BDF8] via-[#1677FF] to-[#0d9488] border-2 border-white shadow-[0_8px_18px_rgba(22,119,255,0.45)] flex items-center justify-center">
                    {/* Glossy Top Specular Highlight */}
                    <div className="w-6 h-6 rounded-full bg-gradient-to-b from-white/70 to-transparent flex items-center justify-center">
                      <Activity className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                    </div>
                  </div>

                  {/* Pulsing Aura */}
                  <div className="absolute inset-0 rounded-full bg-blue-500/25 animate-ping pointer-events-none" style={{ animationDuration: '2.5s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT PANEL: STAGE, 3D DICE & 25 QUESTIONS (Col 9 - 12) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* 9. CLINICAL STAGE CARD (Bright Medical Theme) */}
          <div className={`rounded-2xl p-4.5 border shadow-sm bg-gradient-to-r ${stageStyle.bg}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono uppercase tracking-wider font-extrabold text-[#64748B]">
                CLINICAL STAGE
              </span>
              <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${stageStyle.badge}`}>
                {stageDetails.range}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-2xl">
                {stageDetails.badge}
              </div>
              <div>
                <h4 className="text-base font-black text-[#102A43] tracking-tight">{stageDetails.stage}</h4>
                <p className="text-xs text-[#64748B] leading-snug font-medium">{stageDetails.focus}</p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* 6. REALISTIC 3D-STYLE DICE AREA (Clean White Card) */}
          {/* ========================================================================= */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-md flex flex-col items-center justify-center relative overflow-hidden">
            <div className="text-[11px] font-mono uppercase tracking-widest text-[#64748B] mb-3 flex items-center gap-2 font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              ROLL THE DICE
            </div>

            {/* 3D Dice Stage */}
            <div className="w-24 h-24 my-2 relative flex items-center justify-center perspective-[600px]">
              {/* Dynamic Cast Table Shadow */}
              <div 
                className={`absolute bottom-0 w-16 h-3.5 bg-slate-900/25 rounded-full blur-[3px] transition-all duration-300 ${
                  isRolling ? 'scale-75 opacity-30 translate-y-3' : 'scale-100 opacity-80'
                }`}
              />

              {/* 3D Dice Cube */}
              <div
                className={`w-16 h-16 relative transform-style-3d transition-transform ${
                  isRolling ? 'duration-[1000ms] ease-out' : 'duration-500 ease-out'
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: `rotateX(${diceRotation.x}deg) rotateY(${diceRotation.y}deg) rotateZ(${diceRotation.z}deg)`
                }}
              >
                {/* Face 1 */}
                <div className="dice-face face-front">
                  <span className="dice-dot center" />
                </div>
                {/* Face 2 */}
                <div className="dice-face face-bottom">
                  <span className="dice-dot top-left" />
                  <span className="dice-dot bottom-right" />
                </div>
                {/* Face 3 */}
                <div className="dice-face face-right">
                  <span className="dice-dot top-left" />
                  <span className="dice-dot center" />
                  <span className="dice-dot bottom-right" />
                </div>
                {/* Face 4 */}
                <div className="dice-face face-left">
                  <span className="dice-dot top-left" />
                  <span className="dice-dot top-right" />
                  <span className="dice-dot bottom-left" />
                  <span className="dice-dot bottom-right" />
                </div>
                {/* Face 5 */}
                <div className="dice-face face-top">
                  <span className="dice-dot top-left" />
                  <span className="dice-dot top-right" />
                  <span className="dice-dot center" />
                  <span className="dice-dot bottom-left" />
                  <span className="dice-dot bottom-right" />
                </div>
                {/* Face 6 */}
                <div className="dice-face face-back">
                  <span className="dice-dot top-left" />
                  <span className="dice-dot top-right" />
                  <span className="dice-dot middle-left" />
                  <span className="dice-dot middle-right" />
                  <span className="dice-dot bottom-left" />
                  <span className="dice-dot bottom-right" />
                </div>
              </div>
            </div>

            {/* Roll Result Announcement */}
            <div className="min-h-[44px] flex flex-col items-center justify-center my-1 font-mono">
              {rollAnnouncement ? (
                <div className="text-center animate-bounce">
                  <span className="text-2xl font-black text-[#102A43] block leading-none">{rollAnnouncement.number}</span>
                  <span className="text-[11px] font-bold tracking-widest text-[#1677FF] uppercase">{rollAnnouncement.text}</span>
                </div>
              ) : isRolling ? (
                <span className="text-xs font-bold text-blue-600 animate-pulse tracking-wide">ROLLING DICE...</span>
              ) : isMoving ? (
                <span className="text-xs font-bold text-teal-600 tracking-wide">ADVANCING CLINICAL TOKEN...</span>
              ) : (
                <span className="text-xs text-slate-500 font-medium">READY TO ADVANCE</span>
              )}
            </div>

            {/* Blue ➔ Teal Gradient Action Button */}
            <button
              onClick={handleRollDice}
              disabled={isRolling || isMoving || !!activeChallenge || showGrandMastery}
              className={`w-full mt-3 py-3.5 px-6 rounded-xl font-black tracking-wider uppercase text-sm flex items-center justify-center gap-2.5 transition-all shadow-md ${
                isRolling || isMoving || activeChallenge || showGrandMastery
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-[#1677FF] via-[#00B8A9] to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-blue-500/25 active:scale-[0.98]'
              }`}
            >
              <RotateCw className={`w-4 h-4 ${isRolling ? 'animate-spin' : ''}`} />
              <span>{isRolling ? 'ROLLING...' : 'ROLL DICE 🎲'}</span>
            </button>
          </div>

          {/* 25 QUESTIONS CURRICULUM SYLLABUS TRACKER */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-sm">
            <div className="flex items-center justify-between mb-3 font-mono">
              <span className="text-[11px] uppercase tracking-wider text-[#64748B] font-extrabold">25 TB CLINICAL QUESTIONS</span>
              <span className="text-xs font-black text-blue-600">
                {(gameState.completedQuestionIds || []).length} / 25 DONE
              </span>
            </div>

            {/* Questions Progress Grid (5x5) */}
            <div className="grid grid-cols-5 gap-1.5 font-mono text-xs font-bold">
              {LEVEL1_25_CLINICAL_QUESTIONS.map(q => {
                const isDone = (gameState.completedQuestionIds || []).includes(q.id);
                const isMissed = (gameState.missedQuestionIds || []).includes(q.id);
                return (
                  <div
                    key={q.id}
                    title={`Q${q.questionNumber}: ${q.categoryLabel}`}
                    className={`h-7 rounded-lg flex items-center justify-center border transition-colors ${
                      isDone && !isMissed
                        ? 'bg-emerald-100 border-emerald-300 text-emerald-800'
                        : isMissed
                        ? 'bg-rose-100 border-rose-300 text-rose-800'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    {q.questionNumber}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-[#64748B] font-semibold">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Correct (+10)</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Review</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300" /> Pending</span>
            </div>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 10. BRIGHT & ENGAGING QUESTION MODAL (Clean Medical White Theme) */}
      {/* ========================================================================= */}
      {activeChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white border border-slate-200/90 rounded-3xl shadow-[0_25px_70px_rgba(16,42,67,0.18)] p-6 sm:p-8 text-[#102A43] relative overflow-hidden">
            {/* 11. Floating Score / XP Particle Feedback Animation */}
            {showFloatingScore && (
              <div className="absolute top-8 right-8 pointer-events-none animate-bounce flex items-center gap-2 font-mono text-sm font-black px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 shadow-lg">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>
                  {activeChallenge?.questionNumber === 25
                    ? '+30 BONUS MARKS • +100 XP'
                    : '+10 MARKS • +20 XP'}
                </span>
              </div>
            )}

            {/* Top Clinical Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1677FF] animate-pulse" />
                <span className="text-xs font-mono font-black tracking-wider text-[#1677FF] uppercase">
                  TB CLINICAL QUESTION #{activeChallenge.questionNumber} / 25
                </span>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                  {CATEGORY_LABELS[activeChallenge.category] || activeChallenge.categoryLabel}
                </span>
              </div>

              {/* Rapid Countdown Timer */}
              {activeChallenge.isRapid && !challengeResult && (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 font-mono text-xs font-bold shadow-sm">
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" style={{ animationDuration: '3s' }} />
                  <span>00:{rapidSecondsRemaining < 10 ? `0${rapidSecondsRemaining}` : rapidSecondsRemaining}</span>
                </div>
              )}
            </div>

            {/* Patient Clue Vignette Box */}
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-blue-50/60 to-cyan-50/60 border border-blue-200/80 shadow-sm">
              <div className="text-[11px] font-mono uppercase tracking-widest text-blue-700 mb-1.5 flex items-center gap-1.5 font-black">
                <Activity className="w-3.5 h-3.5 text-blue-600" />
                PATIENT CLUE
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                {activeChallenge.patientClue}
              </p>
            </div>

            {/* Question Heading */}
            <div className="mt-4">
              <h3 className="text-base sm:text-lg font-black text-[#102A43] leading-snug">
                {activeChallenge.question}
              </h3>
            </div>

            {/* Answer Buttons (Neutral #F8FAFC -> Green / Red) */}
            <div className="space-y-2.5 mt-4">
              {activeChallenge.options.map((option, idx) => {
                const isSelected = selectedOptionIndex === idx;
                const isCorrectChoice = idx === activeChallenge.correctIndex;
                const showFeedback = !!challengeResult;

                let btnStyles = 'bg-[#F8FAFC] border-slate-200 text-[#102A43] hover:border-blue-300 hover:bg-blue-50/60 cursor-pointer shadow-sm';

                if (showFeedback) {
                  if (isCorrectChoice) {
                    // Always show correct answer in GREEN
                    btnStyles = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold shadow-[0_0_15px_rgba(34,197,94,0.25)]';
                  } else if (isSelected && !isCorrectChoice) {
                    // Show selected incorrect answer in RED with shake
                    btnStyles = 'bg-rose-50 border-2 border-rose-500 text-rose-950 font-medium animate-shake';
                  } else {
                    btnStyles = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed';
                  }
                } else if (isSelected) {
                  btnStyles = 'bg-blue-50 border-2 border-blue-500 text-blue-900 shadow-sm font-semibold';
                }

                return (
                  <button
                    key={idx}
                    disabled={showFeedback}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3.5 select-none ${btnStyles}`}
                  >
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center font-mono text-xs font-bold mt-0.5 shrink-0 ${
                      showFeedback && isCorrectChoice
                        ? 'border-emerald-500 bg-emerald-500 text-white'
                        : showFeedback && isSelected && !isCorrectChoice
                        ? 'border-rose-500 bg-rose-500 text-white'
                        : isSelected
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : 'border-slate-300 bg-white text-slate-600'
                    }`}>
                      {showFeedback && isCorrectChoice ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : showFeedback && isSelected && !isCorrectChoice ? (
                        <X className="w-3 h-3 stroke-[3]" />
                      ) : (
                        String.fromCharCode(65 + idx)
                      )}
                    </span>
                    <span className="text-sm leading-relaxed">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Post-Submission Learning Card */}
            {challengeResult && (
              <div className="mt-5 animate-in fade-in duration-300">
                {challengeResult.isCorrect ? (
                  /* 🟢 CORRECT ANSWER CARD */
                  <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 shadow-sm">
                    <div className="flex items-center justify-between pb-2.5 border-b border-emerald-200 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                        <span className="text-lg font-black tracking-tight text-emerald-900 uppercase">
                          ✅ CORRECT!
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-xs font-black">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
                          +{challengeResult.earnedMarks} MARKS
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 border border-amber-300 shadow-sm">
                          +{challengeResult.earnedXp} XP
                        </span>
                      </div>
                    </div>

                    <div className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider mb-1">
                      Great TB clinical reasoning
                    </div>

                    {/* 💡 WHAT YOU LEARNED */}
                    <div className="mt-2.5 p-3.5 rounded-xl bg-white/90 border border-emerald-200">
                      <div className="text-[11px] font-mono font-black text-amber-700 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                        <span>💡</span> WHAT YOU LEARNED
                      </div>
                      <p className="text-sm text-slate-800 leading-relaxed font-semibold">
                        "{activeChallenge.clinicalInsight}"
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleChallengeDismiss}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono text-xs font-black uppercase tracking-wider shadow-md shadow-emerald-600/25 flex items-center gap-2 transition-all active:scale-95"
                      >
                        <span>CONTINUE</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 🔴 WRONG ANSWER CARD */
                  <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 shadow-sm">
                    <div className="flex items-center justify-between pb-2.5 border-b border-rose-200 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-rose-500 flex items-center justify-center text-white font-bold">
                          <X className="w-4 h-4 stroke-[3]" />
                        </div>
                        <span className="text-lg font-black tracking-tight text-rose-900 uppercase">
                          ❌ WRONG ANSWER
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-xs font-black">
                        <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 border border-rose-300">
                          +0 MARKS
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500 border border-slate-200">
                          0 XP
                        </span>
                      </div>
                    </div>

                    {/* Comparison: Selected vs Correct */}
                    <div className="space-y-2 my-3 text-xs sm:text-sm">
                      <div className="p-2.5 rounded-xl bg-white border border-rose-200 flex items-start gap-2">
                        <span className="text-rose-600 font-mono font-bold text-xs uppercase shrink-0 mt-0.5">🔴 Your answer:</span>
                        <span className="text-rose-900 font-medium">
                          {selectedOptionIndex !== null && selectedOptionIndex >= 0
                            ? activeChallenge.options[selectedOptionIndex]
                            : 'Time Expired'}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-start gap-2">
                        <span className="text-emerald-700 font-mono font-bold text-xs uppercase shrink-0 mt-0.5">🟢 Correct answer:</span>
                        <span className="text-emerald-950 font-black">
                          {activeChallenge.options[activeChallenge.correctIndex]}
                        </span>
                      </div>
                    </div>

                    {/* 💡 LEARNING MOMENT */}
                    <div className="mt-2.5 p-3.5 rounded-xl bg-white/90 border border-slate-200">
                      <div className="text-[11px] font-mono font-black text-amber-700 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                        <span>💡</span> LEARNING MOMENT
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                        {activeChallenge.whyRationale}
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={handleChallengeDismiss}
                        className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95 shadow-sm"
                      >
                        <span>CONTINUE</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EVENT NOTIFICATION (Ladder Climb / Snake Pitfall Modal) */}
      {/* ========================================================================= */}
      {eventNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-md rounded-3xl border-2 p-6 text-center shadow-2xl backdrop-blur-xl bg-white text-[#102A43] ${
            eventNotification.type === 'ladder'
              ? 'border-emerald-400 shadow-emerald-500/20'
              : eventNotification.type === 'avoided'
              ? 'border-blue-400 shadow-blue-500/20'
              : 'border-rose-400 shadow-rose-500/20'
          }`}>
            <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 text-3xl bg-slate-50 border border-slate-200 shadow-sm">
              {eventNotification.type === 'ladder' ? '🪜' : eventNotification.type === 'avoided' ? '🛡️' : '🐍'}
            </div>
            <h3 className={`text-xl font-black tracking-tight ${
              eventNotification.type === 'ladder'
                ? 'text-emerald-700'
                : eventNotification.type === 'avoided'
                ? 'text-blue-700'
                : 'text-rose-700'
            }`}>
              {eventNotification.title}
            </h3>

            <div className="flex items-center justify-center gap-2 my-2 font-mono text-xs font-bold">
              {eventNotification.marks !== undefined && (
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  +{eventNotification.marks} MARKS
                </span>
              )}
              {eventNotification.xp !== undefined && (
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  +{eventNotification.xp} XP
                </span>
              )}
            </div>

            <p className="text-xs text-slate-700 mt-2 leading-relaxed font-semibold">
              {eventNotification.description}
            </p>

            <div className="mt-4 text-[11px] font-mono text-slate-500 font-bold">
              {eventNotification.type === 'ladder' 
                ? `Climbing upward: Square ${eventNotification.from} 🪜 ➔ ${eventNotification.to}`
                : eventNotification.type === 'snake'
                ? `Moving downward: Square ${eventNotification.from} 🐍 ➔ ${eventNotification.to}`
                : `Holding position safely on Square ${eventNotification.from}`}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FINAL SCORE SCREEN (After Question 25) */}
      {/* ========================================================================= */}
      {showGrandMastery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-300 overflow-y-auto">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl p-6 sm:p-8 text-center relative my-6 text-[#102A43]">
            {/* 5-Step Diagnostic Cascade Display */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 mb-5 flex-wrap">
              {['RECOGNIZE', 'ASSESS', 'TEST', 'INTERPRET', 'DIAGNOSE'].map((step, idx) => (
                <React.Fragment key={step}>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold ${
                    cascadeStep >= idx + 1
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 border border-slate-200 text-slate-500'
                  }`}>
                    {step}
                  </span>
                  {idx < 4 && <span className="text-slate-400 text-xs">➔</span>}
                </React.Fragment>
              ))}
            </div>

            {/* Check if 80% Mastery condition met: correctAnswers >= 20 */}
            {gameState.correctAnswers >= 20 && gameState.finalChallengePassed ? (
              <div>
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30 mb-3 text-3xl">
                  🏆
                </div>
                <h2 className="text-2xl font-black text-[#102A43] tracking-tight uppercase">
                  🎉 LEVEL 1 MASTERED!
                </h2>
                <div className="text-sm font-bold text-amber-700 font-mono mt-0.5">
                  🏆 TB AWARENESS CHAMPION
                </div>
                <div className="my-2.5 inline-block px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-mono text-xs font-bold shadow-sm">
                  +500 XP REWARD
                </div>

                {/* Score & Accuracy Breakdown Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 text-left font-mono">
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                    <span className="text-[10px] text-[#64748B] uppercase block font-bold">SCORE</span>
                    <span className="text-base font-black text-amber-900">{gameState.score} / 250</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
                    <span className="text-[10px] text-[#64748B] uppercase block font-bold">ACCURACY</span>
                    <span className="text-base font-black text-emerald-800">{gameState.accuracy}%</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200">
                    <span className="text-[10px] text-[#64748B] uppercase block font-bold">CORRECT</span>
                    <span className="text-base font-black text-blue-900">{gameState.correctAnswers} / 25</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200">
                    <span className="text-[10px] text-[#64748B] uppercase block font-bold">TOTAL XP</span>
                    <span className="text-base font-black text-purple-900">{gameState.xp}</span>
                  </div>
                </div>

                {/* Category Performance Table */}
                <div className="my-4 text-left p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono">
                  <div className="text-[11px] uppercase tracking-wider text-[#64748B] font-bold mb-2 pb-1 border-b border-slate-200 flex justify-between">
                    <span>CATEGORY</span>
                    <span>PERFORMANCE</span>
                  </div>
                  <div className="space-y-1.5">
                    {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => {
                      const stat = categoryStats[catKey as ChallengeCategory];
                      const isGood = stat.correct >= Math.ceil(stat.total * 0.7);
                      return (
                        <div key={catKey} className="flex items-center justify-between text-slate-700">
                          <span>{label}</span>
                          <span className="flex items-center gap-2 font-bold">
                            <span>{stat.correct} / {stat.total}</span>
                            <span>{isGood ? '✅' : '⚠️'}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Unlock Level 2 Banner */}
                <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-teal-50 to-emerald-50 border border-blue-200 flex items-center justify-center gap-3 text-blue-900 font-mono text-sm font-bold shadow-sm">
                  <Unlock className="w-5 h-5 text-blue-600" />
                  <span>🔓 LEVEL 2 UNLOCKED — INVESTIGATION LEARNING</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {onProceedToLevel2 && (
                    <button
                      onClick={onProceedToLevel2}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#1677FF] via-[#00B8A9] to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <span>LAUNCH LEVEL 2 CASES</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                  {onBackToDashboard && (
                    <button
                      onClick={onBackToDashboard}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      RETURN TO DASHBOARD
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* 🔒 BELOW 80% — LEVEL 2 LOCKED & REPLAY WEAK AREAS */
              <div>
                <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-3">
                  <Lock className="w-8 h-8 text-amber-600" />
                </div>
                <h2 className="text-xl font-black text-[#102A43] tracking-tight uppercase">
                  🔒 LEVEL 2 LOCKED
                </h2>
                <div className="my-2 inline-block px-3.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-300 font-mono text-xs font-bold">
                  {gameState.correctAnswers} / 25 • {gameState.accuracy}% (80% REQUIRED)
                </div>

                <p className="text-sm text-slate-600 max-w-md mx-auto mt-2 leading-relaxed font-medium">
                  "You are close! Review the TB concepts you missed and try again."
                </p>

                {/* Score & Accuracy Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-4 text-left font-mono">
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
                    <span className="text-[10px] text-[#64748B] uppercase block font-bold">SCORE</span>
                    <span className="text-base font-black text-amber-900">{gameState.score} / 250</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200">
                    <span className="text-[10px] text-[#64748B] uppercase block font-bold">ACCURACY</span>
                    <span className="text-base font-black text-rose-700">{gameState.accuracy}%</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] text-[#64748B] uppercase block font-bold">CORRECT</span>
                    <span className="text-base font-black text-slate-800">{gameState.correctAnswers} / 25</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-200">
                    <span className="text-[10px] text-[#64748B] uppercase block font-bold">ACHIEVEMENT</span>
                    <span className="text-xs font-black text-blue-900 block truncate">{getScoreRanking(gameState.accuracy)}</span>
                  </div>
                </div>

                {/* Category Performance Table */}
                <div className="my-4 text-left p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono">
                  <div className="text-[11px] uppercase tracking-wider text-[#64748B] font-bold mb-2 pb-1 border-b border-slate-200 flex justify-between">
                    <span>CATEGORY</span>
                    <span>PERFORMANCE</span>
                  </div>
                  <div className="space-y-1.5">
                    {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => {
                      const stat = categoryStats[catKey as ChallengeCategory];
                      const isGood = stat.correct >= Math.ceil(stat.total * 0.7);
                      return (
                        <div key={catKey} className="flex items-center justify-between text-slate-700">
                          <span>{label}</span>
                          <span className="flex items-center gap-2 font-bold">
                            <span>{stat.correct} / {stat.total}</span>
                            <span>{isGood ? '✅' : '⚠️'}</span>
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* REPLAY WEAK AREAS ACTION */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                  <button
                    onClick={handleStartReplayWeakAreas}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>🔄 REPLAY WEAK AREAS</span>
                  </button>
                  {onBackToDashboard && (
                    <button
                      onClick={onBackToDashboard}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-bold uppercase tracking-wider"
                    >
                      DASHBOARD
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL: RESTART JOURNEY */}
      {showRestartConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 text-center shadow-2xl text-[#102A43]">
            <AlertTriangle className="w-11 h-11 text-amber-500 mx-auto mb-2" />
            <h4 className="text-base font-black text-[#102A43]">Restart Level 1 Journey?</h4>
            <p className="text-xs text-slate-600 mt-1 mb-5 leading-relaxed font-medium">
              This will reset your board position back to Square 1 while preserving your learning achievements.
            </p>
            <div className="flex items-center justify-center gap-2.5">
              <button
                onClick={() => setShowRestartConfirm(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold"
              >
                CANCEL
              </button>
              <button
                onClick={handleRestartJourney}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold shadow-md shadow-rose-500/25"
              >
                CONFIRM RESTART
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GAME INTRODUCTION / HOW TO PLAY MODAL */}
      <Level1HowToPlayModal
        isOpen={showHowToPlay}
        onClose={() => {
          setShowHowToPlay(false);
          try {
            localStorage.setItem('tbquest_intro_dismissed_v2', 'true');
          } catch (e) {}
          if (musicEnabled) {
            soundService.startAmbientMusic();
          }
        }}
        musicEnabled={musicEnabled}
        sfxEnabled={sfxEnabled}
        onToggleMusic={handleToggleMusic}
        onToggleSfx={handleToggleSfx}
      />

      {/* CSS STYLES FOR 3D DICE, SHIMMER & ANIMATIONS */}
      <style>{`
        .dice-face {
          position: absolute;
          width: 64px;
          height: 64px;
          background: linear-gradient(145deg, #ffffff, #f1f5f9);
          border: 1.5px solid #cbd5e1;
          border-radius: 14px;
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.9), inset 0 -2px 4px rgba(16,42,67,0.12), 0 4px 10px rgba(0,0,0,0.06);
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          grid-template-rows: repeat(3, 1fr);
          padding: 6px;
        }
        .dice-dot {
          width: 10px;
          height: 10px;
          background: radial-gradient(circle at 35% 35%, #1e40af, #0f172a);
          border-radius: 50%;
          box-shadow: inset 0 1px 2px rgba(0,0,0,0.6), 0 1px 1px rgba(255,255,255,0.6);
          justify-self: center;
          align-self: center;
        }
        .dice-dot.top-left { grid-column: 1; grid-row: 1; }
        .dice-dot.top-right { grid-column: 3; grid-row: 1; }
        .dice-dot.middle-left { grid-column: 1; grid-row: 2; }
        .dice-dot.center { grid-column: 2; grid-row: 2; }
        .dice-dot.middle-right { grid-column: 3; grid-row: 2; }
        .dice-dot.bottom-left { grid-column: 1; grid-row: 3; }
        .dice-dot.bottom-right { grid-column: 3; grid-row: 3; }

        .face-front  { transform: rotateY(0deg) translateZ(32px); }
        .face-back   { transform: rotateY(180deg) translateZ(32px); }
        .face-right  { transform: rotateY(90deg) translateZ(32px); }
        .face-left   { transform: rotateY(-90deg) translateZ(32px); }
        .face-top    { transform: rotateX(90deg) translateZ(32px); }
        .face-bottom { transform: rotateX(-90deg) translateZ(32px); }

        /* Progress Bar Moving Shine Reflection */
        .progress-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent);
          animation: shine 2.5s infinite;
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
