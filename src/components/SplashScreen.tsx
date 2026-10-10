import React, { useState, useEffect } from 'react';
import { EstadoFitLogo } from './EstadoFitLogo';
import {
  Sparkles,
  Bike,
  UtensilsCrossed,
  QrCode,
  ArrowRight,
  Flame,
  Sun,
  Moon
} from 'lucide-react';
import { OrderMode, CategoryId } from '../types';

interface SplashScreenProps {
  onEnterCatalog: (mode: OrderMode, category?: CategoryId) => void;
  onOpenQrModal?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

// Visual showcase of signature dishes for appetizing appeal (Solo informativo)
const SHOWCASE_ITEMS = [
  {
    name: 'Cuchareable Sexyfit 12 oz',
    category: 'cuchareables' as CategoryId,
    tag: 'Bestseller ⭐',
    price: 'S/ 24.00',
    description: 'Capas de cacao orgánico con suave crema proteica',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80',
    badgeColor: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300',
  },
  {
    name: 'Torta Red Velvet Saludable',
    category: 'tortas' as CategoryId,
    tag: '100% Fit 🍰',
    price: 'S/ 16.00',
    description: 'Bizcocho esponjoso de avena y endulzado natural',
    image: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?auto=format&fit=crop&w=600&q=80',
    badgeColor: 'bg-rose-500/20 text-rose-800 dark:text-rose-300',
  },
  {
    name: 'Galletones de Nutella Artesanal',
    category: 'galletones' as CategoryId,
    tag: 'Sin Azúcar 🍪',
    price: 'S/ 8.00',
    description: 'Horneados al día con crema de avellanas saludable',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
    badgeColor: 'bg-amber-500/20 text-amber-800 dark:text-amber-300',
  },
];

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onEnterCatalog,
  onOpenQrModal,
  isDarkMode = false,
  onToggleDarkMode,
}) => {
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-rotate the showcase items every 3.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SHOWCASE_ITEMS.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const currentItem = SHOWCASE_ITEMS[activeSlide];

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-4 sm:p-5 overflow-hidden bg-radial from-[#5b874b]/18 via-[#faf8f2] to-[#f4eedb] dark:from-[#1b2b17] dark:via-stone-900 dark:to-stone-950 text-stone-800 dark:text-stone-100 transition-colors">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 -left-20 w-80 h-80 rounded-full bg-[#5b874b]/20 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-[#78aa65]/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-72 h-72 rounded-full bg-[#5b874b]/15 blur-3xl pointer-events-none" />

      {/* Top Header & Lively Animated Brand Identity */}
      <div className="relative z-10 flex flex-col items-center text-center pt-1">
        {/* Top utility row with Live badge & Theme Toggle */}
        <div className="w-full flex items-center justify-between mb-3 px-1">
          {/* Live operational badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 dark:bg-stone-800/95 border border-[#5b874b]/30 shadow-xs text-[11px] font-bold text-stone-700 dark:text-stone-200 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[#5b874b] animate-ping" />
            <span className="text-[#4b773d] dark:text-[#78aa65]">● Atendiendo Hoy</span>
            <span className="text-stone-300 dark:text-stone-600">·</span>
            <span>Lima</span>
          </div>

          {/* Theme switch button */}
          {onToggleDarkMode && (
            <button
              onClick={onToggleDarkMode}
              className="p-1.5 rounded-full bg-white/90 dark:bg-stone-800/90 border border-stone-200/80 dark:border-stone-700 shadow-xs text-stone-600 dark:text-stone-300 hover:text-[#5b874b] transition-all cursor-pointer active:scale-95"
              title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label="Alternar tema de color"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-500 fill-amber-500" />
              ) : (
                <Moon className="w-4 h-4 text-stone-600" />
              )}
            </button>
          )}
        </div>

        {/* Brand Icon with lively animation, floating effect and glow */}
        <div
          className="relative mb-2.5 group cursor-pointer animate-float-gentle"
          onClick={() => onEnterCatalog('delivery')}
          title="Toca para ingresar"
        >
          {/* Animated Glow Aura */}
          <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-[#5b874b]/40 via-amber-400/30 to-[#78aa65]/40 blur-xl animate-glow-pulse pointer-events-none" />

          {/* Logo Container */}
          <div className="relative p-2.5 rounded-3xl bg-white/90 dark:bg-stone-800/90 shadow-xl border border-stone-200/70 dark:border-stone-700/70 backdrop-blur-sm transition-transform duration-300 hover:scale-105 active:scale-95">
            <EstadoFitLogo size={82} withGlow={true} />
          </div>

          {/* Sparkle Badge */}
          <span className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-gradient-to-tr from-[#5b874b] to-[#78aa65] shadow-lg text-white animate-bounce">
            <Sparkles className="w-3.5 h-3.5" />
          </span>
        </div>

        {/* Main Brand Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-stone-100 font-display">
          ESTADO FIT
        </h1>
        <p className="text-xs uppercase tracking-widest font-extrabold bg-gradient-to-r from-[#4b773d] via-[#5b874b] to-[#78aa65] bg-clip-text text-transparent mt-0.5">
          Pastelería & Cocina Saludable Artesanal
        </p>

        {/* Nutritional Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5 max-w-xs">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#5b874b]/15 text-[#3b602f] dark:text-[#91c57e] border border-[#5b874b]/30 shadow-2xs">
            🌿 100% Sin Azúcar Refinada
          </span>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 shadow-2xs">
            🍯 Miel & Manjar Fit
          </span>
        </div>
      </div>

      {/* Appetizing Visual Showcase (Vitrina informativa de especialidades - Solo Info) */}
      <div className="relative z-10 my-3">
        <div className="relative overflow-hidden rounded-2xl bg-white/95 dark:bg-stone-850/95 border border-stone-200/80 dark:border-stone-700 shadow-sm backdrop-blur-sm p-2.5 select-none transition-all">
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-stone-200/60 dark:border-stone-700 shadow-2xs">
              <img
                src={currentItem.image}
                alt={currentItem.name}
                className="w-full h-full object-cover transition-transform duration-500"
              />
              <span className="absolute bottom-0.5 right-0.5 text-[8.5px] font-black px-1 py-0.2 rounded bg-black/75 text-white">
                {currentItem.price}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className={`text-[9.5px] font-bold px-1.5 py-0.2 rounded-md ${currentItem.badgeColor}`}>
                  {currentItem.tag}
                </span>
                <span className="text-[10px] text-stone-400 dark:text-stone-500 font-medium">
                  Especialidad
                </span>
              </div>
              <h3 className="text-xs sm:text-sm font-extrabold text-stone-900 dark:text-stone-100 truncate font-display">
                {currentItem.name}
              </h3>
              <p className="text-[10px] text-stone-500 dark:text-stone-400 truncate">
                {currentItem.description}
              </p>
            </div>
          </div>

          {/* Dots Indicator (cambio de diapositiva informativa) */}
          <div className="flex items-center justify-center gap-1.5 mt-1.5">
            {SHOWCASE_ITEMS.map((_, idx) => (
              <button
                type="button"
                key={idx}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Ver diapositiva ${idx + 1}`}
                className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                  activeSlide === idx ? 'w-5 bg-[#5b874b]' : 'w-1.5 bg-stone-300 dark:bg-stone-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* CORE SECTION: ¿CÓMO DESEAS PEDIR HOY? (Sencillo, limpio, directo y sin texto mareante) */}
      <div className="relative z-10 space-y-2.5 my-1">
        <div className="text-center">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#436e35] dark:text-[#88be73]">
            <Flame className="w-3.5 h-3.5 text-[#5b874b] fill-[#5b874b] animate-bounce" />
            <span>¿CÓMO DESEAS PEDIR HOY?</span>
          </div>
        </div>

        {/* OPCIÓN 1: PEDIR DELIVERY (Sencillo, visual y directo) */}
        <button
          onClick={() => onEnterCatalog('delivery')}
          className="w-full text-left p-3.5 rounded-2xl bg-gradient-to-r from-[#2f5523] via-[#467335] to-[#355f27] hover:brightness-105 active:scale-[0.98] text-white shadow-lg shadow-[#467335]/25 border border-emerald-400/40 relative overflow-hidden group cursor-pointer transition-all"
        >
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/25 shadow-inner group-hover:scale-105 transition-transform">
                <Bike className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-black flex items-center gap-2">
                  <span>Pedir Delivery</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-400/30 text-emerald-100 border border-emerald-300/30">
                    A Domicilio
                  </span>
                </div>
                <p className="text-xs text-white/85 font-medium mt-0.5">
                  Envío a casa con pedido por WhatsApp
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
          </div>
        </button>

        {/* OPCIÓN 2: VER CARTA EN LOCAL (Elegante, armónico con verde logo y crema natural) */}
        <button
          onClick={() => onEnterCatalog('local')}
          className="w-full text-left p-3.5 rounded-2xl bg-white dark:bg-stone-850 hover:bg-[#FAF7EF]/60 dark:hover:bg-stone-800 active:scale-[0.98] text-stone-900 dark:text-stone-100 shadow-md border-2 border-[#5b874b]/35 hover:border-[#5b874b] group cursor-pointer transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#5b874b]/12 dark:bg-[#5b874b]/20 text-[#436e35] dark:text-[#88be73] flex items-center justify-center shrink-0 border border-[#5b874b]/25 shadow-xs group-hover:scale-105 transition-transform">
                <UtensilsCrossed className="w-6 h-6 text-[#5b874b] dark:text-[#88be73]" />
              </div>
              <div>
                <div className="text-sm font-black flex items-center gap-2">
                  <span>Ver Carta en Local</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-[#5b874b]/15 text-[#355f27] dark:text-[#a0d28d] border border-[#5b874b]/30">
                    En Tienda
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 font-medium mt-0.5">
                  Para ver en mesa y pedir a tu mesero
                </p>
              </div>
            </div>

            <div className="w-8 h-8 rounded-xl bg-[#5b874b]/12 dark:bg-[#5b874b]/20 text-[#436e35] dark:text-[#88be73] flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 text-[#5b874b] dark:text-[#88be73]" />
            </div>
          </div>
        </button>

        {/* Acceso a Código QR */}
        {onOpenQrModal && (
          <button
            onClick={onOpenQrModal}
            className="w-full py-2 px-3 rounded-xl bg-white/70 dark:bg-stone-800/70 hover:bg-white dark:hover:bg-stone-800 border border-stone-200/70 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-[11px] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <QrCode className="w-3.5 h-3.5 text-[#5b874b]" />
            <span>Ver o descargar código QR de mesa</span>
          </button>
        )}
      </div>



      {/* Footer minimal info */}
      <div className="relative z-10 text-center text-[10px] text-stone-400 dark:text-stone-500 pt-2 pb-1">
        <span>Martes a Domingo · 10:00 am - 8:00 pm</span>
      </div>
    </div>
  );
};
