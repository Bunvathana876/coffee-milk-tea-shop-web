import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 text-center space-y-5 max-w-md mx-auto">
      <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-900 border border-amber-200/60 flex items-center justify-center mx-auto shadow-xs">
        <Coffee className="w-10 h-10 text-amber-800" />
      </div>
      <div className="space-y-1.5">
        <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100/80 px-3 py-1 rounded-full">
          Error 404
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight pt-2">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-xs mx-auto leading-relaxed">
          The drink or page you are looking for does not exist or has been moved.
        </p>
      </div>
      <div className="pt-2">
        <Link to="/">
          <Button variant="primary" icon={<ArrowLeft className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};
