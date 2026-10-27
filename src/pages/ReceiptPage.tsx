import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Printer,
  Download,
  Coffee,
  Clock,
  Loader2,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { formatUsd, formatKhr, usdToKhr } from '../config/currency';
import { getOrderById } from '../services/orderService';
import { AbaKhqrPayment } from '../components/payment';
import { downloadReceiptPdf } from '../utils/receiptPdfGenerator';
import type { Order } from '../types';
import confetti from 'canvas-confetti';

export const ReceiptPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();

  const stateOrder = (location.state as { order?: Order } | null)?.order;
  const isInvalidId = !orderId || isNaN(Number(orderId));
  const [order, setOrder] = useState<Order | null>(stateOrder || null);
  const [isLoading, setIsLoading] = useState(!stateOrder && !isInvalidId);
  const [fetchError, setFetchError] = useState<string | null>(
    !stateOrder && isInvalidId ? 'Invalid or missing order reference number.' : null
  );

  // Local simulated payment status for portfolio testing (starts strictly as 'pending')
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid'>('pending');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  useEffect(() => {
    if (stateOrder) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#d97706', '#92400e', '#78350f', '#fde68a'],
        });
      } catch {
        // confetti is purely decorative
      }
    }
  }, [stateOrder]);

  useEffect(() => {
    let isMounted = true;
    if (stateOrder || isInvalidId) return;

    getOrderById(Number(orderId))
      .then((data) => {
        if (isMounted) {
          setOrder(data);
          if (data.payment_status === 'paid') {
            setPaymentStatus('paid');
          }
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.error('Failed to load order:', err);
          const msg = err instanceof Error ? err.message : 'Could not load order details from server.';
          setFetchError(msg);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [orderId, stateOrder, isInvalidId]);

  const handleRetry = () => {
    if (isInvalidId) return;
    setIsLoading(true);
    setFetchError(null);
    getOrderById(Number(orderId))
      .then((data) => {
        setOrder(data);
        if (data.payment_status === 'paid') {
          setPaymentStatus('paid');
        }
      })
      .catch((err) => {
        console.error('Failed to load order:', err);
        const msg = err instanceof Error ? err.message : 'Could not load order details from server.';
        setFetchError(msg);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const formatOrderDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  // Browser Print Trigger
  const handlePrint = () => {
    window.print();
  };

  // Download Receipt as a high-quality professional PDF (100% client-side, zero data upload)
  const handleDownloadReceipt = () => {
    if (!order) return;
    try {
      downloadReceiptPdf(order, paymentStatus);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to generate PDF receipt:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <Loader2 className="w-10 h-10 text-amber-800 animate-spin mx-auto" />
        <p className="text-sm text-stone-600 font-medium">Preparing your café receipt...</p>
      </div>
    );
  }

  if (fetchError || !order) {
    const isNetworkError =
      fetchError?.toLowerCase().includes('network') ||
      fetchError?.toLowerCase().includes('connect') ||
      fetchError?.toLowerCase().includes('offline') ||
      fetchError?.toLowerCase().includes('failed to fetch');

    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-5 bg-white rounded-3xl border border-stone-200/90 p-8 shadow-xs my-8">
        <div className="w-14 h-14 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-100 shadow-2xs">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="space-y-1.5">
          <h2 className="text-xl font-black text-stone-900 tracking-tight">
            {isNetworkError ? 'Connection Issue' : 'Order Not Found'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            {fetchError || 'Unable to retrieve your order details. The order may not exist or might have expired.'}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
          {fetchError && !isNaN(Number(orderId)) && (
            <Button
              variant="secondary"
              onClick={handleRetry}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Retry Loading
            </Button>
          )}
          <Link to="/menu">
            <Button variant="primary">Back to Menu</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 space-y-6">
      {/* Screen-Only Header Navigation & Actions Bar (Hidden on Print) */}
      <div className="print:hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
          <div className="flex items-center gap-3">
            <Link
              to="/menu"
              className="p-2 rounded-2xl text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Back to Menu"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight flex items-center gap-2">
                <span>Digital Receipt</span>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                  #{order.order_number}
                </span>
              </h1>
              <p className="text-xs text-stone-500">
                Official digital order receipt for Coffee & Milk Tea Café
              </p>
            </div>
          </div>

          {/* Action Buttons: Download Receipt, Print Receipt, Back to Menu */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="secondary"
              onClick={handleDownloadReceipt}
              icon={<Download className="w-4 h-4" />}
              className="text-xs py-2 px-3.5"
            >
              {downloadSuccess ? 'Downloaded!' : 'Download Receipt'}
            </Button>
            <Button
              variant="secondary"
              onClick={handlePrint}
              icon={<Printer className="w-4 h-4" />}
              className="text-xs py-2 px-3.5"
            >
              Print Receipt
            </Button>
            <Link to="/menu">
              <Button variant="primary" className="text-xs py-2 px-3.5">
                Back to Menu
              </Button>
            </Link>
          </div>
        </div>

        {/* Demo Mode Notice Banner */}
        <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 space-y-0.5 flex-1">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold">Portfolio Demonstration Receipt</span>
              {paymentStatus === 'pending' && (
                <button
                  type="button"
                  onClick={() => setPaymentStatus('paid')}
                  className="text-[11px] font-bold text-amber-800 underline hover:text-amber-950 cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  Simulate Paid (Demo)
                </button>
              )}
            </div>
            <p className="text-amber-900/90 leading-relaxed">
              This order has been recorded with initial payment status <strong>PENDING</strong>.
              The ABA KHQR code below is generated from a safe demo payload with no banking or real payment connections.
            </p>
          </div>
        </div>
      </div>

      {/* Main Responsive Grid Layout (Desktop: Side-by-side; Mobile: Stacked; Print: Receipt First) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Bottom Standee: Reusable ABA KHQR Card (Screen interactive; Hidden or compact on paper) */}
        <div className="lg:col-span-5 order-2 lg:order-1 print:hidden">
          <AbaKhqrPayment
            orderNumber={order.order_number}
            amountUsd={order.total_usd}
            amountKhr={order.total_khr ?? usdToKhr(order.total_usd)}
            merchantName="Coffee & Milk Tea Café"
            customerName={order.customer_name}
            paymentStatus={paymentStatus}
            onSimulatePaid={() => setPaymentStatus('paid')}
          />
        </div>

        {/* Right / Main Digital Receipt Paper (Authentic Café Slip Aesthetic) */}
        <div className="lg:col-span-7 order-1 lg:order-2 w-full print:w-full print:max-w-none">
          <div
            id="printable-receipt"
            className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-md relative overflow-hidden font-sans print:border-none print:shadow-none print:p-0 print:m-0"
          >
            {/* Top Decorative Receipt Notch (Screen only) */}
            <div className="print:hidden absolute top-0 left-1/2 -translate-x-1/2 w-16 h-2 bg-stone-100 rounded-b-xl border-b border-stone-200/60" />

            {/* --- CAFÉ RECEIPT HEADER --- */}
            <div className="text-center space-y-1.5 pb-5 border-b-2 border-dashed border-stone-200">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto mb-2 print:border print:border-stone-400">
                <Coffee className="w-5 h-5 text-amber-800" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight uppercase">
                COFFEE & MILK TEA CAFÉ
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Artisan Brews & Handcrafted Milk Teas
              </p>
              <p className="text-[11px] text-stone-400">
                Street 214, BKK1, Phnom Penh, Cambodia • Tel: +855 23 999 888
              </p>
            </div>

            {/* --- ORDER & CUSTOMER METADATA --- */}
            <div className="py-4 border-b-2 border-dashed border-stone-200 text-xs sm:text-sm space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                  Order Number:
                </span>
                <span className="font-mono font-black text-stone-900 text-sm">
                  #{order.order_number}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                  Date:
                </span>
                <span className="font-medium text-stone-800">
                  {formatOrderDate(order.created_at)}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                  Customer Name:
                </span>
                <span className="font-bold text-stone-900">
                  {order.customer_name}
                </span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                  Customer Phone:
                </span>
                <span className="font-mono font-medium text-stone-800">
                  {order.customer_phone}
                </span>
              </div>
            </div>

            {/* --- ITEMS SECTION --- */}
            <div className="py-5 border-b-2 border-dashed border-stone-200 space-y-3">
              <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-wider text-stone-500 pb-1">
                <span>ITEMS</span>
                <span>PRICE</span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-stone-100">
                {(order.items || []).map((item, idx) => (
                  <div key={item.id || idx} className="py-3 first:pt-1 last:pb-0 text-xs sm:text-sm space-y-1">
                    <div className="flex justify-between items-start gap-3">
                      <div className="font-bold text-stone-900 flex-1">
                        <span className="text-stone-700 mr-1.5">{item.quantity}×</span>
                        <span>{item.product_name}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-black text-stone-900">
                          {formatUsd(item.subtotal_usd)}
                        </div>
                        <div className="text-[11px] text-stone-500">
                          {formatKhr(item.subtotal_usd)}
                        </div>
                      </div>
                    </div>

                    {/* Drink Customization breakdown: Size, Sugar, Ice, Unit Price */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-stone-500 pl-5">
                      <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 font-medium print:bg-transparent print:border print:border-stone-300">
                        Size: {item.size}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 font-medium print:bg-transparent print:border print:border-stone-300">
                        Sugar: {item.sugar_level}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 font-medium print:bg-transparent print:border print:border-stone-300">
                        Ice: {item.ice_level}
                      </span>
                      <span className="text-stone-400">
                        (@ {formatUsd(item.unit_price_usd)} each)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- SUBTOTAL & TOTALS (DUAL CURRENCY: USD & KHR) --- */}
            <div className="py-5 border-b-2 border-dashed border-stone-200 space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between items-baseline text-xs sm:text-sm text-stone-600">
                <span className="font-semibold uppercase tracking-wider text-[11px]">
                  Subtotal
                </span>
                <div className="text-right">
                  <span className="font-bold text-stone-900 text-sm">
                    {formatUsd(order.subtotal_usd)}
                  </span>
                  <span className="text-xs text-stone-500 ml-2">
                    {formatKhr(order.subtotal_usd)}
                  </span>
                </div>
              </div>

              {/* Total Due */}
              <div className="pt-2 border-t border-stone-100 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-black text-stone-900 uppercase tracking-wider block">
                    Total
                  </span>
                  <span className="text-[10px] text-stone-400">
                    Exchange: $1 = {formatKhr(1)}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-amber-950 tracking-tight leading-none print:text-black">
                    {formatUsd(order.total_usd)}
                  </div>
                  <div className="text-sm font-bold text-amber-800 mt-1 print:text-stone-800">
                    {formatKhr(order.total_usd)}
                  </div>
                </div>
              </div>
            </div>

            {/* --- PAYMENT METHOD & STATUS --- */}
            <div className="py-4 border-b-2 border-dashed border-stone-200 text-xs sm:text-sm space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                  Payment Method:
                </span>
                <span className="font-extrabold text-stone-900 flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${order.payment_method === 'cash' ? 'bg-emerald-600' : 'bg-[#004f71]'}`} />
                  {order.payment_method === 'cash' ? 'Cash on Pickup / Delivery' : 'ABA KHQR'}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-500 uppercase tracking-wider text-[11px] font-bold">
                  Payment Status:
                </span>
                {paymentStatus === 'pending' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-black text-xs uppercase tracking-wider border border-amber-300/80">
                    <Clock className="w-3.5 h-3.5 text-amber-800" />
                    PENDING
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs uppercase tracking-wider border border-emerald-300/80">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" />
                    PAID (DEMO ONLY)
                  </span>
                )}
              </div>
            </div>

            {/* --- SPECIAL INSTRUCTIONS / NOTES --- */}
            {order.notes && (
              <div className="py-3 border-b-2 border-dashed border-stone-200 text-xs">
                <span className="text-stone-500 uppercase tracking-wider text-[11px] font-bold block mb-1">
                  Special Instructions:
                </span>
                <span className="font-semibold text-stone-900 bg-amber-50/80 p-2.5 rounded-xl block border border-amber-200/60 leading-relaxed">
                  {order.notes}
                </span>
              </div>
            )}

            {/* --- PRINT / EMBEDDED MOCK KHQR SECTION --- */}
            {/* Displayed directly inside the receipt ticket for easy printing & compact review */}
            <div className="py-5 border-b-2 border-dashed border-stone-200 text-center space-y-3">
              <div className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Scan with ABA Mobile or Bakong (Demo)
              </div>

              {/* Reusable QR code standee embed */}
              <div className="max-w-[280px] mx-auto">
                <AbaKhqrPayment
                  orderNumber={order.order_number}
                  amountUsd={order.total_usd}
                  amountKhr={order.total_khr ?? usdToKhr(order.total_usd)}
                  merchantName="Coffee & Milk Tea Café"
                  customerName={order.customer_name}
                  paymentStatus={paymentStatus}
                  compact={true}
                  className="shadow-xs border border-stone-300"
                />
              </div>

              {/* Mandatory Prominent Label */}
              <div className="inline-block py-1 px-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-[11px] font-black uppercase tracking-wider">
                DEMO QR — NO REAL PAYMENT
              </div>
            </div>

            {/* --- CAFÉ RECEIPT FOOTER --- */}
            <div className="pt-5 text-center space-y-1 text-xs text-stone-400">
              <p className="font-bold text-stone-700">
                Thank you for ordering with Brew & Boba!
              </p>
              <p className="text-[11px]">
                Please present this receipt ticket or your order number when picking up your drinks.
              </p>
              <p className="text-[10px] text-stone-400 pt-1 font-mono">
                {order.order_number} • BREW-BOBA-BKK1
              </p>
            </div>
          </div>

          {/* Bottom Action Buttons (Screen Only) */}
          <div className="print:hidden mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="secondary"
              onClick={handleDownloadReceipt}
              icon={<Download className="w-4 h-4" />}
              className="w-full py-3"
            >
              {downloadSuccess ? 'Downloaded!' : 'Download PDF'}
            </Button>
            <Button
              variant="secondary"
              onClick={handlePrint}
              icon={<Printer className="w-4 h-4" />}
              className="w-full py-3"
            >
              Print Receipt
            </Button>
            <Link to="/orders" className="w-full">
              <Button variant="secondary" className="w-full py-3">
                Track Live Status
              </Button>
            </Link>
            <Link to="/menu" className="w-full">
              <Button variant="primary" className="w-full py-3">
                Order More Drinks
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
