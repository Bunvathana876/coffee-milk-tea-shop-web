import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Coffee,
  CupSoda,
  Leaf,
  Sparkles,
  X,
  Star,
  Clock,
  MapPin,
  ShieldCheck,
  Quote,
} from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { ProductCard } from '../components/product/ProductCard';
import { CustomizationModal } from '../components/product/CustomizationModal';
import { ProductGridSkeleton } from '../components/common/Skeleton';
import { ErrorState } from '../components/common/ErrorState';
import { StorySection } from '../components/home/StorySection';
import { VisitSection } from '../components/home/VisitSection';
import { MobileAppSection } from '../components/home/MobileAppSection';
import { useCart } from '../features/cart/useCart';
import { useAuth } from '../features/auth/AuthContext';
import type { Product, DrinkCustomization } from '../types';

// High-res specialty coffee imagery: warm morning extraction & handcrafted drinks
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1800&auto=format&fit=crop&q=80';

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('coffee')) return <Coffee className="w-3.5 h-3.5" />;
  if (n.includes('milk') || n.includes('boba') || n.includes('smoothie')) return <CupSoda className="w-3.5 h-3.5" />;
  if (n.includes('matcha')) return <Leaf className="w-3.5 h-3.5" />;
  return <Sparkles className="w-3.5 h-3.5" />;
};

const CUSTOMER_REVIEWS = [
  {
    quote:
      'The Brown Sugar Boba Latte is easily the best in Phnom Penh. The pearls are warm, tender, and not overly sweet. You can taste the genuine muscovado cane sugar.',
    author: 'Sothea K.',
    role: 'BKK1 Regular',
    rating: 5,
  },
  {
    quote:
      'My essential morning ritual before work. I customize my flat white with oat milk, scan Bakong KHQR, and pick it up with zero wait time. Flawless service every day.',
    author: 'Dara V.',
    role: 'Software Architect',
    rating: 5,
  },
  {
    quote:
      'Love being able to customize to 25% sweetness. The ceremonial Uji matcha latte topped with cream cheese foam is balanced to perfection. The garden patio is peaceful too.',
    author: 'Monika P.',
    role: 'Creative Designer',
    rating: 5,
  },
];

