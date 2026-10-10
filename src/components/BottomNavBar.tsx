import React from 'react';
import { Home, Compass, Heart } from 'lucide-react';
import { ActiveTab } from '../types';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  favoritesCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  favoritesCount,
}) => {
  const tabs = [
    { id: 'inicio' as ActiveTab, label: 'Inicio', icon: Home },
    { id: 'explorar' as ActiveTab, label: 'Carta & Filtros', icon: Compass },
    { id: 'favoritos' as ActiveTab, label: 'Favoritos', icon: Heart, badge: favoritesCount },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 transition-colors">
      <div className="max-w-md mx-auto grid grid-cols-3 h-16 items-center px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 transition-all cursor-pointer ${
                isActive
                  ? 'text-[#5b874b] dark:text-[#78aa65]'
                  : 'text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  } ${tab.id === 'favoritos' && isActive ? 'fill-current' : ''}`}
                />

                {/* Badge if any */}
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#5b874b] text-white text-[9px] font-bold flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[11px] tracking-tight mt-1 transition-all ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {tab.label}
              </span>

              {/* Active subtle pill dot */}
              {isActive && (
                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-[#5b874b] dark:bg-[#78aa65]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
