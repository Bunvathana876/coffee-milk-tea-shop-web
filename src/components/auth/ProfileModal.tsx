import React from 'react';
import { X, User, Phone, Mail, LogOut, Award } from 'lucide-react';
import { useAuth } from '../../features/auth/AuthContext';
import { LoyaltyCard } from './LoyaltyCard';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOrders: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onOpenOrders,
}) => {
  const { user, logout } = useAuth();

  if (!isOpen || !user) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-br from-amber-950 via-amber-900 to-stone-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 text-amber-950 flex items-center justify-center font-black text-xl shadow-md">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white tracking-tight">{user.full_name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase tracking-wider">
                  Member
                </span>
              </div>
              <p className="text-xs text-amber-200/80">{user.phone}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Digital Loyalty Punch Card */}
          <LoyaltyCard stamps={user.loyalty_stamps || 0} />

          {/* Account Details */}
          <div className="rounded-2xl border border-stone-200 divide-y divide-stone-100 text-xs">
            <div className="p-3.5 flex items-center justify-between">
              <span className="text-stone-500 font-bold flex items-center gap-2">
                <User className="w-4 h-4 text-amber-800" /> Full Name
              </span>
              <span className="font-extrabold text-stone-900">{user.full_name}</span>
            </div>
            <div className="p-3.5 flex items-center justify-between">
              <span className="text-stone-500 font-bold flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-800" /> Phone Number
              </span>
              <span className="font-extrabold text-stone-900">{user.phone}</span>
            </div>
            {user.email && (
              <div className="p-3.5 flex items-center justify-between">
                <span className="text-stone-500 font-bold flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-800" /> Email
                </span>
                <span className="font-extrabold text-stone-900">{user.email}</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onClose();
                onOpenOrders();
              }}
              className="py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-black text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4 text-amber-800" />
              <span>My Orders & Stamps</span>
            </button>

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="py-3 px-4 rounded-2xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-black text-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
