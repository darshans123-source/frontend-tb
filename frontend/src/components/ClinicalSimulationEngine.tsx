import { useState } from 'react';
import { AlgorithmNode, AlgorithmDecisionOption } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Stethoscope, ArrowRight, ArrowLeft, RotateCcw, CheckCircle2, 
  HelpCircle, ShieldCheck, Info, Sparkles, BookOpen, AlertTriangle 
} from 'lucide-react';

interface ClinicalSimulationEngineProps {
  nodes: AlgorithmNode[];
  onFinishSimulation?: (completedPath: string[]) => void;
  onInspectNode?: (node: AlgorithmNode) => void;
}

export default function ClinicalSimulationEngine({
  nodes,
  onFinishSimulation,
  onInspectNode
}: ClinicalSimulationEngineProps) {
  const [currentNodeId, setCurrentNodeId] = useState<string>(nodes[0]?.id || 'node_start');
  const [pathHistory, setPathHistory] = useState<string[]>([nodes[0]?.id || 'node_start']);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const currentNode = nodes.find(n => n.id === currentNodeId) || nodes[0];

  const handleSelectOption = (option: AlgorithmDecisionOption) => {
    setSelectedOptionId(option.id);
    setTimeout(() => {
      setSelectedOptionId(null);
      const nextId = option.targetNodeId;
      if (nextId) {
        setCurrentNodeId(nextId);
        setPathHistory(prev => [...prev, nextId]);

        const nextNodeObj = nodes.find(n => n.id === nextId);
        if (nextNodeObj && (nextNodeObj.category === 'treatment' || nextNodeObj.category === 'referral')) {
          if (onFinishSimulation) {
            onFinishSimulation([...pathHistory, nextId]);
          }
        }
      }
    }, 250);
  };

  const handlePreviousStep = () => {
    if (pathHistory.length > 1) {
      const newHistory = [...pathHistory];
      newHistory.pop();
      const prevId = newHistory[newHistory.length - 1];
      setPathHistory(newHistory);
      setCurrentNodeId(prevId);
    }
  };

  const handleRestart = () => {
    const startId = nodes[0]?.id || 'node_start';
    setCurrentNodeId(startId);
    setPathHistory([startId]);
  };

  const isTerminalNode = currentNode.category === 'treatment' || currentNode.category === 'referral';

  return (
    <div className="tq-fade-up max-w-full space-y-6 overflow-hidden font-sans">
      {/* Simulation Top Header & Breadcrumb Trail */}
      <div className="tq-card p-4 sm:p-5 rounded-3xl space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Stethoscope className="text-brand-teal" size={20} />
            <h3 className="font-extrabold text-base sm:text-lg text-ink-900 dark:text-white">
              Clinical Simulation Mode - Step-by-Step Patient Diagnosis
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousStep}
              disabled={pathHistory.length <= 1}
              className={`touch-target px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
                pathHistory.length > 1
                  ? 'tq-btn-secondary dark:bg-[#111c30] dark:text-slate-200 dark:border-slate-700'
                  : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
              }`}
            >
              <ArrowLeft size={14} /> Previous Step
            </button>

            <button
              onClick={handleRestart}
              className="tq-btn-coral touch-target px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
            >
              <RotateCcw size={14} /> Restart Patient Case
            </button>
          </div>
        </div>

        {/* Diagnostic Path Breadcrumbs */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider shrink-0">
            Traversed Diagnostic Pathway:
          </span>
          {pathHistory.map((stepId, idx) => {
            const stepNode = nodes.find(n => n.id === stepId);
            const isLast = idx === pathHistory.length - 1;
            return (
              <div key={`${stepId}-${idx}`} className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border transition-all ${
                    isLast
                      ? 'bg-teal-100 dark:bg-teal-950/70 border-brand-teal text-teal-700 dark:text-teal-200'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {stepNode?.label || stepId}
                </span>
                {!isLast && <ArrowRight size={12} className="text-slate-400 dark:text-slate-600 shrink-0" />}
              </div>
            );
          })}
        </div>
        <div className="tq-progress" aria-hidden="true">
          <div className="tq-progress-bar" style={{ width: `${(pathHistory.length / Math.max(nodes.length, 1)) * 100}%` }} />
        </div>
      </div>

      {/* Main Interactive Decision Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentNode.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          className="tq-card p-6 sm:p-8 rounded-3xl space-y-6"
        >
          {/* Node Category Badge & Inspect Button */}
          <div className="flex flex-wrap justify-between items-center gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="tq-chip tq-chip-teal px-3 py-1 text-xs font-mono uppercase font-bold">
                Step #{pathHistory.length}: {currentNode.category} Node
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Node ID: {currentNode.id}</span>
            </div>

            {onInspectNode && (
              <button
                onClick={() => onInspectNode(currentNode)}
                className="tq-btn-secondary touch-target px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 dark:bg-[#111c30] dark:text-teal-300 dark:border-slate-700"
              >
                <BookOpen size={14} /> Inspect Full Guidelines
              </button>
            )}
          </div>

          {/* Question Title & Description */}
          <div className="space-y-3">
            <h2 className="tq-display text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-brand-emerald to-brand-royal">
              {currentNode.decisionQuestion || currentNode.label}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              {currentNode.description}
            </p>
          </div>

          {/* Guideline Note Alert Box */}
          <div className="tq-glass p-4 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-500/30 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-300 font-bold text-xs uppercase tracking-wider">
              <Info size={16} /> NTEP Guideline Rule
            </div>
            <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm italic leading-relaxed">
              "{currentNode.guidelineNote}"
            </p>
          </div>

          {/* Interactive Options Grid / Outcome Announcement */}
          {!isTerminalNode ? (
            <div className="space-y-3 pt-2">
              <p className="text-xs uppercase font-mono text-slate-500 dark:text-slate-400 font-bold flex items-center gap-1.5">
                <Sparkles size={14} className="text-brand-teal" /> Select Clinical Decision Option:
              </p>

              <div className="grid grid-cols-1 gap-3">
                {currentNode.decisionOptions && currentNode.decisionOptions.length > 0 ? (
                  currentNode.decisionOptions.map(option => {
                    const isSelected = selectedOptionId === option.id;
                    return (
                      <button
                        key={option.id}
                        onClick={() => handleSelectOption(option)}
                        className={`touch-target min-w-0 p-4 rounded-2xl border text-left transition-all relative group flex flex-col justify-between ${
                          isSelected
                            ? 'bg-gradient-to-r from-brand-teal to-brand-royal text-white ring-2 ring-teal-300 dark:ring-teal-500 scale-[0.99]'
                            : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-700 hover:border-brand-teal/60 text-slate-700 dark:text-slate-200'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-sm sm:text-base text-ink-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors flex items-center gap-2">
                            <span>{option.label}</span>
                          </h4>
                          {option.guidelineRef && (
                            <span className="tq-chip tq-chip-teal text-[10px] font-mono px-2.5 py-0.5">
                              {option.guidelineRef}
                            </span>
                          )}
                        </div>

                        {option.rationale && (
                          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mt-1 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                            {option.rationale}
                          </p>
                        )}

                        <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between text-xs text-teal-600 dark:text-teal-300 font-mono">
                          <span>Proceed along this diagnostic branch</span>
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    );
                  })
                ) : (
                  // Fallback if decisionOptions empty, render buttons for nextNodes
                  currentNode.nextNodes.map(nextId => {
                    const targetNodeObj = nodes.find(n => n.id === nextId);
                    return (
                      <button
                        key={nextId}
                        onClick={() => handleSelectOption({ id: nextId, label: targetNodeObj?.label || nextId, targetNodeId: nextId })}
                        className="tq-card tq-lift touch-target min-w-0 p-4 rounded-2xl text-left flex justify-between items-center text-sm font-bold text-ink-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-300 transition-all"
                      >
                        <span>{targetNodeObj?.label || nextId}</span>
                        <ArrowRight size={16} className="text-brand-teal" />
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          ) : (
            /* Terminal Node Outcome Card */
            <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/50 rounded-2xl space-y-4">
              <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={28} />
                <div>
                  <h3 className="text-lg font-black text-ink-900 dark:text-white">Diagnostic Outcome Reached</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300">Algorithm pathway completed according to official NTEP guidelines.</p>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <h4 className="text-sm font-bold text-emerald-600 dark:text-emerald-300 mb-1">{currentNode.label}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{currentNode.description}</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleRestart}
                  className="tq-btn-primary touch-target px-6 py-2.5 font-bold rounded-xl text-xs transition-all flex items-center gap-2"
                >
                  <RotateCcw size={16} /> Simulate Another Patient Case
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
