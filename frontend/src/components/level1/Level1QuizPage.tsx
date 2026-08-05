import React, { useState, useEffect, useCallback } from 'react';
import {
  Clock,
  Trophy,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Stethoscope,
  Grid,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Send
} from 'lucide-react';
import { Level1Question, generateRandomLevel1Quiz } from '../../data/level1QuestionBank';
import { level1Service } from '../../services/level1Service';
import { soundService } from '../../services/soundService';

interface Level1QuizPageProps {
  userId?: string | null;
  onFinishQuiz: (stats: {
    totalScore: number;
    percentage: number;
    correctCount: number;
    wrongCount: number;
    xpEarned: number;
    badge: string;
    passed: boolean;
    durationSeconds: number;
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
  const [score, setScore] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(EXAM_DURATION_SECONDS);
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [chosenOption, setChosenOption] = useState<number | null>(null);

  // Initialize or restore active attempt
  useEffect(() => {
    const saved = level1Service.loadActiveAttempt();
    if (saved && saved.questions && saved.questions.length === TOTAL_QUESTIONS && !saved.isCompleted) {
      setQuestions(saved.questions);
      setCurrentIndex(saved.currentQuestionIndex || 0);
      setUserAnswers(saved.userAnswers || {});
      setScore(saved.score || 0);
      const elapsed = saved.elapsedSeconds || 0;
      setRemainingSeconds(Math.max(0, EXAM_DURATION_SECONDS - elapsed));

      const currentAnswer = saved.userAnswers?.[saved.currentQuestionIndex || 0];
      if (currentAnswer !== undefined) {
        setIsAnswered(true);
        setChosenOption(currentAnswer);
      }
    } else {
      // Generate new randomized 50-question attempt
      const newQuestions = generateRandomLevel1Quiz();
      setQuestions(newQuestions);
      setCurrentIndex(0);
      setUserAnswers({});
      setScore(0);
      setRemainingSeconds(EXAM_DURATION_SECONDS);
      setIsAnswered(false);
      setChosenOption(null);
    }
  }, []);

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

    const wrongCount = TOTAL_QUESTIONS - correctCount;
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
      xpEarned: computedScore,
      badge,
      passed,
      durationSeconds: timeElapsed
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
      <div className="p-8 text-center text-cyan-400 font-mono flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        <span>Initializing Official Level 1 Assessment Portal...</span>
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

    // Save state to LocalStorage
    level1Service.saveActiveAttempt({
      questions,
      currentQuestionIndex: currentIndex,
      userAnswers: newAnswers,
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
        score,
        startTime: Date.now(),
        elapsedSeconds,
        isCompleted: false
      });
    } else {
      handleFinalSubmit(userAnswers, questions, elapsedSeconds);
    }
  };

  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round(((currentIndex + 1) / TOTAL_QUESTIONS) * 100);
  const isTimeLow = remainingSeconds < 300; // Under 5 mins

