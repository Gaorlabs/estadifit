import React from 'react';
import { Product, OrderMode } from '../types';
import { ProductCard } from './ProductCard';
import { Heart, ArrowRight, UtensilsCrossed } from 'lucide-react';

interface FavoritesViewProps {
  products: Product[];
  favoriteIds: string[];
  cartQuantities: Record<string, number>;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onRemoveFromCart: (product: Product, e?: React.MouseEvent) => void;
  onOpenDetails: (product: Product) => void;
  onToggleFavorite: (product: Product, e: React.MouseEvent) => void;
  onExploreCatalog: () => void;
  orderMode?: OrderMode;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  products,
  favoriteIds,
  cartQuantities,
  onAddToCart,
  onRemoveFromCart,
  onOpenDetails,
  onToggleFavorite,
  onExploreCatalog,
  orderMode = 'delivery',
}) => {
  const favoriteProducts = products.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="space-y-4 px-4 pb-24 pt-2">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-display">
            Mis Favoritos
          </h2>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Tus postres y platos fit guardados
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-900">
          {favoriteProducts.length} guardados
        </span>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="py-16 text-center bg-white dark:bg-stone-850 rounded-3xl border border-stone-200/80 dark:border-stone-800 p-6 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-500 mx-auto mb-3">
            <Heart className="w-8 h-8 fill-rose-500/20" />
          </div>
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
            Aún no tienes favoritos
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xs mx-auto">
            Toca el corazón en cualquier producto del catálogo para guardarlo aquí y recordarlo para pedirlo rápidamente.
          </p>
          <button
            onClick={onExploreCatalog}
            className="mt-4 px-5 py-2.5 rounded-xl bg-[#5b874b] text-white text-xs font-bold hover:bg-[#4a703d] transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
          >
            <span>Ver Menú Completo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantityInCart={cartQuantities[product.id] || 0}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onOpenDetails={onOpenDetails}
              isFavorite={true}
              onToggleFavorite={onToggleFavorite}
              orderMode={orderMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};
