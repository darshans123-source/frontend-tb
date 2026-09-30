import { BoardSquare, SnakeLadderChallenge, ChallengeCategory, LearnerStage } from '../types/snakeLadder';

export const LADDERS: Record<number, number> = {
  4: 16,
  9: 22,
  12: 32,
  25: 46,
  37: 63,
  54: 76,
  69: 89,
  78: 95
};

export const SNAKES: Record<number, number> = {
  28: 10,
  44: 22,
  62: 40,
  74: 52,
  88: 66,
  96: 72
};

export function getLearnerStage(squareNumber: number): LearnerStage {
  if (squareNumber <= 30) return 'TB Learner';
  if (squareNumber <= 60) return 'TB Clue Finder';
  if (squareNumber <= 85) return 'TB Investigator';
  return 'TB Awareness Champion';
}

export function getLearnerStageDetails(stage: LearnerStage) {
  switch (stage) {
    case 'TB Learner':
      return {
        stage,
        range: 'Squares 1–30',
        badge: '🧑‍🎓',
        color: 'from-sky-500 to-cyan-600',
        textColor: 'text-sky-600',
        bgLight: 'bg-sky-50',
        border: 'border-sky-300',
        focus: 'Cardinal TB Symptoms & Baseline Awareness'
      };
    case 'TB Clue Finder':
      return {
        stage,
        range: 'Squares 31–60',
        badge: '🔍',
        color: 'from-teal-500 to-emerald-600',
        textColor: 'text-teal-600',
        bgLight: 'bg-teal-50',
        border: 'border-teal-300',
        focus: 'Epidemiological Exposure & TB Risk Factors'
      };
    case 'TB Investigator':
      return {
        stage,
        range: 'Squares 61–85',
        badge: '🩺',
        color: 'from-blue-600 to-indigo-700',
        textColor: 'text-indigo-600',
        bgLight: 'bg-indigo-50',
        border: 'border-indigo-300',
        focus: 'Clinical Clustering & Distractor Filtering'
      };
    case 'TB Awareness Champion':
      return {
        stage,
        range: 'Squares 86–100',
        badge: '🛡️',
        color: 'from-amber-500 to-blue-700',
        textColor: 'text-amber-600',
        bgLight: 'bg-amber-50',
        border: 'border-amber-300',
        focus: 'Presumptive TB Protocol & Diagnostic Pathway'
      };
  }
}

