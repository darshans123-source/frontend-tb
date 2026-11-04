// TB Quest — Level 2 "Investigate & Interpret" content data.
//
// Education only. Every case is a teaching simulation, NOT a real patient
// record. Nothing in this file is faculty-approved: Content_Validated_By is
// "Pending faculty validation" and Validation_Date is "Pending" for every
// item, and the final algorithm must be faculty-validated against current
// NTEP/WHO guidance before classroom use. No real CXR images are embedded;
// CXR patterns are schematic descriptions with a faculty-approved image slot.

export type Topic = 'smear' | 'cbnaat' | 'rif' | 'cxr' | 'extrapulmonary' | 'first-test';

export const TOPIC_LABELS: Record<Topic, string> = {
  smear: 'Smear',
  cbnaat: 'CBNAAT',
  rif: 'Rifampicin resistance',
  cxr: 'Chest X-ray',
  extrapulmonary: 'Extrapulmonary TB',
  'first-test': 'First test',
};

export interface Level2Step {
  question: string;
  options: string[];
  correctIndex: number;
  whyCorrect: string;
  whyWrong: string[];
  keyPoint: string;
  topic: Topic;
}

export interface Level2Case {
  id: string;
  title: string;
  scenario: string;
  age: string;
  category: string;
  investigationType: string;
  investigationResult: string;
  cxrFinding: string;
  report: string;
  steps: [Level2Step, Level2Step];
  difficulty: string;
  tbCategory: string;
  nextNode: string;
  reference: string;
}

export interface Level2Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  whyCorrect: string;
  whyWrong: string[];
  keyPoint: string;
  topic: Topic;
  difficulty: string;
  tbCategory: string;
  nextNode: string;
  reference: string;
}

export interface RapidReport {
  id: string;
  title: string;
  report: string;
  reading: string;
  notMean: string;
  next: string;
  topic: Topic;
}

export interface FirstTestRound {
  id: string;
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  reason: string;
  remember: string;
}

export const VALIDATED_BY = 'Pending faculty validation';
export const VALIDATION_DATE = 'Pending';
export const GUIDELINE_VERSION = 'NTEP / WHO 2025 guidance (see References in Study All)';

const REF_CBNAAT = 'WHO Module 3 — Diagnosis, 2025; Xpert MTB/RIF / Ultra Instructions for Use';
const REF_NTEP = 'Current NTEP / Central TB Division, Government of India guidelines';
const REF_DR = 'NTEP National Guidelines for Management of Drug-Resistant TB, 2025';
const REF_CHILD = 'WHO Module 5 — Management of Tuberculosis in Children and Adolescents';

