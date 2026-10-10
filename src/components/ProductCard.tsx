import React from 'react';
import { Product, OrderMode } from '../types';
import { ProductVisual } from './ProductVisual';
import { Star, Plus, Minus, Heart, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  quantityInCart: number;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onRemoveFromCart: (product: Product, e?: React.MouseEvent) => void;
  onOpenDetails: (product: Product) => void;
  isFavorite: boolean;
  onToggleFavorite: (product: Product, e: React.MouseEvent) => void;
  orderMode?: OrderMode;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  quantityInCart,
  onAddToCart,
  onRemoveFromCart,
  onOpenDetails,
  isFavorite,
  onToggleFavorite,
  orderMode = 'delivery',
}) => {
  const isLocalMode = orderMode === 'local';

  return (
    <div
      onClick={() => onOpenDetails(product)}
      className="group relative bg-white dark:bg-stone-850 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
    >
      {/* Visual illustration top */}
      <div className="relative overflow-hidden aspect-4/3 bg-stone-100 dark:bg-stone-800">
        <ProductVisual product={product} size="sm" />

        {/* Favorite toggle button top right */}
        <button
          onClick={(e) => onToggleFavorite(product, e)}
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/85 dark:bg-stone-900/85 backdrop-blur-md flex items-center justify-center text-stone-600 dark:text-stone-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors shadow-2xs z-10 cursor-pointer"
          title={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-600 dark:text-stone-300'
            }`}
          />
        </button>

        {/* Popular / Fit Badge */}
        {product.isPopular && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#5b874b] text-white shadow-2xs">
            ★ Favorito
          </span>
        )}
      </div>

      {/* Product Content Details */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-2">
        <div>
          {/* Rating & Portion metadata */}
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
            <div className="flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
              <span className="text-[10px] text-stone-400 dark:text-stone-500">
                ({product.reviewsCount})
              </span>
            </div>
            <span className="text-[11px] font-medium truncate max-w-[110px]">
              {product.portionSize}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm sm:text-base leading-tight group-hover:text-[#5b874b] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Action: In Delivery mode -> Add to Cart. In Local mode -> View Details for ordering to waiter */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between gap-2 mt-auto">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 dark:text-stone-500">
              Precio
            </span>
            <span className="text-base sm:text-lg font-extrabold text-stone-900 dark:text-stone-100 font-sans tabular-nums">
              S/ {product.price.toFixed(2)}
            </span>
          </div>

          {/* Action Button: Conditional on orderMode */}
          {isLocalMode ? (
            <button
              onClick={() => onOpenDetails(product)}
              className="h-8 px-2.5 rounded-xl bg-amber-500/15 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 hover:bg-amber-500 hover:text-white font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer border border-amber-500/30"
              title="Ver detalles e ingredientes para pedir a tu mesero"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver plato</span>
            </button>
          ) : (
            <div onClick={(e) => e.stopPropagation()}>
              {quantityInCart > 0 ? (
                <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-[#5b874b]/30">
                  <button
                    onClick={(e) => onRemoveFromCart(product, e)}
                    className="w-7 h-7 rounded-lg bg-white dark:bg-stone-700 text-stone-800 dark:text-stone-100 flex items-center justify-center hover:bg-stone-200 dark:hover:bg-stone-600 active:scale-95 transition-all shadow-2xs cursor-pointer"
                    title="Disminuir"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-5 text-center font-bold text-xs text-stone-900 dark:text-stone-100 tabular-nums">
                    {quantityInCart}
                  </span>
                  <button
                    onClick={(e) => onAddToCart(product, e)}
                    className="w-7 h-7 rounded-lg bg-[#5b874b] text-white flex items-center justify-center hover:bg-[#4a703d] active:scale-95 transition-all shadow-2xs cursor-pointer"
                    title="Aumentar"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={(e) => onAddToCart(product, e)}
                  className="h-8 px-3 rounded-xl bg-[#5b874b] hover:bg-[#4a703d] active:scale-95 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Agregar</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
