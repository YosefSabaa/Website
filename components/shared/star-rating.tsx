'use client';

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
  showValue?: boolean;
  reviewsCount?: number;
}

export function StarRating({
  rating,
  size = 16,
  className,
  showValue = false,
  reviewsCount,
}: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => {
          const fill = Math.max(0, Math.min(1, rating - (i - 1)));
          return (
            <div key={i} className="relative" style={{ width: size, height: size }}>
              <Star
                size={size}
                className="absolute inset-0 text-muted-foreground/30"
              />
              {fill > 0 && (
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${fill * 100}%` }}
                >
                  <Star
                    size={size}
                    className="text-warning fill-warning"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showValue && (
        <span className="text-sm font-semibold text-foreground">
          {rating.toFixed(1)}
        </span>
      )}
      {reviewsCount !== undefined && (
        <span className="text-xs text-muted-foreground">({reviewsCount})</span>
      )}
    </div>
  );
}
