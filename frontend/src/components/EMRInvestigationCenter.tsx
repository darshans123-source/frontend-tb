import React, { useState } from 'react';
import { 
  FileText, Microscope, Activity, CheckCircle2, AlertTriangle, 
  ChevronRight, ShieldAlert, Info, Download, Award, HeartPulse, RefreshCw
} from 'lucide-react';
import { EMRPatient, EMRInvestigationReports } from '../types';
import { PRESET_INVESTIGATION_REPORTS } from '../data/emrPatientData';
import { soundService } from '../services/soundService';

interface EMRInvestigationCenterProps {
  patient: EMRPatient;
  activeTestType: 'cxr' | 'smear' | 'cbnaat' | 'culture' | 'blood';
  onCompleteTest: (testType: 'cxr' | 'smear' | 'cbnaat' | 'culture' | 'blood') => void;
}

export default function EMRInvestigationCenter({
  patient,
  activeTestType,
  onCompleteTest
}: EMRInvestigationCenterProps) {
  const reports: EMRInvestigationReports = PRESET_INVESTIGATION_REPORTS[patient.id] || PRESET_INVESTIGATION_REPORTS['pat_001'];

  const handleFinishInvestigation = () => {
    soundService.playCorrect();
    onCompleteTest(activeTestType);
  };

  return (
    <div className="tq-card tq-fade-up max-w-full overflow-hidden p-5 sm:p-7 shadow-2xl space-y-6 text-slate-900 dark:text-slate-100">
      {/* 1. CHEST RADIOGRAPHY (CXR) STUDIO */}
      {activeTestType === 'cxr' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-700/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 dark:bg-cyan-950 border border-teal-200 dark:border-cyan-500/40 flex items-center justify-center text-brand-teal dark:text-cyan-400 font-bold shrink-0">
                <FileText size={26} />
              </div>
              <div>
                <span className="tq-eyebrow">Radiology Digital Imaging Department</span>
                <h2 className="tq-display text-xl sm:text-2xl text-slate-900 dark:text-white">Chest Radiograph (PA View) Studio</h2>
              </div>
            </div>
            <span className="tq-chip tq-chip-teal">
              DATE: {reports.cxr?.date || '2026-08-02'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Radiograph Graphic */}
            <div className="tq-card overflow-hidden relative min-h-[260px] flex items-center justify-center">
              <img 
                src={reports.cxr?.imageUrl || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80'} 
                alt="Chest X-Ray Radiograph" 
                className="tq-img w-full h-60 aspect-[3/2] opacity-90 dark:opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-3">
                <span className="tq-chip tq-chip-teal">
                  DIGITAL PA RADIOGRAPH • APICAL VIEW
                </span>
              </div>
            </div>

            {/* Radiologist Report */}
            <div className="tq-card p-5 space-y-4 text-xs min-w-0">
              <h4 className="tq-eyebrow">Radiological Anatomical Findings</h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
                {reports.cxr?.findings}
              </p>
              
              <div className="p-3 bg-teal-50 dark:bg-slate-900 border border-teal-300 dark:border-cyan-500/40 rounded-xl space-y-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Radiologist Impression</span>
                <span className="text-brand-teal dark:text-cyan-300 font-bold block text-sm">
                  {reports.cxr?.impression}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 pt-1">
                <strong className="text-amber-600 dark:text-amber-300">NTEP Clinical Standard Note:</strong>
                <p>Chest X-Ray provides anatomical localization (cavitations, upper zone infiltrates) but requires microbiological validation via Sputum Microscopy and CBNAAT.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleFinishInvestigation}
              className="tq-btn-primary touch-target px-8 py-3.5 font-black text-xs flex items-center gap-2 max-w-full"
            >
              <span>Confirm CXR Review & Advance Workflow</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 2. SPUTUM SMEAR MICROSCOPY LAB */}
      {activeTestType === 'smear' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-700/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-500/40 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold shrink-0">
                <Microscope size={26} />
              </div>
              <div>
                <span className="tq-eyebrow">Designated Microscopy Centre (DMC)</span>
                <h2 className="tq-display text-xl sm:text-2xl text-slate-900 dark:text-white">Sputum AFB Smear Microscopy Report</h2>
              </div>
            </div>
            <span className="tq-chip tq-chip-amber">
              LAB ID: ZN-2024-884
            </span>
          </div>

          <div className="tq-card p-5 space-y-4 min-w-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono border-b border-slate-200 dark:border-slate-900 pb-3">
              <div>
                <span className="text-slate-500 block text-[10px]">Stain Method:</span>
                <span className="text-amber-600 dark:text-amber-300 font-bold">Ziehl-Neelsen (ZN) & LED-FM</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Specimen Quality:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Adequate (Purulent Sputum)</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Grading Scale:</span>
                <span className="text-slate-700 dark:text-slate-200 font-bold">RNTCP/NTEP Standard</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Microscopist:</span>
                <span className="text-slate-600 dark:text-slate-300">Sr. Tech L. Sharma</span>
              </div>
            </div>

            {/* Main Microscopy Result */}
            <div className="p-4 bg-amber-50 dark:bg-slate-900 rounded-2xl border border-amber-300 dark:border-amber-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="tq-eyebrow">AFB Microscopy Result</span>
                <h3 className="tq-display text-2xl text-slate-900 dark:text-white mt-0.5">{reports.smear?.result} ({reports.smear?.grade})</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{reports.smear?.notes}</p>
              </div>
              <div className="tq-chip tq-chip-amber shrink-0">
                {reports.smear?.result}
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/60 rounded-2xl text-xs space-y-1">
              <h5 className="tq-eyebrow">Clinical Guidance</h5>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Microscopy assesses infectivity and bacillary burden. Under NTEP guidelines, ALL presumptive TB cases (smear positive or negative) MUST undergo CBNAAT molecular testing to establish MTB complex presence and check Rifampicin resistance upfront.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleFinishInvestigation}
              className="tq-btn-coral touch-target px-8 py-3.5 font-black text-xs flex items-center gap-2 max-w-full"
            >
              <span>Confirm Microscopy Report & Proceed to CBNAAT</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 3. GENEXPERT CBNAAT MOLECULAR ASSAY */}
      {activeTestType === 'cbnaat' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-700/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-purple-950 border border-violet-200 dark:border-purple-500/40 flex items-center justify-center text-violet-600 dark:text-purple-400 font-bold shrink-0">
                <Activity size={26} />
              </div>
              <div>
                <span className="tq-eyebrow">National Reference Molecular Laboratory</span>
                <h2 className="tq-display text-xl sm:text-2xl text-slate-900 dark:text-white">CBNAAT / GeneXpert Molecular Assay Report</h2>
              </div>
            </div>
            <span className="tq-chip tq-chip-royal">
              RUN ID: #GX-9021
            </span>
          </div>

          <div className="tq-card p-5 space-y-4 min-w-0">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono border-b border-slate-200 dark:border-slate-900 pb-3">
              <div>
                <span className="text-slate-500 block text-[10px]">Assay Cartridge:</span>
                <span className="text-violet-600 dark:text-purple-300 font-bold">Xpert MTB/RIF Ultra</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Target Genes:</span>
                <span className="text-slate-700 dark:text-slate-200 font-bold">IS6110 / IS1081 & rpoB</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Detection Limit:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">16 CFU / mL</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Probe Ct Values:</span>
                <span className="text-slate-600 dark:text-slate-300 font-mono">{reports.cbnaat?.ctValue || 'Ct: 18.2'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* MTB Status */}
              <div className="p-4 bg-violet-50 dark:bg-slate-900 rounded-2xl border border-violet-300 dark:border-purple-500/40 space-y-2 min-w-0">
                <span className="tq-eyebrow">M. Tuberculosis Complex Status</span>
                <h3 className="tq-display text-xl text-slate-900 dark:text-white">{reports.cbnaat?.mtbStatus}</h3>
                <span className="tq-chip tq-chip-teal border border-emerald-400 dark:border-emerald-500/40">
                  MOLECULAR TEST POSITIVE
                </span>
              </div>

              {/* Rif Resistance Status */}
              <div className="p-4 bg-teal-50 dark:bg-slate-900 rounded-2xl border border-teal-300 dark:border-cyan-500/40 space-y-2 min-w-0">
                <span className="tq-eyebrow">Rifampicin Resistance Status</span>
                <h3 className="tq-display text-xl text-slate-900 dark:text-white">{reports.cbnaat?.rifResistance}</h3>
                <span className={`tq-chip border ${
                  reports.cbnaat?.rifResistance === 'Rif Resistant' 
                    ? 'bg-rose-100 dark:bg-rose-950 border-rose-400 dark:border-rose-500/40 text-rose-700 dark:text-rose-300'
                    : 'bg-teal-100 dark:bg-cyan-950 border-teal-300 dark:border-cyan-500/40 text-teal-800 dark:text-cyan-300'
                }`}>
                  {reports.cbnaat?.rifResistance === 'Rif Resistant' ? 'SWITCH TO PMDT DR-TB PATHWAY' : '1ST LINE DS-TB REGIMEN INDICATED'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-violet-50 dark:bg-purple-950/60 border border-violet-300 dark:border-purple-500/30 rounded-xl text-xs text-violet-900 dark:text-purple-100 space-y-1">
              <h5 className="tq-eyebrow">NTEP Mandatory Protocol</h5>
              <p className="leading-relaxed text-[11px]">
                Register case on Nikshay portal. If Rifampicin resistance is detected, refer immediately to PMDT Nodal Centre for All-Oral Bedaquiline-containing DR-TB regimen and Line Probe Assay (LPA) testing.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleFinishInvestigation}
              className="tq-btn-primary touch-target px-8 py-3.5 font-extrabold text-xs flex items-center gap-2 max-w-full"
            >
              <span>Confirm CBNAAT Result & Advance Workflow</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 4. LIQUID CULTURE (MGIT) & LPA LAB */}
      {activeTestType === 'culture' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-700/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                <Microscope size={26} />
              </div>
              <div>
                <span className="tq-eyebrow">Advanced Mycobacteriology Reference Lab</span>
                <h2 className="tq-display text-xl sm:text-2xl text-slate-900 dark:text-white">Liquid Culture (MGIT 960) & Line Probe Assay (LPA)</h2>
              </div>
            </div>
            <span className="tq-chip tq-chip-teal">
              CULTURE ID: #MGIT-8812
            </span>
          </div>

          <div className="tq-card p-5 space-y-4 text-xs min-w-0">
            <div className="p-4 bg-emerald-50 dark:bg-slate-900 rounded-2xl border border-emerald-300 dark:border-emerald-500/40 space-y-2 min-w-0">
              <span className="tq-eyebrow">MGIT 960 Liquid Culture Status</span>
              <h3 className="tq-display text-xl text-slate-900 dark:text-white">{reports.culture?.result || 'POSITIVE for M. tuberculosis complex (Isolated at 10 days)'}</h3>
              <p className="text-slate-600 dark:text-slate-300">{reports.culture?.species}</p>
            </div>

            <div className="p-4 bg-teal-50 dark:bg-slate-900 rounded-2xl border border-teal-300 dark:border-cyan-500/40 space-y-2 min-w-0">
              <span className="tq-eyebrow">Line Probe Assay (LPA) Genotypic DST</span>
              <p className="text-slate-700 dark:text-slate-200"><strong>Rifampicin Resistance:</strong> {reports.lpa?.rifResistance || 'Sensitive'}</p>
              <p className="text-slate-700 dark:text-slate-200"><strong>Isoniazid Resistance:</strong> {reports.lpa?.inhResistance || 'Sensitive'}</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleFinishInvestigation}
              className="tq-btn-primary touch-target px-8 py-3.5 font-black text-xs flex items-center gap-2 max-w-full"
            >
              <span>Confirm Culture Result & Return to Workflow</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* 5. BLOOD TESTS & HIV PANEL */}
      {activeTestType === 'blood' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-700/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-500/40 flex items-center justify-center text-rose-600 dark:text-rose-400 font-bold shrink-0">
                <HeartPulse size={26} />
              </div>
              <div>
                <span className="tq-eyebrow">Central Pathology Laboratory</span>
                <h2 className="tq-display text-xl sm:text-2xl text-slate-900 dark:text-white">Hematology & HIV Screening Panel</h2>
              </div>
            </div>
          </div>

          <div className="tq-card p-5 space-y-4 text-xs min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60 min-w-0">
                <span className="text-slate-500 text-[10px] block">Complete Blood Count (CBC):</span>
                <span className="text-slate-700 dark:text-slate-200 font-bold">{reports.bloodTests?.cbc || 'Hb: 11.4 g/dL, WBC: 11,200'}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60 min-w-0">
                <span className="text-slate-500 text-[10px] block">HbA1c Blood Sugar:</span>
                <span className="text-brand-teal dark:text-cyan-300 font-bold">{reports.bloodTests?.hba1c || '5.4% (Non-Diabetic)'}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60 min-w-0">
                <span className="text-slate-500 text-[10px] block">HIV Rapid Test 1 & 2:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{reports.bloodTests?.hiv || 'Non-Reactive'}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={handleFinishInvestigation}
              className="tq-btn-coral touch-target px-8 py-3.5 font-extrabold text-xs flex items-center gap-2 max-w-full"
            >
              <span>Confirm Blood Panel & Return to Workflow</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
