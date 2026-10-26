import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold tracking-tight rounded-2xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 focus-visible:ring-offset-2';

  const variants = {
    primary:
      'bg-amber-900 hover:bg-amber-950 text-white shadow-md shadow-amber-950/20 hover:shadow-lg hover:shadow-amber-950/25 border border-amber-800/50',
    secondary:
      'bg-stone-100 hover:bg-stone-200/90 text-stone-800 border border-stone-200/90 hover:border-stone-300 shadow-2xs',
    outline:
      'border-2 border-amber-900 text-amber-900 hover:bg-amber-50/80 active:bg-amber-100',
    ghost:
      'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80',
    danger:
      'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-4 sm:px-5 py-2.5 gap-2',
    lg: 'text-sm sm:text-base px-5 sm:px-6 py-3 sm:py-3.5 gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
};
