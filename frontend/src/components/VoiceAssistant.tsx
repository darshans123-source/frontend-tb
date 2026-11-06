import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Play, Pause, Square, Settings, X, Sparkles, CheckCircle2, VolumeX, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { voiceService, VoiceSettings } from '../services/voiceService';
import { soundService } from '../services/soundService';

interface VoiceAssistantProps {
  onNavigate?: (tab: string) => void;
}

export default function VoiceAssistant({ onNavigate }: VoiceAssistantProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Loaded system voices
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Settings State (Initialized from voiceService stored settings)
  const initialSettings = voiceService.getSettings();
  const [rate, setRate] = useState<number>(initialSettings.rate || 1.0);
  const [volume, setVolume] = useState<number>(initialSettings.volume ?? 1.0);
  const [lang, setLang] = useState<string>(initialSettings.lang || 'en-IN');
  const [genderPref, setGenderPref] = useState<'female' | 'male'>(initialSettings.genderPref || 'female');
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string>(initialSettings.voiceURI || '');

  const recognitionRef = useRef<any>(null);

  // Subscribe to voices loading
  useEffect(() => {
    const updateVoiceList = () => {
      const voices = voiceService.getVoices();
      setAvailableVoices(voices);
    };

    updateVoiceList();
    const unsubscribe = voiceService.subscribeVoicesChanged(updateVoiceList);
    return () => unsubscribe();
  }, []);

  // Initialize SpeechRecognition API
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = lang;

      rec.onstart = () => {
        setIsListening(true);
        soundService.playClick();
      };

      rec.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
        processVoiceCommand(currentTranscript.toLowerCase());
      };

      rec.onerror = () => {
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    } else {
      setSpeechSupported(false);
    }
  }, [lang]);

  // Keyboard shortcut listener (Alt+V)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'v' || e.key === 'V')) {
        e.preventDefault();
        toggleListening();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isListening]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      showToastNotice('Speech Recognition is not supported in this browser. Touch controls remain active.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript('');
      try {
        recognitionRef.current.start();
      } catch (e) {
        setIsListening(false);
      }
    }
  };

  const processVoiceCommand = (cmd: string) => {
    if (!onNavigate) return;

    if (cmd.includes('module') || cmd.includes('learning')) {
      onNavigate('modules');
      voiceService.speak('Opening Learning Modules');
    } else if (cmd.includes('case') || cmd.includes('quiz') || cmd.includes('start')) {
      onNavigate('cases');
      voiceService.speak('Opening Clinical Cases');
    } else if (cmd.includes('flowchart') || cmd.includes('algorithm')) {
      onNavigate('flowcharts');
      voiceService.speak('Opening Algorithm Flowcharts');
    } else if (cmd.includes('tutor') || cmd.includes('ai')) {
      onNavigate('ai-tutor');
      voiceService.speak('Opening AI Clinical Tutor');
    } else if (cmd.includes('dashboard') || cmd.includes('home')) {
      onNavigate('dashboard');
      voiceService.speak('Opening Dashboard');
    } else if (cmd.includes('certificate')) {
      onNavigate('certificate');
      voiceService.speak('Opening Institutional Certificate');
    } else if (cmd.includes('pause')) {
      voiceService.pause();
      setIsPaused(true);
    } else if (cmd.includes('resume')) {
      voiceService.resume();
      setIsPaused(false);
    } else if (cmd.includes('stop')) {
      voiceService.stop();
      setIsPlaying(false);
    } else if (cmd.includes('read')) {
      handleReadActivePage();
    }
  };

  const handleReadActivePage = () => {
    const mainElement = document.querySelector('main') || document.body;
    const textToRead = mainElement.innerText.slice(0, 500);
    setSpeakingText(textToRead);
    setIsPlaying(true);
    setIsPaused(false);
    voiceService.speak(textToRead, () => {
      setIsPlaying(false);
      setIsPaused(false);
    });
  };

  const handlePauseResume = () => {
    if (isPlaying) {
      if (isPaused) {
        voiceService.resume();
        setIsPaused(false);
      } else {
        voiceService.pause();
        setIsPaused(true);
      }
    }
  };

  const handleStopSpeech = () => {
    voiceService.stop();
    setIsPlaying(false);
    setIsPaused(false);
  };

  const showToastNotice = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTestVoice = () => {
    voiceService.updateSettings({ lang, rate, volume, genderPref, voiceURI: selectedVoiceURI });
    setIsPlaying(true);
    setIsPaused(false);
    voiceService.testVoice(() => {
      setIsPlaying(false);
    }, { lang, rate, volume, genderPref, voiceURI: selectedVoiceURI });
  };

  const handleSaveSettings = () => {
    voiceService.updateSettings({ lang, rate, volume, genderPref, voiceURI: selectedVoiceURI });
    showToastNotice('Voice settings saved successfully.');
    setShowSettings(false);
    soundService.playClick();
  };

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-4 sm:bottom-24 sm:right-6 z-50 bg-emerald-50 dark:bg-emerald-950 border border-emerald-500 text-emerald-800 dark:text-emerald-100 px-3 sm:px-4 py-2.5 sm:py-3 rounded-2xl shadow-xl font-mono text-xs flex items-center gap-2 max-w-[90vw] max-w-full"
          >
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Voice Assistant Controls (Bottom Right) */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex items-center gap-2 sm:gap-3 print:hidden">
        {/* Active Speech Control Mini Toolbar */}
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="tq-glass flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.2)] text-ink-900 dark:text-white text-xs"
          >
            <button onClick={handlePauseResume} className="touch-target p-1.5 sm:p-2 bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-slate-700 rounded-xl text-brand-teal-deep dark:text-cyan-400">
              {isPaused ? <Play size={14} className="sm:w-4 sm:h-4" /> : <Pause size={14} className="sm:w-4 sm:h-4" />}
            </button>
            <button onClick={handleStopSpeech} className="touch-target p-1.5 sm:p-2 bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/80 rounded-xl text-rose-500 dark:text-rose-400">
              <Square size={14} className="sm:w-4 sm:h-4" />
            </button>
            <span className="text-[10px] sm:text-[11px] font-mono text-brand-teal-deep dark:text-cyan-300 pr-1.5 sm:pr-2">
              {isPaused ? 'Paused' : 'Reading...'}
            </span>
          </motion.div>
        )}

        {/* Floating Settings Trigger */}
        <button
          onClick={() => setShowSettings(true)}
          className="tq-glass touch-target p-3 sm:p-3.5 rounded-full text-slate-600 dark:text-slate-300 hover:text-ink-900 dark:hover:text-white shadow-lg transition-all"
          title="Voice & Speech Settings"
        >
          <Settings size={18} className="sm:w-5 sm:h-5" />
        </button>

        {/* Primary Floating Microphone Button */}
        <button
          onClick={toggleListening}
          className={`tq-lift touch-target p-3.5 sm:p-4 min-h-14 min-w-14 sm:min-h-16 sm:min-w-16 rounded-full border font-bold text-white transition-all flex items-center justify-center relative group shadow-[0_0_30px_rgba(255,111,97,0.35)] ${
            isListening
              ? 'bg-gradient-to-r from-rose-500 to-red-600 border-rose-400 animate-pulse ring-4 ring-rose-500/40'
              : 'tq-btn-coral border-brand-coral hover:scale-105'
          }`}
          title="Voice Assistant (Click or press Alt+V)"
        >
          {isListening ? (
            <div className="flex items-center gap-2">
              <MicOff size={20} className="sm:w-5 sm:h-5" />
              <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white animate-ping"></span>
            </div>
          ) : (
            <Mic size={20} className="sm:w-5 sm:h-5" />
          )}
        </button>
      </div>

      {/* Live Transcript Bar Overlay (Top Middle) */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="tq-glass fixed top-16 sm:top-20 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 z-50 p-3 sm:p-4 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)] text-ink-900 dark:text-white text-center max-w-md w-auto sm:w-full backdrop-blur-md"
          >
            <div className="flex items-center justify-center gap-2 text-brand-teal-deep dark:text-cyan-400 font-mono text-[10px] sm:text-xs mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Listening for Voice Commands... (Press Alt+V to stop)</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-ink-900 dark:text-white italic">
              "{transcript || 'Speak command (e.g. "Open Modules", "Start Quiz", "Go Home")...'}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
          <div className="tq-card w-full max-w-md max-h-[90vh] overflow-y-auto overflow-auto custom-scrollbar rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-ink-900 dark:text-white space-y-4 sm:space-y-5 shadow-[0_0_40px_rgba(6,182,212,0.2)] tq-fade-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="tq-display text-base sm:text-lg font-bold flex items-center gap-2 text-ink-900 dark:text-white min-w-0">
                <Volume2 className="text-cyan-400" /> Voice Assistant Settings
              </h3>
              <button onClick={() => setShowSettings(false)} className="touch-target p-1.5 text-slate-500 dark:text-slate-400 hover:text-ink-900 dark:hover:text-white rounded-lg shrink-0">
                <X size={18} />
              </button>
            </div>

            {availableVoices.length === 0 && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-500/40 rounded-xl text-rose-700 dark:text-rose-200 text-xs flex items-center gap-2 font-mono">
                <AlertTriangle size={16} className="text-rose-400 shrink-0" />
                <span>No speech voices are available on this device. Default web synthesis will be used.</span>
              </div>
            )}

            <div className="space-y-3.5 sm:space-y-4">
              {/* Language Selection */}
              <div>
                <label className="text-xs font-mono text-slate-500 dark:text-slate-400 block mb-1.5">Narration Language / Accent:</label>
                <select
                  value={lang}
                  onChange={(e) => {
                    const newLang = e.target.value;
                    setLang(newLang);
                    voiceService.updateSettings({ lang: newLang });
                  }}
                  className="tq-input w-full p-2.5 sm:p-3 text-xs min-h-11"
                >
                  <option value="en-IN">English (India)</option>
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="hi-IN">Hindi (हिंदी)</option>
                  <option value="kn-IN">Kannada (ಕನ್ನಡ)</option>
                  <option value="te-IN">Telugu (ತೆಲುಗು)</option>
                  <option value="ta-IN">Tamil (தமிழ்)</option>
                  <option value="ml-IN">Malayalam (മലയാളം)</option>
                </select>
              </div>

              {/* Installed System Voice Selection */}
              {availableVoices.length > 0 && (
                <div>
                  <label className="text-xs font-mono text-slate-500 dark:text-slate-400 block mb-1.5">Installed Device Voice:</label>
                  <select
                    value={selectedVoiceURI}
                    onChange={(e) => {
                      const uri = e.target.value;
                      setSelectedVoiceURI(uri);
                      voiceService.updateSettings({ voiceURI: uri });
                    }}
                    className="tq-input w-full p-2.5 sm:p-3 text-xs min-h-11 truncate"
                  >
                    <option value="">Auto-Detect Best Voice</option>
                    {availableVoices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Gender Preference */}
              <div>
                <label className="text-xs font-mono text-slate-500 dark:text-slate-400 block mb-1.5">Voice Gender Preference:</label>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <button
                    onClick={() => {
                      setGenderPref('female');
                      voiceService.updateSettings({ genderPref: 'female' });
                    }}
                    className={`touch-target p-2.5 rounded-xl border font-bold transition-all ${
                      genderPref === 'female' ? 'bg-teal-50 dark:bg-cyan-950 border-brand-teal text-brand-teal-deep dark:text-cyan-300' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Female Voice
                  </button>
                  <button
                    onClick={() => {
                      setGenderPref('male');
                      voiceService.updateSettings({ genderPref: 'male' });
                    }}
                    className={`touch-target p-2.5 rounded-xl border font-bold transition-all ${
                      genderPref === 'male' ? 'bg-teal-50 dark:bg-cyan-950 border-brand-teal text-brand-teal-deep dark:text-cyan-300' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Male Voice
                  </button>
                </div>
              </div>

              {/* Speaking Speed (0.5x to 2.0x) */}
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-600 dark:text-slate-300 mb-1">
                  <span>Speaking Speed</span>
                  <span className="text-brand-teal-deep dark:text-cyan-400">{rate}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.25"
                  value={rate}
                  onChange={(e) => {
                    const r = parseFloat(e.target.value);
                    setRate(r);
                    voiceService.updateSettings({ rate: r });
                  }}
                  className="w-full accent-teal-600 bg-slate-200 dark:bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>

              {/* Volume (0% to 100%) */}
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-600 dark:text-slate-300 mb-1">
                  <span>Narration Volume</span>
                  <span className="text-brand-teal-deep dark:text-cyan-400">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => {
                    const v = parseFloat(e.target.value);
                    setVolume(v);
                    voiceService.updateSettings({ volume: v });
                  }}
                  className="w-full accent-teal-600 bg-slate-200 dark:bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Test Voice & Save Settings Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleTestVoice}
                className="tq-btn-secondary touch-target py-2.5 sm:py-3 dark:bg-[#111c30] dark:text-cyan-300 dark:border-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Play size={14} /> Test Voice
              </button>
              <button
                onClick={handleSaveSettings}
                className="tq-btn-primary touch-target py-2.5 sm:py-3 font-bold rounded-xl text-xs shadow-md transition-all"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
