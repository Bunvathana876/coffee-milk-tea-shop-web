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
  MapPin,
  Clock,
  Banknote,
} from 'lucide-react';
import { useCart } from '../features/cart/useCart';
import { useAuth } from '../features/auth/AuthContext';
import { formatUsd, formatKhr } from '../config/currency';
import { createOrder } from '../services/orderService';
import { Button } from '../components/common/Button';
import type { CreateOrderPayload } from '../types';
import confetti from 'canvas-confetti';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, totalQuantity, subtotalUsd, totalPriceUsd, clearCart } = useCart();
  const { user, isAuthenticated, openAuthModal, openAuthModalWith } = useAuth();

  // Duplicate submission prevention lock
  const isSubmittingRef = useRef<boolean>(false);

  // Fulfillment Mode: Pickup or Delivery
  const [fulfillmentMode, setFulfillmentMode] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // Customer Information Form State
  const [customerName, setCustomerName] = useState(user?.full_name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [orderNotes, setOrderNotes] = useState('');

  // Payment Method: 'khqr' or 'cash'
  const [paymentMethod, setPaymentMethod] = useState<'khqr' | 'cash'>('khqr');

  // Pre-fill if user logs in or profile changes
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.full_name);
      if (!customerPhone) setCustomerPhone(user.phone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Form Validation State
  const [errors, setErrors] = useState<{
    customerName?: string;
    customerPhone?: string;
    deliveryAddress?: string;
  }>({});

  // Submission States
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Quick suggestion chips for barista notes
  const quickNotes = [
    'Separate hot & cold bags',
    'Extra straw & napkins',
    'Pack ice separately',
    'Call upon arrival',
  ];

  const handleAddQuickNote = (noteText: string) => {
    setOrderNotes((prev) => (prev ? `${prev}, ${noteText}` : noteText));
  };

  const validateForm = (): boolean => {
    const newErrors: {
      customerName?: string;
      customerPhone?: string;
      deliveryAddress?: string;
    } = {};

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

    if (fulfillmentMode === 'delivery' && !deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Please enter your delivery street address or building.';
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
      // Build comprehensive notes including fulfillment details
      let finalNotes = orderNotes.trim();
      if (fulfillmentMode === 'delivery') {
        const deliveryPrefix = `[DELIVERY to: ${deliveryAddress.trim()}]`;
        finalNotes = finalNotes ? `${deliveryPrefix} ${finalNotes}` : deliveryPrefix;
      } else {
        const pickupPrefix = '[STORE PICKUP: BKK1 Branch]';
        finalNotes = finalNotes ? `${pickupPrefix} ${finalNotes}` : pickupPrefix;
      }

      // Build order payload
      const orderPayload: CreateOrderPayload = {
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        customer_email: user?.email || null,
        notes: finalNotes || null,
        payment_method: paymentMethod,
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

      // Send order to backend
      const createdOrder = await createOrder(orderPayload);

      // Trigger celebratory golden confetti
      try {
        confetti({
          particleCount: 75,
          spread: 65,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#d97706', '#92400e', '#78350f', '#fde68a'],
        });
      } catch {
        // confetti is purely decorative
      }

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
      <div className="flex items-center gap-3.5 border-b border-stone-200/80 pb-4">
        <Link
          to="/cart"
          className="p-2.5 rounded-2xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          aria-label="Back to Cart"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
            Checkout & Order
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Choose pickup or delivery, confirm your drinks, and complete your order
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
        /* Guests: one quick step to sign in or sign up, cart is kept */
        <div className="bg-white rounded-3xl border border-stone-200 p-7 sm:p-10 text-center space-y-6 shadow-sm max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-stone-950 text-amber-300 flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-black text-stone-900 tracking-tight">
              One quick step
            </h2>
            <p className="text-sm text-stone-500">
              Sign in or create an account to place your order. Your {totalQuantity}{' '}
              {totalQuantity === 1 ? 'drink is' : 'drinks are'} saved ({formatUsd(totalPriceUsd)}).
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={() => openAuthModalWith({ mode: 'register' })}
              className="w-full"
            >
              Create account
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => openAuthModalWith({ mode: 'login' })}
              className="w-full"
            >
              I already have an account
            </Button>
          </div>
          <Link to="/menu" className="inline-block text-sm font-bold text-stone-500 hover:text-stone-900">
            Keep browsing
          </Link>
        </div>
      ) : (
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Fulfillment, Contact, Notes & Payment Method (7 Cols) */}
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

            {/* 1. Fulfillment Mode: Pickup or Delivery */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-xl bg-amber-900 text-white flex items-center justify-center font-black text-xs shadow-2xs">
                  1
                </div>
                <div>
                  <h2 className="font-serif font-black text-base text-stone-900 tracking-tight">
                    Order Fulfillment
                  </h2>
                  <p className="text-[11px] text-stone-500">
                    How would you like to receive your drinks?
                  </p>
                </div>
              </div>

              {/* Mode Toggle Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillmentMode('pickup')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    fulfillmentMode === 'pickup'
                      ? 'border-amber-900 bg-amber-50/80 ring-2 ring-amber-900/30 shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-amber-900" />
                      <span>Café Pickup</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Free
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 mt-2 block">
                    Ready in ~10 mins • Street 214, BKK1, Phnom Penh
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentMode('delivery')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    fulfillmentMode === 'delivery'
                      ? 'border-amber-900 bg-amber-50/80 ring-2 ring-amber-900/30 shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-stone-900 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-amber-900" />
                      <span>Local Delivery</span>
                    </span>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                      ~30 mins
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 mt-2 block">
                    Direct to your doorstep anywhere in Phnom Penh
                  </span>
                </button>
              </div>

              {/* Delivery Address Input (If Delivery selected) */}
              {fulfillmentMode === 'delivery' && (
                <div className="pt-2 animate-in fade-in">
                  <label
                    htmlFor="deliveryAddress"
                    className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5"
                  >
                    Delivery Address / Building <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="deliveryAddress"
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => {
                      setDeliveryAddress(e.target.value);
                      if (errors.deliveryAddress) {
                        setErrors((prev) => ({ ...prev, deliveryAddress: undefined }));
                      }
                    }}
                    placeholder="e.g. Condo / House #12, St 310, Boeung Keng Kang 1"
                    className={`w-full bg-stone-50/70 border rounded-2xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:bg-white transition-all ${
                      errors.deliveryAddress
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
                        : 'border-stone-200 focus:border-amber-900 focus:ring-2 focus:ring-amber-900/20'
                    }`}
                  />
                  {errors.deliveryAddress && (
                    <p className="text-xs text-rose-600 mt-1 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {errors.deliveryAddress}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* 2. Customer Information Card */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-xl bg-amber-900 text-white flex items-center justify-center font-black text-xs shadow-2xs">
                  2
                </div>
                <div>
                  <h2 className="font-serif font-black text-base text-stone-900 tracking-tight">
                    Contact Information
                  </h2>
                  <p className="text-[11px] text-stone-500">
                    We will notify your phone when drinks are ready
                  </p>
                </div>
              </div>

              {isAuthenticated && user && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-semibold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Signed in as <strong>{user.full_name}</strong>. Earning <strong>+1 Loyalty Stamp</strong> on this order!
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Customer Name Input */}
                <div>
                  <label
                    htmlFor="customerName"
                    className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5"
                  >
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="customerName"
                      type="text"
                      name="name"
                      autoComplete="name"
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
                          : 'border-stone-200 focus:border-amber-900 focus:ring-2 focus:ring-amber-900/20'
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
                      name="tel"
                      inputMode="tel"
                      autoComplete="tel"
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
                          : 'border-stone-200 focus:border-amber-900 focus:ring-2 focus:ring-amber-900/20'
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

              {/* Barista Special Instructions / Notes */}
              <div>
                <label
                  htmlFor="orderNotes"
                  className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5"
                >
                  Barista Notes / Special Requests <span className="text-[10px] text-stone-400 font-normal lowercase">(optional)</span>
                </label>
                <textarea
                  id="orderNotes"
                  rows={2}
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="e.g. Please pack ice separately, extra napkins, or delivery instructions..."
                  className="w-full bg-stone-50/70 border border-stone-200 rounded-2xl p-3 text-xs sm:text-sm focus:outline-none focus:bg-white focus:border-amber-900 focus:ring-2 focus:ring-amber-900/20 transition-all resize-none"
                />

                {/* Quick note suggestion chips */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {quickNotes.map((note) => (
                    <button
                      key={note}
                      type="button"
                      onClick={() => handleAddQuickNote(note)}
                      className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-stone-100 hover:bg-amber-50 hover:text-amber-950 text-stone-600 border border-stone-200 transition-colors cursor-pointer"
                    >
                      + {note}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Payment Method Card */}
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                <div className="w-8 h-8 rounded-xl bg-amber-900 text-white flex items-center justify-center font-black text-xs shadow-2xs">
                  3
                </div>
                <div>
                  <h2 className="font-serif font-black text-base text-stone-900 tracking-tight">
                    Payment Method
                  </h2>
                  <p className="text-[11px] text-stone-500">
                    Choose how you would like to settle your order
                  </p>
                </div>
              </div>

              {/* Payment Method Radio Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* ABA KHQR Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('khqr')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'khqr'
                      ? 'border-amber-900 bg-amber-50/80 ring-2 ring-amber-900/30 shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-900 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs sm:text-sm text-stone-900">
                        ABA KHQR
                      </span>
                      {paymentMethod === 'khqr' && (
                        <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                      Scan with Bakong or any Cambodian bank
                    </p>
                  </div>
                </button>

                {/* Cash on Pickup / Delivery Option */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    paymentMethod === 'cash'
                      ? 'border-amber-900 bg-amber-50/80 ring-2 ring-amber-900/30 shadow-xs'
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-stone-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Banknote className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-black text-xs sm:text-sm text-stone-900">
                        Cash on {fulfillmentMode === 'pickup' ? 'Pickup' : 'Delivery'}
                      </span>
                      {paymentMethod === 'cash' && (
                        <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-full">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 leading-snug">
                      Pay in USD ($) or KHR (៛) in person
                    </p>
                  </div>
                </button>
              </div>

              {/* ABA KHQR Demo Note */}
              {paymentMethod === 'khqr' && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-300/80 text-amber-950 space-y-1.5 animate-in fade-in">
                  <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                    <Info className="w-4 h-4 text-amber-800 shrink-0" />
                    <span>Instant scan via Bakong, ABA, ACLEDA, Wing, Canadia & more</span>
                  </div>
                  <p className="text-[11px] text-amber-900/90 leading-relaxed pl-6">
                    A universal KHQR code will be displayed after placing your order with live payment status verification.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Action (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            <div className="bg-white rounded-3xl border border-stone-200/90 p-5 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h2 className="font-serif font-black text-base text-stone-900 flex items-center gap-2">
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
                        <h3 className="font-serif font-bold text-xs sm:text-sm text-stone-900 truncate">
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
                        {item.toppings?.map((t) => (
                          <span key={t} className="px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-900 font-bold">
                            +{t}
                          </span>
                        ))}
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

                {/* Packaging & Fulfillment */}
                <div className="flex justify-between items-center text-stone-600 pt-1 border-t border-stone-50">
                  <span>Takeaway Cup & Straw</span>
                  <span className="font-bold text-emerald-700">Free</span>
                </div>

                <div className="flex justify-between items-center text-stone-600">
                  <span>Fulfillment ({fulfillmentMode === 'pickup' ? 'BKK1 Pickup' : 'Delivery'})</span>
                  <span className="font-bold text-emerald-700">Free</span>
                </div>

                {/* Total Due in USD and KHR */}
                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-xs font-black text-stone-700 uppercase tracking-wider block">
                      Total Due
                    </span>
                    <span className="text-[11px] text-stone-400 font-semibold">
                      Rate: $1 = {formatKhr(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl sm:text-3xl font-serif font-black text-amber-950 tracking-tight leading-none">
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
                className="w-full py-4 px-6 rounded-2xl bg-amber-900 hover:bg-amber-950 text-white font-black text-sm shadow-xl shadow-amber-950/20 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                    <span>Placing Your Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    <span>
                      Place Order • {formatUsd(totalPriceUsd)} ({formatKhr(totalPriceUsd)})
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400 font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Estimated ready time: 10–15 mins</span>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
