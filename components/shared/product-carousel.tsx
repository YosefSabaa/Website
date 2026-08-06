'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCarouselProps {
  children: React.ReactNode[];
  className?: string;
  itemWidthClass?: string;
}

export function ProductCarousel({ children, className, itemWidthClass = 'min-w-[140px] sm:min-w-[180px] lg:min-w-[220px]' }: ProductCarouselProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (dir: 'next' | 'prev') => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({ left: dir === 'next' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className={cn('relative', className)}>
      <div ref={scrollRef} className="scrollbar-hide flex gap-4 overflow-x-auto scroll-smooth pb-2">
        {children.map((child, i) => (
          <div key={i} className={cn('shrink-0', itemWidthClass)}>
            {child}
          </div>
        ))}
      </div>
      <button
        onClick={() => scroll('prev')}
        aria-label="السابق"
        className="absolute top-1/2 -translate-y-1/2 -right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full glass-card shadow-soft transition-transform hover:scale-110"
      >
        <ChevronRight size={20} />
      </button>
      <button
        onClick={() => scroll('next')}
        aria-label="التالي"
        className="absolute top-1/2 -translate-y-1/2 -left-2 z-10 flex h-10 w-10 items-center justify-center rounded-full glass-card shadow-soft transition-transform hover:scale-110"
      >
        <ChevronLeft size={20} />
      </button>
    </div>
  );
}
