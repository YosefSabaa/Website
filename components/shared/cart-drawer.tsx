'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingCart, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/context/cart-context';
import { formatPrice } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, subtotal, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed inset-y-0 left-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-soft-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border p-4">
              <div className="flex items-center gap-2">
                <ShoppingCart size={20} className="text-primary" />
                <h2 className="text-lg font-bold">سلة التسوق</h2>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {totalItems} منتج
                </span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="إغلاق">
                <X size={20} />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                    <ShoppingBag size={36} className="text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">سلتك فارغة</h3>
                    <p className="mt-1 text-sm text-muted-foreground">ابدأ التسوق وأضف منتجاتك المفضلة</p>
                  </div>
                  <Button onClick={() => setIsOpen(false)} asChild>
                    <Link href="/">متابعة التسوق</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 rounded-xl border border-border bg-card p-3"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="h-20 w-20 shrink-0 rounded-lg object-cover"
                      />
                      <div className="flex flex-1 flex-col">
                        <h4 className="line-clamp-2 text-sm font-semibold text-foreground">
                          {item.product.name}
                        </h4>
                        <span className="text-xs text-muted-foreground">{item.product.brand}</span>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-lg border border-border">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex h-7 w-7 items-center justify-center text-foreground hover:bg-muted"
                              aria-label="إنقاص"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex h-7 w-7 items-center justify-center text-foreground hover:bg-muted"
                              aria-label="زيادة"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-primary">
                            {formatPrice(item.product.price * item.quantity)} ر.س
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label="حذف"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span className="font-semibold">{formatPrice(subtotal)} ر.س</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">الشحن</span>
                  <span className="font-semibold text-success">
                    {subtotal >= 200 ? 'مجاني' : '25 ر.س'}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="font-bold">الإجمالي</span>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(subtotal + (subtotal >= 200 ? 0 : 25))} ر.س
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" asChild onClick={() => setIsOpen(false)}>
                    <Link href="/cart">عرض السلة</Link>
                  </Button>
                  <Button asChild onClick={() => setIsOpen(false)}>
                    <Link href="/checkout">إتمام الطلب</Link>
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
