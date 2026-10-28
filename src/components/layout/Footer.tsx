import React from 'react';
import {
  Coffee,
  MapPin,
  Phone,
  Clock,
  QrCode,
  Heart,
  Mail,
  ArrowUp,
  Send,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-espresso-dark text-cream/80 mt-16 sm:mt-24 pb-24 border-t border-espresso" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>

      {/* Top Banner Accent Strip */}
      <div className="bg-espresso py-2.5 px-4 border-b border-white/5 text-xs text-cream/90">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[11px] sm:text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-cream">Flagship Café &amp; Pickup Lab</span>
            <span className="text-cream/40">·</span>
            <span className="text-cream/70">BKK1, Street 214, Phnom Penh</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-caramel-soft">
            <span className="flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-caramel" />
              Bakong KHQR Instant Checkout
            </span>
            <span className="hidden sm:inline text-cream/30">·</span>
            <span className="hidden sm:inline">Zero Artificial Creamers Pledge</span>
          </div>
        </div>
      </div>

      {/* Main Footer Columns */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10">
          {/* Column 1: Brand Bio & Values */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-caramel text-espresso-dark flex items-center justify-center font-bold shadow-sm">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif font-black text-xl text-cream tracking-tight block leading-tight">
                  Brew &amp; Boba
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-caramel">
                  Artisanal Coffee &amp; Tea Lab
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-cream/75 leading-relaxed max-w-sm">
              Crafting specialty single-origin coffees from Mondulkiri and 90-minute slow-simmered muscovado boba daily in Phnom Penh. Dialed in to your exact taste.
            </p>

            {/* Social Links */}
            <div className="pt-1 flex items-center gap-2.5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Brew & Boba on Instagram"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-caramel hover:text-espresso-dark text-cream/70 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Brew & Boba on Facebook"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-caramel hover:text-espresso-dark text-cream/70 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Join Brew & Boba on Telegram"
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-caramel hover:text-espresso-dark text-cream/70 flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Menu Links */}
          <div className="md:col-span-3 space-y-3">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-caramel">
              Explore Menu
            </h3>
            <nav aria-label="Footer Menu" className="flex flex-col space-y-2 text-xs sm:text-sm text-cream/75">
              <Link to="/menu?category=Coffee" className="hover:text-cream transition-colors">
                Handcrafted Espresso
              </Link>
              <Link to="/menu?category=Milk%20Tea" className="hover:text-cream transition-colors">
                Signature Brown Sugar Boba
              </Link>
              <Link to="/menu?category=Matcha" className="hover:text-cream transition-colors">
                Ceremonial Uji Matcha
              </Link>
              <Link to="/menu" className="hover:text-cream transition-colors font-semibold text-caramel-soft">
                View Full Menu →
              </Link>
            </nav>
          </div>

          {/* Column 3: Hours & Flagship Location */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="text-xs uppercase font-extrabold tracking-wider text-caramel">
              Flagship Café &amp; Hours
            </h3>
            <div className="space-y-2 text-xs sm:text-sm text-cream/75">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-caramel shrink-0 mt-0.5" />
                <span>#42, Street 214, Sangkat Boeng Keng Kang 1 (BKK1), Phnom Penh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-caramel shrink-0" />
                <span>Daily: 7:00 AM – 9:00 PM (Last call 8:45 PM)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-caramel shrink-0" />
                <a href="tel:+85523999888" className="hover:text-cream transition-colors">
                  +855 23 999 888
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-caramel shrink-0" />
                <a href="mailto:hello@brewandboba.com" className="hover:text-cream transition-colors">
                  hello@brewandboba.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back-to-Top */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/50">
          <p>© 2026 Brew &amp; Boba Café Co. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-cream/60">
              <span>Crafted with</span>
              <Heart className="w-3.5 h-3.5 text-caramel fill-caramel" />
              <span>in Phnom Penh, Cambodia</span>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 text-cream/70 hover:text-cream text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-caramel"
              aria-label="Scroll back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
