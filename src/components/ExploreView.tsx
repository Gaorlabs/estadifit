import React, { useState, useMemo } from 'react';
import { Product, CategoryId, OrderMode } from '../types';
import { CATEGORIES } from '../data/products';
import { ProductCard } from './ProductCard';
import { Search, X, SlidersHorizontal, ArrowUpDown, UtensilsCrossed } from 'lucide-react';

interface ExploreViewProps {
  products: Product[];
  selectedCategory: CategoryId;
  onSelectCategory: (cat: CategoryId) => void;
  cartQuantities: Record<string, number>;
  onAddToCart: (product: Product, e?: React.MouseEvent) => void;
  onRemoveFromCart: (product: Product, e?: React.MouseEvent) => void;
  onOpenDetails: (product: Product) => void;
  favorites: string[];
  onToggleFavorite: (product: Product, e: React.MouseEvent) => void;
  orderMode?: OrderMode;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  products,
  selectedCategory,
  onSelectCategory,
  cartQuantities,
  onAddToCart,
  onRemoveFromCart,
  onOpenDetails,
  favorites,
  onToggleFavorite,
  orderMode = 'delivery',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');

  const isLocalMode = orderMode === 'local';

  const dietaryTags = [
    { id: 'todos', label: 'Todos' },
    { id: 'avena', label: 'Con Avena' },
    { id: 'cacao', label: 'Cacao Puro' },
    { id: 'lucuma', label: 'Lúcuma' },
    { id: 'queso', label: 'Frosting Queso' },
  ];

  // Filtering and sorting logic
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (selectedCategory !== 'todos') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.ingredients.some((ing) => ing.toLowerCase().includes(q))
      );
    }

    // Filter by tag
    if (selectedTag !== 'todos') {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(selectedTag) ||
          p.description.toLowerCase().includes(selectedTag) ||
          p.ingredients.some((i) => i.toLowerCase().includes(selectedTag))
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.reviewsCount || 0) - (a.reviewsCount || 0); // popular
    });

    return result;
  }, [products, selectedCategory, searchQuery, selectedTag, sortBy]);

  return (
    <div className="space-y-4 px-4 pb-24 pt-2">
      {/* Informative banner in local mode */}
      {isLocalMode && (
        <div className="p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-500/30 flex items-center gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <UtensilsCrossed className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
          <span>
            <strong>Carta en Salón:</strong> Explora los platos, ingredientes y precios para indicar tu elección a tu mesero o en barra.
          </span>
        </div>
      )}

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Buscar cuchareable, galletón, torta o ingrediente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 text-xs sm:text-sm text-stone-900 dark:text-stone-100 placeholder:text-stone-400 focus:outline-none focus:border-[#5b874b] shadow-2xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-500 flex items-center justify-center cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Categories Horizontal Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        <button
          onClick={() => onSelectCategory('todos')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'todos'
              ? 'bg-[#5b874b] text-white shadow-xs'
              : 'bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
          }`}
        >
          Todos los platos
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-[#5b874b] text-white shadow-xs'
                : 'bg-white dark:bg-stone-850 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-100'
            }`}
          >
            <span>{cat.fullName}</span>
          </button>
        ))}
      </div>

      {/* Sub-filters: Dietary Tag pills & Sort selector */}
      <div className="flex items-center justify-between gap-2 pt-1">
        {/* Ingredient / Dietary Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {dietaryTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedTag === tag.id
                  ? 'bg-stone-800 text-white dark:bg-stone-200 dark:text-stone-900 font-semibold'
                  : 'bg-stone-100 dark:bg-stone-800/80 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Sort Select */}
        <div className="relative shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-[11px] font-semibold bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-xl px-2.5 py-1 text-stone-700 dark:text-stone-300 focus:outline-none cursor-pointer"
          >
            <option value="popular">Más pedidos</option>
            <option value="rating">Mejor calificados</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
          </select>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 px-0.5">
        <span>
          Mostrando <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'producto' : 'productos'}
        </span>
        {(searchQuery || selectedTag !== 'todos' || selectedCategory !== 'todos') && (
          <button
            onClick={() => {
              setSearchQuery('');
              onSelectCategory('todos');
              setSelectedTag('todos');
            }}
            className="text-[#5b874b] dark:text-[#78aa65] font-semibold hover:underline cursor-pointer"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 mx-auto mb-2">
            <Search className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-stone-800 dark:text-stone-200">
            No se encontraron productos
          </p>
          <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
            Intenta buscar con otros términos como "avena", "cacao", "lúcuma" o revisa otra categoría.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filteredProducts.map((product) => (
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
      )}
    </div>
  );
};