  return (
    <div className="p-3 sm:p-6 max-w-5xl mx-auto space-y-4 sm:space-y-6 text-white min-h-screen">
      {/* Top Fixed Sticky Examination Header */}
      <header className="sticky top-16 sm:top-20 z-30 bg-slate-950/95 backdrop-blur-md p-4 rounded-2xl border border-cyan-500/40 shadow-2xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Institutional Branding */}
          <div className="flex items-center gap-3">
            <img
              src="/nit_logo.png"
              alt="NIT Logo"
              className="w-8 h-8 object-contain shrink-0"
            />
            <div>
              <h1 className="text-xs sm:text-sm font-extrabold text-white leading-none">TB Quest • National Medical Portal</h1>
              <span className="text-[11px] font-semibold text-cyan-400 font-mono">Official Level 1 Assessment</span>
            </div>
          </div>

          {/* Metrics: Countdown Timer, Marks Counter, Question Counter, Palette Toggle */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-mono">
            {/* 60-Min Countdown Timer */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${
              isTimeLow ? 'bg-rose-950 border-rose-500 text-rose-300 animate-pulse' : 'bg-slate-900 border-slate-800 text-cyan-300'
            }`}>
              <Clock size={14} className={isTimeLow ? 'text-rose-400' : 'text-cyan-400'} />
              <span className="font-extrabold">{formatTime(remainingSeconds)}</span>
            </div>

            {/* Live Marks */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-amber-500/30 rounded-xl">
              <Trophy size={14} className="text-amber-400" />
              <span className="text-slate-400">Score:</span>
              <span className="font-extrabold text-amber-300">{score} / {MAX_SCORE}</span>
            </div>

            {/* Question Progress */}
            <div className="px-3 py-1.5 bg-cyan-950 border border-cyan-500/30 rounded-xl font-bold text-cyan-300">
              Q {currentIndex + 1} of {TOTAL_QUESTIONS}
            </div>

            {/* Question Grid Palette Button */}
            <button
              onClick={() => setIsPaletteOpen(!isPaletteOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-slate-200 font-bold transition-colors cursor-pointer"
            >
              <Grid size={14} className="text-cyan-400" />
              <span>Palette ({answeredCount}/{TOTAL_QUESTIONS})</span>
            </button>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div>
          <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
            <span>Question {currentIndex + 1} of {TOTAL_QUESTIONS}</span>
            <span>{answeredCount} Answered ({Math.round((answeredCount/TOTAL_QUESTIONS)*100)}%)</span>
          </div>
          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Question Palette Drawer (Collapsible Grid 1 to 50) */}
      {isPaletteOpen && (
        <div className="bg-slate-950/95 border border-cyan-500/40 rounded-3xl p-5 space-y-3 shadow-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider flex items-center gap-2">
              <Grid size={14} /> Question Navigation Palette (50 Questions)
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Click any number to jump</span>
          </div>

          <div className="grid grid-cols-10 sm:grid-cols-10 md:grid-cols-25 gap-1.5 text-xs font-mono max-h-48 overflow-y-auto p-1">
            {questions.map((_, qIdx) => {
              const isCurr = qIdx === currentIndex;
              const isAns = userAnswers[qIdx] !== undefined;

              let btnClass = 'bg-slate-900 border-slate-800 text-slate-400 hover:border-cyan-500/50';
              if (isCurr) {
                btnClass = 'bg-cyan-600 border-white text-white font-black ring-2 ring-cyan-400/50';
              } else if (isAns) {
                btnClass = 'bg-emerald-950 border-emerald-500/60 text-emerald-300 font-bold';
              }

              return (
                <button
                  key={qIdx}
                  onClick={() => handleJumpToQuestion(qIdx)}
                  className={`h-8 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${btnClass}`}
                >
                  {qIdx + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Question Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-5 shadow-xl">
        {/* Question Category & Marks Indicator */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800/60 rounded-full text-xs font-mono font-semibold">
            {currentQ.category} • {currentQ.type === 'scenario' ? 'Clinical Vignette' : 'Core Theory'}
          </span>
          <span className="text-xs text-emerald-400 font-mono font-bold">
            +2 Marks
          </span>
        </div>

        {/* Clinical Scenario Vignette Card (if applicable) */}
        {currentQ.patientScenario && (
          <div className="bg-slate-950/80 border border-cyan-500/30 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
              <Stethoscope size={16} /> Patient Clinical Vignette:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-300 font-mono bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div>Age/Sex: <strong className="text-white">{currentQ.patientScenario.age}y / {currentQ.patientScenario.gender}</strong></div>
              <div>Duration: <strong className="text-white">{currentQ.patientScenario.duration}</strong></div>
              {currentQ.patientScenario.vitals && <div>Vitals: <strong className="text-white">{currentQ.patientScenario.vitals}</strong></div>}
            </div>
            <p className="text-xs text-slate-200 leading-relaxed pt-1">
              <strong>Chief Complaint & History:</strong> {currentQ.patientScenario.chiefComplaint}.
            </p>
            {currentQ.patientScenario.labOrRadiology && (
              <p className="text-xs text-cyan-300 leading-relaxed font-mono">
                <strong>Investigations / Findings:</strong> {currentQ.patientScenario.labOrRadiology}
              </p>
            )}
          </div>
        )}

        {/* Question Statement */}
        <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
          Question {currentIndex + 1} of {TOTAL_QUESTIONS}: {currentQ.question}
        </h2>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((optionText, oIdx) => {
            const isSelected = chosenOption === oIdx;
            const isCorrect = oIdx === currentQ.correctIndex;

            let optionStyle = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-cyan-500/60 hover:bg-slate-900';

            if (isAnswered) {
              if (isCorrect) {
                optionStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-100 font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]';
              } else if (isSelected && !isCorrect) {
                optionStyle = 'bg-rose-950/90 border-rose-500 text-rose-100 font-bold shadow-[0_0_15px_rgba(244,63,94,0.2)]';
              } else {
                optionStyle = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={oIdx}
                onClick={() => handleSelectOption(oIdx)}
                disabled={isAnswered}
                className={`w-full p-4 text-left rounded-2xl border text-xs sm:text-sm transition-all duration-200 flex items-start gap-3 outline-none cursor-pointer ${optionStyle}`}
              >
                <span className="w-6 h-6 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  {String.fromCharCode(65 + oIdx)}
                </span>
                <span className="flex-1 leading-relaxed">{optionText}</span>

                {isAnswered && isCorrect && (
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                )}
                {isAnswered && isSelected && !isCorrect && (
                  <XCircle size={18} className="text-rose-400 shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Feedback & Navigation */}
        {isAnswered && (
          <div className="pt-2 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {chosenOption === currentQ.correctIndex ? (
              <div className="bg-emerald-950/80 border border-emerald-500/60 p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-emerald-300 font-bold">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={18} /> ✔ Correct Answer
                  </span>
                  <span className="px-2.5 py-0.5 bg-emerald-900 rounded-full font-mono text-emerald-200">
                    +2 Marks
                  </span>
                </div>
                <p className="text-slate-200 leading-relaxed font-mono">
                  {currentQ.explanation}
                </p>
              </div>
            ) : (
              <div className="bg-rose-950/80 border border-rose-500/60 p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between text-rose-300 font-bold">
                  <span className="flex items-center gap-2">
                    <XCircle size={18} /> ✘ Incorrect Answer
                  </span>
                  <span className="px-2.5 py-0.5 bg-rose-900 rounded-full font-mono text-rose-200">
                    0 Marks
                  </span>
                </div>
                <p className="text-rose-200 font-semibold">
                  Correct Answer: <span className="underline">{currentQ.options[currentQ.correctIndex]}</span>
                </p>
                <p className="text-slate-200 leading-relaxed font-mono pt-1">
                  Explanation: {currentQ.explanation}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Bottom Pagination Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={() => handleJumpToQuestion(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-900 disabled:opacity-30 disabled:pointer-events-none text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
          >
            <ChevronLeft size={16} /> Previous
          </button>

          <span className="text-xs text-slate-400 font-mono">
            {answeredCount} of {TOTAL_QUESTIONS} Answered
          </span>

          <button
            onClick={handleNextQuestion}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
          >
            <span>{currentIndex < TOTAL_QUESTIONS - 1 ? 'Next Question' : 'Submit Final Exam'}</span>
            {currentIndex < TOTAL_QUESTIONS - 1 ? <ChevronRight size={16} /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

