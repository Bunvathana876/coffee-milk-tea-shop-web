import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Coffee,
  ShoppingBag,
  User,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../../features/cart/useCart';
import { useAuth } from '../../features/auth/AuthContext';
import { AuthModal } from '../auth/AuthModal';
import { ProfileModal } from '../auth/ProfileModal';
import { StoreSelectorModal } from './StoreSelectorModal';
import { STORES, type StoreLocation } from '../../config/stores';
import { SearchModal } from './SearchModal';
import { MiniCartDrawer } from './MiniCartDrawer';
import { CustomizationModal } from '../product/CustomizationModal';
import { BottomNavBar } from '../ui/bottom-nav-bar';
import type { Product, DrinkCustomization } from '../../types';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [storeModalOpen, setStoreModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);

  // Drink customization modal for quick search selection
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);

  // Selected pickup store (defaults to BKK1 Flagship)
  const [selectedStore, setSelectedStore] = useState<StoreLocation>(() => {
    try {
      const savedId = localStorage.getItem('brew_boba_selected_store_id');
      const found = STORES.find((s) => s.id === savedId);
      return found || STORES[0];
    } catch {
      return STORES[0];
    }
  });

  const { totalQuantity, addItem } = useCart();
  const {
    user,
    isAuthenticated,
    authModalOpen,
    authModalOptions,
    openAuthModal,
    closeAuthModal,
  } = useAuth();

  // Smooth scroll to in-page anchors if URL has hash (e.g. #story, #visit, #rewards)
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 80);
      }
    }
  }, [location.hash, location.pathname]);

  // Handle global keyboard shortcut ⌘K or Ctrl+K to open search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSelectStore = (store: StoreLocation) => {
    setSelectedStore(store);
    try {
      localStorage.setItem('brew_boba_selected_store_id', store.id);
    } catch {
      // ignore
    }
  };

  const handleAddToCart = (product: Product, customization: DrinkCustomization) => {
    addItem({
      productId: product.id,
      productName: product.name,
      image: product.image,
      size: customization.size,
      sugarLevel: customization.sugar_level,
      iceLevel: customization.ice_level,
      toppings: customization.toppings || [],
      unitPriceUsd: customization.unit_price_usd,
      quantity: customization.quantity,
    });
    setCustomizingProduct(null);
    setMiniCartOpen(true);
  };

  const stamps = (user?.loyalty_stamps || 0) % 10;

  return (
    <>
      {/* 1. Clean Top Brand Header */}
      <header className="sticky top-0 z-40 bg-cream/95 backdrop-blur-md border-b border-line shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
          {/* Brandmark Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 select-none group shrink-0"
            aria-label="Brew & Boba Home"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-espresso text-caramel flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform border border-espresso/20 shrink-0">
              <Coffee className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-black text-lg sm:text-xl text-ink tracking-tight leading-none">
                Brew &amp; Boba
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-caramel mt-0.5">
                Café &amp; Tea Lab
              </span>
            </div>
          </Link>

          {/* Right Controls: Account, Cart & Order Ahead CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* User Account / Profile */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-1.5">
                {/* Rewards Stamp Pill */}
                <Link
                  to="/rewards"
                  className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cream-deep border border-line text-xs font-bold text-ink hover:border-caramel/40 transition-colors"
                  title="View rewards & stamps"
                >
                  <Sparkles className="w-3.5 h-3.5 text-caramel" />
                  <span>{stamps}/10 Stamps</span>
                </Link>

                {/* Profile Avatar Pill */}
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 pl-1.5 pr-2.5 sm:pr-3 py-1.5 rounded-full bg-white border border-line hover:border-caramel/40 text-xs font-bold text-ink transition-all shadow-2xs"
                  aria-label="Open profile settings"
                >
                  <span className="w-6 h-6 rounded-full bg-espresso text-caramel text-xs flex items-center justify-center font-black">
                    {user.full_name.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden sm:inline max-w-[80px] truncate">
                    {user.full_name.split(' ')[0]}
                  </span>
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs sm:text-sm font-bold text-ink-soft hover:text-ink hover:bg-cream-deep transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-caramel" />
                <span>Sign in</span>
              </button>
            )}

            {/* Interactive Cart Button with Badge */}
            <button
              type="button"
              onClick={() => setMiniCartOpen(true)}
              aria-label={`Open shopping cart with ${totalQuantity} items`}
              className={`relative flex items-center gap-2 h-9 sm:h-10 px-3 sm:px-3.5 rounded-full transition-all active:scale-95 shadow-2xs cursor-pointer ${
                totalQuantity > 0
                  ? 'bg-caramel text-espresso-dark font-black hover:bg-caramel-soft'
                  : 'bg-white border border-line text-ink-soft hover:text-ink hover:border-caramel/40'
              }`}
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-4 h-4 px-1 rounded-full bg-espresso text-cream text-[10px] font-black flex items-center justify-center shadow-xs">
                    {totalQuantity}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold hidden sm:inline">
                {totalQuantity > 0 ? `${totalQuantity} item${totalQuantity > 1 ? 's' : ''}` : 'Cart'}
              </span>
            </button>

            {/* Primary Order Ahead CTA Button */}
            <Link
              to="/menu"
              className="hidden sm:inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-espresso hover:bg-espresso-dark text-cream text-xs sm:text-sm font-bold shadow-xs hover:shadow-md active:scale-95 transition-all border border-espresso/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso focus-visible:ring-offset-2 shrink-0"
            >
              <Coffee className="w-3.5 h-3.5 text-caramel-soft" />
              <span>Order Ahead</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Floating GooeyNav Bottom Navigation Bar (Active on All Screens) */}
      <BottomNavBar
        stickyBottom
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* 4. Modals & Drawers */}
      <StoreSelectorModal
        isOpen={storeModalOpen}
        onClose={() => setStoreModalOpen(false)}
        selectedStoreId={selectedStore.id}
        onSelectStore={handleSelectStore}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectProduct={(product) => setCustomizingProduct(product)}
      />

      <MiniCartDrawer
        isOpen={miniCartOpen}
        onClose={() => setMiniCartOpen(false)}
      />

      <CustomizationModal
        product={customizingProduct}
        isOpen={!!customizingProduct}
        onClose={() => setCustomizingProduct(null)}
        onAddToCart={handleAddToCart}
      />

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
        onOpenRewards={() => navigate('/rewards')}
      />
    </>
  );
};
