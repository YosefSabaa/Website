'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MapPin, Truck, CreditCard, Wallet, Banknote, Check, Tag,
  ShieldCheck, Store, Package,
} from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/lib/context/cart-context';
import { formatPrice } from '@/lib/data';
import { cn } from '@/lib/utils';

const cities = ['الرياض', 'جدة', 'الدمام', 'مكة المكرمة', 'المدينة المنورة', 'الخبر', 'الطائف', 'تبوك', 'أبها', 'بريدة'];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();
  const [delivery, setDelivery] = React.useState('standard');
  const [payment, setPayment] = React.useState('cod');
  const [notes, setNotes] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const shipping = delivery === 'express' ? 35 : subtotal >= 200 ? 0 : 25;
  const tax = Math.round(subtotal * 0.15);
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const city = formData.get('city') as string;
    const district = formData.get('district') as string;
    const address = formData.get('address') as string;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: `${firstName} ${lastName}`,
          customerEmail: email,
          customerPhone: phone,
          shippingAddress: `${city}، ${district}، ${address}`,
          city,
          subtotal,
          shippingCost: shipping,
          discount: 0,
          total,
          paymentMethod: payment,
          notes,
          items: items.map((item) => ({
            productId: item.product.id,
            name: item.product.name,
            image: item.product.images[0],
            price: item.product.price,
            quantity: item.quantity,
          })),
        }),
      });
      const data = await res.json();
      clearCart();
      const orderNumber = `SC-${new Date().getFullYear()}-${String(data.orderId || '').slice(-4) || Math.floor(1000 + Math.random() * 9000)}`;
      router.push(`/order-success?order=${encodeURIComponent(orderNumber)}`);
    } catch {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <SiteLayout>
        <div className="container-px mx-auto max-w-7xl py-20 text-center">
          <Package size={48} className="mx-auto text-muted-foreground" />
          <h1 className="mt-4 text-2xl font-bold">سلتك فارغة</h1>
          <p className="mt-2 text-muted-foreground">أضف منتجات إلى السلة قبل إتمام الطلب</p>
          <Button asChild className="mt-4">
            <Link href="/">التسوق الآن</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-6">
        <Breadcrumb items={[{ label: 'الرئيسية', href: '/' }, { label: 'سلة التسوق', href: '/cart' }, { label: 'إتمام الطلب' }]} />

        <h1 className="mt-4 text-2xl font-bold">إتمام الطلب</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Left - forms */}
            <div className="space-y-6 lg:col-span-2">
              {/* Shipping address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <MapPin size={20} className="text-primary" /> عنوان التوصيل
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="firstName">الاسم الأول *</Label>
                    <Input id="firstName" required placeholder="محمد" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="lastName">الاسم الأخير *</Label>
                    <Input id="lastName" required placeholder="العبدالله" className="mt-1.5" />
                  </div>
                  <div>
                    <Label htmlFor="phone">رقم الجوال *</Label>
                    <Input id="phone" required type="tel" placeholder="05xxxxxxxx" className="mt-1.5" dir="ltr" />
                  </div>
                  <div>
                    <Label htmlFor="email">البريد الإلكتروني *</Label>
                    <Input id="email" required type="email" placeholder="example@mail.com" className="mt-1.5" dir="ltr" />
                  </div>
                  <div>
                    <Label htmlFor="city">المدينة *</Label>
                    <select id="city" required className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm outline-none">
                      {cities.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="district">الحي *</Label>
                    <Input id="district" required placeholder="النرجس" className="mt-1.5" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="address">العنوان التفصيلي *</Label>
                    <Input id="address" required placeholder="الشارع، رقم المبنى، رقم الشقة" className="mt-1.5" />
                  </div>
                </div>
              </motion.div>

              {/* Delivery method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Truck size={20} className="text-primary" /> طريقة التوصيل
                </h2>
                <RadioGroup value={delivery} onValueChange={setDelivery} className="mt-4 space-y-3">
                  <label className={cn('flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all', delivery === 'standard' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')}>
                    <RadioGroupItem value="standard" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Truck size={18} className="text-primary" />
                        <span className="font-semibold">التوصيل العادي</span>
                      </div>
                      <p className="text-sm text-muted-foreground">توصيل خلال 2-5 أيام عمل</p>
                    </div>
                    <span className="font-bold text-primary">{subtotal >= 200 ? 'مجاني' : '25 ر.س'}</span>
                  </label>
                  <label className={cn('flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all', delivery === 'express' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')}>
                    <RadioGroupItem value="express" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Truck size={18} className="text-warning" />
                        <span className="font-semibold">توصيل سريع</span>
                      </div>
                      <p className="text-sm text-muted-foreground">توصيل خلال 24 ساعة</p>
                    </div>
                    <span className="font-bold text-primary">35 ر.س</span>
                  </label>
                  <label className={cn('flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all', delivery === 'pickup' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')}>
                    <RadioGroupItem value="pickup" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Store size={18} className="text-success" />
                        <span className="font-semibold">الاستلام من المتجر</span>
                      </div>
                      <p className="text-sm text-muted-foreground">جاهز خلال 2 ساعة - مجاني</p>
                    </div>
                    <span className="font-bold text-success">مجاني</span>
                  </label>
                </RadioGroup>
              </motion.div>

              {/* Payment method */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <CreditCard size={20} className="text-primary" /> طريقة الدفع
                </h2>
                <RadioGroup value={payment} onValueChange={setPayment} className="mt-4 space-y-3">
                  <label className={cn('flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all', payment === 'cod' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')}>
                    <RadioGroupItem value="cod" />
                    <Banknote size={20} className="text-success" />
                    <span className="font-semibold">الدفع عند الاستلام</span>
                  </label>
                  <label className={cn('flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all', payment === 'card' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')}>
                    <RadioGroupItem value="card" />
                    <CreditCard size={20} className="text-primary" />
                    <span className="font-semibold">بطاقة ائتمانية (مدى/فيزا/ماستركارد)</span>
                  </label>
                  <label className={cn('flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-all', payment === 'wallet' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50')}>
                    <RadioGroupItem value="wallet" />
                    <Wallet size={20} className="text-primary" />
                    <span className="font-semibold">محفظة إلكترونية (Apple Pay)</span>
                  </label>
                </RadioGroup>
              </motion.div>

              {/* Notes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl p-6"
              >
                <h2 className="text-lg font-bold">ملاحظات إضافية</h2>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="أي تعليمات خاصة بتوصيل الطلب..."
                  className="mt-3"
                  rows={3}
                />
              </motion.div>
            </div>

            {/* Right - summary */}
            <div>
              <div className="sticky top-40 glass-card rounded-2xl p-6">
                <h2 className="text-lg font-bold">ملخص الطلب</h2>

                <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.product.images[0]} alt={item.product.name} className="h-14 w-14 rounded-lg object-cover" />
                      <div className="flex-1 text-sm">
                        <h4 className="line-clamp-1 font-semibold">{item.product.name}</h4>
                        <span className="text-xs text-muted-foreground">{item.quantity} × {formatPrice(item.product.price)} ر.س</span>
                      </div>
                      <span className="text-sm font-bold">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="my-4 h-px bg-border" />

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">المجموع الفرعي</span>
                    <span className="font-semibold">{formatPrice(subtotal)} ر.س</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الشحن</span>
                    <span className="font-semibold">{shipping === 0 ? 'مجاني' : `${formatPrice(shipping)} ر.س`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الضريبة (15%)</span>
                    <span className="font-semibold">{formatPrice(tax)} ر.س</span>
                  </div>
                </div>

                <div className="my-4 h-px bg-border" />

                <div className="flex items-center justify-between">
                  <span className="font-bold">الإجمالي</span>
                  <span className="text-xl font-extrabold text-primary">{formatPrice(total)} ر.س</span>
                </div>

                <Button type="submit" disabled={loading} className="mt-4 w-full gap-2" size="lg">
                  {loading ? (
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  ) : (
                    <>
                      <Check size={18} />
                      تأكيد الطلب
                    </>
                  )}
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck size={14} className="text-success" />
                  دفع آمن ومشفّر بالكامل
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </SiteLayout>
  );
}