// 100 Board Squares Generation with diverse, educational square types
export const BOARD_SQUARES: BoardSquare[] = Array.from({ length: 100 }, (_, index) => {
  const num = index + 1;
  const zone: 1 | 2 | 3 | 4 = num <= 30 ? 1 : num <= 60 ? 2 : num <= 85 ? 3 : 4;

  // Final Square
  if (num === 100) {
    return {
      number: 100,
      type: 'final',
      label: 'Square 100 • 🏆 Grand Finale',
      zone: 4,
      category: 'presumptiveTB'
    };
  }

  // Ladders
  if (LADDERS[num]) {
    return {
      number: num,
      type: 'ladder',
      label: `Square ${num} • 🪜 Ladder (+Climb to ${LADDERS[num]})`,
      ladderTo: LADDERS[num],
      zone,
      category: num <= 30 ? 'symptoms' : num <= 60 ? 'riskFactors' : 'clinicalReasoning'
    };
  }

  // Snakes
  if (SNAKES[num]) {
    return {
      number: num,
      type: 'snake',
      label: `Square ${num} • 🐍 Snake Trap (Slides to ${SNAKES[num]})`,
      snakeTo: SNAKES[num],
      zone,
      category: 'clinicalReasoning'
    };
  }

  // Rapid Challenges (5-second quick reflex)
  if ([8, 20, 35, 50, 65, 82, 92].includes(num)) {
    return {
      number: num,
      type: 'rapid',
      label: `Square ${num} • ⚡ Rapid Challenge`,
      zone,
      category: num <= 30 ? 'symptoms' : num <= 60 ? 'exposure' : 'presumptiveTB'
    };
  }

  // TB Clue Squares
  if ([6, 15, 23, 34, 42, 57, 67, 80, 90].includes(num)) {
    return {
      number: num,
      type: 'tb-clue',
      label: `Square ${num} • 🔵 TB Clue`,
      zone,
      category: 'clinicalClues'
    };
  }

  // Risk Factor Squares
  if ([11, 27, 39, 49, 60, 75, 87].includes(num)) {
    return {
      number: num,
      type: 'risk-factor',
      label: `Square ${num} • 🟡 Risk Factor`,
      zone,
      category: 'riskFactors'
    };
  }

  // Exposure Squares
  if ([17, 31, 47, 58, 70, 85, 94].includes(num)) {
    return {
      number: num,
      type: 'exposure',
      label: `Square ${num} • 🟣 Exposure Inquiry`,
      zone,
      category: 'exposure'
    };
  }

  // Clinical Reasoning Squares
  if ([19, 33, 45, 64, 73, 83, 93].includes(num)) {
    return {
      number: num,
      type: 'clinical-reasoning',
      label: `Square ${num} • 🟠 Clinical Reasoning`,
      zone,
      category: 'clinicalReasoning'
    };
  }

  // Bonus Squares
  if ([9, 24, 41, 55, 77, 91].includes(num)) {
    return {
      number: num,
      type: 'bonus',
      label: `Square ${num} • ⭐ Bonus Opportunity`,
      zone,
      category: 'patientHistory'
    };
  }

  // Learning Squares (Micro-learning pearls without quiz penalty)
  if ([3, 7, 14, 22, 30, 38, 48, 59, 68, 79, 86, 97].includes(num)) {
    const pearls: Record<number, { title: string; content: string; clinicalTip: string }> = {
      3: {
        title: 'Prolonged Cough (> 2 Weeks)',
        content: 'Under national guidelines, cough persisting for two weeks or more is the primary clinical entry point triggering presumptive pulmonary TB evaluation.',
        clinicalTip: 'Always inquire about the exact duration of cough.'
      },
      7: {
        title: 'Evening Rise of Temperature',
        content: 'Low-grade fever typically rising in the late afternoon or evening and associated with night chills is a classical constitutional clue for tuberculosis.',
        clinicalTip: 'Ask if fever is accompanied by drenching bedclothes at night.'
      },
      14: {
        title: 'Haemoptysis Urgency',
        content: 'Coughing up blood (haemoptysis), even in streaks, warrants prompt radiological and molecular evaluation to rule out active cavitary pulmonary TB.',
        clinicalTip: 'Haemoptysis is a high-priority red flag symptom.'
      },
      22: {
        title: 'Unexplained Weight Loss',
        content: 'Significant unintentional weight loss (> 5% of body weight within 1-3 months) reflects the chronic hypercatabolic state driven by mycobacterial infection.',
        clinicalTip: 'Check previous baseline weight or loose-fitting clothing.'
      },
      30: {
        title: 'Zone 1 Milestone: Learner Badge Earned',
        content: 'You have mastered the foundational constitutional symptoms of TB: prolonged cough, evening fever, night sweats, anorexia, and weight loss.',
        clinicalTip: 'Next zone: Uncovering TB exposure and epidemiological risk factors.'
      },
      38: {
        title: 'Household Contact Vulnerability',
        content: 'Close household contacts sharing indoor sleeping quarters with an infectious pulmonary TB patient face the highest secondary transmission risk.',
        clinicalTip: 'Screen all household members, especially young children and elders.'
      },
      48: {
        title: 'HIV & Immunosuppression',
        content: 'HIV co-infection multiplies the risk of progression from latent infection to active TB disease by 20 to 30 times due to CD4+ T-cell depletion.',
        clinicalTip: 'All presumptive TB patients should receive provider-initiated HIV testing.'
      },
      59: {
        title: 'Diabetes as a Multiplier',
        content: 'Poorly controlled diabetes mellitus impairs innate and cell-mediated immunity, increasing TB risk threefold and complicating treatment outcomes.',
        clinicalTip: 'Routinely check HbA1c in newly diagnosed adult TB patients.'
      },
      68: {
        title: 'Zone 2 Milestone: Clue Finder Mastery',
        content: 'You can now identify major TB risk factors: contact history, immunocompromise, diabetes, smoking, and previous incomplete treatment.',
        clinicalTip: 'Next zone: Synthesizing complex multi-clue clinical clusters.'
      },
      79: {
        title: 'Filtering the "Red Herrings"',
        content: 'Patients often report coincidental details like eye color, favorite foods, or minor aches. Expert clinicians isolate only TB-relevant epidemiological clusters.',
        clinicalTip: 'Never allow irrelevant lifestyle trivia to distract from diagnostic signs.'
      },
      86: {
        title: 'Presumptive TB Definition',
        content: 'Presumptive TB refers to an individual with symptoms or signs suggestive of TB. It indicates the need for diagnostic evaluation, NOT a final diagnosis.',
        clinicalTip: 'Symptoms raise suspicion; laboratory microbiology confirms.'
      },
      97: {
        title: 'Upfront Molecular Testing',
        content: 'Under NTEP guidelines, rapid molecular testing (CBNAAT / TrueNat) is prioritized upfront for all presumptive TB cases to detect MTB and Rifampicin resistance simultaneously.',
        clinicalTip: 'CBNAAT provides results within 2 hours, saving lives.'
      }
    };

    return {
      number: num,
      type: 'learning',
      label: `Square ${num} • 🟢 Clinical Pearl`,
      zone,
      category: num <= 30 ? 'symptoms' : num <= 60 ? 'riskFactors' : 'presumptiveTB',
      microPearl: pearls[num] || {
        title: 'Clinical Awareness Pearl',
        content: 'Thorough clinical history taking and high index of suspicion are the cornerstones of early tuberculosis detection.',
        clinicalTip: 'Think TB early in chronic respiratory presentations.'
      }
    };
  }

  // Normal Walking Squares
  return {
    number: num,
    type: 'normal',
    label: `Square ${num} • Steady Step`,
    zone
  };
});

