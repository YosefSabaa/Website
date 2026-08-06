'use client';

import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import type { Testimonial } from '@/lib/types';

export function ReviewCard({ testimonial, index = 0 }: { testimonial: Testimonial; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.3) }}
      className="glass-card relative overflow-hidden rounded-2xl p-6"
    >
      <Quote className="absolute -top-2 -left-2 h-20 w-20 text-primary/10" />

      <div className="relative">
        <div className="mb-3 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < testimonial.rating ? 'text-warning fill-warning' : 'text-muted-foreground/30'}
            />
          ))}
        </div>

        <p className="mb-4 text-sm leading-relaxed text-foreground/80">
          &ldquo;{testimonial.comment}&rdquo;
        </p>

        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div>
            <h4 className="font-bold text-foreground">{testimonial.name}</h4>
            <p className="text-xs text-muted-foreground">{testimonial.location}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
