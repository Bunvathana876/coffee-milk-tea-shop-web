import React, { useMemo } from 'react';
import {
  Smartphone,
  QrCode,
  Sparkles,
  Zap,
  ShieldCheck,
  CheckCircle2,
  BellRing,
} from 'lucide-react';
import { generateQrMatrix, matrixToSvgPath } from '../../utils/qrCode';

export const MobileAppSection: React.FC = () => {
  // Mobile app URL or local web/expo link
  const mobileLink = window.location.origin;

  // Generate QR code SVG path
  const qrSvg = useMemo(() => {
    try {
      const matrix = generateQrMatrix(mobileLink);
      return {
        path: matrixToSvgPath(matrix),
        size: matrix.length,
      };
    } catch {
      return null;
    }
  }, [mobileLink]);

  return (
    <section
      id="mobile-app"
      aria-labelledby="mobile-app-heading"
      className="relative rounded-[2.5rem] bg-gradient-to-br from-[#24130A] via-espresso-dark to-[#1A0D07] text-cream p-7 sm:p-12 lg:p-14 overflow-hidden shadow-2xl border border-espresso ring-1 ring-white/10"
    >
      {/* Warm ambient background lights */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-caramel/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-caramel/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column: Headline, App Perks & Store Badges */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-caramel/20 border border-caramel/30 text-caramel-soft font-bold text-xs uppercase tracking-wider">
            <Smartphone className="w-3.5 h-3.5 text-caramel" />
            <span>Connected Mobile Experience</span>
          </div>

          <div className="space-y-3">
            <h2
              id="mobile-app-heading"
              className="text-2xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-cream leading-[1.1]"
            >
              Order from Your Phone.
              <br />
              <span className="italic font-normal text-caramel-soft">Pick Up Fresh &amp; Steaming.</span>
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-cream/80 max-w-xl leading-relaxed">
              Download the <strong className="text-cream">Brew &amp; Boba Mobile App</strong> for iOS &amp; Android.
              Customize sugar percentages, scan Bakong KHQR in one tap, and get live notifications the moment your drink is ready at the counter.
            </p>
          </div>

          {/* 4 Key Mobile Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-caramel flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-cream">Skip Counter Queues</div>
                <div className="text-[11px] text-cream/70">Order 15 mins ahead during peak morning rush.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-cream">Instant Bakong KHQR</div>
                <div className="text-[11px] text-cream/70">Direct mobile banking checkout in USD or KHR.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 mt-0.5">
                <BellRing className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-cream">Live Barista Alerts</div>
                <div className="text-[11px] text-cream/70">Watch your order step from brewing to ready.</div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-300 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-xs text-cream">Synced Stamps Wallet</div>
                <div className="text-[11px] text-cream/70">Every 10th drink free, synced across web &amp; mobile.</div>
              </div>
            </div>
          </div>

          {/* App Platform Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-cream shadow-sm">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.87c.68-.83 1.15-1.99.98-3.15-1.01.05-2.23.68-2.93 1.5-.61.71-1.15 1.88-.98 3.01 1.12.09 2.25-.53 2.93-1.36z" />
              </svg>
              <span>Available for iOS</span>
            </div>

            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-cream shadow-sm">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a1.59 1.59 0 0 1-.61-.913V2.727c.15-.36.37-.67.61-.913zm11.235 11.236l2.18 2.18-12.723 7.34 10.543-9.52zm0-2.099L4.301 1.43l12.723 7.34-2.18 2.181zm1.092 1.05l3.208 1.85a1.644 1.644 0 0 1 0 2.846l-3.208 1.85-2.046-2.046 2.046-2.5z" />
              </svg>
              <span>Available for Android</span>
            </div>

            <div className="inline-flex items-center gap-1.5 text-xs text-caramel-soft font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Built with Flutter (clean arch)</span>
            </div>
          </div>
        </div>

        {/* Right Column: Scan to Launch / QR Code Showcase Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-full max-w-sm rounded-3xl bg-cream p-6 sm:p-7 text-espresso-dark shadow-2xl border border-white/20 space-y-5 text-center">
            {/* Header */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-caramel">
                <QrCode className="w-3.5 h-3.5" />
                <span>Instant Mobile Connect</span>
              </div>
              <h3 className="font-serif font-black text-xl text-ink">
                Scan with Your Camera
              </h3>
              <p className="text-xs text-ink-soft">
                Connect your smartphone directly to our café network.
              </p>
            </div>

            {/* High Precision QR Code */}
            <div className="p-4 bg-white rounded-2xl border border-line shadow-xs mx-auto w-fit flex items-center justify-center">
              {qrSvg ? (
                <svg
                  viewBox={`0 0 ${qrSvg.size} ${qrSvg.size}`}
                  className="w-44 h-44 sm:w-48 sm:h-48"
                  shapeRendering="crispEdges"
                >
                  <path d={qrSvg.path} fill="#20120B" />
                </svg>
              ) : (
                <div className="w-44 h-44 flex items-center justify-center text-caramel font-bold text-xs">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Sync Badge */}
            <div className="pt-2 border-t border-line/60 flex items-center justify-between text-xs font-bold text-ink-soft">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Backend Port 8000</span>
              </span>
              <span className="text-caramel font-black">Universal Sync</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
