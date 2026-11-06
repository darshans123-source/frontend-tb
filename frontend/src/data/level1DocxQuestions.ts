/**
 * Level 1 — the 10 questions from Content_2_PTB.docx (faculty document,
 * "Snake & Ladder – TB Clinical Challenge Bank", sections A–G) that were
 * missing from the 25-question Snake & Ladder board bank.
 *
 * These are verbatim from the faculty document: question, options, correct
 * answer, brief medical explanation and learning point. They are used in the
 * "10 Docx Traps — Re-learn Deck" in SnakeLadderGame (tap to reveal, not
 * scored) so students meet the traps the board bank never asked:
 *  - absence of a symptom does NOT exclude TB (Q9, Q15, Q35)
 *  - explicit distractor filtering (Q6, Q8, Q41)
 *  - counting relevant clues (Q17), the verbatim contact question (Q28),
 *    algorithm not one-size-fits-all (Q46), algorithm purpose (Q49)
 *
 * Level 1 scope is recognition only: suspicion is NOT confirmation.
 * Reference: Content_2_PTB.docx; WHO consolidated guidelines on TB,
 * Module 3 – Diagnosis (2025); NTEP guidance.
 */
export interface Level1DocxTrapQuestion {
  id: string; // docx question number, e.g. 'docx-q6'
  docxNumber: number;
  section: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  learningPoint: string;
}

export const LEVEL1_DOCX_TRAP_QUESTIONS: Level1DocxTrapQuestion[] = [
  {
    id: 'docx-q6',
    docxNumber: 6,
    section: 'A. TB Symptom Identification',
    question: 'Which symptom is least useful as a TB clue?',
    options: [
      'Unexplained weight loss',
      'Night sweats',
      'Prolonged cough',
      'Acute ankle injury'
    ],
    correctIndex: 3,
    explanation: 'An isolated mechanical injury does not suggest TB.',
    learningPoint: 'Learn to separate relevant from irrelevant information.'
  },
  {
    id: 'docx-q8',
    docxNumber: 8,
    section: 'A. TB Symptom Identification',
    question: 'Which of the following is NOT a typical clue that would increase suspicion for pulmonary TB?',
    options: [
      'Prolonged cough',
      'Weight loss',
      'Night sweats',
      'Isolated wrist fracture'
    ],
    correctIndex: 3,
    explanation: 'A wrist fracture does not by itself suggest pulmonary TB.',
    learningPoint: 'Avoid being distracted by unrelated information.'
  },
  {
    id: 'docx-q9',
    docxNumber: 9,
    section: 'A. TB Symptom Identification',
    question: 'True or False: A patient may have TB even when the classic symptom pattern is incomplete.',
    options: ['True', 'False'],
    correctIndex: 0,
    explanation: 'TB can present variably; absence of one classic symptom does not automatically exclude TB.',
    learningPoint: 'Clinical suspicion should not depend on one symptom alone.'
  },
  {
    id: 'docx-q15',
    docxNumber: 15,
    section: 'B. Clinical Clue Identification',
    question: 'True or False: Absence of fever completely rules out TB.',
    options: ['True', 'False'],
    correctIndex: 1,
    explanation: 'TB does not require all classical symptoms to be present.',
    learningPoint: 'Never exclude TB using one absent symptom alone.'
  },
  {
    id: 'docx-q17',
    docxNumber: 17,
    section: 'B. Clinical Clue Identification',
    question: 'A student is given “persistent cough, fever, weight loss and night sweats.” How many of these are clinically relevant TB clues?',
    options: ['One', 'Two', 'Three', 'Four'],
    correctIndex: 3,
    explanation: 'All four can contribute to suspicion of TB.',
    learningPoint: 'Build a mental pattern of TB clues.'
  },
  {
    id: 'docx-q28',
    docxNumber: 28,
    section: 'D. Patient History',
    question: 'Which question is most appropriate?',
    options: [
      '“Has anyone at home or work had TB?”',
      '“What is your favourite colour?”',
      '“Do you prefer tea?”',
      '“What is your shoe size?”'
    ],
    correctIndex: 0,
    explanation: 'Contact history is relevant epidemiological information.',
    learningPoint: 'Targeted history improves diagnostic reasoning.'
  },
  {
    id: 'docx-q35',
    docxNumber: 35,
    section: 'E. TB Exposure / Contact',
    question: 'True or False: TB contact history is irrelevant if the patient has no fever.',
    options: ['True', 'False'],
    correctIndex: 1,
    explanation: 'Exposure history remains relevant even if the patient lacks one classical symptom.',
    learningPoint: 'Do not discard important epidemiological clues.'
  },
  {
    id: 'docx-q41',
    docxNumber: 41,
    section: 'F. Relevant vs Non-Relevant Clinical Information',
    question: 'True or False: Every detail in a clinical vignette has equal diagnostic importance.',
    options: ['True', 'False'],
    correctIndex: 1,
    explanation: 'Some information is highly discriminative while other details are distractors.',
    learningPoint: 'Learn to identify high-yield clues.'
  },
  {
    id: 'docx-q46',
    docxNumber: 46,
    section: 'G. Introductory Decision-Making Challenges',
    question: 'True or False: The same clinical algorithm can be applied without modification to every patient regardless of age or HIV status.',
    options: ['True', 'False'],
    correctIndex: 1,
    explanation: 'TB diagnostic pathways may differ according to age, HIV status and clinical context.',
    learningPoint: 'Patient characteristics matter.'
  },
  {
    id: 'docx-q49',
    docxNumber: 49,
    section: 'G. Introductory Decision-Making Challenges',
    question: 'Which statement best represents the purpose of a TB diagnostic algorithm?',
    options: [
      'Memorize boxes only',
      'Guide sequential clinical and diagnostic decisions',
      'Replace clinical judgment entirely',
      'Avoid laboratory testing'
    ],
    correctIndex: 1,
    explanation: 'An algorithm provides a structured pathway for assessment and testing.',
    learningPoint: 'Understand the logic, not merely the flowchart.'
  }
];
