import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Divider,
  Paper,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  BookOpen,
  Stethoscope,
  Microscope,
  Pill,
  Brain,
  CheckCircle,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  FileText,
  HelpCircle,
  Play,
  ShieldCheck,
  Award
} from 'lucide-react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DETAILED_MODULES, LearningModuleDetail } from '../data/learningContent';
import AlgorithmFlowchart from './AlgorithmFlowchart';
import { supabaseData } from '../services/supabaseData';

// Level 1 Sub-components
import TBIntroductionPage from './level1/TBIntroductionPage';
import Level1InstructionsPage from './level1/Level1InstructionsPage';
import Level1QuizPage from './level1/Level1QuizPage';
import Level1ResultPage from './level1/Level1ResultPage';
import { level1Service } from '../services/level1Service';
import SpotTheTBClues from './SpotTheTBClues';

const modules = [
  { id: 'm1', title: 'New Learning Categories', icon: BookOpen, sub: ['TB Basics', 'Epidemiology', 'Transmission & Prevention', 'Risk Factors', 'Signs & Symptoms', 'Infection Control'] },
  { id: 'm1', title: 'Clinical Learning', icon: Stethoscope, sub: ['Pulmonary TB', 'Pediatric TB', 'Extrapulmonary TB', 'HIV-associated TB', 'Drug-Resistant TB (MDR/XDR)', 'Latent TB Infection'] },
  { id: 'm1', title: 'Diagnostic Learning', icon: Microscope, sub: ['History Taking', 'Physical Examination', 'Chest X-ray Interpretation', 'CBNAAT', 'Sputum Smear Microscopy', 'Culture & Drug Sensitivity Testing', 'Tuberculin Skin Test (TST)', 'IGRA'] },
  { id: 'm1', title: 'Treatment Learning', icon: Pill, sub: ['Drug Regimens', 'Treatment Monitoring', 'Adverse Drug Reactions', 'Patient Counselling', 'Follow-up Care'] },
  { id: 'm1', title: 'AI Learning', icon: Brain, sub: ['AI Clinical Tutor', 'AI Voice Mentor', 'AI Case Generator', 'AI Quiz Generator', 'Personalized Learning Path'] },
  { id: 'm1', title: 'Practice', icon: CheckCircle, sub: ['Flashcards', 'Interactive Clinical Cases', 'Daily Challenge', 'Timed Quiz', 'Mock Exam', 'Quick Revision'] },
];

export type SubViewType = 'main' | 'tb-intro' | 'level1-instructions' | 'level1-quiz' | 'level1-result' | 'mini-game-spot-tb-clues';

interface LearningModulesProps {
  currentUserId?: string | null;
  initialSubView?: SubViewType;
  onNavigateToCase?: () => void;
  onUnlockLevel1?: () => void;
}

