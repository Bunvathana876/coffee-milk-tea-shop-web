import React from 'react';
import { Plus, Coffee, Heart } from 'lucide-react';
import type { Product } from '../../types';
import { formatUsd, formatKhr } from '../../config/currency';
import { useFavorites } from '../../features/favorites/useFavorites';

export interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(product.id);

  const handleCardClick = () => {
    if (product.is_available && onSelect) {
      onSelect(product);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && product.is_available && onSelect) {
      e.preventDefault();
      onSelect(product);
    }
  };

  return (
    <div
      tabIndex={product.is_available ? 0 : -1}
      role="button"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      aria-label={`Select and customize ${product.name}, priced at ${formatUsd(product.base_price_usd)}`}
      className={`group bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
        product.is_available
          ? 'cursor-pointer hover:border-amber-300'
          : 'cursor-not-allowed opacity-80'
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 relative`}
    >
      {/* Product Image Section */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden select-none">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300 bg-amber-50/40">
            <Coffee className="w-12 h-12 text-stone-300" />
          </div>
        )}

        {/* Ambient Gradient on bottom of image for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Category Tag */}
        {product.category_name && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-amber-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-xs border border-white/80">
            {product.category_name}
          </span>
        )}

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          aria-label={favorited ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-rose-500 hover:scale-110 shadow-xs border border-white/80 transition-all cursor-pointer z-10"
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : 'text-stone-400'}`} />
        </button>

        {/* Sold Out Overlay */}
        {!product.is_available && (
          <div className="absolute inset-0 bg-stone-900/65 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-stone-900 text-white text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content & Details Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-1">
          <h3 className="font-extrabold text-stone-900 text-base leading-snug group-hover:text-amber-900 transition-colors line-clamp-1">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        {/* Pricing & Add Button Footer */}
        <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-base font-black text-amber-950 tracking-tight leading-none">
              {formatUsd(product.base_price_usd)}
            </div>
            <div className="text-[11px] font-bold text-stone-400 mt-1">
              {formatKhr(product.base_price_usd)}
            </div>
          </div>

          <button
            type="button"
            disabled={!product.is_available}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            aria-label={`Customize ${product.name}`}
            className="w-10 h-10 rounded-2xl bg-amber-900 hover:bg-amber-950 text-white flex items-center justify-center shadow-sm shadow-amber-950/20 active:scale-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
