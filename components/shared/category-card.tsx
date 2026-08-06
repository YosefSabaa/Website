'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { DynamicIcon } from '@/lib/icons';
import type { Category } from '@/lib/types';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  category: Category;
  index?: number;
  variant?: 'default' | 'compact';
}

export function CategoryCard({ category, index = 0, variant = 'default' }: CategoryCardProps) {
  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.2) }}
      >
        <Link
          href={`/category/${category.slug}`}
          className="group flex flex-col items-center gap-3 rounded-2xl glass-card p-5 text-center transition-all hover:shadow-soft-lg hover:-translate-y-1"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl brand-gradient-bg text-white shadow-glow transition-transform group-hover:scale-110">
            <DynamicIcon name={category.icon} size={28} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">{category.name}</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">{category.productCount} منتج</p>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.3) }}
    >
      <Link
        href={`/category/${category.slug}`}
        className="group relative block overflow-hidden rounded-2xl glass-card transition-all hover:shadow-soft-lg hover:-translate-y-1"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={category.image}
            alt={category.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
          <div className="absolute bottom-0 right-0 left-0 p-4 text-white">
            <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
              <DynamicIcon name={category.icon} size={22} />
            </div>
            <h3 className="text-base font-bold drop-shadow">{category.name}</h3>
            <p className={cn('text-xs text-white/80', category.description.length > 30 && 'line-clamp-1')}>
              {category.description}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
