import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ZoomIn, ZoomOut, RotateCcw, CheckCircle2, Lock, ArrowRight, Play } from 'lucide-react';
import { DiagnosticAlgorithmCase } from '../types';

export type FlowchartNodeId =
  | 'presumptive'
  | 'plhiv'
  | 'smear'
  | 'cxr'
  | 'smear_pos_cxr_sug'
  | 'smear_pos_cxr_not_sug'
  | 'smear_neg_cxr_sug'
  | 'smear_neg_cxr_not_sug'
  | 'suspicion_high'
  | 'pmdt_criteria'
  | 'cbnaat'
  | 'mtb_detected'
  | 'mtb_not_detected'
  | 'rif_sensitive'
  | 'rif_indeterminate'
  | 'rif_resistant'
  | 'repeat_cbnaat_2nd'
  | 'indeterminate_liquid_culture'
  | 'microbiologically_confirmed'
  | 'refer_management_rif_res'
  | 'consider_alternate_specialist'
  | 'clinically_diagnosed'
  | 'alternate_diagnosis';

interface MasterFlowchartCanvasProps {
  activeCase: DiagnosticAlgorithmCase;
  nodeStates: Record<FlowchartNodeId, 'completed' | 'active' | 'locked' | 'wrong'>;
  onNodeClick: (nodeId: FlowchartNodeId) => void;
}

