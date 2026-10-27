import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Coffee, ShoppingBag, Menu as MenuIcon, X, User } from 'lucide-react';
import { useCart } from '../../features/cart/useCart';
import { useAuth } from '../../features/auth/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { ProfileModal } from '../auth/ProfileModal';

const NAV_LINKS = [
  { label: 'Menu', path: '/menu' },
  { label: 'Orders', path: '/orders' },
];

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const { totalQuantity } = useCart();
  const { user, isAuthenticated, authModalOpen, authModalOptions, openAuthModal, openAuthModalWith, closeAuthModal } = useAuth();

  const desktopLink = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-full text-sm font-bold transition-colors ${
      isActive ? 'bg-stone-950 text-white' : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
    }`;

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#fbf9f5]/85 backdrop-blur-xl border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 select-none" onClick={() => setMobileMenuOpen(false)}>
            <span className="w-9 h-9 rounded-full bg-stone-950 text-amber-300 flex items-center justify-center">
              <Coffee className="w-4.5 h-4.5" />
            </span>
            <span className="font-serif font-black text-lg sm:text-xl text-stone-900 tracking-tight">
              Brew &amp; Boba
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Main">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.path} to={link.path} className={desktopLink}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white border border-stone-200 hover:border-stone-400 text-sm font-bold text-stone-900 transition-colors cursor-pointer"
                aria-label="Open profile"
              >
                <span className="w-7 h-7 rounded-full bg-stone-950 text-white text-xs flex items-center justify-center font-black">
                  {user.full_name.charAt(0).toUpperCase()}
                </span>
                <span className="hidden sm:inline max-w-[90px] truncate">{user.full_name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Sign in</span>
              </button>
            )}
            {!isAuthenticated && (
              <button
                type="button"
                onClick={() => openAuthModalWith({ mode: 'register' })}
                className="hidden sm:inline-flex px-4 py-2 rounded-full bg-stone-950 text-white text-sm font-bold hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Sign up
              </button>
            )}

            <Link
              to="/cart"
              aria-label={`Cart with ${totalQuantity} items`}
              className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 ${
                totalQuantity > 0 ? 'bg-amber-400 text-stone-950' : 'bg-white border border-stone-200 text-stone-700 hover:border-stone-400'
              }`}
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-stone-950 text-white text-[11px] flex items-center justify-center font-black">
                  {totalQuantity}
                </span>
              )}
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 rounded-full flex items-center justify-center text-stone-700 hover:bg-stone-100 cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-stone-200 bg-[#fbf9f5] px-4 py-3 space-y-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-2xl text-base font-bold ${
                    isActive ? 'bg-stone-950 text-white' : 'text-stone-700 hover:bg-stone-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <AuthModal
        key={`${authModalOpen}-${authModalOptions.mode ?? 'login'}`}
        isOpen={authModalOpen}
        onClose={closeAuthModal}
        initialMode={authModalOptions.mode}
        redirectTo={authModalOptions.redirectTo}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onOpenOrders={() => navigate('/orders')}
      />
    </>
  );
};