export const LEVEL2_CASES: Level2Case[] = [
  {
    id: 'L2-C01',
    title: 'Typical adult pulmonary TB',
    scenario: 'Adult with cough for 3 weeks, fever, weight loss and night sweats — a presumptive TB patient from Level 1. Suspicion is not confirmation, so a test is run.',
    age: 'Adult',
    category: 'Adult',
    investigationType: 'CBNAAT (Xpert) on sputum, plus chest X-ray',
    investigationResult: 'MTB DETECTED, RIF NOT DETECTED',
    cxrFinding: 'Upper-zone cavity',
    report: 'Xpert MTB/RIF — MTB DETECTED · Rifampicin resistance NOT DETECTED · Specimen: sputum',
    difficulty: 'Core',
    tbCategory: 'Pulmonary TB',
    nextNode: 'Drug-susceptible TB pathway',
    reference: REF_CBNAAT,
    steps: [
      {
        question: 'Step 1 — What does this report mean?',
        options: [
          'Bacteriologically confirmed pulmonary TB',
          'TB excluded, because no smear was done',
          'Only a probable case — culture is still needed to confirm it',
          'Drug-resistant TB',
        ],
        correctIndex: 0,
        whyCorrect: 'MTB DNA detected in sputum is bacteriological confirmation of pulmonary TB.',
        whyWrong: [
          '',
          'A smear is not required for confirmation. Molecular detection confirms TB on its own.',
          'Do not wait for culture to call a molecularly confirmed case confirmed.',
          'RIF NOT DETECTED means no molecular evidence of rifampicin resistance, not drug-resistant TB.',
        ],
        keyPoint: 'MTB detected = TB confirmed.',
        topic: 'cbnaat',
      },
      {
        question: 'Step 2 — What is the next step?',
        options: [
          'Follow the routine drug-susceptible TB pathway, with programme notification and follow-up',
          'Start the RR-TB pathway',
          'Discharge — one test is not enough',
          'Wait for culture before deciding any pathway',
        ],
        correctIndex: 0,
        whyCorrect: 'MTB detected with RIF not detected goes down the routine drug-susceptible pathway.',
        whyWrong: [
          '',
          'The RR-TB pathway is for RIF DETECTED, which is not this result.',
          'A confirmed case is not discharged.',
          'Do not delay a confirmed case while waiting for culture.',
        ],
        keyPoint: 'MTB detected + RIF not detected → drug-susceptible pathway.',
        topic: 'cbnaat',
      },
    ],
  },
  {
    id: 'L2-C02',
    title: 'Negative smear, still TB',
    scenario: 'Adult with persistent cough and weight loss. Sputum smear microscopy was done first and came back negative. Because suspicion remains, a molecular test is run.',
    age: 'Adult',
    category: 'Adult',
    investigationType: 'Smear microscopy, then CBNAAT (Xpert) on sputum',
    investigationResult: 'Smear AFB NOT DETECTED · MTB DETECTED, RIF NOT DETECTED',
    cxrFinding: 'Not the deciding test here',
    report: 'Smear: AFB NOT DETECTED · Xpert MTB/RIF — MTB DETECTED · Rifampicin resistance NOT DETECTED',
    difficulty: 'Trap case',
    tbCategory: 'Pulmonary TB',
    nextNode: 'Drug-susceptible TB pathway',
    reference: REF_CBNAAT,
    steps: [
      {
        question: 'Step 1 — What does this combination mean?',
        options: [
          'TB confirmed — a negative smear does not rule out TB',
          'No TB — the smear was negative',
          'Indeterminate — repeat smear only',
          'Scanty positive',
        ],
        correctIndex: 0,
        whyCorrect: 'Smear has low sensitivity. MTB detected on the molecular test confirms TB despite the negative smear.',
        whyWrong: [
          '',
          'This is the trap: negative smear ≠ No TB.',
          'The molecular result is already interpretable. Repeating smear alone would miss the diagnosis.',
          'Scanty means a few bacilli were seen. Here AFB were not detected at all.',
        ],
        keyPoint: 'Negative smear ≠ No TB.',
        topic: 'smear',
      },
      {
        question: 'Step 2 — What is the next step?',
        options: [
          'Follow the drug-susceptible TB pathway',
          'Discharge because the smear was negative',
          'Stay on a smear-only pathway',
          'Treat as RR-TB because the smear failed',
        ],
        correctIndex: 0,
        whyCorrect: 'The confirmed molecular result decides the pathway, not the negative smear.',
        whyWrong: [
          '',
          'Discharging a confirmed case because of a negative smear is the error this case teaches against.',
          'There is no smear-only pathway once a molecular result is available.',
          'A failed smear is not evidence of drug resistance.',
        ],
        keyPoint: 'The molecular result, not the smear, decides the pathway.',
        topic: 'cbnaat',
      },
    ],
  },
  {
    id: 'L2-C03',
    title: 'Pediatric pulmonary TB',
    scenario: 'Child with prolonged cough, fever and poor weight gain. Children often have lymph nodes, not cavities, on chest X-ray. An Ultra test is run.',
    age: 'Child',
    category: 'Child',
    investigationType: 'Chest X-ray, then Xpert Ultra',
    investigationResult: 'MTB DETECTED-LOW, RIF NOT DETECTED',
    cxrFinding: 'Hilar / paratracheal lymphadenopathy',
    report: 'Xpert Ultra — MTB DETECTED, level LOW · Rifampicin resistance NOT DETECTED',
    difficulty: 'Core',
    tbCategory: 'Pediatric pulmonary TB',
    nextNode: 'Pediatric TB pathway',
    reference: REF_CHILD,
    steps: [
      {
        question: 'Step 1 — What does this report mean?',
        options: [
          'Pediatric pulmonary TB',
          'Not TB — LOW means mild or negative',
          'CXR alone confirms TB',
          'Adult post-primary TB pattern',
        ],
        correctIndex: 0,
        whyCorrect: 'Hilar nodes in a child plus MTB detected on Ultra is pediatric pulmonary TB.',
        whyWrong: [
          '',
          'LOW is the amount of MTB DNA detected, not disease severity — and it is not negative.',
          'CXR can suggest TB but never confirms it alone. Here the microbiology confirms it.',
          'Cavities are the adult post-primary pattern. Children typically show nodes, not cavities.',
        ],
        keyPoint: 'In a child, nodes are the clue — LOW is DNA amount, not severity.',
        topic: 'cxr',
      },
      {
        question: 'Step 2 — What is the next step?',
        options: [
          'Follow the pediatric TB pathway, with caregiver counselling and follow-up',
          'Use the adult pathway without any pediatric assessment',
          'Discharge and wait for a cavity to appear',
          'Wait for a cavity before treating',
        ],
        correctIndex: 0,
        whyCorrect: 'A confirmed pediatric case follows the pediatric pathway, not adult assumptions.',
        whyWrong: [
          '',
          'Children need pediatric assessment; the adult pathway is not a substitute.',
          'Waiting for a cavity in a child misses the typical pediatric presentation.',
          'A cavity is not required to act on a confirmed pediatric case.',
        ],
        keyPoint: 'Children: nodes, not cavities — act on the confirmed result.',
        topic: 'extrapulmonary',
      },
    ],
  },
  {
    id: 'L2-C04',
    title: 'Extrapulmonary lymph-node TB',
    scenario: 'Person with a persistent neck swelling and no cough. No cough does not exclude TB. The specimen is taken from the suspected site.',
    age: 'Any age',
    category: 'Extrapulmonary',
    investigationType: 'CBNAAT on lymph-node aspirate',
    investigationResult: 'MTB DETECTED',
    cxrFinding: 'Not the deciding test here',
    report: 'CBNAAT on lymph-node aspirate — MTB DETECTED',
    difficulty: 'Core',
    tbCategory: 'Extrapulmonary TB — lymph node',
    nextNode: 'Extrapulmonary TB pathway',
    reference: REF_NTEP,
    steps: [
      {
        question: 'Step 1 — What does this report mean?',
        options: [
          'TB lymphadenitis',
          'No TB — there is no cough',
          'A smear is still needed to confirm the species',
          'Just a reactive lymph node',
        ],
        correctIndex: 0,
        whyCorrect: 'MTB detected in a lymph-node aspirate matches the suspected site: TB lymphadenitis.',
        whyWrong: [
          '',
          'No cough does not exclude TB. Extrapulmonary TB often has no cough.',
          'Molecular detection in the site specimen already answers the question; smear does not confirm species.',
          'A reactive node would not have MTB detected in its aspirate.',
        ],
        keyPoint: 'Match the specimen to the suspected site.',
        topic: 'extrapulmonary',
      },
      {
        question: 'Step 2 — What is the next step?',
        options: [
          'Follow the extrapulmonary TB pathway for lymph-node disease',
          'Do sputum CBNAAT first instead',
          'Give general antibiotics only and ignore the result',
          'Ignore the result because there is no cough',
        ],
        correctIndex: 0,
        whyCorrect: 'The site specimen has already given the answer, so the extrapulmonary pathway follows.',
        whyWrong: [
          '',
          'Sputum is the wrong specimen when the disease site is a lymph node.',
          'General antibiotics do not address a confirmed TB result.',
          'Absence of cough never cancels a positive site-specimen result.',
        ],
        keyPoint: 'Test the site, then follow the site pathway.',
        topic: 'extrapulmonary',
      },
    ],
  },
  {
    id: 'L2-C05',
    title: 'TB meningitis',
    scenario: 'Person with headache, fever, neck stiffness and drowsiness. This is an extrapulmonary presentation — the specimen must come from the suspected site.',
    age: 'Any age',
    category: 'Extrapulmonary',
    investigationType: 'CBNAAT on CSF',
    investigationResult: 'MTB DETECTED in CSF',
    cxrFinding: 'Not the deciding test here',
    report: 'CBNAAT on CSF — MTB DETECTED',
    difficulty: 'Core',
    tbCategory: 'Extrapulmonary TB — meningitis',
    nextNode: 'Urgent TB meningitis pathway',
    reference: REF_NTEP,
    steps: [
      {
        question: 'Step 1 — What does this report mean?',
        options: [
          'TB meningitis supported — urgent correlation needed',
          'Bacterial meningitis proven by this result alone',
          'Negative, because the CSF volume was small',
          'No TB — there is no cough',
        ],
        correctIndex: 0,
        whyCorrect: 'MTB detected in CSF supports TB meningitis and needs urgent clinical correlation.',
        whyWrong: [
          '',
          'This result supports TB meningitis specifically; it does not prove ordinary bacterial meningitis.',
          'A small volume does not turn a detected result into a negative one.',
          'Meningitis is extrapulmonary disease — cough is not required.',
        ],
        keyPoint: 'CSF MTB detected = TB meningitis supported.',
        topic: 'extrapulmonary',
      },
      {
        question: 'Step 2 — What is the next step?',
        options: [
          'Follow the urgent TB meningitis pathway without delay',
          'Routine outpatient follow-up next week',
          'Repeat sputum testing first',
          'Discharge because the chest is clear',
        ],
        correctIndex: 0,
        whyCorrect: 'TB meningitis is urgent. A supported result must not wait for routine review.',
        whyWrong: [
          '',
          'Routine follow-up is too slow for meningitis.',
          'Sputum is the wrong specimen for meningeal disease.',
          'A clear chest does not exclude meningeal TB.',
        ],
        keyPoint: 'TB meningitis: supported result → urgent pathway, no delay.',
        topic: 'extrapulmonary',
      },
    ],
  },
  {
    id: 'L2-C06',
    title: 'Rifampicin-resistant TB',
    scenario: 'Person with previous TB treatment and now recurrent symptoms. Previous treatment raises the question of drug resistance, so the RIF result is the branching point.',
    age: 'Adult',
    category: 'Adult',
    investigationType: 'CBNAAT (Xpert) on sputum',
    investigationResult: 'MTB DETECTED, RIF DETECTED',
    cxrFinding: 'Not the deciding test here',
    report: 'Xpert MTB/RIF — MTB DETECTED · Rifampicin resistance DETECTED',
    difficulty: 'Core',
    tbCategory: 'Rifampicin-resistant TB',
    nextNode: 'RR-TB / DR-TB pathway',
    reference: REF_DR,
    steps: [
      {
        question: 'Step 1 — What does this report mean?',
        options: [
          'RR-TB pathway — rifampicin resistance detected',
          'Routine drug-susceptible pathway',
          'MDR-TB proven',
          'All TB drugs will fail',
        ],
        correctIndex: 0,
        whyCorrect: 'RIF DETECTED means rifampicin resistance: think RR-TB, not the routine pathway.',
        whyWrong: [
          '',
          'The routine drug-susceptible pathway is exactly what RIF DETECTED rules out.',
          'MDR-TB needs resistance to at least rifampicin AND isoniazid. RIF alone does not prove MDR.',
          'RIF resistance is about rifampicin. It does not mean every TB drug fails.',
        ],
        keyPoint: 'RIF detected → RR-TB. It does not automatically mean MDR-TB.',
        topic: 'rif',
      },
      {
        question: 'Step 2 — What is the next step?',
        options: [
          'Further drug-resistance assessment and the DR-TB pathway',
          'Start the routine drug-susceptible regimen',
          'Repeat smear only',
          'Discharge and retest in a month',
        ],
        correctIndex: 0,
        whyCorrect: 'RIF resistance needs further drug-resistance assessment under the DR-TB pathway.',
        whyWrong: [
          '',
          'Starting the routine regimen in RR-TB ignores the resistance result.',
          'Smear cannot assess drug resistance.',
          'A resistance result is not a wait-and-see result.',
        ],
        keyPoint: 'RIF detected → further resistance assessment, DR-TB pathway.',
        topic: 'rif',
      },
    ],
  },
  {
    id: 'L2-C07',
    title: 'Challenging pulmonary case — TRAP CASE',
    scenario: 'Person with persistent upper-zone opacity on chest X-ray and ongoing symptoms. A molecular test is run — and it comes back negative. Suspicion remains.',
    age: 'Adult',
    category: 'Adult',
    investigationType: 'Chest X-ray, then CBNAAT on sputum',
    investigationResult: 'MTB NOT DETECTED',
    cxrFinding: 'Persistent upper-zone opacity',
    report: 'Xpert MTB/RIF — MTB NOT DETECTED (valid result)',
    difficulty: 'Trap case',
    tbCategory: 'Pulmonary TB — not excluded',
    nextNode: 'Further evaluation',
    reference: REF_CBNAAT,
    steps: [
      {
        question: 'Step 1 — What does this report mean?',
        options: [
          'TB not excluded — further evaluation is still needed',
          'TB excluded',
          'CXR confirms TB',
          'Invalid result',
        ],
        correctIndex: 0,
        whyCorrect: 'MTB not detected in this specimen does not automatically exclude TB when suspicion remains.',
        whyWrong: [
          '',
          'This is the trap: a negative molecular test with persistent suspicion is not an exclusion.',
          'CXR can suggest TB but never confirms it alone — in either direction.',
          'This is a valid, interpretable negative result, not an invalid/error result.',
        ],
        keyPoint: 'Negative test + persistent suspicion = TB not excluded.',
        topic: 'cbnaat',
      },
      {
        question: 'Step 2 — What is the next step?',
        options: [
          'Further evaluation — clinical correlation, repeat or other specimen, specialist review',
          'Discharge as No TB',
          'Start the RR-TB pathway',
          'Smear-only pathway from now on',
        ],
        correctIndex: 0,
        whyCorrect: 'Persistent suspicion after a negative result needs further evaluation, not discharge.',
        whyWrong: [
          '',
          'Discharging on one negative result ignores the persistent CXR and symptoms.',
          'There is no detected MTB and no RIF result to base an RR pathway on.',
          'A smear-only pathway would be a step backwards from molecular testing.',
        ],
        keyPoint: 'Negative ≠ excluded when suspicion persists. Evaluate further.',
        topic: 'cbnaat',
      },
    ],
  },
  {
    id: 'L2-C08',
    title: 'Xpert Ultra trace',
    scenario: 'Person with TB symptoms. An Ultra test returns the lowest level of detection. Read it in order: MTB first, then RIF, then validity.',
    age: 'Adult',
    category: 'Adult',
    investigationType: 'Xpert Ultra on sputum',
    investigationResult: 'MTB TRACE DETECTED, RIF INDETERMINATE',
    cxrFinding: 'Not the deciding test here',
    report: 'Xpert Ultra — MTB TRACE DETECTED · Rifampicin resistance INDETERMINATE',
    difficulty: 'Trap case',
    tbCategory: 'Pulmonary TB — trace detected',
    nextNode: 'Repeat / further testing, clinical correlation',
    reference: REF_CBNAAT,
    steps: [
      {
        question: 'Step 1 — What does this report mean?',
        options: [
          'Detected at a very low level — RIF status unresolved',
          'Negative',
          'Rifampicin resistant',
          'Severe disease',
        ],
        correctIndex: 0,
        whyCorrect: 'TRACE means MTB DNA detected at a very low level. It is not negative, and RIF is usually indeterminate at this level.',
        whyWrong: [
          '',
          'Trace is detected, not negative. Never call trace negative.',
          'INDETERMINATE is unresolved, not detected. Do not guess resistance.',
          'Trace describes DNA amount, not disease severity.',
        ],
        keyPoint: 'Trace = detected, very low. RIF indeterminate = unresolved.',
        topic: 'rif',
      },
      {
        question: 'Step 2 — What is the next step?',
        options: [
          'Repeat / further testing with clinical correlation — do not guess the RIF result',
          'Start the RR-TB pathway',
          'Discharge as negative',
          'Follow the drug-susceptible pathway as if RIF were not detected',
        ],
        correctIndex: 0,
        whyCorrect: 'An unresolved RIF result needs repeat or further testing, not a guessed pathway.',
        whyWrong: [
          '',
          'RR-TB needs RIF DETECTED. Indeterminate is not detected.',
          'Trace is a detected result, so discharge as negative is wrong.',
          'Treating indeterminate as not detected assumes a result that was never given.',
        ],
        keyPoint: 'RIF indeterminate → investigate further. Never guess.',
        topic: 'rif',
      },
    ],
  },
];

