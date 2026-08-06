'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Printer } from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { SectionHeading } from '@/components/shared/section-heading';
import { Button } from '@/components/ui/button';
import { DynamicIcon } from '@/lib/icons';

export default function ServicesPage() {
  const [services, setServices] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(d => { setServices(d.services || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <SiteLayout><div className="flex min-h-[50vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></SiteLayout>;
  }

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-6">
        <Breadcrumb items={[{ label: 'الرئيسية', href: '/' }, { label: 'خدماتنا' }]} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 overflow-hidden rounded-3xl glass-card">
          <div className="relative h-56 sm:h-72">
            <img src="https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="خدمات الطباعة" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-primary/90 to-primary/40" />
            <div className="absolute inset-0 flex items-center px-8">
              <div className="max-w-xl text-white">
                <h1 className="text-3xl font-extrabold sm:text-4xl">خدماتنا</h1>
                <p className="mt-3 text-lg text-white/90">طباعة، تصوير، تجليد، تصميم والمزيد — كل ما تحتاجه في مكان واحد</p>
              </div>
            </div>
          </div>
        </motion.div>

        <section className="mt-12">
          <SectionHeading title="خدماتنا المتنوعة" subtitle="نقدم مجموعة شاملة من الخدمات الاحترافية" icon={<Printer size={24} />} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => (
              <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card rounded-2xl p-6 transition-all hover:shadow-soft-lg hover:-translate-y-1">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl brand-gradient-bg text-white shadow-glow"><DynamicIcon name={service.icon} size={26} /></div>
                <h3 className="mt-4 text-lg font-bold">{service.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{service.description}</p>
                <div className="mt-3"><span className="text-lg font-bold text-primary">{service.price}</span></div>
                <ul className="mt-4 space-y-2">
                  {(service.features || []).map((f: string) => <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground"><Check size={14} className="text-success shrink-0" /> {f}</li>)}
                </ul>
                <Button className="mt-5 w-full gap-2" variant="outline">اطلب الخدمة<ArrowLeft size={16} /></Button>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative overflow-hidden rounded-3xl brand-gradient-bg p-8 text-center text-white sm:p-12">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-white/10" />
            <div className="relative">
              <h2 className="text-2xl font-extrabold sm:text-3xl">هل تحتاج خدمة مخصصة؟</h2>
              <p className="mx-auto mt-3 max-w-md text-white/80">تواصل معنا للحصول على عرض سعر مخصص لاحتياجاتك، سواء كانت للمدارس أو المؤسسات أو الأفراد.</p>
              <Button asChild className="mt-6 bg-white text-primary hover:bg-white/90"><a href="/contact">تواصل معنا</a></Button>
            </div>
          </motion.div>
        </section>
      </div>
    </SiteLayout>
  );
}
