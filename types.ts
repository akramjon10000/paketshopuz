export interface Product {
  id: string;
  name: string;
  nameRu?: string;
  description: string;
  descriptionRu?: string;
  price: number;
  images: string[];
  category:
    | 'cups'
    | 'containers'
    | 'plates'
    | 'cutlery'
    | 'accessories'
    | 'bags'
    | 'boxes'
    | 'disposable'
    | 'tape'
    | 'kitchen'
    | 'cleaning'
    | 'hygiene'
    | 'household'
    | 'party';
  subcategory?: string;
  popular?: boolean;
  seoKeywords?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  phone: string;
  name?: string;
  addresses?: Address[];
  telegramId?: number;
  isAdmin?: boolean;
}

export interface Address {
  label: string;
  lat: number;
  lng: number;
  details: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'new' | 'cooking' | 'delivering' | 'completed' | 'cancelled';
  date: string;
  address: string;
  phone: string;
  customerName?: string;
  paymentMethod: 'cash' | 'click' | 'payme';
  comment?: string;
  telegramId?: number;
}

export type ToolFn = (args: any) => any;

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
        };
        initDataUnsafe?: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
      };
    };
  }
}
