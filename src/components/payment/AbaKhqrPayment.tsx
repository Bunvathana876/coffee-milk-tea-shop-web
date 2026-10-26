import React, { useMemo, useState } from 'react';
import {
  ShieldAlert,
  Copy,
  Check,
  Clock,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { formatUsd, formatKhr, usdToKhr } from '../../config/currency';
import { generateQrMatrix, matrixToSvgPath } from '../../utils/qrCode';

export interface AbaKhqrPaymentProps {
  /** The generated order reference number, e.g. CAF-20261008-0001 */
  orderNumber?: string;
  /** Primary order amount in USD */
  amountUsd: number;
  /** Secondary order amount in KHR (defaults to automatic conversion) */
  amountKhr?: number;
  /** Merchant name displayed on KHQR standee (default: "Coffee & Milk Tea Café") */
  merchantName?: string;
  /** Customer's name if available */
  customerName?: string;
  /** Current payment status (defaults to 'pending') */
  paymentStatus?: 'pending' | 'paid' | 'failed' | string;
  /** Callback when user clicks simulate demo payment */
  onSimulatePaid?: () => void;
  /** Optional container class name */
  className?: string;
  /** Render compact layout for sidebars or modals */
  compact?: boolean;
}

export const AbaKhqrPayment: React.FC<AbaKhqrPaymentProps> = ({
  orderNumber = 'DEMO-ORDER',
  amountUsd,
  amountKhr,
  merchantName = 'Coffee & Milk Tea Café',
  customerName,
  paymentStatus = 'pending',
  onSimulatePaid,
  className = '',
  compact = false,
}) => {
  const [copied, setCopied] = useState(false);

  // Compute KHR if not directly provided
  const computedKhr = useMemo(() => {
    return amountKhr ?? usdToKhr(amountUsd);
  }, [amountKhr, amountUsd]);

  // Generate safe demo-only payload containing strictly synthetic data
  const demoPayload = useMemo(() => {
    const params = new URLSearchParams({
      format: 'DEMO-KHQR',
      merchant: merchantName,
      order: orderNumber,
      amount_usd: amountUsd.toFixed(2),
      amount_khr: String(computedKhr),
      demo_notice: 'DEMO_QR_NO_REAL_PAYMENT',
    });
    return `khqr-demo://mock-pay?${params.toString()}`;
  }, [merchantName, orderNumber, amountUsd, computedKhr]);

  // Generate QR matrix and SVG path
  const { svgPath, matrixSize } = useMemo(() => {
    try {
      const matrix = generateQrMatrix(demoPayload);
      return {
        svgPath: matrixToSvgPath(matrix),
        matrixSize: matrix.length,
      };
    } catch {
      // Fallback matrix if encoding fails
      const fallback = generateQrMatrix('DEMO-KHQR://NO-REAL-PAYMENT');
      return {
        svgPath: matrixToSvgPath(fallback),
        matrixSize: fallback.length,
      };
    }
  }, [demoPayload]);

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(demoPayload).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isPending = paymentStatus.toLowerCase() === 'pending';
  const isPaid = paymentStatus.toLowerCase() === 'paid';

  return (
    <div
      className={`bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-lg transition-all ${
        compact ? 'p-4' : 'p-5 sm:p-7'
      } ${className}`}
      data-testid="aba-khqr-payment"
    >
      {/* KHQR Card Wrapper with authentic red/navy header styling */}
      <div className="relative rounded-2xl bg-gradient-to-b from-[#004f71] to-[#003750] text-white p-5 sm:p-6 shadow-md overflow-hidden">
        {/* Subtle decorative background watermarks */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -left-6 -top-6 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

        {/* Top Header: Authentic KHQR Red Badge & ABA Brand */}
        <div className="flex items-center justify-between pb-4 border-b border-white/15">
          <div className="flex items-center gap-2">
            {/* Cambodian KHQR Badge */}
            <div className="bg-[#e1251b] text-white px-2.5 py-1 rounded-lg font-black tracking-wider text-xs shadow-xs flex items-center gap-1">
              <span>KHQR</span>
            </div>
            <span className="font-bold text-sm tracking-wide text-white/95">
              ABA KHQR
            </span>
          </div>

          {/* Individual Order Reference Badge */}
          <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md bg-white/10 text-white/90">
            {orderNumber}
          </span>
        </div>

        {/* Merchant & Customer Info */}
        <div className="pt-3 pb-2 text-center space-y-0.5">
          <p className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">
            Merchant
          </p>
          <h3 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
            {merchantName}
          </h3>
          {customerName && (
            <p className="text-[11px] text-white/80">
              Customer: <span className="font-medium text-white">{customerName}</span>
            </p>
          )}
        </div>

        {/* Dual Currency Amount Display */}
        <div className="my-3 py-2.5 px-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 text-center space-y-0.5">
          <div className="flex items-baseline justify-center gap-1.5">
            <span className="text-xs uppercase tracking-wider text-white/75 font-bold">
              Amount:
            </span>
            <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {formatUsd(amountUsd)}
            </span>
          </div>
          <div className="text-xs sm:text-sm font-bold text-amber-300">
            KHR: {formatKhr(amountUsd)}
          </div>
        </div>

        {/* QR Code Presentation Box */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 my-3 shadow-inner text-stone-900 flex flex-col items-center relative">
          {/* Scanner Corner Alignment Guides */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#004f71] rounded-tl-sm pointer-events-none" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#004f71] rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#004f71] rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#004f71] rounded-br-sm pointer-events-none" />

          {/* Crisp Scalable Vector QR Code with Safe Demo Payload */}
          <div className={`relative ${compact ? 'w-36 h-36' : 'w-48 h-48 sm:w-56 sm:h-56'} flex items-center justify-center p-2 bg-white`}>
            <svg
              viewBox={`0 0 ${matrixSize} ${matrixSize}`}
              className="w-full h-full text-stone-950"
              shapeRendering="crispEdges"
              role="img"
              aria-label="ABA KHQR Demo Code"
            >
              <rect width={matrixSize} height={matrixSize} fill="white" />
              <path d={svgPath} fill="currentColor" />
            </svg>

            {/* Central KHQR Emblem Overlay */}
            <div className={`absolute inset-0 m-auto ${compact ? 'w-8 h-8' : 'w-11 h-11'} rounded-xl bg-[#e1251b] border-2 border-white shadow-md flex flex-col items-center justify-center text-white font-black leading-none pointer-events-none`}>
              <span className={`${compact ? 'text-[6px]' : 'text-[8px]'} tracking-tighter`}>KHQR</span>
              <span className={`${compact ? 'text-[8px]' : 'text-[10px]'} font-bold`}>៛ / $</span>
            </div>
          </div>

          {/* Prominent High-Visibility Warning Banner */}
          <div className="mt-3 w-full py-1.5 px-3 rounded-lg bg-rose-50 border border-rose-300 text-rose-800 text-center">
            <div className="flex items-center justify-center gap-1.5 font-black text-[11px] sm:text-xs tracking-wider uppercase">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>DEMO QR — NO REAL PAYMENT</span>
            </div>
          </div>
        </div>

        {/* Initial Payment Status: Clearly displayed as PENDING */}
        <div className="pt-2 flex items-center justify-between text-xs border-t border-white/15">
          <span className="text-white/70 font-medium">Payment Status:</span>
          {isPending ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 font-extrabold uppercase tracking-wider text-[11px] border border-amber-300/30">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <Clock className="w-3 h-3" />
              PENDING
            </span>
          ) : isPaid ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold uppercase tracking-wider text-[11px] border border-emerald-400/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              PAID (DEMO ONLY)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold uppercase tracking-wider text-[11px]">
              {paymentStatus}
            </span>
          )}
        </div>
      </div>

      {/* Safety Notice & Demo Controls (Hidden when printed or in compact mode) */}
      {!compact && (
        <div className="mt-4 space-y-3 print:hidden">
          <p className="text-[11px] text-stone-500 leading-relaxed text-center">
            This is a simulated QR code with mock metadata for demonstration and portfolio testing.
            It does not connect to real banking APIs, nor charge real currency.
          </p>

          {/* Interactive Demo Actions for Testing/Evaluation */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            {/* Copy Demo Payload */}
            <button
              type="button"
              onClick={handleCopyPayload}
              className="w-full sm:flex-1 py-2 px-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Inspect demo payload string"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied Demo Payload!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-stone-500" />
                  <span>Copy Demo Payload</span>
                </>
              )}
            </button>

            {/* Optional Simulate Mock Scan Callback */}
            {onSimulatePaid && isPending && (
              <button
                type="button"
                onClick={onSimulatePaid}
                className="w-full sm:flex-1 py-2 px-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Simulate Scan (Demo)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
