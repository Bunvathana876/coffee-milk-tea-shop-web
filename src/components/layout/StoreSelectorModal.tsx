import React from 'react';
import { X, MapPin, Clock, Phone, Check, Sparkles } from 'lucide-react';
import { STORES, type StoreLocation } from '../../config/stores';

export interface StoreSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStoreId: string;
  onSelectStore: (store: StoreLocation) => void;
}

export const StoreSelectorModal: React.FC<StoreSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedStoreId,
  onSelectStore,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-espresso-dark/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-[2rem] border border-line shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-cream-deep/80 px-6 py-5 border-b border-line flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-espresso text-caramel flex items-center justify-center shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-black text-lg text-ink">
                Select Pickup Store
              </h3>
              <p className="text-xs text-ink-soft">
                Choose where you want your drinks prepared for pickup
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white text-ink-soft hover:text-ink flex items-center justify-center border border-line cursor-pointer transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Store List */}
        <div className="p-6 space-y-3.5 max-h-[65vh] overflow-y-auto">
          {STORES.map((store) => {
            const isSelected = store.id === selectedStoreId;
            return (
              <div
                key={store.id}
                onClick={() => {
                  onSelectStore(store);
                  onClose();
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left space-y-2.5 ${
                  isSelected
                    ? 'bg-cream-deep/60 border-caramel shadow-xs ring-1 ring-caramel/40'
                    : 'bg-white border-line hover:border-caramel/50 hover:bg-cream/40'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-ink text-base">
                        {store.name}
                      </span>
                      {isSelected && (
                        <span className="px-2 py-0.5 rounded-full bg-caramel text-espresso-dark font-black text-[10px] uppercase tracking-wider">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ink-soft flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-caramel shrink-0" />
                      {store.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-800 text-[11px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Open
                    </span>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-espresso text-caramel flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-line/60 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-soft">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-caramel" />
                      {store.hours}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-caramel" />
                      {store.phone}
                    </span>
                  </div>
                  <span className="font-bold text-caramel flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {store.pickupEstimate}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {store.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-white border border-line text-[10px] font-semibold text-ink-soft"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="bg-cream-deep/40 px-6 py-3.5 border-t border-line text-center text-xs text-ink-soft">
          Need large catering orders or event bookings?{' '}
          <a href="tel:+85523999888" className="font-bold text-espresso underline">
            Call our team
          </a>
        </div>
      </div>
    </div>
  );
};
