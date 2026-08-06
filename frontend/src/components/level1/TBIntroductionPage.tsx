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
  Microscope,
  Pill,
  Users,
  Building2,
  Flag,
  HeartHandshake,
  FileText,
  ChevronDown,
  ChevronUp,
  Search,
  Crosshair,
  Award
} from 'lucide-react';
import { level1Service } from '../../services/level1Service';

interface TBIntroductionPageProps {
  onCompleteRead: () => void;
}

interface SectionItem {
  id: string;
  number: string;
  title: string;
  badge: string;
  icon: React.ElementType;
  image: string;
  shortDesc: string;
  fullDesc: string;
  keyPoints: string[];
  clinicalHighlights?: { title: string; desc: string }[];
}

const SECTIONS_DATA: SectionItem[] = [
  {
    id: 'what-is-tb',
    number: '01',
    title: 'What is Tuberculosis (TB)?',
    badge: 'Core Definition',
    icon: Activity,
    image: '/tb_lungs_hero.png',
    shortDesc: 'Tuberculosis is a communicable granulomatous infection primarily affecting the lungs, caused by Mycobacterium tuberculosis.',
    fullDesc: 'Tuberculosis (TB) is a major infectious disease caused by Mycobacterium tuberculosis. Although it predominantly affects the pulmonary parenchyma (Pulmonary TB), bacilli can disseminate hematogenously or lymphatically to involve lymph nodes, pleura, meninges, spine, abdomen, and genitourinary tract (Extrapulmonary TB). Without effective treatment, mortality rates for active TB exceed 50%.',
    keyPoints: [
      'Primary organ affected: Lungs (Pulmonary TB in ~80% of cases).',
      'Extrapulmonary TB affects lymph nodes, pleura, brain, joints, and kidneys.',
      'Transmitted via airborne droplet nuclei from patients with active pulmonary disease.',
      'Curable with standard anti-TB chemotherapy regimens.'
    ],
    clinicalHighlights: [
      { title: 'Pulmonary TB', desc: 'Infection of lung tissue characterized by cough, chest pain, and hemoptysis.' },
      { title: 'Extrapulmonary TB', desc: 'Infection outside the lungs, common in immunocompromised hosts and children.' }
    ]
  },
  {
    id: 'causes',
    number: '02',
    title: 'Causes & Microbiology',
    badge: 'Etiology',
    icon: Microscope,
    image: '/tb_infected_lungs.png',
    shortDesc: 'Mycobacterium tuberculosis is a rod-shaped, acid-fast aerobic bacillus with a cell wall rich in mycolic acids.',
    fullDesc: 'The Mycobacterium tuberculosis complex consists of M. tuberculosis, M. bovis, M. africanum, and M. microti. M. tuberculosis is an obligate aerobe, non-motile, non-spore-forming bacillus. Its cell wall contains up to 60% lipids, predominantly Mycolic Acids, conferring resistance to Gram staining, chemical disinfectants, and desiccation. Acid-fast staining (Ziehl-Neelsen or Auramine fluorescence) is required to visualize the bacilli.',
    keyPoints: [
      'High lipid cell wall content (Mycolic acids, Cord factor).',
      'Resists decolorization by acid-alcohol (Acid-Fast Bacillus / AFB).',
      'Slow replication rate with a doubling time of 15 to 20 hours.',
      'Facultative intracellular parasite surviving inside unactivated macrophages.'
    ],
    clinicalHighlights: [
      { title: 'Acid-Fast Staining', desc: 'ZN staining shows bright red/pink bacilli against a blue background.' },
      { title: 'Caseating Granuloma', desc: 'Pathological hallmark with central caseous necrosis surrounded by Langhans giant cells.' }
    ]
  },
  {
    id: 'symptoms',
    number: '03',
    title: 'Clinical Symptoms & Signs',
    badge: 'Symptomatology',
    icon: Stethoscope,
    image: '/doctor_examining_patient.png',
    shortDesc: 'Classic triad: Cough > 2 weeks, fever with evening rise, and unexplained weight loss with night sweats.',
    fullDesc: 'Clinical presentation varies depending on anatomical site and host immune competence. Pulmonary TB presents with systemic and localized symptoms. Systemic symptoms include low-grade fever with evening spikes, drenching night sweats, fatigue, anorexia, and progressive weight loss. Localized pulmonary symptoms include persistent cough > 2 weeks, sputum production, hemoptysis, and pleuritic chest pain.',
    keyPoints: [
      'Cough lasting ≥ 2 weeks is the cardinal diagnostic trigger under NTEP guidelines.',
      'Low-grade fever with characteristic evening rise of temperature.',
      'Significant unexplained weight loss and drenching nocturnal sweats.',
      'Hemoptysis indicates cavitation or vascular erosion in advanced disease.'
    ],
    clinicalHighlights: [
      { title: 'Pediatric Symptoms', desc: 'Persistent fever, failure to thrive, weight loss, and household contact history.' },
      { title: 'Extrapulmonary Signs', desc: 'Painless cervical lymphadenopathy (scrofula), stiff neck (meningitis), back pain (Pott’s disease).' }
    ]
  },
  {
    id: 'risk-factors',
    number: '04',
    title: 'Risk Factors & Susceptibility',
    badge: 'Epidemiology',
    icon: AlertTriangle,
    image: '/assets/awareness_banner.png',
    shortDesc: 'Immunosuppression (HIV, Diabetes, Malnutrition), close contact with active TB, and poor ventilation dramatically increase risk.',
    fullDesc: 'Risk factors are divided into exposure factors and host vulnerability factors. Exposure factors include living in poorly ventilated overcrowded spaces, close household contact with an active smear-positive patient, and healthcare work settings. Host vulnerability factors include HIV infection (increases lifetime risk from 10% to 10% per year), Diabetes Mellitus (triples TB risk), undernutrition (BMI < 18.5), chronic renal failure, and tobacco or alcohol abuse.',
    keyPoints: [
      'HIV co-infection is the single strongest risk factor for active TB disease.',
      'Diabetes Mellitus impairs cellular immunity and increases treatment failure.',
      'Undernutrition severely impairs cell-mediated immunity.',
      'Indoor air pollution, tobacco smoking, and indoor overcrowding.'
    ]
  },
  {
    id: 'diagnosis',
    number: '05',
    title: 'Diagnostic Procedures & Tests',
    badge: 'Diagnostics',
    icon: Search,
    image: '/tb_lab_diagnosis.png',
    shortDesc: 'Rapid molecular testing (CBNAAT / GeneXpert), Sputum Smear Microscopy, Chest X-Ray, and Culture & DST.',
    fullDesc: 'Modern TB diagnosis relies on rapid molecular assays. CBNAAT (Cartridge Based Nucleic Acid Amplification Test / GeneXpert Ultra) and Truenat simultaneously detect M. tuberculosis DNA and Rifampicin resistance within 2 hours. Sputum smear microscopy (ZN or LED Fluorescence) provides rapid detection of infectious cases. Chest radiography identifies infiltrates, consolidation, and cavitation. Liquid culture (MGIT 960) and Line Probe Assays (LPA) confirm drug sensitivity.',
    keyPoints: [
      'CBNAAT / Truenat: Frontline diagnostic test recommended for all presumptive TB cases.',
      'Detects Rifampicin resistance (marker for MDR-TB) in under 2 hours.',
      'Sputum Smear Microscopy: ZN or LED Fluorescent Microscopy.',
      'Chest X-Ray: Essential screening tool showing upper lobe apical infiltrates or cavities.'
    ],
    clinicalHighlights: [
      { title: 'CBNAAT / GeneXpert', desc: 'High sensitivity molecular assay with automated PCR amplification.' },
      { title: 'First-Line LPA', desc: 'Detects mutations conferring resistance to Rifampicin (rpoB) and Isoniazid (katG, inhA).' }
    ]
  },
  {
    id: 'treatment',
    number: '06',
    title: 'Treatment Regimens & DOTS',
    badge: 'Therapeutics',
    icon: Pill,
    image: '/tb_medicines.png',
    shortDesc: 'First-line 6-month daily Fixed Dose Combination (2HRZE / 4HRE) and specialized all-oral MDR-TB regimens.',
    fullDesc: 'Standard drug-sensitive TB (DS-TB) is treated with a 6-month regimen comprising a 2-month Intensive Phase (Isoniazid, Rifampicin, Pyrazinamide, Ethambutol - 2HRZE) followed by a 4-month Continuation Phase (Isoniazid, Rifampicin, Ethambutol - 4HRE) administered daily using weight-banded Fixed Dose Combinations (FDCs). Drug-resistant TB (MDR/RR-TB) requires all-oral shorter regimens containing Bedaquiline, Pretomanid, Linezolid, and Levofloxacin (BPaLM/BPaL) under PMDT guidelines.',
    keyPoints: [
      'DS-TB: 2 months 4-drug Intensive Phase + 4 months 3-drug Continuation Phase.',
      'Daily weight-banded Fixed Dose Combination (FDC) tablets.',
      'Adherence monitoring via Ni-kshay 99DOTS and MERM digital adherence tools.',
      'All-oral Bedaquiline-containing regimens for Multidrug-Resistant (MDR) TB.'
    ]
  },
  {
    id: 'prevention',
    number: '07',
    title: 'Prevention & Infection Control',
    badge: 'Prevention',
    icon: ShieldCheck,
    image: '/assets/ntep_banner.png',
    shortDesc: 'BCG vaccination at birth, Tuberculosis Preventive Treatment (TPT), and airborne infection control measures.',
    fullDesc: 'Prevention encompasses primary, secondary, and environmental interventions. BCG (Bacille Calmette-Guérin) vaccine administered at birth protects infants against severe disseminated TB and TB meningitis. Tuberculosis Preventive Treatment (TPT) with 3HP (weekly Rifapentine + INH for 3 months) or 6H is provided to household contact children < 5 years and PLHIV after ruling out active disease. Airborne infection control relies on administrative controls, natural ventilation, UVGI, and N95 respirators.',
    keyPoints: [
      'BCG Vaccine given intradermally at birth reduces pediatric mortality.',
      'TB Preventive Treatment (TPT): 3HP or 6H for high-risk contacts and PLHIV.',
      'Airborne Infection Control (AIC): Ventilation, cough hygiene, and N95 masks.',
      'Contact Tracing: Systematic screening of all household contacts of index patients.'
    ]
  },
  {
    id: 'tb-in-india',
    number: '08',
    title: 'TB Burden in India',
    badge: 'National Data',
    icon: Flag,
    image: '/assets/tb_mukt_bharat_2026.png',
    shortDesc: 'India accounts for ~26% of global TB cases, with over 2.4 million annual notifications under Ni-kshay.',
    fullDesc: 'India bears the highest TB burden globally, representing approximately 26% of all global TB incidence. Over 2.5 million individuals develop TB annually in India. Under the National TB Elimination Programme (NTEP), case notifications reached record levels through expanded mandatory private sector reporting, free diagnostic molecular networks, and direct financial nutritional support via Nikshay Poshan Yojana.',
    keyPoints: [
      '26% of global TB burden resides in India.',
      'Over 2.4 million TB cases notified annually on the Ni-kshay portal.',
      'Nikshay Poshan Yojana: ₹500/month direct benefit transfer (DBT) for patient nutrition.',
      'Expanded molecular lab network with over 5,000 CBNAAT/Truenat machines.'
    ]
  },
  {
    id: 'ntep',
    number: '09',
    title: 'National TB Elimination Programme (NTEP)',
    badge: 'Policy & Strategy',
    icon: Building2,
    image: '/assets/nikshay_mitra_banner.png',
    shortDesc: 'India’s flagship program aiming to eliminate TB 5 years ahead of the global Sustainable Development Goals (SDGs).',
    fullDesc: 'The National TB Elimination Programme (NTEP), formerly RNTCP, is India’s state-led health intervention framework executing the National Strategic Plan (NSP). NTEP provides free rapid molecular diagnosis, free daily FDC anti-TB medicines, universal drug susceptibility testing (UDST), private provider incentives, and comprehensive digital surveillance through the Ni-kshay platform.',
    keyPoints: [
      'Goal: Eliminate TB in India (80% reduction in incidence, 90% reduction in mortality).',
      'Free diagnostics (CBNAAT/Truenat) and free FDC medications for all citizens.',
      'Universal Drug Susceptibility Testing (UDST) for every diagnosed patient.',
      'Ni-kshay Portal: End-to-end digital patient management system.'
    ]
  },
  {
    id: 'tb-mukt-bharat',
    number: '10',
    title: 'TB Mukt Bharat Abhiyan 2026',
    badge: 'National Mission',
    icon: HeartHandshake,
    image: '/tb_mukt_bharat_banner.png',
    shortDesc: 'People’s movement (Jan Andolan) featuring Ni-kshay Mitra donor support and nutritional aid for patients.',
    fullDesc: 'Pradhan Mantri TB Mukt Bharat Abhiyan is a visionary community-led initiative (Jan Andolan) launched to accelerate TB elimination. Central to this movement is the Ni-kshay Mitra initiative, where individual donors, elected representatives, NGOs, and corporate entities adopt TB patients to provide monthly nutritional baskets, diagnostic support, and vocational assistance throughout their treatment duration.',
    keyPoints: [
      'Jan Andolan: Transforming TB elimination into a community-driven public movement.',
      'Ni-kshay Mitra: Voluntary adoption of TB patients for monthly nutritional support.',
      'Nutritional Baskets containing food grains, pulses, vegetable oil, and milk powder.',
      'Multi-sectoral action involving Panchayati Raj, Urban Local Bodies, and Civil Society.'
    ]
  }
];