export const LEVEL2_QUESTIONS: Level2Question[] = [
  {
    id: 'L2-Q01', question: 'Smear report: AFB 2+. What does it mean?', topic: 'smear', difficulty: 'Core', tbCategory: 'Pulmonary TB', nextNode: 'Smear-positive pathway; molecular test still needed for resistance', reference: REF_NTEP,
    options: ['Smear POSITIVE', 'Smear negative', 'Indeterminate', 'No TB'], correctIndex: 0,
    whyCorrect: 'AFB detected at any grade — scanty, 1+, 2+ or 3+ — is smear positive.',
    whyWrong: ['', 'AFB were detected, so this cannot be negative.', 'A graded AFB result is interpretable, not indeterminate.', 'A positive smear supports TB; it does not exclude it.'],
    keyPoint: 'AFB detected, any grade = smear positive.',
  },
  {
    id: 'L2-Q02', question: 'Smear report: AFB NOT DETECTED. What does it mean?', topic: 'smear', difficulty: 'Trap case', tbCategory: 'Pulmonary TB', nextNode: 'Molecular test; TB not excluded if suspicion remains', reference: REF_NTEP,
    options: ['Smear negative, but TB is NOT excluded', 'No TB', 'Smear positive', 'Drug-resistant TB'], correctIndex: 0,
    whyCorrect: 'Smear sensitivity is low, especially in children, people living with HIV and paucibacillary disease.',
    whyWrong: ['', 'This is the trap: negative smear ≠ No TB.', 'AFB not detected is the opposite of a positive smear.', 'Smear tells nothing about drug resistance.'],
    keyPoint: 'Negative smear ≠ No TB.',
  },
  {
    id: 'L2-Q03', question: 'Smear report: AFB scanty. What does it mean?', topic: 'smear', difficulty: 'Trap case', tbCategory: 'Pulmonary TB', nextNode: 'Smear-positive pathway; molecular test for resistance', reference: REF_NTEP,
    options: ['Smear POSITIVE — scanty is still positive', 'Smear negative', 'Invalid result', 'No TB'], correctIndex: 0,
    whyCorrect: 'Scanty means a few bacilli were seen. Seen means detected, and detected means positive.',
    whyWrong: ['', 'Scanty is the classic trap: few bacilli is still positive, not negative.', 'Scanty is a valid graded result, not an invalid one.', 'A positive smear does not exclude TB.'],
    keyPoint: 'Scanty is still positive.',
  },
  {
    id: 'L2-Q04', question: 'CBNAAT: MTB DETECTED, RIF NOT DETECTED. What does it mean?', topic: 'cbnaat', difficulty: 'Core', tbCategory: 'Pulmonary TB', nextNode: 'Drug-susceptible TB pathway', reference: REF_CBNAAT,
    options: ['TB detected, no molecular evidence of rifampicin resistance', 'No TB', 'RR-TB', 'All TB drugs will work'], correctIndex: 0,
    whyCorrect: 'MTB detected confirms TB; RIF not detected means no molecular evidence of rifampicin resistance.',
    whyWrong: ['', 'MTB detected is the opposite of no TB.', 'RR-TB needs RIF DETECTED.', 'RIF not detected does not mean all drugs work — other resistance can exist.'],
    keyPoint: 'RIF not detected ≠ all drugs susceptible.',
  },
  {
    id: 'L2-Q05', question: 'CBNAAT: MTB DETECTED, RIF DETECTED. What does it mean?', topic: 'rif', difficulty: 'Core', tbCategory: 'Rifampicin-resistant TB', nextNode: 'RR-TB / DR-TB pathway', reference: REF_DR,
    options: ['TB detected + rifampicin resistance — enter the RR-TB pathway', 'Routine drug-susceptible pathway', 'MDR-TB proven', 'Negative result'], correctIndex: 0,
    whyCorrect: 'RIF DETECTED is the branching point: do not follow the routine pathway.',
    whyWrong: ['', 'The routine pathway is ruled out by RIF DETECTED.', 'MDR needs rifampicin AND isoniazid resistance. RIF alone does not prove MDR.', 'MTB was detected, so this is not negative.'],
    keyPoint: 'RIF detected → RR-TB pathway.',
  },
  {
    id: 'L2-Q06', question: 'CBNAAT: MTB NOT DETECTED, but TB suspicion remains. What does it mean?', topic: 'cbnaat', difficulty: 'Trap case', tbCategory: 'Pulmonary TB — not excluded', nextNode: 'Further evaluation', reference: REF_CBNAAT,
    options: ['TB not automatically excluded — further evaluation needed', 'TB excluded', 'Invalid result', 'Smear-positive TB'], correctIndex: 0,
    whyCorrect: 'MTBC DNA was not detected in THIS specimen. If suspicion remains, TB is not excluded.',
    whyWrong: ['', 'Exclusion needs more than one negative result when suspicion persists.', 'Not detected is a valid result, not an invalid one.', 'Nothing here is smear-positive.'],
    keyPoint: 'MTB not detected ≠ TB excluded, when suspicion remains.',
  },
  {
    id: 'L2-Q07', question: 'CBNAAT: MTB DETECTED, RIF INDETERMINATE. What does it mean?', topic: 'rif', difficulty: 'Trap case', tbCategory: 'Pulmonary TB', nextNode: 'Repeat / further testing', reference: REF_CBNAAT,
    options: ['TB detected, RIF status unresolved — repeat / further testing', 'RIF resistant', 'RIF susceptible', 'Negative result'], correctIndex: 0,
    whyCorrect: 'Indeterminate means the RIF question could not be answered. Do not guess it.',
    whyWrong: ['', 'Indeterminate is not detected.', 'Indeterminate is not not detected either.', 'MTB was detected, so this is not negative.'],
    keyPoint: 'RIF indeterminate → do not guess, investigate further.',
  },
  {
    id: 'L2-Q08', question: 'Xpert Ultra: MTB TRACE DETECTED, RIF INDETERMINATE. What does it mean?', topic: 'rif', difficulty: 'Trap case', tbCategory: 'Pulmonary TB — trace detected', nextNode: 'Repeat / further testing, clinical correlation', reference: REF_CBNAAT,
    options: ['Detected at a very low level — NOT negative, RIF unresolved', 'Negative', 'RIF resistant', 'Mild disease'], correctIndex: 0,
    whyCorrect: 'Trace is detection at the lowest level. RIF is usually indeterminate at trace level.',
    whyWrong: ['', 'Trace is detected. Never call trace negative.', 'Indeterminate is not detected.', 'Trace is DNA amount, not disease severity.'],
    keyPoint: 'Trace ≠ negative.',
  },
  {
    id: 'L2-Q09', question: 'CBNAAT report: INVALID. What does it mean?', topic: 'cbnaat', difficulty: 'Trap case', tbCategory: 'No valid result', nextNode: 'Repeat per lab procedure', reference: REF_CBNAAT,
    options: ['No valid result — repeat per lab procedure', 'Negative', 'No TB', 'Smear-positive TB'], correctIndex: 0,
    whyCorrect: 'Invalid, error and no result all mean the same thing: no valid result was produced.',
    whyWrong: ['', 'Invalid ≠ negative. Never read an invalid result as negative.', 'No result was produced, so TB cannot be excluded from it.', 'No smear result is given here.'],
    keyPoint: 'Invalid ≠ negative. Repeat per lab procedure.',
  },
  {
    id: 'L2-Q10', question: 'CXR: upper-lobe infiltrate with a cavity in an adult. What does it mean?', topic: 'cxr', difficulty: 'Core', tbCategory: 'Pulmonary TB', nextNode: 'Microbiological confirmation (CBNAAT first)', reference: REF_CBNAAT,
    options: ['Strongly suggestive of post-primary adult pulmonary TB — but CXR alone does NOT confirm TB', 'TB confirmed by CXR alone', 'Normal chest X-ray', 'No TB'], correctIndex: 0,
    whyCorrect: 'Upper-lobe cavity is the classic adult pattern, but confirmation still needs microbiology.',
    whyWrong: ['', 'This is the rule CXR students must never break: CXR alone never confirms TB.', 'A cavity is not a normal finding.', 'A strongly suggestive pattern does not exclude TB.'],
    keyPoint: 'CXR can suggest TB; CXR alone does NOT confirm TB.',
  },
  {
    id: 'L2-Q11', question: 'CXR in a child: hilar / paratracheal lymphadenopathy, no cavity. What does it mean?', topic: 'cxr', difficulty: 'Core', tbCategory: 'Pediatric pulmonary TB', nextNode: 'Pediatric pathway; CBNAAT on a child-appropriate specimen', reference: REF_CHILD,
    options: ['Pediatric TB clue — children often have nodes, not cavities', 'No TB, because there is no cavity', 'Adult TB pattern', 'Normal CXR'], correctIndex: 0,
    whyCorrect: 'In children, hilar nodes are a recognised TB clue. Waiting for a cavity misses pediatric TB.',
    whyWrong: ['', 'Absence of a cavity does not exclude TB in a child.', 'Cavities are the adult pattern, not the pediatric one.', 'Enlarged hilar nodes are not a normal finding.'],
    keyPoint: 'Child + hilar nodes = pediatric TB clue.',
  },
  {
    id: 'L2-Q12', question: 'CXR: pleural effusion. What does it mean?', topic: 'cxr', difficulty: 'Core', tbCategory: 'Extrapulmonary / pleural TB — nonspecific', nextNode: 'Correlate with symptoms and microbiology of pleural specimen', reference: REF_NTEP,
    options: ['Can occur in TB, but nonspecific — many other causes exist', 'TB confirmed by CXR alone', 'No TB', 'Drug-resistant TB'], correctIndex: 0,
    whyCorrect: 'Effusion is compatible with TB but also has many non-TB causes, so it needs correlation and testing.',
    whyWrong: ['', 'No single CXR finding confirms TB alone.', 'A nonspecific finding neither confirms nor excludes TB.', 'CXR tells nothing about drug resistance.'],
    keyPoint: 'Pleural effusion: possible in TB, never specific to TB.',
  },
  {
    id: 'L2-Q13', question: 'Neck swelling: lymph-node aspirate CBNAAT — MTB DETECTED. What does it mean?', topic: 'extrapulmonary', difficulty: 'Core', tbCategory: 'Extrapulmonary TB — lymph node', nextNode: 'Extrapulmonary TB pathway', reference: REF_NTEP,
    options: ['TB lymphadenitis', 'No TB — no cough', 'Reactive node only', 'Pulmonary TB only'], correctIndex: 0,
    whyCorrect: 'MTB in the aspirate from the suspected site is TB lymphadenitis.',
    whyWrong: ['', 'Extrapulmonary TB does not need a cough.', 'A reactive node would not yield MTB.', 'This is extrapulmonary disease, not pulmonary disease.'],
    keyPoint: 'Site specimen + MTB detected = site TB.',
  },
  {
    id: 'L2-Q14', question: 'Headache, fever, neck stiffness, drowsiness: CSF CBNAAT — MTB DETECTED. What does it mean?', topic: 'extrapulmonary', difficulty: 'Core', tbCategory: 'Extrapulmonary TB — meningitis', nextNode: 'Urgent TB meningitis pathway', reference: REF_NTEP,
    options: ['TB meningitis supported — urgent pathway', 'No TB — no cough', 'Normal CSF', 'Routine follow-up'], correctIndex: 0,
    whyCorrect: 'MTB in CSF supports TB meningitis, which is urgent.',
    whyWrong: ['', 'Meningeal TB does not need a cough.', 'MTB detected is not a normal CSF result.', 'Meningitis is never a routine follow-up problem.'],
    keyPoint: 'CSF MTB detected = TB meningitis supported, urgently.',
  },
  {
    id: 'L2-Q15', question: 'Molecular test negative, but CXR opacity persists and symptoms continue. What next?', topic: 'cbnaat', difficulty: 'Trap case', tbCategory: 'Pulmonary TB — not excluded', nextNode: 'Further evaluation', reference: REF_CBNAAT,
    options: ['Further evaluation — TB is not excluded', 'Discharge as No TB', 'RR-TB pathway', 'Smear-only pathway'], correctIndex: 0,
    whyCorrect: 'One negative result does not overrule persistent suspicion.',
    whyWrong: ['', 'Discharging here is the trap this question teaches against.', 'No resistance result exists to justify an RR pathway.', 'Smear-only is a step backwards from molecular testing.'],
    keyPoint: 'Persistent suspicion + negative test = evaluate further.',
  },
  {
    id: 'L2-Q16', question: 'CBNAAT: MTB DETECTED, RIF NOT DETECTED. Does this mean all TB drugs will work?', topic: 'rif', difficulty: 'Trap case', tbCategory: 'Pulmonary TB', nextNode: 'Drug-susceptible pathway with resistance awareness', reference: REF_DR,
    options: ['No — other resistance can still exist', 'Yes, all drugs will work', 'Yes, and no follow-up is needed', 'No, it means RR-TB'], correctIndex: 0,
    whyCorrect: 'RIF not detected only speaks about rifampicin at the molecular level. Other resistance is still possible.',
    whyWrong: ['', 'This is the trap: RIF not detected is not a guarantee for every drug.', 'Follow-up is still needed for every confirmed case.', 'RR-TB needs RIF DETECTED, the opposite result.'],
    keyPoint: 'RIF not detected ≠ all drugs susceptible.',
  },
  {
    id: 'L2-Q17', question: 'Integrated case: adult with cough and weight loss, CXR upper-zone cavity, CBNAAT MTB DETECTED + RIF DETECTED. What is the diagnosis and pathway?', topic: 'rif', difficulty: 'Integrated', tbCategory: 'Rifampicin-resistant pulmonary TB', nextNode: 'RR-TB / DR-TB pathway with further resistance assessment', reference: REF_DR,
    options: ['Bacteriologically confirmed pulmonary TB with rifampicin resistance — RR-TB pathway', 'Drug-susceptible pulmonary TB', 'TB excluded by CXR', 'MDR-TB proven'], correctIndex: 0,
    whyCorrect: 'Clinical picture + suggestive CXR + MTB detected confirms TB, and RIF detected branches it to RR-TB.',
    whyWrong: ['', 'RIF DETECTED rules out the routine drug-susceptible pathway.', 'CXR never excludes TB, and here microbiology is positive anyway.', 'MDR needs isoniazid resistance too, which is not shown here.'],
    keyPoint: 'Confirm with microbiology, then branch on RIF.',
  },
];

