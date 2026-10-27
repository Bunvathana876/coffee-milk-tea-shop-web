import React, { useState, useEffect, useId } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import type { Product, DrinkSize, SugarLevel, IceLevel, DrinkCustomization } from '../../types';
import {
  SIZE_OPTIONS,
  SUGAR_OPTIONS,
  ICE_OPTIONS,
  TOPPING_OPTIONS,
  calculateCustomizedPrice,
} from '../../features/products/customization';
import { formatUsd, formatKhr } from '../../config/currency';

export interface CustomizationModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, customization: DrinkCustomization) => void;
}

interface ModalContentProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, customization: DrinkCustomization) => void;
}

const CustomizationModalContent: React.FC<ModalContentProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  const titleId = useId();

  // Selected Options State
  const [selectedSize, setSelectedSize] = useState<DrinkSize>('Medium');
  const [selectedSugar, setSelectedSugar] = useState<SugarLevel>('50%');
  const [selectedIce, setSelectedIce] = useState<IceLevel>('Normal Ice');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Real-time price calculations
  const { unitPrice, subtotal } = calculateCustomizedPrice(
    product.base_price_usd,
    selectedSize,
    quantity,
    selectedToppings
  );

  const toggleTopping = (toppingName: string) => {
    setSelectedToppings((prev) =>
      prev.includes(toppingName)
        ? prev.filter((t) => t !== toppingName)
        : [...prev, toppingName]
    );
  };

  const handleConfirm = () => {
    if (!selectedSize) {
      setValidationError('Please choose a cup size');
      return;
    }
    if (!selectedSugar) {
      setValidationError('Please select your preferred sugar level');
      return;
    }
    if (!selectedIce) {
      setValidationError('Please select an ice level');
      return;
    }

    onAddToCart(product, {
      size: selectedSize,
      sugar_level: selectedSugar,
      ice_level: selectedIce,
      toppings: selectedToppings,
      quantity,
      unit_price_usd: unitPrice,
      subtotal_usd: subtotal,
    });
    onClose();
  };

  return (
    <div
      className="w-full sm:max-w-xl max-h-[92vh] sm:max-h-[88vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 sm:zoom-in-95 duration-200"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Photo header */}
      <div className="relative h-44 sm:h-52 shrink-0 bg-amber-950 overflow-hidden">
        {product.image && (
          <img src={product.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/20 to-transparent" />
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 text-stone-800 flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
          aria-label="Close customization dialog"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="absolute bottom-4 left-5 right-5 text-white">
          <h2 id={titleId} className="text-2xl font-serif font-black tracking-tight truncate">
            {product.name}
          </h2>
          {product.description && (
            <p className="text-xs text-white/80 line-clamp-1 mt-0.5">{product.description}</p>
          )}
        </div>
      </div>

      {/* Modal Body: Scrollable Customization Steps */}
      <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
        {/* Validation Warning */}
        {validationError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <span>⚠️</span>
            <span>{validationError}</span>
          </div>
        )}

        {/* Step 1: Cup Size */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-900 text-white text-[10px] flex items-center justify-center font-black">1</span>
              <span>Cup Size</span>
              <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/50">
              {selectedSize}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {SIZE_OPTIONS.map((size) => {
              const isSelected = selectedSize === size.value;
              return (
                <button
                  key={size.value}
                  type="button"
                  onClick={() => {
                    setSelectedSize(size.value);
                    setValidationError(null);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between active:scale-98 ${
                    isSelected
                      ? 'border-amber-900 bg-amber-50/90 ring-2 ring-amber-900/30 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-stone-50/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-stone-900">{size.label}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-900" />}
                    </div>
                    <span className="text-[11px] text-stone-500 block mt-0.5 font-medium">{size.description}</span>
                  </div>

                  <div className="mt-2 text-xs font-black text-amber-950">
                    {size.priceAdjustment === 0 ? 'Base price' : `+${formatUsd(size.priceAdjustment)}`}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2: Sugar Level */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-900 text-white text-[10px] flex items-center justify-center font-black">2</span>
              <span>Sweetness</span>
              <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/50">
              {selectedSugar}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
            {SUGAR_OPTIONS.map((sugar) => {
              const isSelected = selectedSugar === sugar;
              return (
                <button
                  key={sugar}
                  type="button"
                  onClick={() => {
                    setSelectedSugar(sugar);
                    setValidationError(null);
                  }}
                  className={`py-3 px-1 rounded-xl text-xs font-black transition-all text-center cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-amber-900 text-white shadow-md ring-2 ring-amber-900/30'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 border border-stone-200/60'
                  }`}
                >
                  {sugar}
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 3: Ice Level */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-900 text-white text-[10px] flex items-center justify-center font-black">3</span>
              <span>Ice</span>
              <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200/50">
              {selectedIce}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ICE_OPTIONS.map((ice) => {
              const isSelected = selectedIce === ice;
              return (
                <button
                  key={ice}
                  type="button"
                  onClick={() => {
                    setSelectedIce(ice);
                    setValidationError(null);
                  }}
                  className={`py-3 px-2 rounded-xl text-xs font-black transition-all text-center cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-amber-900 text-white shadow-md ring-2 ring-amber-900/30'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200/80 border border-stone-200/60'
                  }`}
                >
                  {ice}
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 4: Signature Toppings */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-black uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-amber-900 text-white text-[10px] flex items-center justify-center font-black">4</span>
              <span>Toppings</span>
              <span className="text-[10px] text-stone-400 font-normal lowercase">(optional)</span>
            </label>
            <span className="text-xs font-bold text-stone-500">
              {selectedToppings.length} selected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {TOPPING_OPTIONS.map((topping) => {
              const isSelected = selectedToppings.includes(topping.name);
              return (
                <button
                  key={topping.name}
                  type="button"
                  onClick={() => toggleTopping(topping.name)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between active:scale-98 ${
                    isSelected
                      ? 'border-amber-900 bg-amber-50/90 ring-2 ring-amber-900/20 shadow-xs'
                      : 'border-stone-200 bg-white hover:border-amber-300 hover:bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-amber-900 border-amber-900 text-white'
                          : 'border-stone-300 bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-2" />}
                    </div>
                    <span className="text-xs font-black text-stone-850">
                      {topping.name}
                    </span>
                  </div>

                  <span className="text-xs font-extrabold text-amber-950">
                    +{formatUsd(topping.price)}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Modal Bottom Checkout Bar */}
      <div className="p-4 sm:p-5 border-t border-stone-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
        {/* Quantity Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <span className="text-xs font-black text-stone-600 sm:hidden uppercase">Qty:</span>
          <div className="flex items-center border border-stone-200 rounded-2xl p-1 bg-stone-50">
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              disabled={quantity <= 1}
              className="w-9 h-9 rounded-xl bg-white text-stone-700 hover:bg-stone-100 flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-colors cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-black text-sm text-stone-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((prev) => Math.min(20, prev + 1))}
              className="w-9 h-9 rounded-xl bg-white text-stone-700 hover:bg-stone-100 flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Button & Calculated Total Price */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-3 rounded-2xl text-xs font-bold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!product.is_available}
              onClick={handleConfirm}
              className="flex-2 sm:flex-none px-6 py-3.5 rounded-2xl bg-amber-900 hover:bg-amber-950 text-white font-black text-xs sm:text-sm shadow-lg shadow-amber-950/20 active:scale-98 transition-all flex items-center justify-between sm:justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <span>
                  {product.is_available ? 'Add to cart' : 'Sold out'}
                </span>
              </span>
              <span className="bg-amber-950/60 px-2.5 py-1 rounded-xl text-xs font-mono font-bold tracking-tight text-amber-200">
                {formatUsd(subtotal)} ({formatKhr(subtotal)})
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalStyle;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-950/70 backdrop-blur-xs transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <CustomizationModalContent
        key={product.id}
        product={product}
        onClose={onClose}
        onAddToCart={onAddToCart}
      />
    </div>
  );
};
