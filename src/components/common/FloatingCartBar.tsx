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
      className="fixed bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 sm:w-96"
    >
      <Link
        to="/cart"
        className="flex items-center justify-between gap-3 bg-stone-950 text-white rounded-full pl-5 pr-2 py-2 shadow-2xl ring-1 ring-white/10 hover:bg-stone-900 active:scale-[0.98] transition-all"
      >
        <span className="flex items-center gap-2.5 text-sm font-bold">
          <ShoppingBag className="w-4 h-4 text-amber-300" />
          {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
          <span className="text-stone-400">·</span>
          <span className="text-amber-300">{formatUsd(totalPriceUsd)}</span>
        </span>
        <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-amber-400 text-stone-950 text-sm font-black">
          View cart
          <ArrowRight className="w-4 h-4" />
        </span>
      </Link>
    </aside>
  );
};
