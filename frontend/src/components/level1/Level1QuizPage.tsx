import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  Trophy,
  CheckCircle2,
  XCircle,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle,
  Eye,
  Award,
  AlertCircle,
  FileText,
  User,
  Activity
} from 'lucide-react';
import { Level1Question, generateRandomLevel1Quiz } from '../../data/level1QuestionBank';
import { level1Service } from '../../services/level1Service';
import { soundService } from '../../services/soundService';

import { supabaseData } from '../../services/supabaseData';

import { useUserProgress } from '../../context/UserProgressContext';

interface Level1QuizPageProps {
  userId?: string | null;
  onFinishQuiz: (stats: {
    totalScore: number;
    percentage: number;
    correctCount: number;
    wrongCount: number;
    unansweredCount: number;
    xpEarned: number;
    badge: string;
    passed: boolean;
    durationSeconds: number;
    questions?: Level1Question[];
    userAnswers?: Record<number, number>;
  }) => void;
}

const TOTAL_QUESTIONS = 50;
const MARKS_PER_QUESTION = 2;
const MAX_SCORE = TOTAL_QUESTIONS * MARKS_PER_QUESTION; // 100 Marks
const EXAM_DURATION_SECONDS = 60 * 60; // 60 Minutes

export default function Level1QuizPage({ userId, onFinishQuiz }: Level1QuizPageProps) {
  const [questions, setQuestions] = useState<Level1Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));
  const [score, setScore] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(EXAM_DURATION_SECONDS);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [chosenOption, setChosenOption] = useState<number | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [activeAttemptId, setActiveAttemptId] = useState<string | null>(null);

  // Global localStorage progress context (Requirements 2, 3, 5, 9)
  const { recordQuestionAnswer } = useUserProgress();

  // Initialize or restore active attempt (from Supabase & LocalStorage)
  useEffect(() => {
    async function initQuizAttempt() {
      let restoredAnswers: Record<number, number> = {};

      if (userId) {
        const attempt = await supabaseData.getOrCreateActiveQuizAttempt(userId);
        if (attempt) {
          setActiveAttemptId(attempt.id);
        }

        const restoredSupabase = await supabaseData.restoreQuizAttempt(userId);
        if (restoredSupabase && restoredSupabase.answersMap) {
          restoredAnswers = restoredSupabase.answersMap;
        }
      }

      const saved = level1Service.loadActiveAttempt();
      if (saved && saved.questions && saved.questions.length === TOTAL_QUESTIONS && !saved.isCompleted) {
        setQuestions(saved.questions);
        const restoredIndex = saved.currentQuestionIndex || 0;
        setCurrentIndex(restoredIndex);
        const mergedAnswers = { ...restoredAnswers, ...(saved.userAnswers || {}) };
        setUserAnswers(mergedAnswers);
        setScore(saved.score || 0);
        const elapsed = saved.elapsedSeconds || 0;
        setRemainingSeconds(Math.max(0, EXAM_DURATION_SECONDS - elapsed));

        const restoredVisited = saved.visitedQuestions
          ? new Set(saved.visitedQuestions)
          : new Set(Object.keys(mergedAnswers).map(Number).concat([restoredIndex]));
        restoredVisited.add(restoredIndex);
        setVisitedQuestions(restoredVisited);

        const currentAnswer = mergedAnswers[restoredIndex];
        if (currentAnswer !== undefined) {
          setIsAnswered(true);
          setChosenOption(currentAnswer);
        }
      } else {
        const newQuestions = generateRandomLevel1Quiz();
        setQuestions(newQuestions);
        setCurrentIndex(0);
        setUserAnswers(restoredAnswers);
        setScore(0);
        setRemainingSeconds(EXAM_DURATION_SECONDS);
        setVisitedQuestions(new Set([0]));
        setIsAnswered(false);
        setChosenOption(null);
      }
    }

    initQuizAttempt();
  }, [userId]);

  // Track visited questions whenever currentIndex changes
  useEffect(() => {
    if (questions.length > 0) {
      setVisitedQuestions(prev => {
        if (prev.has(currentIndex)) return prev;
        const next = new Set(prev);
        next.add(currentIndex);
        return next;
      });
    }
  }, [currentIndex, questions.length]);

  // Final Exam Submission Handler
  const handleFinalSubmit = useCallback((finalAnswers: Record<number, number>, currentQuestions: Level1Question[], timeElapsed: number) => {
    let correctCount = 0;
    let computedScore = 0;

    currentQuestions.forEach((q, idx) => {
      if (finalAnswers[idx] === q.correctIndex) {
        correctCount += 1;
        computedScore += MARKS_PER_QUESTION;
      }
    });

    const answeredCount = Object.keys(finalAnswers).length;
    const wrongCount = answeredCount - correctCount;
    const unansweredCount = TOTAL_QUESTIONS - answeredCount;
    const percentage = Math.round((computedScore / MAX_SCORE) * 100);
    const passed = computedScore >= 80; // 80% passing threshold (80 marks)

    let badge = 'Needs Revision';
    if (computedScore >= 95) badge = 'Master Gold';
    else if (computedScore >= 90) badge = 'Expert Silver';
    else if (computedScore >= 80) badge = 'Proficient Scholar';

    const finalStats = {
      totalScore: computedScore,
      percentage,
      correctCount,
      wrongCount,
      unansweredCount,
      xpEarned: computedScore,
      badge,
      passed,
      durationSeconds: timeElapsed,
      questions: currentQuestions,
      userAnswers: finalAnswers
    };

    // Clear saved draft state
    level1Service.clearActiveAttempt();

    // Silently sync results to database in background
    level1Service.syncCompletedResultToSupabase(userId, finalStats);

    onFinishQuiz(finalStats);
  }, [userId, onFinishQuiz]);

  // 60-Minute Countdown Timer Effect
  useEffect(() => {
    if (questions.length === 0) return;

    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto submit when time runs out
          handleFinalSubmit(userAnswers, questions, EXAM_DURATION_SECONDS);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [questions, userAnswers, handleFinalSubmit]);

  // Format remaining time as mm:ss
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center text-brand-royal dark:text-blue-400 font-mono flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
        <span className="font-semibold text-slate-700 dark:text-slate-200">Loading Official Level 1 Medical Assessment Portal...</span>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const elapsedSeconds = EXAM_DURATION_SECONDS - remainingSeconds;

  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered) return;

    soundService.playClick();

    const isCorrect = optionIndex === currentQ.correctIndex;
    if (isCorrect) {
      soundService.playCorrect();
    } else {
      soundService.playIncorrect();
    }

    const newAnswers = { ...userAnswers, [currentIndex]: optionIndex };
    const newScore = isCorrect ? score + MARKS_PER_QUESTION : score;

    setUserAnswers(newAnswers);
    setScore(newScore);
    setIsAnswered(true);
    setChosenOption(optionIndex);

    // Update global localStorage user progress (Requirements 2, 3, 5, 9)
    recordQuestionAnswer(isCorrect);

    // Live Sync to Supabase (Sections 6, 7, 8)
    const totalAns = Object.keys(newAnswers).length;
    let totalCorr = 0;
    Object.entries(newAnswers).forEach(([qIdxStr, ansIdx]) => {
      const qIdx = parseInt(qIdxStr, 10);
      if (questions[qIdx] && ansIdx === questions[qIdx].correctIndex) {
        totalCorr += 1;
      }
    });
    const totalWrng = totalAns - totalCorr;
    const optionLetter = String.fromCharCode(65 + optionIndex);

    if (userId && activeAttemptId) {
      supabaseData.recordAnswerAndXP(
        userId,
        activeAttemptId,
        currentIndex + 1,
        optionLetter,
        isCorrect,
        totalAns,
        totalCorr,
        totalWrng
      );
    }

    // Save backup state to LocalStorage
    level1Service.saveActiveAttempt({
      questions,
      currentQuestionIndex: currentIndex,
      userAnswers: newAnswers,
      visitedQuestions: Array.from(visitedQuestions),
      score: newScore,
      startTime: Date.now(),
      elapsedSeconds,
      isCompleted: false
    });
  };

  const handleJumpToQuestion = (idx: number) => {
    setCurrentIndex(idx);
    setIsAnswered(userAnswers[idx] !== undefined);
    setChosenOption(userAnswers[idx] ?? null);

    level1Service.saveActiveAttempt({
      questions,
      currentQuestionIndex: idx,
      userAnswers,
      visitedQuestions: Array.from(visitedQuestions),
      score,
      startTime: Date.now(),
      elapsedSeconds,
      isCompleted: false
    });
  };

  const handleNextQuestion = () => {
    if (currentIndex < TOTAL_QUESTIONS - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setIsAnswered(userAnswers[nextIdx] !== undefined);
      setChosenOption(userAnswers[nextIdx] ?? null);

      level1Service.saveActiveAttempt({
        questions,
        currentQuestionIndex: nextIdx,
        userAnswers,
        visitedQuestions: Array.from(visitedQuestions),
        score,
        startTime: Date.now(),
        elapsedSeconds,
        isCompleted: false
      });
    } else {
      setShowSubmitModal(true);
    }
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setIsAnswered(userAnswers[prevIdx] !== undefined);
      setChosenOption(userAnswers[prevIdx] ?? null);
    }
  };

  // Live Palette Calculations
  let answeredCorrectCount = 0;
  let answeredWrongCount = 0;

  questions.forEach((q, idx) => {
    const ans = userAnswers[idx];
    if (ans !== undefined) {
      if (ans === q.correctIndex) {
        answeredCorrectCount++;
      } else {
        answeredWrongCount++;
      }
    }
  });

  const answeredTotalCount = Object.keys(userAnswers).length;
  const visitedCount = visitedQuestions.size;
  const notVisitedCount = TOTAL_QUESTIONS - visitedCount;
  const remainingCount = TOTAL_QUESTIONS - answeredTotalCount;
  const progressPercent = Math.round((answeredTotalCount / TOTAL_QUESTIONS) * 100);
  const isTimeLow = remainingSeconds < 300; // Under 5 mins

  return (
    <div className="bg-alabaster dark:bg-[#0b1220] p-3 sm:p-6 max-w-7xl mx-auto space-y-6 text-ink-900 dark:text-slate-100 min-h-screen font-sans">
      {/* 1. Top Fixed Examination Header (Clean White Medical Theme) */}
      <header className="sticky top-16 sm:top-20 z-30 tq-card p-4 sm:p-5 rounded-2xl shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Institutional Branding */}
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-[#111c30] text-brand-royal dark:text-blue-400 rounded-xl border border-blue-100 shrink-0">
              <Stethoscope size={22} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-ink-900 dark:text-slate-100 leading-tight">
                TB Quest • National Medical Assessment Portal
              </h1>
              <span className="text-xs font-semibold text-brand-royal dark:text-blue-400">Official Level 1 Competency Examination</span>
            </div>
          </div>

          {/* Right Metrics: Countdown Timer & Live Score */}
          <div className="flex items-center gap-2 sm:gap-3 text-xs font-mono">
            {/* Live Marks */}
            <div className="flex items-center gap-1.5 px-3.5 py-2 bg-alabaster dark:bg-[#0b1220] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xs">
              <Trophy size={16} className="text-amber-500" />
              <span className="text-slate-500 dark:text-slate-400 font-medium">Score:</span>
              <span className="font-extrabold text-ink-900 dark:text-slate-100 text-sm">{score} / {MAX_SCORE}</span>
            </div>

            {/* Countdown Timer (Top-Right) */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-sm shadow-xs transition-all ${
              isTimeLow
                ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse'
                : 'bg-blue-50 dark:bg-[#111c30] border-blue-200 text-brand-royal dark:text-blue-400'
            }`}>
              <Clock size={16} className={isTimeLow ? 'text-rose-600' : 'text-brand-royal dark:text-blue-400'} />
              <span className="font-mono tracking-wider">{formatTime(remainingSeconds)}</span>
            </div>
          </div>
        </div>

        {/* Animated Progress Bar & Percentage */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Questions Completed: <strong className="text-brand-royal dark:text-blue-400 font-extrabold ml-1">{answeredTotalCount} / {TOTAL_QUESTIONS}</strong>
            </span>
            <span className="font-bold text-brand-royal dark:text-blue-400 bg-blue-50 dark:bg-[#111c30] border border-blue-200 px-2.5 py-0.5 rounded-md">
              {progressPercent}% Completed
            </span>
          </div>
          <div className="w-full bg-[#F1F5F9] h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
            <div
              className="tq-progress-bar ease-out shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* 2. Live Question Palette Summary Widget (Clean White Card) */}
      <div className="tq-card rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
          <h3 className="text-xs font-extrabold text-brand-royal dark:text-blue-400 uppercase tracking-wider font-mono flex items-center gap-2">
            <Award size={16} /> Question Palette Summary
          </h3>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Click any circle number to navigate</span>
        </div>

        {/* 6 Stats Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs font-mono">
          <div className="bg-alabaster dark:bg-[#0b1220] border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block">Total Questions</span>
            <span className="text-base font-black text-ink-900 dark:text-slate-100">50</span>
          </div>

          <div className="tq-chip tq-chip-teal rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-emerald-700 uppercase font-semibold block flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Correct
            </span>
            <span className="text-base font-black text-emerald-700">{answeredCorrectCount}</span>
          </div>

          <div className="tq-chip tq-chip-coral rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-rose-700 uppercase font-semibold block flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Wrong
            </span>
            <span className="text-base font-black text-rose-700">{answeredWrongCount}</span>
          </div>

          <div className="tq-chip tq-chip-royal rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-brand-royal dark:text-blue-400 uppercase font-semibold block flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] inline-block" /> Visited
            </span>
            <span className="text-base font-black text-brand-royal dark:text-blue-400">{visitedCount}</span>
          </div>

          <div className="bg-alabaster dark:bg-[#0b1220] border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold block flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" /> Not Visited
            </span>
            <span className="text-base font-black text-slate-600 dark:text-slate-400">{notVisitedCount}</span>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-amber-700 uppercase font-semibold block">Remaining</span>
            <span className="text-base font-black text-amber-700">{remainingCount}</span>
          </div>
        </div>
      </div>

      {/* 3. Circular Question Navigation Buttons */}
      <div className="tq-card rounded-2xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-400">
          <span className="font-bold text-ink-900 dark:text-slate-100">Question Navigator (1 to 50)</span>

          {/* Color Legend */}
          <div className="flex flex-wrap items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" /> Current
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Correct
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" /> Wrong
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#2563EB] inline-block" /> Visited
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-slate-300 inline-block" /> Not Visited
            </span>
          </div>
        </div>

        {/* 50 Circular Buttons (○ 1 ○ 2 ○ 3 ... ○ 50) */}
        <div className="flex flex-wrap items-center justify-start gap-2 max-h-44 overflow-y-auto p-1 custom-scrollbar">
          {questions.map((_, qIdx) => {
            const isCurr = qIdx === currentIndex;
            const ans = userAnswers[qIdx];
            const isVisited = visitedQuestions.has(qIdx);

            let circleStyle = '';
            if (isCurr) {
              // 🟡 Yellow - Current Question
              circleStyle = 'bg-amber-400 text-slate-950 font-extrabold border-2 border-amber-500 shadow-md scale-105 z-10';
            } else if (ans !== undefined) {
              if (ans === questions[qIdx].correctIndex) {
                // 🟢 Green - Answered Correctly
                circleStyle = 'bg-emerald-500 text-white font-bold border-2 border-emerald-600 shadow-xs hover:bg-emerald-600';
              } else {
                // 🔴 Red - Answered Incorrectly
                circleStyle = 'bg-rose-500 text-white font-bold border-2 border-rose-600 shadow-xs hover:bg-rose-600';
              }
            } else if (isVisited) {
              // 🔵 Blue - Visited but not answered
              circleStyle = 'bg-brand-royal text-white font-bold border-2 border-brand-royal-deep shadow-xs hover:bg-brand-royal-deep';
            } else {
              // ⚪ White/Grey - Not visited yet
              circleStyle = 'bg-alabaster dark:bg-[#0b1220] text-slate-600 dark:text-slate-400 font-semibold border-2 border-slate-200 dark:border-slate-700 hover:border-slate-400 hover:bg-white';
            }

            return (
              <button
                key={qIdx}
                onClick={() => handleJumpToQuestion(qIdx)}
                title={`Question ${qIdx + 1}`}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-mono transition-all duration-200 cursor-pointer ${circleStyle}`}
              >
                {qIdx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Large Question Display Card (White Background, 16px Rounded) */}
      <div className="tq-card rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        {/* Category & Marks Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-4">
          <span className="px-3.5 py-1 bg-blue-50 dark:bg-[#111c30] text-brand-royal dark:text-blue-400 border border-blue-200 rounded-full text-xs font-mono font-semibold">
            {currentQ.category} • {currentQ.type === 'scenario' ? 'Clinical Vignette' : 'Core Theory'}
          </span>
          <span className="tq-chip tq-chip-teal px-3 py-1 font-mono">
            +2 Marks
          </span>
        </div>

        {/* Clinical Scenario Vignette Box (if applicable) */}
        {currentQ.patientScenario && (
          <div className="bg-alabaster dark:bg-[#0b1220] border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center gap-2 text-brand-royal dark:text-blue-400 font-bold text-xs uppercase tracking-wide">
              <Stethoscope size={16} /> Patient Clinical Vignette Record
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-slate-700 dark:text-slate-200 font-mono bg-white p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>Age / Sex: <strong className="text-ink-900 dark:text-slate-100">{currentQ.patientScenario.age}y / {currentQ.patientScenario.gender}</strong></div>
              <div>Duration: <strong className="text-ink-900 dark:text-slate-100">{currentQ.patientScenario.duration}</strong></div>
              {currentQ.patientScenario.vitals && (
                <div>Vitals: <strong className="text-ink-900 dark:text-slate-100">{currentQ.patientScenario.vitals}</strong></div>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed pt-1">
              <strong className="text-brand-royal dark:text-blue-400">Chief Complaint & History:</strong> {currentQ.patientScenario.chiefComplaint}.
            </p>
            {currentQ.patientScenario.labOrRadiology && (
              <p className="text-xs sm:text-sm text-brand-royal dark:text-blue-400 leading-relaxed font-mono bg-blue-50/70 p-2.5 rounded-md border border-blue-200">
                <strong>Investigations / Diagnostic Labs:</strong> {currentQ.patientScenario.labOrRadiology}
              </p>
            )}
          </div>
        )}

        {/* Question Statement */}
        <h2 className="text-base sm:text-xl font-bold text-ink-900 dark:text-slate-100 leading-relaxed tracking-tight">
          <span className="text-brand-royal dark:text-blue-400 font-mono mr-2">Question {currentIndex + 1} of {TOTAL_QUESTIONS}:</span>
          {currentQ.question}
        </h2>

        {/* 5. Options List with Live Color Animations */}
        <div className="space-y-3">
          {currentQ.options.map((optionText, oIdx) => {
            const isSelected = chosenOption === oIdx;
            const isCorrect = oIdx === currentQ.correctIndex;

            let optionStyle = 'bg-white border-slate-200 dark:border-slate-700 text-ink-900 dark:text-slate-100 hover:border-brand-teal hover:bg-teal-50/40 dark:hover:bg-teal-950/40';

            if (isAnswered) {
              if (isCorrect) {
                // Correct Option: Green background + Green border
                optionStyle = 'bg-emerald-50 dark:bg-emerald-900/50 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold shadow-xs ring-2 ring-emerald-500';
              } else if (isSelected && !isCorrect) {
                // Selected Wrong Option: Red background + Red border
                optionStyle = 'bg-rose-50 dark:bg-rose-900/50 border-2 border-rose-500 text-rose-900 dark:text-rose-100 font-bold shadow-xs ring-2 ring-rose-500';
              } else {
                // Other options disabled
                optionStyle = 'bg-slate-50 border-slate-200 dark:border-slate-700 text-slate-400 opacity-60';
              }
            }

            return (
              <button
                key={oIdx}
                onClick={() => handleSelectOption(oIdx)}
                disabled={isAnswered}
                className={`w-full p-4 sm:p-5 text-left rounded-xl border text-xs sm:text-base transition-all duration-200 flex items-start gap-3.5 outline-none cursor-pointer ${optionStyle}`}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 border ${
                  isAnswered && isCorrect
                    ? 'bg-emerald-500 text-white border-emerald-600'
                    : isAnswered && isSelected && !isCorrect
                    ? 'bg-rose-500 text-white border-rose-600'
                    : 'bg-alabaster dark:bg-[#0b1220] text-ink-900 dark:text-slate-100 border-slate-200 dark:border-slate-700'
                }`}>
                  {String.fromCharCode(65 + oIdx)}
                </span>
                <span className="flex-1 leading-relaxed">{optionText}</span>

                {isAnswered && isCorrect && (
                  <CheckCircle2 size={20} className="text-emerald-600 shrink-0 mt-0.5" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle size={20} className="text-rose-600 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Feedback & Clinical Explanation Banner */}
        {isAnswered && (
          <div className="pt-2 space-y-4 animate-in fade-in duration-300">
            {chosenOption === currentQ.correctIndex ? (
              <div className="tq-card p-4 sm:p-5 rounded-xl space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-emerald-800 font-bold">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-emerald-600" /> Correct Answer!
                  </span>
                  <span className="px-3 py-1 bg-emerald-100 rounded-full font-mono text-emerald-800 text-xs">
                    +2 Marks
                  </span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-mono pt-1">
                  <strong>Clinical Rationale:</strong> {currentQ.explanation}
                </p>
              </div>
            ) : (
              <div className="tq-card p-4 sm:p-5 rounded-xl space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between text-rose-800 font-bold">
                  <span className="flex items-center gap-2">
                    <XCircle size={20} className="text-rose-600" /> Incorrect Answer
                  </span>
                  <span className="px-3 py-1 bg-rose-100 rounded-full font-mono text-rose-800 text-xs">
                    0 Marks
                  </span>
                </div>
                <p className="text-rose-900 font-semibold">
                  Correct Choice: <span className="underline font-bold text-ink-900 dark:text-slate-100">{currentQ.options[currentQ.correctIndex]}</span>
                </p>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-mono pt-1">
                  <strong>Clinical Rationale:</strong> {currentQ.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* 6. Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          {/* Previous Button */}
          <button
            onClick={handlePrevQuestion}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 px-5 py-3 tq-card hover:bg-alabaster dark:bg-[#0b1220] disabled:opacity-40 disabled:pointer-events-none text-ink-900 dark:text-slate-100 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-xs"
          >
            <ChevronLeft size={18} />
            <span>Previous</span>
          </button>

          {/* Question Counter Indicator */}
          <span className="text-xs text-slate-600 dark:text-slate-400 font-mono font-medium">
            Question <strong className="text-brand-royal dark:text-blue-400">{currentIndex + 1}</strong> of {TOTAL_QUESTIONS}
          </span>

          <div className="flex items-center gap-2">
            {/* Submit Quiz Button */}
            <button
              onClick={() => setShowSubmitModal(true)}
              className="tq-btn-primary touch-target flex items-center gap-2 px-5 py-3 font-extrabold rounded-xl text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            >
              <Send size={16} />
              <span>Submit Quiz</span>
            </button>

            {/* Next Button */}
            <button
              onClick={handleNextQuestion}
              className="flex items-center gap-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <span>{currentIndex < TOTAL_QUESTIONS - 1 ? 'Next' : 'Review & Submit'}</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Submission Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="tq-card rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-brand-royal dark:text-blue-400">
              <AlertCircle size={28} />
              <h3 className="text-lg font-bold text-ink-900 dark:text-slate-100">Submit Level 1 Assessment?</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
              You have answered <strong className="text-emerald-600">{answeredTotalCount}</strong> of <strong className="text-ink-900 dark:text-slate-100">50</strong> questions.
              {remainingCount > 0 && (
                <span className="text-amber-600 block mt-1">
                  ⚠️ Note: You still have <strong>{remainingCount}</strong> unanswered questions.
                </span>
              )}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-alabaster dark:bg-[#0b1220] p-3 rounded-xl border border-slate-200 dark:border-slate-700">
              <div>Correct: <strong className="text-emerald-600">{answeredCorrectCount}</strong></div>
              <div>Wrong: <strong className="text-rose-600">{answeredWrongCount}</strong></div>
              <div>Visited: <strong className="text-brand-royal dark:text-blue-400">{visitedCount}</strong></div>
              <div>Unanswered: <strong className="text-amber-600">{remainingCount}</strong></div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2.5 bg-alabaster dark:bg-[#0b1220] hover:bg-slate-100 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Continue Exam
              </button>
              <button
                onClick={() => {
                  setShowSubmitModal(false);
                  handleFinalSubmit(userAnswers, questions, elapsedSeconds);
                }}
                className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
              >
                Confirm Submission
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
