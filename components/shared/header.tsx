'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Heart, ShoppingCart, User, Menu, X, ChevronDown,
  Sun, Moon, Package, MapPin, LogOut,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/lib/context/cart-context';
import { useWishlist } from '@/lib/context/wishlist-context';
import { useCompare } from '@/lib/context/compare-context';
import { useAuth } from '@/lib/context/auth-context';
import { cn } from '@/lib/utils';
import { CartDrawer } from '@/components/shared/cart-drawer';
import { SearchOverlay } from '@/components/shared/search-overlay';
import type { Category } from '@/lib/types';

const navLinks = [
  { label: 'الرئيسية', href: '/' },
  { label: 'الكتب الخارجية', href: '/category/secondary' },
  { label: 'الأدوات المدرسية', href: '/category/primary-school' },
  { label: 'القرطاسية', href: '/category/stationery' },
  { label: 'الهدايا', href: '/category/gifts' },
  { label: 'الطباعة', href: '/services' },
  { label: 'العروض', href: '/offers' },
  { label: 'تواصل معنا', href: '/contact' },
];

export function Header({ categories: propCategories }: { categories?: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { count: compareCount } = useCompare();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [catOpen, setCatOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [fetchedCategories, setFetchedCategories] = React.useState<Category[]>([]);
  const categories = propCategories && propCategories.length > 0 ? propCategories : fetchedCategories;

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (propCategories && propCategories.length > 0) return;
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => setFetchedCategories(d.categories || []))
      .catch(() => setFetchedCategories([]));
  }, [propCategories]);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <>
      <div className="sticky top-0 z-40">
        <div className={cn('glass-header transition-shadow', scrolled && 'shadow-soft')}>
          <div className="container-px mx-auto max-w-7xl">
            <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="القائمة">
                    <Menu size={22} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 overflow-y-auto p-0">
                  <MobileNav onClose={() => setMobileOpen(false)} categories={categories} isLoggedIn={!!user} onSignOut={handleSignOut} />
                </SheetContent>
              </Sheet>

              <Link href="/" className="flex shrink-0 items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl brand-gradient-bg text-white shadow-glow">
                  <Package size={22} />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-extrabold leading-none text-foreground">مكتبة المركز العلمي</h1>
                  <p className="text-[10px] text-muted-foreground">Scientific Center Library</p>
                </div>
              </Link>

              <div className="hidden flex-1 lg:block">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex w-full items-center gap-2 rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-background"
                >
                  <Search size={18} />
                  ابحث عن منتجات، كتب، أدوات مدرسية...
                </button>
              </div>

              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSearchOpen(true)} aria-label="بحث">
                  <Search size={20} />
                </Button>

                {mounted && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    aria-label="تبديل الوضع الليلي"
                    className="hidden sm:flex"
                  >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  </Button>
                )}

                {compareCount > 0 && (
                  <Link href="/compare" className="relative hidden sm:flex" aria-label="المقارنة">
                    <Button variant="ghost" size="icon">
                      <Package size={20} />
                      {compareCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-warning px-1 text-[10px] font-bold text-white">
                          {compareCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                )}

                <Link href="/wishlist" className="relative" aria-label="المفضلة">
                  <Button variant="ghost" size="icon">
                    <Heart size={20} />
                    {wishlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold text-white">
                        {wishlistCount}
                      </span>
                    )}
                  </Button>
                </Link>

                <button
                  onClick={() => setCartOpen(true)}
                  className="relative"
                  aria-label="سلة التسوق"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90">
                    <ShoppingCart size={20} />
                  </div>
                  {totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-success px-1 text-[10px] font-bold text-white ring-2 ring-background">
                      {totalItems}
                    </span>
                  )}
                </button>

                {user ? (
                  <div className="hidden items-center gap-1 sm:flex">
                    <Link href="/profile" aria-label="حسابي">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <User size={16} />
                        حسابي
                      </Button>
                    </Link>
                    <Button variant="ghost" size="icon" onClick={handleSignOut} aria-label="تسجيل الخروج">
                      <LogOut size={18} />
                    </Button>
                  </div>
                ) : (
                  <Link href="/login" className="hidden sm:block" aria-label="حسابي">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <User size={16} />
                      دخول
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="pb-3 lg:hidden">
              <div className="flex items-center gap-2 rounded-xl border border-input bg-muted/50 px-3 py-2.5">
                <MapPin size={16} className="text-muted-foreground" />
                <span className="text-xs text-muted-foreground">توصيل إلى: الرياض</span>
              </div>
            </div>
          </div>

          <nav className="border-t border-border/50 bg-background/50 backdrop-blur">
            <div className="container-px mx-auto max-w-7xl">
              <div className="flex items-center gap-1 h-12">
                <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
                  <button className="flex h-12 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted">
                    <Menu size={18} />
                    جميع الفئات
                    <ChevronDown size={16} className={cn('transition-transform', catOpen && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {catOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full z-50 w-72 overflow-hidden rounded-xl border border-border bg-popover shadow-soft-lg"
                      >
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/category/${cat.slug}`}
                            className="flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-muted"
                          >
                            <span className="font-medium text-foreground">{cat.name}</span>
                            <span className="text-xs text-muted-foreground">{cat.productCount}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="hidden items-center gap-1 lg:flex">
                  {navLinks.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          'flex h-12 items-center rounded-lg px-3 text-sm font-medium transition-colors',
                          active ? 'text-primary' : 'text-foreground/70 hover:text-primary hover:bg-muted'
                        )}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="mr-auto lg:mr-0">
                  {mounted && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                      aria-label="تبديل الوضع الليلي"
                      className="sm:hidden"
                    >
                      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <CartDrawer />
      <SearchOverlay open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

function MobileNav({ onClose, categories = [], isLoggedIn, onSignOut }: { onClose: () => void; categories?: Category[]; isLoggedIn: boolean; onSignOut: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="brand-gradient-bg p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <Package size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold">مكتبة المركز العلمي</h2>
            <p className="text-xs text-white/80">Scientific Center Library</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="my-4 h-px bg-border" />

        <h3 className="mb-2 px-4 text-xs font-bold uppercase text-muted-foreground">الفئات</h3>
        <div className="space-y-1">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              onClick={onClose}
              className="block rounded-xl px-4 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-muted"
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="my-4 h-px bg-border" />

        <div className="space-y-1">
          {isLoggedIn ? (
            <>
              <Link href="/profile" onClick={onClose} className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                حسابي
              </Link>
              <button onClick={() => { onSignOut(); onClose(); }} className="block w-full rounded-xl px-4 py-3 text-right text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
                تسجيل الخروج
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={onClose} className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                تسجيل الدخول
              </Link>
              <Link href="/register" onClick={onClose} className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                إنشاء حساب
              </Link>
            </>
          )}
          <Link href="/track-order" onClick={onClose} className="block rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
            تتبع الطلب
          </Link>
        </div>
      </div>
    </div>
  );
}
