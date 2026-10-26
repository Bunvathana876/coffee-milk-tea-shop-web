import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingBag,
  User,
  Phone,
  QrCode,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Coffee,
  Info,
  Sparkles,
  Lock,
} from 'lucide-react';
import { useCart } from '../features/cart/useCart';
import { useAuth } from '../features/auth/AuthContext';
import { formatUsd, formatKhr } from '../config/currency';
import { createOrder } from '../services/orderService';
import { Button } from '../components/common/Button';
import { AbaKhqrPayment } from '../components/payment';
import type { CreateOrderPayload } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalQuantity, subtotalUsd, totalPriceUsd, clearCart } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();

  // Duplicate submission prevention lock
  const isSubmittingRef = useRef<boolean>(false);

  // Customer Information Form State
  const [customerName, setCustomerName] = useState(user?.full_name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');

  // Pre-fill if user logs in or profile changes
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.full_name);
      if (!customerPhone) setCustomerPhone(user.phone);
    }
  }, [user]);

  // Form Validation State
  const [errors, setErrors] = useState<{
    customerName?: string;
    customerPhone?: string;
  }>({});

  // Submission States
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showQrPreview, setShowQrPreview] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: { customerName?: string; customerPhone?: string } = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Customer name is required.';
    } else if (customerName.trim().length < 2) {
      newErrors.customerName = 'Please enter a valid customer name (at least 2 letters).';
    }

    if (!customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required.';
    } else if (customerPhone.trim().replace(/\D/g, '').length < 8) {
      newErrors.customerPhone = 'Please enter a valid phone number (at least 8 digits).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Prevent duplicate submission if already processing
    if (isSubmittingRef.current || isLoading) {
      return;
    }

    // 0. Enforce user must be signed in to purchase
    if (!isAuthenticated) {
      openAuthModal();
      setSubmitError('Please sign in or create an account to place your order.');
      return;
    }

    // 1. Validate cart is not empty
    if (items.length === 0) {
      setSubmitError('Your cart is empty. Please add drinks before placing an order.');
      return;
    }

    // 2. Validate customer information
    if (!validateForm()) {
      return;
    }

    // Lock submission immediately
    isSubmittingRef.current = true;
    setIsLoading(true);

    try {
      // Build order payload
      const orderPayload: CreateOrderPayload = {
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        items: items.map((item) => ({
          product_id: item.productId,
          product_name: item.productName,
          quantity: item.quantity,
          unit_price_usd: item.unitPriceUsd,
          subtotal_usd: item.subtotalUsd,
          size: item.size,
          sugar_level: item.sugarLevel,
          ice_level: item.iceLevel,
          toppings: item.toppings || [],
        })),
      };

      // Send order to FastAPI backend
      const createdOrder = await createOrder(orderPayload);

      // Clear the local shopping cart upon successful creation
      clearCart();

      // Navigate to receipt page
      navigate(`/receipt/${createdOrder.id}`, {
        state: { order: createdOrder },
      });
    } catch (err) {
      console.error('Order creation error:', err);
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to connect to the server. Please check your backend connection and try again.';
      setSubmitError(message);
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 space-y-6 sm:space-y-8">
      {/* Navigation Header */}
      <div className="flex items-center gap-3.5 border-b border-stone-200 pb-4">
        <Link
          to="/cart"
          className="p-2.5 rounded-2xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Back to Cart"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Checkout & Order
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Confirm your drinks, enter your contact information, and place your order
          </p>
        </div>
      </div>

      {/* Empty Cart Warning */}
      {items.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-900 border border-amber-200/60 flex items-center justify-center mx-auto shadow-2xs">
            <ShoppingBag className="w-8 h-8 text-amber-800" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-black text-stone-900">Your Cart is Empty</h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
              You must add at least one handcrafted coffee or milk tea before proceeding to checkout.
            </p>
          </div>
          <div className="pt-2">
            <Link to="/menu">
              <Button variant="primary">Explore Menu</Button>
            </Link>
          </div>
        </div>
      ) : !isAuthenticated ? (
        /* Sign-In Required Before Purchase Block */
        <div className="bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-12 text-center space-y-5 shadow-xs max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-900 border border-amber-200/60 flex items-center justify-center mx-auto shadow-2xs">
            <Lock className="w-8 h-8 text-amber-800" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Sign In Required to Buy Drinks
            </div>
            <h2 className="text-xl font-black text-stone-900 tracking-tight">
              Please Sign In to Complete Your Order
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed max-w-sm mx-auto">
              To buy your handcrafted coffee and milk tea, please sign in or create an account. This links your order for live preparation tracking and earns you digital loyalty stamps!
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={openAuthModal}
              className="w-full sm:w-auto px-8 shadow-md"
              icon={<User className="w-4 h-4" />}
            >
              Sign In / Register
            </Button>
            <Link to="/cart" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Back to Cart
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Customer Information & Payment Method (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Global Error Banner */}
            {submitError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 animate-in fade-in">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm space-y-1 flex-1">
                  <p className="font-bold">Failed to Place Order</p>
                  <p className="text-rose-700 leading-relaxed">{submitError}</p>
                </div>
              </div>
            )}

            {/* 1. Customer Information Card */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-xl bg-amber-900 text-white flex items-center justify-center font-black text-xs shadow-2xs">
                  1
                </div>
                <div>
                  <h2 className="font-black text-base text-stone-900 tracking-tight">
                    Customer Information
                  </h2>
                  <p className="text-[11px] text-stone-500">
                    We will call your name when your drinks are freshly prepared
                  </p>
                </div>
              </div>

              {isAuthenticated && user && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Signed in as <strong>{user.full_name}</strong>. Placing this order will automatically earn you <strong>+1 Loyalty Stamp</strong>!
                  </span>
                </div>
              )}

              <div className="space-y-4">
                {/* Customer Name Input */}
                <div>
                  <label
                    htmlFor="customerName"
                    className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5"
                  >
                    Customer Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="customerName"
                      type="text"
                      value={customerName}
                      disabled={isLoading}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (errors.customerName) {
                          setErrors((prev) => ({ ...prev, customerName: undefined }));
                        }
                      }}
                      placeholder="e.g. Sokha Chan"
                      className={`w-full bg-stone-50/70 border rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm focus:outline-none focus:bg-white transition-all ${
                        errors.customerName
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                          : 'border-stone-200 focus:border-amber-800 focus:ring-2 focus:ring-amber-800/20'
                      }`}
                    />
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  </div>
                  {errors.customerName && (
                    <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.customerName}
                    </p>
                  )}
                </div>

                {/* Customer Phone Input */}
                <div>
                  <label
                    htmlFor="customerPhone"
                    className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5"
                  >
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="customerPhone"
                      type="tel"
                      value={customerPhone}
                      disabled={isLoading}
                      onChange={(e) => {
                        setCustomerPhone(e.target.value);
                        if (errors.customerPhone) {
                          setErrors((prev) => ({ ...prev, customerPhone: undefined }));
                        }
                      }}
                      placeholder="e.g. 012 345 678"
                      className={`w-full bg-stone-50/70 border rounded-2xl pl-10 pr-4 py-3 text-xs sm:text-sm focus:outline-none focus:bg-white transition-all ${
                        errors.customerPhone
                          ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                          : 'border-stone-200 focus:border-amber-800 focus:ring-2 focus:ring-amber-800/20'
                      }`}
                    />
                    <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                  </div>
                  {errors.customerPhone && (
                    <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.customerPhone}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 2. Payment Method Card */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-xl bg-amber-900 text-white flex items-center justify-center font-black text-xs shadow-2xs">
                  2
                </div>
                <div>
                  <h2 className="font-black text-base text-stone-900 tracking-tight">
                    Payment Method
                  </h2>
                  <p className="text-[11px] text-stone-500">
                    Fast and convenient scan-to-pay via Bakong / ABA KHQR
                  </p>
                </div>
              </div>

              {/* ABA KHQR Radio Option */}
              <div className="p-4 rounded-2xl border-2 border-amber-900 bg-amber-50/50 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <QrCode className="w-5 h-5" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-stone-900">
                      ABA KHQR (Pay via Bakong / Any Bank)
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Selected
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Scan with ABA Mobile or any Bakong-enabled Cambodian banking application.
                  </p>
                </div>
              </div>

              {/* Mandatory Mock / Demo Payment Notice */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300/80 text-amber-950 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                  <Info className="w-4 h-4 text-amber-800 shrink-0" />
                  <span>Demo Payment — This QR code is for demonstration only.</span>
                </div>
                <p className="text-[11px] text-amber-900/90 leading-relaxed pl-6">
                  This café web application operates in demonstration mode. No real payment will be charged, no banking accounts are connected, and no financial data is collected or stored.
                </p>
              </div>

              {/* Optional KHQR Preview Toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowQrPreview((prev) => !prev)}
                  className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{showQrPreview ? 'Hide Demo KHQR Preview' : 'Preview Demo ABA KHQR Standee'}</span>
                </button>

                {showQrPreview && (
                  <div className="mt-3 animate-in fade-in">
                    <AbaKhqrPayment
                      orderNumber="PREVIEW-DEMO"
                      amountUsd={totalPriceUsd}
                      customerName={customerName.trim() || undefined}
                      paymentStatus="pending"
                      compact={true}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order Button (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="font-black text-base text-stone-900 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-900" />
                  <span>Order Summary</span>
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                  {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
                    {/* Item Thumbnail */}
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-stone-200/70"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center shrink-0">
                        <Coffee className="w-6 h-6" />
                      </div>
                    )}

                    {/* Drink Details & Customizations */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-extrabold text-xs sm:text-sm text-stone-900 truncate">
                          {item.productName}
                        </h3>
                        <span className="font-black text-xs text-amber-950 shrink-0">
                          {formatUsd(item.subtotalUsd)}
                        </span>
                      </div>

                      {/* Customization Pills */}
                      <div className="flex flex-wrap gap-1 text-[10px] text-stone-500">
                        <span className="px-1.5 py-0.5 rounded-md bg-stone-100 font-bold">
                          {item.size}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md bg-stone-100 font-bold">
                          {item.sugarLevel}
                        </span>
                        <span className="px-1.5 py-0.5 rounded-md bg-stone-100 font-bold">
                          {item.iceLevel}
                        </span>
                      </div>

                      {/* Quantity & Unit Price */}
                      <div className="text-[11px] text-stone-500 flex items-center justify-between">
                        <span>
                          Qty: <strong className="text-stone-800">{item.quantity}</strong> × {formatUsd(item.unitPriceUsd)}
                        </span>
                        <span className="text-[10px] text-stone-400 font-bold">
                          {formatKhr(item.subtotalUsd)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Section */}
              <div className="pt-3 border-t border-stone-100 space-y-2 text-xs">
                {/* Subtotal */}
                <div className="flex justify-between items-start text-stone-600">
                  <span className="font-semibold">Subtotal</span>
                  <div className="text-right">
                    <div className="font-black text-stone-900 text-sm">
                      {formatUsd(subtotalUsd)}
                    </div>
                    <div className="text-[11px] text-stone-400 font-bold mt-0.5">
                      {formatKhr(subtotalUsd)}
                    </div>
                  </div>
                </div>

                {/* Packaging */}
                <div className="flex justify-between items-center text-stone-600 pt-1 border-t border-stone-50">
                  <span>Takeaway Cup & Straw</span>
                  <span className="font-bold text-emerald-700">Free</span>
                </div>

                {/* Total Due in USD and KHR */}
                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
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
              </div>

              {/* Submit Order Action Button */}
              <button
                type="submit"
                disabled={isLoading || items.length === 0}
                aria-busy={isLoading}
                className="w-full py-4 px-6 rounded-2xl bg-amber-900 hover:bg-amber-950 text-white font-black text-sm shadow-md shadow-amber-950/20 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Processing Order... Please wait</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>Place Order ({formatUsd(totalPriceUsd)})</span>
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-stone-400 font-medium">
                By placing your order, you confirm you are testing in demonstration mode.
              </p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
