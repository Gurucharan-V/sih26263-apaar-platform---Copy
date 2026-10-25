import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isWireframe?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, isWireframe = false, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    if (isWireframe) {
      return (
        <div className="w-full space-y-1">
          {label && (
            <label htmlFor={inputId} className="block text-xs font-mono uppercase text-gray-700 tracking-wider">
              {label} {props.required && <span className="text-red-500">*</span>}
            </label>
          )}
          <div className="relative">
            {leftIcon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{leftIcon}</div>}
            <input
              ref={ref}
              id={inputId}
              className={`w-full ${leftIcon ? 'pl-9' : 'pl-3'} ${rightIcon ? 'pr-9' : 'pr-3'} py-2 bg-gray-50 border-2 border-gray-400 font-mono text-xs text-gray-900 rounded-none focus:border-black focus:outline-none placeholder:text-gray-400 ${error ? 'border-red-500 bg-red-50/20' : ''} ${className}`}
              {...props}
            />
            {rightIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{rightIcon}</div>}
          </div>
          {error && <p className="text-[11px] font-mono text-red-600">{error}</p>}
          {!error && helperText && <p className="text-[11px] font-mono text-gray-500">{helperText}</p>}
        </div>
      );
    }

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-slate-700">
            {label} {props.required && <span className="text-rose-500">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full ${leftIcon ? 'pl-10' : 'pl-3.5'} ${
              rightIcon ? 'pr-10' : 'pr-3.5'
            } py-2.5 bg-white border rounded-xl text-sm text-slate-800 placeholder:text-slate-400 transition shadow-sm focus:outline-none focus:ring-2 focus:ring-navy-600 focus:border-navy-600 ${
              error ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/20' : 'border-slate-300'
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs font-medium text-rose-600 flex items-center gap-1">{error}</p>}
        {!error && helperText && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
