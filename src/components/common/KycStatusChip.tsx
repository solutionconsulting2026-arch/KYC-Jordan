import React from 'react';

export type ChipVariant = 'ok' | 'warn' | 'bad' | 'neutral';

interface KycStatusChipProps {
  label: string;
  variant?: ChipVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  title?: string;
}

export const KycStatusChip: React.FC<KycStatusChipProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  icon,
  onClick,
  className = '',
  title,
}) => {
  const variantStyles: Record<ChipVariant, string> = {
    ok: 'bg-[#DCF2E3] text-[#1E6B3A] border-emerald-200',
    warn: 'bg-[#FEF0C7] text-[#93370D] border-amber-200',
    bad: 'bg-[#FEE4E2] text-[#A01C12] border-rose-200',
    neutral: 'bg-[#E6E9EE] text-[#3F4650] border-slate-200',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md font-medium',
    md: 'text-[12px] px-2.5 py-1 rounded-full font-semibold',
  };

  const clickableStyles = onClick
    ? 'cursor-pointer hover:opacity-85 transition-opacity'
    : '';

  return (
    <span
      onClick={onClick}
      title={title}
      className={`inline-flex items-center gap-1.5 border leading-none ${variantStyles[variant]} ${sizeStyles[size]} ${clickableStyles} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </span>
  );
};
