import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, Phone, User, Mail, Eye, EyeOff, Loader2, Coffee, Gift } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
  /** Where to go after a successful sign in / sign up */
  redirectTo?: string;
}

const inputClass =
  'w-full pl-11 pr-4 py-3 rounded-2xl border border-stone-200 bg-white focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 text-sm transition-all';

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  redirectTo,
}) => {
  const navigate = useNavigate();
  const { login, register, isLoading } = useAuth();
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [showPassword, setShowPassword] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const switchMode = (register: boolean) => {
    setIsRegister(register);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    try {
      if (isRegister) {
        if (fullName.trim().length < 2) {
          setErrorMessage('Please enter your name.');
          return;
        }
        if (phone.trim().replace(/\D/g, '').length < 8) {
          setErrorMessage('Please enter a valid phone number (at least 8 digits).');
          return;
        }
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters.');
          return;
        }
        await register(fullName.trim(), phone.trim(), password, email.trim() || undefined);
      } else {
        if (!phone.trim() || !password) {
          setErrorMessage('Enter your phone or email and your password.');
          return;
        }
        await login(phone.trim(), password);
      }
      onClose();
      if (redirectTo) navigate(redirectTo);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        className="w-full sm:max-w-md max-h-[95vh] overflow-y-auto bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative px-6 pt-7 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full text-stone-500 hover:bg-stone-100 flex items-center justify-center cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="w-11 h-11 rounded-full bg-stone-950 text-amber-300 flex items-center justify-center mb-4">
            <Coffee className="w-5 h-5" />
          </span>
          <h2 id="auth-title" className="text-2xl font-serif font-black text-stone-900 tracking-tight">
            {isRegister ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            {isRegister
              ? 'Takes 10 seconds. Your cart is saved.'
              : 'Sign in to order. Your cart is saved.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-3.5" noValidate>
          {errorMessage && (
            <div role="alert" className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
              {errorMessage}
            </div>
          )}

          {isRegister && (
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                autoFocus
                autoComplete="name"
                placeholder="Full name"
                aria-label="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={inputClass}
              />
            </div>
          )}

          <div className="relative">
            <Phone className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              autoFocus={!isRegister}
              autoComplete="username"
              inputMode={isRegister ? 'tel' : 'text'}
              placeholder={isRegister ? 'Phone number' : 'Phone number or email'}
              aria-label={isRegister ? 'Phone number' : 'Phone number or email'}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </div>

          {isRegister && (
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                autoComplete="email"
                placeholder="Email (optional)"
                aria-label="Email (optional)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
          )}

          <div className="relative">
            <Lock className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              placeholder="Password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full bg-stone-950 hover:bg-stone-800 text-white font-black text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Please wait…</span>
              </>
            ) : isRegister ? (
              'Create account'
            ) : (
              'Sign in'
            )}
          </button>

          {isRegister && (
            <p className="flex items-center justify-center gap-1.5 text-xs text-stone-500">
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              Every 10th drink is free
            </p>
          )}

          <p className="pt-1 text-center text-sm text-stone-500">
            {isRegister ? 'Already have an account?' : 'New here?'}{' '}
            <button
              type="button"
              onClick={() => switchMode(!isRegister)}
              className="font-bold text-stone-950 underline underline-offset-4 cursor-pointer"
            >
              {isRegister ? 'Sign in' : 'Create an account'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};
