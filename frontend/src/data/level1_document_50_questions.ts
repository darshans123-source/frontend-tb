// Level 1 question bank from the faculty document
// "Gamifying Pulmonary tuberculosis diagnostic algorithm"
// (Content_2_PTB__1.docx), extracted verbatim into
// ~/workspace/tb-quest-doc/data/level1_questions.json.
// DO NOT reword any medical text in this file: every question, option,
// explanation, learning point and feedback string is copied exactly as
// stored in the extraction. The only transformation is resolving the
// document's bare-letter correctAnswer ("A"/"B", 27 of 50) to the full
// option text it refers to; the resolved text is stored in
// `correctAnswerText` and `correctIndex` points at that option, so a bare
// letter is never shown to the student.
// Sections A-G: A symptoms Q1-10, B clinical clues Q11-18, C risk factors
// Q19-26, D history Q27-32, E exposure Q33-37, F relevant vs non-relevant
// Q38-42, G decision-making Q43-50. Difficulty: Easy 35 / Moderate 15.
// Types: MCQ 31 (Clinical Challenge), Yes/No 10 (Rapid-Fire, 10s timer),
// True/False 9 (Quick Challenge).
// Square 100 is the Final Snake Challenge (Q50). Q1-Q49 are asked in
// section order as the student lands on question squares, wrapping around
// on replay; they are NOT bound to fixed board squares.
import { ChallengeCategory } from '../types/snakeLadder';
import { Level1ClinicalQuestion } from './level1_25_questions';

export interface DocumentLevel1Question extends Level1ClinicalQuestion {
  section: string;
  sectionLabel: string;
  docType: 'mcq' | 'yes-no' | 'true-false';
  typeLabel: string;
  difficultyDoc: 'Easy' | 'Moderate';
  correctAnswerText: string;
  explanation: string;
  learningPoint: string;
  correctFeedback: string;
  incorrectFeedback: string;
  referencesDoc: string[];
}

export const DOCUMENT_REFERENCES_1_TO_5: string[] = [
  '[1] Uploaded TB diagnostic algorithm.docx',
  '[2] WHO consolidated guidelines on tuberculosis: Module 3 \u2013 Diagnosis (2025)',
  '[3] WHO Operational Handbook: Module 3 \u2013 Diagnosis, 3rd ed. (2024)',
  '[4] NTEP Guidelines for Management of Drug-Resistant TB (2025)',
  '[5] WHO TB Fact Sheet',
];

