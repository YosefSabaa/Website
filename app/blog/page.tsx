'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, Clock, Search } from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { cn } from '@/lib/utils';

export default function BlogPage() {
  const [posts, setPosts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [activeCat, setActiveCat] = React.useState('الكل');
  const [search, setSearch] = React.useState('');

  React.useEffect(() => {
    fetch('/api/blog').then(r => r.json()).then(d => { setPosts(d.posts || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const categories = ['الكل', ...Array.from(new Set(posts.map(p => p.category)))];
  const filtered = posts.filter(p => (activeCat === 'الكل' || p.category === activeCat) && (!search || p.title.includes(search)));

  if (loading) {
    return <SiteLayout><div className="flex min-h-[50vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></SiteLayout>;
  }

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-6">
        <Breadcrumb items={[{ label: 'الرئيسية', href: '/' }, { label: 'المدونة' }]} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
          <h1 className="text-3xl font-extrabold sm:text-4xl">مدونة المركز العلمي</h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">نصائح ومقالات تعليمية مفيدة للطلاب وأولياء الأمور والمعلمين</p>
        </motion.div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ابحث في المقالات..." className="w-full rounded-xl border border-input bg-background py-2.5 pr-10 pl-3 text-sm outline-none" />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button key={c} onClick={() => setActiveCat(c)} className={cn('rounded-full px-4 py-2 text-sm font-medium transition-colors', activeCat === c ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/70')}>{c}</button>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, i) => (
            <motion.article key={post.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card group overflow-hidden rounded-2xl transition-all hover:shadow-soft-lg hover:-translate-y-1">
              <Link href={`/blog/${post.slug}`}>
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img src={post.image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <span className="absolute top-3 right-3 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">{post.category}</span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.published_at).toLocaleDateString('ar-SA')}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.read_time}</span>
                  </div>
                  <h2 className="mt-3 line-clamp-2 text-lg font-bold transition-colors group-hover:text-primary">{post.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <img src={post.author_avatar} alt={post.author} className="h-8 w-8 rounded-full object-cover" />
                    <span className="text-xs font-medium">{post.author}</span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
        {filtered.length === 0 && <p className="mt-8 text-center text-muted-foreground">لا توجد مقالات</p>}
      </div>
    </SiteLayout>
  );
}
