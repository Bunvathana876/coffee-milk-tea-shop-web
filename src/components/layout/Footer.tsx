import React from 'react';
import { Coffee, MapPin, Clock, Phone, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-300 mt-auto border-t border-stone-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="space-y-3.5 md:col-span-2">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-2xl bg-amber-900 flex items-center justify-center text-amber-200 shadow-md shadow-amber-950/40">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <span className="font-black text-lg block leading-tight">Brew & Boba Café</span>
                <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                  Artisan Coffee & Craft Boba <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                </span>
              </div>
            </div>
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Handcrafted specialty coffees, slow-brewed milk teas, and fresh fruit infusions.
              Custom-crafted to order in Phnom Penh, Cambodia.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs text-amber-300 font-bold">
              <span className="px-2.5 py-1 rounded-xl bg-amber-950/80 border border-amber-800/40">
                USD ($) & KHR (៛)
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-amber-950/80 border border-amber-800/40">
                ABA KHQR Supported
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-200">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/" className="text-stone-400 hover:text-amber-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-stone-400 hover:text-amber-300 transition-colors">
                  Drink Menu
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-stone-400 hover:text-amber-300 transition-colors">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="text-stone-400 hover:text-amber-300 transition-colors">
                  Checkout
                </Link>
              </li>
            </ul>
          </div>

          {/* Café Info */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-stone-200">
              Café Hours & Info
            </h4>
            <div className="space-y-2.5 text-xs text-stone-400 font-medium">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Daily: 7:00 AM – 8:30 PM</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Street 214, BKK1, Phnom Penh</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>+855 (0) 23 999 888</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <p>© 2026 Brew & Boba Café. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for coffee & tea lovers
          </p>
        </div>
      </div>
    </footer>
  );
};
