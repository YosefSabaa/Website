'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  SlidersHorizontal, Grid, List, ChevronLeft, ChevronRight, X,
  Package, Heart, ShoppingCart, Check, Star, GitCompare,
} from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { ProductCard } from '@/components/shared/product-card';
import { StarRating } from '@/components/shared/star-rating';
import { PriceTag } from '@/components/shared/price-tag';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { formatPrice } from '@/lib/data';
import type { Product, Category } from '@/lib/types';
import { useCart } from '@/lib/context/cart-context';
import { useWishlist } from '@/lib/context/wishlist-context';
import { useCompare } from '@/lib/context/compare-context';
import { cn } from '@/lib/utils';

const sortOptions = [
  { value: 'featured', label: 'المميزة' },
  { value: 'price-asc', label: 'السعر: من الأقل' },
  { value: 'price-desc', label: 'السعر: من الأعلى' },
  { value: 'rating', label: 'الأعلى تقييماً' },
  { value: 'newest', label: 'الأحدث' },
];

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [category, setCategory] = React.useState<Category | null>(null);
  const [allProducts, setAllProducts] = React.useState<Product[]>([]);
  const [brandsList, setBrandsList] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/category?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setCategory(d.category || null);
        setAllProducts(d.products || []);
        setBrandsList(d.brands || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [sort, setSort] = React.useState('featured');
  const [priceRange, setPriceRange] = React.useState([0, 500]);
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = React.useState(false);
  const [minRating, setMinRating] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const perPage = 12;

  const { addItem } = useCart();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlist();
  const { toggleItem: toggleCompare, isInCompare } = useCompare();

  const availableBrands = React.useMemo(
    () => brandsList,
    [brandsList]
  );

  const filtered = React.useMemo(() => {
    let result = [...allProducts];
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedBrands.length > 0) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }
    if (inStockOnly) result = result.filter((p) => p.stock > 0);
    if (minRating > 0) result = result.filter((p) => p.rating >= minRating);

    switch (sort) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'newest': result.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)); break;
    }
    return result;
  }, [allProducts, priceRange, selectedBrands, inStockOnly, minRating, sort]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  React.useEffect(() => setPage(1), [slug, sort, priceRange, selectedBrands, inStockOnly, minRating]);

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </SiteLayout>
    );
  }

  if (!category) {
    return (
      <SiteLayout>
        <div className="container-px mx-auto max-w-7xl py-20 text-center">
          <h1 className="text-2xl font-bold">الفئة غير موجودة</h1>
          <Button asChild className="mt-4">
            <Link href="/">العودة للرئيسية</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 500]);
    setSelectedBrands([]);
    setInStockOnly(false);
    setMinRating(0);
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Price */}
      <div>
        <h3 className="mb-3 font-bold text-foreground">نطاق السعر</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={500}
          step={10}
          className="my-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{formatPrice(priceRange[0])} ر.س</span>
          <span>{formatPrice(priceRange[1])} ر.س</span>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Brands */}
      <div>
        <h3 className="mb-3 font-bold text-foreground">العلامات التجارية</h3>
        <div className="space-y-2">
          {availableBrands.map((brand) => (
            <label key={brand} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <span className="text-sm text-foreground">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Availability */}
      <div>
        <h3 className="mb-3 font-bold text-foreground">التوفر</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox checked={inStockOnly} onCheckedChange={(v) => setInStockOnly(v === true)} />
          <span className="text-sm text-foreground">المتوفر فقط</span>
        </label>
      </div>

      <div className="h-px bg-border" />

      {/* Rating */}
      <div>
        <h3 className="mb-3 font-bold text-foreground">التقييم</h3>
        <div className="space-y-2">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => setMinRating(minRating === r ? 0 : r)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors w-full',
                minRating === r ? 'bg-primary/10' : 'hover:bg-muted'
              )}
            >
              <StarRating rating={r} size={14} />
              <span className="text-sm text-muted-foreground">فأعلى</span>
            </button>
          ))}
        </div>
      </div>

      <Button variant="outline" className="w-full" onClick={clearFilters}>
        مسح الفلاتر
      </Button>
    </div>
  );

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-6">
        <Breadcrumb
          items={[
            { label: 'الرئيسية', href: '/' },
            { label: category.name },
          ]}
        />

        {/* Category header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 overflow-hidden rounded-2xl glass-card"
        >
          <div className="relative h-32 sm:h-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={category.image} alt={category.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-primary/80 to-primary/30" />
            <div className="absolute inset-0 flex items-center px-6">
              <div>
                <h1 className="text-2xl font-extrabold text-white sm:text-3xl">{category.name}</h1>
                <p className="mt-1 text-sm text-white/80">{category.productCount} منتج متوفر</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-6 flex gap-6">
          {/* Sidebar - desktop */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-40 glass-card rounded-2xl p-5">
              <h2 className="mb-4 flex items-center gap-2 font-bold text-foreground">
                <SlidersHorizontal size={18} /> الفلاتر
              </h2>
              <FiltersContent />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="mb-4 flex items-center justify-between gap-2 rounded-xl glass-card p-3">
              <div className="flex items-center gap-2">
                {/* Mobile filter */}
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden gap-2">
                      <SlidersHorizontal size={16} /> فلتر
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 overflow-y-auto">
                    <div className="p-4">
                      <h2 className="mb-4 flex items-center gap-2 font-bold">الفلاتر</h2>
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <span className="text-sm text-muted-foreground">
                  {filtered.length} منتج
                </span>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>

                <div className="flex items-center gap-1 rounded-lg border border-input p-0.5">
                  <button
                    onClick={() => setView('grid')}
                    className={cn('flex h-8 w-8 items-center justify-center rounded-md', view === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}
                    aria-label="عرض شبكي"
                  >
                    <Grid size={16} />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={cn('flex h-8 w-8 items-center justify-center rounded-md', view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground')}
                    aria-label="عرض قائمة"
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Active filters */}
            {(selectedBrands.length > 0 || inStockOnly || minRating > 0 || priceRange[0] > 0 || priceRange[1] < 500) && (
              <div className="mb-4 flex flex-wrap items-center gap-2">
                {selectedBrands.map((b) => (
                  <button key={b} onClick={() => toggleBrand(b)} className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {b} <X size={12} />
                  </button>
                ))}
                {inStockOnly && (
                  <button onClick={() => setInStockOnly(false)} className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    متوفر فقط <X size={12} />
                  </button>
                )}
                <button onClick={clearFilters} className="text-xs text-destructive underline">مسح الكل</button>
              </div>
            )}

            {/* Products */}
            {paginated.length === 0 ? (
              <div className="glass-card flex flex-col items-center justify-center gap-3 rounded-2xl py-20 text-center">
                <Package size={48} className="text-muted-foreground" />
                <h3 className="font-bold">لا توجد منتجات مطابقة</h3>
                <p className="text-sm text-muted-foreground">جرب تعديل الفلاتر للعثور على ما تبحث عنه</p>
                <Button variant="outline" onClick={clearFilters}>مسح الفلاتر</Button>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {paginated.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {paginated.map((p, i) => (
                  <ListProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border disabled:opacity-40"
                  aria-label="السابق"
                >
                  <ChevronRight size={18} />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition-colors',
                      page === i + 1 ? 'border-primary bg-primary text-primary-foreground' : 'border-border hover:bg-muted'
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-border disabled:opacity-40"
                  aria-label="التالي"
                >
                  <ChevronLeft size={18} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}

function ListProductCard({ product, index }: { product: import('@/lib/types').Product; index: number }) {
  const { addItem } = useCart();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlist();
  const { toggleItem: toggleCompare, isInCompare } = useCompare();
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const outOfStock = product.stock <= 0;
  const discount = product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: Math.min(index * 0.05, 0.2) }}
    >
      <Link href={`/product/${product.slug}`}>
        <div className="glass-card flex gap-4 overflow-hidden rounded-2xl p-3 transition-all hover:shadow-soft-lg">
          <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl sm:h-40 sm:w-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
            {discount > 0 && (
              <span className="absolute top-2 right-2 rounded-full bg-danger px-2 py-0.5 text-xs font-bold text-white">
                -{discount}%
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col">
            <span className="text-xs text-muted-foreground">{product.brand}</span>
            <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-foreground sm:text-base">{product.name}</h3>
            <p className="mt-1 hidden line-clamp-2 text-xs text-muted-foreground sm:block">{product.description}</p>
            <div className="mt-2">
              <StarRating rating={product.rating} size={14} showValue reviewsCount={product.reviewsCount} />
            </div>
            <div className="mt-auto flex items-end justify-between gap-2 pt-2">
              <PriceTag price={product.price} oldPrice={product.oldPrice} size="md" />
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleCompare(product); }}
                  className={cn('flex h-9 w-9 items-center justify-center rounded-lg border transition-colors', inCompare ? 'border-primary text-primary' : 'border-border hover:bg-muted')}
                  aria-label="مقارنة"
                >
                  <GitCompare size={16} />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product); }}
                  className={cn('flex h-9 w-9 items-center justify-center rounded-lg border transition-colors', inWishlist ? 'border-danger text-danger' : 'border-border hover:bg-muted')}
                  aria-label="المفضلة"
                >
                  <Heart size={16} className={inWishlist ? 'fill-danger' : ''} />
                </button>
                <button
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!outOfStock) addItem(product); }}
                  disabled={outOfStock}
                  className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  <ShoppingCart size={16} />
                  أضف للسلة
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
