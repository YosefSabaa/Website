'use client';

import { motion } from 'framer-motion';
import { GitCompare, X, ShoppingCart, Check, Plus } from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { EmptyState } from '@/components/shared/empty-state';
import { StarRating } from '@/components/shared/star-rating';
import { Button } from '@/components/ui/button';
import { useCompare } from '@/lib/context/compare-context';
import { useCart } from '@/lib/context/cart-context';
import { formatPrice } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function ComparePage() {
  const { items, removeItem, clearCompare } = useCompare();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="container-px mx-auto max-w-7xl py-6">
          <Breadcrumb items={[{ label: 'الرئيسية', href: '/' }, { label: 'المقارنة' }]} />
          <EmptyState
            icon="search"
            title="لا توجد منتجات للمقارنة"
            description="أضف منتجات للمقارنة من خلال زر المقارنة في بطاقة المنتج. يمكنك مقارنة حتى 4 منتجات."
            action={{ label: 'تصفح المنتجات', href: '/' }}
            className="py-20"
          />
        </div>
      </SiteLayout>
    );
  }

  const compareFields = [
    { key: 'price', label: 'السعر', render: (p: typeof items[0]) => <span className="font-bold text-primary">{formatPrice(p.price)} ر.س</span> },
    { key: 'oldPrice', label: 'السعر القديم', render: (p: typeof items[0]) => p.oldPrice ? <span className="text-muted-foreground line-through">{formatPrice(p.oldPrice)}</span> : <span className="text-muted-foreground">—</span> },
    { key: 'brand', label: 'العلامة التجارية', render: (p: typeof items[0]) => p.brand },
    { key: 'category', label: 'الفئة', render: (p: typeof items[0]) => p.category },
    { key: 'rating', label: 'التقييم', render: (p: typeof items[0]) => <StarRating rating={p.rating} size={14} showValue /> },
    { key: 'reviews', label: 'عدد المراجعات', render: (p: typeof items[0]) => `${p.reviewsCount} مراجعة` },
    { key: 'stock', label: 'التوفر', render: (p: typeof items[0]) => p.stock > 0 ? <span className="flex items-center gap-1 text-success"><Check size={14} /> متوفر ({p.stock})</span> : <span className="text-destructive">نفذت</span> },
    { key: 'sku', label: 'رمز المنتج', render: (p: typeof items[0]) => <span dir="ltr">{p.sku}</span> },
    { key: 'barcode', label: 'الباركود', render: (p: typeof items[0]) => <span dir="ltr">{p.barcode}</span> },
  ];

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-6">
        <Breadcrumb items={[{ label: 'الرئيسية', href: '/' }, { label: 'المقارنة' }]} />

        <div className="mt-4 flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <GitCompare size={24} className="text-primary" />
            مقارنة المنتجات ({items.length})
          </h1>
          <button onClick={clearCompare} className="text-sm text-destructive hover:underline">
            مسح الكل
          </button>
        </div>

        <div className="mt-6 overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Product headers */}
            <div className="grid gap-4" style={{ gridTemplateColumns: `140px repeat(${items.length}, 1fr)` }}>
              <div className="flex items-end pb-4">
                <span className="text-sm font-bold text-muted-foreground">المقارنة</span>
              </div>
              {items.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card relative rounded-2xl p-4"
                >
                  <button
                    onClick={() => removeItem(p.id)}
                    className="absolute left-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X size={14} />
                  </button>
                  <a href={`/product/${p.slug}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images[0]} alt={p.name} className="mx-auto h-28 w-28 rounded-xl object-cover" />
                    <h3 className="mt-3 line-clamp-2 text-center text-sm font-semibold">{p.name}</h3>
                  </a>
                </motion.div>
              ))}
              {items.length < 4 && (
                <div className="flex items-center justify-center rounded-2xl border-2 border-dashed border-border p-4">
                  <a href="/" className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary">
                    <Plus size={24} />
                    <span className="text-xs">أضف منتج</span>
                  </a>
                </div>
              )}
            </div>

            {/* Comparison fields */}
            <div className="mt-4 space-y-2">
              {compareFields.map((field, i) => (
                <div
                  key={field.key}
                  className={cn('grid gap-4 rounded-xl', i % 2 === 0 ? 'bg-muted/30' : '')}
                  style={{ gridTemplateColumns: `140px repeat(${items.length}, 1fr)` }}
                >
                  <div className="flex items-center px-4 py-3">
                    <span className="text-sm font-semibold text-muted-foreground">{field.label}</span>
                  </div>
                  {items.map((p) => (
                    <div key={p.id} className="flex items-center justify-center px-4 py-3 text-sm">
                      {field.render(p)}
                    </div>
                  ))}
                  {items.length < 4 && <div />}
                </div>
              ))}

              {/* Add to cart row */}
              <div className="grid gap-4" style={{ gridTemplateColumns: `140px repeat(${items.length}, 1fr)` }}>
                <div />
                {items.map((p) => (
                  <div key={p.id} className="px-4 py-3">
                    <Button
                      className="w-full gap-2"
                      onClick={() => addItem(p)}
                      disabled={p.stock <= 0}
                    >
                      <ShoppingCart size={16} />
                      أضف للسلة
                    </Button>
                  </div>
                ))}
                {items.length < 4 && <div />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
