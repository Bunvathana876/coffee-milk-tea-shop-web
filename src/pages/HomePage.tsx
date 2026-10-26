import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Coffee,
  ArrowRight,
  Sparkles,
  QrCode,
  CheckCircle2,
  X,
  Flame,
  Coins,
} from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/product/ProductCard';
import { CustomizationModal } from '../components/product/CustomizationModal';
import { ProductGridSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { useCart } from '../features/cart/useCart';
import type { Product, DrinkCustomization } from '../types';

export const HomePage: React.FC = () => {
  const { addItem } = useCart();
  const { categories, loading: catLoading } = useCategories();
  const { products, loading: prodLoading, error, refetch } = useProducts({ isAvailable: true });

  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const featuredDrinks = products.slice(0, 8);

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
      `Added ${customization.quantity}x ${product.name} to cart!`
    );
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="space-y-12 sm:space-y-16">
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

      {/* Hero Section */}
      <section className="relative rounded-3xl bg-gradient-to-br from-amber-950 via-amber-900 to-stone-950 text-white p-7 sm:p-12 lg:p-16 overflow-hidden shadow-xl shadow-amber-950/20 border border-amber-800/40">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-amber-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-amber-800/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-800/60 text-amber-200 border border-amber-600/30 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>Phnom Penh’s Favorite Artisan Café</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Handcrafted Coffee <br />
            <span className="text-amber-300 font-serif italic font-normal">& Slow-Brewed Boba</span>
          </h1>

          <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed max-w-xl">
            From single-origin espresso roasts to creamy brown sugar boba and refreshing fruit teas. Custom-crafted to your preferred size, sugar, and ice levels.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-sm shadow-lg shadow-amber-500/25 active:scale-95 transition-all"
            >
              <span>Explore Drink Menu</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/10 text-white text-xs font-bold backdrop-blur-md border border-white/15">
              <QrCode className="w-4 h-4 text-amber-300" />
              <span>ABA KHQR ($ & ៛)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Pillars Highlights */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-900 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-amber-800" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-stone-900">Customized to You</h3>
            <p className="text-xs text-stone-500">Pick cup size, sugar & ice levels</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-900 flex items-center justify-center shrink-0">
            <Coins className="w-6 h-6 text-amber-800" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-stone-900">Dual Currency Support</h3>
            <p className="text-xs text-stone-500">Real-time USD ($) and KHR (៛) totals</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200/90 shadow-2xs flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-900 flex items-center justify-center shrink-0">
            <QrCode className="w-6 h-6 text-amber-800" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-stone-900">Instant ABA KHQR</h3>
            <p className="text-xs text-stone-500">Fast scan via Bakong or any bank</p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Browse our artisan brews and boba selections
            </p>
          </div>
          <Link
            to="/menu"
            className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 group"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {catLoading ? (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-32 h-12 rounded-2xl bg-stone-200/60 animate-pulse shrink-0" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/menu?category=${encodeURIComponent(cat.name)}`}
                className="group p-4 rounded-3xl bg-white border border-stone-200/90 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="w-10 h-10 rounded-2xl bg-amber-50 group-hover:bg-amber-100/80 text-amber-900 flex items-center justify-center transition-colors mb-3">
                  <Coffee className="w-5 h-5 text-amber-800" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900 group-hover:text-amber-950 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-[11px] text-stone-400 font-medium">
                    {cat.product_count !== null ? `${cat.product_count} drinks` : 'Artisan'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Drinks Section */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Featured Drinks
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              Popular customer favorites prepared fresh to order
            </p>
          </div>
          <Link
            to="/menu"
            className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1 group"
          >
            <span>See Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {prodLoading ? (
          <ProductGridSkeleton count={4} />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredDrinks.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(selectedProd) => setCustomizingProduct(selectedProd)}
              />
            ))}
          </div>
        )}
      </section>

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
