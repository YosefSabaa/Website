'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, Heart, MapPin, Bell, Tag, Settings, LogOut,
  ShoppingBag, TrendingUp, Clock, CheckCircle2, Truck, User, Plus, Trash2,
} from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/context/auth-context';
import { useWishlist } from '@/lib/context/wishlist-context';
import { formatPrice } from '@/lib/data';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { Order } from '@/lib/types';

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: 'قيد الانتظار', color: 'bg-muted text-foreground' },
  processing: { label: 'جاري التجهيز', color: 'bg-warning/15 text-warning' },
  shipped: { label: 'تم الشحن', color: 'bg-primary/15 text-primary' },
  delivered: { label: 'تم التوصيل', color: 'bg-success/15 text-success' },
  cancelled: { label: 'ملغي', color: 'bg-destructive/15 text-destructive' },
};

const navItems = [
  { label: 'لوحة التحكم', icon: LayoutDashboard, key: 'dashboard' },
  { label: 'طلباتي', icon: Package, key: 'orders', href: '/orders' },
  { label: 'المفضلة', icon: Heart, key: 'wishlist', href: '/wishlist' },
  { label: 'العناوين', icon: MapPin, key: 'addresses' },
  { label: 'الإشعارات', icon: Bell, key: 'notifications' },
  { label: 'الإعدادات', icon: Settings, key: 'settings' },
];