// Comprehensive Question Bank mapped to the 7 required categories
export const SNAKE_LADDER_CHALLENGES: SnakeLadderChallenge[] = [
  // =========================================================================
  // ZONE 1: EASY (Squares 1-30) — Focus: Symptoms & Baseline TB Clues
  // =========================================================================
  {
    id: 'c_sym_1',
    category: 'symptoms',
    difficulty: 'easy',
    type: 'tb-clue',
    title: 'Primary Pulmonary TB Clue',
    question: 'Which of the following symptoms should raise the strongest initial suspicion for pulmonary tuberculosis in an adult patient?',
    options: [
      'Cough persisting for more than 2 weeks with evening fever',
      'Acute sudden sneezing for 2 hours',
      'Mild localized knee ache after climbing stairs',
      'Transient morning eye dryness'
    ],
    correctIndex: 0,
    learning: 'A persistent cough lasting 2 weeks or longer, particularly when accompanied by evening fever, is the cardinal symptom warranting presumptive TB evaluation.',
    whyOthersNotAppropriate: 'Acute sneezing, localized joint discomfort, and eye dryness are transient or localized issues that do not suggest lower respiratory mycobacterial disease.',
    explanation: 'NTEP and WHO guidelines emphasize persistent cough (≥ 2 weeks) as the primary clinical threshold for investigating presumptive pulmonary tuberculosis.',
    xp: 20
  },
  {
    id: 'c_sym_2',
    category: 'symptoms',
    difficulty: 'easy',
    type: 'rapid',
    title: 'Rapid Fire: Cough Duration',
    question: 'Can a cough persisting for more than 2 weeks be an important clinical clue when considering pulmonary tuberculosis?',
    options: ['YES — High clinical suspicion', 'NO — It is completely harmless'],
    correctIndex: 0,
    learning: 'Chronic cough lasting 14 days or more is a key red flag symptom for pulmonary TB and must never be ignored.',
    whyOthersNotAppropriate: 'Dismissing chronic cough as harmless delays critical diagnosis and allows ongoing airborne transmission in the community.',
    explanation: 'Cough ≥ 2 weeks requires sputum examination and chest radiography.',
    xp: 20,
    isRapid: true,
    timeLimitSeconds: 5
  },
  {
    id: 'c_lad_1',
    category: 'symptoms',
    difficulty: 'easy',
    type: 'ladder',
    title: '🪜 Ladder Opportunity: Square 4 → 16',
    question: 'Persistent cough is an important TB clue. Which clinical statement is most appropriate?',
    options: [
      'Prolonged cough can raise suspicion of pulmonary TB and warrants diagnostic assessment',
      'Any cough confirms drug-resistant TB instantly without testing',
      'Cough only matters if the patient has a red motorcycle',
      'Cough is completely unrelated to pulmonary disease'
    ],
    correctIndex: 0,
    learning: 'Persistent cough raises suspicion of pulmonary TB; it guides clinicians to order sputum CBNAAT and chest radiography.',
    whyOthersNotAppropriate: 'Cough alone never confirms drug resistance without testing, and unrelated lifestyle items like vehicles have no diagnostic bearing.',
    explanation: 'Clinical suspicion initiates the diagnostic pathway; confirmation requires laboratory microbiological evaluation.',
    xp: 20,
    ladderTo: 16
  },
  {
    id: 'c_sym_3',
    category: 'symptoms',
    difficulty: 'easy',
    type: 'tb-clue',
    title: 'Constitutional Symptoms Cluster',
    question: 'A 29-year-old student reports drenching night sweats, loss of appetite, and unintentional 5 kg weight loss over the past month. How should this presentation be interpreted?',
    options: [
      'Classic constitutional symptoms that can indicate presumptive TB',
      'Normal physical adaptation to studying',
      'Definitive confirmation of fungal pneumonia',
      'Complete absence of medical concern'
    ],
    correctIndex: 0,
    learning: 'Night sweats, anorexia, and unexplained weight loss are classic "B symptoms" that strongly support clinical suspicion for tuberculosis.',
    whyOthersNotAppropriate: 'Attributing severe involuntary weight loss and drenching night sweats to normal study habits is dangerous and misses chronic systemic infections.',
    explanation: 'Constitutional symptoms reflect systemic cytokine release (TNF-alpha, IL-1) provoked by active Mycobacterium tuberculosis proliferation.',
    xp: 20
  },
  {
    id: 'c_snk_1',
    category: 'clinicalReasoning',
    difficulty: 'easy',
    type: 'snake',
    title: '🐍 Snake Hazard: Square 28 → 10',
    question: 'A patient presents with persistent cough for 3 weeks, low-grade evening fever, and mentions their favorite football team won yesterday. Which information should the clinician prioritize?',
    options: [
      'Persistent cough for 3 weeks and evening fever',
      'The football team match result and score',
      'Color of the jersey worn to the clinic',
      'The brand of shoe the patient purchased'
    ],
    correctIndex: 0,
    learning: 'Clinical reasoning requires prioritizing clinical signs that alter disease probability rather than engaging non-contributory conversational trivia.',
    whyOthersNotAppropriate: 'Sports results and apparel details provide zero biological insight into pulmonary pathophysiology.',
    explanation: 'Focused medical history taking separates essential clinical clues from harmless background chit-chat.',
    xp: 20,
    snakeTo: 10
  },
  {
    id: 'c_bon_1',
    category: 'patientHistory',
    difficulty: 'easy',
    type: 'bonus',
    title: '⭐ Bonus Vignette: Haemoptysis Check',
    question: 'A 38-year-old factory worker reports blood-streaked sputum along with fever and cough. What is the immediate clinical implication?',
    options: [
      'Promptly consider pulmonary TB and order urgent molecular sputum testing & CXR',
      'Advise drinking cold water and send home without evaluation',
      'Prescribe throat lozenges and ignore the bleeding',
      'Reassure that blood in sputum is completely normal'
    ],
    correctIndex: 0,
    learning: 'Haemoptysis in an adult with chronic cough is an alarming sign of parenchymal lung destruction (such as a tuberculous cavity) requiring immediate diagnostic investigation.',
    whyOthersNotAppropriate: 'Trivializing hemoptysis with lozenges or water delays diagnosis of potentially life-threatening cavitary disease or vascular erosion.',
    explanation: 'Haemoptysis mandates immediate chest radiography and sputum CBNAAT under NTEP diagnostic algorithms.',
    xp: 30,
    bonusSteps: 2
  },

  // =========================================================================
  // ZONE 2: MEDIUM (Squares 31-60) — Focus: Exposure & Risk Factors
  // =========================================================================
  {
    id: 'c_exp_1',
    category: 'exposure',
    difficulty: 'medium',
    type: 'exposure',
    title: 'Household Contact History',
    patientScenario: {
      age: 24,
      gender: 'Female',
      complaint: 'Cough for 18 days and fatigue',
      duration: '18 days',
      details: 'Her father was treated for sputum smear-positive pulmonary TB 4 months ago.'
    },
    question: 'Why is her father\'s recent history of sputum-positive pulmonary TB clinically crucial?',
    options: [
      'Close household contact with an infectious TB case significantly elevates the probability of transmission',
      'TB is strictly genetic and cannot spread through household air',
      'Family history is completely irrelevant in infectious disease history',
      'Contact history proves she already has multidrug resistance'
    ],
    correctIndex: 0,
    learning: 'Close household contact with an infectious pulmonary TB case is one of the highest epidemiological risk factors for secondary transmission via airborne droplet nuclei.',
    whyOthersNotAppropriate: 'TB is an airborne bacterial infection, not a hereditary genetic disorder. Contact history indicates exposure suspicion, not guaranteed drug resistance.',
    explanation: 'Under NTEP guidelines, household contacts of pulmonary TB patients must be actively screened for presumptive symptoms.',
    xp: 20
  },
  {
    id: 'c_lad_2',
    category: 'riskFactors',
    difficulty: 'medium',
    type: 'ladder',
    title: '🪜 Ladder Opportunity: Square 37 → 63',
    question: 'A patient with chronic cough has several personal details recorded. Which history is clinically most important?',
    options: [
      'Household contact with a known active pulmonary TB patient',
      'Shoe size and favorite color',
      'Preferred musical instrument',
      'Favorite holiday destination'
    ],
    correctIndex: 0,
    learning: 'TB exposure history provides indispensable epidemiological context that directly elevates pre-test suspicion for tuberculosis.',
    whyOthersNotAppropriate: 'Personal leisure preferences and shoe size have zero pathophysiological connection to airborne Mycobacterium exposure.',
    explanation: 'Detailed exposure history guides targeted clinical suspicion and rapid investigation.',
    xp: 20,
    ladderTo: 63
  },
  {
    id: 'c_risk_1',
    category: 'riskFactors',
    difficulty: 'medium',
    type: 'risk-factor',
    title: 'HIV Co-infection Impact',
    question: 'Which underlying medical condition poses the highest biological risk factor for progression from latent TB infection to active clinical TB disease?',
    options: [
      'HIV infection causing CD4+ T-cell depletion',
      'Mild seasonal allergic rhinitis',
      'Corrected mild myopia (nearsightedness)',
      'Occasional motion sickness'
    ],
    correctIndex: 0,
    learning: 'HIV infection depletes CD4+ T-lymphocytes, multiplying the risk of active tuberculosis development by 20 to 30 times compared to immunocompetent persons.',
    whyOthersNotAppropriate: 'Myopia, motion sickness, and allergic rhinitis do not impair cell-mediated mycobacterial immune surveillance.',
    explanation: 'Cell-mediated immunity is essential for containing tubercle bacilli within granulomas; HIV impairs this defense mechanism.',
    xp: 20
  },
  {
    id: 'c_rap_2',
    category: 'exposure',
    difficulty: 'medium',
    type: 'rapid',
    title: '⚡ Rapid Fire: Mode of Transmission',
    question: 'Is Mycobacterium tuberculosis primarily transmitted from person to person through microscopic airborne droplet nuclei?',
    options: ['YES — Airborne droplet nuclei', 'NO — Contaminated municipal tap water'],
    correctIndex: 0,
    learning: 'Tuberculosis spreads through microscopic airborne droplet nuclei (1–5 microns) expelled during coughing, sneezing, or speaking.',
    whyOthersNotAppropriate: 'TB is an airborne respiratory infection, not a waterborne gastrointestinal infection.',
    explanation: 'Droplet nuclei remain suspended in ambient indoor air and reach terminal alveoli when inhaled.',
    xp: 20,
    isRapid: true,
    timeLimitSeconds: 5
  },
  {
    id: 'c_snk_2',
    category: 'clinicalReasoning',
    difficulty: 'medium',
    type: 'snake',
    title: '🐍 Snake Trap: Square 44 → 22',
    question: 'A 45-year-old diabetic patient presents with chronic cough, evening chills, and weight loss. The junior intern states: "Diabetics never get TB; it is just a routine winter cold." What is the error?',
    options: [
      'Diabetes impairs immune defense, increasing active TB risk threefold; dismissing chronic symptoms risks severe disease',
      'The intern is correct; diabetes completely protects against all bacterial infections',
      'Diabetics only develop skin allergies, never lung conditions',
      'TB only occurs in infants under 1 year of age'
    ],
    correctIndex: 0,
    learning: 'Diabetes mellitus is a recognized major TB risk factor that triples disease susceptibility and impairs phagocytic bacterial clearance.',
    whyOthersNotAppropriate: 'Assuming diabetes protects against infection is factually backwards; immunocompromised hosts are at vastly increased risk.',
    explanation: 'NTEP mandates bidirectional screening: all TB patients are tested for diabetes, and symptomatic diabetics are screened for TB.',
    xp: 20,
    snakeTo: 22
  },
  {
    id: 'c_hist_1',
    category: 'patientHistory',
    difficulty: 'medium',
    type: 'bonus',
    title: '⭐ Bonus Square: Past TB Treatment History',
    patientScenario: {
      age: 52,
      gender: 'Male',
      complaint: 'Recurrent cough and hemoptysis',
      duration: '4 weeks',
      details: 'Patient took 2 months of anti-TB drugs three years ago but discontinued therapy early because he felt better.'
    },
    question: 'Why is a past history of incomplete anti-TB treatment clinically significant?',
    options: [
      'Prior incomplete treatment creates a high risk for treatment failure and acquired drug resistance (e.g. Rifampicin resistance)',
      'Previous medicines grant lifetime absolute immunity regardless of duration',
      'Past history should be ignored if more than 1 year has elapsed',
      'Stopping early has zero consequence on mycobacterial survival'
    ],
    correctIndex: 0,
    learning: 'Previous incomplete or irregular anti-TB therapy is the single strongest clinical predictor for acquired drug resistance (such as MDR-TB).',
    whyOthersNotAppropriate: 'Incomplete therapy selects for drug-resistant bacterial mutants; it does not confer immunity or disappear harmlessly.',
    explanation: 'All previously treated patients with presumptive TB require upfront molecular testing (CBNAAT) to check Rifampicin resistance immediately.',
    xp: 30,
    bonusSteps: 2
  },

  // =========================================================================
  // ZONE 3: HARD (Squares 61-85) — Focus: Clinical Clustering & Distractors
  // =========================================================================
  {
    id: 'c_reas_1',
    category: 'clinicalReasoning',
    difficulty: 'hard',
    type: 'clinical-reasoning',
    title: 'Prioritizing Clinical Clusters',
    patientScenario: {
      age: 34,
      gender: 'Male',
      occupation: 'Construction Worker',
      complaint: 'Cough for 3 weeks, evening chills, 6 kg weight loss',
      duration: '3 weeks',
      details: 'Patient lives in a crowded dormitory, has a red motorcycle, and prefers tea over coffee.'
    },
    question: 'Which cluster of findings should the clinician prioritize as clinically relevant for TB suspicion?',
    options: [
      'Persistent cough + evening chills + weight loss + crowded living conditions',
      'Red motorcycle + preference for tea over coffee',
      'Occupation as construction worker + motorcycle brand',
      'Only the tea preference and shoe color'
    ],
    correctIndex: 0,
    learning: 'Focus on biologically and epidemiologically relevant clusters (respiratory symptoms + constitutional signs + crowded exposure) while discarding non-medical lifestyle trivia.',
    whyOthersNotAppropriate: 'Motorcycles, favorite beverages, and apparel are red herrings with zero clinical utility for disease probability.',
    explanation: 'Experienced clinicians filter noise to synthesize a high-yield diagnostic problem representation.',
    xp: 25
  },
  {
    id: 'c_snk_3',
    category: 'clinicalReasoning',
    difficulty: 'hard',
    type: 'snake',
    title: '🐍 Snake Trap: Square 62 → 40',
    question: 'A patient has 4 weeks of productive cough, night sweats, and recent close contact with a smear-positive sibling. The clinician focuses the entire consultation on discussing the patient\'s hobby of stamp collecting. What happened?',
    options: [
      'The clinician was distracted by irrelevant personal details, missing the critical TB clinical cluster',
      'Stamp collecting is a known vector for Mycobacterium tuberculosis transmission',
      'The clinician acted in full accordance with NTEP diagnostic priorities',
      'Hobbies should always take priority over respiratory symptoms'
    ],
    correctIndex: 0,
    learning: 'Clinical reasoning requires recognizing when conversational trivia is diverting focus away from serious clinical warning signs.',
    whyOthersNotAppropriate: 'Paper stamps do not harbor or transmit airborne mycobacteria. Failing to address productive cough and contact history delays urgent care.',
    explanation: 'Avoid cognitive distraction; keep investigative focus centered on the patient\'s clinical chief complaints.',
    xp: 20,
    snakeTo: 40
  },
  {
    id: 'c_lad_3',
    category: 'clinicalClues',
    difficulty: 'hard',
    type: 'ladder',
    title: '🪜 Ladder Opportunity: Square 69 → 89',
    question: 'Which diagnostic tool is recommended as the upfront molecular test for rapid diagnosis of TB and detection of Rifampicin resistance?',
    options: [
      'CBNAAT (Cartridge Based Nucleic Acid Amplification Test / Xpert MTB/RIF)',
      'Plain abdominal ultrasound',
      'Routine urine dipstick test',
      'Serum lipid profile'
    ],
    correctIndex: 0,
    learning: 'CBNAAT (Xpert MTB/RIF) is the primary rapid diagnostic assay that simultaneously detects Mycobacterium tuberculosis and Rifampicin resistance within 2 hours.',
    whyOthersNotAppropriate: 'Abdominal ultrasound, urine dipsticks, and lipid panels cannot detect pulmonary mycobacterial DNA or drug resistance mutations.',
    explanation: 'NTEP guidelines prioritize upfront molecular testing over smear microscopy alone.',
    xp: 25,
    ladderTo: 89
  },
  {
    id: 'c_rap_3',
    category: 'clinicalReasoning',
    difficulty: 'hard',
    type: 'rapid',
    title: '⚡ Rapid Fire: Presumptive Diagnosis',
    question: 'Do clinical symptoms and positive contact history alone definitively prove that a patient has confirmed tuberculosis without laboratory or radiological testing?',
    options: [
      'NO — They create suspicion (Presumptive TB); confirmation requires diagnostic testing',
      'YES — Symptoms alone provide 100% microbiological confirmation'
    ],
    correctIndex: 0,
    learning: 'Presumptive TB ≠ Confirmed TB. Symptoms establish clinical suspicion, but definitive diagnosis requires microbiological or radiological evaluation.',
    whyOthersNotAppropriate: 'Other respiratory conditions can mimic TB symptoms; testing is essential to confirm the organism and rule out alternative etiologies.',
    explanation: 'Premature diagnostic closure without lab verification leads to inappropriate treatment.',
    xp: 20,
    isRapid: true,
    timeLimitSeconds: 5
  },
  {
    id: 'c_bon_2',
    category: 'clinicalClues',
    difficulty: 'hard',
    type: 'bonus',
    title: '⭐ Bonus Vignette: Extrapulmonary Clues',
    patientScenario: {
      age: 26,
      gender: 'Female',
      complaint: 'Painless, matted swelling in the right cervical neck region for 6 weeks',
      duration: '6 weeks',
      details: 'Low-grade evening fever, normal chest radiograph.'
    },
    question: 'Painless, matted enlargement of cervical lymph nodes (scrofula) in a young adult should raise suspicion for which form of tuberculosis?',
    options: [
      'Tuberculous Lymphadenitis (Extrapulmonary TB)',
      'Severe acute seasonal influenza',
      'Superficial fungal dermatophytosis',
      'Simple muscular strain of the sternocleidomastoid'
    ],
    correctIndex: 0,
    learning: 'Tuberculous lymphadenitis is the most common manifestation of extrapulmonary TB, characteristically presenting with painless, rubbery or matted cervical adenopathy.',
    whyOthersNotAppropriate: 'Superficial skin fungus and muscle strains do not cause chronic, matted lymphatic node architectural enlargement or evening fevers.',
    explanation: 'Diagnosis is established via Fine Needle Aspiration Cytology (FNAC) and CBNAAT on the aspirate.',
    xp: 30,
    bonusSteps: 2
  },

  // =========================================================================
  // ZONE 4: ADVANCED (Squares 86-99) — Focus: Presumptive TB ≠ Confirmed TB
  // =========================================================================
  {
    id: 'c_pre_1',
    category: 'presumptiveTB',
    difficulty: 'advanced',
    type: 'tb-clue',
    title: 'The Core Principle: Presumptive vs Confirmed',
    patientScenario: {
      age: 44,
      gender: 'Male',
      complaint: 'Productive cough for 3 weeks, evening chills, 4 kg weight loss',
      duration: '3 weeks',
      details: 'His nephew was diagnosed with pulmonary TB 2 months ago.'
    },
    question: 'How should the medical learner categorize this patient at this initial clinical juncture?',
    options: [
      'Presumptive Pulmonary TB requiring appropriate diagnostic evaluation (CBNAAT & CXR)',
      'Confirmed Multidrug-Resistant TB requiring immediate second-line toxic drugs',
      'Completely healthy individual needing no further action',
      'Confirmed lung carcinoma without any diagnostic tests needed'
    ],
    correctIndex: 0,
    learning: 'Compatible clinical symptoms and household exposure create suspicion for PRESUMPTIVE TB; they do NOT confirm TB or establish drug resistance by themselves.',
    whyOthersNotAppropriate: 'Labeling the patient as confirmed MDR-TB or lung cancer without laboratory investigation violates fundamental clinical safety principles.',
    explanation: 'Presumptive TB is a clinical trigger for rapid diagnostic evaluation (sputum CBNAAT + chest X-ray), not a confirmed diagnosis.',
    xp: 25
  },
  {
    id: 'c_lad_4',
    category: 'presumptiveTB',
    difficulty: 'advanced',
    type: 'ladder',
    title: '🪜 Ladder Opportunity: Square 78 → 95',
    question: 'When presumptive pulmonary TB is identified, what is the most appropriate next clinical step according to current diagnostic guidelines?',
    options: [
      'Perform upfront rapid molecular testing (CBNAAT/TrueNat) and Chest X-ray',
      'Prescribe 3 rounds of empiric broad-spectrum antibiotics and wait 3 months',
      'Tell the patient to return only if they collapse',
      'Perform an emergency coronary artery bypass'
    ],
    correctIndex: 0,
    learning: 'Presumptive TB demands prompt, upfront molecular evaluation (CBNAAT/TrueNat) and chest imaging rather than unscientific empiric antibiotic delays.',
    whyOthersNotAppropriate: 'Empiric antibiotic trials delay TB diagnosis by weeks and foster antimicrobial resistance; cardiac surgery is totally irrelevant.',
    explanation: 'NTEP guidelines mandate upfront molecular testing for early, accurate case notification and drug sensitivity profiling.',
    xp: 25,
    ladderTo: 95
  },
  {
    id: 'c_snk_4',
    category: 'presumptiveTB',
    difficulty: 'advanced',
    type: 'snake',
    title: '🐍 Snake Trap: Square 88 → 66',
    question: 'A patient with 3 weeks of cough and night sweats arrives. The doctor says: "You have all the symptoms, so I am writing a confirmed prescription for 24 months of toxic MDR-TB injectable drugs right now without doing any sputum test." What is wrong with this approach?',
    options: [
      'Presumptive symptoms do not establish microbiological confirmation or drug resistance; testing is mandatory before toxic regimens',
      'The doctor is 100% correct because tests are always unnecessary',
      'TB medicines should only be given to people who do not have symptoms',
      'Doctors are never allowed to order laboratory tests'
    ],
    correctIndex: 0,
    learning: 'Never start toxic or specialized drug regimens based on clinical suspicion alone without microbiological or molecular drug-susceptibility confirmation.',
    whyOthersNotAppropriate: 'Exposing a patient to toxic MDR-TB medicines without confirming Rifampicin resistance causes severe unnecessary drug toxicity.',
    explanation: 'Good clinical governance requires diagnostic confirmation before initiating antimicrobial chemotherapy.',
    xp: 20,
    snakeTo: 66
  },
  {
    id: 'c_rap_4',
    category: 'presumptiveTB',
    difficulty: 'advanced',
    type: 'rapid',
    title: '⚡ Rapid Fire: Presumptive TB Concept',
    question: 'Does the clinical term "Presumptive TB" refer to an individual with clinical features suggestive of TB who needs systematic diagnostic evaluation?',
    options: ['YES — Suggestive features needing diagnostic evaluation', 'NO — It means the patient is 100% cured'],
    correctIndex: 0,
    learning: '"Presumptive TB" defines patients who meet clinical screening criteria and must now undergo diagnostic microbiological/radiological tests.',
    whyOthersNotAppropriate: 'Presumptive TB is an active clinical investigation status, not a cured outcome.',
    explanation: 'Standardized terminology ensures systematic case finding in national elimination programs.',
    xp: 20,
    isRapid: true,
    timeLimitSeconds: 5
  },

  // =========================================================================
  // SQUARE 100: GRAND FINALE CHALLENGE
  // =========================================================================
  {
    id: 'c_final_100',
    category: 'presumptiveTB',
    difficulty: 'advanced',
    type: 'final',
    title: '🏆 FINAL TB CHALLENGE • SQUARE 100',
    patientScenario: {
      age: 48,
      gender: 'Male',
      occupation: 'School Teacher',
      complaint: 'Prolonged productive cough for 4 weeks, low-grade evening fever, night sweats, 6 kg weight loss',
      duration: '4 weeks',
      details: 'Patient shares a home with his elder brother who was recently diagnosed with pulmonary tuberculosis.'
    },
    question: 'Synthesizing the clinical history, prolonged symptoms, constitutional signs, and direct household exposure, what must the learner recognize?',
    options: [
      'PRESUMPTIVE TB REQUIRING APPROPRIATE DIAGNOSTIC EVALUATION',
      'No medical concern; symptoms are purely psychological',
      'Confirmed Extensively Drug-Resistant TB without need for lab testing',
      'Simple allergic rhinitis requiring only over-the-counter antihistamines'
    ],
    correctIndex: 0,
    learning: 'Compatible symptoms and exposure create high clinical suspicion for Presumptive TB. Confirmation requires systematic diagnostic evaluation following the 5-step clinical flow.',
    whyOthersNotAppropriate: 'Dismissing chronic productive cough with contact history as psychological or allergic is dangerous, and declaring XDR-TB without molecular testing violates clinical practice standards.',
    explanation: 'The player has demonstrated Level 1 clinical awareness by recognizing presumptive TB and initiating the proper diagnostic cascade.',
    xp: 100
  }
];

