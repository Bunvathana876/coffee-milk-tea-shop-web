import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, CupSoda, CheckCircle2, RotateCcw, Heart } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import { CustomizationModal } from '../components/product/CustomizationModal';
import { ProductGridSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { useCart } from '../features/cart/useCart';
import { useFavorites } from '../features/favorites/useFavorites';
import { useAuth } from '../features/auth/AuthContext';
import type { Product, DrinkCustomization } from '../types';

export const MenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const [searchInput, setSearchInput] = useState(searchQuery);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { addItem } = useCart();
  const { categories, loading: catLoading } = useCategories();
  const { isFavorite, favoriteIds } = useFavorites();
  const { isAuthenticated, openAuthModal } = useAuth();

  const isFavFilter = selectedCategory === 'Favorites';

  const { products, loading: prodLoading, error, refetch } = useProducts({
    category: selectedCategory === 'All' || isFavFilter ? undefined : selectedCategory,
    search: searchQuery || undefined,
    isAvailable: true,
  });

  const displayedProducts = isFavFilter
    ? products.filter((p) => isFavorite(p.id))
    : products;

  const handleCategoryClick = (catName: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (catName === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', catName);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newParams.set('search', searchInput.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
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

    setToastMessage(
      `Added ${customization.quantity}x ${product.name} to your cart!`
    );
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-stone-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-white p-1 ml-auto cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
            Café Drink Menu
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Handcrafted espresso beverages, milk teas, and fruit infusions
          </p>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search drinks (e.g. latte, boba)..."
            className="w-full bg-white border border-stone-200 rounded-2xl pl-10 pr-9 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-amber-800 focus:ring-2 focus:ring-amber-800/20 transition-all shadow-2xs"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-3 text-stone-400 hover:text-stone-700 cursor-pointer"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Sign-in prompt banner for unauthenticated customers */}
      {!isAuthenticated && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-900 to-amber-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
          <div className="space-y-0.5">
            <h4 className="text-xs sm:text-sm font-black flex items-center gap-1.5">
              <span>Sign in or register before buying coffee or tea</span>
            </h4>
            <p className="text-[11px] text-amber-200/80">
              Don't have an account? Register in 10 seconds to buy drinks, earn loyalty stamps, and track orders!
            </p>
          </div>
          <button
            type="button"
            onClick={openAuthModal}
            className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black shrink-0 transition-colors cursor-pointer"
          >
            Sign In / Register
          </button>
        </div>
      )}

      {/* Category Filter Pills (Horizontal scroll on mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
        <button
          type="button"
          onClick={() => handleCategoryClick('All')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
            selectedCategory === 'All'
              ? 'bg-amber-900 text-white shadow-md shadow-amber-950/20'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/90'
          }`}
        >
          All Drinks
        </button>

        {/* Favorites Pill */}
        <button
          type="button"
          onClick={() => handleCategoryClick('Favorites')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer active:scale-95 ${
            selectedCategory === 'Favorites'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-950/20'
              : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/90'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${selectedCategory === 'Favorites' ? 'fill-white text-white' : 'text-rose-500 fill-rose-500'}`} />
          <span>Favorites</span>
          {favoriteIds.length > 0 && (
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                selectedCategory === 'Favorites'
                  ? 'bg-rose-700 text-rose-100'
                  : 'bg-rose-50 text-rose-600'
              }`}
            >
              {favoriteIds.length}
            </span>
          )}
        </button>

        {catLoading ? (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-9 w-24 sm:w-28 rounded-2xl bg-stone-200/60 animate-pulse shrink-0"
              />
            ))}
          </>
        ) : (
          categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.name)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer active:scale-95 ${
                  isSelected
                    ? 'bg-amber-900 text-white shadow-md shadow-amber-950/20'
                    : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200/90'
                }`}
              >
                <span>{cat.name}</span>
                {cat.product_count !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      isSelected
                        ? 'bg-amber-800 text-amber-200'
                        : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {cat.product_count}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>

      {/* Product List Content */}
      {prodLoading ? (
        <ProductGridSkeleton count={8} />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : displayedProducts.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-white rounded-3xl border border-stone-200/90 p-8 max-w-md mx-auto shadow-xs">
          <div className="w-14 h-14 rounded-3xl bg-amber-50 text-amber-900 flex items-center justify-center mx-auto shadow-2xs">
            <CupSoda className="w-7 h-7 text-amber-800" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-stone-900 text-base">No drinks found</h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              We couldn't find any drinks matching "{searchInput || selectedCategory}". Try resetting your filters.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              handleCategoryClick('All');
              handleClearSearch();
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 px-1">
            <span>
              Showing <strong className="text-stone-800">{displayedProducts.length}</strong> available drinks
            </span>
            {selectedCategory !== 'All' && (
              <span className="font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/40">
                {selectedCategory === 'Favorites' ? '❤️ Favorites' : `Category: ${selectedCategory}`}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(selectedProd) => setCustomizingProduct(selectedProd)}
              />
            ))}
          </div>
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
