export type CategoryId = 'todos' | 'cuchareables' | 'tortas' | 'galletones' | 'salados';

export interface ProductVariant {
  id: string;
  name: string;
  priceDelta: number; // additional cost or 0
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  price: number;
  category: CategoryId;
  rating: number;
  reviewsCount: number;
  calories?: string;
  benefits: string[];
  ingredients: string[];
  isPopular?: boolean;
  isNew?: boolean;
  badge?: string;
  variants?: ProductVariant[];
  portionSize: string;
  accentColor?: string;
  photoStyle: 'cuchareable' | 'cake' | 'cookie' | 'bowl' | 'parfait' | 'quesadilla';
  imageUrl: string;
}


export interface CartItem {
  id: string; // unique item id including variant
  productId: string;
  product: Product;
  quantity: number;
  selectedVariant?: ProductVariant;
  notes?: string;
}

export interface District {
  id: string;
  name: string;
  cost: number;
  estimatedTime: string;
}

export interface Order {
  id: string;
  date: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    variantName?: string;
  }[];
  subtotal: number;
  deliveryCost: number;
  tip: number;
  discount: number;
  total: number;
  customerName: string;
  customerPhone: string;
  address: string;
  district: string;
  reference?: string;
  paymentMethod: 'yape' | 'bcp' | 'efectivo';
  status: 'enviado' | 'en_preparacion' | 'entregado';
  orderType?: 'delivery' | 'local';
  tableNumber?: string;
  notes?: string;
}


export type OrderMode = 'delivery' | 'local';

export type ActiveTab = 'inicio' | 'explorar' | 'favoritos';
