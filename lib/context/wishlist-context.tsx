'use client';

import * as React from 'react';
import { toast } from 'sonner';
import type { Product } from '@/lib/types';

interface WishlistContextValue {
  items: Product[];
  toggleItem: (product: Product) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  count: number;
}

const WishlistContext = React.createContext<WishlistContextValue | undefined>(undefined);

const STORAGE_KEY = 'sc-wishlist';

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<Product[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, mounted]);

  const toggleItem = React.useCallback((product: Product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        toast.info(`تمت إزالة "${product.name}" من المفضلة`);
        return prev.filter((i) => i.id !== product.id);
      }
      toast.success(`تمت إضافة "${product.name}" إلى المفضلة`);
      return [...prev, product];
    });
  }, []);

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const isInWishlist = React.useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const clearWishlist = React.useCallback(() => setItems([]), []);

  const value: WishlistContextValue = {
    items,
    toggleItem,
    removeItem,
    isInWishlist,
    clearWishlist,
    count: items.length,
  };

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = React.useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
