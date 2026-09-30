import React from 'react';
import Level1GameIntro from './Level1GameIntro';

interface Level1HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  musicEnabled?: boolean;
  sfxEnabled?: boolean;
  onToggleMusic?: () => void;
  onToggleSfx?: () => void;
}

export default function Level1HowToPlayModal({
  isOpen,
  onClose
}: Level1HowToPlayModalProps) {
  if (!isOpen) return null;

  return (
    <Level1GameIntro
      onStartGame={onClose}
      isModal={true}
      onClose={onClose}
    />
  );
}
