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

  const open = () => {
    if (product.is_available && onSelect) onSelect(product);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && product.is_available && onSelect) {
      e.preventDefault();
      onSelect(product);
    }
  };

  return (
    <article
      tabIndex={product.is_available ? 0 : -1}
      role="button"
      onClick={open}
      onKeyDown={handleKeyDown}
      aria-label={`Customize ${product.name}, ${formatUsd(product.base_price_usd)}`}
      className={`group flex flex-col focus-visible:outline-none ${
        product.is_available ? 'cursor-pointer' : 'cursor-not-allowed opacity-70'
      }`}
    >
      <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-amber-50 shadow-sm group-hover:shadow-xl group-focus-visible:ring-2 group-focus-visible:ring-amber-900 transition-shadow duration-300">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-amber-900/30">
            <Coffee className="w-12 h-12 stroke-1" />
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-stone-950/40 to-transparent" />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          aria-label={favorited ? `Remove ${product.name} from favorites` : `Add ${product.name} to favorites`}
          aria-pressed={favorited}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : 'text-stone-500'}`} />
        </button>

        {product.is_available ? (
          <span className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white text-stone-950 flex items-center justify-center shadow-lg group-hover:bg-amber-400 transition-colors">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </span>
        ) : (
          <div className="absolute inset-0 bg-stone-950/60 flex items-center justify-center">
            <span className="bg-white text-stone-900 text-xs font-black px-4 py-1.5 rounded-full">
              Sold out
            </span>
          </div>
        )}
      </div>

      <div className="pt-3 px-1 space-y-0.5">
        <h3 className="font-serif font-bold text-stone-900 text-base sm:text-lg leading-snug line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-stone-500 line-clamp-1">
          {product.category_name}
        </p>
        <p className="text-sm font-black text-stone-950 pt-1">
          {formatUsd(product.base_price_usd)}
          <span className="text-xs font-semibold text-stone-500 ml-2">
            {formatKhr(product.base_price_usd)}
          </span>
        </p>
      </div>
    </article>
  );
};
