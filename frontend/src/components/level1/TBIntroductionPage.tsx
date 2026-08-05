import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Activity,
  AlertTriangle,
  Stethoscope,
  HeartPulse,
  Microscope
} from 'lucide-react';
import { level1Service } from '../../services/level1Service';

interface TBIntroductionPageProps {
  onCompleteRead: () => void;
}

export default function TBIntroductionPage({ onCompleteRead }: TBIntroductionPageProps) {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isReadComplete, setIsReadComplete] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const el = containerRef.current || document.documentElement;
      const scrollTop = el.scrollTop || window.scrollY;
      const scrollHeight = el.scrollHeight || document.documentElement.scrollHeight;
      const clientHeight = el.clientHeight || window.innerHeight;

      const totalScrollable = scrollHeight - clientHeight;
      if (totalScrollable <= 0) {
        setScrollProgress(100);
        setIsReadComplete(true);
        return;
      }

      const progress = Math.min(100, Math.max(0, Math.round((scrollTop / totalScrollable) * 100)));
      setScrollProgress(progress);

      if (progress >= 95) {
        setIsReadComplete(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleFinishReading = () => {
    level1Service.setIntroCompleted();
    onCompleteRead();
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6 sm:space-y-8 text-white min-h-screen">
      {/* Top Reading Progress Bar Header */}
      <div className="sticky top-16 sm:top-20 z-30 bg-slate-950/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-cyan-500/40 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-cyan-950 text-cyan-400 rounded-xl border border-cyan-500/30 shrink-0">
            <BookOpen size={20} />
          </div>
          <div className="min-w-0">
            <h2 className="text-xs sm:text-sm font-bold text-white truncate">TB Introduction & Core Curriculum</h2>
            <p className="text-[11px] text-slate-400">Read 100% to unlock Level 1 Assessment</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-cyan-400">{scrollProgress}%</span>
            <span className="block text-[10px] text-slate-400">Progress</span>
          </div>
          <div className="w-16 sm:w-28 bg-slate-800 h-2 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-gradient-to-r from-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Hero Title */}
      <header className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/30 p-6 sm:p-8 rounded-3xl space-y-3 relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-cyan-400">
          <Microscope size={180} />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950 text-cyan-400 border border-cyan-500/30 rounded-full text-xs font-mono">
          <Sparkles size={14} /> Comprehensive Medical Module
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
          Understanding Tuberculosis (TB)
        </h1>
        <p className="text-slate-300 text-xs sm:text-base max-w-3xl leading-relaxed">
          Master the foundational epidemiology, etiology, transmission dynamics, clinical manifestations, and infection control standards mandated by WHO and NTEP guidelines before entering Level 1 Clinical Assessment.
        </p>
      </header>

      {/* Main Content Sections */}
      <div className="space-y-6 sm:space-y-8" ref={containerRef}>
        {/* Section 1: Learning Objectives */}
        <section className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-base sm:text-lg">
            <Sparkles size={20} />
            <h2>Core Learning Objectives</h2>
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300 text-xs sm:text-sm">
            <li className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
              <span>Define Mycobacterium tuberculosis microbiological characteristics & acid-fast staining.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
              <span>Identify airborne droplet nuclei transmission mechanics and high-risk environmental exposure.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
              <span>Stratify symptoms between Pulmonary, Extrapulmonary, and Pediatric clinical presentations.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
              <span>Apply WHO/NTEP diagnostic algorithms including CBNAAT, ZN Microscopy, and CXR.</span>
            </li>
          </ul>
        </section>

        {/* Section 2: What is TB & Causes */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg">
            <Activity size={20} className="text-cyan-400" />
            <h2>1. What is Tuberculosis (TB) & Causative Agent</h2>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            <strong>Tuberculosis (TB)</strong> is a chronic, communicable granulomatous disease caused by <em>Mycobacterium tuberculosis</em> complex. Although TB predominantly affects the lungs (Pulmonary TB), it can disseminate to any organ system including lymph nodes, pleura, brain, spine, and abdomen (Extrapulmonary TB).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Microbiological Features</h3>
              <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-4">
                <li>Obligate aerobic, non-spore-forming, non-motile bacillus.</li>
                <li>High cell wall lipid content (60% <strong>Mycolic Acids</strong>).</li>
                <li>Resists Gram staining; requires <strong>Acid-Fast Staining</strong> (Ziehl-Neelsen or Auramine).</li>
                <li>Slow doubling time (15 to 20 hours).</li>
              </ul>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Global & National Impact</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                TB remains one of the top single-agent infectious killers worldwide. Over 10 million people fall ill with active TB annually. Early diagnosis via CBNAAT molecular testing is vital to achieving elimination goals under NTEP.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: How TB Spreads */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg">
            <AlertTriangle size={20} className="text-amber-400" />
            <h2>2. Airborne Transmission Dynamics</h2>
          </div>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            TB spreads almost exclusively through <strong>Airborne Droplet Nuclei</strong> (1 to 5 microns in size). When a person with active pulmonary or laryngeal TB coughs, sneezes, sings, or speaks, infectious droplets evaporate into tiny particles that remain suspended in ambient air for hours.
          </p>
          <div className="bg-slate-950/80 p-4 rounded-xl border border-amber-500/30 text-xs text-slate-300 space-y-2">
            <h3 className="font-bold text-amber-300">Key Exposure Factors Governing Infection Risk:</h3>
            <ul className="space-y-1 pl-4 list-disc text-slate-400">
              <li>Infectiousness of index patient (e.g. Sputum AFB 3+ positive vs negative).</li>
              <li>Proximity and cumulative duration of exposure in enclosed space.</li>
              <li>Environmental ventilation (Poorly ventilated room increases concentration of droplet nuclei).</li>
              <li>Host immune status (e.g. HIV, Diabetes, Low BMI).</li>
            </ul>
          </div>
        </section>

        {/* Section 4: Common Symptoms */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg">
            <Stethoscope size={20} className="text-emerald-400" />
            <h2>3. Clinical Symptoms & Presentation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-cyan-500/30 space-y-2">
              <h3 className="text-xs font-bold text-cyan-400 uppercase">Pulmonary TB</h3>
              <ul className="space-y-1 text-xs text-slate-300 list-disc pl-4">
                <li>Cough lasting ≥ 2 weeks (often productive)</li>
                <li>Hemoptysis (coughing up blood)</li>
                <li>Low-grade fever with evening spikes</li>
                <li>Profuse night sweats</li>
                <li>Unexplained weight loss & anorexia</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-purple-500/30 space-y-2">
              <h3 className="text-xs font-bold text-purple-400 uppercase">Extrapulmonary TB</h3>
              <ul className="space-y-1 text-xs text-slate-300 list-disc pl-4">
                <li>Lymph node swelling (Scrofula)</li>
                <li>TB Meningitis (Headache, stiff neck)</li>
                <li>Pott's Disease (Spinal deformity/back pain)</li>
                <li>Pleural Effusion (Exudative chest fluid)</li>
                <li>Abdominal TB (Ascites, matted bowel)</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
              <h3 className="text-xs font-bold text-emerald-400 uppercase">Pediatric TB</h3>
              <ul className="space-y-1 text-xs text-slate-300 list-disc pl-4">
                <li>Unexplained persistent fever &gt; 2 weeks</li>
                <li>Failure to thrive / weight loss</li>
                <li>Chronic non-remitting cough &gt; 2 weeks</li>
                <li>Lethargy and reduced playfulness</li>
                <li>History of adult household contact</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 5: Types of TB & Drug Resistance */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg">
            <HeartPulse size={20} className="text-rose-400" />
            <h2>4. Types of TB & Drug Resistance Categories</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <h3 className="font-bold text-emerald-400">Drug-Sensitive TB (DS-TB)</h3>
              <p className="text-slate-300">Responds to standard 6-month regimen (2HRZE / 4HRE daily Fixed Dose Combinations).</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <h3 className="font-bold text-amber-400">Latent TB Infection (LTBI)</h3>
              <p className="text-slate-300">Live bacilli present in body controlled by immune system. Asymptomatic, non-infectious, positive TST/IGRA.</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <h3 className="font-bold text-rose-400">Multidrug-Resistant TB (MDR-TB)</h3>
              <p className="text-slate-300">Strains resistant to both core 1st-line drugs: Isoniazid (INH) and Rifampicin (RIF). Requires PMDT all-oral regimens.</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
              <h3 className="font-bold text-purple-400">Extensive Drug-Resistant TB (XDR-TB)</h3>
              <p className="text-slate-300">MDR-TB resistant to fluoroquinolones and at least one Group A drug (Bedaquiline or Linezolid).</p>
            </div>
          </div>
        </section>

        {/* Section 6: Prevention & Early Diagnosis */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base sm:text-lg">
            <ShieldCheck size={20} className="text-cyan-400" />
            <h2>5. Prevention & Importance of Early Diagnosis</h2>
          </div>
          <div className="space-y-3 text-xs text-slate-300">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <strong className="text-cyan-300 block mb-1">BCG Vaccination:</strong>
              Administered intradermally at birth; confers vital protection against severe pediatric miliary and CNS TB.
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <strong className="text-cyan-300 block mb-1">Tuberculosis Preventive Treatment (TPT):</strong>
              3HP (weekly Rifapentine + INH for 3 months) or 6H given to child contacts under 5 and PLHIV after ruling out active TB.
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <strong className="text-cyan-300 block mb-1">Airborne Infection Control:</strong>
              Use of negative-pressure isolation rooms (minimum 12 ACH), natural ventilation, and N95 respirators for healthcare personnel.
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Read Completion Card */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/50 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div>
          <h3 className="font-bold text-white text-base sm:text-lg">Ready for Level 1 Instructions?</h3>
          <p className="text-xs text-slate-300">
            {isReadComplete
              ? 'You have completed 100% of the reading requirement. Click below to view Level 1 instructions.'
              : 'Scroll to read all sections (100%) to unlock the Read Complete button.'}
          </p>
        </div>

        <button
          onClick={handleFinishReading}
          disabled={!isReadComplete}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all outline-none shrink-0 ${
            isReadComplete
              ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.4)] cursor-pointer'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
          }`}
        >
          <span>Read Complete & Unlock Level 1</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
