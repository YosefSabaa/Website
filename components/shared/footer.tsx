'use client';

import * as React from 'react';
import Link from 'next/link';
import { Package, Mail, Phone, MapPin, Clock, Facebook, Instagram, Twitter, MessageCircle, Send } from 'lucide-react';
import { Newsletter } from '@/components/shared/newsletter';

const footerLinks = {
  shop: [
    { label: 'الكتب الخارجية', href: '/category/secondary' },
    { label: 'الأدوات المدرسية', href: '/category/primary-school' },
    { label: 'القرطاسية', href: '/category/stationery' },
    { label: 'الهدايا', href: '/category/gifts' },
    { label: 'العروض', href: '/offers' },
  ],
  help: [
    { label: 'تتبع الطلب', href: '/track-order' },
    { label: 'الأسئلة الشائعة', href: '/faq' },
    { label: 'سياسة الإرجاع', href: '/faq' },
    { label: 'الشحن والتوصيل', href: '/faq' },
    { label: 'تواصل معنا', href: '/contact' },
  ],
  about: [
    { label: 'من نحن', href: '/about' },
    { label: 'خدماتنا', href: '/services' },
    { label: 'المدونة', href: '/blog' },
    { label: 'لوحة التحكم', href: '/admin' },
  ],
};

export function Footer() {
  const [settings, setSettings] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => setSettings(d.settings))
      .catch(() => setSettings(null));
  }, []);

  const socials = [
    { icon: Facebook, label: 'Facebook', href: settings?.facebook_url || '#' },
    { icon: Instagram, label: 'Instagram', href: settings?.instagram_url || '#' },
    { icon: Twitter, label: 'Twitter', href: settings?.twitter_url || '#' },
    { icon: MessageCircle, label: 'WhatsApp', href: settings?.whatsapp_number ? `https://wa.me/${settings.whatsapp_number}` : '#' },
  ];

  return (
    <footer className="mt-20 border-t border-border bg-muted/30">
      <Newsletter />

      <div className="container-px mx-auto max-w-7xl py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl brand-gradient-bg text-white shadow-glow">
                <Package size={24} />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-foreground">{settings?.store_name || 'مكتبة المركز العلمي'}</h3>
                <p className="text-[10px] text-muted-foreground">{settings?.store_name_en || 'Scientific Center Library'}</p>
              </div>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {settings?.description || 'مكتبة المركز العلمي، وجهتك الأولى للكتب الخارجية والأدوات المدرسية والقرطاسية وخدمات الطباعة. جودة عالية وأسعار منافسة.'}
            </p>

            <div className="mt-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin size={16} className="text-primary" />
                {settings?.address || 'الرياض، المملكة العربية السعودية'}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone size={16} className="text-primary" />
                <span dir="ltr">{settings?.phone || '800-124-5678'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail size={16} className="text-primary" />
                <span dir="ltr">{settings?.email || 'info@sc-library.com'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={16} className="text-primary" />
                السبت - الخميس: 8ص - 11م
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-foreground">التسوق</h4>
            <ul className="space-y-2.5">
              {footerLinks.shop.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-foreground">المساعدة</h4>
            <ul className="space-y-2.5">
              {footerLinks.help.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-bold text-foreground">الشركة</h4>
            <ul className="space-y-2.5">
              {footerLinks.about.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-primary">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <div className="flex items-center gap-2">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground transition-all hover:border-primary hover:text-primary hover:shadow-soft"
              >
                <s.icon size={18} />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">طرق الدفع:</span>
            {['mada', 'visa', 'mastercard', 'apple'].map((m) => (
              <div
                key={m}
                className="flex h-7 items-center justify-center rounded-md border border-border bg-background px-2.5 text-[10px] font-bold uppercase text-muted-foreground"
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-border py-4">
        <div className="container-px mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-2 text-center text-xs text-muted-foreground sm:flex-row sm:text-right">
            <p>© 2026 {settings?.store_name || 'مكتبة المركز العلمي'}. جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-4">
              <Link href="/faq" className="hover:text-primary">سياسة الخصوصية</Link>
              <Link href="/faq" className="hover:text-primary">الشروط والأحكام</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
