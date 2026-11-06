import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  Check,
  X,
  ArrowLeft,
  Lightbulb,
  Search,
  Target,
  RotateCcw,
  Award,
} from 'lucide-react';
import {
  LEVEL1_SCENARIOS,
  LEVEL1_CLUE_CARD,
  LEVEL1_CLUE_CARD_FOLLOW_UP,
  LEVEL1_CLUE_DISTINCTION,
  LEVEL1_CLUE_GROUPS,
  LEVEL1_DISTRACTOR_CATEGORIES,
  LEVEL1_DISTRACTOR_GROUPS,
  LEVEL1_DISTRACTOR_MINI_GAME,
  SPOT_THE_CLUES_RULES,
  SPOT_PERFORMANCE_CATEGORIES,
  SPOT_THE_CLUES_PROFILES,
  LEVEL1_RELEARNING_MECHANISM,
  LEVEL1_RELEARNING_ITEMS,
  LEVEL1_FULL_REFERENCES,
  LEVEL1_CONTENT_STATUS,
} from '../../data/level1_document_study';

const VALIDATION_LABEL = 'Teaching simulation — content pending faculty validation';

type TabId = 'scenarios' | 'clues' | 'distractors' | 'spot' | 'relearning';

const TABS: { id: TabId; label: string }[] = [
  { id: 'scenarios', label: 'Patient Scenarios' },
  { id: 'clues', label: 'TB Clue Library' },
  { id: 'distractors', label: 'Distractors' },
  { id: 'spot', label: 'Spot the Clues' },
  { id: 'relearning', label: 'Re-learning' },
];

function ValidationBanner() {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-center text-[11px] font-bold text-amber-800">
      {VALIDATION_LABEL}
    </div>
  );
}

