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

  // Auto-search if user is logged in
  useEffect(() => {
    if (user?.phone) {
      setPhoneInput(user.phone);
      handleSearch(user.phone);
    }
  }, [user]);

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

  const handleReorder = (order: Order) => {
    if (!order.items || order.items.length === 0) return;

    let totalAdded = 0;
    for (const item of order.items) {
      // Parse toppings string into array
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

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
            Completed
          </span>
        );
      case 'preparing':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
            In the Kitchen
          </span>
        );
      case 'ready':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-100 text-sky-800 border border-sky-300">
            Ready for Pickup
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-200">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-stone-100 text-stone-700 border border-stone-300">
            Received
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Toast */}
      {reorderSuccess && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-stone-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{reorderSuccess}</span>
          <button
            onClick={() => navigate('/cart')}
            className="text-amber-300 hover:underline font-bold text-xs ml-2 cursor-pointer"
          >
            View Cart
          </button>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-stone-200 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Order Tracking & History
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Track your live drink status or reorder previous favorites in 1 tap.
          </p>
        </div>

        {isAuthenticated && user && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-amber-100/80 border border-amber-300 text-amber-950 text-xs font-bold">
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>{user.full_name} • {user.loyalty_stamps} Stamps</span>
          </div>
        )}
      </div>

      {/* Phone Lookup Box */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/90 shadow-xs space-y-3">
        <label className="block text-xs font-black text-stone-700 uppercase tracking-wider">
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
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="e.g. 012 345 678"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-800 text-sm font-semibold"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !phoneInput.trim()}
            className="px-6 py-3 rounded-2xl bg-amber-900 hover:bg-amber-950 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? 'Searching...' : 'Find Orders'}
          </button>
        </form>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-stone-400 font-bold text-sm">
            Loading your orders...
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
                    <Coffee className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-mono text-xs font-black text-stone-900 block">
                      {order.order_number}
                    </span>
                    <span className="text-[11px] text-stone-400 flex items-center gap-1 font-medium mt-0.5">
                      <Clock className="w-3 h-3" />
                      {new Date(order.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {getStatusBadge(order.order_status)}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2.5">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between text-xs gap-4">
                    <div>
                      <span className="font-extrabold text-stone-900">
                        {item.quantity}x {item.product_name}
                      </span>
                      <span className="text-stone-500 block text-[11px] mt-0.5">
                        {item.size} • {item.sugar_level} sugar • {item.ice_level}
                        {item.toppings ? ` • +${item.toppings}` : ''}
                      </span>
                    </div>
                    <span className="font-black text-stone-800">
                      {formatUsd(item.subtotal_usd)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Total & 1-Tap Reorder */}
              <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                    Total Amount
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-black text-base text-amber-950">
                      {formatUsd(order.total_usd)}
                    </span>
                    <span className="text-xs font-bold text-stone-400">
                      ({formatKhr(order.total_usd)})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/receipt/${order.id}`}
                    state={{ order }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-bold text-xs transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-stone-500" />
                    <span>Receipt</span>
                  </Link>

                  <button
                    onClick={() => handleReorder(order)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-white font-black text-xs shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>1-Tap Reorder</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : hasSearched ? (
          <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center space-y-3">
            <AlertCircle className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-stone-800 text-sm">No orders found for this phone number</h3>
            <p className="text-xs text-stone-500">
              Please check your phone number or place a new order from our menu.
            </p>
            <Link
              to="/menu"
              className="inline-block mt-2 px-5 py-2.5 rounded-2xl bg-amber-900 text-white font-bold text-xs"
            >
              Browse Drink Menu
            </Link>
          </div>
        ) : (
          <div className="bg-stone-100/60 rounded-3xl border border-dashed border-stone-300 p-10 text-center space-y-2">
            <Coffee className="w-10 h-10 text-stone-400 mx-auto" />
            <p className="text-xs font-bold text-stone-600">
              Enter your phone number above to view past orders and live preparation updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
