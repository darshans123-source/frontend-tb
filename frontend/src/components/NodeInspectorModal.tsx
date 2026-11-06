import { useState, useEffect } from 'react';
import { AlgorithmNode } from '../types';
import { motion } from 'motion/react';
import { 
  X, Volume2, VolumeX, Play, Square, BookOpen, 
  CheckCircle2, Info, Sparkles, FileText, Image as ImageIcon, ShieldAlert 
} from 'lucide-react';

interface NodeInspectorModalProps {
  node: AlgorithmNode | null;
  onClose: () => void;
  onJumpToSimulation?: (nodeId: string) => void;
}

export default function NodeInspectorModal({ node, onClose, onJumpToSimulation }: NodeInspectorModalProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'guidelines' | 'investigation' | 'notes'>('overview');

  useEffect(() => {
    // Cancel audio playback when node changes or modal closes
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [node]);

  if (!node) return null;

  const speakVoiceScript = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech audio narration is not supported in your browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    const textToRead = node.voiceScript || `${node.label}. ${node.description}. ${node.guidelineNote}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    window.speechSynthesis.cancel(); // Clear any ongoing speech
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const getCategoryBadgeClass = (category: AlgorithmNode['category']) => {
    switch (category) {
      case 'presumptive':
        return 'bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-500/50 text-amber-800 dark:text-amber-300';
      case 'plhiv':
        return 'bg-violet-100 dark:bg-violet-950/80 border-violet-300 dark:border-violet-500/50 text-violet-800 dark:text-violet-300';
      case 'investigation':
        return 'bg-teal-100 dark:bg-cyan-950/80 border-teal-300 dark:border-cyan-500/50 text-teal-800 dark:text-cyan-300';
      case 'cbnaat':
        return 'bg-blue-100 dark:bg-blue-950/80 border-blue-300 dark:border-blue-400 text-blue-800 dark:text-blue-300';
      case 'dr-pathway':
        return 'bg-rose-100 dark:bg-rose-950/80 border-rose-300 dark:border-rose-500/50 text-rose-800 dark:text-rose-300';
      case 'clinical-pathway':
        return 'bg-orange-100 dark:bg-orange-950/80 border-orange-300 dark:border-orange-500/50 text-orange-800 dark:text-orange-300';
      case 'result':
        return 'bg-violet-100 dark:bg-purple-950/80 border-violet-300 dark:border-purple-500/50 text-violet-800 dark:text-purple-300';
      case 'treatment':
        return 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-300 dark:border-emerald-500/50 text-emerald-800 dark:text-emerald-300';
      case 'referral':
        return 'bg-rose-100 dark:bg-rose-950/80 border-rose-300 dark:border-rose-400 text-rose-800 dark:text-rose-200';
      default:
        return 'bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="tq-card tq-fade-up relative w-full max-w-3xl rounded-3xl text-slate-900 dark:text-white shadow-[0_0_50px_rgba(13,148,136,0.25)] overflow-hidden my-8"
      >
        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/90">
          <div className="flex items-center gap-3">
            <span className={`tq-chip border ${getCategoryBadgeClass(node.category)}`}>
              {node.category} Node
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">ID: {node.id}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Voice Narration Button */}
            <button
              onClick={speakVoiceScript}
              className={`touch-target flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                isPlayingAudio
                  ? 'bg-rose-100 dark:bg-rose-500/20 border-rose-400 dark:border-rose-500 text-rose-700 dark:text-rose-300 animate-pulse'
                  : 'bg-teal-50 dark:bg-cyan-500/10 border-teal-300 dark:border-cyan-500/40 text-brand-teal dark:text-cyan-300 hover:bg-teal-100 dark:hover:bg-cyan-500/20'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Square size={14} className="fill-rose-400" />
                  <span>Stop Narration</span>
                </>
              ) : (
                <>
                  <Volume2 size={14} />
                  <span>Voice Narration</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="touch-target p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-all"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Node Title & Description */}
        <div className="p-6 pb-4 bg-gradient-to-b from-teal-50 dark:from-slate-950 to-white dark:to-slate-900 border-b border-slate-200 dark:border-slate-800">
          <h2 className="tq-display text-2xl text-slate-900 dark:text-white mb-2">{node.label}</h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{node.description}</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 gap-2 pt-2 max-w-full">
          <button
            onClick={() => setActiveTab('overview')}
            className={`touch-target px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-t border-x shrink-0 ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-brand-teal dark:text-cyan-400 border-b-2 border-b-brand-teal dark:border-b-cyan-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Overview & Image
          </button>
          <button
            onClick={() => setActiveTab('guidelines')}
            className={`touch-target px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-t border-x shrink-0 ${
              activeTab === 'guidelines'
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-brand-teal dark:text-cyan-400 border-b-2 border-b-brand-teal dark:border-b-cyan-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            CDC / WHO / NTEP Guidelines
          </button>
          <button
            onClick={() => setActiveTab('investigation')}
            className={`touch-target px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-t border-x shrink-0 ${
              activeTab === 'investigation'
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-brand-teal dark:text-cyan-400 border-b-2 border-b-brand-teal dark:border-b-cyan-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Investigation Details
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`touch-target px-4 py-2.5 text-xs font-bold rounded-t-xl transition-all border-t border-x shrink-0 ${
              activeTab === 'notes'
                ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-brand-teal dark:text-cyan-400 border-b-2 border-b-brand-teal dark:border-b-cyan-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Learning Notes
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 max-h-[420px] overflow-y-auto custom-scrollbar space-y-4 max-w-full">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              {node.imageUrl && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 h-52 group">
                  <img
                    src={node.imageUrl}
                    alt={node.label}
                    className="tq-img w-full h-full aspect-video group-hover:scale-105 transition-transform duration-500 opacity-90 dark:opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-4">
                    <span className="tq-chip tq-chip-teal">
                      <ImageIcon size={14} /> Diagnostic Clinical Reference Image
                    </span>
                  </div>
                </div>
              )}

              <div className="p-4 bg-teal-50 dark:bg-cyan-950/30 border border-teal-200 dark:border-cyan-500/30 rounded-2xl space-y-2">
                <div className="tq-eyebrow flex items-center gap-2">
                  <Info size={16} /> National NTEP Guideline Rule
                </div>
                <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm leading-relaxed italic">
                  "{node.guidelineNote}"
                </p>
              </div>

              {node.decisionQuestion && (
                <div className="tq-card p-4 min-w-0">
                  <h4 className="tq-eyebrow block mb-2">Interactive Decision Question:</h4>
                  <p className="text-sm font-bold text-brand-teal dark:text-cyan-300">{node.decisionQuestion}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'guidelines' && (
            <div className="space-y-4">
              {node.cdcGuideline && (
                <div className="p-4 bg-blue-50 dark:bg-slate-950 border border-blue-300 dark:border-blue-500/30 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-brand-royal dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                    <BookOpen size={14} /> CDC Recommendation
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">{node.cdcGuideline}</p>
                </div>
              )}

              {node.whoRecommendation && (
                <div className="p-4 bg-emerald-50 dark:bg-slate-950 border border-emerald-300 dark:border-emerald-500/30 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <Sparkles size={14} /> WHO Guidelines Standard
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">{node.whoRecommendation}</p>
                </div>
              )}

              {node.ntepGuideline && (
                <div className="p-4 bg-amber-50 dark:bg-slate-950 border border-amber-300 dark:border-amber-500/30 rounded-2xl space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <ShieldAlert size={14} /> NTEP Operational Protocol
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">{node.ntepGuideline}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'investigation' && (
            <div className="space-y-4">
              <div className="tq-card p-4 space-y-2 min-w-0">
                <h4 className="tq-eyebrow">Investigation Details:</h4>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {node.investigationDetails || node.description}
                </p>
              </div>

              {node.interpretationText && (
                <div className="p-4 bg-violet-50 dark:bg-purple-950/30 border border-violet-300 dark:border-purple-500/30 rounded-2xl space-y-2">
                  <h4 className="tq-eyebrow">Clinical Interpretation:</h4>
                  <p className="text-slate-700 dark:text-slate-200 text-xs sm:text-sm leading-relaxed italic">
                    "{node.interpretationText}"
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-3">
              {node.learningNotes && node.learningNotes.length > 0 ? (
                node.learningNotes.map((note, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-start gap-3 min-w-0">
                    <CheckCircle2 size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                    <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">{note}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No extra learning notes recorded for this node.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="tq-btn-secondary touch-target px-5 py-2 text-xs font-bold transition-all dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300"
          >
            Close Inspector
          </button>

          {onJumpToSimulation && (
            <button
              onClick={() => {
                onClose();
                onJumpToSimulation(node.id);
              }}
              className="tq-btn-primary touch-target px-5 py-2 text-xs font-bold transition-all"
            >
              Simulate from this Node →
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