export default function TBIntroductionPage({ onCompleteRead }: TBIntroductionPageProps) {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isReadComplete, setIsReadComplete] = useState<boolean>(false);
  const [expandedSection, setExpandedSection] = useState<string | null>('what-is-tb');
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

      if (progress >= 90) {
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

  const toggleSection = (id: string) => {
    setExpandedSection(prev => (prev === id ? null : id));
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-[#1E293B] font-sans p-4 sm:p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Top Reading Progress Header Card */}
      <header className="sticky top-16 sm:top-20 z-30 bg-white border border-[#E2E8F0] rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2.5 bg-[#EFF6FF] text-[#2563EB] rounded-xl shrink-0">
            <BookOpen size={22} />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-extrabold text-[#1E293B] truncate">
              TB Introduction & WHO/NTEP Curriculum
            </h1>
            <p className="text-xs text-slate-500 font-medium">Read 90%+ to unlock Level 1 Competency Assessment</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right font-mono">
            <span className="text-sm font-extrabold text-[#2563EB]">{scrollProgress}%</span>
            <span className="block text-[10px] text-slate-500 uppercase font-semibold">Reading</span>
          </div>
          <div className="w-20 sm:w-32 bg-[#F1F5F9] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#E2E8F0]">
            <div
              className="bg-[#2563EB] h-full rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      </header>

      {/* 2. Main Page Hero Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          <div className="space-y-3 flex-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EFF6FF] text-[#2563EB] border border-blue-200 rounded-full text-xs font-semibold">
              <Sparkles size={14} /> Official Medical Curriculum • Level 1
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1E293B] tracking-tight leading-tight">
              Tuberculosis Core Curriculum & Guidelines
            </h1>
            <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
              Explore the 10 foundational domains of Tuberculosis, covering clinical microbiology, airborne transmission, diagnostic algorithms, treatment FDCs, NTEP national strategy, and the TB Mukt Bharat Abhiyan 2026.
            </p>
          </div>
          <div className="w-full lg:w-72 h-44 rounded-2xl overflow-hidden shadow-sm border border-slate-200 shrink-0">
            <img
              src="/tb_lungs_hero.png"
              alt="TB Lungs Hero"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* 3. All 10 Detailed Sections */}
      <div className="space-y-4" ref={containerRef}>
        {SECTIONS_DATA.map((section) => {
          const isExpanded = expandedSection === section.id;
          const IconComp = section.icon;

          return (
            <div
              key={section.id}
              className="bg-white border border-[#E2E8F0] rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Left Title & Badge */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#EFF6FF] text-[#2563EB] rounded-xl shrink-0 mt-0.5 border border-blue-100">
                    <IconComp size={24} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-md">
                        Section {section.number}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                        {section.badge}
                      </span>
                    </div>
                    <h2 className="text-base sm:text-xl font-bold text-[#1E293B]">
                      {section.title}
                    </h2>
                  </div>
                </div>

                {/* Read More Toggle Button */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B] text-xs font-bold rounded-xl transition-all cursor-pointer self-start sm:self-center"
                >
                  <span>{isExpanded ? 'Show Less' : 'Read More'}</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>

              {/* Short Summary Always Visible */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-3">
                {section.shortDesc}
              </p>

              {/* Expandable Details Section */}
              {isExpanded && (
                <div className="pt-4 mt-4 border-t border-[#E2E8F0] space-y-5 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                    {/* Illustration Image */}
                    <div className="md:col-span-4 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50">
                      <img
                        src={section.image}
                        alt={section.title}
                        className="w-full h-48 sm:h-56 object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Detailed Information */}
                    <div className="md:col-span-8 space-y-4">
                      <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed font-normal">
                        {section.fullDesc}
                      </p>

                      {/* Key Points */}
                      <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2">
                        <h3 className="text-xs font-extrabold text-[#2563EB] uppercase tracking-wide">
                          Key Clinical Takeaways:
                        </h3>
                        <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                          {section.keyPoints.map((point, pIdx) => (
                            <li key={pIdx} className="flex items-start gap-2">
                              <CheckCircle2 size={15} className="text-[#2563EB] mt-0.5 shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Clinical Highlights if present */}
                      {section.clinicalHighlights && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          {section.clinicalHighlights.map((hl, hIdx) => (
                            <div key={hIdx} className="p-3 bg-blue-50/60 border border-blue-200/70 rounded-xl space-y-1">
                              <span className="text-xs font-bold text-[#2563EB] block">{hl.title}</span>
                              <p className="text-[11px] text-slate-600 leading-snug">{hl.desc}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Read Completion Action Card */}
      <div className="bg-white border border-[#E2E8F0] p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <h2 className="font-extrabold text-[#1E293B] text-base sm:text-lg flex items-center gap-2">
            <ShieldCheck size={20} className="text-[#2563EB]" />
            <span>Ready for Level 1 Competency Assessment?</span>
          </h2>
          <p className="text-xs text-slate-500">
            {isReadComplete
              ? 'You have completed the required curriculum reading. Click below to proceed to exam guidelines.'
              : 'Scroll and review the core curriculum (90%+) to unlock the Level 1 assessment.'}
          </p>
        </div>

        <button
          onClick={handleFinishReading}
          disabled={!isReadComplete}
          className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all shrink-0 ${
            isReadComplete
              ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-md cursor-pointer'
              : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
          }`}
        >
          <span>Complete Read & Unlock Level 1</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
