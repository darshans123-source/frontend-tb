import { ChallengeCategory } from '../types/snakeLadder';

export interface Level1ClinicalQuestion {
  id: string; // 't1' - 't25'
  questionNumber: number; // 1 - 25
  squareNumber: number; // Assigned square on 10x10 board (1-100)
  category: ChallengeCategory;
  categoryLabel: string;
  patientClue: string;
  question: string;
  options: string[];
  correctIndex: number;
  clinicalInsight: string; // 💡 WHAT YOU LEARNED
  whyRationale: string;    // 💡 LEARNING MOMENT
  marks: number;          // Standard 10 Marks, Final 30 Marks
  xp: number;             // Standard 20 XP, Final 100 XP
  isRapid?: boolean;
  isBonus?: boolean;
  ladderTo?: number;
  snakeTo?: number;
}

/**
 * EXACT 25 LEVEL 1 TB CLINICAL CHALLENGES (t1 to t25)
 * Carefully calibrated to the 7 core categories:
 * - Symptoms: 7 Questions (Q1 - Q7)
 * - Clinical Clues: 4 Questions (Q8, Q9, Q16, Q20)
 * - Risk Factors: 4 Questions (Q10, Q11, Q12, Q13)
 * - Patient History: 3 Questions (Q14, Q15, Q22)
 * - TB Exposure: 2 Questions (Q17, Q18)
 * - Clinical Reasoning: 3 Questions (Q19, Q21, Q23)
 * - Presumptive TB: 2 Questions (Q24, Q25)
 * Total: 25 Questions = Maximum 250 Marks
 */
