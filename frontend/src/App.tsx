import { useState, useEffect, lazy, Suspense } from 'react';
import { UserRole, CaseType, LeaderboardEntry, CertificateData } from './types';
import SplashScreen from './components/SplashScreen';
import Onboarding from './components/Onboarding';
import Login from './pages/Login';
import StudentDashboard from './components/StudentDashboard';
import CaseSelection from './components/CaseSelection';
import CaseEngine from './components/CaseEngine';
import AlgorithmFlowchart from './components/AlgorithmFlowchart';
import AITutor from './components/AITutor';
import AudioSettingsModal from './components/AudioSettingsModal';
import DashboardLayout from './layouts/DashboardLayout';
import Profile from './pages/Profile';
import LevelUpCelebration from './components/LevelUpCelebration';
import VoiceAssistant from './components/VoiceAssistant';
import SkeletonLoader from './components/SkeletonLoader';
import SnakeLadderGame from './components/level1/SnakeLadderGame';
import ErrorBoundary from './components/common/ErrorBoundary';
import { authService } from './services/authService';
import { supabaseData } from './services/supabaseData';
import { supabase } from './services/supabase';
import { ProgressProvider } from './context/UserProgressContext';

// Lazy loaded enterprise sub-modules
const FacultyDashboard = lazy(() => import('./components/FacultyDashboard'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const LearningModules = lazy(() => import('./components/LearningModules'));
const Analytics = lazy(() => import('./components/Analytics'));
const LeaderboardModal = lazy(() => import('./components/LeaderboardModal'));
const ProgressReportModal = lazy(() => import('./components/ProgressReportModal'));
const CertificateModal = lazy(() => import('./components/CertificateModal'));

export default function App() {
  const isDirectLogin = typeof window !== 'undefined' && window.location.pathname === '/login';
  const [appStage, setAppStage] = useState<'splash' | 'onboarding' | 'login' | 'app'>(isDirectLogin ? 'login' : 'splash');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    level: 1,
    xp: 0,
    accuracy: 0,
    streak: 0,
    completedCases: 0,
    completedModules: 0,
    completedQuizzesPassed: 0,
    // Extended profile fields from Supabase
    usn: '',
    college: '',
    department: '',
    semester: '',
    phone: '',
    gender: '',
    dob: '',
    address: '',
    district: '',
    state: ''
  });
  
  // Progress & Unlock State
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>([]);
  const [unlockedCases, setUnlockedCases] = useState<string[]>([]);

  // Navigation & Tabs
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'cases' | 'flowcharts' | 'ai-tutor' | 'modules' | 'leaderboard' | 'analytics' | 'certificate' | 'profile'>('dashboard');
  const [subView, setSubView] = useState<'none' | 'case-select' | 'case-engine' | 'snake-ladder'>('none');
  const [moduleSubView, setModuleSubView] = useState<'main' | 'tb-intro' | 'level1-instructions' | 'level1-quiz' | 'level1-result' | 'mini-game-spot-tb-clues' | 'snake-and-ladder'>('main');
  const [selectedCaseType, setSelectedCaseType] = useState<CaseType>('pulmonary');

  // Gamification state
  const [badges, setBadges] = useState<string[]>([]);
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);
  const [bookmarkedCases, setBookmarkedCases] = useState<string[]>([]);

  const isLevel1Unlocked = userRole === 'admin' || userRole === 'faculty' || userData.level > 1 || completedQuizzes.includes('level1-quiz') || localStorage.getItem('tbquest_level1_quiz_passed') === 'true' || localStorage.getItem('tbquest_level2_unlocked') === 'true';

  const toggleBookmark = async (caseId: string) => {
    if (!currentUserId) return;
    const isBookmarked = bookmarkedCases.includes(caseId);

    if (isBookmarked) {
      setBookmarkedCases(prev => prev.filter(c => c !== caseId));
      await supabaseData.removeBookmark(currentUserId, caseId);
    } else {
      setBookmarkedCases(prev => [...prev, caseId]);
      await supabaseData.addBookmark(currentUserId, caseId);
    }
  };

  const loadUserDataFromSupabase = async (userId: string) => {
    const aggregate = await supabaseData.fetchUserData(userId);
    
    if (aggregate.profile) {
      const p = aggregate.profile;
      setUserData(prev => ({
        ...prev,
        name: p.name || 'Doctor',
        email: p.email || '',
        level: p.level ?? 1,
        xp: p.xp ?? 0,
        accuracy: p.accuracy ?? 0,
        streak: p.streak ?? 0,
        completedCases: p.completed_cases ?? 0,
        completedModules: p.completed_modules ?? 0,
        completedQuizzesPassed: p.completed_quizzes ?? 0,
        usn: p.usn || '',
        college: p.college || '',
        department: p.department || '',
        semester: p.semester || '',
        phone: p.phone || '',
        gender: p.gender || '',
        dob: p.dob || '',
        address: p.address || '',
        district: p.district || '',
        state: p.state || ''
      }));
    }

    setBadges(aggregate.achievements || []);
    setBookmarkedCases(aggregate.bookmarks || []);

    const quizResults = aggregate.quizResults || [];
    const passed = quizResults.filter((q: any) => q.case_type === 'level1-quiz' && q.score >= 80).map((q: any) => q.case_type);
    setCompletedQuizzes(passed);

    if (passed.length > 0 || localStorage.getItem('tbquest_level1_quiz_passed') === 'true' || localStorage.getItem('tbquest_level2_unlocked') === 'true') {
      setUnlockedCases(['pulmonary', 'pediatric']);
    }

    const leaderboard = await supabaseData.fetchLeaderboard();
    setLeaderboardEntries(leaderboard);
  };

  // Helper function to sync browser URL bar without page reload
  const syncBrowserUrl = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
  };

  // Session Restore & Auto-Login on Refresh / OAuth Callback
  useEffect(() => {
    async function restoreSession() {
      const authUser = await authService.getMe();
      if (authUser) {
        setCurrentUserId(authUser.id);
        setUserRole(authUser.role);
        setUserData(prev => ({
          ...prev,
          name: authUser.name,
          email: authUser.email,
          level: authUser.level ?? 1,
          xp: authUser.xp ?? 0,
          accuracy: authUser.accuracy ?? 0,
          streak: authUser.streak ?? 0,
          completedCases: authUser.completedCases ?? 0
        }));

        await loadUserDataFromSupabase(authUser.id);

        // Award daily login XP (only once per day)
        const todayKey = `tbquest_login_xp_${new Date().toDateString()}`;
        if (!localStorage.getItem(todayKey)) {
          localStorage.setItem(todayKey, '1');
          await supabaseData.awardXP(authUser.id, 'daily_login');
          // Reload to get updated XP
          await loadUserDataFromSupabase(authUser.id);
        }

        setIsAuthenticated(true);
        setAppStage('app');

        // Route Protection & Path Syncing based on role & URL
        const currentPath = window.location.pathname;
        if (authUser.role === 'admin') {
          if (currentPath === '/' || currentPath === '/login') syncBrowserUrl('/admin');
        } else if (authUser.role === 'faculty') {
          if (currentPath === '/admin') {
            syncBrowserUrl('/faculty');
          } else if (currentPath === '/' || currentPath === '/login') {
            syncBrowserUrl('/faculty');
          }
        } else {
          // Student role protection
          if (currentPath === '/admin' || currentPath === '/faculty') {
            syncBrowserUrl('/dashboard');
          } else if (currentPath === '/' || currentPath === '/login') {
            syncBrowserUrl('/dashboard');
          }
        }
      } else {
        setIsAuthenticated(false);
        setAppStage('login');
        const currentPath = window.location.pathname;
        if (currentPath === '/admin' || currentPath === '/faculty' || currentPath === '/dashboard') {
          syncBrowserUrl('/login');
        }
      }
    }

    restoreSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        restoreSession();
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setAppStage('login');
        syncBrowserUrl('/login');
      }
    });

    // Listen for browser back/forward navigation
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/admin' && userRole === 'admin') {
        setAppStage('app');
      } else if (path === '/faculty' && (userRole === 'faculty' || userRole === 'admin')) {
        setAppStage('app');
      } else if (path === '/modules') {
        setCurrentTab('modules');
      } else if (path === '/cases') {
        setCurrentTab('cases');
      } else if (path === '/certificates') {
        setCurrentTab('certificate');
      } else if (path === '/profile') {
        setCurrentTab('profile');
      } else if (path === '/dashboard') {
        setCurrentTab('dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('popstate', handlePopState);
    };
  }, [userRole]);

  // Modal states
  const [showProgressReport, setShowProgressReport] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleLogin = async (role: UserRole, email: string, name: string) => {
    const authUser = await authService.getMe();
    const activeRole = authUser?.role || role || 'student';

    if (authUser) {
      setCurrentUserId(authUser.id);
      setUserRole(activeRole);
      setUserData(prev => ({
        ...prev,
        name: authUser.name || name || 'Doctor',
        email: authUser.email || email,
        level: authUser.level ?? 1,
        xp: authUser.xp ?? 0,
        accuracy: authUser.accuracy ?? 0,
        streak: authUser.streak ?? 0,
        completedCases: authUser.completedCases ?? 0
      }));
      await loadUserDataFromSupabase(authUser.id);
    } else {
      setUserRole(role);
      setUserData(prev => ({ ...prev, email, name: name || 'Doctor' }));
    }

    setIsAuthenticated(true);
    setAppStage('app');
    setCurrentTab('dashboard');
    setSubView('none');
    setModuleSubView('main');

    // Push initial role URL
    if (activeRole === 'admin') syncBrowserUrl('/admin');
    else if (activeRole === 'faculty') syncBrowserUrl('/faculty');
    else syncBrowserUrl('/dashboard');
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUserId(null);
    setIsAuthenticated(false);
    setUserRole('student');
    setUserData(prev => ({
      ...prev,
      name: '',
      email: '',
      level: 1,
      xp: 0,
      accuracy: 0,
      streak: 0,
      completedCases: 0
    }));
    setBadges([]);
    setBookmarkedCases([]);
    setLeaderboardEntries([]);
    setCompletedQuizzes([]);
    setUnlockedCases([]);
    setAppStage('login');
    syncBrowserUrl('/login');
  };


  const handleFinishCase = async (score: number, gainedXp: number, newBadge?: string) => {
    if (!currentUserId) return;

    // Use awardXP engine for automatic XP calculation and Supabase sync
    const result = await supabaseData.awardXP(currentUserId, 'case', score);
    const updatedXp = result?.newXp ?? (userData.xp + gainedXp);
    const newLevel = result?.newLevel ?? Math.floor(updatedXp / 500) + 1;
    const oldLevel = userData.level;
    const updatedCompletedCases = userData.completedCases + 1;
    const updatedAccuracy = Math.min(100, Math.round(((userData.accuracy * userData.completedCases) + score) / updatedCompletedCases));

    if (newLevel > oldLevel) setShowCelebration(true);

    setUserData(prev => ({
      ...prev,
      xp: updatedXp,
      level: newLevel,
      accuracy: updatedAccuracy,
      completedCases: updatedCompletedCases
    }));

    // Update accuracy separately (awardXP doesn't handle accuracy)
    await supabaseData.updateUserProfile(currentUserId, { accuracy: updatedAccuracy });
    await supabaseData.saveQuizResult(currentUserId, selectedCaseType, score, gainedXp, 120);

    if (newBadge && !badges.includes(newBadge)) {
      setBadges(prev => [...prev, newBadge]);
      await supabaseData.saveAchievement(currentUserId, newBadge);
    }

    const leaderboard = await supabaseData.fetchLeaderboard();
    setLeaderboardEntries(leaderboard);
  };

  // Protected Case Selection Navigation Handler
  const handleOpenCaseSelection = () => {
    if (isLevel1Unlocked) {
      setSubView('case-select');
    } else {
      alert("Complete the Learning Module and Quiz to unlock Clinical Cases.");
      setCurrentTab('modules');
      setModuleSubView('tb-intro');
      setSubView('none');
    }
  };

  const certificateData: CertificateData = {
    studentName: userData.name || 'Doctor',
    issueDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    certificateId: `NIT-TBQ-${Math.floor(100000 + Math.random() * 900000)}`,
    totalXp: userData.xp,
    casesMastered: userData.completedCases,
    accuracy: userData.accuracy,
    institution: 'Skill Development Center, NIT Raichur'
  };

  // Render Splash Screen
  if (appStage === 'splash') {
    return (
      <SplashScreen
        onFinish={() => {
          if (isAuthenticated) {
            setAppStage('app');
          } else {
            setAppStage('login');
          }
        }}
      />
    );
  }

  if (appStage === 'onboarding') {
    return <Onboarding onComplete={() => setAppStage('login')} />;
  }

  if (appStage === 'login' || !isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // ROLE-BASED ACCESS CONTROL ROUTING
  // 1. Admin Role -> Admin Dashboard Panel
  if (userRole === 'admin') {
    return (
      <Suspense fallback={<SkeletonLoader type="dashboard" />}>
        <AdminDashboard onLogout={handleLogout} />
      </Suspense>
    );
  }

  // 2. Faculty Role -> Faculty Dashboard Panel
  if (userRole === 'faculty') {
    return (
      <Suspense fallback={<SkeletonLoader type="dashboard" />}>
        <FacultyDashboard onLogout={handleLogout} />
      </Suspense>
    );
  }

  // 3. Student Role -> Student Dashboard & Learning Portal
  const isLevel1Passed = userData.level > 1 || completedQuizzes.includes('level1-quiz') || (typeof window !== 'undefined' && (localStorage.getItem('tbquest_level1_quiz_passed') === 'true' || localStorage.getItem('tbquest_level2_unlocked') === 'true'));

  return (
    <ProgressProvider>
      <DashboardLayout 
        currentTab={currentTab} 
        setCurrentTab={(tab) => {
          if (tab === 'cases') {
            handleOpenCaseSelection();
          } else {
            setSubView('none');
            setCurrentTab(tab);
          }
        }} 
        userData={userData} 
        onLogout={handleLogout}
        isQuizPassed={isLevel1Passed}
      >
        <Suspense fallback={<SkeletonLoader type="dashboard" />}>
          {subView === 'snake-ladder' ? (
            <ErrorBoundary fallbackTitle="Snake & Ladder Game">
              <SnakeLadderGame
                currentUserId={currentUserId}
                onProceedToLevel2={() => {
                  setSubView('case-select');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onBackToDashboard={() => {
                  setSubView('none');
                  setCurrentTab('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onUnlockLevel1={() => {
                  setCompletedQuizzes(prev => [...prev, 'level1-quiz']);
                  setUnlockedCases(['pulmonary', 'pediatric']);
                  setUserData(prev => ({
                    ...prev,
                    level: Math.max(prev.level, 2),
                    xp: prev.xp + 500
                  }));
                }}
              />
            </ErrorBoundary>
          ) : subView === 'case-engine' ? (
            <CaseEngine
              caseType={selectedCaseType}
              currentUserId={currentUserId}
              onFinishCase={handleFinishCase}
              onBack={() => setSubView('none')}
            />
          ) : subView === 'case-select' ? (
            <CaseSelection
              onSelectCase={(type) => {
                setSelectedCaseType(type);
                setSubView('case-engine');
              }}
              onBack={() => setSubView('none')}
              bookmarkedCases={bookmarkedCases}
              onToggleBookmark={toggleBookmark}
              isUnlocked={isLevel1Unlocked}
              onOpenLearningModule={() => {
                setSubView('none');
                setCurrentTab('modules');
                setModuleSubView('tb-intro');
              }}
            />
          ) : (
            <>
              {currentTab === 'dashboard' && (
                <StudentDashboard
                  userId={currentUserId}
                  onStartLearning={() => {
                    setSubView('none');
                    setCurrentTab('modules');
                    setModuleSubView('tb-intro');
                  }}
                  onSelectLevel1={() => {
                    setSubView('snake-ladder');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onStartSnakeLadder={() => {
                    setSubView('snake-ladder');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onStartMiniGame={() => {
                    setSubView('none');
                    setCurrentTab('modules');
                    setModuleSubView('mini-game-spot-tb-clues');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onStartCase={handleOpenCaseSelection}
                  onOpenAITutor={() => setCurrentTab('ai-tutor')}
                  onOpenLeaderboard={() => setCurrentTab('leaderboard')}
                  onOpenProgressReport={() => setShowProgressReport(true)}
                  onOpenAudioSettings={() => setShowAudioSettings(true)}
                  isQuizPassed={isLevel1Passed}
                  userName={userData.name}
                  userLevel={userData.level}
                  userProgress={Math.min(100, Math.round((userData.completedCases / 10) * 100))}
                  xp={userData.xp}
                  badgesCount={badges.length}
                  streak={userData.streak}
                  completedCases={userData.completedCases}
                  accuracy={userData.accuracy}
                  onLogout={handleLogout}
                />
              )}

              {currentTab === 'cases' && (
                <CaseSelection
                  onSelectCase={(type) => {
                    setSelectedCaseType(type);
                    setSubView('case-engine');
                  }}
                  onBack={() => setCurrentTab('dashboard')}
                  bookmarkedCases={bookmarkedCases}
                  onToggleBookmark={toggleBookmark}
                  isUnlocked={isLevel1Unlocked}
                  onOpenLearningModule={() => {
                    setCurrentTab('modules');
                    setModuleSubView('tb-intro');
                  }}
                />
              )}

              {currentTab === 'flowcharts' && (
                <div className="p-4">
                  <AlgorithmFlowchart interactiveMode={true} onFinishCase={handleFinishCase} />
                </div>
              )}

              {currentTab === 'ai-tutor' && (
                <div className="p-4">
                  <AITutor onClose={() => setCurrentTab('dashboard')} />
                </div>
              )}

              {currentTab === 'modules' && (
                <LearningModules
                  currentUserId={currentUserId}
                  initialSubView={moduleSubView}
                  onSubViewChange={setModuleSubView}
                  onUnlockLevel1={() => {
                    setCompletedQuizzes(prev => [...prev, 'level1-quiz']);
                    setUnlockedCases(['pulmonary', 'pediatric']);
                  }}
                  onNavigateToCase={() => {
                    setSubView('case-select');
                  }}
                />
              )}

              {currentTab === 'leaderboard' && (
                <div className="p-4">
                  <LeaderboardModal onClose={() => setCurrentTab('dashboard')} entries={leaderboardEntries} badges={badges} onChallenge={(name) => alert(`Challenge sent to ${name}!`)} />
                </div>
              )}

              {currentTab === 'analytics' && (
                <div className="p-4">
                  <Analytics />
                </div>
              )}

              {currentTab === 'certificate' && (
                <div className="p-4 text-center space-y-6">
                  <button
                    onClick={() => setShowCertificate(true)}
                    className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 font-extrabold rounded-2xl text-base shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all"
                  >
                    Generate & View "TB Diagnostic Expert" Institutional Certificate
                  </button>
                  <CertificateModal certificateData={certificateData} onClose={() => setCurrentTab('dashboard')} />
                </div>
              )}

              {currentTab === 'profile' && (
                <Profile
                  userName={userData.name}
                  userEmail={userData.email}
                  userLevel={userData.level}
                  xp={userData.xp}
                  badgesCount={badges.length}
                  streak={userData.streak}
                  completedCases={userData.completedCases}
                  completedModules={userData.completedModules}
                  completedQuizzes={userData.completedQuizzesPassed}
                  usn={userData.usn}
                  college={userData.college}
                  department={userData.department}
                  semester={userData.semester}
                  phone={userData.phone}
                  gender={userData.gender}
                  dob={userData.dob}
                  address={userData.address}
                  district={userData.district}
                  state={userData.state}
                  currentUserId={currentUserId}
                  onLogout={handleLogout}
                  onOpenProgressReport={() => setShowProgressReport(true)}
                />
              )}
            </>
          )}
        </Suspense>

        {/* Global Voice Assistant & Level-up Banner */}
        <VoiceAssistant onNavigate={(tab) => {
          if (tab === 'cases-select') {
            handleOpenCaseSelection();
          } else {
            setSubView('none');
            setCurrentTab(tab as any);
          }
        }} />

        {/* Modals */}
        {showProgressReport && (
          <ProgressReportModal
            onClose={() => setShowProgressReport(false)}
            userName={userData.name}
            userLevel={userData.level}
            xp={userData.xp}
            completedCases={userData.completedCases}
            streak={userData.streak}
            badges={badges}
            accuracy={userData.accuracy}
          />
        )}
        {showCertificate && (
          <CertificateModal
            certificateData={certificateData}
            onClose={() => setShowCertificate(false)}
          />
        )}
        {showAudioSettings && (
          <AudioSettingsModal onClose={() => setShowAudioSettings(false)} />
        )}
        {showCelebration && (
          <LevelUpCelebration onComplete={() => setShowCelebration(false)} />
        )}
      </DashboardLayout>
    </ProgressProvider>
  );
}
