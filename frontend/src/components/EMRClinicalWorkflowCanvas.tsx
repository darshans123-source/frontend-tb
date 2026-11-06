import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, Clock, Play, FileText, Microscope, Activity, 
  Stethoscope, Award, ChevronRight, ShieldAlert, AlertTriangle, Layers
} from 'lucide-react';
import { EMRPatient } from '../types';

export type EMRWorkflowStepId = 
  | 'presumptive'
  | 'assessment'
  | 'cxr'
  | 'smear'
  | 'cbnaat'
  | 'mtb_status'
  | 'diagnosis'
  | 'treatment'
  | 'final_report';

export interface EMRWorkflowStep {
  id: EMRWorkflowStepId;
  label: string;
  subtitle: string;
  iconName: 'presumptive' | 'assessment' | 'cxr' | 'smear' | 'cbnaat' | 'mtb_status' | 'diagnosis' | 'treatment' | 'final_report';
}

interface EMRClinicalWorkflowCanvasProps {
  patient: EMRPatient;
  activeStepId: EMRWorkflowStepId;
  completedStepIds: EMRWorkflowStepId[];
  onSelectStep: (stepId: EMRWorkflowStepId) => void;
}

export const CANONICAL_WORKFLOW_STEPS: EMRWorkflowStep[] = [
  { id: 'presumptive', label: '1. Presumptive Triage', subtitle: 'Patient Intake & Category', iconName: 'presumptive' },
  { id: 'assessment', label: '2. Clinical Examination', subtitle: 'Vitals, Symptoms & History', iconName: 'assessment' },
  { id: 'cxr', label: '3. Chest Radiography (CXR)', subtitle: 'Parenchymal & Cavitary Screening', iconName: 'cxr' },
  { id: 'smear', label: '4. Smear Microscopy', subtitle: 'AFB ZN & LED-FM Bacillary Grading', iconName: 'smear' },
  { id: 'cbnaat', label: '5. GeneXpert CBNAAT', subtitle: 'Rapid Molecular DST Assay', iconName: 'cbnaat' },
  { id: 'mtb_status', label: '6. Diagnostic Branching', subtitle: 'MTB Status & Rif Resistance', iconName: 'mtb_status' },
  { id: 'diagnosis', label: '7. Clinical Conclusion', subtitle: 'NTEP Case Categorization', iconName: 'diagnosis' },
  { id: 'treatment', label: '8. Treatment Protocol', subtitle: 'Weight-Banded Regimen Assignment', iconName: 'treatment' },
  { id: 'final_report', label: '9. Discharge & Report', subtitle: 'Printable EMR Summary & PDF', iconName: 'final_report' }
];

export default function EMRClinicalWorkflowCanvas({
  patient,
  activeStepId,
  completedStepIds,
  onSelectStep
}: EMRClinicalWorkflowCanvasProps) {
  const currentStepIndex = CANONICAL_WORKFLOW_STEPS.findIndex(s => s.id === activeStepId);
  const progressPercent = Math.round(((completedStepIds.length) / CANONICAL_WORKFLOW_STEPS.length) * 100);

  const getStepState = (stepId: EMRWorkflowStepId, idx: number): 'completed' | 'active' | 'future' => {
    if (completedStepIds.includes(stepId)) return 'completed';
    if (stepId === activeStepId) return 'active';
    return 'future';
  };

  return (
    <div className="tq-card tq-fade-up max-w-full overflow-hidden p-5 shadow-2xl space-y-5 text-slate-900 dark:text-slate-100">
      {/* Workflow Header & Progress Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-700/60 pb-4">
        <div>
          <span className="tq-eyebrow">Official NTEP / WHO Clinical Pathway</span>
          <h3 className="tq-display text-lg text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="text-cyan-400" size={20} />
            Diagnostic & Clinical Progress Tracker
          </h3>
        </div>

        {/* Progress % Bar */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="flex-1 sm:w-48 bg-slate-50 dark:bg-[#111c30] p-2 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-1 min-w-0">
            <div className="flex justify-between items-center gap-2 text-[10px] font-mono min-w-0">
              <span className="text-slate-500 dark:text-slate-400 font-bold">WORKFLOW PROGRESS</span>
              <span className="text-brand-teal dark:text-cyan-300 font-bold">{progressPercent}%</span>
            </div>
            <div className="tq-progress w-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                className="tq-progress-bar"
              />
            </div>
          </div>

          <div className="px-3 py-2 bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-700/60 rounded-2xl text-center font-mono shrink-0">
            <span className="text-[9px] text-slate-500 dark:text-slate-400 block">COMPLETED STEPS</span>
            <span className="text-sm font-bold text-brand-emerald dark:text-emerald-400">{completedStepIds.length} / 9</span>
          </div>
        </div>
      </div>

      {/* Horizontal Sequential Workflow Step Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2 max-w-full">
        {CANONICAL_WORKFLOW_STEPS.map((step, idx) => {
          const state = getStepState(step.id, idx);
          const isCompleted = state === 'completed';
          const isActive = state === 'active';
          const isFuture = state === 'future';

          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              disabled={isFuture && !completedStepIds.includes(CANONICAL_WORKFLOW_STEPS[Math.max(0, idx - 1)].id)}
              className={`touch-target tq-lift p-3 rounded-2xl border transition-all text-left flex flex-col justify-between relative min-h-[90px] min-w-0 ${
                isCompleted
                  ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 dark:border-emerald-500/60 text-emerald-700 dark:text-emerald-300 hover:border-emerald-500 cursor-pointer'
                  : isActive
                  ? 'bg-teal-50 dark:bg-cyan-950/90 border-brand-teal dark:border-cyan-400 text-teal-900 dark:text-white font-extrabold shadow-[0_0_20px_rgba(13,148,136,0.35)] animate-pulse cursor-pointer ring-2 ring-teal-400/50 dark:ring-cyan-400/40'
                  : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[9px] font-mono font-bold uppercase opacity-80">Step {idx + 1}</span>
                {isCompleted ? (
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                ) : isActive ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                ) : (
                  <span className="text-[9px] font-mono text-slate-400 dark:text-slate-600">Locked</span>
                )}
              </div>

              <span className="text-xs font-bold leading-tight line-clamp-2">{step.label}</span>
              <span className="text-[9px] text-slate-500 dark:text-slate-400/80 line-clamp-1 mt-0.5">{step.subtitle}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
