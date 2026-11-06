import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastNotificationProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastNotification({ toasts, onDismiss }: ToastNotificationProps) {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100%-2.5rem)] px-4 sm:px-0 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className={`tq-fade-in pointer-events-auto p-4 rounded-[20px] border shadow-2xl backdrop-blur-xl flex items-start gap-3 text-white ${
              toast.type === 'success'
                ? 'bg-[#111c30]/95 border-brand-emerald/50 border-l-4 border-l-brand-emerald shadow-emerald-950/40'
                : toast.type === 'error'
                ? 'bg-[#111c30]/95 border-brand-coral/50 border-l-4 border-l-brand-coral shadow-rose-950/40'
                : 'bg-[#111c30]/95 border-brand-amber/50 border-l-4 border-l-brand-amber shadow-amber-950/40'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="text-brand-emerald" size={20} />}
              {toast.type === 'error' && <AlertCircle className="text-brand-coral" size={20} />}
              {toast.type === 'info' && <Info className="text-brand-amber" size={20} />}
            </div>

            <div className="flex-1 text-xs">
              <h4 className="font-bold text-white leading-tight">{toast.title}</h4>
              {toast.description && (
                <p className="text-slate-300 mt-0.5 font-mono text-[11px] leading-relaxed">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              onClick={() => onDismiss(toast.id)}
              className="touch-target text-slate-400 hover:text-white p-1 rounded-xl hover:bg-white/10 transition-all shrink-0 flex items-center justify-center min-h-11 min-w-11"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
