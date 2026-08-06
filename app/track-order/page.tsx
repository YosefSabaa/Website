'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle2, Clock, MapPin, Search, ClipboardList, type LucideIcon } from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPrice } from '@/lib/data';
import { cn } from '@/lib/utils';

const statusIcons: Record<string, LucideIcon> = {
  pending: Clock, processing: Package, shipped: Truck, delivered: CheckCircle2, cancelled: Package,
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = React.useState('');
  const [order, setOrder] = React.useState<any | null>(null);
  const [searched, setSearched] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/track-order?number=${encodeURIComponent(orderNumber.trim())}`);
      const data = await res.json();
      setOrder(data.order || null);
      setSearched(true);
    } catch {
      setOrder(null);
      setSearched(true);
    }
    setLoading(false);
  };

  const trackingSteps = order ? [
    { label: 'تم استلام الطلب', date: new Date(order.created_at).toLocaleString('ar-SA'), done: true },
    { label: 'جاري التجهيز', date: '', done: ['processing', 'shipped', 'delivered'].includes(order.status) },
    { label: 'تم الشحن', date: '', done: ['shipped', 'delivered'].includes(order.status) },
    { label: 'تم التوصيل', date: '', done: order.status === 'delivered' },
  ] : [];

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-3xl py-6">
        <Breadcrumb items={[{ label: 'الرئيسية', href: '/' }, { label: 'تتبع الطلب' }]} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl brand-gradient-bg text-white shadow-glow"><Truck size={32} /></div>
          <h1 className="mt-4 text-2xl font-bold">تتبع طلبك</h1>
          <p className="mt-2 text-muted-foreground">أدخل رقم الطلب لمعرفة حالة الشحنة الحالية</p>
        </motion.div>

        <form onSubmit={handleSearch} className="mt-6 glass-card rounded-2xl p-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <Label htmlFor="orderNumber" className="sr-only">رقم الطلب</Label>
              <Input id="orderNumber" value={orderNumber} onChange={(e) => setOrderNumber(e.target.value)} placeholder="مثال: SC-2026-1001" dir="ltr" className="text-center" />
            </div>
            <Button type="submit" disabled={loading} className="gap-2"><Search size={18} /> {loading ? 'جاري البحث...' : 'تتبع'}</Button>
          </div>
        </form>

        {searched && !order && (
          <div className="mt-6 glass-card flex flex-col items-center gap-3 rounded-2xl py-16 text-center">
            <Package size={48} className="text-muted-foreground" />
            <h3 className="font-bold">لم نجد هذا الطلب</h3>
            <p className="text-sm text-muted-foreground">تأكد من رقم الطلب وحاول مرة أخرى</p>
          </div>
        )}

        {order && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-sm text-muted-foreground">رقم الطلب</span>
                  <h2 className="text-lg font-bold" dir="ltr">SC-{new Date(order.created_at).getFullYear()}-{String(order.id).slice(-4)}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString('ar-SA')}</p>
                </div>
                <div className="text-left">
                  <span className="text-sm text-muted-foreground">الإجمالي</span>
                  <p className="text-lg font-bold text-primary">{formatPrice(order.total)} ر.س</p>
                </div>
              </div>
              {order.shipping_address && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-muted/30 p-3 text-sm">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                  <span className="text-muted-foreground">{order.shipping_address}</span>
                </div>
              )}
              {order.order_items && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {order.order_items.map((item: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 rounded-xl border border-border p-2">
                      {item.product_image && <img src={item.product_image} alt={item.product_name} className="h-12 w-12 rounded-lg object-cover" />}
                      <div>
                        <h4 className="line-clamp-1 text-xs font-semibold">{item.product_name}</h4>
                        <p className="text-xs text-muted-foreground">{item.quantity}×</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="glass-card rounded-2xl p-6">
              <h3 className="mb-6 flex items-center gap-2 font-bold"><ClipboardList size={18} className="text-primary" /> حالة الطلب</h3>
              <div className="space-y-0">
                {trackingSteps.map((step, i) => {
                  const Icon = i === 0 ? Clock : i === 1 ? Package : i === 2 ? Truck : CheckCircle2;
                  const isLast = i === trackingSteps.length - 1;
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={cn('flex h-10 w-10 items-center justify-center rounded-full transition-colors', step.done ? 'bg-success text-white' : 'bg-muted text-muted-foreground')}><Icon size={20} /></div>
                        {!isLast && <div className={cn('w-0.5 flex-1 my-1', step.done ? 'bg-success' : 'bg-border')} style={{ minHeight: '40px' }} />}
                      </div>
                      <div className={cn('pb-6', isLast && 'pb-0')}>
                        <h4 className={cn('font-semibold', step.done ? 'text-foreground' : 'text-muted-foreground')}>{step.label}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">{step.date}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </SiteLayout>
  );
}
