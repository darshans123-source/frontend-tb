import { useState } from 'react';
import { AlgorithmFlowcharts } from '../data/algorithmData';
import { AlgorithmNode } from '../types';
import InteractiveFlowchartCanvas from './InteractiveFlowchartCanvas';
import NodeInspectorModal from './NodeInspectorModal';
import ClinicalSimulationEngine from './ClinicalSimulationEngine';
import AlgorithmAssessmentMode from './AlgorithmAssessmentMode';
import { 
  BookOpen, Sparkles, Stethoscope, Trophy, Users, 
  RotateCcw, CheckCircle2, Info, ArrowRight, Activity 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AlgorithmFlowchartProps {
  interactiveMode?: boolean;
  onFinishCase?: (score: number, xpGained: number) => void;
}

export default function AlgorithmFlowchart({ interactiveMode = true, onFinishCase }: AlgorithmFlowchartProps) {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'pulmonary' | 'pediatric'>('pulmonary');
  const [activeMode, setActiveMode] = useState<'learning' | 'simulation' | 'assessment' | 'faculty'>('learning');
  
  const flowchartData = selectedAlgorithm === 'pulmonary' 
    ? AlgorithmFlowcharts.pulmonaryTB 
    : AlgorithmFlowcharts.pediatricTB;

  const [activeNodeId, setActiveNodeId] = useState<string>(flowchartData.nodes[0]?.id || 'node_start');
  const [visitedNodeIds, setVisitedNodeIds] = useState<string[]>([flowchartData.nodes[0]?.id || 'node_start']);
  const [inspectedNode, setInspectedNode] = useState<AlgorithmNode | null>(null);

  const handleNodeClick = (node: AlgorithmNode) => {
    setInspectedNode(node);
    setActiveNodeId(node.id);
    if (!visitedNodeIds.includes(node.id)) {
      setVisitedNodeIds(prev => [...prev, node.id]);
    }
  };

  const handleSelectAlgorithm = (algo: 'pulmonary' | 'pediatric') => {
    setSelectedAlgorithm(algo);
    const newFlowchart = algo === 'pulmonary' ? AlgorithmFlowcharts.pulmonaryTB : AlgorithmFlowcharts.pediatricTB;
    const startId = newFlowchart.nodes[0]?.id || 'node_start';
    setActiveNodeId(startId);
    setVisitedNodeIds([startId]);
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100 max-w-full overflow-hidden">
      {/* Top Banner & Flowchart / Mode Selector Controls */}
      <div className="tq-card tq-fade-up p-6 space-y-4 max-w-full overflow-hidden">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-700/60">
          <div>
            <div className="tq-eyebrow flex items-center gap-2 mb-1">
              <BookOpen size={16} /> NTEP / WHO Official Diagnostic Standard
            </div>
            <h1 className="tq-display text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-brand-teal via-brand-royal to-indigo-500 dark:from-cyan-400 dark:via-blue-400 dark:to-indigo-400">
              {flowchartData.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
              {flowchartData.subtitle} ({flowchartData.pdfReference})
            </p>
          </div>

          {/* Algorithm Switcher (Pulmonary vs Pediatric) */}
          <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0 gap-1 max-w-full overflow-x-auto">
            <button
              onClick={() => handleSelectAlgorithm('pulmonary')}
              className={`touch-target px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedAlgorithm === 'pulmonary'
                  ? 'tq-btn-primary'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pulmonary TB Pathway
            </button>
            <button
              onClick={() => handleSelectAlgorithm('pediatric')}
              className={`touch-target px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedAlgorithm === 'pediatric'
                  ? 'tq-btn-primary'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pediatric TB Pathway
            </button>
          </div>
        </div>

        {/* 4 Primary Interactive Modes Selector Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-100 dark:bg-slate-900/90 p-2 rounded-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveMode('learning')}
            className={`touch-target p-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 border min-w-0 ${
              activeMode === 'learning'
                ? 'tq-btn-primary border-transparent'
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-teal-300 dark:hover:border-slate-700'
            }`}
          >
            <BookOpen size={16} /> Learning Mode
          </button>

          <button
            onClick={() => setActiveMode('simulation')}
            className={`touch-target p-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 border min-w-0 ${
              activeMode === 'simulation'
                ? 'tq-btn-primary border-transparent'
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-teal-300 dark:hover:border-slate-700'
            }`}
          >
            <Stethoscope size={16} /> Clinical Simulation
          </button>

          <button
            onClick={() => setActiveMode('assessment')}
            className={`touch-target p-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 border min-w-0 ${
              activeMode === 'assessment'
                ? 'tq-btn-primary border-transparent'
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-teal-300 dark:hover:border-slate-700'
            }`}
          >
            <Trophy size={16} /> Assessment Mode
          </button>

          <button
            onClick={() => setActiveMode('faculty')}
            className={`touch-target p-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 border min-w-0 ${
              activeMode === 'faculty'
                ? 'tq-btn-primary border-transparent'
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-teal-300 dark:hover:border-slate-700'
            }`}
          >
            <Users size={16} /> Faculty View
          </button>
        </div>
      </div>

      {/* Render Selected Mode View */}
      <AnimatePresence mode="wait">
        {activeMode === 'learning' && (
          <motion.div
            key="learning-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <InteractiveFlowchartCanvas
              nodes={flowchartData.nodes}
              activeNodeId={activeNodeId}
              visitedNodeIds={visitedNodeIds}
              onNodeClick={handleNodeClick}
            />
          </motion.div>
        )}

        {activeMode === 'simulation' && (
          <motion.div
            key="simulation-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ClinicalSimulationEngine
              nodes={flowchartData.nodes}
              onInspectNode={(node) => setInspectedNode(node)}
            />
          </motion.div>
        )}

        {activeMode === 'assessment' && (
          <motion.div
            key="assessment-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlgorithmAssessmentMode
              nodes={flowchartData.nodes}
              onFinishAssessment={(score, gainedXp) => {
                if (onFinishCase) {
                  onFinishCase(score, gainedXp);
                }
              }}
            />
          </motion.div>
        )}

        {activeMode === 'faculty' && (
          <motion.div
            key="faculty-mode"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="tq-card tq-fade-up p-6 space-y-6 shadow-xl max-w-full overflow-hidden"
          >
            <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700/60">
              <Users className="text-cyan-400" size={24} />
              <div>
                <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Faculty Algorithm Tracking Dashboard</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Monitor student decision pathways, accuracy, velocity, and common diagnostic errors.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="tq-card p-4 space-y-1 min-w-0">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">Total Algorithm Runs</span>
                <p className="tq-display text-2xl text-brand-teal dark:text-cyan-400">142 Cases</p>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                  <CheckCircle2 size={12} /> 88.4% Completion Rate
                </span>
              </div>

              <div className="tq-card p-4 space-y-1 min-w-0">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">Avg Decision Velocity</span>
                <p className="tq-display text-2xl text-violet-600 dark:text-purple-400">18.4s / step</p>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">Standard NTEP Target: &lt; 30s</span>
              </div>

              <div className="tq-card p-4 space-y-1 min-w-0">
                <span className="text-[10px] font-mono uppercase text-slate-500 dark:text-slate-400">Most Common Deviation</span>
                <p className="text-sm font-bold text-rose-600 dark:text-rose-400">Skipping CBNAAT in Smear (+)</p>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">24% students affected</span>
              </div>
            </div>

            <div className="tq-card p-4 space-y-3 min-w-0">
              <h4 className="tq-eyebrow">Pathway Distribution Analytics:</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between gap-2 text-xs text-slate-600 dark:text-slate-300 mb-1 min-w-0">
                    <span>1st Line Anti-TB Treatment Pathway (DS-TB)</span>
                    <span className="font-mono text-brand-teal dark:text-cyan-400 font-bold">58%</span>
                  </div>
                  <div className="tq-progress w-full">
                    <div className="tq-progress-bar" style={{ width: '58%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between gap-2 text-xs text-slate-600 dark:text-slate-300 mb-1 min-w-0">
                    <span>PMDT Drug-Resistant Referral (RR-TB)</span>
                    <span className="font-mono text-rose-600 dark:text-rose-400 font-bold">22%</span>
                  </div>
                  <div className="tq-progress w-full">
                    <div className="h-full rounded-full bg-gradient-to-r from-rose-400 to-brand-coral" style={{ width: '22%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between gap-2 text-xs text-slate-600 dark:text-slate-300 mb-1 min-w-0">
                    <span>Clinically Diagnosed & Alternative Pathway</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">20%</span>
                  </div>
                  <div className="tq-progress w-full">
                    <div className="tq-progress-bar tq-progress-bar-amber" style={{ width: '20%' }} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Node Inspector Modal */}
      <AnimatePresence>
        {inspectedNode && (
          <NodeInspectorModal
            node={inspectedNode}
            onClose={() => setInspectedNode(null)}
            onJumpToSimulation={(nodeId) => {
              setActiveMode('simulation');
              setActiveNodeId(nodeId);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
