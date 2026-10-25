import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'wireframe';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] cursor-pointer';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-[#163A70] hover:bg-[#0F2850] text-white shadow-md hover:shadow-lg focus:ring-[#163A70]',
    secondary: 'bg-[#F0F4FA] hover:bg-[#E1E9F5] text-[#163A70] border border-[#C2D3EB] focus:ring-[#163A70]',
    outline: 'bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 focus:ring-slate-400 shadow-xs',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900 focus:ring-slate-300',
    wireframe: 'bg-gray-200 hover:bg-gray-300 text-gray-900 border-2 border-gray-500 rounded-none font-mono text-xs uppercase',
  };

  // Explicit inline styling guarantees dark background & white text regardless of CSS processing
  const computedStyle: React.CSSProperties = {
    ...(variant === 'primary'
      ? { backgroundColor: '#163A70', color: '#FFFFFF', borderColor: '#163A70' }
      : {}),
    ...style,
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      style={computedStyle}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4 text-white shrink-0" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : (
        leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>
      )}
      <span className={variant === 'primary' ? 'text-white font-bold tracking-wide' : ''}>
        {children}
      </span>
      {!isLoading && rightIcon && (
        <span className="shrink-0 flex items-center">{rightIcon}</span>
      )}
    </button>
  );
};
