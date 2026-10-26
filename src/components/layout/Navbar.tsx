import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Coffee, ShoppingBag, Menu as MenuIcon, X, Sparkles, User } from 'lucide-react';
import { useCart } from '../../features/cart/useCart';
import { useAuth } from '../../features/auth/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { ProfileModal } from '../auth/ProfileModal';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const { totalQuantity } = useCart();
  const { user, isAuthenticated, authModalOpen, openAuthModal, closeAuthModal } = useAuth();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Drink Menu', path: '/menu' },
    { label: 'Track Order', path: '/orders' },
    { label: 'Shopping Cart', path: '/cart' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-stone-50/85 backdrop-blur-md border-b border-stone-200/70 transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          {/* Brand Logo & Tagline */}
          <Link to="/" className="flex items-center gap-3 group select-none">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 flex items-center justify-center text-amber-100 shadow-md shadow-amber-950/20 group-hover:scale-105 transition-transform">
              <Coffee className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="font-black text-base sm:text-lg text-stone-900 tracking-tight block leading-tight group-hover:text-amber-950 transition-colors">
                Brew & Boba
              </span>
              <span className="text-[11px] font-semibold text-amber-800 tracking-wide flex items-center gap-1 leading-tight">
                Artisan Café <Sparkles className="w-2.5 h-2.5 text-amber-600 fill-amber-500" />
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Segmented Pill */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-200/60 p-1.5 rounded-2xl border border-stone-300/40">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    active
                      ? 'bg-white text-amber-950 shadow-xs'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-white/40'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action: Auth Button, Cart Pill & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Customer Authentication Button */}
            {isAuthenticated && user ? (
              <button
                type="button"
                onClick={() => setProfileModalOpen(true)}
                className="flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-2xl bg-amber-100/80 hover:bg-amber-100 text-amber-950 border border-amber-300/70 text-xs font-bold transition-all cursor-pointer"
                aria-label="View Profile and Loyalty Stamps"
              >
                <div className="w-6 h-6 rounded-full bg-amber-900 text-white text-[11px] flex items-center justify-center font-black">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-black max-w-[100px] truncate">
                  {user.full_name.split(' ')[0]}
                </span>
                <span className="text-[10px] bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded-full font-black">
                  {user.loyalty_stamps} ⭐️
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 text-xs font-extrabold transition-all cursor-pointer"
              >
                <User className="w-4 h-4 text-amber-900" />
                <span>Sign In</span>
              </button>
            )}

            {/* Shopping Cart Pill */}
            <Link
              to="/cart"
              aria-label={`Cart with ${totalQuantity} items`}
              className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl border transition-all text-xs font-extrabold cursor-pointer active:scale-95 ${
                totalQuantity > 0
                  ? 'bg-amber-900 text-white border-amber-950 shadow-sm shadow-amber-950/20 hover:bg-amber-950'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border-stone-200'
              }`}
            >
              <ShoppingBag className={`w-4 h-4 ${totalQuantity > 0 ? 'text-amber-300' : 'text-stone-500'}`} />
              <span className="hidden sm:inline">Cart</span>
              <span
                className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-black transition-transform ${
                  totalQuantity > 0
                    ? 'bg-amber-400 text-amber-950 scale-100 shadow-2xs'
                    : 'bg-stone-200 text-stone-600'
                }`}
              >
                {totalQuantity}
              </span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-2xl text-stone-600 hover:text-stone-950 hover:bg-stone-200/60 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-stone-200 bg-white/98 backdrop-blur-lg px-4 py-3 space-y-1.5 shadow-xl animate-in slide-in-from-top-2 duration-150">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                    active
                      ? 'bg-amber-100 text-amber-950'
                      : 'text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.path === '/cart' && totalQuantity > 0 && (
                    <span className="w-6 h-6 rounded-full bg-amber-900 text-white text-xs flex items-center justify-center font-bold">
                      {totalQuantity}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={closeAuthModal}
      />

      {/* Profile & Loyalty Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onOpenOrders={() => navigate('/orders')}
      />
    </>
  );
};
