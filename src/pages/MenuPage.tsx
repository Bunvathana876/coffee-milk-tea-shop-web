import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  X,
  CupSoda,
  CheckCircle2,
  RotateCcw,
  Heart,
  ArrowUpDown,
  Sparkles,
} from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import { CustomizationModal } from '../components/product/CustomizationModal';
import { ProductGridSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { Button } from '../components/common/Button';
import { useCart } from '../features/cart/useCart';
import { useFavorites } from '../features/favorites/useFavorites';
import type { Product, DrinkCustomization } from '../types';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name';

const pillClass = (active: boolean) =>
  `px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer active:scale-95 min-h-[42px] sm:min-h-[44px] ${
    active
      ? 'bg-espresso text-cream shadow-md shadow-espresso/20 ring-1 ring-espresso'
      : 'bg-white/90 text-ink-soft hover:text-ink hover:bg-cream-deep border border-line shadow-2xs'
  }`;

export const MenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [sortBy, setSortBy] = useState<SortKey>('featured');
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { addItem } = useCart();
  const { categories, loading: catLoading } = useCategories();
  const { isFavorite, favoriteIds } = useFavorites();

  const isFavFilter = selectedCategory === 'Favorites';

  const { products, loading: prodLoading, error, refetch } = useProducts({
    category: selectedCategory === 'All' || isFavFilter ? undefined : selectedCategory,
    search: searchQuery || undefined,
    isAvailable: true,
  });

  // Live search: update the URL shortly after the user stops typing
  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === searchQuery) return;
    const t = setTimeout(() => {
      const next = new URLSearchParams(searchParams);
      if (trimmed) next.set('search', trimmed);
      else next.delete('search');
      setSearchParams(next, { replace: true });
    }, 350);
    return () => clearTimeout(t);
  }, [searchInput, searchQuery, searchParams, setSearchParams]);

  const displayedProducts = useMemo(() => {
    let list = isFavFilter ? products.filter((p) => isFavorite(p.id)) : products;
    if (sortBy === 'price-asc') list = [...list].sort((a, b) => a.base_price_usd - b.base_price_usd);
    else if (sortBy === 'price-desc') list = [...list].sort((a, b) => b.base_price_usd - a.base_price_usd);
    else if (sortBy === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, isFavFilter, isFavorite, sortBy]);

  const handleCategoryClick = (catName: string) => {
    const next = new URLSearchParams(searchParams);
    if (catName === 'All') next.delete('category');
    else next.set('category', catName);
    setSearchParams(next);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    const next = new URLSearchParams(searchParams);
    next.delete('search');
    setSearchParams(next);
  };

  const handleAddToCart = (product: Product, customization: DrinkCustomization) => {
    addItem({
      productId: product.id,
      productName: product.name,
      image: product.image,
      size: customization.size,
      sugarLevel: customization.sugar_level,
      iceLevel: customization.ice_level,
      toppings: customization.toppings || [],
      unitPriceUsd: customization.unit_price_usd,
      quantity: customization.quantity,
    });
    setToastMessage(`Added ${customization.quantity}× ${product.name}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-6 right-6 z-50 bg-espresso-dark text-cream px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 ring-1 ring-white/10 border border-espresso/30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-cream/70 hover:text-cream p-1 cursor-pointer transition-colors"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Area */}
      <div className="space-y-1.5 pt-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-caramel uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-caramel" />
          <span>Artisan Drink Selection</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-ink tracking-tight">
            Drink Menu
          </h1>
          <span className="text-xs sm:text-sm text-ink-soft font-medium">
            Showing {displayedProducts.length} {displayedProducts.length === 1 ? 'drink' : 'drinks'}
          </span>
        </div>
      </div>

      {/* Sticky Search & Category Bar */}
      <div className="sticky top-16 sm:top-18 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3.5 bg-cream/90 backdrop-blur-xl space-y-3 border-b border-line/70 shadow-2xs">
        <div className="flex items-center gap-2.5">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-soft/60 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search coffee, boba, matcha, fruit tea..."
              aria-label="Search drinks"
              className="w-full bg-white/90 border border-line rounded-full pl-11 pr-10 py-2.5 sm:py-3 text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-caramel focus:ring-2 focus:ring-caramel/20 shadow-2xs transition-all [&::-webkit-search-cancel-button]:hidden"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink p-0.5 cursor-pointer transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="bg-white/90 border border-line rounded-full pl-4 pr-9 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-ink hover:border-caramel focus:outline-none focus:border-caramel focus:ring-2 focus:ring-caramel/20 cursor-pointer shadow-2xs transition-all appearance-none"
              aria-label="Sort drinks"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name A–Z</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-ink-soft absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Categories Scroller */}
        <div
          className="flex items-center gap-2 overflow-x-auto scrollbar-none select-none py-0.5"
          role="tablist"
          aria-label="Categories"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === 'All'}
            onClick={() => handleCategoryClick('All')}
            className={pillClass(selectedCategory === 'All')}
          >
            All Drinks
          </button>

          {catLoading
            ? [1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-10 w-24 sm:w-28 rounded-full bg-cream-deep animate-pulse shrink-0 border border-line/50"
                />
              ))
            : categories.map((cat) => {
                const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={pillClass(isSelected)}
                  >
                    <span>{cat.name}</span>
                    {cat.product_count !== null && cat.product_count !== undefined && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isSelected ? 'bg-espresso-dark text-caramel-soft' : 'bg-cream-deep text-ink-soft'
                        }`}
                      >
                        {cat.product_count}
                      </span>
                    )}
                  </button>
                );
              })}

          {/* Saved / Favorites Pill */}
          <button
            type="button"
            role="tab"
            aria-selected={isFavFilter}
            onClick={() => handleCategoryClick('Favorites')}
            className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer active:scale-95 min-h-[42px] sm:min-h-[44px] ${
              isFavFilter
                ? 'bg-rose-600 text-white shadow-md shadow-rose-950/20 ring-1 ring-rose-600'
                : 'bg-white/90 text-ink-soft hover:text-ink hover:bg-cream-deep border border-line shadow-2xs'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavFilter ? 'fill-white text-white' : 'text-rose-500 fill-rose-500'}`} />
            <span>Saved</span>
            {favoriteIds.length > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isFavFilter ? 'bg-rose-700 text-rose-100' : 'bg-rose-50 text-rose-600'
                }`}
              >
                {favoriteIds.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filter Helper Strip */}
      {(selectedCategory !== 'All' || searchQuery) && (
        <div className="flex items-center justify-between text-xs text-ink-soft bg-cream-deep/70 px-4 py-2.5 rounded-2xl border border-line/60">
          <div className="flex flex-wrap items-center gap-2 font-medium">
            <span>Filtering by:</span>
            {selectedCategory !== 'All' && (
              <span className="font-bold text-ink bg-white px-2.5 py-0.5 rounded-full border border-line shadow-2xs">
                {selectedCategory}
              </span>
            )}
            {searchQuery && (
              <span className="font-bold text-ink bg-white px-2.5 py-0.5 rounded-full border border-line shadow-2xs">
                "{searchQuery}"
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchInput('');
              setSearchParams({});
            }}
            className="text-xs font-bold text-espresso hover:text-espresso-dark hover:underline cursor-pointer shrink-0 ml-2"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Product List Content */}
      {prodLoading ? (
        <ProductGridSkeleton count={8} />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : displayedProducts.length === 0 ? (
        <div className="py-16 text-center space-y-4 max-w-sm mx-auto bg-white/70 rounded-3xl border border-line/70 p-8 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-cream-deep text-espresso flex items-center justify-center mx-auto shadow-inner">
            <CupSoda className="w-8 h-8 text-espresso" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-black text-ink text-xl">No drinks found</h3>
            <p className="text-xs sm:text-sm text-ink-soft">
              {isFavFilter && !searchQuery
                ? "You haven't saved any favorite drinks yet. Tap the heart on any drink to add it!"
                : searchQuery
                ? `No drinks match "${searchQuery}". Try searching for coffee, latte, or boba.`
                : 'No drinks are currently available in this category.'}
            </p>
          </div>
          {(searchQuery || selectedCategory !== 'All') && (
            <div className="pt-2">
              <Button
                variant="primary"
                onClick={() => {
                  setSearchInput('');
                  setSearchParams({});
                }}
                icon={<RotateCcw className="w-4 h-4" />}
              >
                Reset all filters
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setCustomizingProduct}
            />
          ))}
        </div>
      )}

      {/* Customization Modal */}
      <CustomizationModal
        product={customizingProduct}
        isOpen={!!customizingProduct}
        onClose={() => setCustomizingProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};
