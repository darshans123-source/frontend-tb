import { useState, FormEvent } from 'react';
import { Sparkles, Send, Bot, User, X, Volume2, Lightbulb } from 'lucide-react';
import { soundService } from '../services/soundService';
import { aiService } from '../services/aiService';

interface AITutorProps {
  onClose: () => void;
}

export default function AITutor({ onClose }: AITutorProps) {
  const [messages, setMessages] = useState<{ sender: 'ai' | 'user'; text: string; source?: string }[]>([
    {
      sender: 'ai',
      text: "Hello Dr. Student! I am your AI clinical mentor at Skill Development Center, NIT Raichur. Ask me anything about TB diagnostic algorithms, CBNAAT interpretation, pediatric scoring, HIV-TB co-infection, or MDR management."
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "Explain the CBNAAT Rifampicin Indeterminate repeat rule",
    "How is Pediatric TB Score calculated?",
    "When should ART be started in HIV-TB co-infection?",
    "What are the high-risk PMDT criteria for MDR-TB?"
  ];

  const handleSendPrompt = async (text: string) => {
    if (!text.trim()) return;

    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');
    setLoading(true);

    try {
      const data = await aiService.askChat(text);
      setMessages(prev => [...prev, { sender: 'ai', text: data.reply, source: data.source }]);
      soundService.speak(data.reply);
    } catch (err) {
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: "Based on national NTEP guidelines, presumptive pulmonary TB requires rapid molecular testing (CBNAAT) and sputum smear microscopy. If smear is negative but clinical suspicion remains high, CBNAAT is mandatory.",
        source: 'NTEP Guideline Standard'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendPrompt(input);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="tq-card w-full max-w-3xl h-[88vh] sm:h-[650px] max-h-[700px] rounded-2xl sm:rounded-3xl flex flex-col shadow-[0_0_50px_rgba(6,182,212,0.2)] overflow-hidden tq-fade-up">
        {/* Header */}
        <div className="p-3 sm:p-5 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-teal-50 dark:bg-cyan-950 border border-teal-200 dark:border-cyan-500/30 rounded-xl sm:rounded-2xl text-brand-teal-deep dark:text-cyan-400 shrink-0">
              <Bot size={22} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="tq-display text-sm sm:text-lg font-extrabold text-ink-900 dark:text-white flex items-center gap-1.5 min-w-0">
                TB Quest AI Clinical Tutor <Sparkles size={16} className="text-amber-400" />
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono">
                Clinical Reasoning Engine • Skill Development Center, NIT Raichur
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundService.playClick();
              onClose();
            }}
            className="touch-target p-1.5 sm:p-2 text-slate-500 dark:text-slate-400 hover:text-ink-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-3 sm:px-5 py-2 bg-teal-50/50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2 overflow-x-auto overflow-auto custom-scrollbar text-xs font-mono">
          <Lightbulb size={14} className="text-amber-400 shrink-0" />
          <span className="text-slate-500 dark:text-slate-400 shrink-0 text-[11px]">High-Yield:</span>
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSendPrompt(q)}
              className="tq-chip tq-chip-teal touch-target px-2.5 py-1 text-[10px] sm:text-[11px] shrink-0 transition-all"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 sm:gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'ai' && (
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-teal-50 dark:bg-cyan-950 border border-teal-200 dark:border-cyan-500/40 flex items-center justify-center text-brand-teal-deep dark:text-cyan-400 shrink-0">
                  <Bot size={16} />
                </div>
              )}
              <div className={`max-w-[88%] sm:max-w-[82%] p-3 sm:p-4 rounded-2xl text-xs leading-relaxed space-y-2 ${
                m.sender === 'user'
                  ? 'bg-gradient-to-r from-brand-teal via-brand-emerald to-brand-royal text-white rounded-tr-none shadow-md font-medium'
                  : 'tq-glass bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-ink-900 dark:text-slate-200 rounded-tl-none shadow-sm'
              }`}>
                <p>{m.text}</p>
                {m.sender === 'ai' && (
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700/50 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    <span>Source: {m.source || 'NTEP Guidelines'}</span>
                    <button
                      onClick={() => soundService.speak(m.text)}
                      className="touch-target hover:text-brand-teal dark:hover:text-cyan-300 flex items-center gap-1"
                      title="Read aloud"
                    >
                      <Volume2 size={12} /> Read Aloud
                    </button>
                  </div>
                )}
              </div>
              {m.sender === 'user' && (
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 items-center text-slate-500 dark:text-slate-400 text-xs italic font-mono">
              <Bot size={16} className="animate-spin text-cyan-400" />
              <span>AI Tutor is analyzing clinical knowledge base...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex gap-2 sm:gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI tutor about TB algorithms, CBNAAT, pediatric scores..."
            className="tq-input flex-1 px-3 sm:px-4 py-2.5 sm:py-3 placeholder-slate-500 text-xs font-medium min-h-11 min-w-0"
          />
          <button
            type="submit"
            className="tq-btn-primary touch-target px-4 sm:px-6 py-2.5 sm:py-3 font-bold rounded-xl flex items-center gap-1.5 transition-all text-xs shrink-0"
          >
            <Send size={14} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
