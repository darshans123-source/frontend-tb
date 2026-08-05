export interface Level1Question {
  id: string;
  type: 'theory' | 'scenario';
  question: string;
  category: string;
  patientScenario?: {
    age: number;
    gender: string;
    occupation?: string;
    chiefComplaint: string;
    duration: string;
    vitals?: string;
    labOrRadiology?: string;
  };
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const LEVEL1_QUESTION_BANK: Level1Question[] = [
  // ==========================================
  // THEORY QUESTIONS (1 - 30)
  // ==========================================
  {
    id: 't1',
    type: 'theory',
    category: 'Microbiology',
    question: 'Which specific cell wall component of Mycobacterium tuberculosis makes it resistant to Gram staining and acid decolorization?',
    options: ['Mycolic acids (long-chain fatty acids)', 'Peptidoglycan mesh', 'Lipopolysaccharide (LPS)', 'Teichoic acid'],
    correctIndex: 0,
    explanation: 'Mycolic acids form a thick, waxy lipid layer in the M. tuberculosis cell wall, rendering it acid-fast and resistant to standard Gram stain decolorization.'
  },
  {
    id: 't2',
    type: 'theory',
    category: 'Diagnostics',
    question: 'Which bacterial gene mutation is primarily detected by CBNAAT (Xpert MTB/RIF) to identify Rifampicin resistance?',
    options: ['rpoB gene 81-bp RRDR region', 'katG gene codon 315', 'inhA promoter region', 'gyrA quinolone resistance region'],
    correctIndex: 0,
    explanation: 'CBNAAT real-time PCR assay targets the 81-bp Rifampicin Resistance-Determining Region (RRDR) of the bacterial rpoB gene.'
  },
  {
    id: 't3',
    type: 'theory',
    category: 'Transmission',
    question: 'What is the primary mode of Mycobacterium tuberculosis transmission in human populations?',
    options: ['Airborne droplet nuclei (1 to 5 microns in size)', 'Direct skin contact or fomites', 'Contaminated water supply', 'Blood-borne transfusion'],
    correctIndex: 0,
    explanation: 'TB is transmitted via microscopic airborne droplet nuclei (1–5 µm) that remain suspended in the air when an infectious pulmonary TB patient coughs, sneezes, or talks.'
  },
  {
    id: 't4',
    type: 'theory',
    category: 'Treatment',
    question: 'What is the standard duration and drug combination for the Intensive Phase of Drug-Sensitive Pulmonary TB under NTEP guidelines?',
    options: ['2 Months of HRZE (Isoniazid, Rifampicin, Pyrazinamide, Ethambutol)', '4 Months of HRE', '6 Months of HRZE', '1 Month of Bedaquiline + Linezolid'],
    correctIndex: 0,
    explanation: 'Standard drug-sensitive TB therapy begins with a 2-month Intensive Phase of 4 drugs: Isoniazid (H), Rifampicin (R), Pyrazinamide (Z), and Ethambutol (E).'
  },
  {
    id: 't5',
    type: 'theory',
    category: 'Pharmacology',
    question: 'Pyridoxine (Vitamin B6) supplementation is routinely co-prescribed with Isoniazid to prevent which adverse drug reaction?',
    options: ['Peripheral neuropathy / paresthesia', 'Optic neuritis', 'Gouty arthritis', 'Red-orange discoloration of body fluids'],
    correctIndex: 0,
    explanation: 'Isoniazid promotes pyridoxine excretion and inhibits its activation; supplemental Vitamin B6 (10–50 mg daily) prevents drug-induced peripheral neuropathy.'
  },
  {
    id: 't6',
    type: 'theory',
    category: 'Epidemiology',
    question: 'Which underlying medical condition poses the highest risk factor for progression from Latent TB Infection (LTBI) to active TB disease?',
    options: ['HIV / AIDS co-infection', 'Hypertension', 'Bronchial Asthma', 'Mild Obesity'],
    correctIndex: 0,
    explanation: 'HIV causes CD4+ T-cell depletion, multiplying the risk of active TB development by 20 to 30 times compared to immunocompetent individuals.'
  },
  {
    id: 't7',
    type: 'theory',
    category: 'Diagnostics',
    question: 'What is the minimum induration diameter on Tuberculin Skin Test (TST / Mantoux) considered positive in a person with HIV co-infection?',
    options: ['≥ 5 mm', '≥ 10 mm', '≥ 15 mm', '≥ 20 mm'],
    correctIndex: 0,
    explanation: 'In HIV-positive or severely immunocompromised individuals, a TST induration of ≥ 5 mm is classified as a positive diagnostic result.'
  },
  {
    id: 't8',
    type: 'theory',
    category: 'Pharmacology',
    question: 'Which anti-TB medication is infamous for causing retrobulbar optic neuritis leading to decreased visual acuity and red-green color blindness?',
    options: ['Ethambutol (E)', 'Rifampicin (R)', 'Isoniazid (H)', 'Pyrazinamide (Z)'],
    correctIndex: 0,
    explanation: 'Ethambutol can cause dose-dependent optic neuritis. Monthly visual acuity and color discrimination monitoring is recommended.'
  },
  {
    id: 't9',
    type: 'theory',
    category: 'Extrapulmonary TB',
    question: 'Tuberculous lymphadenitis involving painless enlargement of cervical lymph nodes is historically referred to by which medical term?',
    options: ['Scrofula', 'Pott\'s Disease', 'Goniodysgenesis', 'Lupus Vulgaris'],
    correctIndex: 0,
    explanation: 'Scrofula refers specifically to tuberculous lymphadenitis of the neck cervical lymph node chain.'
  },
  {
    id: 't10',
    type: 'theory',
    category: 'Extrapulmonary TB',
    question: 'Tuberculosis of the spine leading to anterior vertebral collapse and gibbus deformity is known as:',
    options: ['Pott\'s Disease', 'Paget\'s Disease', 'Ankylosing Spondylitis', 'Charcot Spine'],
    correctIndex: 0,
    explanation: 'Pott\'s disease (TB spondylitis) causes destruction of intervertebral discs and adjacent vertebral bodies, resulting in kyphotic deformity.'
  },
  {
    id: 't11',
    type: 'theory',
    category: 'Infection Control',
    question: 'Healthcare workers providing care to infectious pulmonary TB patients in airborne isolation rooms should wear which respiratory mask type?',
    options: ['N95 / FFP2 Respirator', '3-Ply Surgical Mask', 'Cloth Dust Mask', 'Simple Oxygen Face Mask'],
    correctIndex: 0,
    explanation: 'N95 or FFP2 respirators filter at least 95% of 0.3-micron airborne particles, protecting healthcare personnel from infectious droplet nuclei.'
  },
  {
    id: 't12',
    type: 'theory',
    category: 'Infection Control',
    question: 'What is the recommended minimum number of Air Changes per Hour (ACH) for Airborne Infection Isolation Rooms (AIIR)?',
    options: ['12 Air Changes per Hour (ACH)', '2 Air Changes per Hour', '4 Air Changes per Hour', '24 Air Changes per Hour'],
    correctIndex: 0,
    explanation: 'CDC and WHO guidelines mandate a minimum of 12 ACH with negative pressure for effective airborne isolation rooms in healthcare facilities.'
  },
  {
    id: 't13',
    type: 'theory',
    category: 'Diagnostics',
    question: 'In Ziehl-Neelsen (ZN) acid-fast stain microscopy, what color do M. tuberculosis bacilli display against the methylene blue background?',
    options: ['Bright Red / Pink rods', 'Deep Blue cocci', 'Purple gram-positive chains', 'Green spiral spirochetes'],
    correctIndex: 0,
    explanation: 'Acid-fast bacilli retain the primary stain carbol fuchsin despite acid-alcohol decolorization, appearing as bright pink/red slender rods.'
  },
  {
    id: 't14',
    type: 'theory',
    category: 'Pharmacology',
    question: 'Harmless red-orange coloration of urine, sweat, saliva, and tears is a characteristic harmless side effect of which drug?',
    options: ['Rifampicin', 'Isoniazid', 'Pyrazinamide', 'Streptomycin'],
    correctIndex: 0,
    explanation: 'Rifampicin and its metabolites impart a reddish-orange hue to body fluids. Patients must be counseled in advance to avoid alarm.'
  },
  {
    id: 't15',
    type: 'theory',
    category: 'Drug Resistance',
    question: 'Multidrug-Resistant Tuberculosis (MDR-TB) is defined by laboratory resistance to at least which two core first-line anti-TB drugs?',
    options: ['Isoniazid and Rifampicin', 'Rifampicin and Ethambutol', 'Isoniazid and Pyrazinamide', 'Streptomycin and Ethambutol'],
    correctIndex: 0,
    explanation: 'MDR-TB is strictly defined as infection with M. tuberculosis strains resistant to both Isoniazid (INH) and Rifampicin (RIF).'
  },
  {
    id: 't16',
    type: 'theory',
    category: 'Diagnostics',
    question: 'Which automated liquid culture system is considered the gold standard for mycobacterial recovery and second-line DST?',
    options: ['MGIT 960 (Mycobacteria Growth Indicator Tube)', 'Lowenstein-Jensen Slant', 'Blood Agar Plate', 'MacConkey Agar'],
    correctIndex: 0,
    explanation: 'Fluorometric liquid culture systems (MGIT 960) yield mycobacterial growth significantly faster (10–21 days) than solid L-J media.'
  },
  {
    id: 't17',
    type: 'theory',
    category: 'Radiology',
    question: 'A classic "Miliary pattern" on Chest X-Ray is characterized by:',
    options: ['Uniform 1–3 mm millet seed-like micronodules scattered bilaterally', 'Large lobar consolidation', 'Solitary coin lesion in lower lobe', 'Pleural thickening only'],
    correctIndex: 0,
    explanation: 'Miliary TB results from hematogenous dissemination, creating tiny 1–3 mm millet-seed nodules throughout both lung fields.'
  },
  {
    id: 't18',
    type: 'theory',
    category: 'Pediatric TB',
    question: 'Which BCG vaccine administration route is standard at birth in newborn infants?',
    options: ['Intradermal injection in left upper arm', 'Subcutaneous injection', 'Intramuscular gluteal', 'Oral drops'],
    correctIndex: 0,
    explanation: 'BCG (Bacille Calmette-Guérin) live attenuated vaccine is administered strictly intradermally at birth to protect against miliary and CNS TB.'
  },
  {
    id: 't19',
    type: 'theory',
    category: 'Preventive Therapy',
    question: 'Which Tuberculosis Preventive Treatment (TPT) short-course regimen consists of 12 weekly doses of Rifapentine + Isoniazid?',
    options: ['3HP Regimen', '6H Regimen', '4R Regimen', '12HRZE Regimen'],
    correctIndex: 0,
    explanation: '3HP is a 3-month once-weekly combination of Rifapentine and Isoniazid, highly effective for latent TB infection (LTBI).'
  },
  {
    id: 't20',
    type: 'theory',
    category: 'Pharmacology',
    question: 'Which anti-TB drug is known to cause hyperuricemia and acute gouty arthralgias due to renal uric acid retention?',
    options: ['Pyrazinamide', 'Isoniazid', 'Ethambutol', 'Rifampicin'],
    correctIndex: 0,
    explanation: 'Pyrazinamide metabolites inhibit renal uric acid secretion, leading to hyperuricemia and occasional acute arthralgias.'
  },
  {
    id: 't21',
    type: 'theory',
    category: 'Clinical Features',
    question: 'What is the minimum duration of persistent unexplained cough that classifies a patient as a "Presumptive TB" case under NTEP guidelines?',
    options: ['≥ 2 weeks (14 days)', '≥ 3 days', '≥ 1 month', '≥ 2 months'],
    correctIndex: 0,
    explanation: 'Any person presenting with a cough lasting 2 weeks or more, with or without fever and weight loss, is categorized as Presumptive TB.'
  },
  {
    id: 't22',
    type: 'theory',
    category: 'Extrapulmonary TB',
    question: 'In Tuberculous Meningitis, examination of Cerebrospinal Fluid (CSF) typically reveals:',
    options: ['Lymphocytic pleocytosis, elevated protein, and low CSF glucose', 'Neutrophilic dominance and high glucose', 'Normal protein with high glucose', 'Clear CSF with zero WBCs'],
    correctIndex: 0,
    explanation: 'TB CSF exhibits classic exudative features: marked lymphocytic predominance, high protein count, and significantly reduced glucose (CSF/plasma ratio < 0.3).'
  },
  {
    id: 't23',
    type: 'theory',
    category: 'Drug Resistance',
    question: 'Bedaquiline belongs to which novel class of anti-mycobacterial agents?',
    options: ['Diarylquinoline ATP synthase inhibitors', 'Fluoroquinolones', 'Nitroimidazoles', 'Rifamycins'],
    correctIndex: 0,
    explanation: 'Bedaquiline specifically targets bacterial ATP synthase enzyme subunit c, depriving M. tuberculosis of cellular energy.'
  },
  {
    id: 't24',
    type: 'theory',
    category: 'Preventive Therapy',
    question: 'Before starting Tuberculosis Preventive Treatment (TPT) in a household contact, what crucial clinical step MUST be completed first?',
    options: ['Rule out active TB disease via symptom screening / CXR / CBNAAT', 'Perform a liver biopsy', 'Administer broad spectrum penicillins', 'Isolate patient for 30 days'],
    correctIndex: 0,
    explanation: 'Starting TPT in a person with unsuspected active TB leads to single-drug therapy and rapidly induces drug resistance.'
  },
  {
    id: 't25',
    type: 'theory',
    category: 'Treatment Monitoring',
    question: 'Under NTEP guidelines, at which milestone during standard drug-sensitive ATT is follow-up sputum smear microscopy performed to check for conversion?',
    options: ['End of 2-month Intensive Phase', 'Day 7 of treatment', 'End of 1st week', 'End of 6 months only'],
    correctIndex: 0,
    explanation: 'Follow-up sputum smear is mandated at the completion of the 2-month Intensive Phase to verify microbiological response.'
  },
  {
    id: 't26',
    type: 'theory',
    category: 'Radiology',
    question: 'Which lung anatomical zone is most frequently involved in adult reactivation (secondary) pulmonary tuberculosis?',
    options: ['Apical and posterior segments of the upper lobes', 'Anterior segment of right middle lobe', 'Bilateral lung bases only', 'Subpleural inferior margins'],
    correctIndex: 0,
    explanation: 'Secondary TB has a strong predilection for upper lobe apical/posterior segments due to higher regional tissue oxygen tension (Po2).'
  },
  {
    id: 't27',
    type: 'theory',
    category: 'Pathology',
    question: 'The hallmark histopathological lesion of tuberculous granulomatous inflammation is:',
    options: ['Caseating granuloma with Langhans giant cells', 'Suppurative neutrophilic microabscess', 'Non-caseating sarcoid follicle', 'Fibrinoid necrosis without giant cells'],
    correctIndex: 0,
    explanation: 'Tuberculosis causes caseous (cheese-like) central necrosis surrounded by epithelioid histiocytes, Langhans multinucleated giant cells, and lymphocytes.'
  },
  {
    id: 't28',
    type: 'theory',
    category: 'Treatment',
    question: 'What is the total recommended duration for Continuation Phase (HRE) in standard drug-sensitive pulmonary TB?',
    options: ['4 Months', '2 Months', '6 Months', '9 Months'],
    correctIndex: 0,
    explanation: 'The standard regimen consists of 2 months Intensive Phase (2HRZE) followed by 4 months Continuation Phase (4HRE), total 6 months.'
  },
  {
    id: 't29',
    type: 'theory',
    category: 'Pharmacology',
    question: 'Elevated transaminases (ALT/AST) > 5 times upper limit of normal with nausea warrants temporary suspension of which major hepatotoxic drugs?',
    options: ['Isoniazid, Rifampicin, and Pyrazinamide', 'Ethambutol and Streptomycin', 'Amikacin and Levofloxacin', 'Pyridoxine and Vitamin C'],
    correctIndex: 0,
    explanation: 'Isoniazid, Rifampicin, and Pyrazinamide are all potentially hepatotoxic and must be paused if ALT exceeds 5x normal or 3x with symptoms.'
  },
  {
    id: 't30',
    type: 'theory',
    category: 'Public Health',
    question: 'What is the name of the official web-based surveillance portal used by India\'s National TB Elimination Program (NTEP) for patient tracking?',
    options: ['Ni-kshay Portal', 'CoWIN Portal', 'e-Sanjeevani', 'NVBDCP Portal'],
    correctIndex: 0,
    explanation: 'Ni-kshay (Ni = End, Kshay = TB) is the centralized web repository for TB case notification, treatment adherence tracking, and DBT benefits.'
  },

  // ==========================================
  // CLINICAL SCENARIO QUESTIONS (31 - 50)
  // ==========================================
  {
    id: 's31',
    type: 'scenario',
    category: 'Clinical Diagnosis',
    question: 'A 34-year-old male construction worker presents with a 3-week history of productive cough, low-grade evening fever, profuse night sweats, and 6 kg unintentional weight loss. What is the most appropriate initial diagnostic investigation?',
    patientScenario: {
      age: 34,
      gender: 'Male',
      occupation: 'Construction Worker',
      chiefComplaint: 'Productive cough, night sweats, weight loss',
      duration: '3 weeks',
      vitals: 'Temp 38.1°C, HR 88/min, BP 118/76 mmHg, BMI 17.8 kg/m²',
      labOrRadiology: 'Presumptive Pulmonary TB features on clinical exam.'
    },
    options: [
      'Sputum CBNAAT (Xpert MTB/RIF) + ZN Smear Microscopy',
      'Empiric Amoxicillin/Clavulanate for 10 days',
      'High-Resolution CT Thorax',
      'Serum Adenosine Deaminase (ADA) test'
    ],
    correctIndex: 0,
    explanation: 'Under NTEP and CDC guidelines, all individuals with presumptive TB symptoms must immediately undergo rapid molecular testing (CBNAAT) and sputum smear microscopy.'
  },
  {
    id: 's32',
    type: 'scenario',
    category: 'Drug Sensitivity',
    question: 'A 42-year-old female diagnosed with pulmonary TB receives CBNAAT results indicating "MTB Detected; Rifampicin Resistance DETECTED". What is the next clinical step?',
    patientScenario: {
      age: 42,
      gender: 'Female',
      chiefComplaint: 'Cough with hemoptysis',
      duration: '1 month',
      labOrRadiology: 'CBNAAT: MTB Detected, Rifampicin Resistance DETECTED.'
    },
    options: [
      'Refer to Nodal PMDT Center for First-Line LPA & All-Oral MDR-TB Regimen initiation',
      'Start standard 1st line 2HRZE therapy and recheck in 2 months',
      'Increase Isoniazid dose to double and repeat CBNAAT in 1 week',
      'Prescribe oral ciprofloxacin monotherapy'
    ],
    correctIndex: 0,
    explanation: 'Rifampicin resistance detected on CBNAAT indicates MDR/RR-TB. The patient requires immediate referral to PMDT for Line Probe Assay (LPA) and MDR-TB regimen.'
  },
  {
    id: 's33',
    type: 'scenario',
    category: 'Pediatric Clinical Case',
    question: 'A 4-year-old girl is brought by her mother with a history of persistent fever for 3 weeks, lethargy, loss of appetite, and weight loss. Her father was treated for pulmonary TB 6 months ago. Mantoux test shows 12 mm induration. What is the diagnosis?',
    patientScenario: {
      age: 4,
      gender: 'Female',
      chiefComplaint: 'Persistent fever, poor weight gain, lethargy',
      duration: '3 weeks',
      vitals: 'Temp 37.9°C, Weight 11.2 kg (below 3rd percentile)',
      labOrRadiology: 'Mantoux TST: 12 mm induration. CXR: Right hilar lymphadenopathy.'
    },
    options: [
      'Pediatric Pulmonary Tuberculosis',
      'Viral Upper Respiratory Infection',
      'Acute Bacterial Bronchopneumonia',
      'Normal BCG Post-Vaccination reaction'
    ],
    correctIndex: 0,
    explanation: 'In a child with close contact history, persistent fever > 2 weeks, failure to thrive, TST ≥ 10 mm, and hilar lymphadenopathy, pediatric TB is confirmed.'
  },
  {
    id: 's34',
    type: 'scenario',
    category: 'Extrapulmonary Case',
    question: 'A 28-year-old female presents with severe headache, vomiting, neck stiffness, and low-grade fever for 12 days. Lumbar puncture reveals CSF protein 210 mg/dL, CSF glucose 22 mg/dL (blood glucose 98 mg/dL), and 340 cells/mm³ (85% lymphocytes). What is the diagnosis?',
    patientScenario: {
      age: 28,
      gender: 'Female',
      chiefComplaint: 'Headache, neck rigidity, altered sensorium',
      duration: '12 days',
      labOrRadiology: 'CSF: Protein 210 mg/dL, Glucose 22 mg/dL, Lymphocytes 85%.'
    },
    options: [
      'Tuberculous Meningitis',
      'Acute Pyogenic Bacterial Meningitis',
      'Viral Aseptic Encephalitis',
      'Cryptococcal Meningitis in immunocompetent'
    ],
    correctIndex: 0,
    explanation: 'Subacute onset, lymphocytic pleocytosis, high protein (> 100 mg/dL), and low CSF/blood glucose ratio (< 0.3) are pathognomonic for Tuberculous Meningitis.'
  },
  {
    id: 's35',
    type: 'scenario',
    category: 'Extrapulmonary Case',
    question: 'A 45-year-old male presents with progressive lower back pain for 4 months, difficulty walking, and a palpable deformity in the lumbar spine. MRI shows L3-L4 disc destruction and anterior vertebral body erosion with a cold abscess. Diagnosis?',
    patientScenario: {
      age: 45,
      gender: 'Male',
      chiefComplaint: 'Chronic low back pain, gibbus deformity',
      duration: '4 months',
      labOrRadiology: 'MRI Lumbar Spine: L3-L4 disc space narrowing, anterior body erosion, paraspinal abscess.'
    },
    options: [
      'Spinal Tuberculosis (Pott\'s Disease)',
      'Multiple Myeloma',
      'Lumbar Disc Herniation',
      'Staphylococcal Osteomyelitis'
    ],
    correctIndex: 0,
    explanation: 'Chronic back pain, intervertebral disc destruction, anterior body collapse (gibbus), and paraspinal cold abscess are classical features of Spinal TB (Pott\'s disease).'
  },
  {
    id: 's36',
    type: 'scenario',
    category: 'Pharmacology Case',
    question: 'A 50-year-old patient on 1st-line ATT for 3 weeks presents with severe tingling and burning sensation in both feet. Which modification or supplement should be added immediately?',
    patientScenario: {
      age: 50,
      gender: 'Male',
      chiefComplaint: 'Severe burning pain and numbness in soles',
      duration: 'Started 1 week ago',
      labOrRadiology: 'Patient currently taking 2HRZE daily Fixed Dose Combination.'
    },
    options: [
      'Add Pyridoxine (Vitamin B6) 50 mg daily',
      'Stop Rifampicin immediately',
      'Add High-dose Oral Steroids',
      'Discontinue Ethambutol'
    ],
    correctIndex: 0,
    explanation: 'Burning feet (peripheral neuropathy) is a known side effect of Isoniazid. Therapeutic Pyridoxine (Vitamin B6 50–100 mg daily) relieves these symptoms.'
  },
  {
    id: 's37',
    type: 'scenario',
    category: 'Pharmacology Case',
    question: 'A 38-year-old male on 2HRZE complains that his urine and sweat have turned bright orange-red. He has no abdominal pain or jaundice. What is the appropriate advice?',
    patientScenario: {
      age: 38,
      gender: 'Male',
      chiefComplaint: 'Red-orange urine color',
      duration: '2 days after starting ATT',
      vitals: 'LFTs normal, Bilirubin 0.8 mg/dL'
    },
    options: [
      'Reassure the patient that this is a benign side effect of Rifampicin',
      'Discontinue all ATT medications and order emergency LFTs',
      'Switch Rifampicin to Levofloxacin',
      'Send urine for urgent hematuria workup'
    ],
    correctIndex: 0,
    explanation: 'Red-orange discoloration of urine is an expected, harmless side effect of Rifampicin. Reassurance is the appropriate intervention.'
  },
  {
    id: 's38',
    type: 'scenario',
    category: 'HIV-TB Co-infection',
    question: 'A 29-year-old HIV-positive male (CD4 count 110/mm³) is diagnosed with smear-positive pulmonary TB. When should Antiretroviral Therapy (ART) be initiated relative to ATT?',
    patientScenario: {
      age: 29,
      gender: 'Male',
      chiefComplaint: 'HIV positive with fever and pulmonary TB',
      duration: '2 weeks',
      labOrRadiology: 'CD4 count: 110 cells/mm³. Sputum AFB: 2+ Positive.'
    },
    options: [
      'Start ART within 2 weeks of starting Anti-TB Treatment (ATT)',
      'Start ART immediately on Day 1 before ATT',
      'Delay ART until completion of 6 months ATT',
      'Withhold ART until CD4 count drops below 50'
    ],
    correctIndex: 0,
    explanation: 'In HIV-TB co-infected patients with CD4 < 50–150, ART should be started within 2 weeks of initiating ATT to reduce mortality while monitoring for IRIS.'
  },
  {
    id: 's39',
    type: 'scenario',
    category: 'Toxicity Case',
    question: 'A 55-year-old patient on 2HRZE for 4 weeks presents with jaundice, nausea, and anorexia. LFT shows ALT 380 U/L (normal < 40) and Total Bilirubin 4.2 mg/dL. What action is required?',
    patientScenario: {
      age: 55,
      gender: 'Female',
      chiefComplaint: 'Jaundice, dark urine, loss of appetite',
      duration: '4 days',
      labOrRadiology: 'ALT 380 U/L (9x ULN), Total Bilirubin 4.2 mg/dL.'
    },
    options: [
      'Stop hepatotoxic drugs (Isoniazid, Rifampicin, Pyrazinamide) immediately',
      'Continue treatment and recheck LFT in 2 weeks',
      'Double the dose of Pyrazinamide',
      'Switch to oral prednisolone monotherapy'
    ],
    correctIndex: 0,
    explanation: 'ALT > 3x ULN with symptoms (or > 5x asymptomatic) constitutes Drug-Induced Liver Injury (DILI). Hepatotoxic ATT (H, R, Z) must be paused immediately.'
  },
  {
    id: 's40',
    type: 'scenario',
    category: 'Preventive Case',
    question: 'A 3-year-old boy lives with his mother who was diagnosed with drug-sensitive pulmonary TB. The boy is asymptomatic and CXR is normal. What is the recommended management?',
    patientScenario: {
      age: 3,
      gender: 'Male',
      chiefComplaint: 'Asymptomatic household contact of infectious TB patient',
      duration: 'Contact for 2 months',
      labOrRadiology: 'CXR: Clear, No symptoms. Active TB ruled out.'
    },
    options: [
      'Initiate Tuberculosis Preventive Treatment (TPT - Isoniazid for 6 months)',
      'Start full 4-drug 2HRZE treatment',
      'No treatment needed, observe only',
      'Give BCG booster vaccine'
    ],
    correctIndex: 0,
    explanation: 'All household child contacts under 5 years of age of active pulmonary TB cases must receive TPT (6H or 3HP) after ruling out active disease.'
  },
  {
    id: 's41',
    type: 'scenario',
    category: 'Radiology Case',
    question: 'A 60-year-old male diabetic presents with chronic cough. CXR demonstrates a thick-walled cavitary lesion in the right upper lobe apex with surrounding infiltrates. What bacillary load state does a cavity signify?',
    patientScenario: {
      age: 60,
      gender: 'Male',
      chiefComplaint: 'Cough with blood-tinged sputum',
      duration: '1 month',
      labOrRadiology: 'CXR: 3 cm thick-walled right apical cavity.'
    },
    options: [
      'High bacillary load and high patient infectiousness',
      'Low bacillary load with healing fibrosis',
      'Completely sterile non-infectious lesion',
      'Fungal aspergilloma only'
    ],
    correctIndex: 0,
    explanation: 'Cavitary pulmonary lesions contain massive populations of extracellular M. tuberculosis (up to 10⁸ bacilli/mL), indicating high infectious risk.'
  },
  {
    id: 's42',
    type: 'scenario',
    category: 'Diagnostics Case',
    question: 'A sputum sample submitted for Ziehl-Neelsen microscopy shows 4 AFB bacilli in 100 oil immersion fields. How is this smear result graded under NTEP guidelines?',
    patientScenario: {
      age: 48,
      gender: 'Male',
      chiefComplaint: 'Chronic cough',
      duration: '3 weeks',
      labOrRadiology: 'ZN Smear: 4 AFB seen in 100 fields.'
    },
    options: [
      'Scanty (record exact number: Scanty 4)',
      '1+ Positive',
      '2+ Positive',
      'Negative'
    ],
    correctIndex: 0,
    explanation: 'Under ZN microscopy standards, 1 to 9 AFB observed per 100 oil immersion fields is reported as "Scanty" with the exact count specified.'
  },
  {
    id: 's43',
    type: 'scenario',
    category: 'Extrapulmonary Case',
    question: 'A 22-year-old college student presents with right-sided chest pain, breathlessness, and fever. CXR reveals right pleural effusion. Pleural fluid tap shows exudative fluid, 88% lymphocytes, ADA 68 U/L (normal < 40). Diagnosis?',
    patientScenario: {
      age: 22,
      gender: 'Female',
      chiefComplaint: 'Right pleuritic chest pain, dyspnea',
      duration: '10 days',
      labOrRadiology: 'Pleural Fluid: Exudative, Lymphocytes 88%, ADA 68 U/L.'
    },
    options: [
      'Tuberculous Pleural Effusion',
      'Transudative Congestive Heart Failure',
      'Empyema due to Staphylococcus',
      'Malignant Mesothelioma'
    ],
    correctIndex: 0,
    explanation: 'Exudative lymphocytic pleural fluid with elevated Adenosine Deaminase (ADA > 40 U/L) is diagnostic for Tuberculous Pleurisy in high-burden settings.'
  },
  {
    id: 's44',
    type: 'scenario',
    category: 'Pharmacology Case',
    question: 'A patient on ATT reports difficulty reading newspaper print and notices inability to distinguish red from green traffic lights. Which drug is responsible?',
    patientScenario: {
      age: 52,
      gender: 'Male',
      chiefComplaint: 'Blurred vision and dyschromatopsia (red-green color loss)',
      duration: 'Started 2 weeks ago',
      labOrRadiology: 'Patient on 2HRZE regimen.'
    },
    options: [
      'Ethambutol',
      'Isoniazid',
      'Rifampicin',
      'Pyrazinamide'
    ],
    correctIndex: 0,
    explanation: 'Retrobulbar optic neuritis with reduced visual acuity and lost red-green color discrimination is a characteristic adverse effect of Ethambutol.'
  },
  {
    id: 's45',
    type: 'scenario',
    category: 'Treatment Case',
    question: 'A patient with drug-sensitive pulmonary TB completes the 2-month Intensive Phase (2HRZE). Sputum smear at 2 months is negative and patient is clinically improved. What is the next management step?',
    patientScenario: {
      age: 36,
      gender: 'Male',
      chiefComplaint: 'Completed 2 months Intensive Phase',
      duration: '2 months',
      labOrRadiology: '2-Month Sputum Smear: Negative.'
    },
    options: [
      'Transition to 4-month Continuation Phase with HRE (Isoniazid, Rifampicin, Ethambutol)',
      'Stop all treatment completely',
      'Extend Intensive Phase by another 2 months',
      'Switch to Bedaquiline'
    ],
    correctIndex: 0,
    explanation: 'Smear conversion at the end of the Intensive Phase permits smooth transition into the 4-month Continuation Phase (4HRE).'
  },
  {
    id: 's46',
    type: 'scenario',
    category: 'Diagnostics Case',
    question: 'A 30-year-old male with suspected TB cannot produce sputum. What alternative diagnostic sample collection method should be performed for CBNAAT testing?',
    patientScenario: {
      age: 30,
      gender: 'Male',
      chiefComplaint: 'Dry cough, no sputum production',
      duration: '3 weeks',
      labOrRadiology: 'Unable to expectorate sputum voluntarily.'
    },
    options: [
      'Induced Sputum (Hypertonic saline nebulization) or Bronchoalveolar Lavage (BAL)',
      'Saliva swab',
      'Venous blood sample',
      'Urine culture'
    ],
    correctIndex: 0,
    explanation: 'For non-sputum-producing adults, sputum induction using 3–5% hypertonic saline nebulization or BAL yields quality specimens for CBNAAT.'
  },
  {
    id: 's47',
    type: 'scenario',
    category: 'Extrapulmonary Case',
    question: 'A 26-year-old female presents with chronic abdominal pain, low-grade fever, weight loss, and ascites. Ultrasound shows matted bowel loops and omental caking. Ascitic fluid ADA is 54 U/L. Diagnosis?',
    patientScenario: {
      age: 26,
      gender: 'Female',
      chiefComplaint: 'Abdominal distension, pain, night sweats',
      duration: '1 month',
      labOrRadiology: 'USG Abdomen: Matted bowel, ascites. Ascitic ADA: 54 U/L.'
    },
    options: [
      'Abdominal Tuberculosis (Peritoneal TB)',
      'Ovarian Carcinoma with ascites',
      'Pyogenic Bacterial Peritonitis',
      'Crohn\'s Disease'
    ],
    correctIndex: 0,
    explanation: 'Exudative ascites with high ADA (> 30–40 U/L), matted bowel loops, and omental thickening are classic for Abdominal Peritoneal TB.'
  },
  {
    id: 's48',
    type: 'scenario',
    category: 'Pediatric Case',
    question: 'A 6-month-old infant presenting with high fever, neck stiffness, and bulging fontanelle is suspected of having TB Meningitis. Which BCG-related protection factor is most significant in infants?',
    patientScenario: {
      age: 0.5,
      gender: 'Male',
      chiefComplaint: 'High fever, bulging fontanelle, vomiting',
      duration: '5 days',
      labOrRadiology: 'BCG scar present on left upper arm.'
    },
    options: [
      'BCG vaccine significantly reduces the risk of severe disseminated & meningeal TB in infants',
      'BCG prevents pulmonary TB in 100% of adults',
      'BCG replaces the need for ATT therapy',
      'BCG confers lifelong total immunity to all strains'
    ],
    correctIndex: 0,
    explanation: 'BCG vaccination at birth provides 70–80% protection specifically against severe pediatric forms like TB meningitis and miliary TB.'
  },
  {
    id: 's49',
    type: 'scenario',
    category: 'Infection Control Case',
    question: 'An inpatient diagnosed with open smear-positive 3+ pulmonary TB is admitted to a ward. Which infection control measure must be implemented immediately for the patient?',
    patientScenario: {
      age: 41,
      gender: 'Male',
      chiefComplaint: 'Inpatient with 3+ smear positive pulmonary TB',
      duration: 'Admitted today',
      labOrRadiology: 'Sputum AFB 3+ Positive.'
    },
    options: [
      'Place patient in negative-pressure Airborne Isolation room and provide surgical mask for cough hygiene',
      'Place in general ward next to immunocompromised patients',
      'Keep windows completely closed with ceiling fan off',
      'Require patient to wear fitted N95 mask 24 hours a day'
    ],
    correctIndex: 0,
    explanation: 'Infectious patients must be isolated in negative pressure rooms with good ventilation; the patient wears a simple surgical mask to trap droplets at the source.'
  },
  {
    id: 's50',
    type: 'scenario',
    category: 'Public Health Case',
    question: 'Under NTEP guidelines, what financial direct benefit transfer (DBT) incentive is provided monthly to TB patients under the Ni-kshay Poshan Yojana during treatment?',
    patientScenario: {
      age: 33,
      gender: 'Female',
      chiefComplaint: 'Newly registered TB patient under NTEP',
      duration: 'Treatment started today',
      labOrRadiology: 'Registered on Ni-kshay portal.'
    },
    options: [
      '₹500 / month nutritional support for the entire duration of treatment',
      '₹10,000 one-time cash grant',
      'Free hospital stay voucher only',
      '₹100 / month transport fee'
    ],
    correctIndex: 0,
    explanation: 'Ni-kshay Poshan Yojana provides ₹500 per month directly to the bank account of every notified TB patient to support nutritional needs throughout treatment.'
  }
];

const LOCAL_STORAGE_KEY_BANK = 'tbquest_level1_question_bank';

/**
 * Retrieve the active question bank (from LocalStorage if updated by Admin, else default 50 questions)
 */
export function getStoredQuestionBank(): Level1Question[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BANK);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load stored question bank:', e);
  }
  return LEVEL1_QUESTION_BANK;
}

/**
 * Save updated question bank to LocalStorage (Admin feature)
 */
export function saveStoredQuestionBank(questions: Level1Question[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_BANK, JSON.stringify(questions));
  } catch (e) {
    console.warn('Failed to save question bank:', e);
  }
}

/**
 * Utility function to generate a randomized 50-question quiz attempt for Level 1.
 * Shuffles all 50 questions randomly and shuffles option choices for each question.
 */
export function generateRandomLevel1Quiz(): Level1Question[] {
  const bank = getStoredQuestionBank();

  // Fisher-Yates shuffle helper
  const shuffleArray = <T>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Shuffle order of all questions
  const shuffledQuestions = shuffleArray(bank);

  // For each question, shuffle option order while retaining correct answer mapping
  return shuffledQuestions.map(q => {
    const originalCorrectText = q.options[q.correctIndex];
    const shuffledOptions = shuffleArray(q.options);
    const newCorrectIndex = shuffledOptions.indexOf(originalCorrectText);

    return {
      ...q,
      options: shuffledOptions,
      correctIndex: newCorrectIndex
    };
  });
}

