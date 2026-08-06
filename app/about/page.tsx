'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Award, Users, Package, Truck, Heart, Lightbulb } from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { SectionHeading } from '@/components/shared/section-heading';
import { DynamicIcon } from '@/lib/icons';

const values = [
  { icon: 'Award', title: 'الجودة', desc: 'نقدم منتجات أصلية وعالية الجودة فقط' },
  { icon: 'Users', title: 'العميل أولاً', desc: 'رضا العملاء هو أولويتنا القصوى' },
  { icon: 'Truck', title: 'السرعة', desc: 'توصيل سريع وخدمة فعالة لكل المناطق' },
  { icon: 'Heart', title: 'الشغف', desc: 'نحب ما نقوم به ونوليه كل اهتمامنا' },
];

export default function AboutPage() {
  const [stats, setStats] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(d => setStats(d.stats || [])).catch(() => setStats([]));
  }, []);

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-6">
        <Breadcrumb items={[{ label: 'الرئيسية', href: '/' }, { label: 'من نحن' }]} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 overflow-hidden rounded-3xl glass-card">
          <div className="relative h-64 sm:h-80">
            <img src="https://images.pexels.com/photos/256431/pexels-photo-256431.jpeg?auto=compress&cs=tinysrgb&w=1600" alt="المكتبة" className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-primary/90 to-primary/40" />
            <div className="absolute inset-0 flex items-center px-8">
              <div className="max-w-xl text-white">
                <h1 className="text-3xl font-extrabold sm:text-4xl">مكتبة المركز العلمي</h1>
                <p className="mt-3 text-lg text-white/90">وجهتك الأولى للكتب والأدوات المدرسية منذ 2014</p>
              </div>
            </div>
          </div>
        </motion.div>

        <section className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-center">
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl font-bold">قصتنا</h2>
            <div className="mt-4 space-y-3 text-sm leading-loose text-muted-foreground">
              <p>بدأت مكتبة المركز العلمي رحلتها في عام 2014 كمتجر صغير لبيع الكتب الخارجية والأدوات المدرسية. ومنذ ذلك الحين، نمونا لتصبح واحدة من أكبر المكتبات في المملكة العربية السعودية.</p>
              <p>نؤمن بأن التعليم هو أساس التطور، لذلك نسعى لتوفير كل ما يحتاجه الطلاب والمعلمون من كتب ومراجع وأدوات بأفضل الأسعار. نقدم أيضاً خدمات طباعة وتجليد احترافية للبحوث والرسائل العلمية.</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <img src="https://images.pexels.com/photos/1370750/pexels-photo-1370750.jpeg?auto=compress&cs=tinysrgb&w=800" alt="المكتبة" className="rounded-2xl" />
          </motion.div>
        </section>

        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card rounded-2xl p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl brand-gradient-bg text-white"><Eye size={28} /></div>
            <h3 className="mt-4 text-xl font-bold">رؤيتنا</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">أن نكون المكتبة الرائدة في المملكة العربية السعودية في توفير الكتب الخارجية والأدوات المدرسية، وأن نكون الشريك الأول لكل طالب ومعلم في رحلته التعليمية.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl brand-gradient-bg text-white"><Target size={28} /></div>
            <h3 className="mt-4 text-xl font-bold">رسالتنا</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">توفير منتجات تعليمية ومدرسية عالية الجودة بأسعار منافسة، مع خدمة عملاء متميزة وتوصيل سريع، لدعم رحلة التعليم في مجتمعنا.</p>
          </motion.div>
        </section>

        <section className="mt-12">
          <SectionHeading title="قيمنا" subtitle="المبادئ التي نؤمن بها" icon={<Lightbulb size={24} />} />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card rounded-2xl p-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl brand-gradient-bg text-white"><DynamicIcon name={v.icon} size={26} /></div>
                <h3 className="mt-3 font-bold">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {stats.length > 0 && (
          <section className="mt-12">
            <div className="relative overflow-hidden rounded-3xl brand-gradient-bg p-8 text-white sm:p-12">
              <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
              <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-white/10" />
              <div className="relative grid grid-cols-2 gap-6 sm:grid-cols-4">
                {stats.map((s, i) => (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur"><DynamicIcon name={s.icon} size={26} /></div>
                    <div className="text-3xl font-extrabold sm:text-4xl">{s.value}</div>
                    <div className="mt-1 text-sm text-white/80">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
