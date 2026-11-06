import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Activity, Microscope, CheckCircle2, AlertTriangle, 
  XCircle, Award, Stethoscope, ChevronRight, ShieldAlert, Info, Clock, Download
} from 'lucide-react';
import { DiagnosticAlgorithmCase } from '../types';

interface MedicalReportModalProps {
  modalType: 'patient_info' | 'smear' | 'cxr' | 'cbnaat' | 'summary' | null;
  activeCase: DiagnosticAlgorithmCase;
  caseState: {
    smearResult?: 'positive_cxr_suggestive' | 'positive_cxr_not_suggestive' | 'negative_cxr_suggestive' | 'negative_cxr_not_suggestive';
    cbnaatResult?: 'mtb_detected_rif_sensitive' | 'mtb_detected_rif_resistant' | 'mtb_not_detected';
    score: number;
    xpEarned: number;
    timeTakenSeconds: number;
  };
  onClose: () => void;
  onCompleteNode?: () => void;
}

export default function MedicalReportModal({
  modalType,
  activeCase,
  caseState,
  onClose,
  onCompleteNode
}: MedicalReportModalProps) {
  if (!modalType) return null;

  const handleCloseAndAdvance = () => {
    if (onCompleteNode) onCompleteNode();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white dark:bg-[#111c30] border border-teal-200 dark:border-teal-500/40 rounded-2xl max-w-3xl w-full p-5 sm:p-7 space-y-6 text-ink-900 dark:text-white shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* MODAL 1: PATIENT DOSSIER */}
        {modalType === 'patient_info' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-500/40 flex items-center justify-center text-teal-600 dark:text-teal-300 font-bold shrink-0">
                  <Stethoscope size={26} />
                </div>
                <div>
                  <span className="tq-eyebrow text-[10px] font-mono uppercase tracking-wider">Clinical Patient Intake</span>
                  <h2 className="text-xl sm:text-2xl font-black text-ink-900 dark:text-white">{activeCase.patientInfo.name} ({activeCase.patientInfo.age}y / {activeCase.patientInfo.gender})</h2>
                </div>
              </div>
              <span className="tq-chip tq-chip-amber px-3 py-1 text-xs font-mono font-bold">
                Presumptive TB Suspect
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <h4 className="tq-eyebrow text-xs flex items-center gap-2">
                  <FileText size={15} /> Chief Complaint & Duration
                </h4>
                <p className="text-xs text-ink-900 dark:text-white font-semibold">"{activeCase.patientInfo.complaint}"</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Duration: <strong className="text-slate-700 dark:text-slate-200">{activeCase.patientInfo.duration}</strong></p>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase block font-bold mb-1">Reported Symptoms</span>
                  <ul className="space-y-1">
                    {activeCase.patientInfo.symptoms.map((s, i) => (
                      <li key={i} className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-2">
                  <Activity size={15} /> Clinical Vitals & Physical Exam
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Temp:</span>
                    <span className="text-amber-600 dark:text-amber-300 font-bold">{activeCase.patientInfo.vitals.temp}</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block">Pulse:</span>
                    <span className="text-teal-600 dark:text-teal-300 font-bold">{activeCase.patientInfo.vitals.pulse}</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block">BP:</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">{activeCase.patientInfo.vitals.bp}</span>
                  </div>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 text-[10px] block">SpO2 / BMI:</span>
                    <span className="text-emerald-600 dark:text-emerald-300 font-bold">{activeCase.patientInfo.vitals.spO2} / {activeCase.patientInfo.vitals.bmi}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">
                  <strong className="text-slate-700 dark:text-slate-200">Auscultation:</strong> {activeCase.patientInfo.physicalExam}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider flex items-center gap-2">
                <Info size={15} /> Medical History & Risk Profile
              </h4>
              <p className="text-slate-600 dark:text-slate-300">{activeCase.patientInfo.history}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeCase.patientInfo.riskFactors.map((rf, i) => (
                  <span key={i} className="tq-chip tq-chip-coral px-2.5 py-1 rounded-md text-[11px]">
                    {rf}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleCloseAndAdvance}
                className="tq-btn-primary touch-target px-6 py-3 font-extrabold rounded-xl text-xs transition-all flex items-center gap-2"
              >
                <span>Confirm Review & Return to Flowchart</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* MODAL 2: SPUTUM SMEAR MICROSCOPY REPORT */}
        {modalType === 'smear' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-300 font-bold shrink-0">
                  <Microscope size={26} />
                </div>
                <div>
                  <span className="tq-eyebrow text-[10px] font-mono uppercase tracking-wider">NTEP Designated Microscopy Centre</span>
                  <h2 className="text-xl sm:text-2xl font-black text-ink-900 dark:text-white">Sputum AFB Smear Microscopy Report</h2>
                </div>
              </div>
              <span className="tq-chip tq-chip-teal px-3 py-1 text-xs font-mono font-bold">
                LAB REF: ZN-2024-884
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-xl space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-slate-500 block text-[10px]">Stain Method:</span>
                  <span className="text-teal-600 dark:text-teal-300 font-bold">Ziehl-Neelsen (ZN) / LED-FM</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Specimen Type:</span>
                  <span className="text-slate-700 dark:text-slate-200 font-bold">Purulent Sputum (Spot & Morning)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Quality:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Adequate (&gt; 25 PMNs/HPF)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Microscopist:</span>
                  <span className="text-slate-600 dark:text-slate-300">Sr. Tech L. Sharma</span>
                </div>
              </div>

              {/* Microscopy Findings */}
              <div className="p-4 bg-amber-50 dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-amber-500/30 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Microscopy Grading Result</span>
                  <h3 className="text-xl font-black text-ink-900 dark:text-white mt-0.5">
                    {activeCase.type === 'pulmonary' && '2+ Acid-Fast Bacilli (AFB POSITIVE)'}
                    {activeCase.type === 'mdr' && '3+ Acid-Fast Bacilli (AFB POSITIVE)'}
                    {activeCase.type === 'hiv' && '1+ Acid-Fast Bacilli (AFB POSITIVE)'}
                    {activeCase.id.includes('smear_neg') && 'No Acid-Fast Bacilli Seen (AFB NEGATIVE)'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {activeCase.id.includes('smear_neg') 
                      ? 'No red rod-shaped bacilli detected in 100 high-power oil immersion fields.'
                      : 'Bright red, slender, straight or slightly curved rod-shaped bacilli observed against light blue background.'}
                  </p>
                </div>
                <div className="tq-chip tq-chip-amber px-4 py-2 font-mono font-bold rounded-xl text-xs shrink-0">
                  {activeCase.id.includes('smear_neg') ? 'SMEAR NEGATIVE' : 'SMEAR POSITIVE'}
                </div>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                <h5 className="tq-eyebrow">NTEP Clinical Pearl</h5>
                <p className="leading-relaxed text-slate-500 dark:text-slate-400">
                  Smear microscopy detects high bacillary loads (&gt; 5,000 bacilli/mL). Per NTEP universal DST guidelines, ALL smear-positive and smear-negative presumptive cases MUST proceed to CBNAAT molecular testing to detect MTB DNA and rule out Rifampicin resistance upfront.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleCloseAndAdvance}
                className="tq-btn-primary touch-target px-6 py-3 font-extrabold rounded-xl text-xs transition-all flex items-center gap-2"
              >
                <span>Return to Diagnostic Flowchart</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* MODAL 3: CHEST RADIOGRAPHY (CXR) VIEWER */}
        {modalType === 'cxr' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950 border border-teal-200 dark:border-teal-500/40 flex items-center justify-center text-teal-600 dark:text-teal-300 font-bold shrink-0">
                  <FileText size={26} />
                </div>
                <div>
                  <span className="tq-eyebrow text-[10px] font-mono uppercase tracking-wider">Radiology Digital Imaging Department</span>
                  <h2 className="text-xl sm:text-2xl font-black text-ink-900 dark:text-white">Chest Radiograph (PA View) Report</h2>
                </div>
              </div>
              <span className="tq-chip tq-chip-teal px-3 py-1 text-xs font-mono font-bold">
                X-RAY ID: CXR-9021
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Radiograph Graphic */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden relative min-h-[220px] flex items-center justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80" 
                  alt="Chest X-Ray" 
                  className="tq-img w-full h-48 aspect-[3/2] object-cover opacity-85 rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-3">
                  <span className="text-[10px] font-mono text-teal-700 dark:text-teal-300 bg-white/85 dark:bg-slate-950/80 px-2 py-1 rounded border border-teal-200 dark:border-teal-500/30">
                    PA VIEW • UPRIGHT INSPIRATION
                  </span>
                </div>
              </div>

              {/* Radiologist Report */}
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-xl space-y-3 text-xs">
                <h4 className="tq-eyebrow">Radiological Findings</h4>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {activeCase.id.includes('smear_neg')
                    ? 'Chest Radiograph reveals heterogeneous patchy parenchymal opacities with fibrocavitary changes in the right lung apex. No pleural effusion.'
                    : 'Upright PA chest film demonstrates heterogeneous patchy consolidation and a 2.1 cm thick-walled cavitary lesion in the right upper zone. Hilar shadows are prominent.'}
                </p>
                <div className="p-3 bg-white dark:bg-slate-900 border border-teal-200 dark:border-teal-500/30 rounded-lg space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Radiologist Impression</span>
                  <span className="text-teal-600 dark:text-teal-300 font-bold block">
                    Radiologically Suggestive of Active Pulmonary Tuberculosis
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 text-xs">
              <h5 className="font-bold text-amber-600 dark:text-amber-300 uppercase tracking-wider">WHO & NTEP Guidance</h5>
              <p className="text-slate-400 leading-relaxed">
                Chest X-Ray is a sensitive screening modality but cannot differentiate active TB from other infections or past scarring. Radiological abnormalities suggestive of TB require microbiological validation via molecular test (CBNAAT/GeneXpert).
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleCloseAndAdvance}
                className="tq-btn-primary touch-target px-6 py-3 font-extrabold rounded-xl text-xs transition-all flex items-center gap-2"
              >
                <span>Return to Flowchart Canvas</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* MODAL 4: GENEXPERT CBNAAT MOLECULAR ASSAY REPORT */}
        {modalType === 'cbnaat' && (
          <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-start gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-500/40 flex items-center justify-center text-purple-600 dark:text-purple-300 font-bold shrink-0">
                  <Activity size={26} />
                </div>
                <div>
                  <span className="tq-eyebrow text-[10px] font-mono uppercase tracking-wider">National Reference Molecular Laboratory</span>
                  <h2 className="text-xl sm:text-2xl font-black text-ink-900 dark:text-white">CBNAAT / GeneXpert MTB/RIF Assay Report</h2>
                </div>
              </div>
              <span className="tq-chip tq-chip-royal px-3 py-1 text-xs font-mono font-bold">
                XPERT RUN #GX-49021
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 rounded-xl space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-slate-500 block text-[10px]">Assay Cartridge:</span>
                  <span className="text-purple-600 dark:text-purple-300 font-bold">Xpert MTB/RIF Ultra</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Probe Target:</span>
                  <span className="text-slate-700 dark:text-slate-200 font-bold">IS6110 / IS1081 & rpoB</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Sample Type:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Decontaminated Sputum</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Detection Limit:</span>
                  <span className="text-slate-600 dark:text-slate-300 font-mono">16 CFU / mL</span>
                </div>
              </div>

              {/* Molecular Assay Main Result */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-purple-200 dark:border-purple-500/40 space-y-2">
                  <span className="text-[10px] font-mono text-purple-600 dark:text-purple-300 font-bold uppercase">M. Tuberculosis Complex Status</span>
                  <h3 className="text-lg font-black text-ink-900 dark:text-white">
                    {activeCase.type === 'mdr' ? 'MTB DETECTED (HIGH)' : 'MTB DETECTED (MEDIUM)'}
                  </h3>
                  <span className="tq-chip tq-chip-teal inline-block px-2.5 py-1 rounded text-[11px] font-mono font-bold">
                    MOLECULAR CONFIRMATION POSITIVE
                  </span>
                </div>

                <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-teal-200 dark:border-teal-500/40 space-y-2">
                  <span className="text-[10px] font-mono text-teal-600 dark:text-teal-300 font-bold uppercase">Rifampicin Resistance Status</span>
                  <h3 className="text-lg font-black text-ink-900 dark:text-white">
                    {activeCase.type === 'mdr' ? 'RIFAMPICIN RESISTANCE DETECTED' : 'RIFAMPICIN RESISTANCE NOT DETECTED'}
                  </h3>
                  <span className={`inline-block px-2.5 py-1 border rounded text-[11px] font-mono font-bold ${
                    activeCase.type === 'mdr' 
                      ? 'bg-rose-100 dark:bg-rose-950 border-rose-300 dark:border-rose-500/40 text-rose-700 dark:text-rose-300'
                      : 'bg-teal-100 dark:bg-teal-950 border-teal-300 dark:border-teal-500/40 text-teal-700 dark:text-teal-300'
                  }`}>
                    {activeCase.type === 'mdr' ? 'SWITCH TO PMDT DR-TB PATHWAY' : 'STANDARD 1ST LINE ATT INDICATED'}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-500/30 rounded-xl text-xs text-purple-800 dark:text-purple-100 space-y-1">
                <h5 className="font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider text-[10px]">NTEP Policy Requirement</h5>
                <p className="leading-relaxed text-[11px]">
                  All confirmed cases must be registered immediately on Nikshay portal. If Rifampicin resistance is detected, patient must be referred to PMDT Nodal Centre for All-Oral Bedaquiline regimen and 1st & 2nd line LPA testing.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleCloseAndAdvance}
                className="tq-btn-primary touch-target px-6 py-3 font-extrabold rounded-xl text-xs transition-all flex items-center gap-2"
              >
                <span>Return & Highlight Confirmed Branch</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* MODAL 5: FINAL DIAGNOSTIC & TREATMENT SUMMARY */}
        {modalType === 'summary' && (
          <div className="space-y-6">
            <div className="text-center space-y-2 border-b border-slate-200 dark:border-slate-800 pb-5">
              <div className="inline-flex p-3.5 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-500/40 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] mb-1">
                <Award size={38} />
              </div>
              <h2 className="tq-display text-2xl sm:text-3xl font-black text-ink-900 dark:text-white">Diagnostic Workflow Completed</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                Official Clinical Diagnosis & NTEP Regimen Generated via Interactive Flowchart Engine
              </p>
            </div>

            {(() => {
              const outputKey = Object.keys(activeCase.finalOutputs)[0];
              const output = activeCase.finalOutputs[outputKey];

              return (
                <div className="space-y-4">
                  {/* Confirmed Diagnosis Banner */}
                  <div className="p-4 bg-emerald-50 dark:bg-slate-950 border border-emerald-200 dark:border-emerald-500/50 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Final Microbiological Diagnosis</span>
                    <h3 className="text-lg font-black text-ink-900 dark:text-white">{output.diagnosis}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                      <h4 className="tq-eyebrow flex items-center gap-1.5">
                        <FileText size={14} /> Diagnostic Reasoning
                      </h4>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{output.reason}</p>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                      <h4 className="font-bold text-amber-600 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Microscope size={14} /> Investigations Executed
                      </h4>
                      <ul className="space-y-1">
                        {output.investigationsUsed.map((inv, i) => (
                          <li key={i} className="text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                            <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                            <span>{inv}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Treatment Plan */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 text-xs">
                    <h4 className="font-bold text-purple-600 dark:text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Stethoscope size={14} /> NTEP Standard Treatment Plan
                    </h4>
                    <p className="text-slate-700 dark:text-slate-200 whitespace-pre-line font-mono leading-relaxed">{output.treatmentRecommendation}</p>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-3 text-center font-mono">
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">FINAL SCORE</span>
                      <span className="text-base font-bold text-amber-600 dark:text-amber-300">{caseState.score + 150}</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">TIME ELAPSED</span>
                      <span className="text-base font-bold text-teal-600 dark:text-teal-300">{Math.floor(caseState.timeTakenSeconds / 60)}m {caseState.timeTakenSeconds % 60}s</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-500 block">XP GAINED</span>
                      <span className="text-base font-bold text-emerald-600 dark:text-emerald-300">+{caseState.xpEarned + 200}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex justify-center pt-2">
              <button
                onClick={onClose}
                className="tq-btn-primary touch-target px-8 py-3.5 font-black rounded-xl text-xs transition-all"
              >
                Complete Case & Save to Profile
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
