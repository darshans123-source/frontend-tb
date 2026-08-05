import React, { useState } from 'react';
import NewsTicker from './dashboard/NewsTicker';
import WelcomeHero from './dashboard/WelcomeHero';
import LearningProgressCard from './dashboard/LearningProgressCard';
import TBFactCard from './dashboard/TBFactCard';
import TBIndiaGrid from './dashboard/TBIndiaGrid';
import MyLearningRoadmap from './dashboard/MyLearningRoadmap';
import ArticleModal, { ArticleData } from './dashboard/ArticleModal';
import DashboardFooter from './dashboard/DashboardFooter';

interface StudentDashboardProps {
  onStartLearning: () => void;
  onSelectLevel1: () => void;
  onStartCase: () => void;
  onOpenAITutor: () => void;
  onOpenLeaderboard: () => void;
  onOpenProgressReport: () => void;
  onOpenAudioSettings: () => void;
  userName: string;
  userLevel: number;
  userProgress: number;
  xp: number;
  badgesCount: number;
  streak: number;
  completedCases: number;
  accuracy?: number;
  onLogout: () => void;
}

export default function StudentDashboard({
  onStartLearning,
  onSelectLevel1,
  onStartCase,
  onOpenAITutor,
  onOpenLeaderboard,
  onOpenProgressReport,
  onOpenAudioSettings,
  userName,
  userLevel,
  userProgress,
  xp,
  badgesCount,
  streak,
  completedCases,
  accuracy,
  onLogout
}: StudentDashboardProps) {
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);

  const calculatedProgress = Math.min(100, Math.max(userProgress, Math.round((completedCases / 10) * 100)));

  return (
    <div className="space-y-6 pb-20 px-4 sm:px-6 md:px-8 max-w-[1600px] mx-auto">
      {/* Top Scrolling Dark Navy News Ribbon */}
      <NewsTicker
        onSelectNewsItem={(itemText) => {
          setSelectedArticle({
            title: itemText,
            category: 'LATEST UPDATE',
            readTime: '2 min',
            content: [
              `Official announcement regarding ${itemText} under National Tuberculosis Elimination Programme guidelines.`,
              'All medical students, healthcare practitioners, and diagnostic teams are encouraged to follow updated WHO & NTEP algorithms for rapid case notification and treatment initiation.'
            ],
            keyHighlights: [
              'Upfront molecular testing for presumptive cases.',
              'Free treatment and nutritional support under Ni-kshay scheme.'
            ]
          });
        }}
      />

      {/* Row 1: Welcome Hero Card + Learning Progress Card + Did You Know Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Welcome Hero Card */}
        <div className="lg:col-span-5 xl:col-span-6">
          <WelcomeHero
            userName={userName}
            onLearnClick={onStartLearning}
            onExploreClick={onOpenAITutor}
            onPracticeClick={onStartCase}
            onApplyClick={onOpenProgressReport}
          />
        </div>

        {/* Learning Progress Card */}
        <div className="lg:col-span-4 xl:col-span-3">
          <LearningProgressCard
            overallProgress={calculatedProgress}
            xp={xp}
            badgesCount={badgesCount}
            completedLevels={userLevel > 1 ? userLevel - 1 : (completedCases > 0 ? 1 : 0)}
            completedCases={completedCases}
            streak={streak}
          />
        </div>

        {/* Did You Know Card */}
        <div className="lg:col-span-3 xl:col-span-3">
          <TBFactCard
            onOpenArticle={(article) => setSelectedArticle(article)}
          />
        </div>
      </div>

      {/* Row 2: TB IN INDIA - 2026 Grid + Right Column (TB Awareness & Quick Links) */}
      <div>
        <TBIndiaGrid
          onOpenArticle={(article) => setSelectedArticle(article)}
          onOpenQuickLink={(linkId) => {
            if (linkId === 'intro') onStartLearning();
            else if (linkId === 'forum') onOpenAITutor();
            else if (linkId === 'resources') onOpenProgressReport();
            else onStartLearning();
          }}
        />
      </div>

      {/* Row 3: MY TB QUEST JOURNEY Stepper Roadmap Bar */}
      <div>
        <MyLearningRoadmap
          userLevel={userLevel}
          completedCases={completedCases}
          onStartLevel={(lvl) => {
            if (lvl === 1) onSelectLevel1();
            else onStartCase();
          }}
          onStartIntroduction={onStartLearning}
        />
      </div>

      {/* Article Modal */}
      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
}

