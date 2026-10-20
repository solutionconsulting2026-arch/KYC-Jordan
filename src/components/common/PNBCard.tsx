import React from 'react';

interface PNBCardProps {
  children: React.ReactNode;
  className?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  headerAction?: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'brand';
}

export const PNBCard: React.FC<PNBCardProps> = ({
  children,
  className = '',
  headerTitle,
  headerSubtitle,
  headerAction,
  variant = 'default',
}) => {
  const variantClasses = {
    default: 'bg-white border border-slate-200/80 shadow-sm rounded-xl',
    elevated: 'bg-white border border-slate-200/60 shadow-md rounded-xl',
    bordered: 'bg-white border-2 border-slate-200 rounded-xl',
    brand: 'bg-gradient-to-b from-white to-[#FDF8F8] border border-[#A21D22]/20 shadow-sm rounded-xl',
  };

  return (
    <div className={`${variantClasses[variant]} ${className} overflow-hidden`}>
      {(headerTitle || headerAction) && (
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            {headerTitle && (
              <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
                {headerTitle}
              </h3>
            )}
            {headerSubtitle && (
              <p className="text-xs text-slate-500 mt-0.5">{headerSubtitle}</p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
};
