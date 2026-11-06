import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

export default function LevelUpCelebration({ onComplete }: { onComplete: () => void }) {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch('https://assets4.lottiefiles.com/packages/lf20_t2sx5y2w.json')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(() => onComplete()); // Fallback if fetch fails
  }, [onComplete]);

  if (!animationData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-gradient-to-br from-brand-teal/20 via-brand-royal/20 to-brand-coral/20 tq-fade-in">
      <Lottie
        animationData={animationData}
        loop={false}
        onComplete={onComplete}
        className="w-full h-full max-w-lg tq-fade-up"
      />
    </div>
  );
}
