// Level 1 study material from the faculty document
// (Content_2_PTB__1.docx), extracted verbatim into
// ~/workspace/tb-quest-doc/data/. DO NOT reword any medical text here:
// every string is copied exactly as stored in the extraction.
// 5 patient scenarios, TB Clue Card + 24-clue library, 30 distractors
// + "Find the TB Clues" mini-game, 5 Spot-the-Clues profiles,
// 20 re-learning items + mechanism, references [1]-[5] and the full
// 20-reference list. Profile 1 has no explanation (null) — do not invent one.
// Labelled everywhere it is shown: "Teaching simulation — content pending
// faculty validation".

export interface Level1Scenario {
  id: number;
  title: string;
  category: string;
  sex: string;
  age: string;
  complaints: string;
  duration: string;
  history: string;
  findings: string[];
  riskFactors: string;
  contactExposure: string;
  shouldSuspect: string;
  explanation: string;
  keyLearning: string;
  reference: string;
}

export interface Level1Clue {
  id: number;
  clue: string;
  whyRelevant: string;
  explanation: string;
  reference: string;
}

export interface Level1ClueGroup {
  id: string;
  title: string;
  clues: Level1Clue[];
}

export interface Level1DistractorItem {
  id: number;
  item: string;
  relevant: string;
  relevantCategory: string;
  explanation: string;
}

export interface Level1DistractorGroup {
  id: string;
  title: string;
  note?: string;
  items: Level1DistractorItem[];
}

export interface SpotClueInfoItem {
  text: string;
  verdict: string;
  verdictRaw: string;
  why: string;
}

export interface SpotClueProfile {
  id: number;
  title: string;
  patientProfile: Record<string, string>;
  infoItems: SpotClueInfoItem[];
  shouldSuspect: string;
  feedback: string;
  explanation: string | null;
  source: string;
}

export interface RelearningItem {
  id: number;
  title: string;
  question: string;
  correctAnswer: string;
  whyCorrect: string;
  whyIncorrect: string;
  keyLearning: string;
}

export const LEVEL1_SCENARIOS: Level1Scenario[] = [
  {
    "age": "32 years",
    "category": "Adult",
    "complaints": "Cough, fever, loss of appetite and weight loss.",
    "contactExposure": "A co-worker was treated for pulmonary TB approximately 2 months ago.",
    "duration": "Cough for 3 weeks; fever and loss of appetite for approximately 2 weeks.",
    "explanation": "The patient has a combination of persistent respiratory symptoms, constitutional symptoms, and relevant TB exposure. This clinical pattern should raise suspicion of TB and prompt appropriate further evaluation.",
    "findings": [
      "Persistent cough",
      "Low-grade fever",
      "Unexplained weight loss",
      "Reduced appetite",
      "Relevant history of TB exposure"
    ],
    "history": "No previous diagnosis of TB. Reports gradually increasing fatigue and reduced appetite.",
    "id": 1,
    "keyLearning": "Persistent cough + constitutional symptoms + TB contact = Think TB.",
    "reference": "Uploaded TB diagnostic algorithm.docx – concept of identification of a presumptive TB patient.\nWHO, WHO consolidated guidelines on tuberculosis: Module 3 – Diagnosis.",
    "riskFactors": "Recent close contact with a person with TB.",
    "sex": "Male",
    "shouldSuspect": "Yes",
    "title": "Case 1 – Classic Adult Pulmonary TB Presentation"
  },
  {
    "age": "41 years",
    "category": "Adult",
    "complaints": "Persistent cough, tiredness and reduced appetite.",
    "contactExposure": "No definite household TB contact reported.",
    "duration": "Cough for 2–3 weeks.",
    "explanation": "The patient has a persistent respiratory complaint in the presence of an important risk condition, HIV infection. TB should therefore be considered even though a known TB contact is not reported.",
    "findings": [
      "Persistent cough",
      "Fatigue",
      "Reduced appetite",
      "HIV-positive status",
      "No definite TB contact"
    ],
    "history": "Known HIV infection; currently receiving antiretroviral therapy. No documented previous TB.",
    "id": 2,
    "keyLearning": "A patient does not need to have every classic symptom or a known contact before TB is considered.",
    "reference": "WHO TB diagnostic guidance; WHO guidance on TB and HIV.\nUploaded TB diagnostic algorithm.docx – pulmonary TB diagnostic framework.",
    "riskFactors": "HIV infection.",
    "sex": "Female",
    "shouldSuspect": "Yes",
    "title": "Case 2 – Adult with Risk Factor but Less Typical Presentation"
  },
  {
    "age": "8 years",
    "category": "Paediatric",
    "complaints": "Persistent cough, reduced appetite and tiredness.",
    "contactExposure": "Yes – close household contact.",
    "duration": "Approximately 2 weeks.",
    "explanation": "In a child, the combination of compatible symptoms and significant household TB exposure is an important reason to consider TB and proceed with appropriate pediatric evaluation.",
    "findings": [
      "Persistent cough",
      "Poor appetite",
      "Reduced activity",
      "Household TB contact",
      "No obvious alternative explanation for symptoms"
    ],
    "history": "Mother was recently diagnosed with pulmonary TB and has been receiving treatment.",
    "id": 3,
    "keyLearning": "Always ask about TB exposure in children with compatible symptoms.",
    "reference": "Uploaded TB diagnostic algorithm.docx – pediatric TB diagnostic pathway.\nWHO pediatric TB diagnostic guidance.",
    "riskFactors": "Significant household exposure to a person with TB.",
    "sex": "Female",
    "shouldSuspect": "Yes",
    "title": "Case 3 – Paediatric Household Contact"
  },
  {
    "age": "28 years",
    "category": "Adult",
    "complaints": "Cough, night sweats and loss of weight.",
    "contactExposure": "No known contact with a person diagnosed with TB.",
    "duration": "Cough for approximately 1 month.",
    "explanation": "The absence of a known risk factor or contact does not exclude TB. The clinical symptom pattern itself is sufficiently concerning to warrant consideration of TB.",
    "findings": [
      "Persistent cough",
      "Night sweats",
      "Unexplained weight loss",
      "Symptoms progressing over several weeks"
    ],
    "history": "No known HIV infection. No previous TB treatment.",
    "id": 4,
    "keyLearning": "No known risk factor does not mean no TB. Clinical symptoms still matter.",
    "reference": "Uploaded TB diagnostic algorithm.docx – initial recognition of presumptive TB.\nWHO TB diagnostic guidance.",
    "riskFactors": "No specific major risk factor identified from the initial history.",
    "sex": "Male",
    "shouldSuspect": "Yes",
    "title": "Case 4 – Symptoms Suggestive of TB but No Major Risk Factor Identified"
  },
  {
    "age": "24 years",
    "category": "Adult",
    "complaints": "Cough for 2 days associated with a runny nose and mild sore throat.",
    "contactExposure": "No known TB contact.",
    "duration": "2 days.",
    "explanation": "The presentation is an acute, short-duration respiratory illness with features more suggestive of an acute respiratory infection. TB should not automatically be assumed from the presence of cough alone. Clinical reassessment would be appropriate if symptoms persist, worsen, or additional TB features develop.",
    "findings": [
      "Acute onset",
      "Short duration",
      "Runny nose",
      "Mild sore throat",
      "No weight loss",
      "No night sweats",
      "No prolonged systemic symptoms",
      "No known TB exposure"
    ],
    "history": "Symptoms began following several family members developing a similar acute respiratory illness.",
    "id": 5,
    "keyLearning": "Not every cough is TB. Consider duration, associated symptoms, exposure and risk factors together.",
    "reference": "WHO TB diagnostic guidance.\nUploaded TB diagnostic algorithm.docx – diagnostic pathway beginning with recognition of presumptive TB.",
    "riskFactors": "No important TB risk factor identified from the available history.",
    "sex": "Female",
    "shouldSuspect": "Not strongly on the information provided",
    "title": "Case 5 – Low Suspicion / Important Distractor Case"
  }
];

