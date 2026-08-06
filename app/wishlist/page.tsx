'use client';

import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { EmptyState } from '@/components/shared/empty-state';
import { StarRating } from '@/components/shared/star-rating';
import { Button } from '@/components/ui/button';
import { useWishlist } from '@/lib/context/wishlist-context';
import { useCart } from '@/lib/context/cart-context';
import { formatPrice } from '@/lib/data';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="container-px mx-auto max-w-7xl py-6">
          <Breadcrumb items={[{ label: 'الرئيسية', href: '/' }, { label: 'المفضلة' }]} />
          <EmptyState
            icon="wishlist"
            title="قائمة المفضلة فارغة"
            description="لم تقم بإضافة أي منتجات إلى المفضلة بعد. تصفح منتجاتنا وأضف ما يعجبك."
            action={{ label: 'تصفح المنتجات', href: '/' }}
            className="py-20"
          />
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-6">
        <Breadcrumb items={[{ label: 'الرئيسية', href: '/' }, { label: 'المفضلة' }]} />

        <div className="mt-4 flex items-center justify-between">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            <Heart size={24} className="text-danger" />
            المفضلة ({items.length})
          </h1>
          <button onClick={clearWishlist} className="text-sm text-destructive hover:underline">
            تفريغ القائمة
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card overflow-hidden rounded-2xl"
            >
              <a href={`/product/${product.slug}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={product.images[0]} alt={product.name} className="aspect-square w-full object-cover" />
              </a>
              <div className="p-4">
                <span className="text-xs text-muted-foreground">{product.brand}</span>
                <h3 className="mt-1 line-clamp-2 text-sm font-semibold">{product.name}</h3>
                <div className="mt-2">
                  <StarRating rating={product.rating} size={12} />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">{formatPrice(product.price)} ر.س</span>
                  {product.oldPrice && (
                    <span className="text-xs text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1 gap-1.5"
                    onClick={() => addItem(product)}
                    disabled={product.stock <= 0}
                  >
                    <ShoppingBag size={14} />
                    أضف للسلة
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => removeItem(product.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
