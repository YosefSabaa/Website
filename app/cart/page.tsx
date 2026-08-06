'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Plus, Minus, Trash2, ShoppingBag, Tag, Check, ArrowLeft, Truck,
} from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/context/cart-context';
import { formatPrice } from '@/lib/data';
import { toast } from 'sonner';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const [settings, setSettings] = React.useState<any>(null);
  const [coupon, setCoupon] = React.useState('');
  const [appliedCoupon, setAppliedCoupon] = React.useState<{ code: string; discount: number } | null>(null);

  React.useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(d => setSettings(d.settings)).catch(() => setSettings(null));
  }, []);

  const freeShipThreshold = Number(settings?.free_shipping_threshold) || 200;
  const shipCost = Number(settings?.shipping_cost) || 25;
  const taxRate = (Number(settings?.tax_rate) || 15) / 100;

  const shipping = subtotal >= freeShipThreshold ? 0 : shipCost;
  const couponDiscount = appliedCoupon ? Math.round(subtotal * (appliedCoupon.discount / 100)) : 0;
  const tax = Math.round((subtotal - couponDiscount) * taxRate);
  const total = subtotal - couponDiscount + shipping + tax;

  const applyCoupon = async () => {
    const code = coupon.trim().toUpperCase();
    if (!code) return;
    try {
      const res = await fetch('/api/content');
      const d = await res.json();
      const found = (d.coupons || []).find((c: any) => c.code.toUpperCase() === code && c.is_active);
      if (found) {
        const pct = parseInt(found.discount_text) || 0;
        setAppliedCoupon({ code, discount: pct });
        toast.success(`تم تطبيق كود الخصم: ${code} (${found.discount_text})`);
        setCoupon('');
      } else {
        toast.error('كود الخصم غير صحيح');
      }
    } catch {
      toast.error('فشل التحقق من الكود');
    }
  };

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="container-px mx-auto max-w-7xl py-6">
          <Breadcrumb items={[{ label: 'الرئيسية', href: '/' }, { label: 'سلة التسوق' }]} />
          <EmptyState
            icon="cart"
            title="سلة التسوق فارغة"
            description="لم تقم بإضافة أي منتجات إلى سلتك بعد. ابدأ التسوق واكتشف منتجاتنا المميزة."
            action={{ label: 'ابدأ التسوق', href: '/' }}
            className="py-20"
          />
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-6">
        <Breadcrumb items={[{ label: 'الرئيسية', href: '/' }, { label: 'سلة التسوق' }]} />

        <h1 className="mt-4 text-2xl font-bold">سلة التسوق ({items.length})</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Items */}
          <div className="lg:col-span-2">
            <div className="glass-card overflow-hidden rounded-2xl">
              {/* Header */}
              <div className="hidden border-b border-border bg-muted/30 px-6 py-3 text-xs font-bold text-muted-foreground sm:grid sm:grid-cols-12 sm:gap-4">
                <div className="col-span-6">المنتج</div>
                <div className="col-span-2 text-center">السعر</div>
                <div className="col-span-2 text-center">الكمية</div>
                <div className="col-span-2 text-center">الإجمالي</div>
              </div>

              {items.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border last:border-0 px-4 py-4 sm:px-6"
                >
                  <div className="flex gap-4 sm:grid sm:grid-cols-12 sm:items-center sm:gap-4">
                    {/* Product */}
                    <div className="flex flex-1 gap-3 sm:col-span-6">
                      <Link href={`/product/${item.product.slug}`} className="shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.product.images[0]} alt={item.product.name} className="h-20 w-20 rounded-xl object-cover" />
                      </Link>
                      <div className="flex flex-col">
                        <Link href={`/product/${item.product.slug}`}>
                          <h3 className="line-clamp-2 text-sm font-semibold hover:text-primary">{item.product.name}</h3>
                        </Link>
                        <span className="text-xs text-muted-foreground">{item.product.brand}</span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="mt-auto flex items-center gap-1 text-xs text-destructive hover:underline sm:hidden"
                        >
                          <Trash2 size={12} /> حذف
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="hidden text-center sm:col-span-2 sm:block">
                      <span className="text-sm font-semibold">{formatPrice(item.product.price)} ر.س</span>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-between sm:col-span-2 sm:justify-center">
                      <span className="text-sm text-muted-foreground sm:hidden">الكمية:</span>
                      <div className="flex items-center gap-1 rounded-lg border border-border">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center hover:bg-muted">
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center hover:bg-muted">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Total + remove */}
                    <div className="flex items-center justify-between gap-2 sm:col-span-2 sm:justify-center">
                      <span className="text-sm font-bold text-primary">{formatPrice(item.product.price * item.quantity)} ر.س</span>
                      <button onClick={() => removeItem(item.id)} className="hidden sm:flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}

              <div className="flex items-center justify-between px-6 py-4">
                <button onClick={clearCart} className="text-sm text-destructive hover:underline">
                  تفريغ السلة
                </button>
                <Button variant="outline" asChild>
                  <Link href="/">متابعة التسوق</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="sticky top-40 glass-card rounded-2xl p-6">
              <h2 className="text-lg font-bold">ملخص الطلب</h2>

              {/* Coupon */}
              <div className="mt-4">
                <label className="text-sm font-medium text-muted-foreground">كود الخصم</label>
                <div className="mt-2 flex gap-2">
                  <div className="relative flex-1">
                    <Tag size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="أدخل الكود"
                      className="w-full rounded-lg border border-input bg-background py-2.5 pr-9 pl-3 text-sm outline-none"
                    />
                  </div>
                  <Button onClick={applyCoupon} size="sm">تطبيق</Button>
                </div>
                {appliedCoupon && (
                  <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-1.5 text-xs font-medium text-success">
                    <Check size={14} /> تم تطبيق {appliedCoupon.code} (-{appliedCoupon.discount}%)
                  </div>
                )}
                <p className="mt-1.5 text-xs text-muted-foreground">جرّب: SAVE10, WELCOME15, SCHOOL20</p>
              </div>

              <div className="my-4 h-px bg-border" />

              {/* Totals */}
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span className="font-semibold">{formatPrice(subtotal)} ر.س</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>الخصم</span>
                    <span className="font-semibold">-{formatPrice(couponDiscount)} ر.س</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الشحن</span>
                  <span className="font-semibold">
                    {shipping === 0 ? <span className="text-success">مجاني</span> : `${formatPrice(shipping)} ر.س`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الضريبة ({settings?.tax_rate || 15}%)</span>
                  <span className="font-semibold">{formatPrice(tax)} ر.س</span>
                </div>
                {shipping > 0 && (
                  <div className="flex items-center gap-1.5 rounded-lg bg-primary/5 px-3 py-2 text-xs text-primary">
                    <Truck size={14} />
                    أضف {formatPrice(200 - subtotal)} ر.س للحصول على شحن مجاني
                  </div>
                )}
              </div>

              <div className="my-4 h-px bg-border" />

              <div className="flex items-center justify-between">
                <span className="font-bold">الإجمالي</span>
                <span className="text-xl font-extrabold text-primary">{formatPrice(total)} ر.س</span>
              </div>

              <Button asChild className="mt-4 w-full gap-2" size="lg">
                <Link href="/checkout">
                  إتمام الطلب
                  <ArrowLeft size={18} />
                </Link>
              </Button>

              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <ShoppingBag size={14} />
                دفع آمن 100% • تشفير SSL
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
