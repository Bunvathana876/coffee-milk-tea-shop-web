import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, CupSoda, CheckCircle2, RotateCcw, Heart, ArrowUpDown } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import { CustomizationModal } from '../components/product/CustomizationModal';
import { ProductGridSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { useCart } from '../features/cart/useCart';
import { useFavorites } from '../features/favorites/useFavorites';
import type { Product, DrinkCustomization } from '../types';

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'name';

const pillClass = (active: boolean) =>
  `px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer active:scale-95 ${
    active
      ? 'bg-stone-950 text-white shadow-md'
      : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
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
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-950 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 ring-1 ring-white/10">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white p-1 cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <h1 className="text-3xl sm:text-5xl font-serif font-black text-stone-900 tracking-tight">Menu</h1>

      {/* Sticky search + filters */}
      <div className="sticky top-16 z-30 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-[#fbf9f5]/90 backdrop-blur-xl space-y-3 border-b border-stone-200/60">
        <div className="flex items-center gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search drinks"
              aria-label="Search drinks"
              className="w-full bg-white border border-stone-200 rounded-full pl-11 pr-10 py-3 text-sm focus:outline-none focus:border-stone-900 focus:ring-2 focus:ring-stone-900/10 transition-all [&::-webkit-search-cancel-button]:hidden"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="bg-white border border-stone-200 rounded-full pl-4 pr-9 py-3 text-sm font-bold text-stone-700 appearance-none cursor-pointer focus:outline-none focus:border-stone-900"
              aria-label="Sort drinks"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="name">A–Z</option>
            </select>
            <ArrowUpDown className="w-3.5 h-3.5 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none select-none" role="tablist" aria-label="Categories">
          <button type="button" role="tab" aria-selected={selectedCategory === 'All'} onClick={() => handleCategoryClick('All')} className={pillClass(selectedCategory === 'All')}>
            All
          </button>

          {catLoading
            ? [1, 2, 3, 4].map((i) => <div key={i} className="h-10 w-24 rounded-full bg-stone-200/60 animate-pulse shrink-0" />)
            : categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory.toLowerCase() === cat.name.toLowerCase()}
                  onClick={() => handleCategoryClick(cat.name)}
                  className={pillClass(selectedCategory.toLowerCase() === cat.name.toLowerCase())}
                >
                  {cat.name}
                </button>
              ))}

          <button type="button" role="tab" aria-selected={isFavFilter} onClick={() => handleCategoryClick('Favorites')} className={pillClass(isFavFilter)}>
            <Heart className={`w-3.5 h-3.5 ${isFavFilter ? 'fill-rose-400 text-rose-400' : 'text-rose-500'}`} />
            Saved
            {favoriteIds.length > 0 && <span className="text-xs opacity-70">{favoriteIds.length}</span>}
          </button>
        </div>
      </div>

      {prodLoading ? (
        <ProductGridSkeleton count={8} />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : displayedProducts.length === 0 ? (
        <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
          <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
            <CupSoda className="w-7 h-7 text-amber-800" />
          </div>
          <h3 className="font-serif font-black text-stone-900 text-lg">No drinks found</h3>
          <p className="text-sm text-stone-500">
            {isFavFilter && !searchQuery ? 'Tap the heart on a drink to save it.' : 'Try a different search or category.'}
          </p>
          {(searchQuery || selectedCategory !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                setSearchParams({});
              }}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-stone-950 text-white text-sm font-bold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={setCustomizingProduct} />
          ))}
        </div>
      )}

      <CustomizationModal
        product={customizingProduct}
        isOpen={!!customizingProduct}
        onClose={() => setCustomizingProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};
