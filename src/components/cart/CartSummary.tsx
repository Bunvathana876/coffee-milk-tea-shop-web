import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, QrCode, Trash2, ShoppingBag, ShieldCheck } from 'lucide-react';
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
  totalPriceKhr,
  onClearCart,
}) => {
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const { isAuthenticated, openAuthModalWith } = useAuth();

  return (
    <div className="bg-white rounded-3xl border border-line p-5 sm:p-6 shadow-xs space-y-5 sticky top-24">
      {/* Summary Header */}
      <div className="flex items-center justify-between border-b border-line pb-3.5">
        <h3 className="font-serif font-black text-lg text-ink flex items-center gap-2">
          <ShoppingBag className="w-4.5 h-4.5 text-caramel" />
          <span>Order Summary</span>
        </h3>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cream-deep text-ink">
          {totalQuantity} {totalQuantity === 1 ? 'drink' : 'drinks'}
        </span>
      </div>

      {/* Breakdown Rows */}
      <div className="space-y-3 text-xs text-ink-soft">
        <div className="flex justify-between items-start">
          <span className="font-semibold text-ink">Subtotal</span>
          <div className="text-right">
            <div className="font-serif font-bold text-ink text-sm leading-tight">
              {formatUsd(subtotalUsd)}
            </div>
            <div className="text-xs text-ink-soft mt-0.5 font-medium">
              {formatKhr(subtotalUsd)}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-line/60">
          <span>Eco Cup &amp; Straw</span>
          <span className="font-bold text-matcha">Complimentary</span>
        </div>

        <div className="flex justify-between items-center">
          <span>Pickup / Service Fee</span>
          <span className="font-bold text-matcha">$0.00 (Free)</span>
        </div>
      </div>

      {/* Final Total Box */}
      <div className="pt-3 border-t border-line flex items-baseline justify-between bg-cream-deep/50 -mx-5 sm:-mx-6 px-5 sm:px-6 py-4">
        <div>
          <span className="text-[11px] font-bold text-caramel uppercase tracking-wider block">
            Total Due
          </span>
          <span className="text-[10px] text-ink-soft">
            Official Rate: $1 = {formatKhr(1)}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl sm:text-3xl font-serif font-black text-ink tracking-tight leading-none">
            {formatUsd(totalPriceUsd)}
          </div>
          <div className="text-xs font-bold text-caramel mt-1">
            {formatKhr(totalPriceKhr)}
          </div>
        </div>
      </div>

      {/* ABA Bakong KHQR Callout */}
      <div className="p-3.5 rounded-2xl bg-cream-deep border border-line flex items-center gap-3 text-xs text-ink">
        <div className="w-8 h-8 rounded-xl bg-espresso text-caramel flex items-center justify-center shrink-0 shadow-2xs">
          <QrCode className="w-4 h-4" />
        </div>
        <div className="leading-snug">
          <p className="font-bold text-ink">Instant Bakong KHQR</p>
          <p className="text-[11px] text-ink-soft">Scan with ABA or any Cambodian mobile banking app.</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 pt-1">
        {isAuthenticated ? (
          <Link to="/checkout" className="block w-full">
            <Button
              variant="accent"
              size="lg"
              className="w-full justify-between shadow-md"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              <span>Proceed to Checkout</span>
            </Button>
          </Link>
        ) : (
          <div className="space-y-2">
            <Link to="/checkout" className="block w-full">
              <Button
                variant="accent"
                size="lg"
                className="w-full justify-between shadow-md"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                <span>Checkout as Guest</span>
              </Button>
            </Link>
            <p className="text-xs text-ink-soft text-center pt-1">
              Have an account?{' '}
              <button
                type="button"
                onClick={() => openAuthModalWith({ mode: 'login', redirectTo: '/checkout' })}
                className="font-bold text-espresso underline underline-offset-4 cursor-pointer hover:text-caramel transition-colors"
              >
                Sign in to collect stamps
              </button>
            </p>
          </div>
        )}

        {/* Clear Cart Action */}
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
            className="w-full text-xs font-bold text-ink-soft hover:text-rose-600 transition-colors py-1 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Drinks</span>
          </button>
        )}
      </div>

      <div className="pt-2 border-t border-line/60 flex items-center justify-center gap-1.5 text-[11px] text-ink-soft">
        <ShieldCheck className="w-3.5 h-3.5 text-matcha" />
        <span>Freshly prepared on demand upon pickup</span>
      </div>
    </div>
  );
};
