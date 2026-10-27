import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { ProductCard } from '../components/product/ProductCard';
import { CustomizationModal } from '../components/product/CustomizationModal';
import { ProductGridSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { useCart } from '../features/cart/useCart';
import { useAuth } from '../features/auth/AuthContext';
import type { Product, DrinkCustomization } from '../types';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1800&auto=format&fit=crop&q=80';

export const HomePage: React.FC = () => {
  const { addItem } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { products, loading, error, refetch } = useProducts({ isAvailable: true });
  const { categories } = useCategories();

  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const featured = useMemo(() => products.slice(0, 8), [products]);

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

  const stamps = (user?.loyalty_stamps || 0) % 10;

  return (
    <div className="space-y-16 sm:space-y-24">
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

      {/* Hero */}
      <section className="relative rounded-[2rem] overflow-hidden min-h-[460px] sm:min-h-[560px] flex items-end text-white shadow-2xl">
        <img
          src={HERO_IMAGE}
          alt="Freshly poured coffee"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-stone-950/10" />
        <div className="relative z-10 p-7 sm:p-14 max-w-2xl space-y-6">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight leading-[1.02]">
            Coffee &amp; boba,
            <br />
            <span className="italic font-normal text-amber-300">made your way.</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm shadow-xl active:scale-95 transition-all"
            >
              Order now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/orders"
              className="inline-flex items-center px-6 py-3.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/25 text-sm font-bold transition-all"
            >
              Track order
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Browse
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/menu?category=${encodeURIComponent(cat.name)}`}
                className="group relative shrink-0 w-40 sm:w-52 h-28 sm:h-32 rounded-3xl overflow-hidden bg-stone-800 shadow-md"
              >
                {cat.image && (
                  <img
                    src={cat.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 to-stone-950/10" />
                <span className="absolute bottom-3 left-4 text-white font-serif font-bold text-base sm:text-lg">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Favorites */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
            Popular picks
          </h2>
          <Link
            to="/menu"
            className="text-sm font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 group"
          >
            Full menu
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} onSelect={setCustomizingProduct} />
            ))}
          </div>
        )}
      </section>

      {/* Loyalty */}
      <section className="rounded-[2rem] bg-stone-950 text-white p-7 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-2 max-w-md">
          <h3 className="text-2xl sm:text-3xl font-serif font-bold">Every 10th drink is free.</h3>
          <p className="text-sm text-stone-400">Earn a stamp with each order.</p>
        </div>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 10 }).map((_, idx) => {
              const stamped = idx < stamps;
              const reward = idx === 9;
              return (
                <div
                  key={idx}
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-black border ${
                    stamped
                      ? 'bg-amber-400 border-amber-300 text-stone-950'
                      : reward
                        ? 'border-dashed border-amber-300 text-amber-300'
                        : 'border-white/20 text-white/40'
                  }`}
                >
                  {stamped ? '☕' : reward ? '🎁' : idx + 1}
                </div>
              );
            })}
          </div>
          {isAuthenticated ? (
            <p className="text-xs font-bold text-amber-200">{user?.loyalty_stamps || 0} stamps</p>
          ) : (
            <button
              type="button"
              onClick={openAuthModal}
              className="text-xs font-bold text-amber-300 hover:text-white underline underline-offset-4 cursor-pointer"
            >
              Sign in to collect stamps
            </button>
          )}
        </div>
      </section>

      <CustomizationModal
        product={customizingProduct}
        isOpen={!!customizingProduct}
        onClose={() => setCustomizingProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};
