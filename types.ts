export interface Product {
  id: string;
  name: string;
  nameRu?: string; // Russian name
  description: string;
  descriptionRu?: string; // Russian description
  price: number;
  images: string[];
  category:
  | 'cups'        // Stakanlar / Стаканы
  | 'containers'  // Konteynerlar / Контейнеры
  | 'plates'      // Likopchalar / Тарелки
  | 'cutlery'     // Oshxona anjomlari / Столовые приборы
  | 'accessories' // Aksessuarlar / Аксессуары
  | 'bags'        // Paketlar / Пакеты
  | 'kitchen'     // Oshxona sarflov / Расходные материалы
  | 'cleaning'    // Tozalash / Инвентарь для уборки
  | 'hygiene'     // Qog'oz gigiena / Бумажная гигиена
  | 'household'   // Boshqa xo'jalik / Прочие хозтовары
  | 'party';      // Tug'ilgan kun va bayram / Праздники
  subcategory?: string; // Optional subcategory
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
  status: 'new' | 'cooking' | 'delivering' | 'completed';
  date: string;
  address: string;
  phone: string;
  paymentMethod: 'cash' | 'click' | 'payme';
  comment?: string;
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