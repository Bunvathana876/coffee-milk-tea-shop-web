import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary' | 'outline' | 'ghost' | 'danger';
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
    'inline-flex items-center justify-center font-bold tracking-tight rounded-2xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso focus-visible:ring-offset-2 focus-visible:ring-offset-cream';

  const variants = {
    primary:
      'bg-espresso hover:bg-espresso-dark text-cream shadow-md shadow-espresso/15 hover:shadow-lg hover:shadow-espresso/25 border border-espresso/20',
    accent:
      'bg-caramel hover:bg-caramel-soft text-espresso-dark font-black shadow-md shadow-caramel/20 hover:shadow-lg hover:shadow-caramel/25 border border-caramel/30',
    secondary:
      'bg-cream-deep hover:bg-[#ebdccf] text-ink border border-line shadow-2xs',
    outline:
      'border-2 border-espresso text-espresso hover:bg-cream-deep active:bg-[#ebdccf]',
    ghost:
      'bg-transparent hover:bg-cream-deep text-ink hover:text-espresso border border-transparent',
    danger:
      'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-2 min-h-[40px] gap-1.5',
    md: 'text-xs sm:text-sm px-4 sm:px-5 py-2.5 min-h-[44px] gap-2',
    lg: 'text-sm sm:text-base px-5 sm:px-6 py-3 sm:py-3.5 min-h-[48px] gap-2.5',
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
      {children ? <span>{children}</span> : null}
    </button>
  );
};
