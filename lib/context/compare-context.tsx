'use client';

import * as React from 'react';
import { toast } from 'sonner';
import type { Product } from '@/lib/types';

interface CompareContextValue {
  items: Product[];
  toggleItem: (product: Product) => void;
  removeItem: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  count: number;
}

const CompareContext = React.createContext<CompareContextValue | undefined>(undefined);
const STORAGE_KEY = 'sc-compare';

export function CompareProvider({ children }: { children: React.ReactNode }) {
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
        return prev.filter((i) => i.id !== product.id);
      }
      if (prev.length >= 4) {
        toast.warning('يمكن مقارنة 4 منتجات كحد أقصى');
        return prev;
      }
      toast.success(`تمت إضافة "${product.name}" للمقارنة`);
      return [...prev, product];
    });
  }, []);

  const removeItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const isInCompare = React.useCallback(
    (id: string) => items.some((i) => i.id === id),
    [items]
  );

  const clearCompare = React.useCallback(() => setItems([]), []);

  const value: CompareContextValue = {
    items,
    toggleItem,
    removeItem,
    isInCompare,
    clearCompare,
    count: items.length,
  };

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = React.useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
