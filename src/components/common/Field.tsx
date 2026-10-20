import React from 'react';

interface FieldProps {
  label: string;
  mandatory?: boolean;
  helpText?: string;
  error?: string;
  layout?: 'horizontal' | 'vertical';
  labelWidth?: string;
  children: React.ReactNode;
  className?: string;
}

export const Field: React.FC<FieldProps> = ({
  label,
  mandatory = false,
  helpText,
  error,
  layout = 'horizontal',
  labelWidth = 'w-[170px]',
  children,
  className = '',
}) => {
  if (layout === 'vertical') {
    return (
      <div className={`flex flex-col gap-1.5 ${className}`}>
        <label className="text-[12px] font-medium text-[#5B616B] flex items-center gap-1">
          {label}
          {mandatory && <span className="text-rose-600 font-bold">*</span>}
        </label>
        {children}
        {helpText && <span className="text-[11px] text-[#5B616B]">{helpText}</span>}
        {error && <span className="text-[11px] text-rose-600">{error}</span>}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 min-h-[36px] ${className}`}>
      <label
        className={`shrink-0 ${labelWidth} text-right text-[13px] text-[#5B616B] leading-tight flex items-center justify-end gap-1 select-none`}
      >
        <span>{label}</span>
        {mandatory && <span className="text-rose-600 font-bold">*</span>}
      </label>
      <div className="flex-1 flex flex-col gap-0.5">
        {children}
        {helpText && <span className="text-[11px] text-[#5B616B]">{helpText}</span>}
        {error && <span className="text-[11px] text-rose-600">{error}</span>}
      </div>
    </div>
  );
};
