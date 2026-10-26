import React from 'react';
import { AlertCircle, RefreshCw, Coffee } from 'lucide-react';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Unable to Load Menu',
  message,
  onRetry,
}) => {
  return (
    <div className="rounded-3xl border border-amber-200/90 bg-white p-6 sm:p-8 text-center max-w-md mx-auto space-y-5 my-8 shadow-sm">
      <div className="relative w-14 h-14 rounded-3xl bg-amber-50 text-amber-900 border border-amber-200/70 flex items-center justify-center mx-auto shadow-2xs">
        <Coffee className="w-7 h-7 text-amber-800" />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center border-2 border-white shadow-2xs">
          <AlertCircle className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="space-y-1.5">
        <h3 className="font-extrabold text-stone-900 text-base">{title}</h3>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{message}</p>
      </div>

      {onRetry && (
        <div className="pt-1">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRetry}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