export const LEVEL1_CLUE_CARD: string = "THINK TB WHEN YOU SEE:\nPersistent cough\n＋\nWeight loss / fever / night sweats\n＋/−\nChest symptoms or haemoptysis\n＋/−\nTB contact/exposure\n＋/−\nImportant risk factors such as HIV\n↓\nConsider TB → Proceed to appropriate evaluation";

export const LEVEL1_CLUE_CARD_FOLLOW_UP: string = "The uploaded three-page algorithm can then become the transition point from Level 1: “Recognize the Clues” to Level 2: “Choose the Investigation.”";

export const LEVEL1_CLUE_DISTINCTION: string = "The game should teach students that these are clinical clues, not individual diagnostic criteria.\n\nFor example:\n\nCough → clue\nWeight loss → clue\nTB contact → risk/exposure clue\nHIV → risk context\nCombination of clues → increased suspicion\nAppropriate diagnostic testing → diagnosis\n\nThis distinction is crucial because WHO currently recommends rapid diagnostic testing as the initial diagnostic test in people with signs and symptoms of TB; symptoms alone should not be presented in the game as confirmation of TB.";

export const LEVEL1_CLUE_GROUPS: Level1ClueGroup[] = [
  {
    "clues": [
      {
        "clue": "Persistent/prolonged cough",
        "explanation": "A cough that persists should prompt consideration of TB, particularly when accompanied by other compatible symptoms.",
        "id": 1,
        "reference": "WHO TB Fact Sheet; WHO Q&A",
        "whyRelevant": "One of the most important symptoms suggesting pulmonary TB."
      },
      {
        "clue": "Cough with sputum",
        "explanation": "Productive cough can occur in pulmonary TB and may be relevant when evaluating a patient for TB.",
        "id": 2,
        "reference": "WHO TB guidance",
        "whyRelevant": "Suggests respiratory tract involvement and may provide a specimen for microbiological testing."
      },
      {
        "clue": "Haemoptysis",
        "explanation": "Blood-stained sputum or haemoptysis is an important respiratory warning sign, although it is not specific for TB.",
        "id": 3,
        "reference": "WHO TB Fact Sheet",
        "whyRelevant": "Can occur in pulmonary TB."
      },
      {
        "clue": "Chest pain",
        "explanation": "Chest pain is a recognized symptom of TB disease, although it has many other causes.",
        "id": 4,
        "reference": "WHO TB Fact Sheet",
        "whyRelevant": "May occur in pulmonary TB."
      },
      {
        "clue": "Unexplained weight loss",
        "explanation": "Unintentional weight loss can occur in TB and becomes more meaningful when associated with other compatible symptoms.",
        "id": 5,
        "reference": "WHO TB Fact Sheet",
        "whyRelevant": "An important constitutional clue."
      },
      {
        "clue": "Fever",
        "explanation": "Fever, particularly when persistent or associated with other TB-compatible features, should contribute to clinical suspicion.",
        "id": 6,
        "reference": "WHO TB Fact Sheet",
        "whyRelevant": "Common systemic manifestation of TB disease."
      },
      {
        "clue": "Night sweats",
        "explanation": "Night sweats may occur in TB and should be interpreted together with the rest of the clinical picture.",
        "id": 7,
        "reference": "WHO TB Fact Sheet",
        "whyRelevant": "Recognized constitutional symptom of TB."
      },
      {
        "clue": "Fatigue/weakness",
        "explanation": "Persistent weakness or fatigue may be part of the general illness, especially with weight loss or fever.",
        "id": 8,
        "reference": "WHO TB Fact Sheet",
        "whyRelevant": "Can accompany systemic TB disease."
      },
      {
        "clue": "Reduced appetite",
        "explanation": "Loss of appetite is a supportive, nonspecific clue rather than a diagnostic finding by itself.",
        "id": 9,
        "reference": "WHO TB clinical information",
        "whyRelevant": "May accompany systemic illness and weight loss."
      },
      {
        "clue": "Progressive/chronic illness rather than sudden illness",
        "explanation": "TB symptoms may be mild initially and develop over weeks or months rather than appearing abruptly.",
        "id": 10,
        "reference": "WHO TB Q&A",
        "whyRelevant": "TB often develops gradually."
      }
    ],
    "id": "A",
    "title": "A. Core clinical clues"
  },
  {
    "clues": [
      {
        "clue": "Household contact with a person with TB",
        "explanation": "A patient with compatible symptoms and close household exposure deserves careful evaluation for TB.",
        "id": 11,
        "reference": "WHO TB Fact Sheet",
        "whyRelevant": "Indicates significant exposure risk."
      },
      {
        "clue": "Close workplace/contact exposure",
        "explanation": "Exposure history helps the learner understand why epidemiology contributes to clinical suspicion.",
        "id": 12,
        "reference": "WHO TB Fact Sheet",
        "whyRelevant": "Close contact can increase opportunity for transmission."
      },
      {
        "clue": "HIV infection",
        "explanation": "A patient living with HIV requires particular attention to TB symptoms and appropriate TB evaluation.",
        "id": 13,
        "reference": "WHO TB Fact Sheet; WHO TB guidance",
        "whyRelevant": "HIV substantially increases vulnerability to TB disease."
      },
      {
        "clue": "Undernutrition",
        "explanation": "Undernutrition is a recognized risk context and can coexist with weight loss in TB.",
        "id": 14,
        "reference": "WHO TB Fact Sheet",
        "whyRelevant": "Associated with increased risk of TB disease."
      },
      {
        "clue": "Diabetes",
        "explanation": "Diabetes is an important comorbidity to identify during the patient's history.",
        "id": 15,
        "reference": "WHO TB Fact Sheet",
        "whyRelevant": "Increases risk of TB disease."
      },
      {
        "clue": "Tobacco use",
        "explanation": "Smoking is a relevant risk factor that should be recognized in clinical history.",
        "id": 16,
        "reference": "WHO TB Fact Sheet",
        "whyRelevant": "Associated with increased TB risk."
      },
      {
        "clue": "Previous history of TB",
        "explanation": "Previous TB should be identified because it affects the patient's clinical assessment and subsequent diagnostic pathway.",
        "id": 17,
        "reference": "WHO TB diagnostic guidance; uploaded algorithm",
        "whyRelevant": "Important background information in evaluating current symptoms."
      },
      {
        "clue": "Child with TB household contact",
        "explanation": "In children, contact history can be particularly important when assessing symptoms suggestive of TB.",
        "id": 18,
        "reference": "WHO pediatric TB guidance",
        "whyRelevant": "Important clue for pediatric TB assessment."
      }
    ],
    "id": "B",
    "title": "B. Epidemiological and risk clues"
  },
  {
    "clues": [
      {
        "clue": "Combination of several compatible symptoms",
        "explanation": "Prolonged cough together with fever, weight loss or night sweats should increase attention to possible TB.",
        "id": 19,
        "reference": "WHO TB Fact Sheet",
        "whyRelevant": "The pattern is more informative than one isolated symptom."
      },
      {
        "clue": "Symptom + risk factor combination",
        "explanation": "For example, persistent cough in a person living with HIV warrants careful TB evaluation.",
        "id": 20,
        "reference": "WHO TB guidance",
        "whyRelevant": "Clinical probability can increase when symptoms and risk factors coexist."
      },
      {
        "clue": "Symptom + TB contact combination",
        "explanation": "A patient with compatible symptoms and a known household contact should not have the exposure history overlooked.",
        "id": 21,
        "reference": "WHO TB Fact Sheet",
        "whyRelevant": "Epidemiological and clinical evidence reinforce each other."
      },
      {
        "clue": "Absence of one classical symptom",
        "explanation": "TB can present variably, and some symptoms may be absent or mild initially.",
        "id": 22,
        "reference": "WHO TB Q&A",
        "whyRelevant": "Absence of one symptom does not automatically exclude TB."
      },
      {
        "clue": "Symptoms that persist or worsen",
        "explanation": "Persistence should prompt reassessment rather than assuming a transient illness.",
        "id": 23,
        "reference": "WHO TB Q&A",
        "whyRelevant": "Progressive symptoms increase concern for an ongoing disease process."
      },
      {
        "clue": "Relevant information hidden among distractors",
        "explanation": "Students should learn to identify cough duration, weight loss, fever, contact and risk factors rather than treating every detail as equally important.",
        "id": 24,
        "reference": "Educational design principle; anchored to TB clinical features in WHO guidance",
        "whyRelevant": "Clinical reasoning requires prioritization of high-value information."
      }
    ],
    "id": "C",
    "title": "C. Clinical reasoning clues"
  }
];

