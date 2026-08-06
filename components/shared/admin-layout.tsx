'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, Star,
  BarChart3, Bell, Settings, LogOut, Menu, X, Package2, Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/context/auth-context';
import { supabase } from '@/lib/supabase/client';

const navItems = [
  { label: 'لوحة التحكم', icon: LayoutDashboard, key: 'dashboard', href: '/admin' },
  { label: 'الطلبات', icon: ShoppingCart, key: 'orders', href: '/admin/orders' },
  { label: 'المنتجات', icon: Package, key: 'products', href: '/admin/products' },
  { label: 'العملاء', icon: Users, key: 'customers', href: '/admin/customers' },
  { label: 'الإعدادات', icon: Settings, key: 'settings', href: '/admin/settings' },
];

export function AdminLayout({ children, activeKey }: { children: React.ReactNode; activeKey: string }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const { user, loading, signOut, profile } = useAuth();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [checkingAdmin, setCheckingAdmin] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('is_admin, full_name')
        .eq('id', user.id)
        .maybeSingle();
      if (!data?.is_admin) {
        router.push('/');
        return;
      }
      setIsAdmin(true);
      setCheckingAdmin(false);
    })();
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  if (loading || checkingAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/30">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="fixed inset-y-0 right-0 z-30 hidden w-64 border-l border-border bg-card lg:block">
        <AdminSidebar activeKey={activeKey} onSignOut={handleSignOut} adminName={profile?.full_name || 'المدير'} />
      </aside>

      {sidebarOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed inset-y-0 right-0 z-50 w-64 border-l border-border bg-card lg:hidden">
            <button onClick={() => setSidebarOpen(false)} className="absolute left-4 top-4 text-muted-foreground">
              <X size={20} />
            </button>
            <AdminSidebar activeKey={activeKey} onNavigate={() => setSidebarOpen(false)} onSignOut={handleSignOut} adminName={profile?.full_name || 'المدير'} />
          </aside>
        </>
      )}

      <div className="flex flex-1 flex-col lg:pr-64">
        <header className="sticky top-0 z-20 glass-header border-b border-border">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden" aria-label="القائمة">
                <Menu size={22} />
              </button>
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl brand-gradient-bg text-white">
                  <Package2 size={18} />
                </div>
                <div>
                  <h1 className="text-sm font-extrabold leading-none">لوحة التحكم</h1>
                  <p className="text-[10px] text-muted-foreground">مكتبة المركز العلمي</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full brand-gradient-bg text-sm font-bold text-white">
                  {(profile?.full_name || 'م').charAt(0)}
                </div>
                <span className="hidden text-sm font-medium sm:block">{profile?.full_name || 'المدير'}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminSidebar({ activeKey, onNavigate, onSignOut, adminName }: { activeKey: string; onNavigate?: () => void; onSignOut: () => void; adminName: string }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 border-b border-border px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl brand-gradient-bg text-white">
          <Package2 size={18} />
        </div>
        <div>
          <h1 className="text-sm font-extrabold leading-none">مكتبة المركز العلمي</h1>
          <p className="text-[10px] text-muted-foreground">Admin Panel</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        {navItems.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              'mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors',
              activeKey === item.key
                ? 'brand-gradient-bg text-white shadow-soft'
                : 'text-foreground/70 hover:bg-muted'
            )}
          >
            <item.icon size={18} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <button onClick={onSignOut} className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
          <LogOut size={18} />
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
