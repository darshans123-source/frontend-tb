import React, { useState } from 'react';
import { 
  Stethoscope, CheckCircle2, Award, ChevronRight, ShieldAlert, 
  FileText, Clock, AlertTriangle, Pill, HeartPulse
} from 'lucide-react';
import { EMRPatient, EMRTreatmentRegimen } from '../types';
import { STANDARD_TREATMENT_REGIMENS } from '../data/emrPatientData';
import { soundService } from '../services/soundService';

interface EMRTreatmentManagerProps {
  patient: EMRPatient;
  onAssignTreatment: (regimen: EMRTreatmentRegimen) => void;
}

export default function EMRTreatmentManager({
  patient,
  onAssignTreatment
}: EMRTreatmentManagerProps) {
  const defaultRegimenKey = patient.id === 'pat_002' ? 'dr_tb' : 'ds_tb';
  const [selectedRegimenKey, setSelectedRegimenKey] = useState<'ds_tb' | 'dr_tb'>(defaultRegimenKey);
  const activeRegimen = STANDARD_TREATMENT_REGIMENS[selectedRegimenKey];
  const [doctorNotes, setDoctorNotes] = useState(activeRegimen.doctorNotes);

  const handleConfirmRegimen = () => {
    soundService.playCorrect();
    onAssignTreatment({
      ...activeRegimen,
      doctorNotes
    });
  };

  return (
    <div className="tq-card tq-fade-up max-w-full overflow-hidden p-5 sm:p-7 shadow-2xl space-y-6 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-700/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-purple-950 border border-violet-200 dark:border-purple-500/40 flex items-center justify-center text-violet-600 dark:text-purple-400 font-bold shrink-0">
            <Pill size={26} />
          </div>
          <div>
            <span className="tq-eyebrow">NTEP Clinical Treatment Protocols</span>
            <h2 className="tq-display text-xl sm:text-2xl text-slate-900 dark:text-white">Treatment Assignment & Prescription Generator</h2>
          </div>
        </div>
        <span className="tq-chip tq-chip-royal">
          PATIENT: {patient.name} ({patient.patientCode})
        </span>
      </div>

      {/* Regimen Selector Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => {
            setSelectedRegimenKey('ds_tb');
            setDoctorNotes(STANDARD_TREATMENT_REGIMENS.ds_tb.doctorNotes);
            soundService.playClick();
          }}
          className={`touch-target tq-lift p-4 rounded-2xl border text-left transition-all space-y-1 min-w-0 ${
            selectedRegimenKey === 'ds_tb'
              ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-500 text-emerald-800 dark:text-emerald-200 ring-2 ring-emerald-500/40 shadow-lg'
              : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-teal-300 dark:hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-mono font-bold uppercase block text-emerald-600 dark:text-emerald-400">Standard 1st Line ATT</span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">Drug-Sensitive TB Regimen (2HRZE / 4HRE)</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">Daily weight-banded FDCs for 6 months.</p>
        </button>

        <button
          onClick={() => {
            setSelectedRegimenKey('dr_tb');
            setDoctorNotes(STANDARD_TREATMENT_REGIMENS.dr_tb.doctorNotes);
            soundService.playClick();
          }}
          className={`touch-target tq-lift p-4 rounded-2xl border text-left transition-all space-y-1 min-w-0 ${
            selectedRegimenKey === 'dr_tb'
              ? 'bg-rose-50 dark:bg-rose-950/90 border-rose-400 dark:border-rose-500 text-rose-800 dark:text-rose-200 ring-2 ring-rose-500/40 shadow-lg'
              : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-teal-300 dark:hover:border-slate-700'
          }`}
        >
          <span className="text-[10px] font-mono font-bold uppercase block text-rose-600 dark:text-rose-400">PMDT DR-TB Protocol</span>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">All-Oral Shorter Bedaquiline Regimen</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">BDQ + Lfx + Cfz + Z + E + Hh + Eto for 9-11 months.</p>
        </button>
      </div>

      {/* Regimen Details Table */}
      <div className="tq-card p-5 space-y-4 text-xs min-w-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 dark:border-slate-900 pb-3">
          <div>
            <span className="tq-eyebrow">{activeRegimen.category}</span>
            <h3 className="tq-display text-lg text-slate-900 dark:text-white">{activeRegimen.name}</h3>
          </div>
          <span className="tq-chip tq-chip-slate">
            Duration: {activeRegimen.duration}
          </span>
        </div>

        {/* Drug Breakdown Table */}
        <div className="space-y-2">
          <h5 className="tq-eyebrow">Weight-Banded Drug Breakdown</h5>
          <div className="space-y-1.5 font-mono">
            {activeRegimen.drugs.map((drug, idx) => (
              <div key={idx} className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2 min-w-0">
                <div>
                  <span className="text-slate-900 dark:text-white font-bold text-xs">{drug.name}</span>
                  <span className="text-slate-500 text-[10px] block">{drug.frequency}</span>
                </div>
                <span className="tq-chip tq-chip-teal">
                  {drug.dosage}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Follow-up Schedule */}
        <div className="p-3 bg-amber-50 dark:bg-slate-900 border border-amber-200 dark:border-slate-800 rounded-xl space-y-1">
          <h5 className="tq-eyebrow">Follow-Up & Adherence Monitoring</h5>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">{activeRegimen.followUpSchedule}</p>
        </div>

        {/* Doctor Clinical Notes */}
        <div>
          <label className="tq-eyebrow block mb-1">Prescribing Doctor Notes</label>
          <textarea
            rows={3}
            value={doctorNotes}
            onChange={e => setDoctorNotes(e.target.value)}
            className="tq-input w-full p-3 min-h-11 text-slate-900 dark:text-white outline-none text-xs font-sans resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={handleConfirmRegimen}
          className="tq-btn-primary touch-target px-8 py-3.5 font-extrabold text-xs flex items-center gap-2 max-w-full"
        >
          <span>Assign Treatment Regimen & Advance Workflow</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
