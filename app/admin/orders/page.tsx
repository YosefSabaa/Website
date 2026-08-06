'use client';

import * as React from 'react';
import { AdminLayout } from '@/components/shared/admin-layout';
import { Search, Eye, ShoppingCart, Clock, Truck, CheckCircle, XCircle, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatPrice } from '@/lib/data';
import { toast } from 'sonner';

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: 'قيد الانتظار', color: 'bg-muted text-foreground', icon: Clock },
  processing: { label: 'قيد التجهيز', color: 'bg-warning/15 text-warning', icon: Package },
  shipped: { label: 'تم الشحن', color: 'bg-primary/15 text-primary', icon: Truck },
  delivered: { label: 'تم التوصيل', color: 'bg-success/15 text-success', icon: CheckCircle },
  cancelled: { label: 'ملغي', color: 'bg-destructive/15 text-destructive', icon: XCircle },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [viewing, setViewing] = React.useState<any | null>(null);

  React.useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(d => { setOrders(d.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = orders.filter(o => {
    const matchSearch = !search || o.number.includes(search) || o.customer_name?.includes(search);
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: orders.length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      toast.success('تم تحديث حالة الطلب');
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
      if (viewing?.id === id) setViewing({ ...viewing, status });
    } else {
      toast.error('فشل تحديث الحالة');
    }
  };

  return (
    <AdminLayout activeKey="orders">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
        <p className="text-sm text-muted-foreground">{orders.length} طلب</p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatBox icon={ShoppingCart} label="إجمالي الطلبات" value={stats.total} color="text-primary" bg="bg-primary/10" />
        <StatBox icon={Package} label="قيد التجهيز" value={stats.processing} color="text-warning" bg="bg-warning/10" />
        <StatBox icon={Truck} label="تم الشحن" value={stats.shipped} color="text-primary" bg="bg-primary/10" />
        <StatBox icon={CheckCircle} label="تم التوصيل" value={stats.delivered} color="text-success" bg="bg-success/10" />
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="بحث برقم الطلب أو اسم العميل..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-48"><SelectValue placeholder="كل الحالات" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الحالات</SelectItem>
            {Object.entries(statusConfig).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex h-96 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="p-3 text-right font-semibold">رقم الطلب</th>
                <th className="p-3 text-right font-semibold">التاريخ</th>
                <th className="p-3 text-right font-semibold">العميل</th>
                <th className="p-3 text-right font-semibold">المنتجات</th>
                <th className="p-3 text-right font-semibold">الإجمالي</th>
                <th className="p-3 text-right font-semibold">الحالة</th>
                <th className="p-3 text-right font-semibold">إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-3 font-medium">{order.number}</td>
                  <td className="p-3 text-muted-foreground">{new Date(order.date).toLocaleDateString('ar-SA')}</td>
                  <td className="p-3">{order.customer_name}</td>
                  <td className="p-3 text-muted-foreground">{order.items?.length || 0} منتج</td>
                  <td className="p-3 font-bold text-primary">{formatPrice(order.total)} ر.س</td>
                  <td className="p-3">
                    <Badge className={statusConfig[order.status]?.color || ''}>
                      {statusConfig[order.status]?.label || order.status}
                    </Badge>
                  </td>
                  <td className="p-3">
                    <button onClick={() => setViewing(order)} className="text-primary hover:underline text-sm font-medium">
                      عرض التفاصيل
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="py-12 text-center text-muted-foreground">لا توجد طلبات</p>}
        </div>
      )}

      <Dialog open={!!viewing} onOpenChange={(v) => !v && setViewing(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تفاصيل الطلب {viewing?.number}</DialogTitle>
          </DialogHeader>
          {viewing && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">العميل:</span> {viewing.customer_name}</div>
                <div><span className="text-muted-foreground">الهاتف:</span> {viewing.customer_phone || '—'}</div>
                <div><span className="text-muted-foreground">المدينة:</span> {viewing.city || '—'}</div>
                <div><span className="text-muted-foreground">العنوان:</span> {viewing.shipping_address || '—'}</div>
                <div><span className="text-muted-foreground">الدفع:</span> {viewing.payment_method === 'cod' ? 'دفع عند الاستلام' : viewing.payment_method}</div>
                <div><span className="text-muted-foreground">التاريخ:</span> {new Date(viewing.date).toLocaleString('ar-SA')}</div>
              </div>

              <div className="rounded-lg border border-border p-3">
                <h4 className="mb-2 font-semibold text-sm">المنتجات</h4>
                {viewing.items?.map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                    {item.image && <img src={item.image} alt={item.name} className="h-10 w-10 rounded object-cover" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity} × {formatPrice(item.price)} ر.س</p>
                    </div>
                    <span className="font-bold text-sm">{formatPrice(item.price * item.quantity)} ر.س</span>
                  </div>
                ))}
                <div className="mt-3 flex justify-between border-t border-border pt-3">
                  <span className="font-bold">الإجمالي</span>
                  <span className="font-bold text-primary">{formatPrice(viewing.total)} ر.س</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">تحديث الحالة</label>
                <Select value={viewing.status} onValueChange={(v) => updateStatus(viewing.id, v)}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function StatBox({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: number; color: string; bg: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${bg}`}>
        <Icon size={16} className={color} />
      </div>
      <p className="text-xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