export const LEVEL1_DISTRACTOR_CATEGORIES: { name: string; description: string; examples: string[] }[] = [
  {
    "description": "",
    "examples": [
      "Persistent cough",
      "Weight loss",
      "Fever",
      "Night sweats",
      "Haemoptysis",
      "TB contact/exposure",
      "Important risk factors such as HIV"
    ],
    "name": "Category 1 – Strong TB clues"
  },
  {
    "description": "These may contribute to the overall clinical picture but should not independently trigger a diagnosis of TB.",
    "examples": [
      "Fatigue",
      "Reduced appetite",
      "General weakness"
    ],
    "name": "Category 2 – Supporting but nonspecific information"
  },
  {
    "description": "These should be recognized as irrelevant to TB recognition.",
    "examples": [
      "Shoe size",
      "Favourite food",
      "Hair colour",
      "Sports preference",
      "Mobile phone brand"
    ],
    "name": "Category 3 – Distractors"
  }
];

export const LEVEL1_DISTRACTOR_GROUPS: Level1DistractorGroup[] = [
  {
    "id": "A",
    "items": [
      {
        "explanation": "Food preference does not help identify a patient with suspected TB.",
        "id": 1,
        "item": "Favourite food",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "This has no meaningful role in initial TB recognition.",
        "id": 2,
        "item": "Favourite colour",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "It is unrelated to TB symptoms, risk or exposure.",
        "id": 3,
        "item": "Favourite sports team",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "Shoe size has no relevance to recognition of TB.",
        "id": 4,
        "item": "Shoe size",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "These are unrelated to the initial assessment of TB.",
        "id": 5,
        "item": "Hair style or hair colour",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "This does not provide a useful clue for TB recognition.",
        "id": 6,
        "item": "Handwriting style",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "A personal preference does not alter clinical suspicion of TB.",
        "id": 7,
        "item": "Preferred type of music",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "It is a distractor and should be ignored when considering TB.",
        "id": 8,
        "item": "Favourite movie",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "This information has no role in identifying TB.",
        "id": 9,
        "item": "Brand of mobile phone",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "It has no diagnostic significance for TB recognition.",
        "id": 10,
        "item": "Favourite cricket player",
        "relevant": "No",
        "relevantCategory": "no"
      }
    ],
    "title": "A. Clearly irrelevant or low-value information"
  },
  {
    "id": "B",
    "items": [
      {
        "explanation": "An isolated mild headache is nonspecific and does not strongly point toward TB.",
        "id": 11,
        "item": "Mild headache alone",
        "relevant": "Usually not a key TB clue",
        "relevantCategory": "qualified"
      },
      {
        "explanation": "A recent uncomplicated injury does not contribute meaningfully to TB recognition.",
        "id": 12,
        "item": "Minor ankle injury",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "An unrelated old scar should not distract the learner from the main TB clues.",
        "id": 13,
        "item": "Old healed skin scar",
        "relevant": "No, unless otherwise clinically relevant",
        "relevantCategory": "qualified"
      },
      {
        "explanation": "Isolated dental pain does not suggest pulmonary TB.",
        "id": 14,
        "item": "Mild toothache",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "In the absence of other relevant features, this is not a key clue for TB recognition.",
        "id": 15,
        "item": "Minor back pain after exercise",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "Simple refractive error is unrelated to recognition of pulmonary TB.",
        "id": 16,
        "item": "Refractive error/myopia",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "A remote uncomplicated cold does not meaningfully increase suspicion of TB.",
        "id": 17,
        "item": "Previous common cold several months ago",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "Exercise-related fatigue is nonspecific and should not be interpreted as a TB clue.",
        "id": 18,
        "item": "Occasional tiredness after strenuous exercise",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "An isolated gastrointestinal symptom is not a typical clue for recognizing pulmonary TB.",
        "id": 19,
        "item": "One episode of loose stool",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "Allergic symptoms alone should not be used as key evidence for TB.",
        "id": 20,
        "item": "Mild seasonal allergy symptoms",
        "relevant": "No",
        "relevantCategory": "no"
      }
    ],
    "note": "These are more useful distractors because they can sound medically important to a student.",
    "title": "B. Clinical information that may be relevant generally, but is not a key Level-1 TB clue"
  },
  {
    "id": "C",
    "items": [
      {
        "explanation": "Personal food preference does not indicate TB.",
        "id": 21,
        "item": "“The patient likes spicy food.”",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "Irrelevant social detail.",
        "id": 22,
        "item": "“The patient has a red motorcycle.”",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "No relevance to TB recognition.",
        "id": 23,
        "item": "“The patient recently bought a new phone.”",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "It may require clinical assessment for other reasons but does not point toward pulmonary TB by itself.",
        "id": 24,
        "item": "“The patient has mild knee pain after walking.”",
        "relevant": "Not a key clue",
        "relevantCategory": "qualified"
      },
      {
        "explanation": "Refractive error is not a TB recognition clue.",
        "id": 25,
        "item": "“The patient wears spectacles.”",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "Does not alter TB suspicion.",
        "id": 26,
        "item": "“The patient prefers tea rather than coffee.”",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "A common cold is not a key clue for chronic TB recognition.",
        "id": 27,
        "item": "“The patient has a history of an uncomplicated common cold.”",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "Irrelevant to TB assessment.",
        "id": 28,
        "item": "“The patient is left-handed.”",
        "relevant": "No",
        "relevantCategory": "no"
      },
      {
        "explanation": "Unless specifically linked to another clinically relevant condition, it should not distract from TB clues.",
        "id": 29,
        "item": "“The patient has an old healed scar from childhood.”",
        "relevant": "Usually no",
        "relevantCategory": "qualified"
      },
      {
        "explanation": "The occupation of an unrelated family member is not a TB clue.",
        "id": 30,
        "item": "“The patient's brother is a teacher.”",
        "relevant": "No",
        "relevantCategory": "no"
      }
    ],
    "note": "These are particularly valuable for the Snake & Ladder game, because they can be deliberately inserted into a patient scenario.",
    "title": "C. Potentially misleading information"
  }
];

