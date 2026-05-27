'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type CartItemInput = {
  productId: number;
  name: string;
  price: number;
  image?: string;
};

export type CartItem = CartItemInput & {
  qty: number;
};

type CartContextValue = {
  cartCount: number;
  cartItems: CartItem[];
  subtotal: number;
  addedItems: Record<number, boolean>;
  handleAddToCart: (item: number | CartItemInput, qty?: number) => void;
  incrementQty: (productId: number) => void;
  decrementQty: (productId: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addedItems, setAddedItems] = useState<Record<number, boolean>>({});

  const handleAddToCart = useCallback((item: number | CartItemInput, qty = 1) => {
    const safeQty = Math.max(1, qty);
    const normalized: CartItemInput =
      typeof item === 'number'
        ? {
            productId: item,
            name: `Sacred Product #${item}`,
            price: 0,
          }
        : item;

    setCartItems((prev) => {
      const existing = prev.find((line) => line.productId === normalized.productId);
      if (existing) {
        return prev.map((line) =>
          line.productId === normalized.productId
            ? {
                ...line,
                qty: line.qty + safeQty,
                // Always refresh details from latest add source.
                name: normalized.name,
                price: normalized.price,
                image: normalized.image,
              }
            : line,
        );
      }
      return [...prev, { ...normalized, qty: safeQty }];
    });

    setAddedItems((prev) => ({ ...prev, [normalized.productId]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [normalized.productId]: false }));
    }, 1500);
  }, []);

  const incrementQty = useCallback((productId: number) => {
    setCartItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, qty: item.qty + 1 } : item)),
    );
  }, []);

  const decrementQty = useCallback((productId: number) => {
    setCartItems((prev) =>
      prev.flatMap((item) => {
        if (item.productId !== productId) return [item];
        if (item.qty <= 1) return [];
        return [{ ...item, qty: item.qty - 1 }];
      }),
    );
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(() => cartItems.reduce((sum, item) => sum + item.qty, 0), [cartItems]);
  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cartItems],
  );

  const value = useMemo(
    () => ({
      cartCount,
      cartItems,
      subtotal,
      addedItems,
      handleAddToCart,
      incrementQty,
      decrementQty,
      removeFromCart,
      clearCart,
    }),
    [
      cartCount,
      cartItems,
      subtotal,
      addedItems,
      handleAddToCart,
      incrementQty,
      decrementQty,
      removeFromCart,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
