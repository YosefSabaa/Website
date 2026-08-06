'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Percent, Clock, Tag, Copy, Flame, TrendingDown } from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { SectionHeading } from '@/components/shared/section-heading';
import { ProductCard } from '@/components/shared/product-card';
import type { Product } from '@/lib/types';
import { toast } from 'sonner';

export default function OffersPage() {
  const [onOffer, setOnOffer] = React.useState<Product[]>([]);
  const [coupons, setCoupons] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => setOnOffer(d.onOffer || [])).catch(() => setOnOffer([]));
    fetch('/api/content').then(r => r.json()).then(d => setCoupons(d.coupons || [])).catch(() => setCoupons([]));
  }, []);

  const [time, setTime] = React.useState({ days: 5, hours: 12, minutes: 34, seconds: 56 });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let { days, hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; days--; }
        if (days < 0) { days = 0; }
        return { days, hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`تم نسخ كود: ${code}`);
  };

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-6">
        <Breadcrumb items={[{ label: 'الرئيسية', href: '/' }, { label: 'العروض' }]} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 relative overflow-hidden rounded-3xl bg-gradient-to-l from-red-600 via-orange-500 to-amber-400 p-8 text-white shadow-soft-lg sm:p-12">
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-white/10" />
          <div className="relative text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold backdrop-blur"><Flame size={16} /> عروض حصرية لفترة محدودة</div>
            <h1 className="mt-4 text-3xl font-extrabold sm:text-5xl">خصومات تصل إلى 40%</h1>
            <p className="mt-3 text-white/80">عرض العودة للمدارس - لا تفوت الفرصة!</p>
            <div className="mt-6 flex justify-center gap-3">
              {[{ label: 'يوم', value: time.days }, { label: 'ساعة', value: time.hours }, { label: 'دقيقة', value: time.minutes }, { label: 'ثانية', value: time.seconds }].map(t => (
                <div key={t.label} className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md sm:h-24 sm:w-24">
                  <span className="text-2xl font-extrabold sm:text-3xl tabular-nums">{String(t.value).padStart(2, '0')}</span>
                  <span className="text-xs text-white/70">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {coupons.length > 0 && (
          <section className="mt-12">
            <SectionHeading title="كوبونات الخصم" subtitle="انسخ الكود واستخدمه عند الدفع" icon={<Tag size={24} />} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {coupons.map((c, i) => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card relative overflow-hidden rounded-2xl p-5">
                  <div className="absolute -right-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border border-border bg-background" />
                  <div className="absolute -left-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border border-border bg-background" />
                  <div className="text-center"><Percent size={28} className="mx-auto text-primary" /><span className="mt-2 block text-2xl font-extrabold text-primary">{c.discount_text}</span></div>
                  <p className="mt-2 text-center text-sm font-medium text-foreground">{c.description}</p>
                  <div className="mt-3 border-t border-dashed border-border pt-3 text-center">
                    <p className="text-xs text-muted-foreground">الحد الأدنى: {c.min_order}</p>
                    <button onClick={() => copyCode(c.code)} className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-primary bg-primary/5 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"><Copy size={14} /> {c.code}</button>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-12">
          <SectionHeading title="المنتجات المخفّضة" subtitle="أفضل العروض على منتجاتنا" icon={<TrendingDown size={24} />} />
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {onOffer.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
          </div>
        </section>
      </div>
    </SiteLayout>
  );
}
