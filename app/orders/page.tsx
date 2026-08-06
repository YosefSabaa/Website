'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Package, FileText, Truck, ChevronLeft, Search, Filter, ShoppingBag,
} from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/data';
import type { Order } from '@/lib/types';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: { label: 'قيد الانتظار', color: 'bg-warning/15 text-warning' },
  processing: { label: 'جاري التجهيز', color: 'bg-primary/15 text-primary' },
  shipped: { label: 'تم الشحن', color: 'bg-blue-500/15 text-blue-500' },
  delivered: { label: 'تم التوصيل', color: 'bg-success/15 text-success' },
  cancelled: { label: 'ملغي', color: 'bg-destructive/15 text-destructive' },
};

export default function OrdersPage() {
  const [filter, setFilter] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = orders.filter((o) => {
    if (filter !== 'all' && o.status !== filter) return false;
    if (search && !o.number.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-6">
        <Breadcrumb items={[{ label: 'الرئيسية', href: '/' }, { label: 'حسابي', href: '/profile' }, { label: 'طلباتي' }]} />

        <h1 className="mt-4 text-2xl font-bold">طلباتي</h1>

        {/* Filters + search */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                  filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70'
                )}
              >
                {f === 'all' ? 'الكل' : statusConfig[f as keyof typeof statusConfig].label}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث برقم الطلب..."
              className="w-full rounded-lg border border-input bg-background py-2.5 pr-9 pl-3 text-sm outline-none sm:w-64"
              dir="ltr"
            />
          </div>
        </div>

        {/* Orders */}
        <div className="mt-6 space-y-4">
          {filtered.length === 0 ? (
            <div className="glass-card flex flex-col items-center justify-center gap-4 rounded-2xl py-20 text-center">
              <Package size={48} className="text-muted-foreground" />
              <h3 className="font-bold">لا توجد طلبات</h3>
              <p className="text-sm text-muted-foreground">لم تقم بأي طلبات بعد. ابدأ التسوق الآن!</p>
              <Button asChild><Link href="/">ابدأ التسوق</Link></Button>
            </div>
          ) : (
            filtered.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card overflow-hidden rounded-2xl"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/30 px-5 py-3">
                  <div className="flex items-center gap-4">
                    <span className="font-bold" dir="ltr">{order.number}</span>
                    <span className="text-sm text-muted-foreground">{order.date}</span>
                  </div>
                  <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', statusConfig[order.status].color)}>
                    {statusConfig[order.status].label}
                  </span>
                </div>

                {/* Items */}
                <div className="p-5">
                  <div className="flex flex-wrap gap-3">
                    {order.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-3 rounded-xl border border-border p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.image} alt={item.name} className="h-14 w-14 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <h4 className="line-clamp-1 text-sm font-semibold">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.quantity} × {formatPrice(item.price)} ر.س</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                    <div>
                      <span className="text-sm text-muted-foreground">الإجمالي: </span>
                      <span className="text-lg font-bold text-primary">{formatPrice(order.total)} ر.س</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <FileText size={14} /> الفاتورة
                      </Button>
                      <Button asChild size="sm" className="gap-1.5">
                        <Link href="/track-order">
                          <Truck size={14} /> تتبع الطلب
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
