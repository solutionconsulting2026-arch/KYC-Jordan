import React from 'react';

export type ButtonVariant = 'primary' | 'proceed' | 'outline' | 'dark' | 'worknext' | 'danger' | 'ghost';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'outline',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      'bg-[#C6E025] hover:bg-[#B5DC18] text-[#141B08] font-bold border border-transparent shadow-xs',
    proceed:
      'bg-[#C6E025] hover:bg-[#B5DC18] text-[#141B08] font-bold border border-transparent shadow-xs',
    outline:
      'bg-white hover:bg-slate-50 text-slate-800 font-semibold border border-slate-300 hover:border-slate-400',
    dark:
      'bg-[#0D0E12] hover:bg-[#1A1D24] text-white font-semibold border border-transparent',
    worknext:
      'bg-gradient-to-r from-[#FF7A45] via-[#EE2B76] to-[#7B3FE4] hover:opacity-95 text-white font-medium shadow-xs',
    danger:
      'bg-rose-50 hover:bg-rose-100 text-rose-700 font-medium border border-rose-300',
    ghost:
      'bg-transparent hover:bg-slate-100 text-slate-700 font-medium border border-transparent',
  };

  const sizeStyles = {
    sm: 'h-7 px-2.5 text-xs rounded-md gap-1.5',
    md: 'h-[34px] px-3.5 text-xs rounded-md gap-2',
    lg: 'h-10 px-5 text-sm rounded-lg gap-2.5',
  };

  const disabledStyles = disabled
    ? 'opacity-45 cursor-not-allowed pointer-events-none'
    : 'cursor-pointer active:scale-[0.98] transition-all';

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center select-none font-sans outline-none whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
