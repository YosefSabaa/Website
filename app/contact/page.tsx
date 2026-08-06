'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, Facebook, Instagram, Send, MapPinHouse } from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ContactPage() {
  const [settings, setSettings] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(d => setSettings(d.settings)).catch(() => setSettings(null));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          subject: formData.get('subject'),
          message: formData.get('message'),
        }),
      });
      if (res.ok) {
        toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً');
        form.reset();
      } else {
        toast.error('فشل إرسال الرسالة');
      }
    } catch {
      toast.error('فشل إرسال الرسالة');
    }
    setLoading(false);
  };

  const contactMethods = [
    { icon: Phone, label: 'الهاتف', value: settings?.phone || '800-124-5678', href: `tel:${settings?.phone || '8001245678'}`, dir: 'ltr' },
    { icon: MessageCircle, label: 'واتساب', value: settings?.whatsapp_number || '050-123-4567', href: settings?.whatsapp_number ? `https://wa.me/${settings.whatsapp_number}` : '#', dir: 'ltr' },
    { icon: Mail, label: 'البريد الإلكتروني', value: settings?.email || 'info@sc-library.com', href: `mailto:${settings?.email || 'info@sc-library.com'}`, dir: 'ltr' },
  ];

  const socials = [
    { icon: Facebook, label: 'Facebook', href: settings?.facebook_url || '#' },
    { icon: Instagram, label: 'Instagram', href: settings?.instagram_url || '#' },
  ];

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-6">
        <Breadcrumb items={[{ label: 'الرئيسية', href: '/' }, { label: 'تواصل معنا' }]} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl">تواصل معنا</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">نحن هنا لمساعدتك. تواصل معنا عبر أي من الطرق التالية أو أرسل لنا رسالة مباشرة</p>
        </motion.div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {contactMethods.map((m, i) => (
            <motion.a key={m.label} href={m.href} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card flex flex-col items-center gap-3 rounded-2xl p-6 text-center transition-all hover:shadow-soft-lg hover:-translate-y-1">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl brand-gradient-bg text-white shadow-glow"><m.icon size={24} /></div>
              <div><p className="text-sm text-muted-foreground">{m.label}</p><p className="mt-1 font-bold text-foreground" dir={m.dir}>{m.value}</p></div>
            </motion.a>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-6">
            <h2 className="text-xl font-bold">أرسل لنا رسالة</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label htmlFor="name">الاسم *</Label><Input id="name" name="name" required placeholder="اسمك الكامل" className="mt-1.5" /></div>
                <div><Label htmlFor="email">البريد الإلكتروني *</Label><Input id="email" name="email" type="email" required placeholder="example@mail.com" dir="ltr" className="mt-1.5" /></div>
              </div>
              <div><Label htmlFor="phone">رقم الجوال</Label><Input id="phone" name="phone" type="tel" placeholder="05xxxxxxxx" dir="ltr" className="mt-1.5" /></div>
              <div><Label htmlFor="subject">الموضوع *</Label><Input id="subject" name="subject" required placeholder="موضوع الرسالة" className="mt-1.5" /></div>
              <div><Label htmlFor="message">الرسالة *</Label><Textarea id="message" name="message" required placeholder="اكتب رسالتك هنا..." rows={5} className="mt-1.5" /></div>
              <Button type="submit" disabled={loading} className="w-full gap-2" size="lg">{loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" /> : <><Send size={18} /> إرسال الرسالة</>}</Button>
            </form>
          </motion.div>

          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="glass-card overflow-hidden rounded-2xl">
              <div className="relative flex h-56 items-center justify-center bg-muted">
                <div className="relative flex flex-col items-center gap-2 text-muted-foreground">
                  <MapPin size={40} className="text-primary" />
                  <p className="font-semibold">{settings?.address || 'الرياض، المملكة العربية السعودية'}</p>
                </div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6">
              <h3 className="flex items-center gap-2 font-bold"><MapPinHouse size={18} className="text-primary" /> العنوان</h3>
              <p className="mt-2 text-sm text-muted-foreground">{settings?.address || 'الرياض، المملكة العربية السعودية'}</p>
              <div className="mt-4 flex gap-2">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl border border-border transition-all hover:border-primary hover:text-primary"><s.icon size={18} /></a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
