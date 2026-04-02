import React, { createContext, useContext, useEffect, useState } from 'react';
import { MENU_ITEMS } from '../constants';
import { Product } from '../types';
import { productsAPI } from '../utils/api';

interface MenuContextType {
  products: Product[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProduct: (id: string) => Product | undefined;
}

const STORAGE_KEY = 'paketshop_menu';
const MenuContext = createContext<MenuContextType | undefined>(undefined);

const normalizeProduct = (product: any): Product => {
  const images = Array.isArray(product.images)
    ? product.images.filter(Boolean)
    : product.image
      ? [product.image]
      : [];

  return {
    ...product,
    images,
  };
};

const getInitialProducts = (): Product[] => {
  const saved = localStorage.getItem(STORAGE_KEY);
  const items = saved ? JSON.parse(saved) : MENU_ITEMS;
  return items.map(normalizeProduct);
};

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(getInitialProducts);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      try {
        const apiProducts = await productsAPI.getAll();
        if (!cancelled && apiProducts.length > 0) {
          setProducts(apiProducts.map(normalizeProduct));
        }
      } catch (error) {
        console.warn('Falling back to local product catalog:', error);
      }
    };

    void loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const saveProduct = async (product: Product, mode: 'add' | 'update') => {
    const normalizedProduct = normalizeProduct(product);
    const previousProducts = products;

    setProducts((currentProducts) => {
      if (mode === 'add') {
        return [normalizedProduct, ...currentProducts.filter((item) => item.id !== normalizedProduct.id)];
      }

      return currentProducts.map((item) => (
        item.id === normalizedProduct.id ? normalizedProduct : item
      ));
    });

    try {
      await productsAPI.save(normalizedProduct);
    } catch (error) {
      setProducts(previousProducts);
      throw error;
    }
  };

  const addProduct = async (product: Product) => {
    await saveProduct(product, 'add');
  };

  const updateProduct = async (product: Product) => {
    await saveProduct(product, 'update');
  };

  const deleteProduct = async (id: string) => {
    const previousProducts = products;
    setProducts((currentProducts) => currentProducts.filter((item) => item.id !== id));

    try {
      await productsAPI.remove(id);
    } catch (error) {
      setProducts(previousProducts);
      throw error;
    }
  };

  const getProduct = (id: string) => products.find((product) => product.id === id);

  return (
    <MenuContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, getProduct }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within MenuProvider');
  }
  return context;
};
