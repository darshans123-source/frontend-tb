import React from 'react';
import {
  FileText,
  CheckCircle2,
  Play,
  ArrowLeft,
  Trophy,
  Shield,
  Clock,
  Target,
  Award,
  BookOpen
} from 'lucide-react';

interface Level1InstructionsPageProps {
  onStartQuiz: () => void;
  onBackToIntro: () => void;
}

export default function Level1InstructionsPage({ onStartQuiz, onBackToIntro }: Level1InstructionsPageProps) {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6 sm:space-y-8 text-white min-h-screen">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToIntro}
          className="flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl"
        >
          <ArrowLeft size={16} /> Back to TB Introduction
        </button>
        <span className="px-3 py-1 bg-cyan-950 text-cyan-300 border border-cyan-800/60 rounded-full text-xs font-mono font-semibold">
          NMC / NTEP National Standard Examination
        </span>
      </div>

      {/* Main Title Banner */}
      <header className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/40 p-6 sm:p-8 rounded-3xl space-y-3 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-mono font-semibold">
          <Shield size={14} /> Official Level 1 Assessment Unlocked
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
          Official Level 1 Assessment
        </h1>
        <p className="text-slate-300 text-xs sm:text-base max-w-3xl leading-relaxed">
          Review the examination guidelines, scoring structure, and pass criteria before starting your 50-question randomized clinical assessment.
        </p>
      </header>

      {/* Metric Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Question Bank</span>
          <span className="text-lg font-extrabold text-cyan-400">50 Questions</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Current Quiz</span>
          <span className="text-lg font-extrabold text-emerald-400">50 Questions</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Duration</span>
          <span className="text-lg font-extrabold text-purple-400">60 Minutes</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Passing Score</span>
          <span className="text-lg font-extrabold text-amber-400">80%</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Marks per Q</span>
          <span className="text-lg font-extrabold text-sky-400">2 Marks</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10px] text-slate-400 font-mono uppercase block">Total Marks</span>
          <span className="text-lg font-extrabold text-indigo-400">100 Marks</span>
        </div>
      </div>

      {/* Grid Layout for Rules & Score Example */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Detailed Rules List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-cyan-400 flex items-center gap-2">
              <FileText size={20} /> Examination Rules & Guidelines
            </h2>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong>Complete 50-Question Coverage:</strong> Evaluates core microbiology, etiology, signs & symptoms, risk factors, CBNAAT/GeneXpert, smear microscopy, chest X-ray, drug regimens, MDR-TB, infection control, NTEP guidelines, WHO guidelines, and clinical vignettes.
                </div>
              </li>

              <li className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                <CheckCircle2 size={18} className="text-cyan-400 mt-0.5 shrink-0" />
                <div>
                  <strong>50 Randomized Questions:</strong> Every attempt presents all 50 questions in a randomized sequence with option choices shuffled to ensure individual assessment integrity.
                </div>
              </li>

              <li className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                <CheckCircle2 size={18} className="text-purple-400 mt-0.5 shrink-0" />
                <div>
                  <strong>60-Minute Timed Portal:</strong> A 60-minute examination timer counts down during the attempt. The assessment automatically submits upon time expiration.
                </div>
              </li>

              <li className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                <CheckCircle2 size={18} className="text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <strong>2 Marks Per Question (100 Total Marks):</strong> Correct Answer = <strong>+2 Marks</strong>. Wrong / Unanswered = <strong>0 Marks</strong>. No negative marking.
                </div>
              </li>

              <li className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                <CheckCircle2 size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong>Passing Criteria (80% / 80 Marks):</strong> Students must score at least <strong>80 Marks out of 100 (40 correct answers)</strong> to pass the Official Level 1 Assessment and unlock Level 2.
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Score Breakdown & Start Button */}
        <div className="space-y-4">
          <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-cyan-950/60 border border-cyan-500/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Trophy size={16} /> Scoring Breakdown
              </span>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-800">
                NMC Standard
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Questions</span>
                <span className="text-xl font-extrabold text-white">50</span>
              </div>
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Marks / Q</span>
                <span className="text-xl font-extrabold text-emerald-400">+2</span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-cyan-500/30 text-center space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Total Maximum Score</span>
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                100 Marks
              </span>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-500/30 text-center space-y-1">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block">Passing Threshold (80%)</span>
              <span className="text-2xl font-extrabold text-amber-400">
                80 Marks (40 Correct)
              </span>
            </div>
          </div>

          {/* Green Start Level 1 Button */}
          <button
            onClick={onStartQuiz}
            className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black rounded-2xl text-base shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <Play size={20} className="fill-slate-950" />
            <span>Start Official Level 1 Assessment</span>
          </button>
        </div>
      </div>
    </div>
  );
}

