'use client';

import { motion } from 'framer-motion';
import { Search, Package, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: 'search' | 'cart' | 'wishlist' | 'error';
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  className?: string;
}

const iconMap = {
  search: Search,
  cart: Package,
  wishlist: Package,
  error: AlertCircle,
};

export function EmptyState({ icon = 'search', title, description, action, className }: EmptyStateProps) {
  const Icon = iconMap[icon];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('flex flex-col items-center justify-center gap-4 py-16 text-center', className)}
    >
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <Icon size={40} className="text-muted-foreground" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-foreground">{title}</h3>
        {description && <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && (
        <Button asChild={Boolean(action.href)} onClick={action.onClick}>
          {action.href ? <a href={action.href}>{action.label}</a> : action.label}
        </Button>
      )}
    </motion.div>
  );
}
