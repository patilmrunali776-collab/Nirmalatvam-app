import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle2, Sparkles, AlertCircle, X } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  points?: number;
  type?: 'success' | 'info' | 'alert';
}

interface ToastContextType {
  showToast: (message: string, points?: number, type?: 'success' | 'info' | 'alert') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, points?: number, type: 'success' | 'info' | 'alert' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, points, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 bg-slate-900/95 text-white rounded-xl shadow-xl border border-slate-700/60 backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 duration-200"
          >
            <div className="flex items-center gap-3">
              {toast.points ? (
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
              ) : toast.type === 'alert' ? (
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                  <AlertCircle className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}
              <div>
                <p className="text-sm font-medium leading-snug">{toast.message}</p>
                {toast.points && (
                  <p className="text-xs text-emerald-400 font-mono font-medium">+{toast.points} EcoPoints earned</p>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded-md transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
