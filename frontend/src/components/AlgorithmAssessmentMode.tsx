import { useState } from 'react';
import { AlgorithmNode } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Award, CheckCircle2, AlertTriangle, XCircle, 
  RotateCcw, Sparkles, ShieldCheck, Clock, ArrowRight 
} from 'lucide-react';

interface AlgorithmAssessmentModeProps {
  nodes: AlgorithmNode[];
  onFinishAssessment?: (score: number, xpGained: number) => void;
}

export default function AlgorithmAssessmentMode({
  nodes,
  onFinishAssessment
}: AlgorithmAssessmentModeProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string>(nodes[0]?.id || 'node_start');
  const [score, setScore] = useState<number>(100);
  const [xpGained, setXpGained] = useState<number>(0);
  const [totalDecisions, setTotalDecisions] = useState<number>(0);
  const [correctDecisions, setCorrectDecisions] = useState<number>(0);
  const [wrongDecisions, setWrongDecisions] = useState<number>(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [wrongNodeIds, setWrongNodeIds] = useState<string[]>([]);

  const currentNode = nodes.find(n => n.id === currentNodeId) || nodes[0];

  const handleChooseOption = (option: { id: string; label: string; targetNodeId: string; isRecommended?: boolean; rationale?: string }) => {
    const isRecommended = option.isRecommended !== false;
    setTotalDecisions(prev => prev + 1);

    if (isRecommended) {
      setCorrectDecisions(prev => prev + 1);
      setXpGained(prev => prev + 50);
      setFeedback({
        isCorrect: true,
        text: `Correct Decision! +50 XP. ${option.rationale || 'Complies with standard NTEP/WHO guidelines.'}`
      });
    } else {
      setWrongDecisions(prev => prev + 1);
      setScore(prev => Math.max(0, prev - 15));
      setWrongNodeIds(prev => [...prev, option.targetNodeId]);
      setFeedback({
        isCorrect: false,
        text: `Guideline Deviation Penalty (-15 points). ${option.rationale || 'This choice deviates from official diagnostic criteria.'}`
      });
    }

    setTimeout(() => {
      setFeedback(null);
      const nextId = option.targetNodeId;
      if (nextId) {
        setCurrentNodeId(nextId);

        const nextNodeObj = nodes.find(n => n.id === nextId);
        if (nextNodeObj && (nextNodeObj.category === 'treatment' || nextNodeObj.category === 'referral')) {
          setIsCompleted(true);
          if (onFinishAssessment) {
            onFinishAssessment(score, xpGained + (isRecommended ? 50 : 0));
          }
        }
      }
    }, 1500);
  };

  const handleRestart = () => {
    setCurrentNodeId(nodes[0]?.id || 'node_start');
    setScore(100);
    setXpGained(0);
    setTotalDecisions(0);
    setCorrectDecisions(0);
    setWrongDecisions(0);
    setFeedback(null);
    setIsCompleted(false);
    setWrongNodeIds([]);
  };

  const accuracy = totalDecisions > 0 ? Math.round((correctDecisions / totalDecisions) * 100) : 100;

  return (
    <div className="tq-fade-up max-w-full space-y-6 overflow-hidden font-sans">
      {/* Assessment Top Scoreboard */}
      <div className="tq-card p-4 sm:p-5 rounded-3xl grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 min-w-0">
          <Trophy className="text-amber-500 dark:text-amber-400 shrink-0" size={24} />
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">Diagnostic Score</p>
            <p className="text-lg font-black text-amber-600 dark:text-amber-300">{score} pts</p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 min-w-0">
          <Sparkles className="text-brand-teal shrink-0" size={24} />
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">XP Earned</p>
            <p className="text-lg font-black text-teal-600 dark:text-teal-300">+{xpGained} XP</p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 min-w-0">
          <ShieldCheck className="text-emerald-500 dark:text-emerald-400 shrink-0" size={24} />
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">Accuracy Rate</p>
            <p className="text-lg font-black text-emerald-600 dark:text-emerald-300">{accuracy}%</p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 min-w-0">
          <Clock className="text-purple-500 dark:text-purple-400 shrink-0" size={24} />
          <div>
            <p className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">Decisions Made</p>
            <p className="text-lg font-black text-purple-600 dark:text-purple-300">{totalDecisions} Steps</p>
          </div>
        </div>
      </div>

      {/* Main Challenge Window */}
      {!isCompleted ? (
        <div className="tq-card p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex flex-wrap justify-between items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
            <span className="tq-chip tq-chip-amber px-3 py-1 text-xs font-mono uppercase font-bold flex items-center gap-1.5">
              <Award size={14} /> Diagnostic Challenge Step #{totalDecisions + 1}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Node ID: {currentNode.id}</span>
          </div>

          <div className="space-y-3">
            <h2 className="tq-display text-xl sm:text-2xl font-black text-ink-900 dark:text-white">
              {currentNode.decisionQuestion || currentNode.label}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              {currentNode.description}
            </p>
          </div>

          {/* Feedback Overlay Banner */}
          <AnimatePresence>
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`p-4 rounded-2xl border flex items-center gap-3 ${
                  feedback.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-300 dark:border-emerald-500/80 text-emerald-700 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/90 border-rose-300 dark:border-rose-500/80 text-rose-700 dark:text-rose-200'
                }`}
              >
                {feedback.isCorrect ? <CheckCircle2 size={24} className="shrink-0 text-emerald-600 dark:text-emerald-400" /> : <XCircle size={24} className="shrink-0 text-rose-600 dark:text-rose-400" />}
                <p className="text-xs sm:text-sm font-bold">{feedback.text}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Decision Options */}
          <div className="space-y-3">
            <p className="text-xs uppercase font-mono text-slate-500 dark:text-slate-400 font-bold">Select Diagnostic Action:</p>

            <div className="grid grid-cols-1 gap-3">
              {currentNode.decisionOptions && currentNode.decisionOptions.length > 0 ? (
                currentNode.decisionOptions.map(option => (
                  <button
                    key={option.id}
                    disabled={!!feedback}
                    onClick={() => handleChooseOption(option)}
                    className="tq-card tq-lift touch-target min-w-0 p-4 rounded-2xl text-left transition-all group flex justify-between items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-ink-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                        {option.label}
                      </h4>
                      {option.rationale && (
                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 line-clamp-1">{option.rationale}</p>
                      )}
                    </div>
                    <ArrowRight size={16} className="text-brand-teal shrink-0 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))
              ) : (
                currentNode.nextNodes.map(nextId => {
                  const targetObj = nodes.find(n => n.id === nextId);
                  return (
                    <button
                      key={nextId}
                      disabled={!!feedback}
                      onClick={() => handleChooseOption({ id: nextId, label: targetObj?.label || nextId, targetNodeId: nextId })}
                      className="tq-card tq-lift touch-target min-w-0 p-4 rounded-2xl text-left flex justify-between items-center gap-2 text-sm font-bold text-ink-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-300 transition-all disabled:opacity-60"
                    >
                      <span>{targetObj?.label || nextId}</span>
                      <ArrowRight size={16} className="text-brand-teal" />
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Final Assessment Completion Card */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="tq-card p-8 rounded-3xl text-center space-y-6 border-emerald-200 dark:border-emerald-500/50"
        >
          <div className="inline-flex p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-500/50 rounded-full text-emerald-600 dark:text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.4)]">
            <Trophy size={48} />
          </div>

          <div>
            <h2 className="tq-display text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-emerald via-brand-teal to-brand-royal">
              Assessment Completed!
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
              You have successfully completed the diagnostic workflow with full NTEP compliance.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-left">
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">Final Score</p>
              <p className="text-xl font-black text-amber-600 dark:text-amber-300">{score} / 100</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">Total XP Gained</p>
              <p className="text-xl font-black text-teal-600 dark:text-teal-300">+{xpGained} XP</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">Accuracy Rate</p>
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-300">{accuracy}%</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">Mistakes</p>
              <p className="text-xl font-black text-rose-600 dark:text-rose-300">{wrongDecisions}</p>
            </div>
          </div>

          <button
            onClick={handleRestart}
            className="tq-btn-primary touch-target px-8 py-3 font-black rounded-2xl text-sm transition-all flex items-center gap-2 mx-auto"
          >
            <RotateCcw size={18} /> Retake Assessment Challenge
          </button>
        </motion.div>
      )}
    </div>
  );
}
