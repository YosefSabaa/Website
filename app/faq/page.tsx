'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, MessageCircle, Mail } from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { SectionHeading } from '@/components/shared/section-heading';
import { FAQAccordion } from '@/components/shared/faq-accordion';
import { Button } from '@/components/ui/button';

export default function FAQPage() {
  const [faqItems, setFaqItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(d => { setFaqItems(d.faqs || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const categoriesMap: Record<string, number> = {};
  faqItems.forEach(f => { categoriesMap[f.category] = (categoriesMap[f.category] || 0) + 1; });
  const categories = Object.entries(categoriesMap).map(([title, count]) => ({ title, count }));

  if (loading) {
    return <SiteLayout><div className="flex min-h-[50vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></SiteLayout>;
  }

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-4xl py-6">
        <Breadcrumb items={[{ label: 'الرئيسية', href: '/' }, { label: 'الأسئلة الشائعة' }]} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl brand-gradient-bg text-white shadow-glow"><HelpCircle size={32} /></div>
          <h1 className="mt-4 text-3xl font-extrabold sm:text-4xl">الأسئلة الشائعة</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">إجابات على أكثر الأسئلة شيوعاً من عملائنا. لم تجد إجابتك؟ تواصل معنا.</p>
        </motion.div>

        {categories.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {categories.map((c, i) => (
              <motion.div key={c.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card rounded-2xl p-5 text-center">
                <h3 className="text-sm font-bold">{c.title}</h3>
                <p className="text-xs text-muted-foreground">{c.count} أسئلة</p>
              </motion.div>
            ))}
          </div>
        )}

        <section className="mt-10">
          <SectionHeading title="كل الأسئلة" icon={<HelpCircle size={24} />} />
          <FAQAccordion items={faqItems} />
        </section>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-10 glass-card rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold">لم تجد إجابة لسؤالك؟</h2>
          <p className="mt-2 text-sm text-muted-foreground">فريق خدمة العملاء جاهز لمساعدتك في أي وقت</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button className="gap-2"><MessageCircle size={18} /> واتساب</Button>
            <Button variant="outline" className="gap-2" asChild><a href="/contact"><Mail size={18} /> تواصل معنا</a></Button>
          </div>
        </motion.div>
      </div>
    </SiteLayout>
  );
}