export default function Level1StudyTabs({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<TabId>('scenarios');
  const [scenarioId, setScenarioId] = useState<number>(1);
  const [profileId, setProfileId] = useState<number>(1);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [spotChecked, setSpotChecked] = useState(false);
  const [gameSelected, setGameSelected] = useState<string[]>([]);
  const [gameChecked, setGameChecked] = useState(false);
  const [relearningId, setRelearningId] = useState<number | null>(null);

  const profile = SPOT_THE_CLUES_PROFILES.find(p => p.id === profileId) ?? SPOT_THE_CLUES_PROFILES[0];
  const scenario = LEVEL1_SCENARIOS.find(s => s.id === scenarioId) ?? LEVEL1_SCENARIOS[0];

  // "Find the TB Clues" mini-game: the strong clues come from the
  // document's Category 1 examples; the distractors come from Group A.
  const miniGameItems = useMemo(() => {
    const clues = (LEVEL1_DISTRACTOR_CATEGORIES[0]?.examples ?? []).map(t => ({ text: t, isClue: true }));
    const distractors = LEVEL1_DISTRACTOR_GROUPS[0].items.slice(0, 6).map(i => ({ text: i.item, isClue: false }));
    const mixed = [...clues, ...distractors];
    // Deterministic interleave (no random shuffle, so the game is stable).
    const out: typeof mixed = [];
    for (let i = 0; i < Math.max(clues.length, distractors.length); i++) {
      if (clues[i]) out.push(clues[i]);
      if (distractors[i]) out.push(distractors[i]);
    }
    return out;
  }, []);
  const gameClueTexts = useMemo(() => new Set(miniGameItems.filter(i => i.isClue).map(i => i.text)), [miniGameItems]);
  const gameScore = gameChecked
    ? gameSelected.filter(t => gameClueTexts.has(t)).length - gameSelected.filter(t => !gameClueTexts.has(t)).length
    : null;

  const cycleMark = (text: string) => {
    if (spotChecked) return;
    const order = ['clue', 'supporting', 'distractor'];
    const cur = marks[text];
    const next = cur ? order[(order.indexOf(cur) + 1) % order.length] : 'clue';
    setMarks(prev => ({ ...prev, [text]: next }));
  };

  const spotScore = useMemo(() => {
    if (!spotChecked) return null;
    let correct = 0;
    profile.infoItems.forEach(item => {
      const m = marks[item.text];
      const isClueLike = item.verdict === 'clue' || item.verdict === 'supporting';
      const markedClueLike = m === 'clue' || m === 'supporting';
      if (isClueLike === markedClueLike && m) correct += 1;
    });
    return correct;
  }, [spotChecked, marks, profile]);

  return (
    <div className="min-h-screen bg-alabaster text-ink-900 font-sans">
      <div className="mx-auto max-w-5xl px-4 py-5 sm:px-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-sm active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" /> Back to board
          </button>
          <span className="rounded-full border border-blue-300 bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-blue-700">
            Level 1 · Study
          </span>
        </div>
        <ValidationBanner />
        <h1 className="mt-4 text-2xl font-black tracking-tight">Level 1 Study Tabs</h1>
        <p className="mt-1 text-sm font-medium text-slate-600">
          From the faculty document: patient scenarios, the TB Clue Card and clue library, distractors,
          Spot the Clues, and re-learning. Presumptive TB ≠ confirmed TB.
        </p>
        <p className="mt-1 text-xs font-bold text-slate-500">Recognize → Assess → Test → Interpret → Diagnose</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`min-h-[44px] rounded-xl border px-3.5 py-2 text-xs font-black shadow-sm active:scale-95 ${
                tab === t.id
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-blue-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'scenarios' && (
          <div className="mt-5 space-y-4">
            <div className="flex flex-wrap gap-2">
              {LEVEL1_SCENARIOS.map(s => (
                <button
                  key={s.id}
                  onClick={() => setScenarioId(s.id)}
                  className={`min-h-[44px] rounded-xl border px-3 py-2 text-xs font-bold shadow-sm ${
                    scenarioId === s.id ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  Case {s.id}
                </button>
              ))}
            </div>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black">{scenario.title}</h2>
              <p className="mt-1 text-sm text-slate-600">
                {scenario.category} · {scenario.sex}, {scenario.age}
              </p>
              <dl className="mt-4 space-y-2 text-sm">
                <div><dt className="font-black text-slate-500 text-xs uppercase">Complaints</dt><dd className="font-medium">{scenario.complaints}</dd></div>
                <div><dt className="font-black text-slate-500 text-xs uppercase">Duration</dt><dd className="font-medium">{scenario.duration}</dd></div>
                <div><dt className="font-black text-slate-500 text-xs uppercase">History</dt><dd className="font-medium">{scenario.history}</dd></div>
                <div><dt className="font-black text-slate-500 text-xs uppercase">Findings</dt><dd className="font-medium">{scenario.findings.join(' · ')}</dd></div>
                <div><dt className="font-black text-slate-500 text-xs uppercase">Risk factors</dt><dd className="font-medium">{scenario.riskFactors}</dd></div>
                <div><dt className="font-black text-slate-500 text-xs uppercase">Contact / exposure</dt><dd className="font-medium">{scenario.contactExposure}</dd></div>
              </dl>
              <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3">
                <div className="text-[11px] font-black uppercase tracking-wider text-blue-700">Should TB be suspected?</div>
                <div className="text-base font-black text-blue-900">{scenario.shouldSuspect}</div>
                <p className="mt-1 text-sm font-medium text-slate-700">{scenario.explanation}</p>
              </div>
              <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-900">
                Key learning: {scenario.keyLearning}
              </p>
              <p className="mt-2 text-[11px] text-slate-400">{scenario.reference}</p>
            </article>
          </div>
        )}

        {tab === 'clues' && (
          <div className="mt-5 space-y-4">
            <div className="whitespace-pre-line rounded-2xl border-2 border-teal-400 bg-gradient-to-br from-teal-50 to-cyan-50 p-5 text-center text-base font-black text-teal-950 shadow-sm">
              {LEVEL1_CLUE_CARD}
            </div>
            <p className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700">{LEVEL1_CLUE_DISTINCTION}</p>
            {LEVEL1_CLUE_GROUPS.map(g => (
              <section key={g.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-black">{g.title}</h3>
                <ul className="mt-3 space-y-3">
                  {g.clues.map(c => (
                    <li key={c.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <div className="text-sm font-black">{c.clue}</div>
                      <div className="mt-0.5 text-xs font-bold text-teal-700">Why it matters: {c.whyRelevant}</div>
                      <p className="mt-0.5 text-sm text-slate-600">{c.explanation}</p>
                      <p className="mt-1 text-[11px] text-slate-400">{c.reference}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <p className="text-sm font-medium text-slate-600">{LEVEL1_CLUE_CARD_FOLLOW_UP}</p>
          </div>
        )}

        {tab === 'distractors' && (
          <div className="mt-5 space-y-4">
            {LEVEL1_DISTRACTOR_CATEGORIES.map(c => (
              <div key={c.name} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-black">{c.name}</h3>
                {c.description && <p className="mt-1 text-sm text-slate-600">{c.description}</p>}
                <p className="mt-1 text-sm font-medium text-slate-700">Examples: {c.examples.join(' · ')}</p>
              </div>
            ))}
            {LEVEL1_DISTRACTOR_GROUPS.map(g => (
              <section key={g.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-base font-black">{g.title}</h3>
                <ul className="mt-3 space-y-2">
                  {g.items.map(i => (
                    <li key={i.id} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-sm">
                      <span className="font-black">{i.item}</span>
                      <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-700">{i.relevant}</span>
                      <p className="mt-1 text-slate-600">{i.explanation}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <section className="rounded-2xl border-2 border-blue-300 bg-blue-50 p-5 shadow-sm">
              <h3 className="flex items-center gap-2 text-base font-black text-blue-900">
                <Target className="h-5 w-5" /> Find the TB Clues — mini-game
              </h3>
              <p className="mt-2 whitespace-pre-line text-sm font-medium text-slate-700">{LEVEL1_DISTRACTOR_MINI_GAME}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {miniGameItems.map(item => {
                  const selected = gameSelected.includes(item.text);
                  return (
                    <button
                      key={item.text}
                      disabled={gameChecked}
                      onClick={() => setGameSelected(prev => selected ? prev.filter(t => t !== item.text) : [...prev, item.text])}
                      className={`min-h-[44px] rounded-xl border px-3 py-2 text-xs font-bold shadow-sm active:scale-95 ${
                        gameChecked
                          ? item.isClue
                            ? 'border-emerald-500 bg-emerald-100 text-emerald-900'
                            : selected
                            ? 'border-rose-500 bg-rose-100 text-rose-900'
                            : 'border-slate-200 bg-white text-slate-500'
                          : selected
                          ? 'border-blue-600 bg-blue-600 text-white'
                          : 'border-slate-200 bg-white text-slate-700'
                      }`}
                    >
                      {item.text}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setGameChecked(true)}
                  disabled={gameChecked || gameSelected.length === 0}
                  className="min-h-[44px] rounded-xl bg-blue-600 px-4 py-2 text-xs font-black uppercase text-white shadow-sm disabled:opacity-40"
                >
                  Check my clues
                </button>
                <button
                  onClick={() => { setGameSelected([]); setGameChecked(false); }}
                  className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
              </div>
              {gameChecked && gameScore !== null && (
                <p className="mt-3 rounded-xl border border-emerald-300 bg-emerald-50 p-3 text-sm font-bold text-emerald-900">
                  {gameScore >= gameClueTexts.size
                    ? 'Excellent! You identified the high-value TB clues.'
                    : `You picked ${gameSelected.filter(t => gameClueTexts.has(t)).length} of ${gameClueTexts.size} high-value TB clues. `}
                  Clinical reasoning requires you to focus on symptoms, duration, exposure and risk factors
                  rather than unrelated patient details.
                </p>
              )}
            </section>
          </div>
        )}

        {tab === 'spot' && (
          <div className="mt-5 space-y-4">
            <p className="whitespace-pre-line rounded-2xl border border-slate-200 bg-white p-4 text-sm font-medium text-slate-700 shadow-sm">
              {SPOT_THE_CLUES_RULES}
            </p>
            <div className="flex flex-wrap gap-2">
              {SPOT_THE_CLUES_PROFILES.map(p => (
                <button
                  key={p.id}
                  onClick={() => { setProfileId(p.id); setMarks({}); setSpotChecked(false); }}
                  className={`min-h-[44px] rounded-xl border px-3 py-2 text-xs font-bold shadow-sm ${
                    profileId === p.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  Profile {p.id}
                </button>
              ))}
            </div>
            <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-black">{profile.title}</h2>
              <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                {Object.entries(profile.patientProfile).map(([k, v]) => (
                  <div key={k} className="rounded-xl bg-slate-50 p-2.5">
                    <dt className="text-[11px] font-black uppercase text-slate-500">{k}</dt>
                    <dd className="font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-xs font-black uppercase tracking-wider text-slate-500">
                Tap each item to mark it: clue → supporting → distractor
              </p>
              <ul className="mt-2 space-y-2">
                {profile.infoItems.map(item => {
                  const m = marks[item.text];
                  return (
                    <li key={item.text}>
                      <button
                        onClick={() => cycleMark(item.text)}
                        disabled={spotChecked}
                        className={`flex min-h-[48px] w-full items-center justify-between gap-2 rounded-xl border p-3 text-left text-sm shadow-sm active:scale-[0.99] ${
                          m === 'clue' ? 'border-emerald-500 bg-emerald-50 font-bold'
                            : m === 'supporting' ? 'border-blue-500 bg-blue-50 font-bold'
                            : m === 'distractor' ? 'border-rose-500 bg-rose-50 font-bold'
                            : 'border-slate-200 bg-white'
                        }`}
                      >
                        <span>{item.text}</span>
                        <span className="shrink-0 rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-black uppercase">
                          {m ?? 'tap to mark'}
                        </span>
                      </button>
                      {spotChecked && (
                        <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                          {item.verdictRaw} — {item.why}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setSpotChecked(true)}
                  disabled={spotChecked || Object.keys(marks).length === 0}
                  className="min-h-[44px] rounded-xl bg-blue-600 px-4 py-2 text-xs font-black uppercase text-white shadow-sm disabled:opacity-40"
                >
                  Check my marks
                </button>
                <button
                  onClick={() => { setMarks({}); setSpotChecked(false); }}
                  className="flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm"
                >
                  <RotateCcw className="h-4 w-4" /> Reset
                </button>
              </div>
              {spotChecked && spotScore !== null && (
                <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50 p-4">
                  <div className="flex items-center gap-2 text-base font-black text-emerald-900">
                    <Award className="h-5 w-5" /> {spotScore} / {profile.infoItems.length} items marked correctly
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-700">
                    Should TB be suspected? <strong>{profile.shouldSuspect}</strong>
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-700">{profile.feedback}</p>
                  {profile.explanation && <p className="mt-1 text-sm text-slate-600">{profile.explanation}</p>}
                  <p className="mt-2 text-[11px] text-slate-400">{profile.source}</p>
                </div>
              )}
            </article>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-black">Performance categories</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {SPOT_PERFORMANCE_CATEGORIES.map(c => (
                  <li key={c.label} className="flex justify-between gap-2 font-medium">
                    <span><strong>{c.label}</strong> — {c.score}</span>
                    <span className="text-slate-500">{c.description}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {tab === 'relearning' && (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="flex items-center gap-2 text-base font-black">
                <Lightbulb className="h-5 w-5 text-amber-500" /> How re-learning works
              </h3>
              <p className="mt-1 text-sm font-medium text-slate-700">
                {(LEVEL1_RELEARNING_MECHANISM as Record<string, string>).description ?? ''}
              </p>
              <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm font-medium text-slate-700">
                {((LEVEL1_RELEARNING_MECHANISM as Record<string, string[]>).responseCycle ?? []).map(s => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <p className="mt-2 text-sm text-slate-600">
                {(LEVEL1_RELEARNING_MECHANISM as Record<string, string>).retryChallenge ?? ''}
              </p>
            </div>
            <div className="space-y-2">
              {LEVEL1_RELEARNING_ITEMS.map(item => (
                <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                  <button
                    onClick={() => setRelearningId(relearningId === item.id ? null : item.id)}
                    className="flex min-h-[44px] w-full items-center justify-between gap-2 text-left"
                  >
                    <span className="text-sm font-black">{item.id}. {item.title}</span>
                    <Search className="h-4 w-4 shrink-0 text-slate-400" />
                  </button>
                  {relearningId === item.id && (
                    <div className="mt-2 space-y-2 text-sm">
                      <p className="font-medium">{item.question}</p>
                      <p><strong>Correct answer:</strong> {item.correctAnswer}</p>
                      <p><strong>Why correct:</strong> {item.whyCorrect}</p>
                      <p><strong>Why the other answer was wrong:</strong> {item.whyIncorrect}</p>
                      <p className="rounded-xl bg-amber-50 p-2.5 font-bold text-amber-900">
                        Key learning: {item.keyLearning}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="flex items-center gap-2 text-sm font-black">
            <BookOpen className="h-4 w-4" /> References
          </h3>
          <ul className="mt-2 space-y-1.5 text-xs font-medium text-slate-600">
            {LEVEL1_FULL_REFERENCES.map(r => (
              <li key={r.number}>
                <strong>[{r.number}]</strong> {r.title} — {r.citation}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] font-bold text-amber-800">{LEVEL1_CONTENT_STATUS}</p>
          <p className="mt-1 text-[11px] text-slate-400">{VALIDATION_LABEL}</p>
        </div>
      </div>
    </div>
  );
}