export const LEVEL1_25_CLINICAL_QUESTIONS: Level1ClinicalQuestion[] = [
  // =========================================================================
  // ZONE 1: EASY (Squares 1–30) — Focus: Cardinal TB Symptoms (7 Questions)
  // =========================================================================
  {
    id: 't1',
    questionNumber: 1,
    squareNumber: 4, // Ladder 4 -> 16
    category: 'symptoms',
    categoryLabel: 'Cardinal Symptoms',
    patientClue: 'A 32-year-old primary school teacher reports an irritating cough that has persisted for 3 weeks along with fatigue.',
    question: 'Which clinical symptom should raise the strongest initial suspicion for pulmonary tuberculosis in an adult patient?',
    options: [
      'Prolonged cough lasting more than 2 weeks',
      'Sudden eye colour change',
      'Change in shoe size',
      'Sudden shift in favourite food preference'
    ],
    correctIndex: 0,
    clinicalInsight: 'Persistent cough lasting 2 weeks or longer is the cardinal entry point triggering presumptive pulmonary TB evaluation under NTEP guidelines.',
    whyRationale: 'Eye colour, shoe size, and personal tastes have zero biological link to respiratory disease. Cough ≥ 2 weeks is the key clinical red flag.',
    marks: 10,
    xp: 20,
    ladderTo: 16
  },
  {
    id: 't2',
    questionNumber: 2,
    squareNumber: 8, // Rapid Challenge
    category: 'symptoms',
    categoryLabel: 'Fever Profile',
    patientClue: 'A 28-year-old office worker notes that she feels hot and feverish every late afternoon with body temperature reaching 99.8°F, followed by chills at night.',
    question: 'What is the characteristic diurnal body temperature pattern commonly observed in active pulmonary tuberculosis?',
    options: [
      'High continuous morning fever',
      'Evening rise of temperature with night sweats',
      'Brief 5-minute spikes only after meals',
      'Subnormal hypothermia during physical exertion'
    ],
    correctIndex: 1,
    clinicalInsight: 'Low-grade fever rising characteristically in the late afternoon or evening (vespertine fever) accompanied by night sweats is a hallmark TB clue.',
    whyRationale: 'Morning spikes or post-prandial temperature shifts do not reflect the chronic cytokine secretion rhythm characteristic of Mycobacterium tuberculosis.',
    marks: 10,
    xp: 20,
    isRapid: true
  },
  {
    id: 't3',
    questionNumber: 3,
    squareNumber: 12, // Ladder 12 -> 32
    category: 'symptoms',
    categoryLabel: 'Constitutional Signs',
    patientClue: 'A 45-year-old carpenter finds his trousers are falling off and notes an involuntary 6 kg weight loss over the past 6 weeks without dieting.',
    question: 'Unexplained significant weight loss (>5% of body weight) in a patient with chronic respiratory complaints primarily reflects:',
    options: [
      'Normal athletic adaptation to physical labour',
      'Chronic hypercatabolic state driven by mycobacterial infection',
      'Temporary dehydration from drinking hot tea',
      'Harmless variation during seasonal climate change'
    ],
    correctIndex: 1,
    clinicalInsight: 'Unexplained weight loss and cachexia in TB stem from chronic release of tumor necrosis factor-alpha (TNF-α, formerly cachectin) and interleukins.',
    whyRationale: 'Involuntary weight loss exceeding 5% in weeks is never normal adaptation; alongside respiratory symptoms, it indicates active chronic disease.',
    marks: 10,
    xp: 20,
    ladderTo: 32
  },
  {
    id: 't4',
    questionNumber: 4,
    squareNumber: 17,
    category: 'symptoms',
    categoryLabel: 'Nocturnal Sweats',
    patientClue: 'A 36-year-old woman wakes up drenched in sweat multiple times every night, requiring complete changes of nightwear and bedsheets.',
    question: 'Drenching night sweats requiring change of clothing in tuberculosis are primarily caused by:',
    options: [
      'Sleeping in warm synthetic nightwear',
      'Systemic cytokine release during nighttime temperature defervescence',
      'Drinking warm fluids before bedtime',
      'High ambient room humidity alone'
    ],
    correctIndex: 1,
    clinicalInsight: 'Night sweats occur when pyrogenic cytokines reset the hypothalamic thermoregulatory center downward during sleep, precipitating diaphoresis.',
    whyRationale: 'External room warmth causes mild perspiration, but recurrent drenching nocturnal sweats soaking bedclothes are a classic systemic TB B-symptom.',
    marks: 10,
    xp: 20
  },
  {
    id: 't5',
    questionNumber: 5,
    squareNumber: 21,
    category: 'symptoms',
    categoryLabel: 'Anorexia & Wasting',
    patientClue: 'A university student reports persistent loss of appetite for a month, experiencing early satiety after two bites and losing all interest in meals.',
    question: 'How should persistent loss of appetite (anorexia) combined with chronic low-grade fever be interpreted clinically?',
    options: [
      'An important constitutional symptom cluster supporting presumptive TB',
      'Simple dislike of cafeteria meals requiring no medical attention',
      'Guaranteed diagnostic proof of an acute surgical abdomen',
      'A normal reaction to academic exam stress requiring only vitamins'
    ],
    correctIndex: 0,
    clinicalInsight: 'Persistent anorexia, when coupled with fever and involuntary weight loss, completes the classic triad of constitutional TB symptoms.',
    whyRationale: 'Dismissing chronic anorexia as dietary pickiness delays diagnostic testing for serious chronic respiratory and systemic mycobacterial infections.',
    marks: 10,
    xp: 20
  },
  {
    id: 't6',
    questionNumber: 6,
    squareNumber: 25, // Ladder 25 -> 46
    category: 'symptoms',
    categoryLabel: 'Haemoptysis Urgency',
    patientClue: 'A 39-year-old shopkeeper presents with blood-streaked sputum (haemoptysis) following a severe bout of morning coughing.',
    question: 'What is the immediate clinical urgency of coughing up blood (haemoptysis), even in small streaks, in an adult with chronic cough?',
    options: [
      'Advise drinking cold water and send home without evaluation',
      'Prescribe throat lozenges and ignore the blood streaks',
      'Promptly consider pulmonary TB and order urgent chest imaging & sputum CBNAAT',
      'Reassure the patient that blood in sputum is completely harmless'
    ],
    correctIndex: 2,
    clinicalInsight: 'Haemoptysis indicates parenchymal lung tissue destruction, cavitation, or vascular ulceration and demands immediate diagnostic investigation.',
    whyRationale: 'Treating hemoptysis with simple lozenges is dangerous; it risks missing cavitary pulmonary tuberculosis or sudden massive pulmonary hemorrhage.',
    marks: 10,
    xp: 20,
    ladderTo: 46
  },
  {
    id: 't7',
    questionNumber: 7,
    squareNumber: 28, // Snake Trap 28 -> 10
    category: 'symptoms',
    categoryLabel: 'Extrapulmonary Signs',
    patientClue: 'A 22-year-old student reports non-tender, rubbery, matted swelling along the right side of her neck for 2 months without acute warmth or pain.',
    question: 'Chronic, painless enlargement of cervical lymph nodes (Scrofula) in a young adult is the most frequent presentation of which condition?',
    options: [
      'Acute common cold',
      'Tuberculous lymphadenitis (Extrapulmonary TB)',
      'Simple muscular strain of the sternocleidomastoid',
      'Routine dental cavity'
    ],
    correctIndex: 1,
    clinicalInsight: 'Tuberculous lymphadenitis (Scrofula) is the single most frequent extrapulmonary form of TB, characteristically presenting as painless, matted nodes.',
    whyRationale: 'Muscle strains and common colds do not cause chronic matted lymphatic enlargement lasting months. Fine-needle aspiration and CBNAAT are indicated.',
    marks: 10,
    xp: 20,
    snakeTo: 10
  },

  // =========================================================================
  // ZONE 2: MEDIUM (Squares 31–60) — Focus: Risk Factors & Exposure (7 Questions)
  // =========================================================================
  {
    id: 't8',
    questionNumber: 8,
    squareNumber: 33,
    category: 'clinicalClues',
    categoryLabel: 'Smear Microscopy',
    patientClue: 'Under high-power oil immersion microscopy (1000x), a carbol-fuchsin stained sputum smear is evaluated in the laboratory.',
    question: 'In Ziehl-Neelsen (ZN) acid-fast stain microscopy, what color and appearance do M. tuberculosis bacilli display against the counterstained background?',
    options: [
      'Bright Red / Pink slender beaded rods against a light blue background',
      'Dark purple Gram-positive spherical clusters',
      'Bright green spiral-shaped corkscrew organisms',
      'Large brown oval fungal yeast cells'
    ],
    correctIndex: 0,
    clinicalInsight: 'Acid-fast bacilli retain the primary phenolic carbol fuchsin stain despite acid-alcohol washing, appearing as bright pink/red beaded rods.',
    whyRationale: 'M. tuberculosis cell wall mycolic acids retain carbol fuchsin; non-acid-fast bacteria and cellular debris lose it and stain blue with methylene blue.',
    marks: 10,
    xp: 20
  },
  {
    id: 't9',
    questionNumber: 9,
    squareNumber: 37, // Ladder 37 -> 63
    category: 'clinicalClues',
    categoryLabel: 'Molecular Diagnostics',
    patientClue: 'A presumptive TB patient provides a sputum specimen for rapid automated Cartridge-Based Nucleic Acid Amplification Testing (CBNAAT / Xpert MTB/RIF).',
    question: 'Which bacterial gene mutation is primarily detected by CBNAAT to rapidly identify Rifampicin resistance?',
    options: [
      'gyrA quinolone resistance-determining region',
      'rpoB gene 81-bp Rifampicin Resistance-Determining Region (RRDR)',
      'katG gene codon 315',
      'inhA promoter regulatory region'
    ],
    correctIndex: 1,
    clinicalInsight: 'CBNAAT real-time PCR assay targets the 81-bp RRDR of the bacterial rpoB gene, which accounts for >95% of Rifampicin resistance mutations.',
    whyRationale: 'katG and inhA mutations confer Isoniazid resistance, while gyrA mutations confer fluoroquinolone resistance. CBNAAT specifically screens the rpoB gene.',
    marks: 10,
    xp: 20,
    ladderTo: 63
  },
  {
    id: 't10',
    questionNumber: 10,
    squareNumber: 41,
    category: 'riskFactors',
    categoryLabel: 'Immune Vulnerability',
    patientClue: 'An epidemiological review identifies individuals with latent TB infection at highest danger of reactivation into active disease.',
    question: 'Which underlying medical condition poses the highest biological risk factor for progression from Latent TB Infection (LTBI) to active clinical TB disease?',
    options: [
      'Mild seasonal allergic rhinitis',
      'HIV / AIDS co-infection causing CD4+ T-lymphocyte depletion',
      'Corrected mild myopia (nearsightedness)',
      'Occasional motion sickness during travel'
    ],
    correctIndex: 1,
    clinicalInsight: 'HIV destroys CD4+ helper T-cells necessary for maintaining granuloma wall integrity, multiplying active TB risk by 20 to 30 fold.',
    whyRationale: 'Allergies, motion sickness, and refractive errors do not impair cell-mediated immunity; CD4+ depletion in HIV is the preeminent driver of TB reactivation.',
    marks: 10,
    xp: 20
  },
  {
    id: 't11',
    questionNumber: 11,
    squareNumber: 44, // Snake Trap 44 -> 22
    category: 'riskFactors',
    categoryLabel: 'Diabetes Comorbidity',
    patientClue: 'A 50-year-old with poorly controlled Type 2 Diabetes (HbA1c 10.4%) presents with persistent cough and weight loss.',
    question: 'How does poorly controlled Diabetes Mellitus clinically impact a patient\'s susceptibility to active tuberculosis?',
    options: [
      'Completely protects the respiratory tract from all bacterial infections',
      'Triples the risk of developing active TB and increases the probability of treatment failure',
      'Has zero immunological impact on mycobacterial defense mechanisms',
      'Converts virulent TB bacilli into harmless commensal flora'
    ],
    correctIndex: 1,
    clinicalInsight: 'Diabetes impairs macrophage chemotaxis and T-cell signaling, tripling TB risk and requiring bidirectional screening under national guidelines.',
    whyRationale: 'Assuming diabetes protects against infection is medically backward; hyperglycemic hosts suffer impaired phagocytic bacterial clearance.',
    marks: 10,
    xp: 20,
    snakeTo: 22
  },
  {
    id: 't12',
    questionNumber: 12,
    squareNumber: 49,
    category: 'riskFactors',
    categoryLabel: 'Tobacco Hazard',
    patientClue: 'A 42-year-old chronic tobacco smoker (20 pack-years) presents with persistent productive morning cough.',
    question: 'How does chronic tobacco smoking biologically compromise pulmonary defense mechanisms against Mycobacterium tuberculosis?',
    options: [
      'Paralyzes respiratory mucociliary clearance and impairs alveolar macrophage phagocytosis',
      'Sterilizes bronchial passages through the heat of inhaled smoke',
      'Coats alveoli with protective nicotine preventing bacterial adherence',
      'Strengthens the lung epithelial barrier against airborne pathogens'
    ],
    correctIndex: 0,
    clinicalInsight: 'Tobacco smoke paralyzes bronchial cilia and impairs alveolar macrophage oxidative bursts, doubling the risk of TB infection and active disease.',
    whyRationale: 'Tobacco smoke damages mucosal architecture and suppresses local pulmonary immunity rather than protecting or sterilizing lung tissue.',
    marks: 10,
    xp: 20
  },
  {
    id: 't13',
    questionNumber: 13,
    squareNumber: 54, // Ladder 54 -> 76
    category: 'riskFactors',
    categoryLabel: 'Immunosuppressive Therapy',
    patientClue: 'A rheumatology clinic prepares to initiate biologic TNF-alpha inhibitor therapy in a patient with severe rheumatoid arthritis.',
    question: 'Why must latent and active tuberculosis be thoroughly evaluated and treated before initiating TNF-alpha inhibitor therapy?',
    options: [
      'Biologics cause harmless orange staining of bodily secretions',
      'TNF-alpha is critical for maintaining granuloma integrity; blocking it can trigger catastrophic TB reactivation',
      'TNF inhibitors directly neutralize standard first-line antibiotics',
      'Pre-biologic screening is merely an administrative formality without medical risk'
    ],
    correctIndex: 1,
    clinicalInsight: 'TNF-alpha maintains the macrophage wall around tubercular granulomas; blocking it allows dormant bacilli to escape and cause disseminated disease.',
    whyRationale: 'Neutralizing TNF-alpha leads to rapid granuloma dissolution and fulminant disseminated or miliary tuberculosis.',
    marks: 10,
    xp: 20,
    ladderTo: 76
  },
  {
    id: 't14',
    questionNumber: 14,
    squareNumber: 58,
    category: 'patientHistory',
    categoryLabel: 'Treatment History',
    patientClue: 'A 52-year-old with recurrent cough reports that he took anti-TB medicines for 2 months three years ago but discontinued early when his fever resolved.',
    question: 'Why is a past medical history of incomplete anti-TB treatment clinically significant in a patient presenting with recurrent symptoms?',
    options: [
      'Taking medicines for 2 months produces permanent lifetime immunity',
      'Prior incomplete treatment is the single strongest clinical predictor for acquired drug resistance (such as MDR-TB)',
      'Previous treatment history becomes irrelevant after 1 calendar year has elapsed',
      'Stopping early has zero consequence on mycobacterial survival or resistance'
    ],
    correctIndex: 1,
    clinicalInsight: 'Previous irregular or incomplete anti-TB therapy exerts selective antibiotic pressure, breeding acquired drug-resistant strains like MDR-TB.',
    whyRationale: 'Incomplete therapy does not confer immunity; it allows resistant bacillary subpopulations to multiply and cause drug-resistant relapse.',
    marks: 10,
    xp: 20
  },

  // =========================================================================
  // ZONE 3: HARD (Squares 61–85) — Focus: Exposure & Clinical Clues (6 Questions)
  // =========================================================================
  {
    id: 't15',
    questionNumber: 15,
    squareNumber: 62, // Snake Trap 62 -> 40
    category: 'patientHistory',
    categoryLabel: 'Household Contact',
    patientClue: 'A 24-year-old shares a small one-room apartment with his father, who was treated for sputum smear-positive pulmonary TB 4 months ago.',
    question: 'Why is his father\'s recent history of sputum-positive pulmonary TB clinically crucial in evaluating his current cough?',
    options: [
      'TB is strictly hereditary and cannot spread through shared indoor air',
      'Close household contact with an infectious pulmonary TB case significantly elevates the probability of transmission',
      'Family contact history has zero relevance in infectious disease evaluation',
      'Contact history proves the patient already has multidrug resistance'
    ],
    correctIndex: 1,
    clinicalInsight: 'Close household contacts sharing indoor sleeping quarters with an infectious pulmonary TB patient face the highest secondary transmission risk.',
    whyRationale: 'TB is an airborne bacterial infection, not a genetic trait. Household exposure markedly increases the pre-test probability of infection.',
    marks: 10,
    xp: 20,
    snakeTo: 40
  },
  {
    id: 't16',
    questionNumber: 16,
    squareNumber: 66,
    category: 'clinicalClues',
    categoryLabel: 'Chest Radiography',
    patientClue: 'A chest X-ray of a 22-year-old with high fever, headache, and severe dyspnea shows symmetric diffuse reticulonodular opacities across both lung fields.',
    question: 'A classic "Miliary pattern" on Chest X-Ray is characterized by:',
    options: [
      'Solitary coin lesion in the right lower lobe only',
      'Uniform 1–3 mm millet seed-like micronodules scattered bilaterally throughout both lungs',
      'Large dense lobar consolidation with air bronchograms',
      'Isolated apical pleural thickening without lung parenchymal lesions'
    ],
    correctIndex: 1,
    clinicalInsight: 'Miliary TB arises from massive hematogenous dissemination, creating millions of uniform 1–3 mm discrete millet seed-sized nodules across both lung fields.',
    whyRationale: 'Lobar consolidation suggests acute bacterial pneumonia; solitary coin lesions indicate tuberculomas; bilateral 1-3 mm micronodules define miliary spread.',
    marks: 10,
    xp: 20
  },
  {
    id: 't17',
    questionNumber: 17,
    squareNumber: 69, // Ladder 69 -> 89
    category: 'exposure',
    categoryLabel: 'Aerosol Transmission',
    patientClue: 'The hospital infection control committee assesses risk vectors in overcrowded outpatient waiting areas.',
    question: 'What is the primary mode of Mycobacterium tuberculosis transmission in human populations?',
    options: [
      'Direct skin contact or contaminated surface fomites',
      'Inhalation of airborne droplet nuclei (1 to 5 microns in size) suspended in air currents',
      'Ingestion of contaminated municipal drinking water',
      'Blood-borne transmission via routine phlebotomy'
    ],
    correctIndex: 1,
    clinicalInsight: 'TB is transmitted via microscopic airborne droplet nuclei (1–5 µm) that remain suspended in room air currents and penetrate into terminal alveoli.',
    whyRationale: 'TB is not spread through surface fomites, contaminated food/water, or routine blood contact; airborne aerosol inhalation is the primary route.',
    marks: 10,
    xp: 20,
    ladderTo: 89
  },
  {
    id: 't18',
    questionNumber: 18,
    squareNumber: 74, // Snake Trap 74 -> 52
    category: 'exposure',
    categoryLabel: 'Infection Prevention',
    patientClue: 'Clinical staff prepare for bedside aerosol-generating procedures in a patient with 3+ sputum smear positivity in an airborne isolation ward.',
    question: 'Healthcare workers providing care to infectious pulmonary TB patients in airborne isolation rooms should wear which respiratory protection?',
    options: [
      'Simple loose cloth dust mask',
      'Properly fitted N95 / FFP2 particulate respirator',
      'Standard 3-ply surgical paper mask',
      'Transparent plastic face shield without a mask'
    ],
    correctIndex: 1,
    clinicalInsight: 'Certified N95/FFP2 particulate respirators achieve a facial seal and filter ≥ 95% of airborne particles down to 0.3 µm, preventing droplet nuclei inhalation.',
    whyRationale: 'Surgical and cloth masks allow lateral air leakage and lack micro-filter efficiency against sub-5-micron infectious nuclei suspended in ambient airflow.',
    marks: 10,
    xp: 20,
    snakeTo: 52
  },
  {
    id: 't19',
    questionNumber: 19,
    squareNumber: 78, // Ladder 78 -> 95
    category: 'clinicalReasoning',
    categoryLabel: 'Prioritizing Clues',
    patientClue: 'A patient with cough for 3 weeks and evening chills mentions that his favourite football team won yesterday and his red motorcycle broke down.',
    question: 'Which information cluster should the examining clinician prioritize as medically relevant for pulmonary TB evaluation?',
    options: [
      'The football match score and victory margin',
      'Persistent cough for 3 weeks and evening fever chills',
      'The mechanical breakdown and brand of the motorcycle',
      'The colour of the jersey the patient wore to the clinic'
    ],
    correctIndex: 1,
    clinicalInsight: 'Clinical reasoning requires prioritizing clinical signs that alter disease probability rather than engaging non-contributory conversational trivia.',
    whyRationale: 'Sports results, apparel, and vehicles provide zero biological insight into pulmonary pathophysiology. Experienced clinicians filter out background noise.',
    marks: 10,
    xp: 20,
    ladderTo: 95
  },
  {
    id: 't20',
    questionNumber: 20,
    squareNumber: 83,
    category: 'clinicalClues',
    categoryLabel: 'CNS Analysis',
    patientClue: 'A diagnostic lumbar puncture is performed in an obtunded patient with subacute headache, neck stiffness, and cranial neuropathy suspicious for CNS TB.',
    question: 'In Tuberculous Meningitis, examination of Cerebrospinal Fluid (CSF) characteristically reveals:',
    options: [
      'Marked neutrophilic dominance, low protein, and high glucose',
      'Lymphocytic pleocytosis, markedly elevated protein, and low CSF/blood glucose ratio (<0.3)',
      'Completely normal protein, clear fluid, and zero leukocytes',
      'Purely bloody fluid with normal glucose and protein'
    ],
    correctIndex: 1,
    clinicalInsight: 'TB CSF exhibits exudative basilar inflammation: clear/cobweb appearance, lymphocytic pleocytosis (100–500 cells/µL), high protein (>100 mg/dL), and low glucose.',
    whyRationale: 'Neutrophilic predominance characterizes pyogenic bacterial meningitis, while viral meningitis features normal glucose levels.',
    marks: 10,
    xp: 20
  },

  // =========================================================================
  // ZONE 4: ADVANCED (Squares 86–99) — Focus: Presumptive TB & Reasoning (4 Questions)
  // =========================================================================
  {
    id: 't21',
    questionNumber: 21,
    squareNumber: 88, // Snake Trap 88 -> 66
    category: 'clinicalReasoning',
    categoryLabel: 'Drug Counseling',
    patientClue: 'A distressed patient visits emergency triage reporting that after starting first-line ATT, their urine, saliva, and tears have turned orange-red.',
    question: 'Harmless red-orange coloration of urine, sweat, saliva, and tears is a characteristic benign side effect of which anti-TB medication?',
    options: [
      'Rifampicin',
      'Isoniazid',
      'Pyrazinamide',
      'Ethambutol'
    ],
    correctIndex: 0,
    clinicalInsight: 'Rifampicin is an intensely colored macrocyclic antibiotic whose lipid-soluble metabolites impart a harmless orange-red tint to all body fluids.',
    whyRationale: 'Isoniazid and Pyrazinamide do not pigment excretions. Anticipatory patient counseling prevents premature discontinuation of this critical bactericidal drug.',
    marks: 10,
    xp: 20,
    snakeTo: 66
  },
  {
    id: 't22',
    questionNumber: 22,
    squareNumber: 91,
    category: 'patientHistory',
    categoryLabel: 'Clinical Documentation',
    patientClue: 'During clinical documentation of a patient with chronic respiratory complaints, several lifestyle and medical observations are recorded.',
    question: 'Which documented items represent essential diagnostic elements for evaluating presumptive tuberculosis?',
    options: [
      'Shoe size, favourite holiday destination, and musical instrument preference',
      'Cough duration, constitutional B-symptoms, and prior anti-TB drug exposure',
      'Daily public transit route and favourite radio station only',
      'Clothing color coordination and leisure hobby details'
    ],
    correctIndex: 1,
    clinicalInsight: 'Detailed clinical history taking isolates essential diagnostic clues (symptom duration, constitutional signs, past treatment) from lifestyle trivia.',
    whyRationale: 'Personal leisure preferences and shoe size have zero pathophysiological connection to airborne mycobacterial infection or treatment response.',
    marks: 10,
    xp: 20
  },
  {
    id: 't23',
    questionNumber: 23,
    squareNumber: 94,
    category: 'clinicalReasoning',
    categoryLabel: 'Neuroprotection',
    patientClue: 'A patient on daily first-line ATT reports progressive tingling, burning pain, and numbness in both feet. The doctor notes Pyridoxine was omitted.',
    question: 'Pyridoxine (Vitamin B6) supplementation is routinely co-prescribed with Isoniazid to prevent which adverse drug reaction?',
    options: [
      'Peripheral neuropathy / paresthesia',
      'Retrobulbar optic neuritis',
      'Acute gouty arthritis of the great toe',
      'Red-orange discoloration of tears and sweat'
    ],
    correctIndex: 0,
    clinicalInsight: 'Isoniazid competitively inhibits pyridoxine kinase and accelerates urinary excretion of B6; daily pyridoxine (10–50 mg) prevents debilitating peripheral neuropathy.',
    whyRationale: 'Optic neuritis is an adverse effect of Ethambutol, gout stems from Pyrazinamide-induced hyperuricemia, and red-orange fluids are caused by Rifampicin.',
    marks: 10,
    xp: 20
  },
  {
    id: 't24',
    questionNumber: 24,
    squareNumber: 97,
    category: 'presumptiveTB',
    categoryLabel: 'Presumptive Definition',
    patientClue: 'A primary health clinic triage nurse reviews an adult presenting with persistent cough for 16 days, evening fever, and night sweats.',
    question: 'What is the precise clinical meaning of the term "Presumptive TB" under national and international guidelines?',
    options: [
      'The patient is 100% confirmed to have multidrug-resistant TB requiring immediate toxic injectables',
      'An individual presenting with symptoms or signs suggestive of TB who requires systematic diagnostic evaluation',
      'A patient who has completed all treatment and is officially declared cured',
      'A patient with guaranteed non-infectious viral bronchitis needing no lab tests'
    ],
    correctIndex: 1,
    clinicalInsight: 'Presumptive TB is an investigative entry point, NOT a diagnosis. Upfront molecular testing (CBNAAT) and chest X-ray are required to confirm disease.',
    whyRationale: 'Presumptive symptoms mandate diagnostic evaluation; declaring confirmed TB or prescribing therapy without testing violates clinical governance.',
    marks: 10,
    xp: 20
  },

  // =========================================================================
  // SQUARE 100: GRAND FINALE (Question #25)
  // =========================================================================
  {
    id: 't25',
    questionNumber: 25,
    squareNumber: 100, // Grand Finale: Square 100
    category: 'presumptiveTB',
    categoryLabel: 'Grand Finale — Treatment Pathway',
    patientClue: 'GRAND FINALE CASE: A 46-year-old schoolteacher presents with 4 weeks of productive cough, evening fever, drenching night sweats, and 5 kg weight loss. His brother was treated for smear-positive pulmonary TB 3 months ago.',
    question: 'Synthesizing the prolonged cough, classic constitutional B-symptoms, and intimate household exposure, what is the mandatory immediate clinical management pathway?',
    options: [
      'Prescribe 3 consecutive rounds of broad-spectrum empiric antibiotics and wait 3 months',
      'Categorize as Presumptive Pulmonary TB and immediately perform upfront rapid molecular testing (CBNAAT/TrueNat) and Chest X-Ray',
      'Reassure the patient with cough lozenges because the fever is low-grade',
      'Declare confirmed Extensively Drug-Resistant TB and start toxic injectables without lab testing'
    ],
    correctIndex: 1,
    clinicalInsight: 'High clinical suspicion mandates rapid upfront molecular testing (CBNAAT) and chest radiography to achieve early microbiological diagnosis and drug susceptibility profiling.',
    whyRationale: 'Empiric antibiotic delays cause severe clinical worsening and ongoing community transmission, while toxic drug therapy without microbiological proof violates clinical safety standards.',
    marks: 30,
    xp: 100
  }
];

// Helper to look up challenge by square
export function getChallengeForSquareNumber(square: number): Level1ClinicalQuestion | undefined {
  return LEVEL1_25_CLINICAL_QUESTIONS.find(q => q.squareNumber === square);
}

// Helper to get challenge by ID
export function getChallengeById(id: string): Level1ClinicalQuestion | undefined {
  return LEVEL1_25_CLINICAL_QUESTIONS.find(q => q.id === id);
}

// Category breakdown counters
export const CATEGORY_TOTALS: Record<ChallengeCategory, number> = {
  symptoms: 7,
  clinicalClues: 4,
  riskFactors: 4,
  patientHistory: 3,
  exposure: 2,
  clinicalReasoning: 3,
  presumptiveTB: 2
};

export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  symptoms: 'Symptoms',
  clinicalClues: 'Clinical Clues',
  riskFactors: 'Risk Factors',
  patientHistory: 'History',
  exposure: 'TB Exposure',
  clinicalReasoning: 'Clinical Reasoning',
  presumptiveTB: 'Presumptive TB'
};
