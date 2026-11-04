import React, { useState, useEffect, useMemo } from 'react';
import {
  LEVEL2_CASES,
  LEVEL2_QUESTIONS,
  RAPID_REPORTS,
  FIRST_TEST_ROUNDS,
  LEVEL2_REFERENCES,
  CXR_IMAGE_SLOTS,
  TOPIC_LABELS,
  VALIDATED_BY,
  VALIDATION_DATE,
  GUIDELINE_VERSION,
  type Topic,
} from './level2Data';

// TB Quest — Level 2 "Investigate & Interpret".
// Lives inside the existing app UI (light theme, same blue palette as the
// Level 1 pages). No other screen is changed to add this level.
// Education only: every case is a teaching simulation, not a real patient
// record. Nothing here is faculty-approved.

const PROGRESS_KEY = 'tbquest_level2_progress';
const UNLOCK_KEY = 'tbquest_level2_unlocked';

interface Level2PageProps {
  onBack: () => void;
  initialTab?: Tab;
}

type Tab = 'cases' | 'rapid' | 'first' | 'study';
type CasePhase = 'patient' | 'lab' | 'report' | 'step' | 'solved';

interface TopicStat { correct: number; total: number }

function loadProgress(): { score: number; solved: string[]; firstCorrect: number; firstTotal: number; topics: Record<string, TopicStat> } {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      return {
        score: p.score || 0,
        solved: p.solved || [],
        firstCorrect: p.firstCorrect || 0,
        firstTotal: p.firstTotal || 0,
        topics: p.topics || {},
      };
    }
  } catch { /* fresh start */ }
  return { score: 0, solved: [], firstCorrect: 0, firstTotal: 0, topics: {} };
}

function metaLine(): string {
  return `Clinical Content Version: Level 2 v1 · Last Validated: ${VALIDATION_DATE} · Validated By: ${VALIDATED_BY} · Guideline: ${GUIDELINE_VERSION}`;
}

