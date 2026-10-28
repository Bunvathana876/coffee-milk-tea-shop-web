import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Coffee, ArrowLeft, Sparkles } from 'lucide-react';
import { useCart } from '../features/cart/useCart';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { Button } from '../components/common/Button';

export const CartPage: React.FC = () => {
  const {
    items,
    totalQuantity,
    subtotalUsd,
    totalPriceUsd,
    totalPriceKhr,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  } = useCart();

  return (
    <div className="py-4 space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-4 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-caramel uppercase tracking-wider mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Review Order</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-ink tracking-tight">
            Your Cart
          </h1>
          <p className="text-xs sm:text-sm text-ink-soft">
            {totalQuantity > 0
              ? `You have ${totalQuantity} ${totalQuantity === 1 ? 'handcrafted beverage' : 'handcrafted beverages'} ready for preparation`
              : 'Review your selected drinks before ordering'}
          </p>
        </div>

        {items.length > 0 && (
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-caramel hover:text-espresso transition-colors self-start sm:self-center"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Add more drinks</span>
          </Link>
        )}
      </div>

      {/* Cart Content: Empty State or Items Grid */}
      {items.length === 0 ? (
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-line p-8 sm:p-12 text-center space-y-5 shadow-xs my-8">
          <div className="w-18 h-18 rounded-3xl bg-cream-deep text-caramel border border-line flex items-center justify-center mx-auto shadow-2xs">
            <ShoppingBag className="w-8 h-8 text-espresso" />
          </div>

          <div className="space-y-2 max-w-sm mx-auto">
            <h2 className="text-xl font-serif font-black text-ink tracking-tight">
              Your cart is currently empty
            </h2>
            <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
              Looks like you haven't added any customized drinks yet. Explore our handcrafted espresso, slow-cooked boba, and ceremonial matcha!
            </p>
          </div>

          <div className="pt-2">
            <Link to="/menu">
              <Button variant="accent" icon={<Coffee className="w-4 h-4" />}>
                Browse Drink Menu
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-3.5">
            {items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          {/* Cart Summary Card */}
          <div className="lg:col-span-5 xl:col-span-4">
            <CartSummary
              totalQuantity={totalQuantity}
              subtotalUsd={subtotalUsd}
              totalPriceUsd={totalPriceUsd}
              totalPriceKhr={totalPriceKhr}
              onClearCart={clearCart}
            />
          </div>
        </div>
      )}
    </div>
  );
};