export const LEVEL1_DISTRACTOR_MINI_GAME: string = "A particularly useful Level-1 mini-game could present a patient profile containing 8–10 pieces of information, of which only 3–4 are meaningful.\n\nExample\n\nPatient: 35-year-old man\n\nCough for 4 weeks\nWeight loss of 5 kg\nNight sweats\nWorks as an accountant\nFavourite cricket team: India\nUses spectacles\nBrother treated for TB last year\nPrefers vegetarian food\n\nThe student must select the TB-relevant clues:\n\n✅ Cough for 4 weeks\n✅ Weight loss\n✅ Night sweats\n✅ Household/family TB exposure\n\nand ignore:\n\n❌ Occupation as accountant\n❌ Favourite cricket team\n❌ Wearing spectacles\n❌ Vegetarian food preference\n\nFeedback\n\nExcellent! You identified the high-value TB clues.\nClinical reasoning requires you to focus on symptoms, duration, exposure and risk factors rather than unrelated patient details.\n\nThis type of activity would fit particularly well within the Snake & Ladder “challenge squares”, because students can earn extra moves for correctly identifying all the relevant clues.\n\nThe key Level-1 principle should be:\n\n“Not every piece of patient information is a diagnostic clue. Learn to identify what matters.”\n\nThis complements the uploaded TB diagnostic algorithm, where the learner must first recognize the clinically relevant patient presentation before entering the subsequent diagnostic pathway.";

export const SPOT_THE_CLUES_RULES: string = "For the computer-engineering team, I recommend that each profile be converted into a click-and-identify activity rather than a conventional MCQ.\n\nExample\n\nPatient:\n\n35-year-old male\nCough for 4 weeks\nWeight loss\nNight sweats\nBrother treated for TB\nAccountant\nLikes cricket\nWears spectacles\n\nThe screen asks:\n\n“Select all the information that should make you think about TB.”\n\nThe student selects:\n\n✅ Cough for 4 weeks\n✅ Weight loss\n✅ Night sweats\n✅ TB contact\n\nThe game then displays:\n\n4/4 TB clues identified!\nYou recognized the important clinical and epidemiological information.\n\nIf the student selects “Accountant” or “Likes cricket”, the feedback should say:\n\nNot a key TB clue.\nThis information does not significantly change your initial suspicion of TB.";

export const SPOT_PERFORMANCE_CATEGORIES: { label: string; score: string; description: string }[] = [
  {
    "description": "Ready for Level 2",
    "label": "TB Clue Expert",
    "score": "90–100%"
  },
  {
    "description": "Minor reinforcement recommended",
    "label": "Good Clinical Recognition",
    "score": "75–89%"
  },
  {
    "description": "Repeat selected clue challenges",
    "label": "Needs More Practice",
    "score": "60–74%"
  },
  {
    "description": "Return to Snake & Ladder clue module",
    "label": "Re-learning Required",
    "score": "<60%"
  }
];