export default function Level2Page({ onBack, initialTab }: Level2PageProps) {
  const [tab, setTab] = useState<Tab>(initialTab ?? 'cases');
  const [progress, setProgress] = useState(loadProgress);
  const [streak, setStreak] = useState(0);

  // --- Case game state ---
  const [caseIdx, setCaseIdx] = useState(0);
  const [phase, setPhase] = useState<CasePhase>('patient');
  const [stepIdx, setStepIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [relearn, setRelearn] = useState<number | null>(null);
  const [stepFirstTry, setStepFirstTry] = useState(true);
  const [practiceMode, setPracticeMode] = useState(false);
  const [rapidQuizTopic, setRapidQuizTopic] = useState<Topic | null>(null);

  useEffect(() => {
    try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)); } catch { /* ignore */ }
  }, [progress]);

  const activeCase = LEVEL2_CASES[caseIdx];
  const solvedCount = progress.solved.length;
  const accuracy = progress.firstTotal > 0 ? Math.round((progress.firstCorrect / progress.firstTotal) * 100) : 100;
  const allCasesDone = solvedCount >= LEVEL2_CASES.length;
  const level3Unlocked = allCasesDone && accuracy >= 80;

  useEffect(() => {
    if (level3Unlocked) {
      try { localStorage.setItem(UNLOCK_KEY, 'true'); } catch { /* ignore */ }
    }
  }, [level3Unlocked]);

  const weakTopics = useMemo(() => {
    return (Object.keys(progress.topics) as Topic[]).filter((t) => {
      const s = progress.topics[t];
      return s && s.total > 0 && (s.correct / s.total) * 100 < 80;
    });
  }, [progress.topics]);

  function recordFirstTry(topic: Topic, correct: boolean) {
    setProgress((prev) => {
      const old = prev.topics[topic] || { correct: 0, total: 0 };
      return {
        ...prev,
        firstCorrect: prev.firstCorrect + (correct ? 1 : 0),
        firstTotal: prev.firstTotal + 1,
        topics: { ...prev.topics, [topic]: { correct: old.correct + (correct ? 1 : 0), total: old.total + 1 } },
      };
    });
  }

  function startCase(idx: number) {
    const alreadySolved = progress.solved.includes(LEVEL2_CASES[idx].id);
    setCaseIdx(idx);
    setPracticeMode(alreadySolved);
    setPhase('patient');
    setStepIdx(0);
    setChosen(null);
    setRelearn(null);
    setStepFirstTry(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function runLab() {
    setPhase('lab');
    window.setTimeout(() => setPhase('report'), 1400);
  }

  function answerStep(optIdx: number) {
    const step = activeCase.steps[stepIdx];
    setChosen(optIdx);
    if (optIdx === step.correctIndex) {
      if (!practiceMode) {
        if (stepFirstTry) {
          setProgress((prev) => ({ ...prev, score: prev.score + 10 }));
          setStreak((s) => s + 1);
          recordFirstTry(step.topic, true);
        }
      }
      window.setTimeout(() => {
        if (stepIdx === 0) {
          setStepIdx(1);
          setChosen(null);
          setRelearn(null);
          setStepFirstTry(true);
          setPhase('step');
        } else {
          setPhase('solved');
          if (!practiceMode && !progress.solved.includes(activeCase.id)) {
            setProgress((prev) => ({ ...prev, solved: [...prev.solved, activeCase.id] }));
          }
        }
      }, 900);
    } else {
      if (!practiceMode && stepFirstTry) {
        setStreak(0);
        recordFirstTry(step.topic, false);
      }
      setRelearn(optIdx);
    }
  }

  function tryAgainStep() {
    setChosen(null);
    setRelearn(null);
    setStepFirstTry(false);
  }

  function practiceSimilar(topic: Topic) {
    setRapidQuizTopic(topic);
    setTab('rapid');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const tabBtn = (t: Tab, label: string) => (
    <button
      key={t}
      onClick={() => setTab(t)}
      className={`flex-1 py-3 text-[11px] sm:text-xs font-extrabold rounded-xl transition-all min-h-[48px] ${tab === t ? 'bg-[#2563EB] text-white shadow' : 'bg-white border border-[#E2E8F0] text-slate-600'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="bg-[#F8FAFC] p-3 sm:p-6 max-w-3xl mx-auto space-y-5 text-[#1E293B] min-h-screen font-sans pb-28">
      {/* Header — same light style as the Level 1 pages */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-3 shadow-sm">
        <button onClick={onBack} className="text-[#2563EB] font-bold text-xs sm:text-sm">← Back to Learning Modules</button>
        <div>
          <span className="inline-block px-3 py-1 bg-blue-50 text-[#1677FF] border border-blue-200 rounded-full text-xs font-bold font-mono">Level 2 • Investigate &amp; Interpret</span>
          <h2 className="font-extrabold text-[#102A43] text-2xl sm:text-3xl mt-2">What does this test result mean, and what next?</h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed font-medium">
            Level 1 taught you to recognise a presumptive TB patient. Suspicion is NOT confirmation. Level 2 starts from that patient and teaches you to read the test, then choose the next step.
          </p>
          <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold mt-3">
            Teaching simulation — not a real patient record. Education only, not a real clinical diagnostic tool.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#EFF6FF] rounded-xl p-3"><div className="font-extrabold text-[#2563EB] text-lg">{progress.score}</div><div className="text-[11px] font-bold text-slate-500">SCORE</div></div>
          <div className="bg-[#EFF6FF] rounded-xl p-3"><div className="font-extrabold text-[#2563EB] text-lg">{solvedCount} / 8</div><div className="text-[11px] font-bold text-slate-500">CASES SOLVED</div></div>
          <div className="bg-[#EFF6FF] rounded-xl p-3"><div className="font-extrabold text-[#2563EB] text-lg">🔥 {streak}</div><div className="text-[11px] font-bold text-slate-500">STREAK</div></div>
        </div>
        <div className="text-xs text-slate-500 font-mono">
          Case accuracy (first tries): {progress.firstTotal > 0 ? `${accuracy}% (${progress.firstCorrect}/${progress.firstTotal})` : 'No case answers yet'} · +10 per correct first-try answer · Progress saved on this device.
        </div>
        {allCasesDone && (
          <div className={`rounded-xl p-4 border ${level3Unlocked ? 'bg-emerald-50 border-emerald-300' : 'bg-amber-50 border-amber-300'}`}>
            {level3Unlocked ? (
              <p className="font-extrabold text-emerald-800 text-sm">🎉 Level 3 unlocked! You finished Level 2 at {accuracy}% accuracy (80% or higher required).</p>
            ) : (
              <div className="space-y-2">
                <p className="font-extrabold text-amber-800 text-sm">Level 3 stays locked at {accuracy}% accuracy — 80% or higher is required.</p>
                <p className="text-xs text-amber-800 font-medium">Targeted practice on your weak topics:</p>
                <div className="flex flex-wrap gap-2">
                  {(weakTopics.length > 0 ? weakTopics : (['cbnaat'] as Topic[])).map((t) => (
                    <button key={t} onClick={() => practiceSimilar(t)} className="px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs font-bold text-amber-800 min-h-[40px]">
                      Practice: {TOPIC_LABELS[t]}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500">Replay cases from the list below for practice, then use Rapid → Quiz on the weak topic.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom navigation inside the level (Cases | Rapid | First-Test | Study All) */}
      <div className="sticky top-0 z-10 bg-[#F8FAFC]/95 backdrop-blur py-2 flex gap-2">
        {tabBtn('cases', '🔬 Cases')}
        {tabBtn('rapid', '⚡ Rapid')}
        {tabBtn('first', '🎯 First-Test')}
        {tabBtn('study', '📖 Study All')}
      </div>

      {tab === 'cases' && (
        <div className="space-y-4">
          {/* Case picker */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-3 shadow-sm">
            <h3 className="font-extrabold text-base">TB Detective Lab — Operate it yourself</h3>
            <p className="text-xs text-slate-500 font-medium">Patient card → Run test in the lab → Report prints → Step 1 interpret → Step 2 next step → Case solved. No skipping.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {LEVEL2_CASES.map((c, i) => {
                const solved = progress.solved.includes(c.id);
                return (
                  <button key={c.id} onClick={() => startCase(i)} className={`p-3 rounded-xl border text-left min-h-[64px] transition-all ${i === caseIdx ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0] bg-white hover:border-blue-300'}`}>
                    <span className="block font-extrabold text-xs">{i + 1}. {c.title} {solved ? '✓' : ''}</span>
                    <span className="block text-[11px] text-slate-500 mt-1">{c.id} · {c.difficulty} · {solved ? 'Solved — tap to replay for practice' : 'Not solved yet'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active case */}
          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-50 text-[#2563EB] rounded-md text-[11px] font-bold font-mono">{activeCase.id}</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md text-[11px] font-bold">{activeCase.tbCategory}</span>
              <span className="px-2.5 py-1 bg-slate-100 rounded-md text-[11px] font-bold">{activeCase.difficulty}</span>
              {practiceMode && <span className="px-2.5 py-1 bg-amber-100 text-amber-800 rounded-md text-[11px] font-bold">Practice replay — score not changed</span>}
            </div>
            <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold">Teaching simulation — not a real patient record.</p>

            <div>
              <h4 className="font-extrabold text-base">{activeCase.title}</h4>
              <p className="text-sm text-slate-600 leading-relaxed mt-1">{activeCase.scenario}</p>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="bg-slate-50 border border-[#E2E8F0] rounded-xl p-3"><span className="font-bold text-slate-500 block">Age / Category</span>{activeCase.age} · {activeCase.category}</div>
                <div className="bg-slate-50 border border-[#E2E8F0] rounded-xl p-3"><span className="font-bold text-slate-500 block">Test ordered</span>{activeCase.investigationType}</div>
                <div className="bg-slate-50 border border-[#E2E8F0] rounded-xl p-3"><span className="font-bold text-slate-500 block">CXR note</span>{activeCase.cxrFinding}</div>
                <div className="bg-slate-50 border border-[#E2E8F0] rounded-xl p-3"><span className="font-bold text-slate-500 block">Next pathway (after solving)</span>{activeCase.nextNode}</div>
              </div>
            </div>

            {phase === 'patient' && (
              <button onClick={runLab} className="w-full py-4 bg-gradient-to-r from-[#1677FF] via-[#00B8A9] to-teal-500 text-white font-extrabold rounded-xl text-sm shadow-lg min-h-[52px]">🧪 Run test in the lab</button>
            )}

            {phase === 'lab' && (
              <div className="bg-slate-900 text-white rounded-2xl p-5 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-mono text-sm">Running {activeCase.investigationType}…</p>
                <p className="text-xs text-slate-400">Machine running — the report prints next. Do not skip.</p>
              </div>
            )}

            {(phase === 'report' || phase === 'step' || phase === 'solved') && (
              <div className="bg-[#EFF6FF] border-2 border-dashed border-[#2563EB] rounded-2xl p-4 space-y-2">
                <p className="font-mono text-[11px] font-bold text-[#2563EB] uppercase">🖨️ Printed report</p>
                <p className="font-mono font-bold text-sm">{activeCase.report}</p>
                <p className="text-xs text-slate-600"><span className="font-bold">Result:</span> {activeCase.investigationResult}</p>
                {phase === 'report' && (
                  <button onClick={() => setPhase('step')} className="w-full py-3.5 bg-[#2563EB] text-white font-extrabold rounded-xl text-sm min-h-[48px] mt-2">Read the report → Step 1</button>
                )}
              </div>
            )}

            {phase === 'step' && (
              <div className="space-y-3">
                <h4 className="font-extrabold text-base">{activeCase.steps[stepIdx].question}</h4>
                <p className="text-xs text-slate-500">Topic: {TOPIC_LABELS[activeCase.steps[stepIdx].topic]} · {stepFirstTry ? 'First try — +10 if correct' : 'Retry — no points, but you must get it right to move on'}</p>
                {activeCase.steps[stepIdx].options.map((opt, i) => {
                  const isChosen = chosen === i;
                  const isCorrect = i === activeCase.steps[stepIdx].correctIndex;
                  const answeredCorrect = chosen !== null && isCorrect;
                  return (
                    <button
                      key={i}
                      disabled={chosen !== null}
                      onClick={() => answerStep(i)}
                      className={`w-full p-3.5 text-left rounded-xl border text-sm font-medium min-h-[52px] transition-all ${answeredCorrect && isChosen ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold' : isChosen ? 'bg-rose-50 border-rose-500 text-rose-800' : 'bg-white border-[#E2E8F0] hover:border-blue-300'}`}
                    >
                      {String.fromCharCode(65 + i)}. {opt}
                    </button>
                  );
                })}
                {chosen !== null && chosen === activeCase.steps[stepIdx].correctIndex && (
                  <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-xs font-bold">✓ Correct! {activeCase.steps[stepIdx].whyCorrect}</p>
                )}
                {relearn !== null && (
                  <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 space-y-2">
                    <p className="font-extrabold text-amber-900 text-sm">📖 Re-learning card — a wrong tap is a lesson, not just a penalty</p>
                    <p className="text-sm"><span className="font-bold">Correct answer:</span> {activeCase.steps[stepIdx].options[activeCase.steps[stepIdx].correctIndex]}</p>
                    <p className="text-sm"><span className="font-bold">Why it is correct:</span> {activeCase.steps[stepIdx].whyCorrect}</p>
                    <p className="text-sm"><span className="font-bold">Why your answer was wrong:</span> {activeCase.steps[stepIdx].whyWrong[relearn]}</p>
                    <p className="text-sm"><span className="font-bold">One-line learning point:</span> {activeCase.steps[stepIdx].keyPoint}</p>
                    <div className="flex flex-col sm:flex-row gap-2 pt-1">
                      <button onClick={tryAgainStep} className="flex-1 py-3 bg-[#2563EB] text-white font-extrabold rounded-xl text-sm min-h-[48px]">Try again</button>
                      <button onClick={() => practiceSimilar(activeCase.steps[stepIdx].topic)} className="flex-1 py-3 bg-white border-2 border-[#2563EB] text-[#2563EB] font-extrabold rounded-xl text-sm min-h-[48px]">Similar question in Rapid →</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {phase === 'solved' && (
              <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 space-y-3 text-center">
                <p className="font-extrabold text-emerald-800 text-lg">🎉 Case solved!</p>
                <p className="text-sm text-emerald-800">{activeCase.title} — {activeCase.nextNode}.</p>
                {caseIdx < LEVEL2_CASES.length - 1 ? (
                  <button onClick={() => startCase(caseIdx + 1)} className="w-full py-3.5 bg-emerald-600 text-white font-extrabold rounded-xl text-sm min-h-[48px]">Next case →</button>
                ) : (
                  <p className="text-sm font-bold text-emerald-800">All 8 cases done. Check your accuracy and Level 3 status at the top of this page.</p>
                )}
              </div>
            )}

            <p className="text-[11px] text-slate-400 font-mono">{activeCase.id} · Reference: {activeCase.reference} · {metaLine()}</p>
          </div>
        </div>
      )}

      {tab === 'rapid' && <RapidSection topicFilter={rapidQuizTopic} onClearTopic={() => setRapidQuizTopic(null)} />}
      {tab === 'first' && <FirstTestSection />}
      {tab === 'study' && <StudySection />}
    </div>
  );
}

function RapidSection({ topicFilter, onClearTopic }: { topicFilter: Topic | null; onClearTopic: () => void }) {
  const [sub, setSub] = useState<'reader' | 'quiz'>('quiz');
  const [reportId, setReportId] = useState<string | null>(null);
  const questions = useMemo(
    () => (topicFilter ? LEVEL2_QUESTIONS.filter((q) => q.topic === topicFilter) : LEVEL2_QUESTIONS),
    [topicFilter],
  );
  const [qIdx, setQIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState(0);

  useEffect(() => { setQIdx(0); setChosen(null); }, [topicFilter]);

  const q = questions[Math.min(qIdx, questions.length - 1)];
  const report = RAPID_REPORTS.find((r) => r.id === reportId);

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-3 shadow-sm">
        <h3 className="font-extrabold text-base">Rapid Report Reader + 17-Question Check</h3>
        <p className="text-xs text-slate-500 font-medium">Read a report, say what it means, then check yourself. Answers are never marked in advance — you choose first, then you see the explanation.</p>
        {topicFilter && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 rounded-xl px-3 py-2">
            <span className="text-xs font-bold text-amber-800 flex-1">Practising weak topic: {TOPIC_LABELS[topicFilter]}</span>
            <button onClick={onClearTopic} className="text-xs font-extrabold text-[#2563EB] min-h-[36px] px-2">Show all 17 →</button>
          </div>
        )}
        <div className="flex gap-2">
          <button onClick={() => setSub('reader')} className={`flex-1 py-3 rounded-xl text-xs font-extrabold min-h-[48px] ${sub === 'reader' ? 'bg-[#2563EB] text-white' : 'bg-white border border-[#E2E8F0] text-slate-600'}`}>📄 Report Reader (16)</button>
          <button onClick={() => setSub('quiz')} className={`flex-1 py-3 rounded-xl text-xs font-extrabold min-h-[48px] ${sub === 'quiz' ? 'bg-[#2563EB] text-white' : 'bg-white border border-[#E2E8F0] text-slate-600'}`}>⚡ {topicFilter ? `${questions.length} Questions` : '17 Questions'}</button>
        </div>
      </div>

      {sub === 'reader' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {RAPID_REPORTS.map((r) => (
              <button key={r.id} onClick={() => setReportId(r.id)} className={`p-3 rounded-xl border text-left min-h-[56px] text-sm font-bold ${reportId === r.id ? 'border-[#2563EB] bg-[#EFF6FF]' : 'bg-white border-[#E2E8F0]'}`}>
                {r.title}
              </button>
            ))}
          </div>
          {report ? (
            <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-2 shadow-sm">
              <p className="font-mono font-bold text-sm">{report.report}</p>
              <p className="text-sm"><span className="font-bold">Reading:</span> {report.reading}</p>
              <p className="text-sm"><span className="font-bold">It does NOT mean:</span> {report.notMean}</p>
              <p className="text-sm"><span className="font-bold">Next step:</span> {report.next}</p>
              <p className="text-xs text-slate-500">Topic: {TOPIC_LABELS[report.topic]}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">Tap a report above to read it.</p>
          )}
        </div>
      )}

      {sub === 'quiz' && questions.length > 0 && (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center text-xs font-bold text-slate-500">
            <span>Question {qIdx + 1} / {questions.length}</span>
            <span>Quiz score: {quizScore} · Answered: {quizAnswered}</span>
          </div>
          <h4 className="font-extrabold text-base">{q.question}</h4>
          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isChosen = chosen === i;
              const isCorrect = i === q.correctIndex;
              return (
                <button
                  key={i}
                  disabled={chosen !== null}
                  onClick={() => {
                    setChosen(i);
                    setQuizAnswered((n) => n + 1);
                    if (i === q.correctIndex) setQuizScore((s) => s + 10);
                  }}
                  className={`w-full p-3.5 text-left rounded-xl border text-sm font-medium min-h-[52px] ${chosen !== null && isChosen && isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold' : chosen !== null && isChosen ? 'bg-rose-50 border-rose-500 text-rose-800' : 'bg-white border-[#E2E8F0] hover:border-blue-300'}`}
                >
                  {String.fromCharCode(65 + i)}. {opt}
                </button>
              );
            })}
          </div>
          {chosen !== null && (
            <div className="bg-slate-50 border border-[#E2E8F0] rounded-2xl p-4 space-y-2">
              <p className="text-sm"><span className="font-bold">Correct answer:</span> {q.options[q.correctIndex]}</p>
              <p className="text-sm"><span className="font-bold">Why:</span> {q.whyCorrect}</p>
              {chosen !== q.correctIndex && <p className="text-sm"><span className="font-bold">Why your answer was wrong:</span> {q.whyWrong[chosen]}</p>}
              <p className="text-sm"><span className="font-bold">Key point:</span> {q.keyPoint}</p>
              <div className="flex gap-2 pt-1">
                {qIdx < questions.length - 1 ? (
                  <button onClick={() => { setQIdx(qIdx + 1); setChosen(null); }} className="flex-1 py-3 bg-[#2563EB] text-white font-extrabold rounded-xl text-sm min-h-[48px]">Next question →</button>
                ) : (
                  <p className="flex-1 text-center font-extrabold text-emerald-700 py-3">Quiz complete — score {quizScore} / {questions.length * 10}.</p>
                )}
                <button onClick={() => { setQIdx(0); setChosen(null); setQuizScore(0); setQuizAnswered(0); }} className="px-4 py-3 bg-white border border-[#E2E8F0] font-extrabold rounded-xl text-sm min-h-[48px]">Restart</button>
              </div>
            </div>
          )}
          <p className="text-[11px] text-slate-400 font-mono">{q.id} · {q.tbCategory} · {q.difficulty} · Next: {q.nextNode} · {metaLine()}</p>
        </div>
      )}
    </div>
  );
}

function FirstTestSection() {
  const [roundIdx, setRoundIdx] = useState(0);
  const [chosen, setChosen] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(20);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const round = FIRST_TEST_ROUNDS[roundIdx];

  useEffect(() => {
    if (done || chosen !== null) return;
    if (seconds <= 0) {
      setChosen(-1);
      setWrong((w) => [...w, roundIdx]);
      return;
    }
    const t = window.setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => window.clearTimeout(t);
  }, [seconds, chosen, done, roundIdx]);

  function pick(i: number) {
    if (chosen !== null) return;
    setChosen(i);
    if (i === round.correctIndex) setScore((s) => s + 10);
    else setWrong((w) => [...w, roundIdx]);
  }

  function next() {
    if (roundIdx < FIRST_TEST_ROUNDS.length - 1) {
      setRoundIdx(roundIdx + 1);
      setChosen(null);
      setSeconds(20);
    } else {
      setDone(true);
    }
  }

  const band = score >= 70 ? 'First-Test Champion 🏆' : score >= 50 ? 'Getting there — practise the rounds you missed' : 'Needs practice — study the age-first table, then replay';

  if (done) {
    return (
      <div className="space-y-4">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 space-y-3 shadow-sm text-center">
          <h3 className="font-extrabold text-xl">Pick First! — Results</h3>
          <p className="font-extrabold text-3xl text-[#2563EB]">{score} / 80</p>
          <p className="font-bold text-sm">{band}</p>
          <p className="text-sm text-slate-600">Score bands: 70–80 = First-Test Champion · 50–60 = Getting there · 0–40 = Needs practice.</p>
          <p className="text-sm text-left"><span className="font-bold">Rounds you got wrong:</span> {wrong.length === 0 ? 'None — perfect round!' : wrong.map((i) => `Round ${i + 1} (${FIRST_TEST_ROUNDS[i].scenario})`).join('; ')}</p>
          <p className="text-sm text-left"><span className="font-bold">One line you will remember:</span> “Age decides the specimen. The specimen goes for CBNAAT first. Then read MTB → RIF → validity.”</p>
          <button onClick={() => { setRoundIdx(0); setChosen(null); setSeconds(20); setScore(0); setWrong([]); setDone(false); }} className="w-full py-3.5 bg-[#2563EB] text-white font-extrabold rounded-xl text-sm min-h-[48px]">Play again</button>
        </div>
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 space-y-4 shadow-sm">
          <h4 className="font-extrabold text-base">Full answer key with reasons</h4>
          {FIRST_TEST_ROUNDS.map((r, i) => (
            <div key={r.id} className="border-b border-[#E2E8F0] pb-3 space-y-1">
              <p className="font-bold text-sm">Round {i + 1}: {r.scenario} {wrong.includes(i) ? '✗ (you missed this one)' : '✓'}</p>
              <p className="text-sm"><span className="font-bold">Correct:</span> {r.options[r.correctIndex]}</p>
              <p className="text-sm text-slate-600">{r.reason}</p>
              <p className="text-sm"><span className="font-bold">Remember:</span> {r.remember}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="font-extrabold text-base">Pick First! The First-Test Game</h3>
        <span className="font-mono font-extrabold text-[#2563EB]">⏱ {seconds}s</span>
      </div>
      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-[#2563EB] h-full transition-all" style={{ width: `${(seconds / 20) * 100}%` }} /></div>
      <p className="text-xs text-slate-500 font-bold">Round {roundIdx + 1} / 8 · Score: {score} / 80 · 20 seconds per round · 10 points per round · Correct answers are NOT marked — choose before checking.</p>
      <p className="font-bold text-sm">{round.scenario}</p>
      <h4 className="font-extrabold text-base">{round.question}</h4>
      <div className="space-y-2">
        {round.options.map((opt, i) => {
          const isChosen = chosen === i;
          const isCorrect = i === round.correctIndex;
          const revealed = chosen !== null;
          return (
            <button
              key={i}
              disabled={revealed}
              onClick={() => pick(i)}
              className={`w-full p-3.5 text-left rounded-xl border text-sm font-medium min-h-[52px] ${revealed && isCorrect ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold' : revealed && isChosen ? 'bg-rose-50 border-rose-500 text-rose-800' : 'bg-white border-[#E2E8F0] hover:border-blue-300'}`}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          );
        })}
      </div>
      {chosen !== null && (
        <div className="bg-slate-50 border border-[#E2E8F0] rounded-2xl p-4 space-y-2">
          {chosen === -1 && <p className="font-bold text-sm text-rose-700">⏰ Time up! This round counts as wrong.</p>}
          <p className="text-sm"><span className="font-bold">Correct answer:</span> {round.options[round.correctIndex]}</p>
          <p className="text-sm">{round.reason}</p>
          <p className="text-sm"><span className="font-bold">Remember:</span> {round.remember}</p>
          <button onClick={next} className="w-full py-3.5 bg-[#2563EB] text-white font-extrabold rounded-xl text-sm min-h-[48px]">{roundIdx < FIRST_TEST_ROUNDS.length - 1 ? 'Next round →' : 'See results →'}</button>
        </div>
      )}
    </div>
  );
}

function StudySection() {
  const tableCls = 'w-full text-xs sm:text-sm border-collapse';
  const thCls = 'border border-[#E2E8F0] bg-[#EFF6FF] p-2.5 text-left font-bold';
  const tdCls = 'border border-[#E2E8F0] p-2.5 align-top';
  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
        <h3 className="font-extrabold text-lg">Study All — Level 2 summary</h3>
        <p className="text-sm text-slate-600">Study first, then play, without leaving Level 2. Level 1 asked “Should I think about TB?” Level 2 asks “What does this test result mean, and what next?”</p>
        <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs font-bold">Teaching material only — not a real clinical diagnostic tool. The final game algorithm must be faculty-validated against current NTEP/WHO guidance before classroom use.</p>

        <h4 className="font-extrabold text-base pt-2">Learning objectives — by the end of Level 2 you can:</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
          <li>Interpret smear, CBNAAT/GeneXpert and chest X-ray results correctly.</li>
          <li>Distinguish positive, negative, indeterminate, invalid, error and no-result.</li>
          <li>Recognise rifampicin resistance and its pathway change.</li>
          <li>Explain what each test CANNOT tell you.</li>
          <li>Identify when further evaluation is still needed despite a negative result.</li>
          <li>Choose the correct FIRST test by age, specimen availability and disease site.</li>
        </ul>

        <h4 className="font-extrabold text-base pt-2">2A. Smear microscopy</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
          <li>Looks for acid-fast bacilli (AFB) in sputum. AFB detected — even scanty / 1+ / 2+ / 3+ — = smear POSITIVE. Scanty is still positive.</li>
          <li>AFB not detected = smear NEGATIVE, but negative ≠ No TB. Low sensitivity, especially in children, people living with HIV, paucibacillary disease and poor specimens.</li>
          <li>Smear does NOT confirm species (other acid-fast organisms can be seen) and does NOT tell drug resistance.</li>
          <li>WHO 2025: a molecular rapid test is the initial test for adults/adolescents with TB signs/symptoms, not smear. Smear is context-dependent, not automatically first.</li>
        </ul>

        <h4 className="font-extrabold text-base pt-2">2B. CBNAAT / GeneXpert — read every report in this order</h4>
        <p className="text-sm font-bold">1) Is MTB detected? 2) What is the RIF result? 3) Is it valid/interpretable? 4) What is the next branch?</p>
        <div className="overflow-x-auto">
          <table className={tableCls}>
            <thead><tr><th className={thCls}>Report</th><th className={thCls}>Meaning</th></tr></thead>
            <tbody>
              <tr><td className={tdCls}>MTB DETECTED + RIF NOT DETECTED</td><td className={tdCls}>TB detected, no molecular evidence of rifampicin resistance.</td></tr>
              <tr><td className={tdCls}>MTB DETECTED + RIF DETECTED</td><td className={tdCls}>TB detected + rifampicin resistance → RR-TB / DR-TB pathway.</td></tr>
              <tr><td className={tdCls}>MTB DETECTED + RIF INDETERMINATE</td><td className={tdCls}>TB detected, RIF unresolved — do NOT guess, repeat / further testing.</td></tr>
              <tr><td className={tdCls}>MTB NOT DETECTED</td><td className={tdCls}>MTBC DNA not detected in THIS specimen — does NOT automatically exclude TB if suspicion remains.</td></tr>
              <tr><td className={tdCls}>MTB TRACE DETECTED (Ultra)</td><td className={tdCls}>Detected at a very low level — NOT negative, RIF usually indeterminate.</td></tr>
              <tr><td className={tdCls}>INVALID / ERROR / NO RESULT</td><td className={tdCls}>No valid result — repeat per lab procedure. Invalid ≠ negative.</td></tr>
              <tr><td className={tdCls}>High / Medium / Low / Very Low / Trace</td><td className={tdCls}>Amount of MTB DNA detected, NOT disease severity.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-slate-700">CBNAAT is a rapid molecular NAAT: it detects Mycobacterium tuberculosis complex (MTBC) DNA, and with Xpert MTB/RIF / Ultra also checks rifampicin resistance (mainly rpoB).</p>

        <h4 className="font-extrabold text-base pt-2">2C. Rifampicin resistance — the branching point</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
          <li>RIF DETECTED = think RR-TB, do NOT follow the routine drug-susceptible pathway, do further drug-resistance assessment.</li>
          <li>RIF NOT DETECTED = does NOT mean all TB drugs work. Other resistance can exist.</li>
          <li>RIF INDETERMINATE = unresolved, do not guess.</li>
          <li>RIF DETECTED does NOT automatically mean MDR-TB. MDR-TB = resistance to at least rifampicin AND isoniazid.</li>
        </ul>
        <p className="text-sm font-bold bg-[#EFF6FF] border border-blue-200 rounded-xl p-3">One-line rule: “TB detected → check rifampicin. RIF detected → RR-TB. RIF not detected → don’t assume all drugs susceptible. RIF indeterminate → investigate further.”</p>

        <h4 className="font-extrabold text-base pt-2">2D. Chest X-ray — SEE → IDENTIFY → INTERPRET → CORRELATE</h4>
        <p className="text-sm font-bold">Rule everywhere: “CXR can suggest TB; CXR alone does NOT confirm TB.”</p>
        <div className="overflow-x-auto">
          <table className={tableCls}>
            <thead><tr><th className={thCls}>Pattern (schematic description)</th><th className={thCls}>Interpretation</th></tr></thead>
            <tbody>
              <tr><td className={tdCls}>Upper-lobe infiltrate + cavity</td><td className={tdCls}>Classic post-primary adult pulmonary TB, strongly suggestive.</td></tr>
              <tr><td className={tdCls}>Diffuse tiny bilateral nodules</td><td className={tdCls}>Miliary / disseminated TB, urgent correlation.</td></tr>
              <tr><td className={tdCls}>Hilar / paratracheal lymphadenopathy in a child</td><td className={tdCls}>Pediatric TB clue — children often have nodes, not cavities.</td></tr>
              <tr><td className={tdCls}>Pleural effusion</td><td className={tdCls}>Can occur in TB, but nonspecific, many other causes.</td></tr>
              <tr><td className={tdCls}>Persistent consolidation without cavity in a child</td><td className={tdCls}>Can still be TB.</td></tr>
            </tbody>
          </table>
        </div>
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 space-y-2">
          <p className="font-extrabold text-sm text-amber-900">Faculty-approved CXR image slots — NO real image embedded yet</p>
          <p className="text-xs text-amber-900">CXR images must be radiology-faculty approved before use. Each slot needs:</p>
          {CXR_IMAGE_SLOTS.map((s) => (
            <p key={s.pattern} className="text-xs text-slate-700"><span className="font-bold">{s.pattern}:</span> {s.fields} — Status: Pending, no image embedded.</p>
          ))}
        </div>

        <h4 className="font-extrabold text-base pt-2">2E. Extrapulmonary TB — test the site</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
          <li>No cough does not exclude TB.</li>
          <li>Neck swelling → lymph-node aspirate molecular test = TB lymphadenitis if MTB detected.</li>
          <li>Headache, fever, neck stiffness, drowsiness → CSF molecular test = TB meningitis supported if MTB detected in CSF.</li>
          <li>Rule: match the specimen to the suspected site.</li>
        </ul>

        <h4 className="font-extrabold text-base pt-2">Section 6. What age? What goes first? — 3 checks first</h4>
        <p className="text-sm font-bold">1) Age? 2) Can they give sputum? 3) Where is the disease?</p>
        <div className="overflow-x-auto">
          <table className={tableCls}>
            <thead><tr><th className={thCls}>Situation</th><th className={thCls}>First test</th></tr></thead>
            <tbody>
              <tr><td className={tdCls}>Adult / adolescent, can give sputum</td><td className={tdCls}>Sputum → CBNAAT / GeneXpert FIRST (including Truenat where used), not smear or culture. CXR supports, never confirms alone.</td></tr>
              <tr><td className={tdCls}>Older child who can expectorate</td><td className={tdCls}>Same — sputum → CBNAAT first.</td></tr>
              <tr><td className={tdCls}>Young child who cannot expectorate</td><td className={tdCls}>NTEP child pathway — frontal chest X-ray is the initial specific investigation. If highly suggestive, collect a specimen and do CBNAAT straight away; if non-specific and symptoms persist after antibiotics, test induced sputum / gastric aspirate. Child CAN give: early-morning gastric aspirate (fasting), induced sputum, nasopharyngeal aspirate, or stool — for CBNAAT.</td></tr>
              <tr><td className={tdCls}>Any age, extrapulmonary</td><td className={tdCls}>CBNAAT first on the site specimen (lymph-node aspirate, CSF, pleural fluid/tissue), not smear or culture.</td></tr>
              <tr><td className={tdCls}>PLHIV, EPTB, DR-TB contact, or smear-negative but CXR suggestive</td><td className={tdCls}>Upfront CBNAAT — no smear-only pathway.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm font-bold bg-[#EFF6FF] border border-blue-200 rounded-xl p-3">One line to remember: “Age decides the specimen. The specimen goes for CBNAAT first. Then read MTB → RIF → validity.”</p>

        <h4 className="font-extrabold text-base pt-2">Trap case to remember</h4>
        <p className="text-sm text-slate-700">CXR persistent upper-zone opacity + MTB NOT DETECTED = TB not excluded, further evaluation needed. A negative test with persistent suspicion never ends the work-up.</p>

        <h4 className="font-extrabold text-base pt-2">Operator rules — never say</h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
          <li>Never say a symptom alone confirms TB. Suspicion ≠ diagnosis.</li>
          <li>Never say smear is automatically first for every patient.</li>
          <li>Never say CXR alone confirms TB.</li>
          <li>Never say negative smear or negative MTB automatically excludes TB.</li>
          <li>Never say scanty is negative, or trace is negative.</li>
          <li>Never say invalid / error / no result is negative.</li>
          <li>Never say RIF not detected means all drugs work, or RIF detected automatically proves full MDR-TB.</li>
          <li>Never say High/Low means severe/mild disease.</li>
          <li>Never invent real patient records, accuracy percentages, experimental results, or faculty-approved images.</li>
        </ul>

        <h4 className="font-extrabold text-base pt-2">References — in order</h4>
        <ol className="list-decimal pl-5 space-y-1 text-sm text-slate-700">
          {LEVEL2_REFERENCES.map((r, i) => <li key={i}>{r}</li>)}
        </ol>
        <p className="text-[11px] text-slate-400 font-mono">{metaLine()}</p>
      </div>
    </div>
  );
}
