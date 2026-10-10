import React, { useState } from 'react';
import { Product, ProductVariant, OrderMode } from '../types';
import { ProductVisual } from './ProductVisual';
import { X, Star, Plus, Minus, Check, Flame, Sparkles, MessageSquare, UtensilsCrossed, CheckCircle2 } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    selectedVariant?: ProductVariant,
    notes?: string
  ) => void;
  orderMode?: OrderMode;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  orderMode = 'delivery',
}) => {
  if (!product) return null;

  const isLocalMode = orderMode === 'local';
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants ? product.variants[0] : undefined
  );
  const [notes, setNotes] = useState<string>('');

  const currentPrice = product.price + (selectedVariant?.priceDelta || 0);
  const totalPrice = currentPrice * quantity;

  const handleConfirm = () => {
    onAddToCart(product, quantity, selectedVariant, notes.trim() || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in">
      {/* Backdrop tap to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card / Bottom Sheet Container */}
      <div className="relative z-10 w-full sm:max-w-md bg-white dark:bg-stone-900 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden animate-slide-up">
        {/* Mobile drag handle */}
        <div className="w-12 h-1.5 bg-stone-300 dark:bg-stone-700 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/80 dark:bg-stone-800/80 backdrop-blur-md text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center shadow-xs cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">
          {/* Large Hero Visual */}
          <div className="rounded-2xl overflow-hidden shadow-sm">
            <ProductVisual product={product} size="lg" />
          </div>

          {/* Title & Price Header */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-stone-400 dark:text-stone-500">
                  ({product.reviewsCount} opiniones de clientes)
                </span>
              </div>
              {product.calories && (
                <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 font-medium bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full">
                  <Flame className="w-3.5 h-3.5 text-orange-500" />
                  <span>{product.calories}</span>
                </div>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 font-display mt-1">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-[#5b874b] dark:text-[#78aa65] tabular-nums font-sans">
                S/ {currentPrice.toFixed(2)}
              </span>
              <span className="text-xs text-stone-400 dark:text-stone-500 font-medium">
                · {product.portionSize}
              </span>
            </div>

            <p className="mt-2 text-stone-600 dark:text-stone-300 text-sm leading-relaxed">
              {product.fullDescription || product.description}
            </p>
          </div>

          {/* In Local Mode: Informative card indicating to order with the server */}
          {isLocalMode && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5">
                <UtensilsCrossed className="w-4 h-4" />
              </div>
              <div className="text-xs text-amber-900 dark:text-amber-200 leading-snug">
                <span className="font-extrabold block mb-0.5">Estás en modo Carta en Local:</span>
                Puedes pedir este plato directamente al mesero o en caja mencionando el nombre <strong>{product.name}</strong>.
              </div>
            </div>
          )}

          {/* Variants Selector if available */}
          {product.variants && product.variants.length > 0 && (
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2">
                Tamaño / Presentación disponible
              </label>
              <div className="space-y-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <div
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#5b874b] bg-[#5b874b]/10 dark:bg-[#5b874b]/20 text-stone-900 dark:text-stone-100'
                          : 'border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-850 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-[#5b874b] bg-[#5b874b] text-white'
                              : 'border-stone-400 dark:border-stone-600'
                          }`}
                        >
                          {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold">{v.name}</span>
                          {v.description && (
                            <span className="text-[10px] text-stone-500 dark:text-stone-400">
                              {v.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-bold tabular-nums">
                        {v.priceDelta > 0 ? `+ S/ ${v.priceDelta.toFixed(2)}` : 'Incluido'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Health Benefits & Nutrition */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5b874b]" />
              Beneficios nutricionales
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.benefits.map((b, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium border border-emerald-200 dark:border-emerald-800/40"
                >
                  ✓ {b}
                </span>
              ))}
            </div>
          </div>

          {/* Ingredients */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1">
              Ingredientes 100% artesanales
            </span>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              {product.ingredients.join(' · ')}
            </p>
          </div>

          {/* Special Notes / Instructions for the order - Only for delivery mode */}
          {!isLocalMode && (
            <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 block mb-1.5 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5" />
                ¿Alguna indicación para tu pedido? (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ej: Para regalo, sin cuchara plástica, dedicatoria corta..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-[#5b874b]"
              />
            </div>
          )}
        </div>

        {/* Bottom Sticky Action Bar */}
        <div className="p-4 bg-stone-50 dark:bg-stone-900/90 border-t border-stone-200 dark:border-stone-800">
          {isLocalMode ? (
            /* In local mode: No online ordering, informative button to close or request waiter */
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <div className="text-[11px] text-stone-500 dark:text-stone-400">
                  Precio unitario en salón
                </div>
                <div className="text-xl font-black text-[#5b874b] dark:text-[#78aa65] tabular-nums">
                  S/ {currentPrice.toFixed(2)}
                </div>
              </div>
              <button
                onClick={onClose}
                className="h-12 px-6 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-amber-600/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Pedir a mi mesero</span>
              </button>
            </div>
          ) : (
            /* In delivery mode: Add to Cart with quantity stepper */
            <div className="flex items-center gap-3">
              {/* Stepper Quantity Counter */}
              <div className="flex items-center gap-2 bg-white dark:bg-stone-800 p-1.5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-2xs">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1}
                  className="w-9 h-9 rounded-xl bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200 disabled:opacity-40 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-600 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-bold text-sm text-stone-900 dark:text-stone-100 tabular-nums">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="w-9 h-9 rounded-xl bg-[#5b874b] text-white flex items-center justify-center hover:bg-[#4a703d] active:scale-95 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Main Add Button */}
              <button
                onClick={handleConfirm}
                className="flex-1 h-12 rounded-2xl bg-[#5b874b] hover:bg-[#4a703d] active:scale-[0.98] text-white font-bold text-sm flex items-center justify-between px-4 shadow-lg shadow-[#5b874b]/30 transition-all cursor-pointer"
              >
                <span>Agregar al pedido</span>
                <span className="tabular-nums font-extrabold text-base">
                  S/ {totalPrice.toFixed(2)}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