export default function MasterFlowchartCanvas({
  activeCase,
  nodeStates,
  onNodeClick
}: MasterFlowchartCanvasProps) {
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleZoomIn = () => setZoomScale(prev => Math.min(prev + 0.15, 1.5));
  const handleZoomOut = () => setZoomScale(prev => Math.max(prev - 0.15, 0.75));
  const handleResetZoom = () => {
    setZoomScale(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const getNodeClass = (id: FlowchartNodeId, customTextColor?: string) => {
    const st = nodeStates[id] || 'locked';
    if (st === 'completed') {
      return 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:border-emerald-400 cursor-pointer';
    }
    if (st === 'active') {
      return 'bg-teal-50 dark:bg-cyan-950/90 border-brand-teal dark:border-cyan-400 text-teal-900 dark:text-white font-extrabold shadow-[0_0_25px_rgba(13,148,136,0.45)] animate-pulse hover:border-teal-400 dark:hover:border-cyan-300 cursor-pointer ring-2 ring-teal-400/50 dark:ring-cyan-400/50';
    }
    if (st === 'wrong') {
      return 'bg-rose-50 dark:bg-rose-950/90 border-rose-400 dark:border-rose-500 text-rose-700 dark:text-rose-300 font-bold shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:border-rose-400 cursor-pointer';
    }
    return 'bg-slate-100 dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60 cursor-not-allowed';
  };

  return (
    <div className="tq-card tq-fade-up relative overflow-auto rounded-2xl p-4 sm:p-6 shadow-2xl min-h-[750px] flex flex-col justify-between text-slate-900 dark:text-slate-100 font-sans max-w-full">
      {/* Top Header & Zoom Controls */}
      <div className="tq-glass sticky top-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 rounded-2xl p-3 z-10">
        <div>
          <h2 className="tq-display text-xl sm:text-2xl text-slate-900 dark:text-white tracking-tight">
            Diagnostic algorithm for pulmonary TB
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs">Official WHO / NTEP Master Decision Tree Canvas</p>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="touch-target p-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1"
            title="Zoom Out"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 px-1 font-bold">{Math.round(zoomScale * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="touch-target p-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1"
            title="Zoom In"
          >
            <ZoomIn size={16} />
          </button>
          <button
            onClick={handleResetZoom}
            className="touch-target p-2 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1"
            title="Reset Canvas View"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Main Interactive Visual Flowchart Canvas Container */}
      <div className="overflow-auto py-6 my-auto flex justify-center items-center max-w-full">
        <motion.div
          animate={{ scale: zoomScale }}
          transition={{ duration: 0.2 }}
          className="min-w-[980px] max-w-[1100px] space-y-6 mx-auto transition-transform origin-top"
        >
          {/* LEVEL 1: TOP PRESUMPTIVE & PLHIV BANNER */}
          <div className="relative flex justify-center items-center">
            {/* PLHIV Box Left */}
            <button
              onClick={() => onNodeClick('plhiv')}
              className={`absolute left-0 top-0 w-32 h-14 rounded-2xl border text-center p-2 flex items-center justify-center text-xs transition-all min-w-0 ${getNodeClass('plhiv')}`}
            >
              <span className="text-rose-600 dark:text-rose-400 font-extrabold">PLHIV</span>
            </button>

            {/* Presumptive TB Patient Box Center */}
            <button
              onClick={() => onNodeClick('presumptive')}
              className={`w-[600px] max-w-full h-14 rounded-2xl border text-center p-2 flex items-center justify-center text-sm transition-all min-w-0 ${getNodeClass('presumptive')}`}
            >
              <span className="text-rose-600 dark:text-rose-400 font-black text-base tracking-wide">Presumptive TB patient</span>
            </button>
          </div>

          {/* SVG CONNECTOR LINES LEVEL 1 TO LEVEL 2 */}
          <div className="w-full h-8 relative">
            <svg className="w-full h-full stroke-cyan-500/50 fill-none" strokeWidth="2">
              {/* Vertical line from Presumptive to horizontal split */}
              <line x1="50%" y1="0" x2="50%" y2="14" />
              {/* Horizontal line splitting to Smear (left) and CXR (right) */}
              <line x1="30%" y1="14" x2="70%" y2="14" />
              {/* Down arrows to Smear and CXR */}
              <line x1="30%" y1="14" x2="30%" y2="32" markerEnd="url(#arrow)" />
              <line x1="70%" y1="14" x2="70%" y2="32" markerEnd="url(#arrow)" />
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
                </marker>
              </defs>
            </svg>
          </div>

          {/* LEVEL 2: SMEAR EXAMINATION & CXR NODES */}
          <div className="grid grid-cols-2 gap-16 px-16">
            <button
              onClick={() => onNodeClick('smear')}
              className={`h-14 min-h-11 rounded-2xl border text-center p-2 flex items-center justify-center text-sm transition-all min-w-0 ${getNodeClass('smear')}`}
            >
              <span className="text-rose-600 dark:text-rose-400 font-black text-base">Smear Examination</span>
            </button>

            <button
              onClick={() => onNodeClick('cxr')}
              className={`h-14 min-h-11 rounded-2xl border text-center p-2 flex items-center justify-center text-sm transition-all min-w-0 ${getNodeClass('cxr')}`}
            >
              <span className="text-rose-600 dark:text-rose-400 font-black text-base">CXR</span>
            </button>
          </div>

          {/* LEVEL 3: COMBINED OUTCOMES & HIGH CLINICAL SUSPICION */}
          <div className="grid grid-cols-5 gap-3 pt-2">
            <button
              onClick={() => onNodeClick('smear_pos_cxr_sug')}
              className={`h-24 min-h-11 rounded-2xl border p-2.5 text-center flex items-center justify-center text-xs leading-snug transition-all min-w-0 ${getNodeClass('smear_pos_cxr_sug')}`}
            >
              Smear Positive and CXR suggestive of TB
            </button>

            <button
              onClick={() => onNodeClick('smear_pos_cxr_not_sug')}
              className={`h-24 min-h-11 rounded-2xl border p-2.5 text-center flex items-center justify-center text-xs leading-snug transition-all min-w-0 ${getNodeClass('smear_pos_cxr_not_sug')}`}
            >
              Smear Positive, but CXR not suggestive of TB
            </button>

            <button
              onClick={() => onNodeClick('smear_neg_cxr_sug')}
              className={`h-24 min-h-11 rounded-2xl border p-2.5 text-center flex items-center justify-center text-xs leading-snug transition-all min-w-0 ${getNodeClass('smear_neg_cxr_sug')}`}
            >
              Smear Negative but CXR suggestive of TB
            </button>

            <button
              onClick={() => onNodeClick('smear_neg_cxr_not_sug')}
              className={`h-24 min-h-11 rounded-2xl border p-2.5 text-center flex items-center justify-center text-xs leading-snug transition-all min-w-0 ${getNodeClass('smear_neg_cxr_not_sug')}`}
            >
              Smear Negative or Not Available & CXR not suggestive of TB or not available
            </button>

            <button
              onClick={() => onNodeClick('suspicion_high')}
              className={`h-24 min-h-11 rounded-2xl border p-2.5 text-center flex items-center justify-center text-xs leading-snug transition-all min-w-0 ${getNodeClass('suspicion_high')}`}
            >
              Clinical Suspicion High
            </button>
          </div>

          {/* PMDT DOTTED BOX & CENTRAL CBNAAT LAYER */}
          <div className="grid grid-cols-5 gap-3 items-center py-2">
            {/* PMDT Dotted Box Left */}
            <button
              onClick={() => onNodeClick('pmdt_criteria')}
              className={`col-span-2 h-16 min-h-11 rounded-2xl border-2 border-dashed border-slate-400 dark:border-slate-600 p-2.5 text-center flex items-center justify-center text-xs font-bold transition-all min-w-0 ${getNodeClass('pmdt_criteria')}`}
            >
              PMDT criteria, high MDR settings
            </button>

            {/* Central CBNAAT Node */}
            <button
              onClick={() => onNodeClick('cbnaat')}
              className={`col-span-3 h-16 min-h-11 rounded-2xl border text-center p-2.5 flex items-center justify-center text-base transition-all min-w-0 ${getNodeClass('cbnaat')}`}
            >
              <span className="text-rose-600 dark:text-rose-400 font-black text-xl tracking-wider">CBNAAT</span>
            </button>
          </div>

          {/* LEVEL 5: MTB DETECTED VS NOT DETECTED */}
          <div className="grid grid-cols-2 gap-12 pt-2">
            {/* Left Branch Header: MTB Detected */}
            <div className="space-y-3">
              <button
                onClick={() => onNodeClick('mtb_detected')}
                className={`w-full h-14 min-h-11 rounded-2xl border text-center p-2 flex items-center justify-center text-sm font-bold transition-all min-w-0 ${getNodeClass('mtb_detected')}`}
              >
                MTB detected
              </button>

              {/* Sub-branches for Rif sensitive / Indeterminate / Resistant */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onNodeClick('rif_sensitive')}
                  className={`h-14 min-h-11 rounded-2xl border p-2 text-center flex items-center justify-center text-xs font-bold transition-all min-w-0 ${getNodeClass('rif_sensitive')}`}
                >
                  Rif sensitive
                </button>

                <button
                  onClick={() => onNodeClick('rif_indeterminate')}
                  className={`h-14 min-h-11 rounded-2xl border p-2 text-center flex items-center justify-center text-xs font-bold transition-all min-w-0 ${getNodeClass('rif_indeterminate')}`}
                >
                  Rif Indeterminate
                </button>

                <button
                  onClick={() => onNodeClick('rif_resistant')}
                  className={`h-14 min-h-11 rounded-2xl border p-2 text-center flex items-center justify-center text-xs font-bold transition-all min-w-0 ${getNodeClass('rif_resistant')}`}
                >
                  Rif Resistant
                </button>
              </div>

              {/* Indeterminate Repeat Boxes */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => onNodeClick('repeat_cbnaat_2nd')}
                  className={`w-full h-12 min-h-11 rounded-2xl border p-2 text-center flex items-center justify-center text-xs transition-all min-w-0 ${getNodeClass('repeat_cbnaat_2nd')}`}
                >
                  Repeat CBNAAT on 2nd sample
                </button>

                <button
                  onClick={() => onNodeClick('indeterminate_liquid_culture')}
                  className={`w-full h-14 min-h-11 rounded-2xl border p-2 text-center flex items-center justify-center text-xs leading-tight transition-all min-w-0 ${getNodeClass('indeterminate_liquid_culture')}`}
                >
                  Indeterminate on 2nd sample, collect fresh sample for Liquid Culture / LPA
                </button>
              </div>
            </div>

            {/* Right Branch Header: MTB Not Detected */}
            <div className="space-y-3">
              <button
                onClick={() => onNodeClick('mtb_not_detected')}
                className={`w-full h-14 min-h-11 rounded-2xl border text-center p-2 flex items-center justify-center text-xs font-bold leading-tight transition-all min-w-0 ${getNodeClass('mtb_not_detected')}`}
              >
                MTB not detected or CBNAAT result not available
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => onNodeClick('refer_management_rif_res')}
                  className={`h-24 min-h-11 rounded-2xl border p-2.5 text-center flex items-center justify-center text-xs leading-snug transition-all min-w-0 ${getNodeClass('refer_management_rif_res')}`}
                >
                  Refer to management of Rif Resistance
                </button>

                <button
                  onClick={() => onNodeClick('consider_alternate_specialist')}
                  className={`h-24 min-h-11 rounded-2xl border p-2.5 text-center flex items-center justify-center text-xs leading-snug transition-all min-w-0 ${getNodeClass('consider_alternate_specialist')}`}
                >
                  Consider alternate diagnosis and refer to specialist
                </button>
              </div>
            </div>
          </div>

          {/* FINAL DIAGNOSTIC OUTCOMES LAYER */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-4 border-t border-slate-200 dark:border-slate-900">
            {/* Confirmed TB Left */}
            <button
              onClick={() => onNodeClick('microbiologically_confirmed')}
              className={`h-16 min-h-11 rounded-2xl border text-center p-3 flex items-center justify-center text-sm font-black transition-all min-w-0 ${getNodeClass('microbiologically_confirmed', 'text-blue-400')}`}
            >
              <span className="text-brand-royal dark:text-blue-400 text-base">Microbiologically Confirmed TB</span>
            </button>

            {/* Clinically Diagnosed TB Center */}
            <button
              onClick={() => onNodeClick('clinically_diagnosed')}
              className={`h-16 min-h-11 rounded-2xl border text-center p-3 flex items-center justify-center text-sm font-black transition-all min-w-0 ${getNodeClass('clinically_diagnosed', 'text-blue-400')}`}
            >
              <span className="text-brand-royal dark:text-blue-400 text-base">Clinically Diagnosed TB</span>
            </button>

            {/* Alternate Diagnosis Right */}
            <button
              onClick={() => onNodeClick('alternate_diagnosis')}
              className={`h-16 min-h-11 rounded-2xl border text-center p-3 flex items-center justify-center text-sm font-bold transition-all min-w-0 ${getNodeClass('alternate_diagnosis')}`}
            >
              Alternate diagnosis
            </button>
          </div>
        </motion.div>
      </div>

      {/* FOOTER NTEP MANDATE NOTE */}
      <div className="border-t border-slate-200 dark:border-slate-900 pt-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <p className="italic">
          *All presumptive TB cases should be offered HIV counseling and testing; however diagnostic work up for TB must not be delayed.
        </p>
        <span className="font-mono text-[10px] text-brand-teal dark:text-cyan-400 font-bold uppercase">
          NTEP 2024 MASTER DIAGNOSTIC ALGORITHM
        </span>
      </div>
    </div>
  );
}
