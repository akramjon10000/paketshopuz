import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem, Order } from '../types';
import { ADMIN_TOKEN_STORAGE_KEY, ApiOrder, ordersAPI } from '../utils/api';

interface OrderContextType {
  orders: Order[];
  placeOrder: (
    items: CartItem[],
    total: number,
    address: string,
    phone: string,
    userName: string,
    paymentMethod: 'cash' | 'click' | 'payme',
    comment?: string
  ) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const STORAGE_KEY = 'paketshop_orders';
const OrderContext = createContext<OrderContextType | undefined>(undefined);

const normalizeOrder = (order: ApiOrder | Order): Order => ({
  ...order,
  status: (order.status || 'new') as Order['status'],
  paymentMethod: (order.paymentMethod || 'cash') as Order['paymentMethod'],
  date: order.date || order.createdAt || new Date().toISOString(),
});

const getInitialOrders = (): Order[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return [];
  }

  return JSON.parse(saved).map((order: Order) => normalizeOrder(order));
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(getInitialOrders);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  const refreshOrders = async () => {
    if (typeof window !== 'undefined' && !window.localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY)) {
      return;
    }

    try {
      const apiOrders = await ordersAPI.getAll();
      setOrders(apiOrders.map((order) => normalizeOrder(order)));
    } catch (error) {
      console.warn('Falling back to local orders:', error);
    }
  };

  useEffect(() => {
    void refreshOrders();
  }, []);

  const placeOrder = async (
    items: CartItem[],
    total: number,
    address: string,
    phone: string,
    userName: string,
    paymentMethod: 'cash' | 'click' | 'payme',
    comment?: string
  ): Promise<Order> => {
    const optimisticOrder: Order = {
      id: `LOCAL-${Date.now()}`,
      items,
      total,
      status: 'new',
      date: new Date().toISOString(),
      address,
      phone,
      customerName: userName,
      paymentMethod,
      comment,
    };

    setOrders((currentOrders) => [optimisticOrder, ...currentOrders]);

    try {
      const response = await ordersAPI.create({
        items,
        total,
        address,
        phone,
        customerName: userName,
        paymentMethod,
        comment,
      });

      const persistedOrder = normalizeOrder(response.order || {
        ...optimisticOrder,
        id: response.orderId,
      });

      setOrders((currentOrders) => currentOrders.map((order) => (
        order.id === optimisticOrder.id ? persistedOrder : order
      )));

      return persistedOrder;
    } catch (error) {
      setOrders((currentOrders) => currentOrders.filter((order) => order.id !== optimisticOrder.id));
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    const previousOrders = orders;

    setOrders((currentOrders) => currentOrders.map((order) => (
      order.id === orderId ? { ...order, status } : order
    )));

    try {
      await ordersAPI.updateStatus(orderId, status);
    } catch (error) {
      setOrders(previousOrders);
      throw error;
    }
  };

  return (
    <OrderContext.Provider value={{ orders, placeOrder, updateOrderStatus, refreshOrders }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};