export const HomePage: React.FC = () => {
  const { addItem } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { products, loading, error, refetch } = useProducts({ isAvailable: true });
  const { categories } = useCategories();

  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filtered popular picks (up to 8 drinks)
  const featured = useMemo(() => {
    if (selectedCategory === 'All') return products.slice(0, 8);
    return products
      .filter((p) => p.category_name?.toLowerCase().includes(selectedCategory.toLowerCase()))
      .slice(0, 8);
  }, [products, selectedCategory]);

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
    setToastMessage(`Added ${customization.quantity}× ${product.name} to cart`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const stamps = (user?.loyalty_stamps || 0) % 10;

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 lg:bottom-6 right-6 z-50 bg-espresso-dark text-cream px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-espresso ring-1 ring-white/10 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-cream/60 hover:text-cream p-1 cursor-pointer focus-visible:outline-none"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 1. Hero Section: Clear Value Proposition, Editorial Typography & Trust Row */}
      <section
        aria-label="Hero"
        className="relative rounded-[2.5rem] overflow-hidden min-h-[520px] sm:min-h-[620px] flex items-end text-cream shadow-2xl border border-espresso/20"
      >
        <img
          src={HERO_IMAGE}
          alt="Artisanal pour-over coffee being freshly brewed with rich crema and warm natural café lighting"
          className="absolute inset-0 w-full h-full object-cover"
          fetchPriority="high"
        />
        {/* Cinematic warm gradient overlays with accessible text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-dark via-espresso-dark/75 to-espresso-dark/30" />
        <div className="absolute inset-0 bg-radial-[at_bottom_left] from-transparent via-espresso-dark/20 to-espresso-dark/60" />

        <div className="relative z-10 p-6 sm:p-14 lg:p-16 max-w-3xl space-y-6 sm:space-y-8">
          {/* Live Store Status Pill */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cream/15 backdrop-blur-md border border-white/20 text-xs text-cream font-medium shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-caramel-soft" />
              BKK1 Flagship
            </span>
            <span className="text-cream/40">·</span>
            <span className="text-caramel-soft font-bold flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Pickup in 10–15 min
            </span>
          </div>

          {/* Editorial Headline & Value Proposition */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-black tracking-tight leading-[1.05]">
              Artisanal Coffee &amp;
              <br />
              <span className="italic font-normal text-caramel-soft">Slow-Simmered Boba.</span>
            </h1>
            <p className="text-sm sm:text-base text-cream/90 max-w-xl leading-relaxed">
              Ethically sourced highland beans, freshly simmered brown sugar pearls, and customizable sweetness—brewed with daily devotion for slow mornings and quick pickups.
            </p>
          </div>

          {/* Two Clear Primary Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-caramel hover:bg-caramel-soft text-espresso-dark font-black text-sm shadow-xl active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel focus-visible:ring-offset-2"
            >
              <Coffee className="w-4 h-4" />
              <span>Order Ahead</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#visit"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-sm font-bold text-cream transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            >
              <MapPin className="w-4 h-4 text-caramel-soft" />
              <span>Find Our Café</span>
            </a>
          </div>

          {/* Trust & Detail Row: Hours, Rating, Quality */}
          <div className="pt-4 border-t border-white/15 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-cream/85">
            <div className="flex items-center gap-1.5" aria-label="Rating 4.9 out of 5 stars based on over 2,400 reviews">
              <div className="flex text-amber-400" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="font-bold text-cream">4.9 / 5</span>
              <span className="text-cream/60">(2,400+ reviews)</span>
            </div>
            <span className="hidden sm:inline text-cream/30">|</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-caramel-soft" />
              <span>Daily 7:00 AM – 9:00 PM</span>
            </div>
            <span className="hidden sm:inline text-cream/30">|</span>
            <div className="flex items-center gap-1.5 font-bold text-caramel-soft">
              <ShieldCheck className="w-4 h-4" />
              <span>Bakong KHQR Accepted</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Menu Section: Interactive Category Filter & Popular Drinks */}
      <section aria-labelledby="favorites-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-caramel">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Curated Selection</span>
            </div>
            <h2
              id="favorites-heading"
              className="text-2xl sm:text-3xl font-serif font-black text-ink tracking-tight mt-0.5"
            >
              Popular drinks today
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft mt-1">
              Hand-pulled espresso, slow-cooked boba, and ceremonial teas dialed to your exact sweetness.
            </p>
          </div>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-line hover:border-caramel/50 text-xs sm:text-sm font-bold text-ink hover:text-espresso shadow-2xs hover:shadow-xs transition-all shrink-0 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso"
          >
            <span>View full menu</span>
            <ArrowRight className="w-4 h-4 text-caramel" />
          </Link>
        </div>

        {/* Minimalist Category Filter Pills */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('All')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedCategory === 'All'
                  ? 'bg-espresso text-cream shadow-xs'
                  : 'bg-white hover:bg-cream-deep border border-line text-ink-soft hover:text-ink'
              }`}
            >
              All Drinks
            </button>
            {categories.map((cat) => {
              const active = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(active ? 'All' : cat.name)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    active
                      ? 'bg-espresso text-cream shadow-xs'
                      : 'bg-white hover:bg-cream-deep border border-line text-ink-soft hover:text-ink'
                  }`}
                >
                  <span className={active ? 'text-caramel-soft' : 'text-caramel'}>
                    {getCategoryIcon(cat.name)}
                  </span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        )}

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

      {/* 4. Story & Craft Section: Balanced Image-and-Text with Clear Narrative & CTA */}
      <StorySection />

      {/* 5. Testimonials Section: Improved Hierarchy, Star Ratings & Readability */}
      <section aria-labelledby="testimonials-heading" className="space-y-6">
        <div className="text-center max-w-md mx-auto space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-caramel">
            Community Love
          </span>
          <h2
            id="testimonials-heading"
            className="text-2xl sm:text-3xl font-serif font-black text-ink tracking-tight"
          >
            Loved by coffee &amp; boba purists
          </h2>
          <p className="text-xs sm:text-sm text-ink-soft">
            Over 2,400 regulars stop by for their daily pick-me-up.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CUSTOMER_REVIEWS.map((rev, idx) => (
            <article
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-7 border border-line shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="flex text-amber-400"
                    aria-label={`${rev.rating} out of 5 stars`}
                  >
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" aria-hidden="true" />
                    ))}
                  </div>
                  <Quote className="w-5 h-5 text-caramel/30" aria-hidden="true" />
                </div>
                <p className="text-xs sm:text-sm text-ink-soft leading-relaxed italic">
                  "{rev.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-line/60 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-ink">{rev.author}</h3>
                  <p className="text-[11px] text-ink-soft">{rev.role}</p>
                </div>
                <span
                  title="Verified Customer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-sage bg-sage-soft px-2.5 py-1 rounded-full border border-sage/20"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Loyalty Stamp Pass: The Brew Club */}
      <section
        id="rewards"
        aria-labelledby="rewards-heading"
        className="scroll-mt-24 relative rounded-[2.5rem] bg-gradient-to-br from-espresso-dark via-espresso to-espresso-dark text-cream p-7 sm:p-12 overflow-hidden shadow-xl border border-espresso"
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-caramel/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8">
          <div className="space-y-3 max-w-lg">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-caramel/20 text-caramel-soft font-bold text-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Brew Club Membership</span>
            </div>
            <h2 id="rewards-heading" className="text-2xl sm:text-4xl font-serif font-black leading-tight">
              Every 10th handcrafted drink is on us.
            </h2>
            <p className="text-xs sm:text-sm text-cream/80 leading-relaxed">
              Collect a digital stamp with every drink you order online or in-store. Reach 10 stamps to unlock any beverage on the house.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
            {isAuthenticated ? (
              <div className="bg-espresso-dark/90 rounded-2xl px-6 py-4 border border-white/10 flex items-center gap-4 shadow-md">
                <div className="w-11 h-11 rounded-xl bg-caramel text-espresso-dark flex items-center justify-center font-black">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-cream/70 font-medium">Digital Stamp Pass</div>
                  <div className="text-sm font-bold text-caramel-soft">
                    {stamps} / 10 stamps collected
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                    {10 - stamps === 1 ? 'Next drink unlocks your reward!' : `${10 - stamps} more until free drink`}
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={openAuthModal}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-caramel hover:bg-caramel-soft text-espresso-dark font-black text-sm shadow-xl transition-all cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-caramel"
              >
                <span>Join Brew Club &amp; Collect</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* 6. Mobile App Showcase & Live Connect */}
      <MobileAppSection />

      {/* 7. Location & Visit Section: Address, Hours, Amenities & Get Directions */}
      <VisitSection />

      {/* Drink Customization Modal */}
      <CustomizationModal
        product={customizingProduct}
        isOpen={!!customizingProduct}
        onClose={() => setCustomizingProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};
