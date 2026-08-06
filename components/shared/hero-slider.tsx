'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingBag, BookOpen, Truck, Tag } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { DynamicIcon } from '@/lib/icons';

interface Slide {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  cta_label: string;
  cta_href: string;
  cta2_label: string;
  cta2_href: string;
  icon: string;
  image: string;
}

export function HeroSlider() {
  const [current, setCurrent] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [slides, setSlides] = React.useState<Slide[]>([]);

  React.useEffect(() => {
    fetch('/api/content')
      .then(r => r.json())
      .then(d => {
        if (d.slides?.length > 0) setSlides(d.slides);
        else setSlides([]);
      })
      .catch(() => setSlides([]));
  }, []);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const next = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  React.useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, slides.length]);

  if (slides.length === 0) {
    return (
      <section className="relative overflow-hidden">
        <div className="container-px mx-auto max-w-7xl py-6">
          <div className="relative h-[420px] overflow-hidden rounded-3xl brand-gradient-bg sm:h-[480px] lg:h-[520px]" />
        </div>
      </section>
    );
  }

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden">
      <div className="container-px mx-auto max-w-7xl py-6">
        <div className="relative h-[420px] overflow-hidden rounded-3xl sm:h-[480px] lg:h-[520px]">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <img src={slide.image} alt={slide.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-l from-primary/95 via-primary/70 to-primary/30" />

            <div className="absolute inset-0 flex items-center">
              <div className="container-px mx-auto max-w-7xl w-full">
                <div className="max-w-lg">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-md"
                  >
                    <DynamicIcon name={slide.icon} size={20} />
                    {slide.badge}
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-extrabold text-white drop-shadow-lg sm:text-4xl lg:text-5xl"
                  >
                    {slide.title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-2 text-xl font-bold text-white/90 sm:text-2xl"
                  >
                    {slide.subtitle}
                  </motion.p>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base"
                  >
                    {slide.description}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-6 flex flex-wrap gap-3"
                  >
                    <Link href={slide.cta_href} className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-primary shadow-lg transition-transform hover:scale-105">
                      <ShoppingBag size={18} />
                      {slide.cta_label}
                    </Link>
                    <Link href={slide.cta2_href} className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-md transition-all hover:bg-white/20">
                      <BookOpen size={18} />
                      {slide.cta2_label}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          <button onClick={prev} aria-label="السابق" className="absolute top-1/2 -translate-y-1/2 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/30">
            <ChevronRight size={22} />
          </button>
          <button onClick={next} aria-label="التالي" className="absolute top-1/2 -translate-y-1/2 left-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-all hover:bg-white/30">
            <ChevronLeft size={22} />
          </button>

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`الشريحة ${i + 1}`}
                className={cn('h-2 rounded-full transition-all', i === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60')}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
