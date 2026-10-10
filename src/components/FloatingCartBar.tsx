import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface FloatingCartBarProps {
  totalItems: number;
  subtotal: number;
  onOpenCart: () => void;
}

export const FloatingCartBar: React.FC<FloatingCartBarProps> = ({
  totalItems,
  subtotal,
  onOpenCart,
}) => {
  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-20 inset-x-0 z-35 px-4 pointer-events-none transition-all">
      <div className="max-w-md mx-auto pointer-events-auto">
        <button
          onClick={onOpenCart}
          className="w-full h-14 rounded-2xl bg-[#5b874b] hover:bg-[#4d733f] text-white p-3.5 shadow-xl shadow-[#5b874b]/35 border border-white/20 flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer group"
        >
          {/* Left badge & count */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-bold text-xs">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-white/90">
                {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en carrito
              </span>
              <span className="text-[10px] text-[#e8f5e1] font-medium">
                Toca para ver desglose y envío
              </span>
            </div>
          </div>

          {/* Right Subtotal & Arrow */}
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold tabular-nums font-sans">
              S/ {subtotal.toFixed(2)}
            </span>
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
