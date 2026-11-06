import React, { useState, useEffect } from 'react';
import { Stethoscope, Award, ArrowLeft, RefreshCw, Layers } from 'lucide-react';
import { DiagnosticAlgorithmCase } from '../types';
import { DIAGNOSTIC_ALGORITHM_CASES } from '../data/diagnosticAlgorithmCases';
import MasterFlowchartCanvas, { FlowchartNodeId } from './MasterFlowchartCanvas';
import MedicalReportModal from './MedicalReportModal';
import { soundService } from '../services/soundService';
import { supabaseData } from '../services/supabaseData';

interface TBDiagnosticAlgorithmEngineProps {
  currentUserId?: string | null;
  onFinishCase: (score: number, xp: number, badge?: string) => void;
  onBack: () => void;
}

export default function TBDiagnosticAlgorithmEngine({
  currentUserId,
  onFinishCase,
  onBack
}: TBDiagnosticAlgorithmEngineProps) {
  // Pick random case or default to first
  const [activeCase] = useState<DiagnosticAlgorithmCase>(() => {
    const randomIndex = Math.floor(Math.random() * DIAGNOSTIC_ALGORITHM_CASES.length);
    return DIAGNOSTIC_ALGORITHM_CASES[randomIndex] || DIAGNOSTIC_ALGORITHM_CASES[0];
  });

  // Track state for each flowchart node: 'completed' | 'active' | 'locked' | 'wrong'
  const [nodeStates, setNodeStates] = useState<Record<FlowchartNodeId, 'completed' | 'active' | 'locked' | 'wrong'>>({
    presumptive: 'active',
    plhiv: 'locked',
    smear: 'locked',
    cxr: 'locked',
    smear_pos_cxr_sug: 'locked',
    smear_pos_cxr_not_sug: 'locked',
    smear_neg_cxr_sug: 'locked',
    smear_neg_cxr_not_sug: 'locked',
    suspicion_high: 'locked',
    pmdt_criteria: 'locked',
    cbnaat: 'locked',
    mtb_detected: 'locked',
    mtb_not_detected: 'locked',
    rif_sensitive: 'locked',
    rif_indeterminate: 'locked',
    rif_resistant: 'locked',
    repeat_cbnaat_2nd: 'locked',
    indeterminate_liquid_culture: 'locked',
    microbiologically_confirmed: 'locked',
    refer_management_rif_res: 'locked',
    consider_alternate_specialist: 'locked',
    clinically_diagnosed: 'locked',
    alternate_diagnosis: 'locked'
  });

  // Modal Report Overlay type: 'patient_info' | 'smear' | 'cxr' | 'cbnaat' | 'summary' | null
  const [activeModal, setActiveModal] = useState<'patient_info' | 'smear' | 'cxr' | 'cbnaat' | 'summary' | null>(null);
  const [clickedNodeId, setClickedNodeId] = useState<FlowchartNodeId | null>(null);

  // Performance scoring & timing
  const [score, setScore] = useState(100);
  const [xpEarned, setXpEarned] = useState(100);
  const [startTime] = useState<number>(Date.now());
  const [timeTakenSeconds, setTimeTakenSeconds] = useState(0);

  // Handle node interaction on the canvas
  const handleNodeClick = (nodeId: FlowchartNodeId) => {
    const state = nodeStates[nodeId] || 'locked';

    if (state === 'locked') {
      soundService.playIncorrect();
      setScore(prev => Math.max(0, prev - 10));
      return;
    }

    soundService.playClick();
    setClickedNodeId(nodeId);

    // Open appropriate medical window based on node
    if (nodeId === 'presumptive' || nodeId === 'plhiv') {
      setActiveModal('patient_info');
    } else if (nodeId === 'smear') {
      setActiveModal('smear');
    } else if (nodeId === 'cxr') {
      setActiveModal('cxr');
    } else if (nodeId === 'cbnaat') {
      setActiveModal('cbnaat');
    } else if (nodeId === 'microbiologically_confirmed' || nodeId === 'clinically_diagnosed' || nodeId === 'alternate_diagnosis') {
      finishCase(nodeId);
    } else {
      // Auto advance intermediate combination nodes
      setNodeStates(prev => ({
        ...prev,
        [nodeId]: 'completed',
        cbnaat: 'active'
      }));
    }
  };

  // Callback when medical window modal closes
  const handleCompleteCurrentNode = () => {
    if (!clickedNodeId) return;

    soundService.playCorrect();
    setScore(prev => prev + 50);
    setXpEarned(prev => prev + 50);

    if (clickedNodeId === 'presumptive') {
      setNodeStates(prev => ({
        ...prev,
        presumptive: 'completed',
        smear: 'active',
        cxr: 'active'
      }));
    } else if (clickedNodeId === 'smear') {
      setNodeStates(prev => ({
        ...prev,
        smear: 'completed',
        smear_pos_cxr_sug: activeCase.type === 'pulmonary' ? 'active' : 'completed',
        smear_pos_cxr_not_sug: activeCase.type === 'mdr' ? 'active' : 'completed',
        cbnaat: 'active'
      }));
    } else if (clickedNodeId === 'cxr') {
      setNodeStates(prev => ({
        ...prev,
        cxr: 'completed',
        cbnaat: 'active'
      }));
    } else if (clickedNodeId === 'cbnaat') {
      if (activeCase.type === 'mdr') {
        setNodeStates(prev => ({
          ...prev,
          cbnaat: 'completed',
          mtb_detected: 'completed',
          rif_resistant: 'completed',
          refer_management_rif_res: 'active',
          microbiologically_confirmed: 'active'
        }));
      } else {
        setNodeStates(prev => ({
          ...prev,
          cbnaat: 'completed',
          mtb_detected: 'completed',
          rif_sensitive: 'completed',
          microbiologically_confirmed: 'active'
        }));
      }
    }
  };

  const finishCase = async (finalNodeId: FlowchartNodeId) => {
    const elapsed = Math.round((Date.now() - startTime) / 1000);
    setTimeTakenSeconds(elapsed);
    setActiveModal('summary');
    soundService.playTrophy();

    const outputKey = Object.keys(activeCase.finalOutputs)[0];
    const output = activeCase.finalOutputs[outputKey];

    onFinishCase(score + 150, xpEarned + 200, output?.badge || 'Master Diagnostic Specialist');

    if (currentUserId) {
      await supabaseData.saveQuizResult(
        currentUserId,
        activeCase.type,
        score + 150,
        xpEarned + 200,
        elapsed
      );
      if (output?.badge) {
        await supabaseData.saveAchievement(currentUserId, output.badge);
      }
    }
  };

  return (
    <div className="tq-fade-up overflow-hidden bg-alabaster p-3 font-sans dark:bg-[#0b1220] sm:p-6 pb-24 max-w-7xl mx-auto min-h-[85vh] flex flex-col justify-between text-ink-900 dark:text-white space-y-4">
      {/* Dashboard Top Header Bar (Preserved Styling) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="tq-chip tq-chip-teal px-2.5 py-0.5 text-[10px] sm:text-xs font-mono uppercase font-bold">
              {activeCase.difficulty}
            </span>
            <span className="tq-chip tq-chip-royal px-2.5 py-0.5 text-[10px] sm:text-xs font-mono">
              Case ID: {activeCase.id}
            </span>
            <span className="tq-chip tq-chip-teal px-2.5 py-0.5 text-[10px] sm:text-xs font-mono font-bold">
              NTEP Official Interactive Flowchart Engine
            </span>
          </div>
          <h1 className="tq-display text-xl sm:text-2xl font-black text-ink-900 dark:text-white flex items-center gap-2">
            <Stethoscope className="text-brand-teal shrink-0" size={24} />
            {activeCase.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{activeCase.subtitle}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#111c30] border border-teal-200 dark:border-teal-500/30 rounded-xl text-xs font-mono text-teal-700 dark:text-teal-300 font-bold">
            <Award size={16} />
            <span>SCORE: {score}</span>
          </div>
          <button
            onClick={() => {
              soundService.playClick();
              onBack();
            }}
            className="tq-btn-secondary touch-target px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 dark:bg-[#111c30] dark:text-slate-200 dark:border-slate-700"
          >
            <ArrowLeft size={14} />
            <span>Exit Case</span>
          </button>
        </div>
      </div>

      {/* Main Flowchart Visual Canvas */}
      <MasterFlowchartCanvas
        activeCase={activeCase}
        nodeStates={nodeStates}
        onNodeClick={handleNodeClick}
      />

      {/* Full Medical Window Overlays */}
      <MedicalReportModal
        modalType={activeModal}
        activeCase={activeCase}
        caseState={{
          score,
          xpEarned,
          timeTakenSeconds
        }}
        onClose={() => {
          setActiveModal(null);
          if (activeModal === 'summary') {
            onBack();
          }
        }}
        onCompleteNode={handleCompleteCurrentNode}
      />
    </div>
  );
}
