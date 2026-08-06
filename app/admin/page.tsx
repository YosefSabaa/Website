'use client';

import * as React from 'react';
import { AdminLayout } from '@/components/shared/admin-layout';
import { TrendingUp, ShoppingCart, Users, Package, DollarSign, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/data';

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'قيد الانتظار', color: 'bg-muted text-foreground' },
  processing: { label: 'قيد التجهيز', color: 'bg-warning/15 text-warning' },
  shipped: { label: 'تم الشحن', color: 'bg-primary/15 text-primary' },
  delivered: { label: 'تم التوصيل', color: 'bg-success/15 text-success' },
  cancelled: { label: 'ملغي', color: 'bg-destructive/15 text-destructive' },
};

export default function AdminDashboardPage() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [products, setProducts] = React.useState<any[]>([]);
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      fetch('/api/admin/orders').then(r => r.json()),
      fetch('/api/admin/products').then(r => r.json()),
      fetch('/api/admin/customers').then(r => r.json()),
    ]).then(([o, p, c]) => {
      setOrders(o.orders || []);
      setProducts(p.products || []);
      setCustomers(c.customers || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const todayOrders = orders.filter(o => {
    const d = new Date(o.date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });
  const lowStock = products.filter(p => p.stock <= 10);
  const recentOrders = orders.slice(0, 5);
  const topProducts = products.filter(p => p.is_bestseller).slice(0, 5);

  if (loading) {
    return (
      <AdminLayout activeKey="dashboard">
        <div className="flex h-96 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout activeKey="dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground">نظرة عامة على أداء المتجر</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={DollarSign} label="إجمالي المبيعات" value={`${formatPrice(totalRevenue)} ر.س`} color="text-success" bg="bg-success/10" />
        <StatCard icon={ShoppingCart} label="إجمالي الطلبات" value={String(orders.length)} color="text-primary" bg="bg-primary/10" />
        <StatCard icon={Users} label="العملاء" value={String(customers.length)} color="text-warning" bg="bg-warning/10" />
        <StatCard icon={Package} label="منتجات منخفضة المخزون" value={String(lowStock.length)} color="text-destructive" bg="bg-destructive/10" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <Clock size={20} className="text-primary" />
            أحدث الطلبات
          </h2>
          {recentOrders.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">لا توجد طلبات بعد</p>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border border-border/50 p-3">
                  <div>
                    <p className="font-medium text-sm">{order.number}</p>
                    <p className="text-xs text-muted-foreground">{order.customer_name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-primary">{formatPrice(order.total)} ر.س</span>
                    <Badge className={statusConfig[order.status]?.color || ''}>
                      {statusConfig[order.status]?.label || order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-bold">
            <TrendingUp size={20} className="text-success" />
            الأكثر مبيعاً
          </h2>
          {topProducts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">لا توجد منتجات</p>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border/50 p-3">
                  {p.images?.[0] && (
                    <img src={p.images[0]} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category_name}</p>
                  </div>
                  <span className="font-bold text-sm text-primary">{formatPrice(p.price)} ر.س</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="mt-6 rounded-xl border border-destructive/30 bg-destructive/5 p-5">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-destructive">
            <Package size={20} />
            تنبيه: منتجات منخفضة المخزون
          </h2>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {lowStock.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg bg-card p-3">
                <span className="truncate text-sm font-medium">{p.name}</span>
                <Badge variant="destructive" className="shrink-0 mr-2">متبقي {p.stock}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: string; color: string; bg: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${bg}`}>
        <Icon size={20} className={color} />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