export default function LearningModules({
  currentUserId,
  initialSubView = 'main',
  onNavigateToCase,
  onUnlockLevel1
}: LearningModulesProps) {
  const [activeSubView, setActiveSubView] = useState<SubViewType>(initialSubView);
  const [selectedModule, setSelectedModule] = useState<LearningModuleDetail | null>(null);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showQuizFeedback, setShowQuizFeedback] = useState<Record<number, boolean>>({});
  const [progress, setProgress] = useState<number>(0);

  // Sync initial subview when prop changes
  useEffect(() => {
    if (initialSubView) {
      setActiveSubView(initialSubView);
    }
  }, [initialSubView]);

  // Level 1 Quiz Result Stats
  const [level1Stats, setLevel1Stats] = useState<{
    totalScore: number;
    percentage: number;
    correctCount: number;
    wrongCount: number;
    xpEarned: number;
    badge: string;
    passed: boolean;
    durationSeconds: number;
  } | null>(null);

  // Load user's module progress from Supabase if authenticated
  useEffect(() => {
    async function loadModuleProgress() {
      if (!currentUserId || !selectedModule) return;
      const records = await supabaseData.fetchModuleProgress(currentUserId);
      const modRecord = records.find(r => r.module_id === selectedModule.id);
      if (modRecord) {
        setProgress(modRecord.score || 0);
      } else {
        setProgress(0);
      }
    }
    loadModuleProgress();
  }, [currentUserId, selectedModule]);

  const handleOpenModule = (modId: string) => {
    const detail = DETAILED_MODULES[modId] || DETAILED_MODULES['m1'];
    setSelectedModule(detail);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerSelect = (qIdx: number, oIdx: number) => {
    setUserAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
    setShowQuizFeedback(prev => ({ ...prev, [qIdx]: true }));
    const newProgress = Math.min(100, progress + 25);
    setProgress(newProgress);

    if (currentUserId && selectedModule) {
      const isCompleted = newProgress >= 100;
      supabaseData.saveModuleProgress(currentUserId, selectedModule.id, isCompleted, newProgress);
      // Award module completion XP via engine when fully completed
      if (isCompleted && newProgress !== progress) {
        supabaseData.awardXP(currentUserId, 'module');
      }
    }
  };


  const handleStartLevel1Flow = () => {
    if (level1Service.isIntroCompleted()) {
      setActiveSubView('level1-instructions');
    } else {
      setActiveSubView('tb-intro');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Subview Renders
  if (activeSubView === 'tb-intro') {
    return (
      <TBIntroductionPage
        onCompleteRead={() => {
          setActiveSubView('level1-instructions');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (activeSubView === 'level1-instructions') {
    return (
      <Level1InstructionsPage
        onStartQuiz={() => {
          setActiveSubView('level1-quiz');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBackToIntro={() => {
          setActiveSubView('tb-intro');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (activeSubView === 'level1-quiz') {
    return (
      <Level1QuizPage
        userId={currentUserId}
        onFinishQuiz={async (stats) => {
          setLevel1Stats(stats);
          if (stats.passed) {
            localStorage.setItem('tbquest_level1_quiz_passed', 'true');
            if (onUnlockLevel1) onUnlockLevel1();

            // Award XP via real Supabase engine
            if (currentUserId) {
              const activityType = stats.percentage === 100 ? 'perfect_quiz' : 'quiz';
              await supabaseData.awardXP(currentUserId, activityType, stats.percentage);
              if (stats.percentage === 100) {
                // Also award base quiz XP when perfect
                await supabaseData.awardXP(currentUserId, 'quiz', stats.percentage);
              }
              await supabaseData.saveQuizResult(currentUserId, 'level1-quiz', stats.totalScore, stats.xpEarned, stats.durationSeconds);
            }
          }
          setActiveSubView('level1-result');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }


  if (activeSubView === 'level1-result' && level1Stats) {
    return (
      <Level1ResultPage
        stats={level1Stats}
        onRetry={() => {
          level1Service.clearActiveAttempt();
          setActiveSubView('level1-quiz');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onProceedToLevel2={() => {
          setActiveSubView('mini-game-spot-tb-clues');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onBackToModules={() => {
          setActiveSubView('main');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }

  if (activeSubView === 'mini-game-spot-tb-clues') {
    return (
      <SpotTheTBClues
        currentUserId={currentUserId}
        onProceedToLevel2={() => {
          if (onNavigateToCase) {
            onNavigateToCase();
          } else {
            setActiveSubView('main');
          }
        }}
        onReturnToDashboard={() => {
          setActiveSubView('main');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    );
  }


  // Detailed Comprehensive Learning Page
  if (selectedModule) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 text-white">
        {/* Back navigation button */}
        <Button
          startIcon={<ArrowLeft size={18} />}
          onClick={() => setSelectedModule(null)}
          variant="outlined"
          sx={{ color: '#06b6d4', borderColor: '#06b6d4', borderRadius: '12px' }}
        >
          Back to All Learning Modules
        </Button>

        {/* Header Hero Banner */}
        <Paper className="p-4 sm:p-8 bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/40 rounded-2xl sm:rounded-3xl space-y-4">
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div>
              <Chip label="CDC & NTEP Certified Content" color="primary" size="small" className="mb-2 font-mono" />
              <Typography variant="h3" className="font-bold text-white mb-2 text-2xl sm:text-4xl">
                {selectedModule.title}
              </Typography>
              <Typography variant="body1" className="text-slate-300 max-w-3xl text-xs sm:text-base">
                {selectedModule.overview}
              </Typography>
            </div>
            <div className="bg-slate-950/80 p-4 rounded-2xl border border-cyan-500/30 text-center font-mono w-full sm:w-auto">
              <Typography variant="caption" className="text-slate-400 uppercase">Module Progress</Typography>
              <Typography variant="h5" className="text-cyan-400 font-bold">{progress}%</Typography>
              <LinearProgress variant="determinate" value={progress} className="mt-2 rounded-full h-2 w-full sm:w-32" />
            </div>
          </div>
        </Paper>

        {/* Detailed Content Grid */}
        <Grid container spacing={3}>
          {/* Main Content Column */}
          <Grid size={{ xs: 12, lg: 8 }} className="space-y-4 sm:space-y-6">
            {/* Learning Objectives */}
            <Card className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 sm:p-6">
              <Typography variant="h6" className="font-bold text-cyan-400 mb-3 flex items-center gap-2 text-base sm:text-lg">
                <Sparkles size={20} /> Learning Objectives
              </Typography>
              <ul className="space-y-2 text-slate-300 text-xs sm:text-sm">
                {selectedModule.learningObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Introduction */}
            <Card className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 sm:p-6 space-y-3">
              <Typography variant="h6" className="font-bold text-white text-base sm:text-lg">Introduction</Typography>
              <Typography variant="body2" className="text-slate-300 leading-relaxed text-xs sm:text-sm">{selectedModule.introduction}</Typography>
            </Card>

            {/* Epidemiology & Causes */}
            <Card className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 sm:p-6 space-y-4">
              <Typography variant="h6" className="font-bold text-white text-base sm:text-lg">Epidemiology & Etiology</Typography>
              <Typography variant="body2" className="text-slate-300 leading-relaxed text-xs sm:text-sm">{selectedModule.epidemiology}</Typography>
              <Divider className="bg-slate-800" />
              <Typography variant="subtitle2" className="font-bold text-cyan-400">Microbiological Cause (Causative Agent):</Typography>
              <Typography variant="body2" className="text-slate-300 text-xs sm:text-sm">{selectedModule.causes}</Typography>
            </Card>

            {/* Risk Factors */}
            <Card className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 sm:p-6 space-y-3">
              <Typography variant="h6" className="font-bold text-amber-400 text-base sm:text-lg">Risk Factors & High-Risk Stratification</Typography>
              <Grid container spacing={2}>
                {selectedModule.riskFactors.map((rf, i) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={i}>
                    <Paper className="p-3 bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
                      <span>{rf}</span>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Card>

            {/* Signs & Symptoms */}
            <Card className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 sm:p-6 space-y-4">
              <Typography variant="h6" className="font-bold text-white text-base sm:text-lg">Signs & Symptoms</Typography>
              
              <Typography variant="subtitle2" className="text-cyan-400 font-bold">1. Pulmonary TB Manifestations:</Typography>
              <ul className="space-y-1.5 text-slate-300 text-xs pl-4 list-disc">
                {selectedModule.signsAndSymptoms.pulmonary.map((s, i) => <li key={i}>{s}</li>)}
              </ul>

              <Typography variant="subtitle2" className="text-purple-400 font-bold mt-3">2. Extrapulmonary TB Manifestations:</Typography>
              <ul className="space-y-1.5 text-slate-300 text-xs pl-4 list-disc">
                {selectedModule.signsAndSymptoms.extrapulmonary.map((s, i) => <li key={i}>{s}</li>)}
              </ul>

              <Typography variant="subtitle2" className="text-emerald-400 font-bold mt-3">3. Pediatric Specific Symptoms:</Typography>
              <ul className="space-y-1.5 text-slate-300 text-xs pl-4 list-disc">
                {selectedModule.signsAndSymptoms.pediatric.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </Card>

            {/* Diagnostic Approach & Lab Investigations */}
            <Card className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 sm:p-6 space-y-4">
              <Typography variant="h6" className="font-bold text-white text-base sm:text-lg">Diagnostic Approach & Laboratory Investigations</Typography>
              <Typography variant="body2" className="text-slate-300 text-xs sm:text-sm">{selectedModule.diagnosticApproach}</Typography>

              <div className="space-y-3 mt-4">
                {selectedModule.laboratoryInvestigations.map((lab, i) => (
                  <Paper key={i} className="p-3 sm:p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <Typography variant="subtitle2" className="font-bold text-cyan-400">{lab.name}</Typography>
                    <Typography variant="body2" className="text-slate-300 text-xs">{lab.description}</Typography>
                    <Typography variant="caption" className="text-emerald-400 font-mono block">Interpretation: {lab.interpretation}</Typography>
                  </Paper>
                ))}
              </div>
            </Card>

            {/* Imaging Findings & Differential Diagnosis */}
            <Card className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 sm:p-6 space-y-4">
              <Typography variant="h6" className="font-bold text-white text-base sm:text-lg">Chest Imaging & Differential Diagnosis</Typography>
              
              <Typography variant="subtitle2" className="text-indigo-400 font-bold">Chest Radiograph (CXR) Key Findings:</Typography>
              <ul className="space-y-1 text-slate-300 text-xs pl-4 list-disc">
                {selectedModule.imagingFindings.map((img, i) => <li key={i}>{img}</li>)}
              </ul>

              <Typography variant="subtitle2" className="text-rose-400 font-bold mt-3">Differential Diagnosis to Rule Out:</Typography>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedModule.differentialDiagnosis.map((dd, i) => (
                  <Chip key={i} label={dd} variant="outlined" size="small" sx={{ color: '#fda4af', borderColor: '#f43f5e' }} />
                ))}
              </div>
            </Card>

            {/* Treatment & Drug Regimens */}
            <Card className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 sm:p-6 space-y-4">
              <Typography variant="h6" className="font-bold text-emerald-400 text-base sm:text-lg">Treatment & Recommended Drug Regimens</Typography>
              <Typography variant="body2" className="text-slate-300 text-xs sm:text-sm">{selectedModule.treatment}</Typography>

              <div className="space-y-3 mt-3">
                {selectedModule.drugRegimens.map((reg, i) => (
                  <Paper key={i} className="p-3 sm:p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1 font-mono text-xs">
                    <Typography variant="subtitle2" className="font-bold text-emerald-400">{reg.regimen}</Typography>
                    <Typography variant="body2" className="text-cyan-300">Drugs: {reg.drugs}</Typography>
                    <Typography variant="caption" className="text-slate-400 block">Duration: {reg.duration} | Note: {reg.notes}</Typography>
                  </Paper>
                ))}
              </div>
            </Card>

            {/* Follow-up & Infection Control */}
            <Card className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 sm:p-6 space-y-4">
              <Typography variant="h6" className="font-bold text-white text-base sm:text-lg">Follow-up Care & Airborne Infection Control</Typography>
              <Typography variant="body2" className="text-slate-300 text-xs">{selectedModule.followUp}</Typography>

              <Typography variant="subtitle2" className="text-amber-400 font-bold mt-2">Infection Control Standards:</Typography>
              <ul className="space-y-1.5 text-slate-300 text-xs pl-4 list-disc">
                {selectedModule.infectionControl.map((ic, i) => <li key={i}>{ic}</li>)}
              </ul>
            </Card>

            {/* Interactive Embedded Flowchart */}
            <Card className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 sm:p-6 space-y-4">
              <Typography variant="h6" className="font-bold text-amber-400 flex items-center gap-2 text-base sm:text-lg">
                <FileText size={20} /> Interactive Diagnostic Flowchart
              </Typography>
              <AlgorithmFlowchart interactiveMode={true} />
            </Card>

            {/* Case-Based Learning */}
            <Card className="bg-slate-900 border border-cyan-500/40 text-white rounded-2xl p-4 sm:p-6 space-y-4">
              <Typography variant="h6" className="font-bold text-cyan-300 flex items-center gap-2 text-base sm:text-lg">
                <Brain size={20} /> Clinical Case-Based Scenario
              </Typography>
              <Typography variant="subtitle2" className="font-bold text-white">{selectedModule.caseScenario.patient}</Typography>
              <Typography variant="body2" className="text-slate-300 text-xs">{selectedModule.caseScenario.presentation}</Typography>
              <Typography variant="body2" className="text-cyan-400 font-semibold text-xs mt-2">{selectedModule.caseScenario.question}</Typography>
              
              <div className="space-y-2">
                {selectedModule.caseScenario.options.map((opt, i) => (
                  <Paper key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200">
                    <p className="font-bold">{opt.label}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{opt.rationale}</p>
                  </Paper>
                ))}
              </div>
            </Card>

            {/* Interactive Quiz with Explanations */}
            <Card className="bg-slate-900 border border-purple-500/40 text-white rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6">
              <Typography variant="h6" className="font-bold text-purple-400 flex items-center gap-2 text-base sm:text-lg">
                <HelpCircle size={20} /> Interactive Self-Assessment Quiz
              </Typography>

              {selectedModule.quiz.map((q, qIdx) => {
                const selectedOpt = userAnswers[qIdx];
                const showFeedback = showQuizFeedback[qIdx];

                return (
                  <div key={qIdx} className="space-y-3 p-3.5 sm:p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <Typography variant="subtitle2" className="font-bold text-white text-xs">
                      Q{qIdx + 1}: {q.question}
                    </Typography>

                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isChosen = selectedOpt === oIdx;
                        const isCorrect = oIdx === q.correctIndex;

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleAnswerSelect(qIdx, oIdx)}
                            className={`w-full p-2.5 sm:p-3 text-left rounded-xl border text-xs transition-all ${
                              showFeedback && isChosen
                                ? isCorrect
                                  ? 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold'
                                  : 'bg-rose-950 border-rose-500 text-rose-200'
                                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-cyan-500/50'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {showFeedback && (
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-cyan-300 font-mono">
                        Explanation: {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </Card>
          </Grid>

          {/* Right Sidebar Column */}
          <Grid size={{ xs: 12, lg: 4 }} className="space-y-4 sm:space-y-6">
            {/* Clinical Pearls */}
            <Card className="bg-slate-900 border border-amber-500/40 text-white rounded-2xl p-4 sm:p-6 space-y-3">
              <Typography variant="h6" className="font-bold text-amber-400 flex items-center gap-2 text-base sm:text-lg">
                <Sparkles size={20} /> High-Yield Clinical Pearls
              </Typography>
              <ul className="space-y-2 text-slate-200 text-xs">
                {selectedModule.clinicalPearls.map((pearl, i) => (
                  <li key={i} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 leading-relaxed">
                    💡 {pearl}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Key Takeaways */}
            <Card className="bg-slate-900 border border-emerald-500/40 text-white rounded-2xl p-4 sm:p-6 space-y-3">
              <Typography variant="h6" className="font-bold text-emerald-400 text-base sm:text-lg">Key Takeaways</Typography>
              <ul className="space-y-2 text-slate-200 text-xs">
                {selectedModule.keyTakeaways.map((kt, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span>{kt}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* WHO / CDC Summary */}
            <Card className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 sm:p-6 space-y-3">
              <Typography variant="h6" className="font-bold text-cyan-400 text-base sm:text-lg">WHO / CDC Guideline Summary</Typography>
              <Typography variant="body2" className="text-slate-300 text-xs leading-relaxed">
                {selectedModule.guidelineSummary}
              </Typography>
            </Card>

            {/* References */}
            <Card className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-4 sm:p-6 space-y-3">
              <Typography variant="h6" className="font-bold text-slate-400 text-base sm:text-lg">References & Guidelines</Typography>
              <ul className="space-y-1.5 text-slate-400 text-[11px] font-mono list-disc pl-4">
                {selectedModule.references.map((ref, i) => <li key={i}>{ref}</li>)}
              </ul>
            </Card>
          </Grid>
        </Grid>
      </div>
    );
  }

  // Original UI Grid layout preserved + Added Level 1 Hero Banner
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
      {/* Prominent Level 1 Assessment Hero Card */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/50 p-6 sm:p-8 rounded-3xl space-y-4 shadow-[0_0_35px_rgba(6,182,212,0.15)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-mono">
              <ShieldCheck size={14} /> Level 1 Foundation Certification
            </div>
            <Typography variant="h4" className="font-black text-white text-2xl sm:text-4xl">
              Level 1 Learning & Quiz Assessment System
            </Typography>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Complete the 100% TB Introduction reading, view the exam guidelines, and test your clinical skills across 20 randomized questions (30 Theory + 20 Clinical Scenarios bank).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleStartLevel1Flow}
              className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all cursor-pointer"
            >
              <Play size={18} className="fill-slate-950" />
              <span>Level 1 Assessment</span>
            </button>

            <button
              onClick={() => {
                setActiveSubView('mini-game-spot-tb-clues');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all cursor-pointer hover:scale-105"
            >
              <Sparkles size={18} className="text-slate-950" />
              <span>Spot the TB Clues Mini Game 🏆</span>
            </button>
          </div>
        </div>
      </div>

      <Typography variant="h4" className="text-white mb-4 font-bold text-2xl sm:text-4xl">All Learning Modules</Typography>
      <Grid container spacing={3}>
        {modules.map((module, idx) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={`${module.title}_${idx}`}>
            <Card className="bg-slate-900 border border-slate-800 text-white rounded-2xl hover:border-cyan-500/50 transition-all cursor-pointer">
              <CardContent>
                <div
                  className="flex items-center justify-between mb-4 flex-wrap gap-2"
                  onClick={() => handleOpenModule(module.id)}
                >
                  <div className="flex items-center gap-3">
                    <module.icon className="text-cyan-400" size={24} />
                    <Typography variant="h6" className="font-bold text-base sm:text-lg">{module.title}</Typography>
                  </div>
                  <Chip label="Open Module" size="small" color="primary" onClick={() => handleOpenModule(module.id)} />
                </div>

                {module.sub.map((sub) => (
                  <Accordion key={sub} className="bg-slate-950 border border-slate-800 text-slate-300 shadow-none">
                    <AccordionSummary expandIcon={<ExpandMoreIcon className="text-slate-500" />}>
                      <Typography className="text-xs sm:text-sm">{sub}</Typography>
                    </AccordionSummary>
                    <AccordionDetails className="space-y-2">
                      <Typography variant="body2" className="text-slate-400 text-xs">
                        CDC & NTEP guideline topics for {sub}. Includes clinical objectives, diagnostic flowcharts, and self-assessment quiz.
                      </Typography>
                      <Button
                        size="small"
                        variant="text"
                        sx={{ color: '#06b6d4', textTransform: 'none', fontSize: '12px' }}
                        onClick={() => handleOpenModule(module.id)}
                      >
                        Read Full CDC Module Notes →
                      </Button>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
