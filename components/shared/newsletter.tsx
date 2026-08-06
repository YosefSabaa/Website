'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Send, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

export function Newsletter() {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: 'Newsletter Subscriber',
        email,
        message: 'Newsletter subscription request',
      });
      if (error) throw error;
      toast.success('تم اشتراكك في النشرة البريدية بنجاح!');
      setEmail('');
    } catch {
      toast.error('فشل الاشتراك، حاول مرة أخرى');
    }
    setLoading(false);
  };

  return (
    <div className="container-px mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative -mt-8 overflow-hidden rounded-3xl brand-gradient-bg p-8 text-white shadow-soft-lg sm:p-12"
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -left-10 -bottom-10 h-52 w-52 rounded-full bg-white/10" />

        <div className="relative grid items-center gap-6 sm:grid-cols-2">
          <div>
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
              <Mail size={24} />
            </div>
            <h3 className="text-2xl font-bold">اشترك في نشرتنا البريدية</h3>
            <p className="mt-2 text-white/80">احصل على آخر العروض والخصومات والمنتجات الجديدة مباشرة في بريدك الإلكتروني</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل بريدك الإلكتروني"
              className="flex-1 rounded-xl border-0 bg-white/95 px-4 py-3 text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-primary transition-all hover:scale-105 disabled:opacity-50"
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <><Send size={18} /> اشتراك</>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
