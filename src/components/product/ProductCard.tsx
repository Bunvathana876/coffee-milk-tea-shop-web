import React, { useState } from 'react';
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
  const [imageError, setImageError] = useState(false);

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
      className={`group flex flex-col h-full focus-visible:outline-none transition-transform duration-300 ease-out ${
        product.is_available ? 'cursor-pointer hover:-translate-y-1' : 'cursor-not-allowed opacity-70'
      }`}
    >
      <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden bg-cream-deep border border-line/60 shadow-xs group-hover:shadow-lg group-hover:shadow-espresso/10 group-focus-visible:ring-2 group-focus-visible:ring-espresso group-focus-visible:ring-offset-2 transition-all duration-300">
        {product.image && !imageError ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-ink-soft/40 bg-cream-deep">
            <Coffee className="w-12 h-12 stroke-1" />
            <span className="text-xs font-semibold mt-1">Brew &amp; Boba</span>
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-espresso-dark/60 via-espresso-dark/20 to-transparent" />

        {/* Category Tag Badge */}
        {product.category_name && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-tight bg-white/90 backdrop-blur-md text-ink border border-white/60 shadow-2xs">
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
          aria-pressed={favorited}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center hover:scale-110 shadow-2xs transition-transform cursor-pointer border border-white/60"
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : 'text-ink-soft'}`} />
        </button>

        {product.is_available ? (
          <span className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white text-ink flex items-center justify-center shadow-md group-hover:bg-caramel group-hover:text-espresso-dark transition-all duration-200">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          </span>
        ) : (
          <div className="absolute inset-0 bg-espresso-dark/70 backdrop-blur-xs flex items-center justify-center">
            <span className="bg-white text-ink text-xs font-black px-4 py-1.5 rounded-full shadow-md">
              Sold out
            </span>
          </div>
        )}
      </div>

      <div className="pt-3 px-1 flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-ink text-base sm:text-lg leading-snug line-clamp-1 group-hover:text-espresso transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-ink-soft line-clamp-2 min-h-[2rem] leading-relaxed">
            {product.description || 'Handcrafted fresh to order with premium ingredients.'}
          </p>
        </div>
        <div className="pt-2 flex items-center justify-between border-t border-line/40 mt-1">
          <p className="text-sm font-black text-ink tabular-nums">
            {formatUsd(product.base_price_usd)}
            <span className="text-xs font-medium text-ink-soft ml-2">
              {formatKhr(product.base_price_usd)}
            </span>
          </p>
          <span className="text-[11px] font-bold text-caramel group-hover:text-espresso transition-colors">
            Customize
          </span>
        </div>
      </div>
    </article>
  );
};
