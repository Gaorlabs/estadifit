import React, { useState, useEffect, useRef } from 'react';
import { Product, CategoryId, OrderMode } from '../types';
import { CATEGORIES } from '../data/products';
import { PROMOTIONS, PromoBanner } from '../data/promotions';
import { ProductCard } from './ProductCard';
import { Sparkles, Flame, Soup, CakeSlice, Cookie, Salad, ChevronRight, ArrowRight, Bike, UtensilsCrossed, BookOpen } from 'lucide-react';

interface HomeViewProps {
  products: Product[];
  cartQuantities: Record<string, number>;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onRemoveFromCart: (product: Product, e?: React.MouseEvent) => void;
  onOpenDetails: (product: Product) => void;
  favorites: string[];
  onToggleFavorite: (product: Product, e: React.MouseEvent) => void;
  onSelectCategory: (category: CategoryId) => void;
  onClaimPromo: (promo: PromoBanner) => void;
  orderMode: OrderMode;
  onToggleOrderMode: (mode: OrderMode) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  products,
  cartQuantities,
  onAddToCart,
  onRemoveFromCart,
  onOpenDetails,
  favorites,
  onToggleFavorite,
  onSelectCategory,
  onClaimPromo,
  orderMode,
  onToggleOrderMode,
}) => {
  const [activePromoIndex, setActivePromoIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  const bestsellers = products.filter((p) => p.isPopular);
  const cuchareables = products.filter((p) => p.category === 'cuchareables');
  const tortas = products.filter((p) => p.category === 'tortas');
  const galletones = products.filter((p) => p.category === 'galletones');
  const salados = products.filter((p) => p.category === 'salados');

  const isLocalMode = orderMode === 'local';

  // Autoplay slide transition every 3 seconds (3000ms)
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActivePromoIndex((prev) => {
        const nextIndex = (prev + 1) % PROMOTIONS.length;
        if (sliderRef.current) {
          const slideWidth = sliderRef.current.offsetWidth * 0.92;
          sliderRef.current.scrollTo({
            left: nextIndex * slideWidth,
            behavior: 'smooth',
          });
        }
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleScrollPromo = () => {
    if (sliderRef.current) {
      const scrollLeft = sliderRef.current.scrollLeft;
      const width = sliderRef.current.offsetWidth * 0.92;
      const newIndex = Math.round(scrollLeft / width);
      setActivePromoIndex(Math.min(newIndex, PROMOTIONS.length - 1));
    }
  };

  const handleDotClick = (idx: number) => {
    setActivePromoIndex(idx);
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.offsetWidth * 0.92;
      sliderRef.current.scrollTo({
        left: idx * slideWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Promo Carousel: Animated every 3s */}
      <div
        className="px-4 pt-1"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#5b874b]" />
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Promociones del Día (Automático cada 3s)
            </h2>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
            {isLocalMode ? 'En Salón' : '⚡ Pedido Directo'}
          </span>
        </div>

        {/* Carousel Container */}
        <div
          ref={sliderRef}
          onScroll={handleScrollPromo}
          className="flex overflow-x-auto gap-3 snap-x snap-mandatory scroll-smooth no-scrollbar py-1"
        >
          {PROMOTIONS.map((promo) => (
            <div
              key={promo.id}
              onClick={() => {
                if (!isLocalMode) {
                  onClaimPromo(promo);
                } else {
                  // In local mode, find primary product and open detail for waiter ordering
                  const firstItem = promo.itemsToCart && promo.itemsToCart.length > 0 ? promo.itemsToCart[0] : undefined;
                  const targetProduct = firstItem
                    ? products.find((p) => p.id === firstItem.productId)
                    : products[0];
                  if (targetProduct) onOpenDetails(targetProduct);
                }
              }}
              className="relative shrink-0 w-[92%] sm:w-[90%] snap-center rounded-3xl p-4 sm:p-5 text-white overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 active:scale-[0.99] group h-52 flex flex-col justify-between"
            >
              {/* Promotion Background Image */}
              <img
                src={promo.image}
                alt={promo.title}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Contrast Scrims for text legibility */}
              <div className={`absolute inset-0 bg-gradient-to-r ${promo.bgGradient}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/30" />

              {/* Decorative Subtle Radial Highlight */}
              <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />

              {/* Content Header: Tag and Discount Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest bg-black/45 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/20">
                  {promo.tag}
                </span>
                <span className="text-xs font-black bg-[#5b874b] text-white px-2.5 py-1 rounded-full shadow-md">
                  {promo.discountBadge}
                </span>
              </div>

              {/* Center Content: Title & Subtitle */}
              <div className="relative z-10 my-auto pt-1">
                <h3 className="text-lg sm:text-xl font-black font-display text-white leading-tight drop-shadow-md">
                  {promo.title}
                </h3>
                <p className="text-xs text-white/90 line-clamp-1 mt-1 drop-shadow-xs font-medium">
                  {promo.subtitle}
                </p>
              </div>

              {/* Footer CTA & Action Button */}
              <div className="relative z-10 flex items-center justify-between text-xs font-bold pt-2 border-t border-white/20 text-white">
                <span className={`flex items-center gap-1.5 text-white font-extrabold px-3 py-1 rounded-full shadow-md transition-all group-hover:scale-105 ${
                  isLocalMode ? 'bg-amber-600 hover:bg-amber-700' : 'bg-[#5b874b] hover:bg-[#4a723d]'
                }`}>
                  {isLocalMode ? '🍽️ Ver para pedir a mesero' : (promo.actionLabel || '⚡ Pedir ahora')}{' '}
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
                {promo.code && (
                  <span className="text-[10px] font-mono bg-white/25 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/30 text-white">
                    Código: {promo.code}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic 3-second animated indicators */}
        <div className="flex justify-center items-center gap-1.5 mt-2.5">
          {PROMOTIONS.map((_, idx) => {
            const isActive = activePromoIndex === idx;
            return (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'w-7 bg-[#5b874b]'
                    : 'w-1.5 bg-stone-300 dark:bg-stone-700 hover:bg-stone-400'
                }`}
                title={`Ir a diapositiva ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* Modo de Pedido / Carta - Simple y Limpio */}
      <div className="px-4">
        <div className={`py-2 px-3.5 rounded-xl border flex items-center justify-between gap-2 ${
          isLocalMode
            ? 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-500/30'
            : 'bg-emerald-500/10 dark:bg-emerald-950/20 border-emerald-500/30'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${
              isLocalMode
                ? 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                : 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
            }`}>
              {isLocalMode ? <UtensilsCrossed className="w-4 h-4" /> : <Bike className="w-4 h-4" />}
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 dark:text-stone-100">
                {isLocalMode ? 'En Local (Carta para pedir a mesero)' : 'Delivery (Pedido a domicilio)'}
              </span>
            </div>
          </div>
          <button
            onClick={() => onToggleOrderMode(isLocalMode ? 'delivery' : 'local')}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 transition-colors shrink-0 cursor-pointer"
          >
            Cambiar
          </button>
        </div>
      </div>

      {/* Category Cards with Product-Card stature and complete names */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100 font-display">
              Explora por Categoría
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Conoce nuestras especialidades saludables y artesanales
            </p>
          </div>
          <button
            onClick={() => onSelectCategory('todos')}
            className="text-xs font-semibold text-[#5b874b] dark:text-[#78aa65] flex items-center hover:underline cursor-pointer"
          >
            Ver todas <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
          </button>
        </div>

        {/* 2-column grid of spacious Category Cards */}
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((category) => (
            <div
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className="group relative bg-white dark:bg-stone-850 rounded-2xl border border-stone-200/90 dark:border-stone-800 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Cover Image matching Product Card height */}
              <div className="relative h-36 w-full overflow-hidden bg-stone-100 dark:bg-stone-800">
                <img
                  src={category.image}
                  alt={category.fullName}
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
                
                {/* Count badge */}
                <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-tight shadow-sm">
                  {category.count} variedades
                </div>

                {/* Price Range badge on bottom-left of image */}
                <div className="absolute bottom-2 left-2.5 px-2 py-0.5 rounded-lg bg-[#5b874b] text-white text-[10px] font-bold">
                  {category.priceRange}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex flex-col flex-1 justify-between gap-1.5">
                <div>
                  <h3 className="font-extrabold text-stone-900 dark:text-stone-100 text-sm leading-snug group-hover:text-[#5b874b] transition-colors">
                    {category.fullName}
                  </h3>
                  <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                    {category.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs font-bold text-[#5b874b] dark:text-[#78aa65]">
                  <span>Ver productos</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Bestsellers (Los Más Pedidos) */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100 font-display">
              Los Más Pedidos en Estado Fit
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {bestsellers.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantityInCart={cartQuantities[product.id] || 0}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onOpenDetails={onOpenDetails}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
              orderMode={orderMode}
            />
          ))}
        </div>
      </div>

      {/* Cuchareables 12 oz Section */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100 font-display flex items-center gap-1.5">
              <Soup className="w-4 h-4 text-[#5b874b]" />
              Cuchareables 12 oz
            </h2>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Nuestros bowls artesanales en envase ecológico
            </span>
          </div>
          <button
            onClick={() => onSelectCategory('cuchareables')}
            className="text-xs font-semibold text-[#5b874b] dark:text-[#78aa65] hover:underline"
          >
            Ver todos ({cuchareables.length})
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {cuchareables.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantityInCart={cartQuantities[product.id] || 0}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onOpenDetails={onOpenDetails}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
              orderMode={orderMode}
            />
          ))}
        </div>
      </div>

      {/* Tortas & Porciones Fit Section */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100 font-display flex items-center gap-1.5">
              <CakeSlice className="w-4 h-4 text-amber-600" />
              Tortas & Porciones Fit
            </h2>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Elaboradas con beterraga, zanahoria, avena y cacao
            </span>
          </div>
          <button
            onClick={() => onSelectCategory('tortas')}
            className="text-xs font-semibold text-[#5b874b] dark:text-[#78aa65] hover:underline"
          >
            Ver todos ({tortas.length})
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {tortas.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantityInCart={cartQuantities[product.id] || 0}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onOpenDetails={onOpenDetails}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
              orderMode={orderMode}
            />
          ))}
        </div>
      </div>

      {/* Galletones & Snacks Section */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100 font-display flex items-center gap-1.5">
              <Cookie className="w-4 h-4 text-orange-600" />
              Galletones & Snacks
            </h2>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Crujientes por fuera y rellenos suaves
            </span>
          </div>
          <button
            onClick={() => onSelectCategory('galletones')}
            className="text-xs font-semibold text-[#5b874b] dark:text-[#78aa65] hover:underline"
          >
            Ver todos ({galletones.length})
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {galletones.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantityInCart={cartQuantities[product.id] || 0}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onOpenDetails={onOpenDetails}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
              orderMode={orderMode}
            />
          ))}
        </div>
      </div>

      {/* Platos Salados Fit Section */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100 font-display flex items-center gap-1.5">
              <Salad className="w-4 h-4 text-emerald-600" />
              Platos & Salados Fit
            </h2>
            <span className="text-xs text-stone-500 dark:text-stone-400">
              Almuerzos nutritivos, quesadillas y parfaits
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {salados.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantityInCart={cartQuantities[product.id] || 0}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
              onOpenDetails={onOpenDetails}
              isFavorite={favorites.includes(product.id)}
              onToggleFavorite={onToggleFavorite}
              orderMode={orderMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