export const SPOT_THE_CLUES_PROFILES: SpotClueProfile[] = [
  {
    "explanation": null,
    "feedback": "Excellent! You identified the key clinical and epidemiological clues. Persistent cough, constitutional symptoms and TB exposure together should raise suspicion of TB.",
    "id": 1,
    "infoItems": [
      {
        "text": "Cough for 4 weeks",
        "verdict": "clue",
        "verdictRaw": "✅ Yes",
        "why": "Persistent cough is an important clue for possible pulmonary TB."
      },
      {
        "text": "Weight loss",
        "verdict": "clue",
        "verdictRaw": "✅ Yes",
        "why": "Unexplained weight loss is a recognized constitutional symptom of TB."
      },
      {
        "text": "Night sweats",
        "verdict": "clue",
        "verdictRaw": "✅ Yes",
        "why": "A recognized constitutional symptom that supports suspicion when combined with other findings."
      },
      {
        "text": "Fever",
        "verdict": "clue",
        "verdictRaw": "✅ Yes",
        "why": "Fever can occur in TB and contributes to the clinical picture."
      },
      {
        "text": "Household contact with TB",
        "verdict": "clue",
        "verdictRaw": "✅ Yes",
        "why": "Close contact is an important epidemiological clue."
      },
      {
        "text": "Reduced appetite",
        "verdict": "supporting",
        "verdictRaw": "✅ Supporting clue",
        "why": "Nonspecific, but may accompany systemic illness."
      },
      {
        "text": "Accountant",
        "verdict": "distractor",
        "verdictRaw": "❌ Distractor",
        "why": "Occupation is not a key TB clue in this scenario."
      },
      {
        "text": "Cricket preference",
        "verdict": "distractor",
        "verdictRaw": "❌ Distractor",
        "why": "Irrelevant to TB recognition."
      }
    ],
    "patientProfile": {
      "age": "35 years",
      "category": "Adult",
      "duration": "Cough for 4 weeks; constitutional symptoms for approximately 3 weeks",
      "otherInformation": "Works as an accountant; does not smoke; enjoys playing cricket",
      "presentingComplaints": "Cough, evening fever, night sweats and weight loss",
      "relevantHistory": "Reduced appetite and increasing fatigue",
      "riskFactors": "Close household TB contact",
      "sex": "Male",
      "tbContactExposure": "His brother was diagnosed with pulmonary TB 2 months ago"
    },
    "shouldSuspect": "Yes – strongly",
    "source": "Uploaded TB diagnostic algorithm; WHO TB guidance.",
    "title": "Profile 1 – The Classic Pulmonary TB Pattern"
  },
  {
    "explanation": "The important combination is persistent cough + HIV infection. A known TB contact is helpful when present but is not required before TB is considered.",
    "feedback": "Remember: TB suspicion does not depend on having every classic symptom or a known contact. Consider the whole clinical context.",
    "id": 2,
    "infoItems": [
      {
        "text": "Persistent cough",
        "verdict": "clue",
        "verdictRaw": "✅ Yes",
        "why": "An important respiratory clue."
      },
      {
        "text": "HIV infection",
        "verdict": "clue",
        "verdictRaw": "✅ Yes",
        "why": "HIV is an important risk context for TB."
      },
      {
        "text": "Reduced appetite",
        "verdict": "supporting",
        "verdictRaw": "✅ Supporting clue",
        "why": "May accompany systemic illness but is nonspecific."
      },
      {
        "text": "No known TB contact",
        "verdict": "not-a-clue",
        "verdictRaw": "⚠️ Not a TB clue",
        "why": "Absence of known contact does not exclude TB."
      },
      {
        "text": "Spectacles",
        "verdict": "distractor",
        "verdictRaw": "❌ Distractor",
        "why": "Not relevant to TB recognition."
      },
      {
        "text": "Migraine",
        "verdict": "distractor",
        "verdictRaw": "❌ Distractor for this task",
        "why": "It may be clinically relevant separately but does not identify possible pulmonary TB here."
      }
    ],
    "patientProfile": {
      "age": "42 years",
      "category": "Adult",
      "duration": "3 weeks",
      "importantClinicalFindings": "Reduced appetite; no obvious haemoptysis",
      "otherInformation": "Uses spectacles and has occasional migraine",
      "presentingComplaints": "Persistent cough and tiredness",
      "relevantHistory": "Known HIV infection; on antiretroviral treatment",
      "riskFactors": "HIV infection",
      "sex": "Female",
      "tbContactExposure": "No known household TB contact"
    },
    "shouldSuspect": "Yes",
    "source": "WHO TB diagnostic guidance.",
    "title": "Profile 2 – TB Risk Factor Hidden in the History"
  },
  {
    "explanation": "In this child, the combination of compatible symptoms and close household TB exposure should prompt consideration of TB and appropriate pediatric evaluation.",
    "feedback": "Key clue: In a child with compatible symptoms, always ask about household TB exposure.",
    "id": 3,
    "infoItems": [
      {
        "text": "Persistent cough",
        "verdict": "clue",
        "verdictRaw": "✅ Yes",
        "why": "Compatible respiratory symptom."
      },
      {
        "text": "Weight loss",
        "verdict": "clue",
        "verdictRaw": "✅ Yes",
        "why": "Important systemic clue."
      },
      {
        "text": "Mild fever",
        "verdict": "clue",
        "verdictRaw": "✅ Yes",
        "why": "Can occur with TB and contributes to the clinical picture."
      },
      {
        "text": "Household TB contact",
        "verdict": "clue",
        "verdictRaw": "✅ Major clue",
        "why": "Close exposure is particularly important in pediatric assessment."
      },
      {
        "text": "Reduced appetite",
        "verdict": "supporting",
        "verdictRaw": "✅ Supporting clue",
        "why": "May accompany systemic illness."
      },
      {
        "text": "Decreased activity",
        "verdict": "supporting",
        "verdictRaw": "✅ Supporting clue",
        "why": "May reflect systemic illness but is nonspecific."
      },
      {
        "text": "Likes drawing",
        "verdict": "distractor",
        "verdictRaw": "❌ Distractor",
        "why": "No relevance to TB recognition."
      },
      {
        "text": "Minor fall",
        "verdict": "distractor",
        "verdictRaw": "❌ Distractor",
        "why": "Unrelated to the TB assessment in this scenario."
      }
    ],
    "patientProfile": {
      "age": "8 years",
      "category": "Paediatric",
      "duration": "2–3 weeks",
      "importantClinicalFindings": "Mild fever and weight loss",
      "otherInformation": "Likes drawing; recently had a minor fall while playing",
      "presentingComplaints": "Persistent cough, reduced appetite and decreased activity",
      "relevantHistory": "Mother recently diagnosed with pulmonary TB",
      "riskFactors": "Significant household exposure to TB",
      "sex": "Female",
      "tbContactExposure": "Yes – close household contact"
    },
    "shouldSuspect": "Yes",
    "source": "Uploaded pediatric TB diagnostic algorithm; current WHO diagnostic guidance.",
    "title": "Profile 3 – Paediatric Household Contact"
  },
  {
    "explanation": "The clinical pattern itself is concerning. A patient does not need to have a known TB contact or an obvious risk factor before TB is considered.",
    "feedback": "Do not wait for a risk factor. A compatible symptom pattern can itself justify consideration of TB.",
    "id": 4,
    "infoItems": [
      {
        "text": "Persistent cough",
        "verdict": "clue",
        "verdictRaw": "✅ Yes",
        "why": "Important respiratory clue."
      },
      {
        "text": "Weight loss",
        "verdict": "clue",
        "verdictRaw": "✅ Yes",
        "why": "Important constitutional clue."
      },
      {
        "text": "Night sweats",
        "verdict": "clue",
        "verdictRaw": "✅ Yes",
        "why": "Supports TB suspicion when combined with other findings."
      },
      {
        "text": "5-week duration",
        "verdict": "clue",
        "verdictRaw": "✅ Yes",
        "why": "Persistence makes a chronic disease process more important to consider."
      },
      {
        "text": "Fatigue",
        "verdict": "supporting",
        "verdictRaw": "✅ Supporting clue",
        "why": "Nonspecific but may accompany systemic illness."
      },
      {
        "text": "No known TB contact",
        "verdict": "not-a-clue",
        "verdictRaw": "⚠️ Not a reason to exclude TB",
        "why": "TB can occur without a known contact history."
      },
      {
        "text": "New job",
        "verdict": "distractor",
        "verdictRaw": "❌ Distractor in this case",
        "why": "Not a specific TB clue."
      },
      {
        "text": "Myopia",
        "verdict": "distractor",
        "verdictRaw": "❌ Distractor",
        "why": "Not relevant to TB recognition."
      }
    ],
    "patientProfile": {
      "age": "29 years",
      "category": "Adult",
      "duration": "5 weeks",
      "importantClinicalFindings": "Persistent symptoms with progressive weight loss",
      "otherInformation": "Recently started a new job; has mild myopia",
      "presentingComplaints": "Persistent cough, weight loss and night sweats",
      "relevantHistory": "Progressive fatigue and reduced appetite",
      "riskFactors": "No major risk factor identified from the initial history",
      "sex": "Male",
      "tbContactExposure": "No known contact"
    },
    "shouldSuspect": "Yes",
    "source": "WHO TB clinical/diagnostic guidance.",
    "title": "Profile 4 – TB Without a Known Contact"
  },
  {
    "explanation": "The presentation is acute and short-lived, with prominent upper-respiratory symptoms and no reported constitutional TB features or TB exposure. The learner should not label every patient with cough as a TB patient. However, clinical reassessment would be appropriate if symptoms persist, worsen, or new TB-compatible features develop.",
    "feedback": "Good clinical reasoning! TB should be considered from the overall pattern—not from the presence of cough alone.",
    "id": 5,
    "infoItems": [
      {
        "text": "Cough",
        "verdict": "context",
        "verdictRaw": "⚠️ Nonspecific",
        "why": "Cough alone is not enough to identify TB."
      },
      {
        "text": "Duration of only 2 days",
        "verdict": "context",
        "verdictRaw": "⚠️ Important contextual clue",
        "why": "The very short duration is less suggestive of a chronic TB presentation."
      },
      {
        "text": "Runny nose",
        "verdict": "not-a-clue",
        "verdictRaw": "❌ Not a key TB clue",
        "why": "More consistent with an acute upper respiratory illness in this scenario."
      },
      {
        "text": "Sore throat",
        "verdict": "not-a-clue",
        "verdictRaw": "❌ Not a key TB clue",
        "why": "Not a defining clue for pulmonary TB recognition."
      },
      {
        "text": "Similar acute illness in family",
        "verdict": "not-a-clue",
        "verdictRaw": "❌ Not a TB exposure clue",
        "why": "This suggests a shared acute respiratory illness rather than a specific TB contact."
      },
      {
        "text": "No weight loss/night sweats",
        "verdict": "context",
        "verdictRaw": "⚠️ Helpful negative information",
        "why": "Their absence makes the classic TB pattern less apparent, though does not independently exclude TB."
      },
      {
        "text": "Wearing spectacles",
        "verdict": "distractor",
        "verdictRaw": "❌ Distractor",
        "why": "Irrelevant to TB recognition."
      },
      {
        "text": "University examinations",
        "verdict": "distractor",
        "verdictRaw": "❌ Distractor",
        "why": "Not a TB clue."
      }
    ],
    "patientProfile": {
      "age": "23 years",
      "category": "Adult",
      "duration": "2 days",
      "importantClinicalFindings": "No reported weight loss, night sweats or prolonged fever",
      "otherInformation": "Uses spectacles; preparing for university examinations",
      "presentingComplaints": "Cough, runny nose and sore throat",
      "relevantHistory": "Several family members developed similar acute respiratory symptoms during the same week",
      "riskFactors": "No major TB risk factor identified",
      "sex": "Female",
      "tbContactExposure": "No known TB contact"
    },
    "shouldSuspect": "Not strongly, based on the information provided",
    "source": "WHO TB guidance.",
    "title": "Profile 5 – The Distractor Challenge: Not Every Cough Is TB"
  }
];

