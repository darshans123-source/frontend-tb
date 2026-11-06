import React, { useState } from 'react';
import { 
  Search, Plus, Filter, UserCheck, Stethoscope, FileText, Phone, MapPin, 
  Activity, ShieldAlert, CheckCircle2, ChevronRight, X, User, HeartPulse, Clock, Sparkles
} from 'lucide-react';
import { EMRPatient, EMRPatientStatus } from '../types';
import { soundService } from '../services/soundService';

interface PatientManagementModuleProps {
  patients: EMRPatient[];
  onSelectPatient: (patient: EMRPatient) => void;
  onAddNewPatient: (patient: EMRPatient) => void;
}

export default function PatientManagementModule({
  patients,
  onSelectPatient,
  onAddNewPatient
}: PatientManagementModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDossier, setSelectedDossier] = useState<EMRPatient | null>(null);

  // New Patient Form State
  const [newPatientForm, setNewPatientForm] = useState({
    name: '',
    age: '30',
    gender: 'Male',
    phone: '',
    address: 'Raichur, Karnataka',
    occupation: 'Daily Wage Worker',
    weight: '55 kg',
    height: '165 cm',
    complaint: 'Cough with sputum and low-grade fever',
    duration: '2 weeks',
    history: 'No past ATT history',
    symptoms: 'Cough > 2 weeks, Evening fever, Weight loss',
    riskFactors: 'Overcrowding, Malnutrition'
  });

  const handleCreatePatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientForm.name) return;

    soundService.playCorrect();
    const newId = `pat_${Date.now()}`;
    const newCode = `P-2024-${Math.floor(100 + Math.random() * 900)}`;

    const createdPatient: EMRPatient = {
      id: newId,
      patientCode: newCode,
      name: newPatientForm.name,
      age: parseInt(newPatientForm.age) || 30,
      gender: newPatientForm.gender,
      dob: '1994-05-10',
      phone: newPatientForm.phone || '+91 98000 00000',
      address: newPatientForm.address,
      occupation: newPatientForm.occupation,
      weight: newPatientForm.weight,
      height: newPatientForm.height,
      bmi: '20.2 kg/m²',
      bloodGroup: 'O Positive',
      complaint: newPatientForm.complaint,
      duration: newPatientForm.duration,
      symptoms: newPatientForm.symptoms.split(',').map(s => s.trim()),
      medicalHistory: newPatientForm.history,
      familyHistory: 'None',
      smoking: 'Non-smoker',
      alcohol: 'None',
      diabetes: 'Non-Diabetic',
      hivStatus: 'Non-Reactive',
      pregnancyStatus: 'N/A',
      drugHistory: 'None',
      previousTb: 'None',
      riskFactors: newPatientForm.riskFactors.split(',').map(r => r.trim()),
      vaccinationHistory: 'BCG scar present',
      emergencyContact: 'Family Member',
      status: 'Waiting',
      vitals: {
        temp: '38.0 °C',
        pulse: '84 bpm',
        rr: '18 /min',
        bp: '120/80 mmHg',
        spO2: '97% on room air',
        weight: newPatientForm.weight,
        bmi: '20.2 kg/m²',
        generalExam: 'Conscious, oriented, mild pallor.',
        respExam: 'Reduced breath sounds in right upper zone.',
        notes: 'Presumptive Pulmonary TB suspect.'
      },
      createdDate: new Date().toISOString().split('T')[0]
    };

    onAddNewPatient(createdPatient);
    setShowAddModal(false);
    onSelectPatient(createdPatient);
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.patientCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.complaint.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || p.status.toUpperCase() === statusFilter.toUpperCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: EMRPatientStatus) => {
    switch (status) {
      case 'Waiting':
        return 'bg-amber-100 dark:bg-amber-950 border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-300';
      case 'In Progress':
        return 'bg-teal-100 dark:bg-teal-950 border-teal-300 dark:border-teal-500/40 text-teal-700 dark:text-teal-300 animate-pulse';
      case 'Under Investigation':
        return 'bg-purple-100 dark:bg-purple-950 border-purple-300 dark:border-purple-500/40 text-purple-700 dark:text-purple-300';
      case 'Diagnosis Confirmed':
        return 'bg-emerald-100 dark:bg-emerald-950 border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300';
      case 'Treatment Started':
        return 'bg-blue-100 dark:bg-blue-950 border-blue-300 dark:border-blue-500/40 text-blue-700 dark:text-blue-300';
      default:
        return 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300';
    }
  };

  return (
    <div className="tq-fade-up max-w-full space-y-6 overflow-hidden font-sans">
      {/* Module Bar & Quick Controls */}
      <div className="tq-card flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 sm:p-5 rounded-2xl shadow-xl">
        <div>
          <span className="tq-eyebrow text-[10px] font-mono uppercase tracking-wider">Hospital EMR Patient Sub-System</span>
          <h2 className="text-xl sm:text-2xl font-black text-ink-900 dark:text-white flex items-center gap-2">
            <User className="text-brand-teal" size={24} />
            Patient Registry & Admissions
          </h2>
        </div>

        <button
          onClick={() => {
            soundService.playClick();
            setShowAddModal(true);
          }}
          className="tq-btn-primary touch-target px-5 py-2.5 font-black rounded-xl text-xs transition-all flex items-center gap-2 shrink-0"
        >
          <Plus size={16} />
          <span>Register New Patient</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search by Patient Name, ID (e.g. P-2024-101), or Symptoms..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="tq-input w-full min-h-11 pl-10 pr-4 py-2.5 rounded-xl text-xs text-ink-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-3.5 top-3 text-slate-500" size={15} />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="tq-input w-full min-h-11 pl-9 pr-4 py-2.5 rounded-xl text-xs text-ink-900 dark:text-slate-200 appearance-none cursor-pointer"
          >
            <option value="ALL">All Clinical Statuses</option>
            <option value="WAITING">Waiting</option>
            <option value="IN PROGRESS">In Progress</option>
            <option value="UNDER INVESTIGATION">Under Investigation</option>
            <option value="DIAGNOSIS CONFIRMED">Diagnosis Confirmed</option>
            <option value="TREATMENT STARTED">Treatment Started</option>
          </select>
        </div>
      </div>

      {/* Patient Registry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map(patient => (
          <div
            key={patient.id}
            className="tq-card tq-lift max-w-full overflow-hidden rounded-2xl p-5 space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-purple-600 dark:text-purple-300 font-bold uppercase block">{patient.patientCode}</span>
                  <h3 className="text-lg font-black text-ink-900 dark:text-white">{patient.name}</h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{patient.age} Yrs • {patient.gender} • {patient.occupation}</span>
                </div>
                <span className={`px-2.5 py-1 border rounded-full text-[10px] font-mono font-bold ${getStatusBadge(patient.status)}`}>
                  {patient.status}
                </span>
              </div>

              {/* Chief Complaint */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl space-y-1">
                <span className="text-[10px] font-mono text-teal-600 dark:text-teal-300 font-bold uppercase block">Chief Complaint ({patient.duration})</span>
                <p className="text-xs text-slate-700 dark:text-slate-200 line-clamp-2">"{patient.complaint}"</p>
              </div>

              {/* Vitals Summary Badges */}
              <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[10px]">
                <div className="p-1.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block">TEMP</span>
                  <span className="text-amber-600 dark:text-amber-300 font-bold">{patient.vitals.temp}</span>
                </div>
                <div className="p-1.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block">SpO2</span>
                  <span className="text-teal-600 dark:text-teal-300 font-bold">{patient.vitals.spO2}</span>
                </div>
                <div className="p-1.5 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-500 block">BMI</span>
                  <span className="text-emerald-600 dark:text-emerald-300 font-bold">{patient.bmi.split(' ')[0]}</span>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="flex flex-wrap gap-1">
                {patient.riskFactors.map((rf, idx) => (
                  <span key={idx} className="tq-chip tq-chip-coral px-2 py-0.5 rounded text-[9px] font-mono">
                    {rf}
                  </span>
                ))}
              </div>
            </div>

            {/* Card Action Buttons */}
            <div className="flex gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
              <button
                onClick={() => {
                  soundService.playClick();
                  setSelectedDossier(patient);
                }}
                className="tq-btn-secondary touch-target flex-1 py-2 rounded-xl text-xs font-semibold dark:bg-[#111c30] dark:text-slate-200 dark:border-slate-700"
              >
                View Dossier
              </button>
              <button
                onClick={() => {
                  soundService.playClick();
                  onSelectPatient(patient);
                }}
                className="tq-btn-primary touch-target flex-1 py-2 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1"
              >
                <span>Start Workflow</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: REGISTER NEW PATIENT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-[#111c30] border border-teal-200 dark:border-teal-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-5 text-ink-900 dark:text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="tq-eyebrow text-[10px] font-mono uppercase">Hospital EMR Registration</span>
                <h3 className="text-xl font-black text-ink-900 dark:text-white">Register New Presumptive TB Patient</h3>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="touch-target p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePatientSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newPatientForm.name}
                    onChange={e => setNewPatientForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Ramesh Patil"
                    className="tq-input w-full min-h-11 p-2.5 rounded-xl text-ink-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Age & Gender *</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newPatientForm.age}
                      onChange={e => setNewPatientForm(p => ({ ...p, age: e.target.value }))}
                      className="tq-input w-1/2 min-w-0 min-h-11 p-2.5 rounded-xl text-ink-900 dark:text-white"
                    />
                    <select
                      value={newPatientForm.gender}
                      onChange={e => setNewPatientForm(p => ({ ...p, gender: e.target.value }))}
                      className="tq-input w-1/2 min-w-0 min-h-11 p-2.5 rounded-xl text-ink-900 dark:text-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newPatientForm.phone}
                    onChange={e => setNewPatientForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 98765 00000"
                    className="tq-input w-full min-h-11 p-2.5 rounded-xl text-ink-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Occupation</label>
                  <input
                    type="text"
                    value={newPatientForm.occupation}
                    onChange={e => setNewPatientForm(p => ({ ...p, occupation: e.target.value }))}
                    placeholder="e.g. Factory Worker"
                    className="tq-input w-full min-h-11 p-2.5 rounded-xl text-ink-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Chief Complaint & Duration *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={newPatientForm.complaint}
                    onChange={e => setNewPatientForm(p => ({ ...p, complaint: e.target.value }))}
                    placeholder="e.g. Chronic productive cough with evening fever"
                    className="tq-input w-3/4 min-w-0 min-h-11 p-2.5 rounded-xl text-ink-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={newPatientForm.duration}
                    onChange={e => setNewPatientForm(p => ({ ...p, duration: e.target.value }))}
                    placeholder="3 weeks"
                    className="tq-input w-1/4 min-w-0 min-h-11 p-2.5 rounded-xl text-ink-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Symptoms (Comma Separated)</label>
                <input
                  type="text"
                  value={newPatientForm.symptoms}
                  onChange={e => setNewPatientForm(p => ({ ...p, symptoms: e.target.value }))}
                  placeholder="Cough > 2 weeks, Fever, Weight Loss, Night Sweats"
                  className="tq-input w-full min-h-11 p-2.5 rounded-xl text-ink-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Medical & Treatment History</label>
                <textarea
                  rows={2}
                  value={newPatientForm.history}
                  onChange={e => setNewPatientForm(p => ({ ...p, history: e.target.value }))}
                  placeholder="No previous ATT history; Non-diabetic; HIV Negative"
                  className="tq-input w-full p-2.5 rounded-xl text-ink-900 dark:text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="tq-btn-secondary touch-target px-4 py-2 rounded-xl text-xs font-semibold dark:bg-[#111c30] dark:text-slate-200 dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="tq-btn-primary touch-target px-6 py-2 font-bold rounded-xl text-xs shadow-lg"
                >
                  Register & Launch Workflow
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: VIEW FULL PATIENT DOSSIER */}
      {selectedDossier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-[#111c30] border border-teal-200 dark:border-teal-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-5 text-ink-900 dark:text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-purple-600 dark:text-purple-300 font-bold uppercase">{selectedDossier.patientCode}</span>
                <h3 className="text-xl font-black text-ink-900 dark:text-white">{selectedDossier.name} Dossier</h3>
              </div>
              <button 
                onClick={() => setSelectedDossier(null)}
                className="touch-target p-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">Age / Gender:</span>
                  <span className="text-ink-900 dark:text-white font-bold">{selectedDossier.age} Yrs ({selectedDossier.gender})</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Occupation:</span>
                  <span className="text-slate-600 dark:text-slate-300 font-bold">{selectedDossier.occupation}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Phone:</span>
                  <span className="text-teal-600 dark:text-teal-300 font-mono font-bold">{selectedDossier.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Emergency Contact:</span>
                  <span className="text-slate-600 dark:text-slate-300 font-mono">{selectedDossier.emergencyContact}</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-teal-600 dark:text-teal-300 uppercase tracking-wider">Clinical Examination Notes</h4>
                <p className="text-slate-600 dark:text-slate-300">{selectedDossier.vitals.respExam}</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">{selectedDossier.vitals.notes}</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setSelectedDossier(null)}
                  className="tq-btn-secondary touch-target px-4 py-2 rounded-xl text-xs font-semibold dark:bg-[#111c30] dark:text-slate-200 dark:border-slate-700"
                >
                  Close Dossier
                </button>
                <button
                  onClick={() => {
                    const p = selectedDossier;
                    setSelectedDossier(null);
                    onSelectPatient(p);
                  }}
                  className="tq-btn-primary touch-target px-6 py-2 font-bold rounded-xl text-xs shadow-lg flex items-center gap-1"
                >
                  <span>Select & Start Workflow</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
