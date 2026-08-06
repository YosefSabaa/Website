'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, Check } from 'lucide-react';

const features = [
  'تتبع طلباتك بسهولة',
  'قائمة مفضلة شخصية',
  'عروض وخصومات حصرية',
  'تسوق أسرع وأسهل',
];

export function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel - branding */}
      <div className="relative hidden w-1/2 overflow-hidden brand-gradient-bg lg:block">
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -left-10 -bottom-10 h-80 w-80 rounded-full bg-white/10" />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <Package size={26} />
            </div>
            <div>
              <h1 className="text-xl font-extrabold">المركز العلمي</h1>
              <p className="text-xs text-white/80">Scientific Center</p>
            </div>
          </Link>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-extrabold leading-tight"
            >
              مرحباً بك في مكتبة المركز العلمي
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-3 max-w-md text-white/80"
            >
              انضم إلى آلاف العملاء الذين يستمتعون بتجربة تسوق مميزة مع أفضل المنتجات والأسعار.
            </motion.p>

            <ul className="mt-8 space-y-3">
              {features.map((f, i) => (
                <motion.li
                  key={f}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 backdrop-blur">
                    <Check size={14} />
                  </div>
                  <span className="text-sm">{f}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <p className="text-xs text-white/60">© 2026 مكتبة المركز العلمي</p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl brand-gradient-bg text-white shadow-glow">
              <Package size={24} />
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-foreground">المركز العلمي</h1>
              <p className="text-[10px] text-muted-foreground">Scientific Center</p>
            </div>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center"
          >
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
          </motion.div>

          {children}
        </div>
      </div>
    </div>
  );
}
