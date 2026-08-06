'use client';

import * as React from 'react';
import { AdminLayout } from '@/components/shared/admin-layout';
import { Search, Users, UserPlus, TrendingUp, Star, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { formatPrice } from '@/lib/data';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');

  const loadCustomers = () => {
    fetch('/api/admin/customers')
      .then(r => r.json())
      .then(d => { setCustomers(d.customers || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  React.useEffect(() => { loadCustomers(); }, []);

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return !search || c.full_name?.toLowerCase().includes(q) || c.phone?.includes(search);
  });

  const stats = {
    total: customers.length,
    newThisMonth: customers.filter(c => {
      const d = new Date(c.created_at);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
    active: customers.filter(c => c.orders > 0).length,
    avgOrder: customers.length > 0
      ? Math.round(customers.reduce((s, c) => s + c.spending, 0) / customers.length)
      : 0,
  };

  const toggleAdmin = async (id: string, currentVal: boolean) => {
    const res = await fetch('/api/admin/customers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_admin: !currentVal }),
    });
    if (res.ok) {
      toast.success(!currentVal ? 'تم منح صلاحيات المدير' : 'تم إزالة صلاحيات المدير');
      setCustomers(customers.map(c => c.id === id ? { ...c, is_admin: !currentVal } : c));
    } else {
      toast.error('فشل تحديث الصلاحيات');
    }
  };

  return (
    <AdminLayout activeKey="customers">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">إدارة العملاء</h1>
        <p className="text-sm text-muted-foreground">{customers.length} عميل</p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatBox icon={Users} label="إجمالي العملاء" value={stats.total} color="text-primary" bg="bg-primary/10" />
        <StatBox icon={UserPlus} label="عملاء جدد هذا الشهر" value={stats.newThisMonth} color="text-success" bg="bg-success/10" />
        <StatBox icon={TrendingUp} label="عملاء نشطون" value={stats.active} color="text-warning" bg="bg-warning/10" />
        <StatBox icon={Star} label="متوسط الإنفاق" value={`${formatPrice(stats.avgOrder)} ر.س`} color="text-primary" bg="bg-primary/10" />
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="بحث عن عميل بالاسم أو الهاتف..." value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" />
        </div>
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
                <th className="p-3 text-right font-semibold">العميل</th>
                <th className="p-3 text-right font-semibold">الجوال</th>
                <th className="p-3 text-right font-semibold">الطلبات</th>
                <th className="p-3 text-right font-semibold">إجمالي الإنفاق</th>
                <th className="p-3 text-right font-semibold">تاريخ التسجيل</th>
                <th className="p-3 text-right font-semibold">مدير</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full brand-gradient-bg text-sm font-bold text-white">
                        {c.full_name?.charAt(0) || 'م'}
                      </div>
                      <div>
                        <p className="font-medium">{c.full_name}</p>
                        {c.is_admin && <Badge className="mt-0.5 bg-primary/15 text-primary text-[10px]">مدير</Badge>}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-muted-foreground" dir="ltr">{c.phone || '—'}</td>
                  <td className="p-3">{c.orders}</td>
                  <td className="p-3 font-bold text-primary">{formatPrice(c.spending)} ر.س</td>
                  <td className="p-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString('ar-SA')}</td>
                  <td className="p-3">
                    <label className="flex items-center gap-2">
                      <Switch checked={!!c.is_admin} onCheckedChange={() => toggleAdmin(c.id, c.is_admin)} />
                      <Shield size={14} className="text-muted-foreground" />
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="py-12 text-center text-muted-foreground">لا يوجد عملاء</p>}
        </div>
      )}
    </AdminLayout>
  );
}

function StatBox({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: any; color: string; bg: string }) {
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
