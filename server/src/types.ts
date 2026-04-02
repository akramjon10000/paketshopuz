export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: 'bags' | 'boxes' | 'disposable' | 'tape' | 'hygiene';
  popular?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'new' | 'cooking' | 'delivering' | 'completed' | 'cancelled';
  address: string;
  phone: string;
  customerName?: string;
  paymentMethod: 'cash' | 'click' | 'payme';
  comment?: string;
  telegramId?: number;
  createdAt?: string;
}

export interface User {
  id?: number;
  telegramId: number;
  phone?: string;
  name?: string;
  addresses?: Address[];
}

export interface Address {
  label: string;
  lat: number;
  lng: number;
  details: string;
}
