import React from 'react';
import Level1GameIntro from './Level1GameIntro';

interface Level1InstructionsPageProps {
  onStartQuiz: () => void;
  onBackToIntro: () => void;
}

/**
 * Replaces the legacy 50-question "Official Level 1 Assessment" page completely
 * with the new 6-screen interactive Level 1 Game Introduction flow.
 */
export default function Level1InstructionsPage({
  onStartQuiz,
  onBackToIntro
}: Level1InstructionsPageProps) {
  return (
    <Level1GameIntro
      onStartGame={onStartQuiz}
      onBackToIntro={onBackToIntro}
      isModal={false}
    />
  );
}