export const LEVEL1_RELEARNING_MECHANISM: Record<string, unknown> = {
  "closing": "This approach will make the game more than a question-and-answer Snake & Ladder. It becomes a formative learning tool, where every mistake produces targeted reinforcement and progressively strengthens the student's ability to recognize a presumptive TB patient before moving to the more complex diagnostic algorithm.",
  "description": "The game should make an incorrect answer an opportunity for immediate remediation.",
  "exampleScreen": {
    "button": "[Try a Similar Case]",
    "correctAnswer": "Yes",
    "heading": "✗ Let's learn from this mistake",
    "remember": "Persistent symptoms + relevant clinical clues → Think TB → Evaluate appropriately.",
    "title": "Example of an in-game re-learning screen",
    "why": "Persistent cough with weight loss, fever or night sweats can raise suspicion of TB.",
    "whyIncorrect": "These symptoms should not be dismissed because they form an important clinical pattern suggestive of TB.",
    "yourAnswer": "No"
  },
  "responseCycle": [
    "Student answers incorrectly",
    "“Why was my answer wrong?” screen",
    "Correct answer displayed",
    "Why it is correct",
    "Why the selected answer was inappropriate",
    "One-line key learning point",
    "Retry / similar question"
  ],
  "responseCycleHeading": "Level 1 response cycle",
  "retryChallenge": "For important concepts, I recommend a “Retry Challenge” after the explanation. For example, if a student repeatedly fails questions about TB contact, the game should provide another TB-contact scenario rather than simply moving on.",
  "title": "Recommended Re-learning Mechanism in the Game"
};

