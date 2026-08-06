'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Clock, Tag, MessageCircle, Send, ThumbsUp, Share2 } from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { Breadcrumb } from '@/components/shared/breadcrumb';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ArticlePage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = React.useState<any>(null);
  const [related, setRelated] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [comment, setComment] = React.useState('');

  React.useEffect(() => {
    fetch(`/api/blog?slug=${slug}`).then(r => r.json()).then(d => {
      setPost(d.post || null);
      if (d.post) {
        fetch('/api/blog').then(r => r.json()).then(all => {
          setRelated((all.posts || []).filter((p: any) => p.id !== d.post.id && p.category === d.post.category).slice(0, 3));
        });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return <SiteLayout><div className="flex min-h-[50vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div></SiteLayout>;
  }

  if (!post) {
    return <SiteLayout><div className="container-px mx-auto max-w-7xl py-20 text-center"><h1 className="text-2xl font-bold">المقال غير موجود</h1><Button asChild className="mt-4"><Link href="/blog">العودة للمدونة</Link></Button></div></SiteLayout>;
  }

  const paragraphs = post.content.split('. ').filter(Boolean);

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-3xl py-6">
        <Breadcrumb items={[{ label: 'الرئيسية', href: '/' }, { label: 'المدونة', href: '/blog' }, { label: post.title }]} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">{post.category}</span>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">{post.title}</h1>
          <div className="mt-4 flex items-center gap-4">
            <img src={post.author_avatar} alt={post.author} className="h-12 w-12 rounded-full object-cover" />
            <div>
              <p className="font-semibold">{post.author}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(post.published_at).toLocaleDateString('ar-SA')}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {post.read_time}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 overflow-hidden rounded-2xl">
          <img src={post.image} alt={post.title} className="w-full" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-8">
          <div className="space-y-4 text-base leading-loose text-foreground/80">
            {paragraphs.map((p: string, i: number) => <p key={i}>{p}.</p>)}
          </div>
          {post.tags?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag: string) => <span key={tag} className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"><Tag size={10} /> {tag}</span>)}
            </div>
          )}
          <div className="mt-6 flex items-center gap-3 border-y border-border py-4">
            <button onClick={() => toast.success('أعجبتك المقالة')} className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"><ThumbsUp size={16} /> أعجبني</button>
            <button onClick={() => { navigator.clipboard.writeText(window.location.href); toast.success('تم نسخ الرابط'); }} className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"><Share2 size={16} /> مشاركة</button>
          </div>
        </motion.div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-6 text-xl font-bold">مقالات ذات صلة</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((p) => (
                <Link key={p.id} href={`/blog/${p.slug}`} className="glass-card group overflow-hidden rounded-xl transition-all hover:shadow-soft">
                  <img src={p.image} alt={p.title} className="aspect-video w-full object-cover transition-transform group-hover:scale-105" />
                  <div className="p-3">
                    <h3 className="line-clamp-2 text-sm font-semibold group-hover:text-primary">{p.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{p.read_time}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </SiteLayout>
  );
}