// Helper to select an appropriate challenge for a square
export function getChallengeForSquare(
  squareNumber: number,
  visitedSquareSet: Set<number>,
  completedChallengeIds: string[]
): SnakeLadderChallenge {
  // If Square 100, always return the Grand Finale
  if (squareNumber === 100) {
    return SNAKE_LADDER_CHALLENGES.find(c => c.id === 'c_final_100')!;
  }

  const square = BOARD_SQUARES[squareNumber - 1];
  const zone = square.zone;
  const targetDifficulty = zone === 1 ? 'easy' : zone === 2 ? 'medium' : zone === 3 ? 'hard' : 'advanced';

  // Look for challenges matching this square's type and difficulty
  let matching = SNAKE_LADDER_CHALLENGES.filter(c => {
    if (c.id === 'c_final_100') return false;
    if (square.type === 'ladder') return c.type === 'ladder';
    if (square.type === 'snake') return c.type === 'snake';
    if (square.type === 'rapid') return c.isRapid === true;
    if (square.type === 'bonus') return c.type === 'bonus';
    if (square.category && c.category !== square.category) return false;
    return true;
  });

  // Prioritize uncompleted challenges
  const uncompleted = matching.filter(c => !completedChallengeIds.includes(c.id));
  if (uncompleted.length > 0) {
    return uncompleted[Math.floor(Math.random() * uncompleted.length)];
  }

  if (matching.length > 0) {
    return matching[Math.floor(Math.random() * matching.length)];
  }

  // Fallback to any challenge of appropriate difficulty
  const fallback = SNAKE_LADDER_CHALLENGES.filter(c => c.id !== 'c_final_100' && (c.difficulty === targetDifficulty || zone >= 3));
  return fallback[Math.floor(Math.random() * fallback.length)] || SNAKE_LADDER_CHALLENGES[0];
}

// Replay challenges for weak topics
export function getChallengesForWeakTopics(weakCategories: ChallengeCategory[]): SnakeLadderChallenge[] {
  if (weakCategories.length === 0) {
    return SNAKE_LADDER_CHALLENGES.filter(c => c.id !== 'c_final_100').slice(0, 5);
  }
  const filtered = SNAKE_LADDER_CHALLENGES.filter(c => c.id !== 'c_final_100' && weakCategories.includes(c.category));
  return filtered.length > 0 ? filtered : SNAKE_LADDER_CHALLENGES.slice(0, 5);
}