export const RAPID_REPORTS: RapidReport[] = [
  { id: 'R01', title: 'AFB 2+', report: 'Smear microscopy — AFB 2+', reading: 'Smear POSITIVE. AFB detected at grade 2+.', notMean: 'It does not confirm the species and does not tell drug resistance.', next: 'Molecular test for confirmation and rifampicin status.', topic: 'smear' },
  { id: 'R02', title: 'AFB not detected', report: 'Smear microscopy — AFB NOT DETECTED', reading: 'Smear NEGATIVE for this specimen.', notMean: 'It does not mean No TB. Sensitivity is low, especially in children, people living with HIV and paucibacillary disease.', next: 'Molecular test (CBNAAT first) if suspicion remains.', topic: 'smear' },
  { id: 'R03', title: 'AFB scanty', report: 'Smear microscopy — AFB SCANTY', reading: 'Smear POSITIVE. A few bacilli were seen — seen means detected.', notMean: 'It does not mean negative, borderline or “almost negative”.', next: 'Molecular test for confirmation and rifampicin status.', topic: 'smear' },
  { id: 'R04', title: 'MTB detected, RIF not detected', report: 'Xpert — MTB DETECTED · RIF NOT DETECTED', reading: 'TB detected, no molecular evidence of rifampicin resistance.', notMean: 'It does not mean all TB drugs work.', next: 'Routine drug-susceptible TB pathway.', topic: 'cbnaat' },
  { id: 'R05', title: 'MTB detected, RIF detected', report: 'Xpert — MTB DETECTED · RIF DETECTED', reading: 'TB detected + rifampicin resistance. Enter the RR-TB pathway.', notMean: 'It does not automatically prove MDR-TB (that also needs isoniazid resistance).', next: 'Further drug-resistance assessment, DR-TB pathway.', topic: 'rif' },
  { id: 'R06', title: 'MTB detected, RIF indeterminate', report: 'Xpert — MTB DETECTED · RIF INDETERMINATE', reading: 'TB detected, RIF status unresolved.', notMean: 'It does not mean resistant or susceptible. Do not guess.', next: 'Repeat / further testing.', topic: 'rif' },
  { id: 'R07', title: 'MTB not detected', report: 'Xpert — MTB NOT DETECTED (valid result)', reading: 'MTBC DNA not detected in THIS specimen.', notMean: 'It does not automatically exclude TB if suspicion remains.', next: 'Further evaluation, clinical correlation.', topic: 'cbnaat' },
  { id: 'R08', title: 'MTB trace detected (Ultra)', report: 'Xpert Ultra — MTB TRACE DETECTED · RIF INDETERMINATE', reading: 'Detected at a very low level. NOT negative. RIF usually indeterminate.', notMean: 'It does not mean negative, mild disease or resistant disease.', next: 'Repeat / further testing with clinical correlation.', topic: 'rif' },
  { id: 'R09', title: 'Invalid', report: 'Xpert — INVALID', reading: 'No valid result was produced.', notMean: 'Invalid ≠ negative and ≠ No TB.', next: 'Repeat per lab procedure.', topic: 'cbnaat' },
  { id: 'R10', title: 'Error', report: 'Xpert — ERROR', reading: 'No valid result was produced (instrument / run error).', notMean: 'Error ≠ negative and ≠ No TB.', next: 'Repeat per lab procedure.', topic: 'cbnaat' },
  { id: 'R11', title: 'No result', report: 'Xpert — NO RESULT', reading: 'No valid result was produced.', notMean: 'No result ≠ negative and ≠ No TB.', next: 'Repeat per lab procedure.', topic: 'cbnaat' },
  { id: 'R12', title: 'Upper-lobe cavity (adult)', report: 'CXR — Upper-lobe infiltrate + cavity', reading: 'Classic post-primary adult pulmonary TB pattern, strongly suggestive.', notMean: 'CXR alone does NOT confirm TB.', next: 'Microbiological confirmation — CBNAAT first.', topic: 'cxr' },
  { id: 'R13', title: 'Hilar nodes in a child', report: 'CXR — Hilar / paratracheal lymphadenopathy (child)', reading: 'Pediatric TB clue. Children often have nodes, not cavities.', notMean: 'Absence of a cavity does not exclude TB in a child.', next: 'Pediatric pathway; CBNAAT on a child-appropriate specimen.', topic: 'cxr' },
  { id: 'R14', title: 'Pleural effusion', report: 'CXR — Pleural effusion', reading: 'Can occur in TB, but nonspecific — many other causes exist.', notMean: 'It does not confirm TB and does not exclude TB on its own.', next: 'Correlate with symptoms; test the pleural specimen.', topic: 'cxr' },
  { id: 'R15', title: 'Diffuse tiny bilateral nodules', report: 'CXR — Diffuse tiny bilateral nodules', reading: 'Miliary / disseminated TB pattern — urgent correlation needed.', notMean: 'CXR alone does NOT confirm TB, even when the pattern is striking.', next: 'Urgent clinical correlation and microbiological testing.', topic: 'cxr' },
  { id: 'R16', title: 'Persistent consolidation in a child', report: 'CXR — Persistent consolidation without cavity (child)', reading: 'Can still be TB in a child, even without a cavity.', notMean: 'Absence of a cavity does not exclude pediatric TB.', next: 'Pediatric pathway; CBNAAT on a child-appropriate specimen.', topic: 'cxr' },
];

