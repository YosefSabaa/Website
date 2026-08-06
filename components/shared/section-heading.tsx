'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  link?: { label: string; href: string };
  className?: string;
}

export function SectionHeading({ title, subtitle, icon, link, className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-8 flex items-end justify-between gap-4', className)}>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl brand-gradient-bg text-white shadow-glow">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
      </motion.div>

      {link && (
        <Link
          href={link.href}
          className="group flex shrink-0 items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          {link.label}
          <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
        </Link>
      )}
    </div>
  );
}
