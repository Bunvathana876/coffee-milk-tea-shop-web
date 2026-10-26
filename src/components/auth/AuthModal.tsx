import React, { useState } from 'react';
import { X, Lock, Phone, User, Mail, Eye, EyeOff, Loader2, Sparkles, Coffee } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
}) => {
  const { login, register, isLoading } = useAuth();
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      if (isRegister) {
        if (!fullName.trim() || fullName.trim().length < 2) {
          setErrorMessage('Please enter your full name (at least 2 letters).');
          return;
        }
        if (!phone.trim() || phone.trim().replace(/\D/g, '').length < 8) {
          setErrorMessage('Please enter a valid phone number (at least 8 digits).');
          return;
        }
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters.');
          return;
        }
        await register(fullName.trim(), phone.trim(), password, email.trim() || undefined);
      } else {
        if (!phone.trim()) {
          setErrorMessage('Please enter your phone number or email.');
          return;
        }
        if (!password) {
          setErrorMessage('Please enter your password.');
          return;
        }
        await login(phone.trim(), password);
      }
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage('Authentication failed. Please verify credentials.');
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-amber-950 via-amber-900 to-stone-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-bold">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white tracking-tight flex items-center gap-1.5">
                {isRegister ? 'Join Café Rewards' : 'Welcome Back'}
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
              </h3>
              <p className="text-xs text-amber-200/80">
                {isRegister ? 'Earn stamps on every handcrafted beverage' : 'Sign in to access your punch card & orders'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-4 bg-stone-100/70 border-b border-stone-200/60">
          <div className="grid grid-cols-2 gap-1 bg-stone-200/80 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                !isRegister
                  ? 'bg-white text-amber-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setErrorMessage(null);
              }}
              className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                isRegister
                  ? 'bg-white text-amber-950 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold leading-relaxed">
              {errorMessage}
            </div>
          )}

          {isRegister && (
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Sokha Chan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-800 text-sm font-semibold"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
              {isRegister ? 'Phone Number' : 'Phone Number or Email'}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder={isRegister ? 'e.g. 012 345 678' : '012 345 678 or you@domain.com'}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-800 text-sm font-semibold"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-stone-400 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="e.g. sokha@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-800 text-sm font-semibold"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-800 text-sm font-semibold"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-amber-900 hover:bg-amber-950 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : isRegister ? (
              'Create My Account'
            ) : (
              'Sign In to Café'
            )}
          </button>

          {/* Quick Switcher for Users Without/With Account */}
          <div className="pt-2 text-center text-xs text-stone-500">
            {!isRegister ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setErrorMessage(null);
                  }}
                  className="font-bold text-amber-900 hover:underline cursor-pointer"
                >
                  Register here (10s)
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setErrorMessage(null);
                  }}
                  className="font-bold text-amber-900 hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