export const FIRST_TEST_ROUNDS: FirstTestRound[] = [
  {
    id: 'F01', scenario: 'Adult who can give sputum, with cough, fever and weight loss.',
    question: 'What goes FIRST?',
    options: ['Sputum → CBNAAT / GeneXpert first', 'Smear microscopy only', 'Culture first', 'CXR alone, no microbiology'],
    correctIndex: 0,
    reason: 'For an adult/adolescent who can give sputum, a molecular rapid test is the initial test, not smear or culture. CXR supports, never confirms alone.',
    remember: 'Adult + sputum → CBNAAT first.',
  },
  {
    id: 'F02', scenario: 'Young child who cannot expectorate (children swallow sputum).',
    question: 'What goes FIRST?',
    options: ['Frontal chest X-ray — the initial specific investigation', 'Expectorated sputum CBNAAT', 'Smear only', 'Culture first'],
    correctIndex: 0,
    reason: 'A young child cannot give expectorated sputum, so frontal chest X-ray is the initial specific investigation in the NTEP child pathway. If highly suggestive, collect a specimen and do CBNAAT straight away.',
    remember: 'Young child, no sputum → frontal CXR first.',
  },
  {
    id: 'F03', scenario: 'Person with a persistent neck swelling, no cough.',
    question: 'What goes FIRST?',
    options: ['CBNAAT on the lymph-node aspirate', 'Sputum CBNAAT', 'Smear of sputum', 'CXR alone'],
    correctIndex: 0,
    reason: 'Match the specimen to the suspected site: the lymph node is the site, so its aspirate goes for CBNAAT first.',
    remember: 'Test the site: node aspirate → CBNAAT.',
  },
  {
    id: 'F04', scenario: 'Person with headache, fever, neck stiffness and drowsiness.',
    question: 'What goes FIRST?',
    options: ['CBNAAT on CSF', 'Sputum CBNAAT', 'Smear only', 'CXR alone'],
    correctIndex: 0,
    reason: 'Suspected meningitis means the specimen is CSF. CBNAAT on CSF comes first, not sputum testing.',
    remember: 'Meningitis signs → CSF CBNAAT first.',
  },
  {
    id: 'F05', scenario: 'Person living with HIV and TB symptoms, who can give sputum.',
    question: 'What goes FIRST?',
    options: ['Upfront CBNAAT — no smear-only pathway', 'Smear only, then wait', 'Culture first', 'CXR alone'],
    correctIndex: 0,
    reason: 'PLHIV is an upfront-CBNAAT group: no smear-only pathway, even though sputum is available.',
    remember: 'HIV + symptoms → upfront CBNAAT.',
  },
  {
    id: 'F06', scenario: 'Older child who CAN expectorate, with prolonged cough and fever.',
    question: 'What goes FIRST?',
    options: ['Sputum → CBNAAT first', 'Frontal CXR as the only test', 'Smear only', 'Gastric aspirate first'],
    correctIndex: 0,
    reason: 'An older child who can expectorate is handled like an adult for the first test: sputum goes for CBNAAT first.',
    remember: 'Older child + sputum → CBNAAT first.',
  },
  {
    id: 'F07', scenario: 'Adult: smear AFB NOT DETECTED, but CXR is suggestive and symptoms persist.',
    question: 'What goes FIRST now?',
    options: ['Upfront CBNAAT', 'Discharge as No TB', 'Repeat smear only', 'Culture first'],
    correctIndex: 0,
    reason: 'Smear-negative but CXR-suggestive is an upfront-CBNAAT situation. A negative smear never ends the work-up on its own.',
    remember: 'Smear negative + suggestive CXR → upfront CBNAAT.',
  },
  {
    id: 'F08', scenario: 'Young child, highly suggestive frontal CXR. A specimen is needed for CBNAAT. Which specimen can this child give first?',
    question: 'Pick the specimen a young child CAN give:',
    options: ['Early-morning gastric aspirate (fasting)', 'Expectorated sputum on demand', 'Pleural fluid without an indication', 'Blood culture for TB'],
    correctIndex: 0,
    reason: 'A young child cannot expectorate on demand. Specimens a young child CAN give for CBNAAT include early-morning gastric aspirate (fasting), induced sputum, nasopharyngeal aspirate or stool.',
    remember: 'Young child specimen: gastric aspirate, induced sputum, nasopharyngeal aspirate or stool.',
  },
];

