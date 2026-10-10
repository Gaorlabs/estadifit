export interface PromoItemAction {
  productId: string;
  quantity: number;
}

export interface PromoBanner {
  id: string;
  tag: string;
  title: string;
  subtitle: string;
  code?: string;
  discountBadge: string;
  image: string;
  bgGradient: string;
  textColor: string;
  accentColor: string;
  itemsToCart?: PromoItemAction[];
  actionLabel?: string;
}

export const PROMOTIONS: PromoBanner[] = [
  {
    id: 'promo-1',
    tag: 'PROMO DEL DÍA',
    title: '2x1 en Galletones de Nutella',
    subtitle: 'Rellenos de crema de avellana y coco natural. ¡Solo por hoy!',
    code: 'NUTELLA2X1',
    discountBadge: '50% OFF',
    image: 'https://images.unsplash.com/photo-1548848221-0c2e497ed557?auto=format&fit=crop&w=800&q=80',
    bgGradient: 'from-amber-950/85 via-amber-900/60 to-black/80',
    textColor: 'text-white',
    accentColor: '#e9f5e1',
    actionLabel: '⚡ Pedir 2x1 Ahora',
    itemsToCart: [
      { productId: 'galleton-nutella', quantity: 2 },
    ],
  },
  {
    id: 'promo-2',
    tag: 'COMBO ESPECIAL',
    title: 'Combo Cuchareable + Porción Fit',
    subtitle: '1 Cuchareable Sexyfit 12oz + 1 Porción de Torta Carrot Cake saludable.',
    discountBadge: 'Ahorra S/ 3.00',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
    bgGradient: 'from-[#3a200e]/85 via-[#543015]/60 to-black/80',
    textColor: 'text-white',
    accentColor: '#fde68a',
    actionLabel: '⚡ Pedir Combo Ahora',
    itemsToCart: [
      { productId: 'cuchareable-sexyfit', quantity: 1 },
      { productId: 'carrot-cake-slice', quantity: 1 },
    ],
  },
  {
    id: 'promo-3',
    tag: 'DELIVERY GRATIS',
    title: 'Pack Degustación Estado Fit',
    subtitle: 'Cuchareable Red Velvet + Galleton + Torta Sexyfit con envío incluido.',
    discountBadge: 'ENVÍO S/ 0',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    bgGradient: 'from-[#1c4b2a]/85 via-[#2e6f40]/60 to-black/80',
    textColor: 'text-white',
    accentColor: '#bbf7d0',
    actionLabel: '⚡ Pedir Pack Ahora',
    itemsToCart: [
      { productId: 'red-velvet-cuchareable', quantity: 1 },
      { productId: 'galleton-nutella', quantity: 1 },
      { productId: 'sexyfit-slice', quantity: 1 },
    ],
  },
  {
    id: 'promo-4',
    tag: 'NUEVO LANZAMIENTO',
    title: 'Tentación de Lúcuma 100% Peruana',
    subtitle: 'Brownie cusqueño con ganache de lúcuma pura y 10% de descuento.',
    code: 'ESTADOFIT10',
    discountBadge: '10% OFF',
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
    bgGradient: 'from-[#78350f]/85 via-[#b45309]/60 to-black/80',
    textColor: 'text-white',
    accentColor: '#fed7aa',
    actionLabel: '⚡ Pedir con 10% OFF',
    itemsToCart: [
      { productId: 'cuchareable-tentacion-lucuma', quantity: 1 },
    ],
  },
];
