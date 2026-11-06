import { CaseType } from '../types';
import HospitalEMREngine from './HospitalEMREngine';

interface CaseEngineProps {
  caseType: CaseType;
  currentUserId?: string | null;
  onFinishCase: (score: number, xp: number, badge?: string) => void;
  onBack: () => void;
}

export default function CaseEngine({ currentUserId, onFinishCase, onBack }: CaseEngineProps) {
  return (
    <div className="tq-fade-up mx-auto w-full max-w-7xl overflow-hidden bg-alabaster px-3 font-sans dark:bg-[#0b1220] sm:px-6">
    <HospitalEMREngine
      currentUserId={currentUserId}
      onFinishCase={onFinishCase}
      onBack={onBack}
    />
    </div>
  );
}
