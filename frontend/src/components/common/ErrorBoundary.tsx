import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4 sm:p-6 bg-alabaster dark:bg-ink-950 text-ink-900 dark:text-slate-100 font-sans max-w-full overflow-hidden">
          <div className="tq-card tq-fade-up max-w-md w-full bg-white dark:bg-[#111c30] border border-rose-200 dark:border-rose-500/30 rounded-[20px] p-6 sm:p-8 shadow-xl text-center space-y-4 min-w-0">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-coral-soft dark:bg-brand-coral/20 border border-rose-200 dark:border-brand-coral/40 flex items-center justify-center text-brand-coral">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="tq-display text-lg font-black text-ink-900 dark:text-white">
                {this.props.fallbackTitle || 'Unable to Load Component'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {this.state.error?.message || 'An unexpected rendering error occurred.'}
              </p>
            </div>
            <button
              onClick={this.handleReload}
              className="tq-btn-primary touch-target px-5 py-2.5 rounded-[14px] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 mx-auto shadow-md transition-all active:scale-95 min-h-11"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restart Game</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
