import React from 'react';
import { useBotDashboard } from '../context/BotDashboardContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useBotDashboard();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let borderClass = 'border-[#3f4147]';
        let icon = <Info className="w-4 h-4 text-[#5865F2] shrink-0" />;

        if (toast.type === 'success') {
          borderClass = 'border-[#57F287]/40';
          icon = <CheckCircle2 className="w-4 h-4 text-[#57F287] shrink-0" />;
        } else if (toast.type === 'warning') {
          borderClass = 'border-[#FEE75C]/40';
          icon = <AlertTriangle className="w-4 h-4 text-[#FEE75C] shrink-0" />;
        } else if (toast.type === 'error') {
          borderClass = 'border-[#ED4245]/40';
          icon = <AlertCircle className="w-4 h-4 text-[#ED4245] shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#1e1f22] border ${borderClass} shadow-2xl text-xs text-white animate-in slide-in-from-bottom-2 fade-in duration-200`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#949BA4] hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
