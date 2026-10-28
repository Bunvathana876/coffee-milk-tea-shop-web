import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../features/cart/useCart';
import { formatUsd } from '../../config/currency';

export const FloatingCartBar: React.FC = () => {
  const location = useLocation();
  const { totalQuantity, totalPriceUsd } = useCart();

  const isHiddenPage =
    location.pathname === '/cart' ||
    location.pathname === '/checkout' ||
    location.pathname.startsWith('/receipt');

  if (totalQuantity === 0 || isHiddenPage) return null;

  return (
    <aside
      aria-label="Order summary"
      className="fixed bottom-20 sm:bottom-22 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-30 sm:w-96 animate-in slide-in-from-bottom-3 duration-200"
    >
      <Link
        to="/cart"
        className="flex items-center justify-between gap-3 bg-espresso-dark text-cream rounded-full pl-5 pr-2 py-2 shadow-2xl border border-espresso/40 ring-1 ring-white/10 hover:bg-espresso active:scale-[0.98] transition-all"
      >
        <span className="flex items-center gap-2.5 text-sm font-bold">
          <ShoppingBag className="w-4 h-4 text-caramel" />
          <span>{totalQuantity} {totalQuantity === 1 ? 'drink' : 'drinks'}</span>
          <span className="text-cream/40">·</span>
          <span className="text-caramel-soft font-black">{formatUsd(totalPriceUsd)}</span>
        </span>
        <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-caramel text-espresso-dark text-xs sm:text-sm font-black shadow-xs hover:bg-caramel-soft transition-colors">
          <span>View cart</span>
          <ArrowRight className="w-4 h-4" />
        </span>
      </Link>
    </aside>
  );
};
