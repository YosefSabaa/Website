'use client';

import { formatPrice } from '@/lib/data';
import { cn } from '@/lib/utils';

interface PriceTagProps {
  price: number;
  oldPrice?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceTag({ price, oldPrice, className, size = 'md' }: PriceTagProps) {
  const sizes = {
    sm: { main: 'text-sm', old: 'text-xs' },
    md: { main: 'text-lg', old: 'text-sm' },
    lg: { main: 'text-2xl', old: 'text-base' },
  };
  const discount = oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center gap-2">
        <span className={cn('font-bold text-primary', sizes[size].main)}>
          {formatPrice(price)} ر.س
        </span>
        {oldPrice && oldPrice > price && (
          <span className={cn('text-muted-foreground line-through', sizes[size].old)}>
            {formatPrice(oldPrice)}
          </span>
        )}
      </div>
      {discount > 0 && (
        <span className="text-xs font-semibold text-success">
          وفّر {discount}%
        </span>
      )}
    </div>
  );
}
