import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('MindCare caught runtime error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07111F] text-[#F4F8FC] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#101F31] border border-[#243A50] rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-[#14283D] border border-[#E05252] text-[#E05252] flex items-center justify-center mx-auto text-2xl">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-[#F4F8FC]">
                {this.props.fallbackTitle || 'MindCare Recovered Safely'}
              </h2>
              <p className="text-xs text-[#B7C5D6] leading-relaxed">
                An unexpected display event was intercepted. Your cognitive session data and settings remain safe.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-[#07111F] rounded-xl border border-[#243A50] text-[11px] font-mono text-[#7F91A6] text-left overflow-auto max-h-24">
                {this.state.error.message || 'Unknown error'}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-3 bg-[#19C3B1] hover:bg-[#38D9C5] text-[#07111F] font-black text-xs rounded-xl shadow-lg cursor-pointer flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload MindCare Platform</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
