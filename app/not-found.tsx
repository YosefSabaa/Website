'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, Search, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary/5 to-background px-4">
      {/* Illustration */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="relative flex h-48 w-48 items-center justify-center sm:h-64 sm:w-64">
          <div className="absolute inset-0 rounded-full bg-primary/10" />
          <div className="absolute inset-4 rounded-full bg-primary/15" />
          <div className="absolute inset-8 rounded-full bg-primary/20" />
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative flex h-24 w-24 items-center justify-center rounded-3xl brand-gradient-bg text-white shadow-glow sm:h-32 sm:w-32"
          >
            <Package size={56} className="sm:h-16 sm:w-16" />
          </motion.div>
        </div>
      </motion.div>

      {/* 404 text */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 text-7xl font-extrabold brand-gradient-text sm:text-9xl"
      >
        404
      </motion.h1>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-xl font-bold text-foreground sm:text-2xl"
      >
        الصفحة غير موجودة
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-2 max-w-md text-center text-muted-foreground"
      >
        عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. تأكد من الرابط أو عُد للصفحة الرئيسية.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <Button asChild size="lg" className="gap-2">
          <Link href="/">
            <Home size={18} />
            العودة للرئيسية
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link href="/search">
            <Search size={18} />
            البحث عن منتج
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
