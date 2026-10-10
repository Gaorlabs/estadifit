import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Order, ActiveTab, CategoryId, ProductVariant, OrderMode } from './types';
import { PRODUCTS } from './data/products';
import { PromoBanner } from './data/promotions';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { ExploreView } from './components/ExploreView';
import { FavoritesView } from './components/FavoritesView';
import { BottomNavBar } from './components/BottomNavBar';
import { FloatingCartBar } from './components/FloatingCartBar';
import { CartDrawer } from './components/CartDrawer';
import { ProductDetailModal } from './components/ProductDetailModal';
import { LocalQrModal } from './components/LocalQrModal';
import { SplashScreen } from './components/SplashScreen';
import { ToastProvider, useToast } from './components/Toast';

function MainApp() {
  const { showToast } = useToast();

  // Mode and view states
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [orderMode, setOrderMode] = useState<OrderMode>('delivery');
  const [activeTab, setActiveTab] = useState<ActiveTab>('inicio');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('todos');

  // Modal states
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);

  // Cart & Favorites persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('estadofit_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('estadofit_favorites');
      return saved ? JSON.parse(saved) : ['cuch-chocofit', 'torta-choco-berries'];
    } catch {
      return ['cuch-chocofit', 'torta-choco-berries'];
    }
  });

  // Theme state: por defecto modo claro (light) cálido y natural
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('estadofit_theme') === 'dark';
    } catch {
      return false;
    }
  });

  // Sync theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('estadofit_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('estadofit_theme', 'light');
    }
  }, [isDarkMode]);

  // Sync cart
  useEffect(() => {
    try {
      localStorage.setItem('estadofit_cart', JSON.stringify(cart));
    } catch {
      // storage unavailable
    }
  }, [cart]);

  // Sync favorites
  useEffect(() => {
    try {
      localStorage.setItem('estadofit_favorites', JSON.stringify(favorites));
    } catch {
      // storage unavailable
    }
  }, [favorites]);

  // Aggregated Cart Calculations
  const totalCartItems = useMemo(
    () => cart.reduce((acc, item) => acc + item.quantity, 0),
    [cart]
  );

  const cartSubtotal = useMemo(
    () =>
      cart.reduce((acc, item) => {
        const unitPrice = item.product.price + (item.selectedVariant?.priceDelta || 0);
        return acc + unitPrice * item.quantity;
      }, 0),
    [cart]
  );

  const cartQuantities = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of cart) {
      map[item.productId] = (map[item.productId] || 0) + item.quantity;
    }
    return map;
  }, [cart]);

  // Add / Remove Handlers
  const handleAddToCart = (
    product: Product,
    quantityOrEvent?: number | React.MouseEvent,
    variant?: ProductVariant,
    notes?: string
  ) => {
    if (orderMode === 'local') {
      showToast('En modo Ver Carta consulta a tu mesero para realizar tu pedido', 'info');
      setDetailProduct(product);
      return;
    }

    const qty = typeof quantityOrEvent === 'number' ? quantityOrEvent : 1;
    const selectedVar = variant || (product.variants ? product.variants[0] : undefined);
    const cartItemId = selectedVar ? `${product.id}-${selectedVar.id}` : product.id;

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + qty,
          notes: notes || newCart[existingIndex].notes,
        };
        return newCart;
      } else {
        return [
          ...prevCart,
          {
            id: cartItemId,
            productId: product.id,
            product,
            quantity: qty,
            selectedVariant: selectedVar,
            notes,
          },
        ];
      }
    });

    showToast(`Agregaste "${product.name}" al carrito`, 'success');
  };

  const handleRemoveFromCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart((prevCart) => {
      const itemIndex = prevCart.findIndex((item) => item.productId === product.id);
      if (itemIndex === -1) return prevCart;

      const item = prevCart[itemIndex];
      if (item.quantity > 1) {
        const newCart = [...prevCart];
        newCart[itemIndex] = { ...item, quantity: item.quantity - 1 };
        return newCart;
      } else {
        return prevCart.filter((_, idx) => idx !== itemIndex);
      }
    });
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
    showToast('Producto eliminado del carrito', 'info');
  };

  // Toggle favorite
  const handleToggleFavorite = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      if (prev.includes(product.id)) {
        showToast(`Removiste "${product.name}" de favoritos`, 'info');
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`¡"${product.name}" guardado en favoritos!`, 'success');
        return [...prev, product.id];
      }
    });
  };

  // Claim Promo direct ordering
  const handleClaimPromo = (promo: PromoBanner) => {
    if (orderMode === 'local') {
      const firstItem = promo.itemsToCart && promo.itemsToCart.length > 0 ? promo.itemsToCart[0] : undefined;
      const targetProduct = firstItem
        ? PRODUCTS.find((p) => p.id === firstItem.productId)
        : PRODUCTS[0];
      if (targetProduct) setDetailProduct(targetProduct);
      return;
    }

    if (promo.itemsToCart && promo.itemsToCart.length > 0) {
      promo.itemsToCart.forEach((item) => {
        const targetProduct = PRODUCTS.find((p) => p.id === item.productId);
        if (targetProduct) {
          handleAddToCart(targetProduct, item.quantity);
        }
      });
    } else {
      handleAddToCart(PRODUCTS[0], 1);
    }

    setIsCartOpen(true);
    showToast(`¡${promo.title} lista para pedir! Completa tus datos abajo`, 'success');
  };

  // Order completed handler
  const handleOrderCompleted = (_newOrder: Order) => {
    setCart([]);
    setIsCartOpen(false);
    showToast('¡Pedido generado y enviado a WhatsApp!', 'success');
  };

  // Transition from Splash to Catalog
  const handleEnterCatalog = (mode: OrderMode, cat?: CategoryId) => {
    setOrderMode(mode);
    if (cat) {
      setSelectedCategory(cat);
      setActiveTab('explorar');
    } else {
      setActiveTab('inicio');
    }
    setShowSplash(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToSplash = () => {
    setShowSplash(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user is currently on Splash Screen
  if (showSplash) {
    return (
      <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex justify-center">
        <div className="w-full max-w-md bg-[#faf8f2] dark:bg-stone-900 min-h-screen shadow-2xl relative">
          <SplashScreen
            onEnterCatalog={handleEnterCatalog}
            onOpenQrModal={() => setIsQrModalOpen(true)}
            isDarkMode={isDarkMode}
            onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-200 dark:bg-stone-950 flex justify-center selection:bg-[#5b874b]/20 selection:text-[#5b874b]">
      {/* Mobile-First Frame Container */}
      <div className="w-full max-w-md bg-[#faf8f2] dark:bg-stone-900 min-h-screen shadow-2xl relative flex flex-col transition-colors">
        {/* Top Header */}
        <Header
          onReturnToSplash={handleReturnToSplash}
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          favoritesCount={favorites.length}
          onOpenFavorites={() => {
            setActiveTab('favoritos');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          currentTab={activeTab}
          onOpenQrModal={() => setIsQrModalOpen(true)}
          orderMode={orderMode}
          onToggleOrderMode={(mode) => setOrderMode(mode)}
        />

        {/* Main Content Area */}
        <main className="flex-1">
          {activeTab === 'inicio' && (
            <HomeView
              products={PRODUCTS}
              cartQuantities={cartQuantities}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onOpenDetails={(p) => setDetailProduct(p)}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setActiveTab('explorar');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onClaimPromo={handleClaimPromo}
              orderMode={orderMode}
              onToggleOrderMode={(mode) => setOrderMode(mode)}
            />
          )}

          {activeTab === 'explorar' && (
            <ExploreView
              products={PRODUCTS}
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => setSelectedCategory(cat)}
              cartQuantities={cartQuantities}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onOpenDetails={(p) => setDetailProduct(p)}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              orderMode={orderMode}
            />
          )}

          {activeTab === 'favoritos' && (
            <FavoritesView
              products={PRODUCTS}
              favoriteIds={favorites}
              cartQuantities={cartQuantities}
              onAddToCart={handleAddToCart}
              onRemoveFromCart={handleRemoveFromCart}
              onOpenDetails={(p) => setDetailProduct(p)}
              onToggleFavorite={handleToggleFavorite}
              onExploreCatalog={() => setActiveTab('inicio')}
              orderMode={orderMode}
            />
          )}
        </main>

        {/* Floating Cart Bar (ONLY active in delivery mode when items are in cart) */}
        {orderMode === 'delivery' && (
          <FloatingCartBar
            totalItems={totalCartItems}
            subtotal={cartSubtotal}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {/* Fixed 3-Tab Bottom Navigation Bar (Inicio, Carta & Filtros, Favoritos) */}
        <BottomNavBar
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          favoritesCount={favorites.length}
        />

        {/* Product Detail Modal */}
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAddToCart={(product, qty, variant, notes) => {
            handleAddToCart(product, qty, variant, notes);
          }}
          orderMode={orderMode}
        />

        {/* Cart Drawer & Checkout (For Delivery Ordering) */}
        <CartDrawer
          isOpen={isCartOpen && orderMode === 'delivery'}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onOrderCompleted={handleOrderCompleted}
          orderMode={orderMode}
          onToggleOrderMode={(mode) => setOrderMode(mode)}
        />

        {/* Local QR Code Modal for In-Store Counter/Table Tent */}
        <LocalQrModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
