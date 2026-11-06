import React from 'react';
import { 
  FileText, Printer, Download, CheckCircle2, Award, 
  Stethoscope, Clock, ShieldAlert, HeartPulse, User, ChevronRight, Activity
} from 'lucide-react';
import { EMRPatient, EMRInvestigationReports, EMRTreatmentRegimen } from '../types';
import { PRESET_INVESTIGATION_REPORTS, STANDARD_TREATMENT_REGIMENS } from '../data/emrPatientData';
import { soundService } from '../services/soundService';

interface EMRFinalReportViewProps {
  patient: EMRPatient;
  assignedRegimen?: EMRTreatmentRegimen | null;
  onFinishCase: () => void;
}

export default function EMRFinalReportView({
  patient,
  assignedRegimen,
  onFinishCase
}: EMRFinalReportViewProps) {
  const reports = PRESET_INVESTIGATION_REPORTS[patient.id] || PRESET_INVESTIGATION_REPORTS['pat_001'];
  const regimen = assignedRegimen || (patient.id === 'pat_002' ? STANDARD_TREATMENT_REGIMENS.dr_tb : STANDARD_TREATMENT_REGIMENS.ds_tb);

  const handlePrintReport = () => {
    soundService.playClick();
    window.print();
  };

  return (
    <div className="tq-card tq-fade-up w-full max-w-4xl mx-auto p-6 sm:p-8 shadow-2xl space-y-6 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      {/* Report Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-700/60 pb-5">
        <div>
          <span className="tq-eyebrow">Skill Development Center, NIT Raichur • EMR Discharge Summary</span>
          <h2 className="tq-display text-2xl text-slate-900 dark:text-white">Official Pulmonary TB Clinical Case Report</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Nikshay Registry Notification Standard • Case #{patient.patientCode}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrintReport}
            className="tq-btn-secondary touch-target px-4 py-2 text-xs font-bold flex items-center gap-1.5 dark:bg-[#111c30] dark:text-slate-200 dark:border-slate-700"
          >
            <Printer size={15} />
            <span>Print EMR Report</span>
          </button>
        </div>
      </div>

      {/* Printable EMR Document Content */}
      <div className="space-y-6 print:text-black print:bg-white print:p-4">
        {/* Patient Information Grid */}
        <div className="p-4 bg-slate-50 dark:bg-[#111c30] border border-slate-200 dark:border-slate-700/60 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono min-w-0">
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">Patient Name:</span>
            <span className="text-slate-900 dark:text-white font-bold text-sm">{patient.name}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">Age / Gender:</span>
            <span className="text-slate-700 dark:text-slate-200 font-bold">{patient.age} Yrs ({patient.gender})</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">Patient ID:</span>
            <span className="text-violet-600 dark:text-purple-300 font-bold">{patient.patientCode}</span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block uppercase font-bold">Date of Report:</span>
            <span className="text-slate-600 dark:text-slate-300">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
          </div>
        </div>

        {/* Diagnostic Conclusion Banner */}
        <div className="p-5 bg-emerald-50 dark:bg-[#111c30] border border-emerald-400/60 dark:border-emerald-500/50 rounded-2xl space-y-1">
          <span className="tq-eyebrow">Final Diagnostic Confirmation</span>
          <h3 className="tq-display text-xl text-slate-900 dark:text-white">
            {patient.id === 'pat_002'
              ? 'Microbiologically Confirmed Rifampicin-Resistant Pulmonary TB (RR-TB / MDR-TB)'
              : 'Microbiologically Confirmed Drug-Sensitive Pulmonary TB (DS-TB)'}
          </h3>
        </div>

        {/* Clinical Reasoning & Complaint */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="tq-card p-4 sm:p-5 space-y-2 min-w-0">
            <h4 className="tq-eyebrow">Chief Complaint & Vitals</h4>
            <p className="text-slate-600 dark:text-slate-300">"{patient.complaint}" ({patient.duration})</p>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono pt-1">
              <span className="text-slate-400">Temp: <strong className="text-amber-600 dark:text-amber-300">{patient.vitals.temp}</strong></span>
              <span className="text-slate-400">SpO2: <strong className="text-brand-teal dark:text-cyan-300">{patient.vitals.spO2}</strong></span>
              <span className="text-slate-400">BMI: <strong className="text-emerald-600 dark:text-emerald-300">{patient.vitals.bmi}</strong></span>
              <span className="text-slate-400">BP: <strong className="text-slate-700 dark:text-slate-200">{patient.vitals.bp}</strong></span>
            </div>
          </div>

          <div className="tq-card p-4 sm:p-5 space-y-2 min-w-0">
            <h4 className="tq-eyebrow">Diagnostic Reasoning Summary</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Patient presented with chronic symptoms. Radiological findings (CXR apical infiltrates/cavitation) combined with Ziehl-Neelsen sputum AFB microscopy and GeneXpert CBNAAT molecular assay established bacteriological confirmation and drug susceptibility status.
            </p>
          </div>
        </div>

        {/* Executed Investigations Summary */}
        <div className="tq-card p-4 sm:p-5 space-y-3 text-xs min-w-0">
          <h4 className="tq-eyebrow">Laboratory & Imaging Log</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
            <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60 min-w-0">
              <span className="text-slate-500 block text-[10px]">CXR RADIOLOGY:</span>
              <span className="text-slate-700 dark:text-slate-200 font-bold">{reports.cxr?.impression || 'Suggestive of TB'}</span>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60 min-w-0">
              <span className="text-slate-500 block text-[10px]">SMEAR MICROSCOPY:</span>
              <span className="text-amber-600 dark:text-amber-300 font-bold">{reports.smear?.result || 'AFB Positive'}</span>
            </div>
            <div className="p-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60 min-w-0">
              <span className="text-slate-500 block text-[10px]">CBNAAT MOLECULAR:</span>
              <span className="text-violet-600 dark:text-purple-300 font-bold">{reports.cbnaat?.mtbStatus} ({reports.cbnaat?.rifResistance})</span>
            </div>
          </div>
        </div>

        {/* Treatment Prescription */}
        <div className="tq-card p-4 sm:p-5 space-y-3 text-xs min-w-0">
          <div className="flex justify-between items-center">
            <h4 className="tq-eyebrow">Assigned NTEP Treatment Prescription</h4>
            <span className="text-slate-500 dark:text-slate-400 font-mono text-[10px]">Duration: {regimen.duration}</span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            {regimen.drugs.map((d, i) => (
              <div key={i} className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700/60 flex justify-between gap-2 min-w-0">
                <span>{d.name} ({d.frequency})</span>
                <span className="text-brand-teal dark:text-cyan-300 font-bold">{d.dosage}</span>
              </div>
            ))}
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] pt-1">
            <strong>Notes:</strong> {regimen.doctorNotes}
          </p>
        </div>
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={onFinishCase}
          className="tq-btn-primary touch-target px-8 py-3.5 font-black text-xs max-w-full"
        >
          Complete Clinical Case & Return to Registry
        </button>
      </div>
    </div>
  );
}
