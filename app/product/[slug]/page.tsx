'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Heart, ShoppingCart, Zap, Share2, Minus, Plus, Check, Star,
  Package, Shield, Truck, RotateCcw, ChevronLeft, GitCompare,
} from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { StarRating } from '@/components/shared/star-rating';
import { ProductCard } from '@/components/shared/product-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/lib/context/cart-context';
import { useWishlist } from '@/lib/context/wishlist-context';
import { useCompare } from '@/lib/context/compare-context';
import { formatPrice } from '@/lib/data';
import type { Product } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = React.useState<Product | null>(null);
  const [related, setRelated] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);
    fetch(`/api/product?slug=${slug}`)
      .then((r) => r.json())
      .then((d) => {
        setProduct(d.product || null);
        setRelated(d.related || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const { addItem } = useCart();
  const { toggleItem: toggleWishlist, isInWishlist } = useWishlist();
  const { toggleItem: toggleCompare, isInCompare } = useCompare();

  const [selectedImage, setSelectedImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [zoomPos, setZoomPos] = React.useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming] = React.useState(false);

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </SiteLayout>
    );
  }

  if (!product) {
    return (
      <SiteLayout>
        <div className="container-px mx-auto max-w-7xl py-20 text-center">
          <h1 className="text-2xl font-bold">المنتج غير موجود</h1>
          <Button asChild className="mt-4">
            <Link href="/">العودة للرئيسية</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const boughtTogether = related.slice(0, 2);
  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);
  const outOfStock = product.stock <= 0;
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    window.location.href = '/checkout';
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('تم نسخ الرابط');
      }
    } catch {
      // ignore
    }
  };

  const togetherTotal = [product, ...boughtTogether].reduce((sum, p) => sum + p.price, 0);

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-6">
        <Breadcrumb
          items={[
            { label: 'الرئيسية', href: '/' },
            { label: product.category, href: `/category/${product.categorySlug}` },
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* Gallery */}
          <div className="flex flex-col gap-4">
            <div
              className="relative aspect-square overflow-hidden rounded-2xl glass-card"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZooming(true)}
              onMouseLeave={() => setIsZooming(false)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-200"
                style={
                  isZooming
                    ? { transform: `scale(2)`, transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                    : undefined
                }
              />
              {discount > 0 && (
                <span className="absolute top-4 right-4 rounded-full bg-danger px-3 py-1.5 text-sm font-bold text-white shadow-md">
                  خصم {discount}%
                </span>
              )}
              <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-1 text-xs text-white backdrop-blur">
                مرر للتكبير
              </div>
            </div>

            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={cn(
                    'h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all',
                    selectedImage === i ? 'border-primary shadow-soft' : 'border-border opacity-60 hover:opacity-100'
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {product.brand}
                </span>
                {product.isBestSeller && (
                  <span className="rounded-full bg-warning/15 px-3 py-1 text-xs font-semibold text-warning">
                    الأكثر مبيعاً
                  </span>
                )}
                {product.isNewArrival && (
                  <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">
                    جديد
                  </span>
                )}
              </div>

              <h1 className="text-2xl font-bold leading-snug text-foreground sm:text-3xl">
                {product.name}
              </h1>

              <div className="mt-3 flex items-center gap-4">
                <StarRating rating={product.rating} size={18} showValue reviewsCount={product.reviewsCount} />
                <span className="text-sm text-muted-foreground">SKU: {product.sku}</span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              {/* Price */}
              <div className="mt-6 flex items-center gap-3">
                <span className="text-3xl font-extrabold text-primary">
                  {formatPrice(product.price)} ر.س
                </span>
                {product.oldPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="rounded-lg bg-success/15 px-2 py-1 text-sm font-bold text-success">
                    وفّر {formatPrice(product.oldPrice! - product.price)} ر.س
                  </span>
                )}
              </div>

              {/* Stock */}
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Package size={16} className={outOfStock ? 'text-destructive' : 'text-success'} />
                {outOfStock ? (
                  <span className="font-semibold text-destructive">نفذت الكمية</span>
                ) : product.stock <= 10 ? (
                  <span className="font-semibold text-warning">متبقي {product.stock} قطع فقط - اطلب الآن!</span>
                ) : (
                  <span className="font-semibold text-success">متوفر في المخزون</span>
                )}
              </div>

              {/* Quantity + actions */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 rounded-xl border border-border">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-11 w-11 items-center justify-center hover:bg-muted"
                    aria-label="إنقاص"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center text-lg font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="flex h-11 w-11 items-center justify-center hover:bg-muted"
                    aria-label="زيادة"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={outOfStock}
                  className="flex-1 gap-2"
                >
                  <ShoppingCart size={20} />
                  أضف للسلة
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleBuyNow}
                  disabled={outOfStock}
                  className="gap-2"
                >
                  <Zap size={20} />
                  اشترِ الآن
                </Button>
              </div>

              {/* Secondary actions */}
              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={() => toggleWishlist(product)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted',
                    inWishlist && 'border-danger text-danger'
                  )}
                >
                  <Heart size={16} className={inWishlist ? 'fill-danger' : ''} />
                  المفضلة
                </button>
                <button
                  onClick={() => toggleCompare(product)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted',
                    inCompare && 'border-primary text-primary'
                  )}
                >
                  <GitCompare size={16} />
                  مقارنة
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                >
                  <Share2 size={16} />
                  مشاركة
                </button>
              </div>

              {/* Trust badges */}
              <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl glass-card p-4">
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <Truck size={22} className="text-primary" />
                  <span className="text-xs font-medium">توصيل سريع</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <Shield size={22} className="text-primary" />
                  <span className="text-xs font-medium">دفع آمن</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-center">
                  <RotateCcw size={22} className="text-primary" />
                  <span className="text-xs font-medium">إرجاع 14 يوم</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="description">
            <TabsList className="h-auto flex-wrap justify-start gap-1 rounded-xl bg-muted p-1.5">
              <TabsTrigger value="description" className="rounded-lg px-5 py-2.5">الوصف</TabsTrigger>
              <TabsTrigger value="specs" className="rounded-lg px-5 py-2.5">المواصفات</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-lg px-5 py-2.5">التقييمات ({product.reviewsCount})</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4">
              <div className="glass-card rounded-2xl p-6">
                <p className="text-sm leading-loose text-foreground/80">
                  {product.longDescription}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="specs" className="mt-4">
              <div className="glass-card overflow-hidden rounded-2xl">
                <table className="w-full text-sm">
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-muted/30' : ''}>
                        <td className="px-6 py-3 font-semibold text-foreground">{spec.label}</td>
                        <td className="px-6 py-3 text-muted-foreground">{spec.value}</td>
                      </tr>
                    ))}
                    <tr className="bg-muted/30">
                      <td className="px-6 py-3 font-semibold text-foreground">الباركود</td>
                      <td className="px-6 py-3 text-muted-foreground" dir="ltr">{product.barcode}</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-3 font-semibold text-foreground">رمز المنتج</td>
                      <td className="px-6 py-3 text-muted-foreground">{product.sku}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-4">
              <div className="space-y-4">
                <div className="glass-card flex flex-col items-center gap-4 rounded-2xl p-6 sm:flex-row sm:gap-8">
                  <div className="text-center">
                    <div className="text-5xl font-extrabold text-primary">{product.rating.toFixed(1)}</div>
                    <StarRating rating={product.rating} size={18} className="mt-2 justify-center" />
                    <p className="mt-1 text-xs text-muted-foreground">{product.reviewsCount} تقييم</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = star === 5 ? 65 : star === 4 ? 25 : star === 3 ? 7 : star === 2 ? 2 : 1;
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="w-4 text-xs text-muted-foreground">{star}</span>
                          <Star size={12} className="text-warning fill-warning" />
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div className="h-full rounded-full bg-warning" style={{ width: `${count}%` }} />
                          </div>
                          <span className="w-8 text-xs text-muted-foreground">{count}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3">
                  {product.reviews.map((review) => (
                    <div key={review.id} className="glass-card rounded-2xl p-5">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full brand-gradient-bg text-sm font-bold text-white">
                            {review.author.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-foreground">{review.author}</h4>
                              {review.verified && (
                                <span className="flex items-center gap-1 text-xs text-success">
                                  <Check size={12} /> موثّق
                                </span>
                              )}
                            </div>
                            <StarRating rating={review.rating} size={12} />
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/80">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Frequently bought together */}
        {boughtTogether.length > 0 && (
          <div className="mt-12">
            <SectionHeading title="يُشترى معاً غالباً" icon={<Check size={24} />} />
            <div className="glass-card rounded-2xl p-6">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                <div className="flex items-center gap-3">
                  {[product, ...boughtTogether].map((p, i) => (
                    <React.Fragment key={p.id}>
                      <Link href={`/product/${p.slug}`} className="flex flex-col items-center gap-2">
                        <div className="h-24 w-24 overflow-hidden rounded-xl">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                        </div>
                        <span className="line-clamp-1 max-w-24 text-xs font-medium">{p.name}</span>
                        <span className="text-sm font-bold text-primary">{formatPrice(p.price)} ر.س</span>
                      </Link>
                      {i < boughtTogether.length && (
                        <Plus size={20} className="text-muted-foreground" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <div className="border-r border-border pr-6 sm:mr-auto">
                  <p className="text-sm text-muted-foreground">الإجمالي للـ {boughtTogether.length + 1} منتجات</p>
                  <p className="text-2xl font-extrabold text-primary">{formatPrice(togetherTotal)} ر.س</p>
                  <Button
                    className="mt-2 w-full gap-2"
                    onClick={() => {
                      [product, ...boughtTogether].forEach((p) => addItem(p));
                    }}
                  >
                    <ShoppingCart size={18} />
                    أضف الكل للسلة
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <div className="mt-12">
            <SectionHeading
              title="منتجات ذات صلة"
              icon={<Star size={24} />}
              link={{ label: 'عرض المزيد', href: `/category/${product.categorySlug}` }}
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
