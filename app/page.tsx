'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  GraduationCap, BookOpen, ShoppingBag, Truck, Award, Users, Package,
  Percent, Star, ArrowLeft, Clock, Shield, Zap, Headphones,
} from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { HeroSlider } from '@/components/shared/hero-slider';
import { SectionHeading } from '@/components/shared/section-heading';
import { CategoryCard } from '@/components/shared/category-card';
import { ProductCard } from '@/components/shared/product-card';
import { ProductCarousel } from '@/components/shared/product-carousel';
import { ReviewCard } from '@/components/shared/review-card';
import { FAQAccordion } from '@/components/shared/faq-accordion';
import { DynamicIcon } from '@/lib/icons';
import type { Product, Category } from '@/lib/types';

const featureBadges = [
  { icon: Truck, title: 'توصيل سريع', desc: 'خلال 1-3 أيام' },
  { icon: Shield, title: 'دفع آمن', desc: 'حماية كاملة' },
  { icon: Award, title: 'منتجات أصلية', desc: 'ضمان الجودة' },
  { icon: Headphones, title: 'دعم 24/7', desc: 'خدمة عملاء' },
];

export default function HomePage() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [featured, setFeatured] = React.useState<Product[]>([]);
  const [bestSellers, setBestSellers] = React.useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = React.useState<Product[]>([]);
  const [recommended, setRecommended] = React.useState<Product[]>([]);
  const [testimonials, setTestimonials] = React.useState<any[]>([]);
  const [faqItems, setFaqItems] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      fetch('/api/products').then(r => r.json()),
      fetch('/api/content').then(r => r.json()),
    ]).then(([p, c]) => {
      setCategories(p.categories || []);
      setFeatured(p.featured || []);
      setBestSellers(p.bestSellers || []);
      setNewArrivals(p.newArrivals || []);
      setRecommended(p.recommended || []);
      setTestimonials(c.testimonials || []);
      setFaqItems(c.faqs || []);
      setStats(c.stats || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <HeroSlider />

      <section className="container-px mx-auto max-w-7xl py-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {featureBadges.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card flex items-center gap-3 rounded-2xl p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl brand-gradient-bg text-white">
                <f.icon size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">{f.title}</h3>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl py-8">
        <SectionHeading title="تسوق حسب الفئة" subtitle="استكشف مجموعتنا الواسعة من الفئات" icon={<GraduationCap size={24} />} link={{ label: 'كل الفئات', href: '/category/stationery' }} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.slice(0, 12).map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} variant="compact" />
          ))}
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl py-8">
        <SectionHeading title="منتجات مميزة" subtitle="اكتشف أفضل منتجاتنا المختارة بعناية" icon={<Star size={24} />} link={{ label: 'عرض الكل', href: '/category/stationery' }} />
        <ProductCarousel>
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </ProductCarousel>
      </section>

      <section className="container-px mx-auto max-w-7xl py-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-blue-600 via-blue-500 to-blue-400 p-8 text-white shadow-soft-lg sm:p-12">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-white/10" />
          <div className="relative grid items-center gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold backdrop-blur-md">
                <Percent size={16} /> عرض العودة للمدارس
              </div>
              <h2 className="text-3xl font-extrabold sm:text-4xl">خصومات تصل إلى 40%</h2>
              <p className="mt-3 max-w-md text-white/80">لا تفوت فرصة الحصول على أفضل المنتجات بأقل الأسعار. العرض لفترة محدودة فقط!</p>
              <Link href="/offers" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-primary transition-transform hover:scale-105">
                <ShoppingBag size={18} /> تسوق العروض الآن
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="container-px mx-auto max-w-7xl py-8">
        <SectionHeading title="الأكثر مبيعاً" subtitle="المنتجات الأكثر طلباً من عملائنا" icon={<Award size={24} />} link={{ label: 'عرض الكل', href: '/offers' }} />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-5">
          {bestSellers.slice(0, 10).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl py-8">
        <SectionHeading title="وصل حديثاً" subtitle="أحدث المنتجات التي وصلت إلى متجرنا" icon={<Zap size={24} />} link={{ label: 'عرض الكل', href: '/category/stationery' }} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {newArrivals.slice(0, 10).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl py-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-emerald-500 to-emerald-400 p-6 text-white">
            <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative">
              <BookOpen size={32} className="mb-3" />
              <h3 className="text-xl font-bold">الكتب الخارجية</h3>
              <p className="mt-1 text-sm text-white/80">مراجع عالمية لجميع المراحل</p>
              <Link href="/category/secondary" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline">تصفح الآن <ArrowLeft size={14} /></Link>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-orange-500 to-amber-400 p-6 text-white">
            <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative">
              <Package size={32} className="mb-3" />
              <h3 className="text-xl font-bold">خدمات الطباعة</h3>
              <p className="mt-1 text-sm text-white/80">طباعة وتجليد وتصوير</p>
              <Link href="/services" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline">اطلب الآن <ArrowLeft size={14} /></Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container-px mx-auto max-w-7xl py-8">
        <SectionHeading title="موصى به لك" subtitle="منتجات مختارة بناءً على تفضيلاتك" icon={<Star size={24} />} />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {recommended.slice(0, 10).map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="container-px mx-auto max-w-7xl py-8">
          <SectionHeading title="آراء عملائنا" subtitle="ماذا يقول عملاؤنا عن خدماتنا" icon={<Users size={24} />} />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {testimonials.map((t, i) => (
              <ReviewCard key={t.id} testimonial={t} index={i} />
            ))}
          </div>
        </section>
      )}

      {stats.length > 0 && (
        <section className="container-px mx-auto max-w-7xl py-12">
          <div className="relative overflow-hidden rounded-3xl brand-gradient-bg p-8 text-white sm:p-12">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-white/10" />
            <div className="relative grid grid-cols-2 gap-6 sm:grid-cols-4">
              {stats.map((s, i) => (
                <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md">
                    <DynamicIcon name={s.icon} size={26} />
                  </div>
                  <div className="text-3xl font-extrabold sm:text-4xl">{s.value}</div>
                  <div className="mt-1 text-sm text-white/80">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {faqItems.length > 0 && (
        <section className="container-px mx-auto max-w-3xl py-8">
          <SectionHeading title="الأسئلة الشائعة" subtitle="إجابات لأكثر الأسئلة شيوعاً" icon={<Headphones size={24} />} link={{ label: 'كل الأسئلة', href: '/faq' }} />
          <FAQAccordion items={faqItems.slice(0, 5)} />
        </section>
      )}
    </SiteLayout>
  );
}
