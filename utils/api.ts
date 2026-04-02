import type { CartItem, Order, Product } from '../types';

export const ADMIN_TOKEN_STORAGE_KEY = 'paketshop_admin_token';

const API_URL = import.meta.env.DEV
  ? '/api'
  : (import.meta.env.VITE_API_URL || 'http://localhost:3002/api');

function getAdminAuthHeaders(headers?: HeadersInit): HeadersInit {
  if (typeof window === 'undefined') {
    return headers || {};
  }

  const token = window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY);
  if (!token) {
    return headers || {};
  }

  return {
    ...(headers || {}),
    Authorization: `Bearer ${token}`,
  };
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}

export interface CreateOrderDTO {
  items: CartItem[];
  total: number;
  address: string;
  phone: string;
  customerName?: string;
  paymentMethod: 'cash' | 'click' | 'payme';
  comment?: string;
  telegramId?: number;
}

export interface ApiOrder extends Omit<Order, 'date'> {
  date?: string;
  createdAt?: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token: string;
  user: {
    name: string;
  };
}

export const authAPI = {
  loginAdmin: (password: string) =>
    fetchAPI<AdminLoginResponse>('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),
  validateAdminSession: () =>
    fetchAPI<{ success: boolean; user: { name: string } }>('/admin/session', {
      headers: getAdminAuthHeaders(),
    }),
};

export const productsAPI = {
  getAll: () => fetchAPI<Product[]>('/products'),
  getById: (id: string) => fetchAPI<Product>(`/products/${id}`),
  save: (product: Product) =>
    fetchAPI<{ success: boolean; id: string }>('/products', {
      method: 'POST',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify(product),
    }),
  remove: (id: string) =>
    fetchAPI<{ success: boolean }>(`/products/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeaders(),
    }),
};

export const ordersAPI = {
  create: (order: CreateOrderDTO) =>
    fetchAPI<{ success: boolean; orderId: string; order?: ApiOrder }>('/orders', {
      method: 'POST',
      body: JSON.stringify(order),
    }),
  getByPhone: (phone: string) =>
    fetchAPI<ApiOrder[]>(`/orders?phone=${encodeURIComponent(phone)}`),
  getAll: () => fetchAPI<ApiOrder[]>('/orders?all=true', {
    headers: getAdminAuthHeaders(),
  }),
  updateStatus: (id: string, status: Order['status']) =>
    fetchAPI<{ success: boolean }>(`/orders/${id}`, {
      method: 'PATCH',
      headers: getAdminAuthHeaders(),
      body: JSON.stringify({ status }),
    }),
};

export { API_URL };
