import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Coffee, ArrowLeft } from 'lucide-react';
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
    <div className="py-4 space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-black text-stone-900 tracking-tight">
            Your Cart
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            {totalQuantity > 0
              ? `You have ${totalQuantity} ${totalQuantity === 1 ? 'drink' : 'drinks'} in your cart`
              : 'Review your selected drinks before checkout'}
          </p>
        </div>

        {items.length > 0 && (
          <Link
            to="/menu"
            className="text-xs font-bold text-amber-900 hover:text-amber-950 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Add more drinks</span>
          </Link>
        )}
      </div>

      {/* Cart Content: Empty State or Items Grid */}
      {items.length === 0 ? (
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-stone-200/90 p-8 sm:p-12 text-center space-y-5 shadow-xs my-8">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-900 border border-amber-200/60 flex items-center justify-center mx-auto shadow-2xs">
            <ShoppingBag className="w-8 h-8 text-amber-800" />
          </div>

          <div className="space-y-1.5 max-w-sm mx-auto">
            <h2 className="text-lg font-black text-stone-900 tracking-tight">Your cart is currently empty</h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              Looks like you haven't added any customized drinks yet. Explore our handcrafted espresso, milk teas, and fruit blends!
            </p>
          </div>

          <div className="pt-2">
            <Link to="/menu">
              <Button variant="primary" icon={<Coffee className="w-4 h-4" />}>
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
