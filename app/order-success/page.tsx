'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, FileText, ShoppingBag, Truck, Package, Home } from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function OrderSuccessPage() {
  return (
    <React.Suspense fallback={<div className="py-20" />}>
      <OrderSuccessContent />
    </React.Suspense>
  );
}

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || `SC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleInvoice = () => {
    toast.info('سيتم إرسال الفاتورة إلى بريدك الإلكتروني');
  };

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-2xl py-12">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="glass-card overflow-hidden rounded-3xl p-8 text-center sm:p-12">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-success/15">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: 'spring' }} className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-white"><CheckCircle2 size={36} /></motion.div>
          </motion.div>

          {[0, 1, 2].map((i) => (
            <motion.div key={i} initial={{ scale: 0, opacity: 0.6 }} animate={{ scale: 3, opacity: 0 }} transition={{ delay: 0.3 + i * 0.15, duration: 1, repeat: Infinity, repeatDelay: 2 }} className="pointer-events-none absolute left-1/2 top-12 h-24 w-24 -translate-x-1/2 rounded-full border-2 border-success" style={{ zIndex: -1 }} />
          ))}

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6 text-2xl font-extrabold text-foreground sm:text-3xl">تم تأكيد طلبك بنجاح!</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-2 text-muted-foreground">شكراً لك على طلبك. ستصلك رسالة بتفاصيل الطلب على بريدك الإلكتروني.</motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-6 py-3">
            <span className="text-sm text-muted-foreground">رقم الطلب:</span>
            <span className="text-lg font-bold text-primary" dir="ltr">{orderNumber}</span>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-8 grid grid-cols-3 gap-2">
            {[
              { icon: Package, label: 'تم التأكيد', active: true },
              { icon: Truck, label: 'جاري التجهيز', active: false },
              { icon: Home, label: 'التوصيل', active: false },
            ].map((step, i) => (
              <div key={i} className={`flex flex-col items-center gap-2 rounded-xl p-3 ${step.active ? 'bg-primary/10' : 'bg-muted/50'}`}>
                <step.icon size={24} className={step.active ? 'text-primary' : 'text-muted-foreground'} />
                <span className={`text-xs font-medium ${step.active ? 'text-primary' : 'text-muted-foreground'}`}>{step.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleInvoice} variant="outline" className="flex-1 gap-2"><FileText size={18} /> تحميل الفاتورة</Button>
            <Button asChild className="flex-1 gap-2"><Link href="/track-order"><Truck size={18} /> تتبع الطلب</Link></Button>
            <Button asChild variant="secondary" className="flex-1 gap-2"><Link href="/"><ShoppingBag size={18} /> متابعة التسوق</Link></Button>
          </motion.div>
        </motion.div>
      </div>
    </SiteLayout>
  );
}
