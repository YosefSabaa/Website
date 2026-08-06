'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Eye, ShoppingCart, Check, GitCompare, Package } from 'lucide-react';
import type { Product } from '@/lib/types';
import { useCart } from '@/lib/context/cart-context';
import { useWishlist } from '@/lib/context/wishlist-context';
import { useCompare } from '@/lib/context/compare-context';
import { StarRating } from '@/components/shared/star-rating';
import { PriceTag } from '@/components/shared/price-tag';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCart();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlist();
  const { toggleItem: toggleCompare, isInCompare } = useCompare();
  const [added, setAdded] = React.useState(false);

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 10;
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`}>
        <div className="glass-card overflow-hidden rounded-2xl transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1">
          {/* Image */}
          <div className="relative aspect-square overflow-hidden bg-muted/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className={cn(
                'h-full w-full object-cover transition-transform duration-500 group-hover:scale-110',
                outOfStock && 'opacity-50'
              )}
            />

            {/* Badges */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5">
              {discount > 0 && (
                <span className="rounded-full bg-danger px-2.5 py-1 text-xs font-bold text-white shadow-md">
                  -{discount}%
                </span>
              )}
              {product.isNewArrival && (
                <span className="rounded-full bg-success px-2.5 py-1 text-xs font-bold text-white shadow-md">
                  جديد
                </span>
              )}
              {product.isBestSeller && (
                <span className="rounded-full bg-warning px-2.5 py-1 text-xs font-bold text-white shadow-md">
                  الأكثر مبيعاً
                </span>
              )}
            </div>

            {/* Quick actions */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <button
                onClick={handleWishlist}
                aria-label="إضافة للمفضلة"
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md backdrop-blur transition-all hover:scale-110',
                  inWishlist && 'bg-danger text-white'
                )}
              >
                <Heart size={16} className={inWishlist ? 'fill-white' : ''} />
              </button>
              <button
                onClick={handleCompare}
                aria-label="مقارنة"
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md backdrop-blur transition-all hover:scale-110',
                  inCompare && 'bg-primary text-white'
                )}
              >
                <GitCompare size={16} />
              </button>
            </div>

            {/* Quick view button - appears on hover */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/60 to-transparent p-3 transition-transform duration-300 group-hover:translate-y-0">
              <div className="flex items-center justify-center gap-1 rounded-lg bg-white/95 dark:bg-slate-900/95 py-2 text-sm font-medium text-foreground backdrop-blur">
                <Eye size={16} />
                عرض سريع
              </div>
            </div>

            {outOfStock && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="rounded-lg bg-destructive/90 px-4 py-2 text-sm font-bold text-white">
                  نفذت الكمية
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{product.brand}</span>
              <span
                className={cn(
                  'flex items-center gap-1 text-xs font-medium',
                  outOfStock ? 'text-destructive' : lowStock ? 'text-warning' : 'text-success'
                )}
              >
                <Package size={12} />
                {outOfStock ? 'نفذت' : lowStock ? `متبقي ${product.stock}` : 'متوفر'}
              </span>
            </div>

            <h3 className="mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
              {product.name}
            </h3>

            <div className="mb-3">
              <StarRating rating={product.rating} size={14} showValue reviewsCount={product.reviewsCount} />
            </div>

            <div className="flex items-end justify-between gap-2">
              <PriceTag price={product.price} oldPrice={product.oldPrice} size="sm" />
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                aria-label="إضافة للسلة"
                className={cn(
                  'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all hover:scale-105',
                  added
                    ? 'bg-success text-white'
                    : 'bg-primary text-white hover:bg-primary/90',
                  outOfStock && 'cursor-not-allowed opacity-50'
                )}
              >
                {added ? <Check size={18} /> : <ShoppingCart size={18} />}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="glass-card overflow-hidden rounded-2xl">
      <div className="aspect-square animate-pulse bg-muted" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-5 w-1/2 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