export const LEVEL2_REFERENCES: string[] = [
  'Current NTEP / Central TB Division, Government of India guidelines — India programme pathway.',
  'NTEP National Guidelines for Management of Drug-Resistant TB, 2025.',
  'WHO Consolidated Guidelines on Tuberculosis: Module 3 — Diagnosis, 2025.',
  'WHO Operational Handbook on Tuberculosis: Module 3 — Diagnosis, 2025.',
  'WHO Module 5 — Management of Tuberculosis in Children and Adolescents.',
  'Current Xpert MTB/RIF / Ultra manufacturer Instructions for Use — exact report terminology.',
  'Faculty-approved institutional algorithm and CXR image bank.',
];

export const CXR_IMAGE_SLOTS = [
  { pattern: 'Upper-lobe infiltrate + cavity', fields: 'Image ID, Age, Clinical context, CXR finding, TB-suggestive?, Correct interpretation, Source, Copyright status, Faculty approval' },
  { pattern: 'Diffuse tiny bilateral nodules (miliary)', fields: 'Image ID, Age, Clinical context, CXR finding, TB-suggestive?, Correct interpretation, Source, Copyright status, Faculty approval' },
  { pattern: 'Hilar / paratracheal lymphadenopathy in a child', fields: 'Image ID, Age, Clinical context, CXR finding, TB-suggestive?, Correct interpretation, Source, Copyright status, Faculty approval' },
  { pattern: 'Pleural effusion', fields: 'Image ID, Age, Clinical context, CXR finding, TB-suggestive?, Correct interpretation, Source, Copyright status, Faculty approval' },
  { pattern: 'Persistent consolidation without cavity in a child', fields: 'Image ID, Age, Clinical context, CXR finding, TB-suggestive?, Correct interpretation, Source, Copyright status, Faculty approval' },
];
