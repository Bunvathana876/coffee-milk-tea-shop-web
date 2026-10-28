import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Clock,
  RotateCcw,
  Search,
  CheckCircle2,
  AlertCircle,
  Coffee,
  FileText,
  Sparkles,
  Copy,
  Check,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../features/auth/AuthContext';
import { useCart } from '../features/cart/useCart';
import { getOrdersByPhone } from '../services/api';
import { formatUsd, formatKhr } from '../config/currency';
import type { Order, DrinkSize, SugarLevel, IceLevel } from '../types';

export const OrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { addItem } = useCart();

  const [phoneInput, setPhoneInput] = useState(user?.phone || '');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [reorderSuccess, setReorderSuccess] = useState<string | null>(null);
  const [copiedOrderNumber, setCopiedOrderNumber] = useState<string | null>(null);

  const handleSearch = async (phoneToSearch?: string) => {
    const targetPhone = (phoneToSearch || phoneInput).trim();
    if (!targetPhone) return;

    setIsLoading(true);
    setHasSearched(true);
    try {
      const results = await getOrdersByPhone(targetPhone);
      setOrders(results);
    } catch (err) {
      console.error('Failed to lookup orders:', err);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-search if user is logged in
  const userPhone = user?.phone;
  useEffect(() => {
    if (userPhone) {
      setPhoneInput(userPhone);
      void handleSearch(userPhone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPhone]);

  const handleCopyOrderNumber = (orderNumber: string) => {
    navigator.clipboard.writeText(orderNumber);
    setCopiedOrderNumber(orderNumber);
    setTimeout(() => {
      setCopiedOrderNumber(null);
    }, 2500);
  };

  const handleReorder = (order: Order) => {
    if (!order.items || order.items.length === 0) return;

    let totalAdded = 0;
    for (const item of order.items) {
      const toppingsArray = item.toppings
        ? item.toppings.split(',').map((t) => t.trim()).filter(Boolean)
        : [];

      addItem({
        productId: item.product_id || 0,
        productName: item.product_name,
        size: (item.size || 'Medium') as DrinkSize,
        sugarLevel: (item.sugar_level || '50%') as SugarLevel,
        iceLevel: (item.ice_level || 'Normal Ice') as IceLevel,
        toppings: toppingsArray,
        unitPriceUsd: item.unit_price_usd,
        quantity: item.quantity,
      });
      totalAdded += item.quantity;
    }

    setReorderSuccess(`Added ${totalAdded} drink(s) from order ${order.order_number} to your cart!`);
    setTimeout(() => {
      setReorderSuccess(null);
    }, 4000);
  };

  const getStepProgress = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'completed') return 4;
    if (s === 'ready') return 3;
    if (s === 'preparing') return 2;
    return 1; // pending/received
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-matcha/15 text-matcha border border-matcha/25">
            Enjoyed &amp; Completed
          </span>
        );
      case 'preparing':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-caramel/20 text-espresso border border-caramel/40 animate-pulse">
            Barista Brewing
          </span>
        );
      case 'ready':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-300">
            Ready for Pickup!
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cream-deep text-ink-soft border border-line">
            Order Received
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Toast */}
      {reorderSuccess && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-espresso-dark text-cream px-4 py-3 rounded-2xl shadow-2xl border border-espresso flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 ring-1 ring-white/10">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{reorderSuccess}</span>
          <button
            onClick={() => navigate('/cart')}
            className="text-caramel hover:underline font-bold text-xs ml-2 cursor-pointer"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-line pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-caramel uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Café Tracker</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-black text-ink tracking-tight">
            Live Order Tracking
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft mt-0.5">
            Real-time brewing updates, digital receipts, and 1-tap reordering
          </p>
        </div>

        {isAuthenticated && user && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-cream-deep border border-line text-ink text-xs font-bold shadow-2xs">
            <Sparkles className="w-4 h-4 text-caramel" />
            <span>{user.full_name} • {user.loyalty_stamps} Stamps ☕</span>
          </div>
        )}
      </div>

      {/* Phone Lookup Box */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-line shadow-xs space-y-3">
        <label className="block text-xs font-bold text-ink uppercase tracking-wider">
          Lookup by Customer Phone Number
        </label>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-2.5"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="e.g. 012 345 678"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-line focus:outline-none focus:ring-2 focus:ring-caramel text-sm font-semibold bg-cream text-ink placeholder:text-ink-soft/60"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !phoneInput.trim()}
            className="px-6 py-3 rounded-2xl bg-espresso hover:bg-espresso-dark text-cream font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Find Orders'}
          </button>
        </form>
      </div>

      {/* Orders List */}
      <div className="space-y-5">
        {isLoading ? (
          <div className="text-center py-12 text-ink-soft font-bold text-sm space-y-2">
            <div className="w-8 h-8 rounded-full border-2 border-caramel border-t-transparent animate-spin mx-auto" />
            <p>Fetching your orders from the kitchen...</p>
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => {
            const step = getStepProgress(order.order_status);
            const isCancelled = order.order_status.toLowerCase() === 'cancelled';

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-line p-5 sm:p-7 shadow-xs hover:border-caramel/40 hover:shadow-sm transition-all space-y-5"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-cream-deep text-caramel flex items-center justify-center font-bold border border-line">
                      <Coffee className="w-6 h-6 text-espresso" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs sm:text-sm font-bold text-ink">
                          {order.order_number}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyOrderNumber(order.order_number)}
                          className="text-ink-soft hover:text-ink p-1 rounded-md transition-colors cursor-pointer"
                          title="Copy order reference"
                        >
                          {copiedOrderNumber === order.order_number ? (
                            <Check className="w-3.5 h-3.5 text-matcha" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <span className="text-[11px] text-ink-soft flex items-center gap-1 font-medium mt-0.5">
                        <Clock className="w-3 h-3 text-caramel" />
                        {new Date(order.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(order.order_status)}
                  </div>
                </div>

                {/* Live Preparation Timeline Stepper */}
                {!isCancelled && (
                  <div className="p-4 rounded-2xl bg-cream-deep/60 border border-line">
                    <div className="grid grid-cols-4 gap-2 text-center relative">
                      {/* Step 1 */}
                      <div className="space-y-1">
                        <div
                          className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center text-xs font-black ${
                            step >= 1
                              ? 'bg-espresso text-cream ring-2 ring-espresso/20'
                              : 'bg-line text-ink-soft'
                          }`}
                        >
                          {step > 1 ? '✓' : '1'}
                        </div>
                        <span className="text-[10px] font-bold text-ink block">Received</span>
                      </div>

                      {/* Step 2 */}
                      <div className="space-y-1">
                        <div
                          className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center text-xs font-black ${
                            step >= 2
                              ? 'bg-caramel text-espresso-dark ring-2 ring-caramel/20'
                              : 'bg-line text-ink-soft'
                          }`}
                        >
                          {step > 2 ? '✓' : '2'}
                        </div>
                        <span className="text-[10px] font-bold text-ink block">Brewing</span>
                      </div>

                      {/* Step 3 */}
                      <div className="space-y-1">
                        <div
                          className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center text-xs font-black ${
                            step >= 3
                              ? 'bg-matcha text-white ring-2 ring-matcha/20'
                              : 'bg-line text-ink-soft'
                          }`}
                        >
                          {step > 3 ? '✓' : '3'}
                        </div>
                        <span className="text-[10px] font-bold text-ink block">Ready</span>
                      </div>

                      {/* Step 4 */}
                      <div className="space-y-1">
                        <div
                          className={`w-7 h-7 rounded-full mx-auto flex items-center justify-center text-xs font-black ${
                            step >= 4
                              ? 'bg-matcha text-white'
                              : 'bg-line text-ink-soft'
                          }`}
                        >
                          {step >= 4 ? '✓' : '4'}
                        </div>
                        <span className="text-[10px] font-bold text-ink block">Enjoyed</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Items List */}
                <div className="divide-y divide-line">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0 flex items-start justify-between text-xs gap-4">
                      <div>
                        <span className="font-serif font-bold text-ink">
                          {item.quantity}x {item.product_name}
                        </span>
                        <span className="text-ink-soft block text-[11px] mt-0.5">
                          {item.size} • {item.sugar_level} sweet • {item.ice_level}
                          {item.toppings ? ` • +${item.toppings}` : ''}
                        </span>
                      </div>
                      <span className="font-bold text-ink">
                        {formatUsd(item.subtotal_usd)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Customer Notes (if provided) */}
                {order.notes && (
                  <div className="p-3 rounded-xl bg-cream-deep border border-line text-xs text-ink">
                    <span className="font-bold block text-[10px] uppercase text-caramel">
                      Barista Notes:
                    </span>
                    <span className="text-ink-soft">{order.notes}</span>
                  </div>
                )}

                {/* Footer Total & 1-Tap Reorder */}
                <div className="pt-3 border-t border-line flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">
                      Total Paid / Due
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif font-black text-lg text-ink">
                        {formatUsd(order.total_usd)}
                      </span>
                      <span className="text-xs font-bold text-caramel">
                        ({formatKhr(order.total_usd)})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/receipt/${order.id}`}
                      state={{ order }}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl border border-line hover:bg-cream text-ink font-bold text-xs transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-caramel" />
                      <span>View Receipt</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleReorder(order)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-caramel hover:bg-caramel-soft text-espresso-dark font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>1-Tap Reorder</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : hasSearched ? (
          <div className="bg-white rounded-3xl border border-line p-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-ink-soft/40 mx-auto" />
            <h3 className="font-serif font-bold text-ink text-base">No orders found for this phone number</h3>
            <p className="text-xs text-ink-soft max-w-sm mx-auto">
              Please double check the phone number or place your first artisan order from our drink menu.
            </p>
            <div className="pt-2">
              <Link
                to="/menu"
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-caramel text-espresso-dark font-black text-xs shadow-xs hover:bg-caramel-soft transition-colors"
              >
                <span>Browse Drink Menu</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-cream-deep/60 rounded-3xl border border-dashed border-line p-10 text-center space-y-2">
            <Coffee className="w-10 h-10 text-caramel mx-auto" />
            <p className="text-xs font-bold text-ink-soft">
              Enter your phone number above to track your order in real time or view your drink history.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
