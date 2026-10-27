import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, QrCode, Trash2, ShoppingBag } from 'lucide-react';
import { formatUsd, formatKhr } from '../../config/currency';
import { Button } from '../common/Button';
import { useAuth } from '../../features/auth/AuthContext';

export interface CartSummaryProps {
  totalQuantity: number;
  subtotalUsd: number;
  totalPriceUsd: number;
  totalPriceKhr: number;
  onClearCart: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  totalQuantity,
  subtotalUsd,
  totalPriceUsd,
  onClearCart,
}) => {
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const { isAuthenticated, openAuthModalWith } = useAuth();

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs space-y-5 sticky top-24">
      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
        <h3 className="font-black text-base text-stone-900 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-amber-900" />
          <span>Order Summary</span>
        </h3>
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
          {totalQuantity} {totalQuantity === 1 ? 'drink' : 'drinks'}
        </span>
      </div>

      {/* Breakdown Rows */}
      <div className="space-y-3 text-xs text-stone-600">
        {/* Subtotal in USD & KHR */}
        <div className="flex justify-between items-start">
          <span className="font-semibold text-stone-700">Subtotal</span>
          <div className="text-right">
            <div className="font-black text-stone-900 text-sm leading-tight">
              {formatUsd(subtotalUsd)}
            </div>
            <div className="font-bold text-stone-400 text-xs mt-0.5">
              {formatKhr(subtotalUsd)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-1 border-t border-stone-50">
          <span>Takeaway Cup & Straw</span>
          <span className="font-bold text-emerald-700">Free</span>
        </div>
      </div>

      {/* Final Total Box in USD & KHR */}
      <div className="pt-3 border-t border-stone-200 flex items-baseline justify-between">
        <div>
          <span className="text-xs font-black text-stone-700 uppercase tracking-wider block">
            Total Due
          </span>
          <span className="text-[11px] text-stone-400">
            Rate: $1 = {formatKhr(1)}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight leading-none">
            {formatUsd(totalPriceUsd)}
          </div>
          <div className="text-sm font-bold text-amber-800 mt-1">
            {formatKhr(totalPriceUsd)}
          </div>
        </div>
      </div>

      {/* ABA KHQR Callout */}
      <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/70 flex items-center gap-2.5 text-xs text-amber-950">
        <div className="w-8 h-8 rounded-xl bg-amber-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
          <QrCode className="w-4 h-4" />
        </div>
        <p className="leading-snug">
          Pay easily via <strong>Bakong / ABA KHQR</strong> at checkout.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        {isAuthenticated ? (
          <Link to="/checkout" className="block w-full">
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-between shadow-md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              <span>Proceed to Checkout</span>
            </Button>
          </Link>
        ) : (
          <div className="space-y-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => openAuthModalWith({ mode: 'register', redirectTo: '/checkout' })}
              className="w-full justify-between shadow-md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              <span>Continue to checkout</span>
            </Button>
            <p className="text-xs text-stone-500 text-center">
              Have an account?{' '}
              <button
                type="button"
                onClick={() => openAuthModalWith({ mode: 'login', redirectTo: '/checkout' })}
                className="font-bold text-stone-950 underline underline-offset-4 cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </div>
        )}

        {isConfirmingClear ? (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-2 animate-in fade-in">
            <p className="text-xs font-bold text-rose-900">Remove all drinks from cart?</p>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsConfirmingClear(false);
                  onClearCart();
                }}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Yes, clear cart
              </button>
              <button
                type="button"
                onClick={() => setIsConfirmingClear(false)}
                className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsConfirmingClear(true)}
            className="w-full text-xs font-bold text-stone-400 hover:text-rose-600 transition-colors py-2 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Drinks</span>
          </button>
        )}
      </div>
    </div>
  );
};
