import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, Coffee, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { getProducts } from '../../services/api';
import { formatUsd, formatKhr } from '../../config/currency';
import type { Product } from '../../types';

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

const POPULAR_SEARCHES = [
  'Brown Sugar Boba',
  'Matcha Latte',
  'Caramel Macchiato',
  'Espresso',
  'Taro Milk Tea',
  'Cold Brew',
];

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    getProducts({ isAvailable: true })
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setProducts([]);
          setLoading(false);
        }
      });

    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen]);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category_name && p.category_name.toLowerCase().includes(q))
    );
  }, [products, query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-espresso-dark/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-[2rem] border border-line shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Bar Input */}
        <div className="p-4 sm:p-5 border-b border-line flex items-center gap-3 bg-cream">
          <Search className="w-5 h-5 text-caramel shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search espresso, boba teas, matcha, syrups..."
            className="flex-1 bg-transparent text-sm sm:text-base font-medium text-ink placeholder:text-ink-soft/60 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-ink-soft hover:text-ink cursor-pointer"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <span className="hidden sm:inline text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-white border border-line text-ink-soft">
              ESC
            </span>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-5 py-3 border-b border-line/60 bg-cream-deep/40 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="font-bold text-ink-soft shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-caramel" />
            Popular:
          </span>
          {POPULAR_SEARCHES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setQuery(item)}
              className="px-2.5 py-1 rounded-full bg-white border border-line hover:border-caramel/50 text-ink-soft hover:text-ink text-xs font-medium shrink-0 transition-colors cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="p-4 sm:p-5 max-h-[55vh] overflow-y-auto space-y-2">
          {loading ? (
            <div className="py-12 text-center text-ink-soft flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-caramel" />
              <p className="text-xs font-medium">Brewing drink results...</p>
            </div>
          ) : query.trim() === '' ? (
            <div className="py-10 text-center space-y-2 text-ink-soft">
              <div className="w-12 h-12 rounded-2xl bg-cream-deep text-caramel flex items-center justify-center mx-auto border border-line">
                <Coffee className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-ink">
                Type above to explore handcrafted beverages
              </p>
              <p className="text-xs text-ink-soft">
                Find drinks by flavor, milk options, sweetness, or toppings
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-10 text-center space-y-2 text-ink-soft">
              <p className="text-sm font-bold text-ink">No drinks match "{query}"</p>
              <p className="text-xs">
                Try searching for common terms like "espresso", "milk tea", or "matcha"
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  onSelectProduct(product);
                  onClose();
                }}
                className="group flex items-center justify-between p-3 rounded-2xl hover:bg-cream-deep/70 border border-transparent hover:border-line transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover shrink-0 border border-line shadow-2xs group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-cream-deep text-caramel flex items-center justify-center shrink-0 border border-line">
                      <Coffee className="w-6 h-6" />
                    </div>
                  )}

                  <div className="space-y-0.5 truncate">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-bold text-sm sm:text-base text-ink group-hover:text-espresso truncate">
                        {product.name}
                      </h4>
                      {product.category_name && (
                        <span className="px-2 py-0.2 rounded-md bg-cream text-ink-soft text-[10px] font-bold border border-line">
                          {product.category_name}
                        </span>
                      )}
                    </div>
                    {product.description && (
                      <p className="text-xs text-ink-soft truncate max-w-md">
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 pl-3">
                  <div className="text-right">
                    <div className="font-serif font-black text-ink text-sm sm:text-base leading-tight">
                      {formatUsd(product.base_price_usd)}
                    </div>
                    <div className="text-[11px] text-caramel font-medium">
                      {formatKhr(product.base_price_usd)}
                    </div>
                  </div>

                  <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-caramel text-espresso-dark font-black text-xs shadow-2xs group-hover:bg-caramel-soft transition-colors">
                    <span>Customize</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Bottom Bar */}
        <div className="p-3 bg-cream px-6 border-t border-line flex items-center justify-between text-xs text-ink-soft">
          <span>{products.length} artisan drinks on menu</span>
          <button
            type="button"
            onClick={handleClose}
            className="font-bold text-caramel hover:text-espresso cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
