"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { CartLine, Product } from "@/types";

type CartContextValue = {
  items: CartLine[];
  hydrated: boolean;
  count: number;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number, maxQuantity?: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "mahvara-cart-v1";
const MAX_CLIENT_QUANTITY = 99;

function parseStoredCart(value: string): CartLine[] {
  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) return [];
  return parsed.flatMap((line) => {
    if (!line || typeof line !== "object") return [];
    const { productId, quantity } = line as Partial<CartLine>;
    if (typeof productId !== "string" || !productId.trim() || !Number.isInteger(quantity) || !quantity || quantity < 1) return [];
    return [{ productId, quantity: Math.min(quantity, MAX_CLIENT_QUANTITY) }];
  });
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setItems(parseStoredCart(saved));
      } catch { localStorage.removeItem(STORAGE_KEY); }
      setHydrated(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => { if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); }, [items, hydrated]);

  const addItem = useCallback((product: Product, quantity = 1) => setItems((current) => {
    if (product.stock < 1 || !Number.isFinite(quantity)) return current;
    const safeQuantity = Math.max(1, Math.min(Math.trunc(quantity), product.stock, MAX_CLIENT_QUANTITY));
    const existing = current.find((line) => line.productId === product.id);
    return existing
      ? current.map((line) => line.productId === product.id ? { ...line, quantity: Math.min(product.stock, MAX_CLIENT_QUANTITY, line.quantity + safeQuantity) } : line)
      : [...current, { productId: product.id, quantity: safeQuantity }];
  }), []);
  const updateQuantity = useCallback((productId: string, quantity: number, maxQuantity = MAX_CLIENT_QUANTITY) => setItems((current) => current.map((line) => line.productId === productId ? { ...line, quantity: Math.max(1, Math.min(Math.trunc(quantity) || 1, maxQuantity, MAX_CLIENT_QUANTITY)) } : line)), []);
  const removeItem = useCallback((productId: string) => setItems((current) => current.filter((line) => line.productId !== productId)), []);
  const clear = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, hydrated, count: items.reduce((sum, line) => sum + line.quantity, 0), addItem, updateQuantity, removeItem, clear }), [items, hydrated, addItem, updateQuantity, removeItem, clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
