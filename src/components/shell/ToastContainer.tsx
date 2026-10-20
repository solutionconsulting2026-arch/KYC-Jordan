import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useKycStore } from '../../store/KycContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useKycStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
          warn: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
        };

        const borders = {
          success: 'border-emerald-200 bg-white shadow-lg',
          warn: 'border-amber-200 bg-white shadow-lg',
          error: 'border-rose-200 bg-white shadow-lg',
          info: 'border-blue-200 bg-white shadow-lg',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border flex items-start gap-3 transition-all animate-in slide-in-from-top-2 duration-150 ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-[#1F2329] leading-tight">
                {toast.title}
              </p>
              {toast.description && (
                <p className="text-[11px] text-[#5B616B] mt-1 leading-snug">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
