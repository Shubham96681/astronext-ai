'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

type CartContextValue = {
  cartCount: number;
  addedItems: Record<number, boolean>;
  handleAddToCart: (productId: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [addedItems, setAddedItems] = useState<Record<number, boolean>>({});

  const handleAddToCart = useCallback((productId: number) => {
    setCartCount((prev) => prev + 1);
    setAddedItems((prev) => ({ ...prev, [productId]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [productId]: false }));
    }, 1500);
  }, []);

  const value = useMemo(
    () => ({ cartCount, addedItems, handleAddToCart }),
    [cartCount, addedItems, handleAddToCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