export const LEVEL1_RELEARNING_ITEMS: RelearningItem[] = [
  {
    "correctAnswer": "Yes",
    "id": 1,
    "keyLearning": "Persistent cough plus systemic symptoms should prompt consideration of TB and appropriate evaluation.",
    "question": "A patient presents with persistent cough, fever, night sweats and unexplained weight loss. Should TB be considered?",
    "title": "Persistent cough with constitutional symptoms",
    "whyCorrect": "Persistent respiratory symptoms together with constitutional symptoms can raise suspicion of TB.",
    "whyIncorrect": "Rejecting TB consideration overlooks a clinically important combination of symptoms."
  },
  {
    "correctAnswer": "Yes",
    "id": 2,
    "keyLearning": "Do not look only at the symptom; always consider how long it has been present.",
    "question": "Is the duration and persistence of cough important when considering TB?",
    "title": "Importance of symptom duration",
    "whyCorrect": "TB commonly presents as a persistent/chronic illness, so duration contributes to clinical suspicion.",
    "whyIncorrect": "Ignoring duration can result in failure to recognize an ongoing disease process."
  },
  {
    "correctAnswer": "No",
    "id": 3,
    "keyLearning": "Duration and clinical context matter when assessing TB suspicion.",
    "question": "A patient has had a cough for only one day. Does this finding alone strongly suggest TB?",
    "title": "One-day cough",
    "whyCorrect": "A very short duration of cough, by itself, is less suggestive of TB than a persistent clinical presentation.",
    "whyIncorrect": "Immediately labeling every cough as TB can lead to inappropriate over-suspicion."
  },
  {
    "correctAnswer": "Yes",
    "id": 4,
    "keyLearning": "Unexplained weight loss should be considered along with other TB-compatible symptoms.",
    "question": "Is unexplained weight loss an important clinical clue when assessing possible TB?",
    "title": "Weight loss as a clinical clue",
    "whyCorrect": "Weight loss may occur as part of the systemic manifestations of TB.",
    "whyIncorrect": "Dismissing unexplained weight loss may cause an important constitutional clue to be missed."
  },
  {
    "correctAnswer": "Yes",
    "id": 5,
    "keyLearning": "Constitutional symptoms can contribute to recognition of possible TB.",
    "question": "Are night sweats relevant when considering TB?",
    "title": "Night sweats",
    "whyCorrect": "Night sweats can occur as a constitutional symptom of TB.",
    "whyIncorrect": "Although nonspecific, night sweats become clinically meaningful when they occur with other compatible features."
  },
  {
    "correctAnswer": "Yes",
    "id": 6,
    "keyLearning": "Haemoptysis can be an important clue in pulmonary TB.",
    "question": "Can haemoptysis occur in pulmonary TB?",
    "title": "Haemoptysis",
    "whyCorrect": "Pulmonary TB can cause haemoptysis in some patients.",
    "whyIncorrect": "Saying haemoptysis cannot occur in TB would cause the student to miss an important respiratory clue."
  },
  {
    "correctAnswer": "No",
    "id": 7,
    "keyLearning": "Do not exclude TB because a single expected symptom is missing.",
    "question": "Does the absence of fever rule out TB?",
    "title": "Absence of fever",
    "whyCorrect": "Not every patient with TB will have fever.",
    "whyIncorrect": "TB should not be excluded solely because one classical symptom is absent."
  },
  {
    "correctAnswer": "Yes",
    "id": 8,
    "keyLearning": "Always consider important risk conditions such as HIV during TB assessment.",
    "question": "Is HIV status important when assessing a patient for possible TB?",
    "title": "HIV as a risk factor",
    "whyCorrect": "HIV is an important clinical context associated with increased risk of TB.",
    "whyIncorrect": "Ignoring HIV status may result in underestimating the patient's TB risk."
  },
  {
    "correctAnswer": "Yes",
    "id": 9,
    "keyLearning": "Always ask about contact with a person who has TB.",
    "question": "A patient's household member has recently been diagnosed with TB. Is this information important?",
    "title": "Household TB contact",
    "whyCorrect": "Close household exposure is an important epidemiological clue.",
    "whyIncorrect": "Ignoring a significant exposure history may lead to under-recognition of TB risk."
  },
  {
    "correctAnswer": "No",
    "id": 10,
    "keyLearning": "Clinical clues and exposure history should be considered together.",
    "question": "If a patient has no fever, can a history of household TB contact be ignored?",
    "title": "TB contact without fever",
    "whyCorrect": "Exposure history remains important even when the patient does not have every classical symptom.",
    "whyIncorrect": "A missing symptom does not cancel an important epidemiological risk."
  },
  {
    "correctAnswer": "Yes",
    "id": 11,
    "keyLearning": "Always ask whether the patient has had TB previously.",
    "question": "Is previous TB history relevant when evaluating current TB-like symptoms?",
    "title": "Previous history of TB",
    "whyCorrect": "Previous TB and previous treatment are important parts of the patient's clinical history.",
    "whyIncorrect": "Failing to ask about previous TB may result in missing important information for subsequent evaluation."
  },
  {
    "correctAnswer": "Previous TB contact",
    "id": 12,
    "keyLearning": "Good clinical reasoning means identifying high-value information and ignoring distractions.",
    "question": "A patient with chronic cough reports his favourite cricket team, shoe size, and previous TB contact. Which information is most relevant?",
    "title": "Relevant versus irrelevant information",
    "whyCorrect": "TB contact provides meaningful epidemiological information.",
    "whyIncorrect": "Favourite team and shoe size do not contribute meaningfully to initial TB recognition."
  },
  {
    "correctAnswer": "No",
    "id": 13,
    "keyLearning": "Suspect TB first; confirm it through the appropriate diagnostic pathway.",
    "question": "Do symptoms alone confirm TB?",
    "title": "Symptoms do not equal confirmation",
    "whyCorrect": "Symptoms can raise suspicion but do not by themselves establish confirmed TB.",
    "whyIncorrect": "Calling a patient “confirmed TB” based only on symptoms confuses clinical suspicion with diagnosis."
  },
  {
    "correctAnswer": "Yes",
    "id": 14,
    "keyLearning": "The first step is to recognize the patient who may have TB and needs further evaluation.",
    "question": "A patient has several compatible symptoms and relevant TB exposure. Should the patient be considered for further TB evaluation?",
    "title": "Recognizing a presumptive TB patient",
    "whyCorrect": "The combination of symptoms and risk/exposure information can identify a patient who warrants further assessment.",
    "whyIncorrect": "Ignoring these clues could delay appropriate evaluation."
  },
  {
    "correctAnswer": "No",
    "id": 15,
    "keyLearning": "Think in patterns, not isolated symptoms.",
    "question": "Should a student make the decision about TB based on one symptom alone?",
    "title": "Combining multiple clues",
    "whyCorrect": "Clinical reasoning requires integration of symptoms, duration, risk factors, exposure and other relevant information.",
    "whyIncorrect": "A single symptom is usually insufficient to establish the clinical suspicion of TB."
  },
  {
    "correctAnswer": "Yes",
    "id": 16,
    "keyLearning": "In children, TB contact history is an important clinical clue.",
    "question": "A child has a TB-compatible symptom and a household history of TB. Should TB be considered?",
    "title": "Child with TB exposure",
    "whyCorrect": "A compatible symptom together with significant exposure warrants consideration of TB in a child.",
    "whyIncorrect": "Ignoring the exposure history may lead to missed recognition of pediatric TB."
  },
  {
    "correctAnswer": "No",
    "id": 17,
    "keyLearning": "A risk factor increases suspicion; it does not confirm disease.",
    "question": "Does HIV infection by itself mean that the patient has TB?",
    "title": "HIV does not confirm TB",
    "whyCorrect": "HIV increases the importance of considering TB but does not by itself establish the diagnosis.",
    "whyIncorrect": "Equating a risk factor with a diagnosis is a clinical reasoning error."
  },
  {
    "correctAnswer": "No",
    "id": 18,
    "keyLearning": "Contact → increased concern; diagnosis → requires appropriate evaluation.",
    "question": "Does having contact with a person with TB automatically mean that the patient has TB disease?",
    "title": "TB contact does not confirm TB",
    "whyCorrect": "Exposure increases concern and may require assessment, but exposure alone does not establish TB disease.",
    "whyIncorrect": "Exposure and disease are not the same thing."
  },
  {
    "correctAnswer": "To guide systematic clinical and diagnostic decision-making.",
    "id": 19,
    "keyLearning": "Understand the logic of the algorithm, not just the boxes and arrows.",
    "question": "What is the purpose of a TB diagnostic algorithm?",
    "title": "Purpose of the diagnostic algorithm",
    "whyCorrect": "The algorithm organizes the sequence of assessment, investigations and subsequent decisions.",
    "whyIncorrect": "The algorithm is not merely a diagram to memorize and does not replace clinical judgment."
  },
  {
    "correctAnswer": "TB should be considered and the patient should undergo appropriate further evaluation.",
    "id": 20,
    "keyLearning": "Recognize → Suspect → Evaluate.",
    "question": "A patient has persistent cough, weight loss, night sweats and a history of household TB contact. What should the student recognize?",
    "title": "Final Level-1 recognition challenge",
    "whyCorrect": "The patient has multiple compatible clinical and epidemiological clues.",
    "whyIncorrect": "Ignoring TB would overlook a clinically important pattern. However, the information given does not by itself establish confirmed TB."
  }
];

