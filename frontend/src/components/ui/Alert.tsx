import React from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface AlertProps {
  variant?: 'error' | 'success' | 'warning' | 'info';
  title?: string;
  message: string | React.ReactNode;
  actionText?: string;
  onAction?: () => void;
  onClose?: () => void;
  isWireframe?: boolean;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'error',
  title,
  message,
  actionText,
  onAction,
  onClose,
  isWireframe = false,
  className = '',
}) => {
  const icons = {
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />,
  };

  const variantStyles = {
    error: 'bg-rose-50 border-rose-200 text-rose-900',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
  };

  if (isWireframe) {
    return (
      <div className={`p-4 border-2 border-gray-600 bg-gray-100 font-mono text-xs text-gray-900 flex items-start justify-between gap-3 ${className}`}>
        <div>
          <div className="font-bold uppercase tracking-wider mb-1">
            [{variant.toUpperCase()} STATE]: {title || 'SYSTEM NOTIFICATION'}
          </div>
          <div className="text-gray-700">{message}</div>
          {actionText && onAction && (
            <button
              onClick={onAction}
              className="mt-2.5 px-3 py-1 bg-gray-300 hover:bg-gray-400 border border-black uppercase text-[10px] font-bold"
            >
              [ACTION: {actionText}]
            </button>
          )}
        </div>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-black font-bold">
            [X]
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-xl border flex items-start justify-between gap-3 shadow-sm transition-all duration-200 ${variantStyles[variant]} ${className}`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {icons[variant]}
        <div className="space-y-1">
          {title && <h4 className="text-sm font-semibold tracking-tight">{title}</h4>}
          <div className="text-xs leading-relaxed opacity-90">{message}</div>
          {actionText && onAction && (
            <div className="pt-1.5">
              <button
                type="button"
                onClick={onAction}
                className="text-xs font-semibold underline underline-offset-2 hover:opacity-80 transition cursor-pointer"
              >
                {actionText} →
              </button>
            </div>
          )}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
