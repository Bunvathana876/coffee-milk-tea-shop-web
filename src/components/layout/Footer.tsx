import React from 'react';
import { Coffee } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-950 text-stone-400 mt-16 pb-24 sm:pb-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-white">
            <span className="w-9 h-9 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center">
              <Coffee className="w-4 h-4" />
            </span>
            <span className="font-serif font-black text-lg">Brew &amp; Boba</span>
          </div>
          <p className="text-xs">Street 214, BKK1, Phnom Penh · Daily 7:00 AM – 8:30 PM</p>
          <p className="text-xs">
            <a href="tel:+85523999888" className="hover:text-amber-300 transition-colors">
              +855 23 999 888
            </a>
          </p>
        </div>

        <nav aria-label="Footer" className="flex items-center gap-6 text-sm font-semibold">
          <Link to="/menu" className="hover:text-amber-300 transition-colors">Menu</Link>
          <Link to="/orders" className="hover:text-amber-300 transition-colors">Orders</Link>
          <Link to="/cart" className="hover:text-amber-300 transition-colors">Cart</Link>
        </nav>
      </div>
      <div className="border-t border-stone-800 py-4 text-center text-[11px] text-stone-500">
        © 2026 Brew &amp; Boba Café
      </div>
    </footer>
  );
};
