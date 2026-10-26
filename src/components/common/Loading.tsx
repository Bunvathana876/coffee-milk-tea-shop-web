import React from 'react';
import { Coffee } from 'lucide-react';

export interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullHeight?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Brewing your drinks...',
  size = 'md',
  fullHeight = false,
}) => {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const containerPadding = fullHeight ? 'min-h-[50vh]' : 'py-12';

  return (
    <div className={`flex flex-col items-center justify-center ${containerPadding} text-center space-y-4`}>
      <div className="relative">
        {/* Glow halo */}
        <div className="absolute inset-0 rounded-3xl bg-amber-400/20 blur-xl animate-pulse" />

        {/* Central emblem */}
        <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-100 to-amber-200/80 text-amber-900 border border-amber-300/60 shadow-sm flex items-center justify-center">
          <Coffee className={`${iconSizes[size]} text-amber-900 animate-bounce duration-1000`} />
        </div>

        {/* Pulsing steam indicator */}
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-600 rounded-full animate-ping opacity-75" />
        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-600 rounded-full border-2 border-white" />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-bold text-stone-800 tracking-tight">{message}</p>
        <p className="text-xs text-stone-400">Freshly preparing beans and tea leaves</p>
      </div>
    </div>
  );
};
