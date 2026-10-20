import React from 'react';

export type ButtonVariant = 'primary' | 'outline' | 'dark' | 'worknext' | 'danger' | 'ghost';

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
      'bg-[#F5C518] hover:bg-[#E5B508] text-[#1F2329] font-semibold border border-transparent shadow-xs',
    outline:
      'bg-white hover:bg-[#F4F6F8] text-[#1F2329] font-medium border border-[#CFD3D8] hover:border-[#B5BAC0]',
    dark:
      'bg-[#1F2329] hover:bg-[#2B2E35] text-white font-medium border border-transparent',
    worknext:
      'bg-gradient-to-r from-[#FF7A45] via-[#EE2B76] to-[#7B3FE4] hover:opacity-95 text-white font-medium shadow-xs',
    danger:
      'bg-[#FEE4E2] hover:bg-[#FECDCA] text-[#A01C12] font-medium border border-[#FDA29B]',
    ghost:
      'bg-transparent hover:bg-slate-100 text-[#1F2329] font-medium border border-transparent',
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