export const DOCUMENT_50_QUESTIONS: DocumentLevel1Question[] = [
  {
    "id": "d1",
    "questionNumber": 1,
    "squareNumber": 0,
    "category": "symptoms",
    "categoryLabel": "A. TB Symptom Identification",
    "section": "A",
    "sectionLabel": "A. TB Symptom Identification",
    "docType": "yes-no",
    "typeLabel": "Rapid-Fire",
    "difficultyDoc": "Easy",
    "patientClue": "A. TB Symptom Identification",
    "question": "A patient has cough for several weeks with weight loss and fever. Is TB a possible diagnosis?",
    "options": [
      "Yes",
      "No"
    ],
    "correctIndex": 0,
    "correctAnswerText": "Yes",
    "explanation": "Prolonged cough, fever and unexplained weight loss are important TB warning features.",
    "learningPoint": "Think of TB when compatible respiratory/systemic symptoms occur.",
    "correctFeedback": "Persistent cough with systemic symptoms such as weight loss and fever can raise suspicion of TB and warrants appropriate evaluation.",
    "incorrectFeedback": "No is incorrect. This combination of persistent respiratory and systemic symptoms should prompt consideration of TB.",
    "clinicalInsight": "Persistent cough with systemic symptoms such as weight loss and fever can raise suspicion of TB and warrants appropriate evaluation.",
    "whyRationale": "No is incorrect. This combination of persistent respiratory and systemic symptoms should prompt consideration of TB.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": true
  },
  {
    "id": "d2",
    "questionNumber": 2,
    "squareNumber": 0,
    "category": "symptoms",
    "categoryLabel": "A. TB Symptom Identification",
    "section": "A",
    "sectionLabel": "A. TB Symptom Identification",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "A. TB Symptom Identification",
    "question": "Which of the following is a common symptom that should raise suspicion of pulmonary TB?",
    "options": [
      "A. Prolonged cough",
      "B. Ear pain",
      "C. Ankle sprain",
      "D. Blurred vision only"
    ],
    "correctIndex": 0,
    "correctAnswerText": "A. Prolonged cough",
    "explanation": "Persistent cough is a common presenting feature of pulmonary TB.",
    "learningPoint": "Identify the symptom that points toward pulmonary disease.",
    "correctFeedback": "Persistent cough is an important symptom that may indicate pulmonary TB.",
    "incorrectFeedback": "Incorrect. Ear pain, an ankle sprain, or isolated blurred vision do not by themselves suggest pulmonary TB.",
    "clinicalInsight": "Persistent cough is an important symptom that may indicate pulmonary TB.",
    "whyRationale": "Incorrect. Ear pain, an ankle sprain, or isolated blurred vision do not by themselves suggest pulmonary TB.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d3",
    "questionNumber": 3,
    "squareNumber": 0,
    "category": "symptoms",
    "categoryLabel": "A. TB Symptom Identification",
    "section": "A",
    "sectionLabel": "A. TB Symptom Identification",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "A. TB Symptom Identification",
    "question": "Which combination most strongly suggests possible pulmonary TB?",
    "options": [
      "A. Cough + weight loss + fever",
      "B. Rash + itching",
      "C. Joint pain after exercise",
      "D. Isolated toothache"
    ],
    "correctIndex": 0,
    "correctAnswerText": "A. Cough + weight loss + fever",
    "explanation": "A combination of respiratory and constitutional symptoms should prompt consideration of TB.",
    "learningPoint": "Multiple compatible symptoms increase clinical suspicion.",
    "correctFeedback": "A combination of respiratory and constitutional symptoms is more concerning than an isolated nonspecific complaint.",
    "incorrectFeedback": "Incorrect. The other combinations do not provide a typical cluster of clues for pulmonary TB.",
    "clinicalInsight": "A combination of respiratory and constitutional symptoms is more concerning than an isolated nonspecific complaint.",
    "whyRationale": "Incorrect. The other combinations do not provide a typical cluster of clues for pulmonary TB.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d4",
    "questionNumber": 4,
    "squareNumber": 0,
    "category": "symptoms",
    "categoryLabel": "A. TB Symptom Identification",
    "section": "A",
    "sectionLabel": "A. TB Symptom Identification",
    "docType": "true-false",
    "typeLabel": "Quick Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "A. TB Symptom Identification",
    "question": "True or False: Haemoptysis can occur in pulmonary TB.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "correctAnswerText": "True",
    "explanation": "Pulmonary TB may produce haemoptysis, although it is not present in every patient.",
    "learningPoint": "Haemoptysis is a relevant respiratory clue.",
    "correctFeedback": "Haemoptysis may occur in pulmonary TB and is an important respiratory clue.",
    "incorrectFeedback": "False is incorrect. Haemoptysis can occur in pulmonary TB, although it is not present in every patient.",
    "clinicalInsight": "Haemoptysis may occur in pulmonary TB and is an important respiratory clue.",
    "whyRationale": "False is incorrect. Haemoptysis can occur in pulmonary TB, although it is not present in every patient.",
    "referencesDoc": [
      "[2]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d5",
    "questionNumber": 5,
    "squareNumber": 0,
    "category": "symptoms",
    "categoryLabel": "A. TB Symptom Identification",
    "section": "A",
    "sectionLabel": "A. TB Symptom Identification",
    "docType": "yes-no",
    "typeLabel": "Rapid-Fire",
    "difficultyDoc": "Easy",
    "patientClue": "A. TB Symptom Identification",
    "question": "A patient has night sweats and unexplained weight loss. Are these relevant clues while assessing possible TB?",
    "options": [
      "Yes",
      "No"
    ],
    "correctIndex": 0,
    "correctAnswerText": "Yes",
    "explanation": "Constitutional symptoms can support suspicion of TB.",
    "learningPoint": "Not all TB clues are respiratory symptoms.",
    "correctFeedback": "Constitutional symptoms can contribute to suspicion of TB.",
    "incorrectFeedback": "No is incorrect. Night sweats and unexplained weight loss are relevant clinical clues.",
    "clinicalInsight": "Constitutional symptoms can contribute to suspicion of TB.",
    "whyRationale": "No is incorrect. Night sweats and unexplained weight loss are relevant clinical clues.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": true
  },
  {
    "id": "d6",
    "questionNumber": 6,
    "squareNumber": 0,
    "category": "symptoms",
    "categoryLabel": "A. TB Symptom Identification",
    "section": "A",
    "sectionLabel": "A. TB Symptom Identification",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "A. TB Symptom Identification",
    "question": "Which symptom is least useful as a TB clue?",
    "options": [
      "A. Unexplained weight loss",
      "B. Night sweats",
      "C. Prolonged cough",
      "D. Acute ankle injury"
    ],
    "correctIndex": 3,
    "correctAnswerText": "D. Acute ankle injury",
    "explanation": "An isolated mechanical injury does not suggest TB.",
    "learningPoint": "Learn to separate relevant from irrelevant information.",
    "correctFeedback": "Prolonged cough and constitutional symptoms are relevant TB clues.",
    "incorrectFeedback": "Incorrect. An isolated acute ankle injury does not usually contribute to the initial suspicion of pulmonary TB.",
    "clinicalInsight": "Prolonged cough and constitutional symptoms are relevant TB clues.",
    "whyRationale": "Incorrect. An isolated acute ankle injury does not usually contribute to the initial suspicion of pulmonary TB.",
    "referencesDoc": [
      "[2]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d7",
    "questionNumber": 7,
    "squareNumber": 0,
    "category": "symptoms",
    "categoryLabel": "A. TB Symptom Identification",
    "section": "A",
    "sectionLabel": "A. TB Symptom Identification",
    "docType": "yes-no",
    "typeLabel": "Rapid-Fire",
    "difficultyDoc": "Easy",
    "patientClue": "A. TB Symptom Identification",
    "question": "A student sees “loss of appetite” in a TB case vignette. Should this information be considered relevant?",
    "options": [
      "Yes",
      "No"
    ],
    "correctIndex": 0,
    "correctAnswerText": "Yes",
    "explanation": "Loss of appetite may accompany systemic illness and is included among features that can occur in TB.",
    "learningPoint": "Constitutional symptoms matter.",
    "correctFeedback": "Loss of appetite may occur as a constitutional symptom in TB.",
    "incorrectFeedback": "No is incorrect. Although nonspecific, loss of appetite can be relevant when considered with other symptoms.",
    "clinicalInsight": "Loss of appetite may occur as a constitutional symptom in TB.",
    "whyRationale": "No is incorrect. Although nonspecific, loss of appetite can be relevant when considered with other symptoms.",
    "referencesDoc": [
      "[1]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": true
  },
  {
    "id": "d8",
    "questionNumber": 8,
    "squareNumber": 0,
    "category": "symptoms",
    "categoryLabel": "A. TB Symptom Identification",
    "section": "A",
    "sectionLabel": "A. TB Symptom Identification",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "A. TB Symptom Identification",
    "question": "Which of the following is NOT a typical clue that would increase suspicion for pulmonary TB?",
    "options": [
      "A. Prolonged cough",
      "B. Weight loss",
      "C. Night sweats",
      "D. Isolated wrist fracture"
    ],
    "correctIndex": 3,
    "correctAnswerText": "D. Isolated wrist fracture",
    "explanation": "A wrist fracture does not by itself suggest pulmonary TB.",
    "learningPoint": "Avoid being distracted by unrelated information.",
    "correctFeedback": "The first three are clinically relevant symptoms.",
    "incorrectFeedback": "Incorrect. A wrist fracture is not, by itself, a typical clue for pulmonary TB.",
    "clinicalInsight": "The first three are clinically relevant symptoms.",
    "whyRationale": "Incorrect. A wrist fracture is not, by itself, a typical clue for pulmonary TB.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d9",
    "questionNumber": 9,
    "squareNumber": 0,
    "category": "symptoms",
    "categoryLabel": "A. TB Symptom Identification",
    "section": "A",
    "sectionLabel": "A. TB Symptom Identification",
    "docType": "true-false",
    "typeLabel": "Quick Challenge",
    "difficultyDoc": "Moderate",
    "patientClue": "A. TB Symptom Identification",
    "question": "True or False: A patient may have TB even when the classic symptom pattern is incomplete.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "correctAnswerText": "True",
    "explanation": "TB can present variably; absence of one classic symptom does not automatically exclude TB.",
    "learningPoint": "Clinical suspicion should not depend on one symptom alone.",
    "correctFeedback": "TB may present with variable clinical features; not every patient has every classical symptom.",
    "incorrectFeedback": "False is incorrect. Absence of one classical symptom does not automatically exclude TB.",
    "clinicalInsight": "TB may present with variable clinical features; not every patient has every classical symptom.",
    "whyRationale": "False is incorrect. Absence of one classical symptom does not automatically exclude TB.",
    "referencesDoc": [
      "[2]",
      "[3]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d10",
    "questionNumber": 10,
    "squareNumber": 0,
    "category": "symptoms",
    "categoryLabel": "A. TB Symptom Identification",
    "section": "A",
    "sectionLabel": "A. TB Symptom Identification",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Moderate",
    "patientClue": "A. TB Symptom Identification",
    "question": "A patient presents with cough, fever and weight loss. What should the learner do first?",
    "options": [
      "A. Ignore TB",
      "B. Consider TB in the differential diagnosis",
      "C. Diagnose MDR-TB immediately",
      "D. Start a drug-resistant regimen immediately"
    ],
    "correctIndex": 1,
    "correctAnswerText": "B. Consider TB in the differential diagnosis",
    "explanation": "Compatible symptoms should trigger assessment for possible TB rather than immediate assumptions about drug resistance.",
    "learningPoint": "Diagnosis proceeds through a structured pathway.",
    "correctFeedback": "Compatible symptoms should trigger appropriate clinical assessment rather than immediate diagnostic labeling.",
    "incorrectFeedback": "Incorrect. The patient should not be ignored or immediately labeled as having drug-resistant or confirmed TB without appropriate evaluation.",
    "clinicalInsight": "Compatible symptoms should trigger appropriate clinical assessment rather than immediate diagnostic labeling.",
    "whyRationale": "Incorrect. The patient should not be ignored or immediately labeled as having drug-resistant or confirmed TB without appropriate evaluation.",
    "referencesDoc": [
      "[2]",
      "[3]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d11",
    "questionNumber": 11,
    "squareNumber": 0,
    "category": "clinicalClues",
    "categoryLabel": "B. Clinical Clue Identification",
    "section": "B",
    "sectionLabel": "B. Clinical Clue Identification",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "B. Clinical Clue Identification",
    "question": "Which finding is more suggestive of TB than a short, self-limited cough of one day?",
    "options": [
      "A. Prolonged cough",
      "B. One-day cough",
      "C. Sneezing only",
      "D. Finger injury"
    ],
    "correctIndex": 0,
    "correctAnswerText": "A. Prolonged cough",
    "explanation": "Persistent symptoms are more concerning for TB than a brief isolated respiratory complaint.",
    "learningPoint": "Duration and associated symptoms matter.",
    "correctFeedback": "Persistence and duration help determine whether a chronic disease such as TB should be considered.",
    "incorrectFeedback": "Incorrect. A very brief cough is less suggestive of TB than a persistent cough, although clinical context remains important.",
    "clinicalInsight": "Persistence and duration help determine whether a chronic disease such as TB should be considered.",
    "whyRationale": "Incorrect. A very brief cough is less suggestive of TB than a persistent cough, although clinical context remains important.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d12",
    "questionNumber": 12,
    "squareNumber": 0,
    "category": "clinicalClues",
    "categoryLabel": "B. Clinical Clue Identification",
    "section": "B",
    "sectionLabel": "B. Clinical Clue Identification",
    "docType": "yes-no",
    "typeLabel": "Rapid-Fire",
    "difficultyDoc": "Easy",
    "patientClue": "B. Clinical Clue Identification",
    "question": "A patient has chronic cough and progressive weight loss. Is this combination clinically important?",
    "options": [
      "Yes",
      "No"
    ],
    "correctIndex": 0,
    "correctAnswerText": "Yes",
    "explanation": "Together, these findings should prompt assessment for TB and other chronic diseases.",
    "learningPoint": "Think in patterns, not isolated symptoms.",
    "correctFeedback": "The combination of persistent respiratory and systemic symptoms should increase clinical suspicion.",
    "incorrectFeedback": "No is incorrect. The combination is relevant and warrants appropriate assessment.",
    "clinicalInsight": "The combination of persistent respiratory and systemic symptoms should increase clinical suspicion.",
    "whyRationale": "No is incorrect. The combination is relevant and warrants appropriate assessment.",
    "referencesDoc": [
      "[2]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": true
  },
  {
    "id": "d13",
    "questionNumber": 13,
    "squareNumber": 0,
    "category": "clinicalClues",
    "categoryLabel": "B. Clinical Clue Identification",
    "section": "B",
    "sectionLabel": "B. Clinical Clue Identification",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "B. Clinical Clue Identification",
    "question": "Which is the strongest clue among these?",
    "options": [
      "A. Cough with weight loss",
      "B. Hair loss after haircut",
      "C. Knee pain after sport",
      "D. Mild sunburn"
    ],
    "correctIndex": 0,
    "correctAnswerText": "A. Cough with weight loss",
    "explanation": "Cough plus systemic symptoms is much more relevant to pulmonary TB.",
    "learningPoint": "Recognize high-yield clinical clues.",
    "correctFeedback": "Cough associated with systemic symptoms is more relevant to possible pulmonary TB.",
    "incorrectFeedback": "Incorrect. The other options do not provide a typical TB clue pattern.",
    "clinicalInsight": "Cough associated with systemic symptoms is more relevant to possible pulmonary TB.",
    "whyRationale": "Incorrect. The other options do not provide a typical TB clue pattern.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d14",
    "questionNumber": 14,
    "squareNumber": 0,
    "category": "clinicalClues",
    "categoryLabel": "B. Clinical Clue Identification",
    "section": "B",
    "sectionLabel": "B. Clinical Clue Identification",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "B. Clinical Clue Identification",
    "question": "A patient has fever, weight loss and chronic cough. Which piece of information would be most useful next?",
    "options": [
      "A. TB exposure history",
      "B. Favourite food",
      "C. Shoe size",
      "D. Hair colour"
    ],
    "correctIndex": 0,
    "correctAnswerText": "A. TB exposure history",
    "explanation": "Exposure history can significantly alter the likelihood of TB.",
    "learningPoint": "Relevant history improves clinical reasoning.",
    "correctFeedback": "Contact history can provide important epidemiological information.",
    "incorrectFeedback": "Incorrect. Personal preferences and physical details such as shoe size do not usually help determine TB suspicion.",
    "clinicalInsight": "Contact history can provide important epidemiological information.",
    "whyRationale": "Incorrect. Personal preferences and physical details such as shoe size do not usually help determine TB suspicion.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d15",
    "questionNumber": 15,
    "squareNumber": 0,
    "category": "clinicalClues",
    "categoryLabel": "B. Clinical Clue Identification",
    "section": "B",
    "sectionLabel": "B. Clinical Clue Identification",
    "docType": "true-false",
    "typeLabel": "Quick Challenge",
    "difficultyDoc": "Moderate",
    "patientClue": "B. Clinical Clue Identification",
    "question": "True or False: Absence of fever completely rules out TB.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "correctAnswerText": "False",
    "explanation": "TB does not require all classical symptoms to be present.",
    "learningPoint": "Never exclude TB using one absent symptom alone.",
    "correctFeedback": "TB does not require every classical symptom to be present.",
    "incorrectFeedback": "True is incorrect. Absence of fever alone does not exclude TB.",
    "clinicalInsight": "TB does not require every classical symptom to be present.",
    "whyRationale": "True is incorrect. Absence of fever alone does not exclude TB.",
    "referencesDoc": [
      "[2]",
      "[3]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d16",
    "questionNumber": 16,
    "squareNumber": 0,
    "category": "clinicalClues",
    "categoryLabel": "B. Clinical Clue Identification",
    "section": "B",
    "sectionLabel": "B. Clinical Clue Identification",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "B. Clinical Clue Identification",
    "question": "Which patient should attract greater attention for possible TB?",
    "options": [
      "A. Chronic cough + weight loss",
      "B. Mild headache for one hour",
      "C. Minor road-traffic abrasion",
      "D. Acute ankle sprain"
    ],
    "correctIndex": 0,
    "correctAnswerText": "A. Chronic cough + weight loss",
    "explanation": "The first patient has a cluster of TB-compatible symptoms.",
    "learningPoint": "Prioritize patients using clinical probability.",
    "correctFeedback": "The first presentation contains a stronger cluster of TB-compatible features.",
    "incorrectFeedback": "Incorrect. The other presentations do not provide the same degree of TB-related clinical concern.",
    "clinicalInsight": "The first presentation contains a stronger cluster of TB-compatible features.",
    "whyRationale": "Incorrect. The other presentations do not provide the same degree of TB-related clinical concern.",
    "referencesDoc": [
      "[2]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d17",
    "questionNumber": 17,
    "squareNumber": 0,
    "category": "clinicalClues",
    "categoryLabel": "B. Clinical Clue Identification",
    "section": "B",
    "sectionLabel": "B. Clinical Clue Identification",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "B. Clinical Clue Identification",
    "question": "A student is given “persistent cough, fever, weight loss and night sweats.” How many of these are clinically relevant TB clues?",
    "options": [
      "A. One",
      "B. Two",
      "C. Three",
      "D. Four"
    ],
    "correctIndex": 3,
    "correctAnswerText": "D. Four",
    "explanation": "All four can contribute to suspicion of TB.",
    "learningPoint": "Build a mental pattern of TB clues.",
    "correctFeedback": "Several compatible symptoms together strengthen the need to consider TB.",
    "incorrectFeedback": "Incorrect. All four symptoms can be clinically relevant when assessing possible TB.",
    "clinicalInsight": "Several compatible symptoms together strengthen the need to consider TB.",
    "whyRationale": "Incorrect. All four symptoms can be clinically relevant when assessing possible TB.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d18",
    "questionNumber": 18,
    "squareNumber": 0,
    "category": "clinicalClues",
    "categoryLabel": "B. Clinical Clue Identification",
    "section": "B",
    "sectionLabel": "B. Clinical Clue Identification",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Moderate",
    "patientClue": "B. Clinical Clue Identification",
    "question": "Which statement is most appropriate?",
    "options": [
      "A. One symptom proves TB",
      "B. A group of compatible features raises suspicion",
      "C. Weight loss alone proves TB",
      "D. Cough always means TB"
    ],
    "correctIndex": 1,
    "correctAnswerText": "B. A group of compatible features raises suspicion",
    "explanation": "Symptoms establish suspicion but do not alone establish microbiological confirmation.",
    "learningPoint": "Suspicion is not the same as diagnosis.",
    "correctFeedback": "Symptoms and clinical clues raise suspicion; they do not by themselves establish confirmation.",
    "incorrectFeedback": "Incorrect. No single symptom proves TB, and TB cannot be diagnosed from symptoms alone.",
    "clinicalInsight": "Symptoms and clinical clues raise suspicion; they do not by themselves establish confirmation.",
    "whyRationale": "Incorrect. No single symptom proves TB, and TB cannot be diagnosed from symptoms alone.",
    "referencesDoc": [
      "[2]",
      "[3]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d19",
    "questionNumber": 19,
    "squareNumber": 0,
    "category": "riskFactors",
    "categoryLabel": "C. Risk-Factor Identification",
    "section": "C",
    "sectionLabel": "C. Risk-Factor Identification",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "C. Risk-Factor Identification",
    "question": "Which condition substantially increases the risk of developing TB disease?",
    "options": [
      "A. HIV infection",
      "B. Myopia",
      "C. Dental caries",
      "D. Simple sprain"
    ],
    "correctIndex": 0,
    "correctAnswerText": "A. HIV infection",
    "explanation": "People living with HIV have substantially increased risk of TB disease.",
    "learningPoint": "Always consider TB in appropriate patients with HIV.",
    "correctFeedback": "HIV infection is an important risk context for TB disease.",
    "incorrectFeedback": "Incorrect. Myopia, dental caries and a simple sprain do not carry the same TB association.",
    "clinicalInsight": "HIV infection is an important risk context for TB disease.",
    "whyRationale": "Incorrect. Myopia, dental caries and a simple sprain do not carry the same TB association.",
    "referencesDoc": [
      "[4]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d20",
    "questionNumber": 20,
    "squareNumber": 0,
    "category": "riskFactors",
    "categoryLabel": "C. Risk-Factor Identification",
    "section": "C",
    "sectionLabel": "C. Risk-Factor Identification",
    "docType": "true-false",
    "typeLabel": "Quick Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "C. Risk-Factor Identification",
    "question": "True or False: HIV status is relevant when evaluating a patient for TB.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "correctAnswerText": "True",
    "explanation": "HIV is an important TB-associated condition and influences assessment and management.",
    "learningPoint": "TB and HIV must be considered together.",
    "correctFeedback": "HIV status is an important part of the clinical assessment of possible TB.",
    "incorrectFeedback": "No is incorrect. HIV and TB are clinically important coexisting conditions.",
    "clinicalInsight": "HIV status is an important part of the clinical assessment of possible TB.",
    "whyRationale": "No is incorrect. HIV and TB are clinically important coexisting conditions.",
    "referencesDoc": [
      "[1]",
      "[4]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d21",
    "questionNumber": 21,
    "squareNumber": 0,
    "category": "riskFactors",
    "categoryLabel": "C. Risk-Factor Identification",
    "section": "C",
    "sectionLabel": "C. Risk-Factor Identification",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "C. Risk-Factor Identification",
    "question": "Which is a relevant TB risk factor?",
    "options": [
      "A. Close contact with a person with infectious TB",
      "B. Wearing spectacles",
      "C. Left-handedness",
      "D. Preference for spicy food"
    ],
    "correctIndex": 0,
    "correctAnswerText": "A. Close contact with a person with infectious TB",
    "explanation": "Close contact increases opportunity for TB transmission and infection.",
    "learningPoint": "Always ask about TB contact.",
    "correctFeedback": "Close contact can increase the risk of TB infection and disease.",
    "incorrectFeedback": "Incorrect. The other characteristics do not represent relevant TB exposure factors.",
    "clinicalInsight": "Close contact can increase the risk of TB infection and disease.",
    "whyRationale": "Incorrect. The other characteristics do not represent relevant TB exposure factors.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d22",
    "questionNumber": 22,
    "squareNumber": 0,
    "category": "riskFactors",
    "categoryLabel": "C. Risk-Factor Identification",
    "section": "C",
    "sectionLabel": "C. Risk-Factor Identification",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "C. Risk-Factor Identification",
    "question": "A student is asked which history is more relevant in suspected TB.",
    "options": [
      "A. Household TB contact",
      "B. Favourite sports team",
      "C. Preferred colour",
      "D. Shoe brand"
    ],
    "correctIndex": 0,
    "correctAnswerText": "A. Household TB contact",
    "explanation": "Household exposure is an important epidemiological clue.",
    "learningPoint": "Exposure history belongs in TB assessment.",
    "correctFeedback": "Household exposure is important epidemiological information.",
    "incorrectFeedback": "Incorrect. The other details do not help identify TB exposure.",
    "clinicalInsight": "Household exposure is important epidemiological information.",
    "whyRationale": "Incorrect. The other details do not help identify TB exposure.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d23",
    "questionNumber": 23,
    "squareNumber": 0,
    "category": "riskFactors",
    "categoryLabel": "C. Risk-Factor Identification",
    "section": "C",
    "sectionLabel": "C. Risk-Factor Identification",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "C. Risk-Factor Identification",
    "question": "Which patient requires particular attention for TB screening?",
    "options": [
      "A. Person with HIV",
      "B. Person with uncomplicated refractive error",
      "C. Healthy athlete after exercise",
      "D. Patient with minor abrasion"
    ],
    "correctIndex": 0,
    "correctAnswerText": "A. Person with HIV",
    "explanation": "HIV is a major risk factor for TB disease.",
    "learningPoint": "Risk assessment changes pre-test probability.",
    "correctFeedback": "HIV increases the importance of considering TB.",
    "incorrectFeedback": "Incorrect. The other conditions do not have the same specific relevance to TB risk.",
    "clinicalInsight": "HIV increases the importance of considering TB.",
    "whyRationale": "Incorrect. The other conditions do not have the same specific relevance to TB risk.",
    "referencesDoc": [
      "[4]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d24",
    "questionNumber": 24,
    "squareNumber": 0,
    "category": "riskFactors",
    "categoryLabel": "C. Risk-Factor Identification",
    "section": "C",
    "sectionLabel": "C. Risk-Factor Identification",
    "docType": "true-false",
    "typeLabel": "Quick Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "C. Risk-Factor Identification",
    "question": "True or False: A person living in the same household as a patient with infectious TB may have increased risk of TB infection.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "correctAnswerText": "True",
    "explanation": "Close household exposure is an important transmission risk.",
    "learningPoint": "Contact investigation is an important TB-control strategy.",
    "correctFeedback": "Close household exposure is an important component of TB contact assessment.",
    "incorrectFeedback": "False is incorrect. Household contact can be an important epidemiological clue.",
    "clinicalInsight": "Close household exposure is an important component of TB contact assessment.",
    "whyRationale": "False is incorrect. Household contact can be an important epidemiological clue.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d25",
    "questionNumber": 25,
    "squareNumber": 0,
    "category": "riskFactors",
    "categoryLabel": "C. Risk-Factor Identification",
    "section": "C",
    "sectionLabel": "C. Risk-Factor Identification",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "C. Risk-Factor Identification",
    "question": "Which history is most important when evaluating a patient with chronic cough?",
    "options": [
      "A. Contact with a known TB patient",
      "B. Favourite movie",
      "C. Hair style",
      "D. Handwriting preference"
    ],
    "correctIndex": 0,
    "correctAnswerText": "A. Contact with a known TB patient",
    "explanation": "Exposure history can provide a major clue to TB risk.",
    "learningPoint": "Good clinical history is part of diagnosis.",
    "correctFeedback": "Exposure history helps determine the likelihood that TB should be considered.",
    "incorrectFeedback": "Incorrect. Important exposure information should not be overlooked during the history.",
    "clinicalInsight": "Exposure history helps determine the likelihood that TB should be considered.",
    "whyRationale": "Incorrect. Important exposure information should not be overlooked during the history.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d26",
    "questionNumber": 26,
    "squareNumber": 0,
    "category": "riskFactors",
    "categoryLabel": "C. Risk-Factor Identification",
    "section": "C",
    "sectionLabel": "C. Risk-Factor Identification",
    "docType": "yes-no",
    "typeLabel": "Rapid-Fire",
    "difficultyDoc": "Moderate",
    "patientClue": "C. Risk-Factor Identification",
    "question": "A patient with chronic cough reports living in a crowded household where another person recently had TB. Does this information increase concern?",
    "options": [
      "Yes",
      "No"
    ],
    "correctIndex": 0,
    "correctAnswerText": "Yes",
    "explanation": "Close contact and crowded living environments can increase TB transmission risk.",
    "learningPoint": "Epidemiology strengthens clinical suspicion.",
    "correctFeedback": "Symptoms plus relevant exposure history provide stronger reason to consider TB.",
    "incorrectFeedback": "No is incorrect. A significant TB contact is an important clinical clue.",
    "clinicalInsight": "Symptoms plus relevant exposure history provide stronger reason to consider TB.",
    "whyRationale": "No is incorrect. A significant TB contact is an important clinical clue.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": true
  },
  {
    "id": "d27",
    "questionNumber": 27,
    "squareNumber": 0,
    "category": "patientHistory",
    "categoryLabel": "D. Patient History",
    "section": "D",
    "sectionLabel": "D. Patient History",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "D. Patient History",
    "question": "A patient with chronic cough comes to the clinic. Which history should be specifically sought?",
    "options": [
      "A. TB contact",
      "B. Favourite food",
      "C. Shoe size",
      "D. Preferred music"
    ],
    "correctIndex": 0,
    "correctAnswerText": "A. TB contact",
    "explanation": "TB exposure history can materially influence clinical suspicion.",
    "learningPoint": "Ask targeted questions rather than random questions.",
    "correctFeedback": "Focused history should include relevant exposure to TB.",
    "incorrectFeedback": "Incorrect. A targeted TB history should include exposure/contact information.",
    "clinicalInsight": "Focused history should include relevant exposure to TB.",
    "whyRationale": "Incorrect. A targeted TB history should include exposure/contact information.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d28",
    "questionNumber": 28,
    "squareNumber": 0,
    "category": "patientHistory",
    "categoryLabel": "D. Patient History",
    "section": "D",
    "sectionLabel": "D. Patient History",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "D. Patient History",
    "question": "Which question is most appropriate?",
    "options": [
      "A. “Has anyone at home or work had TB?”",
      "B. “What is your favourite colour?”",
      "C. “Do you prefer tea?”",
      "D. “What is your shoe size?”"
    ],
    "correctIndex": 0,
    "correctAnswerText": "A. “Has anyone at home or work had TB?”",
    "explanation": "Contact history is relevant epidemiological information.",
    "learningPoint": "Targeted history improves diagnostic reasoning.",
    "correctFeedback": "Asking about TB exposure can reveal an important epidemiological clue.",
    "incorrectFeedback": "Incorrect. The other questions do not meaningfully assess TB exposure.",
    "clinicalInsight": "Asking about TB exposure can reveal an important epidemiological clue.",
    "whyRationale": "Incorrect. The other questions do not meaningfully assess TB exposure.",
    "referencesDoc": [
      "[2]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d29",
    "questionNumber": 29,
    "squareNumber": 0,
    "category": "patientHistory",
    "categoryLabel": "D. Patient History",
    "section": "D",
    "sectionLabel": "D. Patient History",
    "docType": "true-false",
    "typeLabel": "Quick Challenge",
    "difficultyDoc": "Moderate",
    "patientClue": "D. Patient History",
    "question": "True or False: Previous history of TB is relevant when evaluating a patient with current TB-like symptoms.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 0,
    "correctAnswerText": "True",
    "explanation": "Previous TB may affect clinical assessment and raises important questions about prior treatment and drug resistance.",
    "learningPoint": "Always clarify previous TB history.",
    "correctFeedback": "Previous TB treatment/history is clinically important in the assessment of a patient with recurrent symptoms.",
    "incorrectFeedback": "False is incorrect. Previous TB is relevant and should be specifically asked about.",
    "clinicalInsight": "Previous TB treatment/history is clinically important in the assessment of a patient with recurrent symptoms.",
    "whyRationale": "False is incorrect. Previous TB is relevant and should be specifically asked about.",
    "referencesDoc": [
      "[4]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d30",
    "questionNumber": 30,
    "squareNumber": 0,
    "category": "patientHistory",
    "categoryLabel": "D. Patient History",
    "section": "D",
    "sectionLabel": "D. Patient History",
    "docType": "yes-no",
    "typeLabel": "Rapid-Fire",
    "difficultyDoc": "Moderate",
    "patientClue": "D. Patient History",
    "question": "A patient says, “I was treated for TB two years ago and now have recurrent symptoms.” Is this important information?",
    "options": [
      "Yes",
      "No"
    ],
    "correctIndex": 0,
    "correctAnswerText": "Yes",
    "explanation": "Previous TB treatment is highly relevant to current evaluation and drug-resistance risk assessment.",
    "learningPoint": "Previous treatment history matters.",
    "correctFeedback": "Previous TB treatment is important information and may influence further evaluation.",
    "incorrectFeedback": "No is incorrect. Previous TB history should not be overlooked.",
    "clinicalInsight": "Previous TB treatment is important information and may influence further evaluation.",
    "whyRationale": "No is incorrect. Previous TB history should not be overlooked.",
    "referencesDoc": [
      "[4]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": true
  },
  {
    "id": "d31",
    "questionNumber": 31,
    "squareNumber": 0,
    "category": "patientHistory",
    "categoryLabel": "D. Patient History",
    "section": "D",
    "sectionLabel": "D. Patient History",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "D. Patient History",
    "question": "Which history item is least relevant to initial TB suspicion?",
    "options": [
      "A. TB contact",
      "B. Previous TB treatment",
      "C. HIV status",
      "D. Favourite cricket team"
    ],
    "correctIndex": 3,
    "correctAnswerText": "D. Favourite cricket team",
    "explanation": "The cricket team has no diagnostic relevance.",
    "learningPoint": "Learn to filter clinical information.",
    "correctFeedback": "TB contact, previous TB and HIV status are medically relevant.",
    "incorrectFeedback": "Incorrect. The cricket team does not contribute to TB assessment.",
    "clinicalInsight": "TB contact, previous TB and HIV status are medically relevant.",
    "whyRationale": "Incorrect. The cricket team does not contribute to TB assessment.",
    "referencesDoc": [
      "[2]",
      "[4]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d32",
    "questionNumber": 32,
    "squareNumber": 0,
    "category": "patientHistory",
    "categoryLabel": "D. Patient History",
    "section": "D",
    "sectionLabel": "D. Patient History",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "D. Patient History",
    "question": "A student is given this history: “Cough for several weeks, weight loss, previous TB contact, and owns a red motorcycle.” Which information should be prioritized?",
    "options": [
      "A. Motorcycle colour",
      "B. Cough, weight loss and TB contact"
    ],
    "correctIndex": 1,
    "correctAnswerText": "B. Cough, weight loss and TB contact",
    "explanation": "The latter directly contributes to TB clinical suspicion.",
    "learningPoint": "Focus on discriminative information.",
    "correctFeedback": "Clinical reasoning requires identification of information that meaningfully changes diagnostic suspicion.",
    "incorrectFeedback": "Incorrect. The motorcycle colour is an irrelevant distractor.",
    "clinicalInsight": "Clinical reasoning requires identification of information that meaningfully changes diagnostic suspicion.",
    "whyRationale": "Incorrect. The motorcycle colour is an irrelevant distractor.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d33",
    "questionNumber": 33,
    "squareNumber": 0,
    "category": "exposure",
    "categoryLabel": "E. TB Exposure / Contact",
    "section": "E",
    "sectionLabel": "E. TB Exposure / Contact",
    "docType": "yes-no",
    "typeLabel": "Rapid-Fire",
    "difficultyDoc": "Easy",
    "patientClue": "E. TB Exposure / Contact",
    "question": "A child lives with a family member diagnosed with TB. Is this clinically important?",
    "options": [
      "Yes",
      "No"
    ],
    "correctIndex": 0,
    "correctAnswerText": "Yes",
    "explanation": "Household exposure is important when assessing a child for TB infection/disease.",
    "learningPoint": "Always ask about household exposure.",
    "correctFeedback": "Household TB exposure is important when evaluating a child for possible TB.",
    "incorrectFeedback": "No is incorrect. Contact history is particularly important in pediatric TB assessment.",
    "clinicalInsight": "Household TB exposure is important when evaluating a child for possible TB.",
    "whyRationale": "No is incorrect. Contact history is particularly important in pediatric TB assessment.",
    "referencesDoc": [
      "[2]",
      "[3]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": true
  },
  {
    "id": "d34",
    "questionNumber": 34,
    "squareNumber": 0,
    "category": "exposure",
    "categoryLabel": "E. TB Exposure / Contact",
    "section": "E",
    "sectionLabel": "E. TB Exposure / Contact",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "E. TB Exposure / Contact",
    "question": "Which contact is most relevant?",
    "options": [
      "A. Household member with TB",
      "B. Friend with common cold six months ago",
      "C. Neighbour with ankle fracture",
      "D. Teacher with migraine"
    ],
    "correctIndex": 0,
    "correctAnswerText": "A. Household member with TB",
    "explanation": "Close contact with an infectious TB patient is an important exposure history.",
    "learningPoint": "Not all contacts are equivalent.",
    "correctFeedback": "A household member with TB represents a relevant exposure.",
    "incorrectFeedback": "Incorrect. The other contacts do not represent a comparable TB exposure.",
    "clinicalInsight": "A household member with TB represents a relevant exposure.",
    "whyRationale": "Incorrect. The other contacts do not represent a comparable TB exposure.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d35",
    "questionNumber": 35,
    "squareNumber": 0,
    "category": "exposure",
    "categoryLabel": "E. TB Exposure / Contact",
    "section": "E",
    "sectionLabel": "E. TB Exposure / Contact",
    "docType": "true-false",
    "typeLabel": "Quick Challenge",
    "difficultyDoc": "Moderate",
    "patientClue": "E. TB Exposure / Contact",
    "question": "True or False: TB contact history is irrelevant if the patient has no fever.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "correctAnswerText": "False",
    "explanation": "Exposure history remains relevant even if the patient lacks one classical symptom.",
    "learningPoint": "Do not discard important epidemiological clues.",
    "correctFeedback": "Contact history remains relevant even when a classical symptom is absent.",
    "incorrectFeedback": "True is incorrect. Absence of fever does not make exposure history irrelevant.",
    "clinicalInsight": "Contact history remains relevant even when a classical symptom is absent.",
    "whyRationale": "True is incorrect. Absence of fever does not make exposure history irrelevant.",
    "referencesDoc": [
      "[2]",
      "[3]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d36",
    "questionNumber": 36,
    "squareNumber": 0,
    "category": "exposure",
    "categoryLabel": "E. TB Exposure / Contact",
    "section": "E",
    "sectionLabel": "E. TB Exposure / Contact",
    "docType": "yes-no",
    "typeLabel": "Rapid-Fire",
    "difficultyDoc": "Easy",
    "patientClue": "E. TB Exposure / Contact",
    "question": "A student asks a patient with chronic cough, “Has anyone in your household been diagnosed with TB?” The patient says yes. Should this answer influence the next decision?",
    "options": [
      "Yes",
      "No"
    ],
    "correctIndex": 0,
    "correctAnswerText": "Yes",
    "explanation": "The answer increases concern and supports further evaluation.",
    "learningPoint": "History should influence decision-making.",
    "correctFeedback": "Relevant history should influence clinical suspicion and the need for further assessment.",
    "incorrectFeedback": "No is incorrect. The exposure history is an important clue.",
    "clinicalInsight": "Relevant history should influence clinical suspicion and the need for further assessment.",
    "whyRationale": "No is incorrect. The exposure history is an important clue.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": true
  },
  {
    "id": "d37",
    "questionNumber": 37,
    "squareNumber": 0,
    "category": "exposure",
    "categoryLabel": "E. TB Exposure / Contact",
    "section": "E",
    "sectionLabel": "E. TB Exposure / Contact",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Moderate",
    "patientClue": "E. TB Exposure / Contact",
    "question": "Which person requires closer evaluation after a significant TB household exposure?",
    "options": [
      "A. Child household contact",
      "B. Person who saw a TB poster",
      "C. Unrelated shopkeeper",
      "D. Person who owns a stethoscope"
    ],
    "correctIndex": 0,
    "correctAnswerText": "A. Child household contact",
    "explanation": "Children exposed to TB require particular clinical assessment.",
    "learningPoint": "Contact history is especially important in children.",
    "correctFeedback": "A child with household TB exposure warrants appropriate evaluation because contact is clinically significant.",
    "incorrectFeedback": "Incorrect. Simply seeing TB information or having an unrelated characteristic is not equivalent to TB exposure.",
    "clinicalInsight": "A child with household TB exposure warrants appropriate evaluation because contact is clinically significant.",
    "whyRationale": "Incorrect. Simply seeing TB information or having an unrelated characteristic is not equivalent to TB exposure.",
    "referencesDoc": [
      "[3]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d38",
    "questionNumber": 38,
    "squareNumber": 0,
    "category": "clinicalReasoning",
    "categoryLabel": "F. Relevant vs Non-Relevant Clinical Information",
    "section": "F",
    "sectionLabel": "F. Relevant vs Non-Relevant Clinical Information",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "F. Relevant vs Non-Relevant Clinical Information",
    "question": "Which information is most relevant in a patient with suspected pulmonary TB?",
    "options": [
      "A. Cough duration",
      "B. Shoe size",
      "C. Favourite colour",
      "D. Hair style"
    ],
    "correctIndex": 0,
    "correctAnswerText": "A. Cough duration",
    "explanation": "Duration and nature of symptoms help establish clinical suspicion.",
    "learningPoint": "Identify information that changes clinical probability.",
    "correctFeedback": "The duration of symptoms helps determine whether a chronic condition such as TB should be considered.",
    "incorrectFeedback": "Incorrect. The other details do not ordinarily contribute to the initial assessment of TB.",
    "clinicalInsight": "The duration of symptoms helps determine whether a chronic condition such as TB should be considered.",
    "whyRationale": "Incorrect. The other details do not ordinarily contribute to the initial assessment of TB.",
    "referencesDoc": [
      "[2]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d39",
    "questionNumber": 39,
    "squareNumber": 0,
    "category": "clinicalReasoning",
    "categoryLabel": "F. Relevant vs Non-Relevant Clinical Information",
    "section": "F",
    "sectionLabel": "F. Relevant vs Non-Relevant Clinical Information",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "F. Relevant vs Non-Relevant Clinical Information",
    "question": "Which is least relevant to TB diagnosis?",
    "options": [
      "A. Previous TB treatment",
      "B. HIV status",
      "C. TB contact",
      "D. Favourite football team"
    ],
    "correctIndex": 3,
    "correctAnswerText": "D. Favourite football team",
    "explanation": "The first three can influence TB assessment.",
    "learningPoint": "Filter out distracting information.",
    "correctFeedback": "Previous TB, HIV status and TB contact are medically relevant.",
    "incorrectFeedback": "Incorrect. The football team has no meaningful role in TB assessment.",
    "clinicalInsight": "Previous TB, HIV status and TB contact are medically relevant.",
    "whyRationale": "Incorrect. The football team has no meaningful role in TB assessment.",
    "referencesDoc": [
      "[2]",
      "[4]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d40",
    "questionNumber": 40,
    "squareNumber": 0,
    "category": "clinicalReasoning",
    "categoryLabel": "F. Relevant vs Non-Relevant Clinical Information",
    "section": "F",
    "sectionLabel": "F. Relevant vs Non-Relevant Clinical Information",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "F. Relevant vs Non-Relevant Clinical Information",
    "question": "A case contains 12 pieces of information. Only cough, weight loss, TB contact and HIV status are directly relevant to TB assessment. What should the student do?",
    "options": [
      "A. Use every piece equally",
      "B. Prioritize clinically relevant information"
    ],
    "correctIndex": 1,
    "correctAnswerText": "B. Prioritize clinically relevant information",
    "explanation": "Clinical reasoning requires prioritization of information.",
    "learningPoint": "Good diagnosticians identify high-value information.",
    "correctFeedback": "Clinical reasoning requires prioritizing information that has diagnostic relevance.",
    "incorrectFeedback": "Yes is incorrect. Some details are important clues, while others are distractors.",
    "clinicalInsight": "Clinical reasoning requires prioritizing information that has diagnostic relevance.",
    "whyRationale": "Yes is incorrect. Some details are important clues, while others are distractors.",
    "referencesDoc": [
      "[2]",
      "[4]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d41",
    "questionNumber": 41,
    "squareNumber": 0,
    "category": "clinicalReasoning",
    "categoryLabel": "F. Relevant vs Non-Relevant Clinical Information",
    "section": "F",
    "sectionLabel": "F. Relevant vs Non-Relevant Clinical Information",
    "docType": "true-false",
    "typeLabel": "Quick Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "F. Relevant vs Non-Relevant Clinical Information",
    "question": "True or False: Every detail in a clinical vignette has equal diagnostic importance.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "correctAnswerText": "False",
    "explanation": "Some information is highly discriminative while other details are distractors.",
    "learningPoint": "Learn to identify high-yield clues.",
    "correctFeedback": "Good clinical reasoning involves identifying high-value clues.",
    "incorrectFeedback": "True is incorrect. Clinical vignettes may intentionally contain irrelevant information.",
    "clinicalInsight": "Good clinical reasoning involves identifying high-value clues.",
    "whyRationale": "True is incorrect. Clinical vignettes may intentionally contain irrelevant information.",
    "referencesDoc": [
      "[2]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d42",
    "questionNumber": 42,
    "squareNumber": 0,
    "category": "clinicalReasoning",
    "categoryLabel": "F. Relevant vs Non-Relevant Clinical Information",
    "section": "F",
    "sectionLabel": "F. Relevant vs Non-Relevant Clinical Information",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "F. Relevant vs Non-Relevant Clinical Information",
    "question": "Which group contains only relevant TB information?",
    "options": [
      "A. Cough, weight loss, TB contact, HIV status",
      "B. Hair colour, shoe size, favourite food, handwriting"
    ],
    "correctIndex": 0,
    "correctAnswerText": "A. Cough, weight loss, TB contact, HIV status",
    "explanation": "These are clinically meaningful for TB assessment.",
    "learningPoint": "Recognize the “TB clue cluster.”",
    "correctFeedback": "These clinical and epidemiological factors can contribute to TB assessment.",
    "incorrectFeedback": "Incorrect. The second group contains largely irrelevant information for initial TB assessment.",
    "clinicalInsight": "These clinical and epidemiological factors can contribute to TB assessment.",
    "whyRationale": "Incorrect. The second group contains largely irrelevant information for initial TB assessment.",
    "referencesDoc": [
      "[2]",
      "[4]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d43",
    "questionNumber": 43,
    "squareNumber": 0,
    "category": "presumptiveTB",
    "categoryLabel": "G. Introductory Decision-Making Challenges",
    "section": "G",
    "sectionLabel": "G. Introductory Decision-Making Challenges",
    "docType": "yes-no",
    "typeLabel": "Rapid-Fire",
    "difficultyDoc": "Moderate",
    "patientClue": "G. Introductory Decision-Making Challenges",
    "question": "A patient has symptoms suggestive of TB. Should the learner immediately label the patient as “confirmed TB”?",
    "options": [
      "Yes",
      "No"
    ],
    "correctIndex": 1,
    "correctAnswerText": "No",
    "explanation": "Symptoms create suspicion; confirmation requires appropriate diagnostic evaluation.",
    "learningPoint": "Presumptive TB ≠ confirmed TB.",
    "correctFeedback": "Clinical suspicion and confirmed TB are different concepts. Further diagnostic evaluation is required.",
    "incorrectFeedback": "Yes is incorrect. Symptoms alone do not establish confirmed TB.",
    "clinicalInsight": "Clinical suspicion and confirmed TB are different concepts. Further diagnostic evaluation is required.",
    "whyRationale": "Yes is incorrect. Symptoms alone do not establish confirmed TB.",
    "referencesDoc": [
      "[1]",
      "[2]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": true
  },
  {
    "id": "d44",
    "questionNumber": 44,
    "squareNumber": 0,
    "category": "presumptiveTB",
    "categoryLabel": "G. Introductory Decision-Making Challenges",
    "section": "G",
    "sectionLabel": "G. Introductory Decision-Making Challenges",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Moderate",
    "patientClue": "G. Introductory Decision-Making Challenges",
    "question": "Which statement is correct?",
    "options": [
      "A. Symptoms alone confirm TB",
      "B. Symptoms initiate diagnostic evaluation"
    ],
    "correctIndex": 1,
    "correctAnswerText": "B. Symptoms initiate diagnostic evaluation",
    "explanation": "Clinical symptoms trigger the diagnostic pathway; testing is required for confirmation when indicated.",
    "learningPoint": "Move from suspicion to investigation systematically.",
    "correctFeedback": "Symptoms help identify a patient who may require evaluation for TB.",
    "incorrectFeedback": "Incorrect. Symptoms alone are not sufficient to confirm TB.",
    "clinicalInsight": "Symptoms help identify a patient who may require evaluation for TB.",
    "whyRationale": "Incorrect. Symptoms alone are not sufficient to confirm TB.",
    "referencesDoc": [
      "[2]",
      "[3]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d45",
    "questionNumber": 45,
    "squareNumber": 0,
    "category": "presumptiveTB",
    "categoryLabel": "G. Introductory Decision-Making Challenges",
    "section": "G",
    "sectionLabel": "G. Introductory Decision-Making Challenges",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Easy",
    "patientClue": "G. Introductory Decision-Making Challenges",
    "question": "A patient with TB-compatible symptoms has a known household TB contact. What is the most appropriate mindset?",
    "options": [
      "A. Ignore the contact",
      "B. Increase attention to possible TB"
    ],
    "correctIndex": 1,
    "correctAnswerText": "B. Increase attention to possible TB",
    "explanation": "Symptoms plus exposure history strengthen suspicion.",
    "learningPoint": "Combine clinical and epidemiological clues.",
    "correctFeedback": "Clinical and epidemiological information should be integrated.",
    "incorrectFeedback": "Incorrect. The contact history should not be ignored.",
    "clinicalInsight": "Clinical and epidemiological information should be integrated.",
    "whyRationale": "Incorrect. The contact history should not be ignored.",
    "referencesDoc": [
      "[2]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d46",
    "questionNumber": 46,
    "squareNumber": 0,
    "category": "presumptiveTB",
    "categoryLabel": "G. Introductory Decision-Making Challenges",
    "section": "G",
    "sectionLabel": "G. Introductory Decision-Making Challenges",
    "docType": "true-false",
    "typeLabel": "Quick Challenge",
    "difficultyDoc": "Moderate",
    "patientClue": "G. Introductory Decision-Making Challenges",
    "question": "True or False: The same clinical algorithm can be applied without modification to every patient regardless of age or HIV status.",
    "options": [
      "True",
      "False"
    ],
    "correctIndex": 1,
    "correctAnswerText": "False",
    "explanation": "TB diagnostic pathways may differ according to age, HIV status and clinical context.",
    "learningPoint": "Patient characteristics matter.",
    "correctFeedback": "TB assessment and diagnostic pathways may differ according to patient characteristics and clinical context.",
    "incorrectFeedback": "True is incorrect. Age, HIV status and other clinical circumstances can affect the diagnostic approach.",
    "clinicalInsight": "TB assessment and diagnostic pathways may differ according to patient characteristics and clinical context.",
    "whyRationale": "True is incorrect. Age, HIV status and other clinical circumstances can affect the diagnostic approach.",
    "referencesDoc": [
      "[2]",
      "[3]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d47",
    "questionNumber": 47,
    "squareNumber": 0,
    "category": "presumptiveTB",
    "categoryLabel": "G. Introductory Decision-Making Challenges",
    "section": "G",
    "sectionLabel": "G. Introductory Decision-Making Challenges",
    "docType": "yes-no",
    "typeLabel": "Rapid-Fire",
    "difficultyDoc": "Easy",
    "patientClue": "G. Introductory Decision-Making Challenges",
    "question": "A child has a TB symptom and a history of household TB exposure. Should the clinician consider TB evaluation?",
    "options": [
      "Yes",
      "No"
    ],
    "correctIndex": 0,
    "correctAnswerText": "Yes",
    "explanation": "Symptoms plus contact history are important in pediatric TB assessment.",
    "learningPoint": "Pediatric TB requires specific attention to exposure.",
    "correctFeedback": "Symptoms combined with relevant exposure warrant appropriate consideration of TB.",
    "incorrectFeedback": "No is incorrect. Both clinical and contact information are important in pediatric assessment.",
    "clinicalInsight": "Symptoms combined with relevant exposure warrant appropriate consideration of TB.",
    "whyRationale": "No is incorrect. Both clinical and contact information are important in pediatric assessment.",
    "referencesDoc": [
      "[3]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": true
  },
  {
    "id": "d48",
    "questionNumber": 48,
    "squareNumber": 0,
    "category": "presumptiveTB",
    "categoryLabel": "G. Introductory Decision-Making Challenges",
    "section": "G",
    "sectionLabel": "G. Introductory Decision-Making Challenges",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Moderate",
    "patientClue": "G. Introductory Decision-Making Challenges",
    "question": "A patient with symptoms of TB also has HIV infection. Which statement is best?",
    "options": [
      "A. HIV is irrelevant",
      "B. HIV should be considered during TB assessment",
      "C. HIV excludes TB",
      "D. TB excludes HIV"
    ],
    "correctIndex": 1,
    "correctAnswerText": "B. HIV should be considered during TB assessment",
    "explanation": "HIV substantially increases TB risk and affects diagnostic considerations.",
    "learningPoint": "Think about TB–HIV together.",
    "correctFeedback": "HIV is an important clinical factor associated with TB and should be incorporated into assessment.",
    "incorrectFeedback": "Incorrect. HIV is not irrelevant, and it does not by itself confirm or exclude TB.",
    "clinicalInsight": "HIV is an important clinical factor associated with TB and should be incorporated into assessment.",
    "whyRationale": "Incorrect. HIV is not irrelevant, and it does not by itself confirm or exclude TB.",
    "referencesDoc": [
      "[4]",
      "[5]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d49",
    "questionNumber": 49,
    "squareNumber": 0,
    "category": "presumptiveTB",
    "categoryLabel": "G. Introductory Decision-Making Challenges",
    "section": "G",
    "sectionLabel": "G. Introductory Decision-Making Challenges",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Moderate",
    "patientClue": "G. Introductory Decision-Making Challenges",
    "question": "Which statement best represents the purpose of a TB diagnostic algorithm?",
    "options": [
      "A. Memorize boxes only",
      "B. Guide sequential clinical and diagnostic decisions",
      "C. Replace clinical judgment entirely",
      "D. Avoid laboratory testing"
    ],
    "correctIndex": 1,
    "correctAnswerText": "B. Guide sequential clinical and diagnostic decisions",
    "explanation": "An algorithm provides a structured pathway for assessment and testing.",
    "learningPoint": "Understand the logic, not merely the flowchart.",
    "correctFeedback": "A diagnostic algorithm provides a structured pathway for making appropriate clinical and diagnostic decisions.",
    "incorrectFeedback": "Incorrect. An algorithm is a guide to systematic evaluation; it does not replace clinical judgment or eliminate the need for appropriate testing.",
    "clinicalInsight": "A diagnostic algorithm provides a structured pathway for making appropriate clinical and diagnostic decisions.",
    "whyRationale": "Incorrect. An algorithm is a guide to systematic evaluation; it does not replace clinical judgment or eliminate the need for appropriate testing.",
    "referencesDoc": [
      "[1]",
      "[2]",
      "[3]"
    ],
    "marks": 10,
    "xp": 4,
    "isRapid": false
  },
  {
    "id": "d50",
    "questionNumber": 50,
    "squareNumber": 100,
    "category": "presumptiveTB",
    "categoryLabel": "G. Introductory Decision-Making Challenges",
    "section": "G",
    "sectionLabel": "G. Introductory Decision-Making Challenges",
    "docType": "mcq",
    "typeLabel": "Clinical Challenge",
    "difficultyDoc": "Moderate",
    "patientClue": "G. Introductory Decision-Making Challenges",
    "question": "Final Snake Challenge: A patient has prolonged cough, weight loss, night sweats and a household history of TB. What should the student recognize?",
    "options": [
      "A. No TB-related concern",
      "B. Presumptive TB requiring appropriate diagnostic evaluation",
      "C. Confirmed MDR-TB",
      "D. No further history is needed"
    ],
    "correctIndex": 1,
    "correctAnswerText": "B. Presumptive TB requiring appropriate diagnostic evaluation",
    "explanation": "Multiple compatible symptoms plus significant exposure should trigger appropriate evaluation for TB. It does not by itself establish TB or drug resistance.",
    "learningPoint": "Recognize → Assess → Test → Interpret → Diagnose.",
    "correctFeedback": "The combination of compatible symptoms and exposure should trigger consideration of TB and further evaluation.",
    "incorrectFeedback": "Incorrect. The patient should not be dismissed, but the information alone does not establish confirmed TB or drug resistance.",
    "clinicalInsight": "The combination of compatible symptoms and exposure should trigger consideration of TB and further evaluation.",
    "whyRationale": "Incorrect. The patient should not be dismissed, but the information alone does not establish confirmed TB or drug resistance.",
    "referencesDoc": [
      "[2]",
      "[3]",
      "[5]"
    ],
    "marks": 30,
    "xp": 4,
    "isRapid": false
  }
];;

export function getDocumentQuestionById(id: string): DocumentLevel1Question | undefined {
  return DOCUMENT_50_QUESTIONS.find(q => q.id === id);
}

/** Q50, the Final Snake Challenge on square 100. */
export function getDocumentFinalQuestion(): DocumentLevel1Question {
  return DOCUMENT_50_QUESTIONS[49];
}

/**
 * Next question in bank order (Q1-Q49, section order). Returns the first
 * question the student has not completed yet; when all 49 are completed it
 * wraps around to Q1 so a replayed game can keep asking questions.
 */
export function getNextDocumentQuestion(completedIds: string[]): DocumentLevel1Question {
  const pool = DOCUMENT_50_QUESTIONS.filter(q => q.questionNumber < 50);
  return pool.find(q => !completedIds.includes(q.id)) ?? pool[0];
}

/** Next unanswered question from the same section (for "Try a Similar Case"). */
export function getSimilarCaseQuestion(
  section: string,
  completedIds: string[],
  excludeId?: string
): DocumentLevel1Question | undefined {
  const same = DOCUMENT_50_QUESTIONS.filter(
    q => q.section === section && q.questionNumber < 50 && q.id !== excludeId
  );
  return same.find(q => !completedIds.includes(q.id)) ?? same[0];
}

export const DOCUMENT_CATEGORY_TOTALS: Record<ChallengeCategory, number> = {
  symptoms: 10,
  clinicalClues: 8,
  riskFactors: 8,
  patientHistory: 6,
  exposure: 5,
  clinicalReasoning: 5,
  presumptiveTB: 8
};

export const DOCUMENT_CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  symptoms: 'A. Symptoms',
  clinicalClues: 'B. Clinical Clues',
  riskFactors: 'C. Risk Factors',
  patientHistory: 'D. Patient History',
  exposure: 'E. TB Exposure',
  clinicalReasoning: 'F. Relevant vs Non-Relevant',
  presumptiveTB: 'G. Decision-Making'
};

/** Performance categories from the document's "Spot the TB Clues" rules. */
export function getDocumentPerformanceCategory(accuracyPct: number): string {
  if (accuracyPct >= 90) return 'TB Clue Expert';
  if (accuracyPct >= 75) return 'Good Clinical Recognition';
  if (accuracyPct >= 60) return 'Needs More Practice';
  return 'Re-learning Required';
}

/** ~80% accuracy unlocks Level 2 (document competency rule). */
export const DOCUMENT_LEVEL2_UNLOCK_ACCURACY = 80;
export const DOCUMENT_LEVEL2_UNLOCK_CORRECT = 40; // 80% of 50 questions
