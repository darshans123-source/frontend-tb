import React, { useState, useEffect } from 'react';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  BookOpen,
  Eye,
  HelpCircle,
  Stethoscope,
  Filter,
  ArrowLeft,
  Award
} from 'lucide-react';
import { soundService } from '../../services/soundService';
import { Level1Question } from '../../data/level1QuestionBank';

interface Level1ResultPageProps {
  stats: {
    totalScore: number;
    percentage: number;
    correctCount: number;
    wrongCount: number;
    unansweredCount?: number;
    xpEarned: number;
    badge: string;
    passed: boolean;
    durationSeconds: number;
    questions?: Level1Question[];
    userAnswers?: Record<number, number>;
  };
  onRetry: () => void;
  onProceedToLevel2?: () => void;
  onBackToModules: () => void;
}

export default function Level1ResultPage({
  stats,
  onRetry,
  onProceedToLevel2,
  onBackToModules
}: Level1ResultPageProps) {
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [filterMode, setFilterMode] = useState<'all' | 'correct' | 'wrong' | 'unanswered'>('all');

  useEffect(() => {
    if (stats.passed) {
      soundService.playTrophy();
    } else {
      soundService.playIncorrect();
    }
  }, [stats.passed]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalQuestions = 50;
  const unansweredCount = stats.unansweredCount ?? (totalQuestions - stats.correctCount - stats.wrongCount);

  // Review Mode UI
  if (isReviewing) {
    const questions = stats.questions || [];
    const userAnswers = stats.userAnswers || {};

    const filteredQuestions = questions.filter((q, qIdx) => {
      const ans = userAnswers[qIdx];
      if (filterMode === 'correct') return ans === q.correctIndex;
      if (filterMode === 'wrong') return ans !== undefined && ans !== q.correctIndex;
      if (filterMode === 'unanswered') return ans === undefined;
      return true;
    });

    return (
      <div className="bg-alabaster dark:bg-[#0b1220] p-4 sm:p-6 max-w-6xl mx-auto space-y-6 text-ink-900 dark:text-slate-100 min-h-screen font-sans">
        {/* Sticky Review Header */}
        <div className="sticky top-16 sm:top-20 z-30 tq-card p-4 sm:p-5 rounded-2xl shadow-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsReviewing(false)}
                className="p-2 bg-alabaster dark:bg-[#0b1220] hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
                title="Back to Summary"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-base sm:text-lg font-extrabold text-ink-900 dark:text-slate-100 flex items-center gap-2">
                  <Eye size={20} className="text-brand-royal dark:text-blue-400" />
                  <span>Question Review Mode</span>
                </h1>
                <span className="text-xs font-mono text-brand-royal dark:text-blue-400">Detailed Clinical Vignette & Answer Rationale</span>
              </div>
            </div>

            {/* Exit Review Button */}
            <button
              onClick={() => setIsReviewing(false)}
              className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm cursor-pointer transition-all"
            >
              Exit Review Mode
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200 dark:border-slate-700 text-xs font-mono">
            <span className="text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1 mr-1">
              <Filter size={14} /> Filter:
            </span>
            <button
              onClick={() => setFilterMode('all')}
              className={`touch-target px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                filterMode === 'all'
                  ? 'bg-[#2563EB] border-[#2563EB] text-white font-extrabold shadow-xs'
                  : 'bg-white dark:bg-[#111c30] border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              All ({questions.length})
            </button>
            <button
              onClick={() => setFilterMode('correct')}
              className={`touch-target px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                filterMode === 'correct'
                  ? 'bg-emerald-600 border-emerald-600 text-white font-extrabold shadow-xs'
                  : 'bg-white dark:bg-[#111c30] border-slate-200 dark:border-slate-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
              }`}
            >
              🟢 Correct ({stats.correctCount})
            </button>
            <button
              onClick={() => setFilterMode('wrong')}
              className={`touch-target px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                filterMode === 'wrong'
                  ? 'bg-rose-600 border-rose-600 text-white font-extrabold shadow-xs'
                  : 'bg-white dark:bg-[#111c30] border-slate-200 dark:border-slate-700 text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/50'
              }`}
            >
              🔴 Wrong ({stats.wrongCount})
            </button>
            <button
              onClick={() => setFilterMode('unanswered')}
              className={`touch-target px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                filterMode === 'unanswered'
                  ? 'bg-blue-600 border-blue-600 text-white font-extrabold shadow-xs'
                  : 'bg-white dark:bg-[#111c30] border-slate-200 dark:border-slate-700 text-brand-royal dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50'
              }`}
            >
              🔵 Unanswered ({unansweredCount})
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {filteredQuestions.map((q) => {
            const qIdx = questions.indexOf(q);
            const userAns = userAnswers[qIdx];
            const isAnswered = userAns !== undefined;
            const isCorrect = isAnswered && userAns === q.correctIndex;
            const isWrong = isAnswered && !isCorrect;
            const isUnanswered = !isAnswered;

            return (
              <div
                key={qIdx}
                className={`tq-card p-5 sm:p-7 space-y-4 relative overflow-hidden transition-all max-w-full ${
                  isCorrect
                    ? 'border-emerald-300'
                    : isWrong
                    ? 'border-rose-300'
                    : 'border-blue-300'
                }`}
              >
                {/* Question Header & Status Badge */}
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-brand-royal dark:text-blue-400 font-bold text-sm">
                      Question {qIdx + 1} of {questions.length}
                    </span>
                    <span className="px-3 py-0.5 bg-alabaster dark:bg-[#0b1220] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-full text-xs font-mono">
                      {q.category}
                    </span>
                  </div>

                  {/* Status Indicator */}
                  {isCorrect && (
                    <span className="tq-chip tq-chip-teal px-3.5 py-1 font-mono shadow-xs">
                      <CheckCircle2 size={16} className="text-emerald-600" /> Correct (+2 Marks)
                    </span>
                  )}
                  {isWrong && (
                    <span className="tq-chip tq-chip-coral px-3.5 py-1 font-mono shadow-xs">
                      <XCircle size={16} className="text-rose-600" /> Incorrect (0 Marks)
                    </span>
                  )}
                  {isUnanswered && (
                    <span className="tq-chip tq-chip-royal px-3.5 py-1 font-mono shadow-xs">
                      <HelpCircle size={16} className="text-brand-royal dark:text-blue-400" /> Unanswered (0 Marks)
                    </span>
                  )}
                </div>

                {/* Patient Vignette if present */}
                {q.patientScenario && (
                  <div className="bg-alabaster dark:bg-[#0b1220] border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-brand-royal dark:text-blue-400 font-bold">
                      <Stethoscope size={15} /> Patient Clinical Case:
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-slate-700 dark:text-slate-200 bg-white p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div>Age / Sex: <strong className="text-ink-900 dark:text-slate-100">{q.patientScenario.age}y / {q.patientScenario.gender}</strong></div>
                      <div>Duration: <strong className="text-ink-900 dark:text-slate-100">{q.patientScenario.duration}</strong></div>
                      {q.patientScenario.vitals && <div>Vitals: <strong className="text-ink-900 dark:text-slate-100">{q.patientScenario.vitals}</strong></div>}
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                      <strong>History:</strong> {q.patientScenario.chiefComplaint}.
                    </p>
                    {q.patientScenario.labOrRadiology && (
                      <p className="text-brand-royal dark:text-blue-400 font-mono">
                        <strong>Investigations:</strong> {q.patientScenario.labOrRadiology}
                      </p>
                    )}
                  </div>
                )}

                {/* Question Statement */}
                <h3 className="text-base sm:text-lg font-bold text-ink-900 dark:text-slate-100 leading-relaxed">
                  {q.question}
                </h3>

                {/* Options List with Requirement Color Coding */}
                <div className="space-y-2.5 pt-1">
                  {q.options.map((optionText, oIdx) => {
                    const isOptionCorrect = oIdx === q.correctIndex;
                    const isOptionSelected = userAns === oIdx;

                    let optionStyle = 'bg-white border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 opacity-60';

                    if (isOptionCorrect) {
                      // Correct answer ALWAYS highlighted in Green
                      optionStyle = 'bg-emerald-50 dark:bg-emerald-900/50 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-100 font-bold shadow-xs ring-2 ring-emerald-500';
                    } else if (isOptionSelected && !isOptionCorrect) {
                      // Selected wrong answer highlighted in Red
                      optionStyle = 'bg-rose-50 dark:bg-rose-900/50 border-2 border-rose-500 text-rose-900 dark:text-rose-100 font-bold shadow-xs ring-2 ring-rose-500';
                    }

                    return (
                      <div
                        key={oIdx}
                        className={`w-full p-4 rounded-xl border text-xs sm:text-sm flex items-start gap-3 transition-all ${optionStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 border ${
                          isOptionCorrect
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : isOptionSelected && !isOptionCorrect
                            ? 'bg-rose-500 text-white border-rose-600'
                            : 'bg-alabaster dark:bg-[#0b1220] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                        }`}>
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        <span className="flex-1 leading-relaxed">{optionText}</span>

                        {isOptionCorrect && (
                          <span className="px-2.5 py-0.5 bg-emerald-100 border border-emerald-300 text-emerald-800 font-mono text-[11px] font-bold rounded-md flex items-center gap-1 shrink-0">
                            <CheckCircle2 size={13} className="text-emerald-600" /> Correct Choice
                          </span>
                        )}
                        {isOptionSelected && !isOptionCorrect && (
                          <span className="px-2.5 py-0.5 bg-rose-100 border border-rose-300 text-rose-800 font-mono text-[11px] font-bold rounded-md flex items-center gap-1 shrink-0">
                            <XCircle size={13} className="text-rose-600" /> Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Detailed Rationale */}
                <div className="bg-alabaster dark:bg-[#0b1220] border border-slate-200 dark:border-slate-700 p-4 rounded-xl space-y-1.5 text-xs font-mono">
                  <span className="text-brand-royal dark:text-blue-400 font-bold uppercase tracking-wider block">
                    💡 Clinical Rationale & WHO/NTEP Guidelines:
                  </span>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed">
                    {q.explanation}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Standard Result Summary Screen (Clean White Medical Theme)
  return (
    <div className="bg-alabaster dark:bg-[#0b1220] p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6 sm:space-y-8 text-ink-900 dark:text-slate-100 min-h-screen font-sans">
      {/* 1. Top Pass / Fail Banner Card */}
      <div
        className={`p-6 sm:p-8 rounded-2xl border text-center space-y-4 relative overflow-hidden shadow-sm ${
          stats.passed
            ? 'bg-white dark:bg-[#111c30] border-emerald-300 dark:border-emerald-500'
            : 'bg-white dark:bg-[#111c30] border-rose-300 dark:border-rose-500'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-mono font-bold border">
          {stats.passed ? (
            <span className="tq-chip tq-chip-teal px-3 py-0.5">
              <ShieldCheck size={15} className="text-emerald-600" /> Official Level 1 Assessment Passed
            </span>
          ) : (
            <span className="tq-chip tq-chip-coral px-3 py-0.5">
              <XCircle size={15} className="text-rose-600" /> Score Below 80 Marks Threshold
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink-900 dark:text-slate-100">
          {stats.passed ? 'Assessment Passed!' : 'Official Assessment Result'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base max-w-xl mx-auto leading-relaxed font-normal">
          {stats.passed
            ? 'Congratulations! You have met all WHO/NTEP core proficiency standards.'
            : 'You scored below the 80% passing threshold (80 / 100 Marks). Review the detailed answers and retry.'}
        </p>

        {/* Badge Tier */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-alabaster dark:bg-[#0b1220] border border-amber-300 text-amber-900 font-bold text-sm shadow-xs">
            <Trophy size={18} className="text-amber-500" />
            <span>Badge Tier: 🏆 {stats.badge}</span>
          </div>
        </div>
      </div>

      {/* 2. Score Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="tq-card p-4 rounded-2xl text-center space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase font-semibold block">Total Score</span>
          <span className="text-2xl sm:text-3xl font-black text-amber-600">{stats.totalScore} / 100</span>
        </div>

        <div className="tq-card p-4 rounded-2xl text-center space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase font-semibold block">Percentage Score</span>
          <span className="text-2xl sm:text-3xl font-black text-brand-royal dark:text-blue-400">{stats.percentage}%</span>
        </div>

        <div className="tq-card p-4 rounded-2xl text-center space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase font-semibold block">Pass / Fail Status</span>
          <span className={`text-xl sm:text-2xl font-black uppercase ${stats.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
            {stats.passed ? 'PASSED' : 'FAILED'}
          </span>
        </div>

        <div className="tq-card p-4 rounded-2xl text-center space-y-1 shadow-sm">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase font-semibold block">Time Duration</span>
          <span className="text-2xl sm:text-3xl font-black text-purple-600">{formatTime(stats.durationSeconds)}</span>
        </div>
      </div>

      {/* 3. Detailed Question Breakdown */}
      <div className="tq-card rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="text-xs font-extrabold text-brand-royal dark:text-blue-400 uppercase tracking-wider font-mono flex items-center gap-2">
          <Award size={16} /> Question Performance Breakdown
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 bg-alabaster dark:bg-[#0b1220] rounded-xl border border-slate-200 dark:border-slate-700 text-center">
            <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase block">Total Questions</span>
            <span className="text-lg font-black text-ink-900 dark:text-slate-100">{totalQuestions}</span>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
            <span className="text-emerald-700 text-[10px] uppercase block flex items-center justify-center gap-1">
              <CheckCircle2 size={13} /> Correct Answers
            </span>
            <span className="text-lg font-black text-emerald-800">{stats.correctCount} / {totalQuestions}</span>
          </div>

          <div className="p-3.5 bg-rose-50 rounded-xl border border-rose-200 text-center">
            <span className="text-rose-700 text-[10px] uppercase block flex items-center justify-center gap-1">
              <XCircle size={13} /> Wrong Answers
            </span>
            <span className="text-lg font-black text-rose-800">{stats.wrongCount} / {totalQuestions}</span>
          </div>

          <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-center">
            <span className="text-blue-700 text-[10px] uppercase block flex items-center justify-center gap-1">
              <HelpCircle size={13} /> Unanswered
            </span>
            <span className="text-lg font-black text-blue-800">{unansweredCount} / {totalQuestions}</span>
          </div>
        </div>

        {/* Unlock Alert when Passed */}
        {stats.passed && (
          <div className="p-4 bg-emerald-50/80 border border-emerald-300 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 size={22} className="text-emerald-600" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-800 uppercase tracking-wide">
                  ✓ LEVEL 1 ASSESSMENT COMPLETED
                </div>
                <h4 className="text-sm font-black text-ink-900 dark:text-slate-100">Mini Game Unlocked on Student Dashboard</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400">Head over to your Student Dashboard to play the Spot the TB Clues mini game!</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        {stats.questions && stats.questions.length > 0 && (
          <button
            onClick={() => setIsReviewing(true)}
            className="tq-btn-primary touch-target w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Eye size={18} />
            <span>Review Answers (All 50 Questions)</span>
          </button>
        )}

        <button
          onClick={onRetry}
          className="tq-btn-secondary touch-target w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-xs"
        >
          <RotateCcw size={16} />
          <span>Retry Assessment</span>
        </button>

        <button
          onClick={onBackToModules}
          className="tq-btn-primary touch-target w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-white font-extrabold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
        >
          <BookOpen size={16} />
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
}
