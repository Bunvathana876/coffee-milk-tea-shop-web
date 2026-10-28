import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Clock,
  Phone,
  Navigation,
  Coffee,
  Wifi,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

const CAFE_IMAGE =
  'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&auto=format&fit=crop&q=80';

const AMENITIES = [
  { icon: <Wifi className="w-4 h-4 text-caramel" />, label: 'Fast Fiber Wi-Fi' },
  { icon: <Coffee className="w-4 h-4 text-caramel" />, label: 'Quiet Workspaces & Power Outlets' },
  { icon: <Sparkles className="w-4 h-4 text-caramel" />, label: 'Shaded Garden Terrace' },
  { icon: <ShieldCheck className="w-4 h-4 text-caramel" />, label: 'Motorbike & Bike Parking' },
];

export const VisitSection: React.FC = () => {
  // Google Maps search query link for the flagship location
  const googleMapsUrl =
    'https://www.google.com/maps/search/?api=1&query=Brew+and+Boba+Coffee+BKK1+Street+214+Phnom+Penh';

  return (
    <section
      id="visit"
      aria-labelledby="visit-heading"
      className="scroll-mt-24 rounded-[2.5rem] bg-white border border-line p-6 sm:p-10 lg:p-14 shadow-sm"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Location Details, Hours & Direct Action */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-caramel/15 border border-caramel/30 text-xs font-bold text-espresso">
              <MapPin className="w-3.5 h-3.5 text-caramel" />
              <span>Flagship Café &amp; Pickup Lab</span>
            </div>

            <h2
              id="visit-heading"
              className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight leading-[1.1]"
            >
              Come Visit Us in BKK1
            </h2>

            <p className="text-sm sm:text-base text-ink-soft leading-relaxed max-w-xl">
              Step in for a quiet single-origin pour-over, catch up with friends on our shaded patio, or pick up your mobile order in under 10 minutes.
            </p>
          </div>

          {/* Details Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Address */}
            <div className="rounded-2xl bg-cream p-4 sm:p-5 border border-line/70 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-caramel">
                <MapPin className="w-4 h-4" />
                <span>Our Address</span>
              </div>
              <p className="text-sm font-bold text-ink">
                #42, Street 214, Sangkat BKK1
              </p>
              <p className="text-xs text-ink-soft">
                Khan Chamkarmon, Phnom Penh, Cambodia
              </p>
            </div>

            {/* Hours */}
            <div className="rounded-2xl bg-cream p-4 sm:p-5 border border-line/70 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-caramel">
                <Clock className="w-4 h-4" />
                <span>Opening Hours</span>
              </div>
              <p className="text-sm font-bold text-ink">
                Daily: 7:00 AM – 9:00 PM
              </p>
              <p className="text-xs text-ink-soft">
                Kitchen last call at 8:45 PM
              </p>
            </div>
          </div>

          {/* Amenities strip */}
          <div className="pt-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft block mb-2.5">
              Café Amenities
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-semibold text-ink">
              {AMENITIES.map((amenity, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 rounded-xl bg-cream-deep/60 border border-line/50"
                >
                  {amenity.icon}
                  <span className="text-[11px] leading-tight">{amenity.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons: Get Directions & Call */}
          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-caramel hover:bg-caramel-soft text-espresso-dark font-black text-sm shadow-sm active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel focus-visible:ring-offset-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </a>

            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-cream-deep hover:bg-line text-ink font-bold text-sm border border-line active:scale-95 transition-all"
            >
              <span>Order for Pickup</span>
              <ArrowRight className="w-4 h-4 text-caramel" />
            </Link>

            <a
              href="tel:+85523999888"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-ink-soft hover:text-espresso transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-caramel" />
              <span>+855 23 999 888</span>
            </a>
          </div>
        </div>

        {/* Right: Premium Café Ambiance Photo */}
        <div className="lg:col-span-5 relative">
          <div className="relative aspect-[4/3] sm:aspect-[4/5] w-full rounded-3xl overflow-hidden shadow-md border border-line bg-cream-deep">
            <img
              src={CAFE_IMAGE}
              alt="Warm sunlit Brew and Boba café interior with natural wood tables and greenery"
              loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-espresso-dark/70 via-transparent to-transparent" />

            {/* Live Status Overlay Card */}
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-white/60 shadow-md flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <div>
                  <p className="font-bold text-xs text-ink">BKK1 Flagship Open</p>
                  <p className="text-[11px] text-ink-soft">Average pickup time: 10–12 mins</p>
                </div>
              </div>
              <span className="text-[11px] font-black text-caramel uppercase tracking-wider bg-cream-deep px-2.5 py-1 rounded-full border border-line">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