export default function ProfilePage() {
  const { user, profile, signOut, loading } = useAuth();
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const { count: wishlistCount } = useWishlist();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [addresses, setAddresses] = React.useState<any[]>([]);
  const [notifications, setNotifications] = React.useState<any[]>([]);
  const [coupons, setCoupons] = React.useState<any[]>([]);
  const [savingSettings, setSavingSettings] = React.useState(false);
  const [settingsForm, setSettingsForm] = React.useState({ firstName: '', lastName: '', phone: '' });

  React.useEffect(() => {
    if (!user) return;
    fetch('/api/orders').then(r => r.json()).then(d => setOrders(d.orders || [])).catch(() => setOrders([]));
    supabase.from('addresses').select('*').eq('user_id', user.id).then(({ data }) => setAddresses(data || []));
    supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => setNotifications(data || []));
    supabase.from('coupons').select('*').eq('is_active', true).order('sort_order').then(({ data }) => setCoupons(data || []));
    const name = profile?.full_name || '';
    setSettingsForm({ firstName: name.split(' ')[0] || '', lastName: name.split(' ').slice(1).join(' ') || '', phone: profile?.phone || '' });
  }, [user, profile]);

  const userName = profile?.full_name || user?.email || 'مستخدم';
  const userInitial = userName.charAt(0);
  const userEmail = user?.email || '';

  const dashboardStats = [
    { label: 'إجمالي الطلبات', value: String(orders.length), icon: ShoppingBag, color: 'text-primary' },
    { label: 'قيد التوصيل', value: String(orders.filter(o => o.status === 'shipped' || o.status === 'processing').length), icon: Truck, color: 'text-warning' },
    { label: 'تم التوصيل', value: String(orders.filter(o => o.status === 'delivered').length), icon: CheckCircle2, color: 'text-success' },
    { label: 'في المفضلة', value: String(wishlistCount), icon: Heart, color: 'text-danger' },
  ];

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    const { error } = await supabase.from('profiles').update({
      full_name: `${settingsForm.firstName} ${settingsForm.lastName}`.trim(),
      phone: settingsForm.phone,
    }).eq('id', user!.id);
    setSavingSettings(false);
    if (error) toast.error('فشل حفظ التغييرات');
    else toast.success('تم حفظ التغييرات بنجاح');
  };

  const handleAddAddress = async () => {
    const label = prompt('اسم العنوان (مثال: المنزل)');
    if (!label) return;
    const address = prompt('العنوان التفصيلي');
    if (!address) return;
    const phone = prompt('رقم الجوال') || '';
    const { data, error } = await supabase.from('addresses').insert({
      user_id: user!.id, label, address, phone, is_default: addresses.length === 0,
    }).select().single();
    if (!error && data) {
      setAddresses([...addresses, data]);
      toast.success('تم إضافة العنوان');
    }
  };

  const handleDeleteAddress = async (id: string) => {
    const { error } = await supabase.from('addresses').delete().eq('id', id);
    if (!error) {
      setAddresses(addresses.filter(a => a.id !== id));
      toast.success('تم حذف العنوان');
    }
  };

  const markNotificationRead = async (id: string) => {
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  if (loading) {
    return (
      <SiteLayout>
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </SiteLayout>
    );
  }

  if (!user) {
    return (
      <SiteLayout>
        <div className="container-px mx-auto max-w-7xl py-12 text-center">
          <h1 className="text-2xl font-bold">يجب تسجيل الدخول</h1>
          <p className="mt-2 text-muted-foreground">سجل دخولك للوصول إلى حسابك</p>
          <Button asChild className="mt-4"><Link href="/login">تسجيل الدخول</Link></Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-6">
        <Breadcrumb items={[{ label: 'الرئيسية', href: '/' }, { label: 'حسابي' }]} />
        <h1 className="mt-4 text-2xl font-bold">حسابي</h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-4">
          <aside className="lg:col-span-1">
            <div className="glass-card sticky top-40 overflow-hidden rounded-2xl">
              <div className="brand-gradient-bg p-6 text-center text-white">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-bold backdrop-blur">{userInitial}</div>
                <h3 className="mt-3 font-bold">{userName}</h3>
                <p className="text-xs text-white/80" dir="ltr">{userEmail}</p>
              </div>
              <nav className="p-3">
                {navItems.map((item) => (
                  item.href ? (
                    <Link key={item.key} href={item.href}>
                      <div className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                        <item.icon size={18} /> {item.label}
                      </div>
                    </Link>
                  ) : (
                    <button key={item.key} onClick={() => setActiveTab(item.key)} className={cn('flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors', activeTab === item.key ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted')}>
                      <item.icon size={18} /> {item.label}
                    </button>
                  )
                ))}
                <div className="my-2 h-px bg-border" />
                <Link href="/" onClick={() => signOut()} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
                  <LogOut size={18} /> تسجيل الخروج
                </Link>
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-3">
            {activeTab === 'dashboard' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {dashboardStats.map((s) => (
                    <div key={s.label} className="glass-card rounded-2xl p-4 text-center">
                      <s.icon size={24} className={cn('mx-auto mb-2', s.color)} />
                      <div className="text-2xl font-extrabold">{s.value}</div>
                      <div className="text-xs text-muted-foreground">{s.label}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 glass-card rounded-2xl p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 font-bold"><Clock size={18} className="text-primary" /> آخر الطلبات</h2>
                    <Link href="/orders" className="text-sm text-primary hover:underline">عرض الكل</Link>
                  </div>
                  {orders.length === 0 ? (
                    <p className="py-8 text-center text-sm text-muted-foreground">لا توجد طلبات بعد</p>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="flex items-center gap-4 rounded-xl border border-border p-3">
                          <div className="flex -space-x-2">
                            {order.items.slice(0, 3).map((item, i) => (
                              <img key={i} src={item.image} alt={item.name} className="h-12 w-12 rounded-lg border-2 border-background object-cover" />
                            ))}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold" dir="ltr">{order.number}</h4>
                            <p className="text-xs text-muted-foreground">{order.date}</p>
                          </div>
                          <span className={cn('rounded-full px-3 py-1 text-xs font-semibold', statusConfig[order.status]?.color || '')}>{statusConfig[order.status]?.label || order.status}</span>
                          <span className="font-bold text-primary">{formatPrice(order.total)} ر.س</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <Link href="/orders" className="glass-card flex items-center gap-3 rounded-2xl p-4 transition-all hover:shadow-soft"><Package size={22} className="text-primary" /><span className="font-semibold">تتبع الطلبات</span></Link>
                  <Link href="/wishlist" className="glass-card flex items-center gap-3 rounded-2xl p-4 transition-all hover:shadow-soft"><Heart size={22} className="text-danger" /><span className="font-semibold">المفضلة</span></Link>
                  <Link href="/track-order" className="glass-card flex items-center gap-3 rounded-2xl p-4 transition-all hover:shadow-soft"><TrendingUp size={22} className="text-success" /><span className="font-semibold">تتبع شحنة</span></Link>
                </div>
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">عناويني</h2>
                  <Button onClick={handleAddAddress} className="gap-2"><Plus size={16} /> إضافة عنوان</Button>
                </div>
                {addresses.length === 0 ? (
                  <div className="glass-card rounded-2xl p-12 text-center">
                    <MapPin size={40} className="mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">لا توجد عناوين محفوظة</p>
                  </div>
                ) : (
                  addresses.map((addr) => (
                    <div key={addr.id} className="glass-card rounded-2xl p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold">{addr.label}</h3>
                            {addr.is_default && <span className="rounded-full bg-success/15 px-2 py-0.5 text-xs font-semibold text-success">افتراضي</span>}
                          </div>
                          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><MapPin size={14} /> {addr.address}</p>
                          {addr.phone && <p className="mt-1 text-sm text-muted-foreground" dir="ltr">{addr.phone}</p>}
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteAddress(addr.id)} className="text-destructive"><Trash2 size={16} /></Button>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <h2 className="mb-2 text-lg font-bold">الإشعارات</h2>
                {notifications.length === 0 ? (
                  <div className="glass-card rounded-2xl p-12 text-center">
                    <Bell size={40} className="mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground">لا توجد إشعارات</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={cn('glass-card rounded-2xl p-4', !n.is_read && 'ring-1 ring-primary/30')}>
                      <div className="flex items-start gap-3">
                        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', !n.is_read ? 'bg-primary/10' : 'bg-muted')}>
                          <Bell size={18} className={!n.is_read ? 'text-primary' : 'text-muted-foreground'} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{n.title}</h3>
                          <p className="text-sm text-muted-foreground">{n.description}</p>
                        </div>
                        {!n.is_read && <button onClick={() => markNotificationRead(n.id)} className="text-xs text-primary hover:underline">تعليم كمقروء</button>}
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}

            {activeTab === 'coupons' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="mb-4 text-lg font-bold">كوبونات الخصم</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {coupons.map((c) => (
                    <div key={c.id} className="glass-card relative overflow-hidden rounded-2xl p-5">
                      <div className="absolute -right-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border border-border bg-background" />
                      <div className="absolute -left-4 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full border border-border bg-background" />
                      <div className="flex items-center justify-between">
                        <div><span className="text-2xl font-extrabold text-primary">{c.discount_text}</span><span className="text-sm text-muted-foreground"> خصم</span></div>
                        <span className="rounded-full bg-success/15 px-3 py-1 text-xs font-semibold text-success">متاح</span>
                      </div>
                      <p className="mt-2 text-sm font-medium">{c.description}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-mono text-sm font-bold text-primary" dir="ltr">{c.code}</span>
                        <span className="text-xs text-muted-foreground">الحد الأدنى: {c.min_order}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold"><User size={20} className="text-primary" /> الإعدادات</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>الاسم الأول</Label>
                    <Input value={settingsForm.firstName} onChange={(e) => setSettingsForm({ ...settingsForm, firstName: e.target.value })} className="mt-1.5" />
                  </div>
                  <div>
                    <Label>الاسم الأخير</Label>
                    <Input value={settingsForm.lastName} onChange={(e) => setSettingsForm({ ...settingsForm, lastName: e.target.value })} className="mt-1.5" />
                  </div>
                  <div>
                    <Label>البريد الإلكتروني</Label>
                    <Input value={userEmail} dir="ltr" readOnly className="mt-1.5 bg-muted" />
                  </div>
                  <div>
                    <Label>رقم الجوال</Label>
                    <Input value={settingsForm.phone} onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })} dir="ltr" className="mt-1.5" />
                  </div>
                </div>
                <Button onClick={handleSaveSettings} disabled={savingSettings} className="mt-4">{savingSettings ? 'جاري الحفظ...' : 'حفظ التغييرات'}</Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