export const LEVEL1_FULL_REFERENCES: { number: number; section: string; title: string; citation: string }[] = [
  {
    "number": 1,
    "section": "A. NTEP / Government of India References",
    "title": "National Guidelines for Management of Drug Resistant TB – 2025",
    "citation": "Central TB Division, Ministry of Health & Family Welfare, Government of India. National Guidelines for Management of Drug Resistant TB. 27 March 2025."
  },
  {
    "number": 2,
    "section": "A. NTEP / Government of India References",
    "title": "NTEP Central Tuberculosis Division – Current Guidelines Portal",
    "citation": "Central Tuberculosis Division, MoHFW, Government of India. NTEP Guidelines – current online repository."
  },
  {
    "number": 3,
    "section": "A. NTEP / Government of India References",
    "title": "National Guidance on Differentiated TB Care – March 2025",
    "citation": "Central TB Division, MoHFW, Government of India. National Guidance on Differentiated TB Care. March 2025."
  },
  {
    "number": 4,
    "section": "A. NTEP / Government of India References",
    "title": "Training Module on Extrapulmonary TB",
    "citation": "Central TB Division, MoHFW, Government of India. Training Module on Extrapulmonary Tuberculosis – current version available through the CTD/NTEP guidelines repository."
  },
  {
    "number": 5,
    "section": "A. NTEP / Government of India References",
    "title": "GeneXpert / EPTB Laboratory SOP Resources",
    "citation": "Central TB Division, MoHFW, Government of India. GeneXpert SOP – Xpert processing of EPTB specimens, together with the CTD SOP for Extrapulmonary TB."
  },
  {
    "number": 6,
    "section": "A. NTEP / Government of India References",
    "title": "Technical and Operational Guidelines for TB Control in India – 2016",
    "citation": "Government of India, Ministry of Health & Family Welfare. Technical and Operational Guidelines for TB Control in India. 2016."
  },
  {
    "number": 7,
    "section": "B. WHO TB References",
    "title": "WHO Consolidated Guidelines on Tuberculosis: Module 3 – Diagnosis, 2025",
    "citation": "World Health Organization. WHO consolidated guidelines on tuberculosis: Module 3: Diagnosis. Geneva: World Health Organization; 2025. ISBN: 978-92-4-010798-4."
  },
  {
    "number": 8,
    "section": "B. WHO TB References",
    "title": "WHO Operational Handbook on Tuberculosis: Module 3 – Diagnosis, 2025",
    "citation": "World Health Organization. WHO operational handbook on tuberculosis: Module 3: Diagnosis. Geneva: WHO; 2025. ISBN: 978-92-4-011099-1."
  },
  {
    "number": 9,
    "section": "B. WHO TB References",
    "title": "WHO Consolidated Guidelines on Tuberculosis: Module 5 – Management of Tuberculosis in Children and Adolescents, 2022",
    "citation": "World Health Organization. WHO consolidated guidelines on tuberculosis: Module 5: Management of tuberculosis in children and adolescents. Geneva: WHO; 2022. ISBN: 978-92-4-004676-4."
  },
  {
    "number": 10,
    "section": "B. WHO TB References",
    "title": "WHO Operational Handbook on Tuberculosis: Module 5 – Management of Tuberculosis in Children and Adolescents",
    "citation": "Use the operational companion to Module 5 for implementation-oriented pediatric content."
  },
  {
    "number": 11,
    "section": "B. WHO TB References",
    "title": "WHO Chest X-ray / TB Imaging Resources",
    "citation": "WHO. Chest radiography in tuberculosis detection – summary of current WHO recommendations."
  },
  {
    "number": 12,
    "section": "B. WHO TB References",
    "title": "WHO Guidance on TB Infection Testing",
    "citation": "WHO consolidated guidelines on tuberculosis: Module 3: Diagnosis – Tests for tuberculosis infection. 2022. ISBN: 978-92-4-005608-4."
  },
  {
    "number": 13,
    "section": "C. Standard MBBS Medicine Textbooks",
    "title": "Kumar and Clark's Clinical Medicine – 11th Edition",
    "citation": "Randall D, Booth J, Wiles K, editors. Kumar and Clark's Clinical Medicine. 11th ed. Elsevier; 2025."
  },
  {
    "number": 14,
    "section": "C. Standard MBBS Medicine Textbooks",
    "title": "Davidson's Principles and Practice of Medicine – 25th Edition",
    "citation": "Strachan MWJ, Ralston SH, Dhaun N, Sutherland R, editors. Davidson's Principles and Practice of Medicine. 25th ed. Elsevier; 2026."
  },
  {
    "number": 15,
    "section": "C. Standard MBBS Medicine Textbooks",
    "title": "Harrison's Principles of Internal Medicine – 22nd Edition",
    "citation": "Longo DL, Fauci AS, Kasper DL, Hauser SL, Jameson JL, Loscalzo J, Holland SM, Langford CA, editors. Harrison's Principles of Internal Medicine. 22nd ed. McGraw Hill; 2025. ISBN: 9781265979317 for the two-volume print set."
  },
  {
    "number": 16,
    "section": "D. Standard Microbiology Textbooks",
    "title": "Ananthanarayan and Paniker's Textbook of Microbiology – 14th Edition",
    "citation": "Saxena S, editor. Ananthanarayan and Paniker's Textbook of Microbiology. 14th ed. Universities Press; 2026. ISBN: 9788169487009."
  },
  {
    "number": 17,
    "section": "D. Standard Microbiology Textbooks",
    "title": "Jawetz, Melnick & Adelbergs Medical Microbiology – 29th Edition",
    "citation": "Riedel S, Morse SA, editors/authors. Jawetz, Melnick & Adelbergs Medical Microbiology. 29th ed. McGraw Hill; 2026."
  },
  {
    "number": 18,
    "section": "D. Standard Microbiology Textbooks",
    "title": "Medical Microbiology – 10th Edition",
    "citation": "Murray PR, Rosenthal KS, Pfaller MA. Medical Microbiology. 10th ed. Elsevier; 2025. ISBN: 9780443261336."
  },
  {
    "number": 19,
    "section": "E. Additional High-Value References",
    "title": "Cepheid Xpert MTB/RIF / Xpert MTB/RIF Ultra Instructions for Use",
    "citation": "For the exact reporting terminology of GeneXpert, the game should also use the current manufacturer Instructions for Use/package insert for the specific assay and software version installed in your laboratory."
  },
  {
    "number": 20,
    "section": "F. Faculty-Approved Institutional Sources",
    "title": "Uploaded TB Diagnostic Algorithm",
    "citation": "Institutional teaching source: TB diagnostic algorithm.docx – 3-page TB diagnostic algorithm supplied for development of the gamified learning platform."
  }
];

export const LEVEL1_CONTENT_STATUS: string = "Pending faculty validation. For the final game, the exact diagnostic pathway should be validated against the current NTEP/WHO algorithm. The uploaded TB diagnostic algorithm.docx should be preserved as the institutional source document, but the final programmed algorithm should be faculty-validated against current NTEP/WHO recommendations before deployment.";
