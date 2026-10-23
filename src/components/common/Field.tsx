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
  labelWidth = 'w-[185px]',
  children,
  className = '',
}) => {
  if (layout === 'vertical') {
    return (
      <div className={`bn-field flex flex-col gap-1.5 ${className}`}>
        <label className="text-[14px] text-[#555555] flex items-start gap-0.5">
          {label}
          {mandatory && <span className="text-[#E5262B] leading-none">*</span>}
        </label>
        {children}
        {helpText && <span className="text-[11px] text-[#5B616B]">{helpText}</span>}
        {error && <span className="text-[11px] text-rose-600">{error}</span>}
      </div>
    );
  }

  return (
    <div className={`bn-field flex items-start min-h-[38px] ${className}`}>
      <label
        className={`shrink-0 ${labelWidth} min-h-[38px] text-right text-[15px] text-[#555555] leading-[19px] flex items-center justify-end select-none`}
      >
        {label}
      </label>
      <span className="w-[15px] shrink-0 text-center text-[#E5262B] text-[15px] leading-none -mt-[4px] select-none">
        {mandatory ? '*' : ''}
      </span>
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        {children}
        {helpText && <span className="text-[12px] text-[#6B6B6B]">{helpText}</span>}
        {error && <span className="text-[12px] text-[#E5262B]">{error}</span>}
      </div>
    </div>
  );
};
