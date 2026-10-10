import React from 'react';
import { EstadoFitLogo } from './EstadoFitLogo';
import { Moon, Sun, Heart, Home, QrCode } from 'lucide-react';
import { OrderMode } from '../types';

interface HeaderProps {
  onReturnToSplash: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  favoritesCount: number;
  onOpenFavorites: () => void;
  currentTab: string;
  onOpenQrModal: () => void;
  orderMode: OrderMode;
  onToggleOrderMode: (mode: OrderMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReturnToSplash,
  isDarkMode,
  onToggleDarkMode,
  favoritesCount,
  onOpenFavorites,
  currentTab,
  onOpenQrModal,
  orderMode,
  onToggleOrderMode,
}) => {
  const isLocalMode = orderMode === 'local';

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200/80 dark:border-stone-800 transition-colors">
      <div className="max-w-md mx-auto px-4 h-15 flex items-center justify-between gap-2">
        {/* Left: Return to Splash Portada or Brand */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReturnToSplash}
            className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-[#5b874b]/15 dark:hover:bg-[#5b874b]/25 text-stone-700 dark:text-stone-300 text-xs font-semibold transition-colors cursor-pointer"
            title="Volver a la portada de bienvenida"
          >
            <Home className="w-3.5 h-3.5 text-[#5b874b]" />
            <span className="hidden xs:inline">Inicio</span>
          </button>

          {/* Logo & Store Wordmark */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={onReturnToSplash}>
            <EstadoFitLogo size={32} />
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-stone-900 dark:text-stone-100 leading-none font-display">
                Estado Fit
              </span>
              <span className={`text-[9px] font-semibold flex items-center gap-1 mt-0.5 ${
                isLocalMode ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${isLocalMode ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                {isLocalMode ? 'Carta en Salón' : 'Delivery Activo'}
              </span>
            </div>
          </div>
        </div>

        {/* Right contextual controls: QR en Local + Dark mode + Favorites */}
        <div className="flex items-center gap-1.5">
          {/* QR Button for in-store physical dining / table tent */}
          <button
            onClick={onOpenQrModal}
            className="h-8.5 px-2.5 rounded-xl bg-emerald-50 dark:bg-stone-800 border border-emerald-200/80 dark:border-stone-700 text-[#426435] dark:text-[#88be73] hover:bg-emerald-100 dark:hover:bg-stone-750 flex items-center gap-1 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Ver código QR para mesa o mostrador"
          >
            <QrCode className="w-3.5 h-3.5 text-[#5b874b]" />
            <span className="text-[11px]">QR Local</span>
          </button>

          {/* Favorites quick button */}
          <button
            onClick={onOpenFavorites}
            className={`relative w-8.5 h-8.5 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
              currentTab === 'favoritos'
                ? 'bg-[#5b874b] text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
            title="Ver mis favoritos"
          >
            <Heart className={`w-4 h-4 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="w-8.5 h-8.5 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center justify-center transition-colors cursor-pointer"
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
