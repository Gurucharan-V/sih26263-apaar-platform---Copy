import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  isWireframe?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  isWireframe = false,
  className = '',
  ...props
}) => {
  if (isWireframe) {
    return (
      <div
        className={`bg-white border-2 border-gray-400 p-6 rounded-none relative shadow-none ${className}`}
        {...props}
      >
        <div className="absolute top-0 right-0 bg-gray-200 px-2 py-0.5 font-mono text-[10px] text-gray-700 border-l-2 border-b-2 border-gray-400 uppercase">
          Frame / Card
        </div>
        {children}
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
