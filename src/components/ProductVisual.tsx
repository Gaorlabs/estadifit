import React, { useState } from 'react';
import { Product } from '../types';

interface ProductVisualProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProductVisual: React.FC<ProductVisualProps> = ({
  product,
  size = 'md',
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const sizeClasses = {
    sm: 'h-24 w-24 text-xs',
    md: 'h-48 w-full text-sm',
    lg: 'h-64 w-full text-base',
  }[size];

  return (
    <div className={`relative ${sizeClasses} rounded-2xl overflow-hidden select-none bg-stone-100 dark:bg-stone-800 ${className}`}>
      {/* Real High-Resolution Bakery & Culinary Photography */}
      {!imageError && product.imageUrl ? (
        <div className="relative w-full h-full">
          <img
            src={product.imageUrl}
            alt={product.name}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Smooth subtle dark gradient scrim at top and bottom for readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

          {/* Skeleton loader while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-stone-200 dark:bg-stone-800 animate-pulse flex items-center justify-center">
              <span className="text-xs text-stone-400 font-medium">Cargando delicia...</span>
            </div>
          )}
        </div>
      ) : (
        /* Fallback Container if network fails */
        <div className="relative w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-[#f5f1e8] via-[#ebe3d3] to-[#ded2bc] dark:from-stone-900 dark:via-stone-800 dark:to-stone-900">
          <div className="w-12 h-12 rounded-full bg-[#5b874b]/20 flex items-center justify-center text-[#5b874b] font-bold text-sm mb-1.5 border border-[#5b874b]/30">
            EF
          </div>
          <span className="text-xs font-bold text-stone-800 dark:text-stone-200 line-clamp-1">
            {product.name}
          </span>
          <span className="text-[10px] text-stone-500 dark:text-stone-400">
            {product.portionSize}
          </span>
        </div>
      )}

      {/* Calories Tag (subtle glass badge) */}
      {product.calories && size !== 'sm' && (
        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] sm:text-[11px] font-bold tracking-tight shadow-sm z-10 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>{product.calories}</span>
        </div>
      )}

      {/* Category / Portion Badge or Special Badge */}
      {product.badge && size !== 'sm' ? (
        <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-[#5b874b] text-[#faf7ef] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider shadow-sm z-10">
          {product.badge}
        </div>
      ) : (
        size !== 'sm' && (
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/45 backdrop-blur-md text-white/90 text-[9px] font-semibold tracking-tight z-10">
            {product.category === 'cuchareables'
              ? '12 oz'
              : product.category === 'tortas'
              ? 'Porción'
              : product.category === 'galletones'
              ? 'Artesanal'
              : 'Fit'}
          </div>
        )
      )}

      {/* Bottom overlay portion label on cards */}
      {size !== 'sm' && (
        <div className="absolute bottom-2 left-2.5 right-2.5 z-10 flex items-center justify-between text-white/90 text-[10px] font-semibold drop-shadow-sm pointer-events-none">
          <span className="truncate">{product.portionSize}</span>
        </div>
      )}
    </div>
  );
};
