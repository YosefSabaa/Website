'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/data';
import { Input } from '@/components/ui/input';
import type { Product } from '@/lib/types';

interface SearchOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const popularSearches = ['كتب خارجية', 'أقلام', 'دفاتر', 'حقائب مدرسية', 'ألوان'];

export function SearchOverlay({ open, onOpenChange }: SearchOverlayProps) {
  const [query, setQuery] = React.useState('');
  const [recent, setRecent] = React.useState<string[]>([]);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const [results, setResults] = React.useState<Product[]>([]);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (query.trim().length < 2) { setResults([]); setSuggestions([]); return; }
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((d) => {
          setResults((d.products || []).slice(0, 6));
          setSuggestions((d.products || []).slice(0, 4).map((p: Product) => p.name));
        })
        .catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (q: string) => {
    if (!q.trim()) return;
    setRecent((prev) => [q, ...prev.filter((r) => r !== q)].slice(0, 5));
    onOpenChange(false);
    window.location.href = `/search?q=${encodeURIComponent(q)}`;
  };

  React.useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => {
        const input = document.getElementById('search-overlay-input');
        input?.focus();
      }, 100);
    }
  }, [open]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto mt-20 w-full max-w-2xl rounded-2xl border border-border bg-popover shadow-soft-lg overflow-hidden"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-border p-4">
              <Search size={22} className="text-primary" />
              <input
                id="search-overlay-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(query)}
                placeholder="ابحث عن منتجات، كتب، أدوات مدرسية..."
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground"
              />
              <button
                onClick={() => onOpenChange(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
                aria-label="إغلاق"
              >
                <X size={20} />
              </button>
            </div>

            <div ref={resultsRef} className="max-h-[60vh] overflow-y-auto p-4">
              {/* Results */}
              {results.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-2 text-xs font-bold uppercase text-muted-foreground">النتائج</h3>
                  <div className="space-y-2">
                    {results.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        onClick={() => onOpenChange(false)}
                        className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images[0]} alt={p.name} className="h-14 w-14 rounded-lg object-cover" />
                        <div className="flex-1">
                          <h4 className="line-clamp-1 text-sm font-semibold text-foreground">{p.name}</h4>
                          <span className="text-xs text-muted-foreground">{p.brand}</span>
                        </div>
                        <span className="text-sm font-bold text-primary">{formatPrice(p.price)} ر.س</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && results.length === 0 && (
                <div className="mb-4">
                  <h3 className="mb-2 text-xs font-bold uppercase text-muted-foreground">اقتراحات</h3>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setQuery(s); handleSubmit(s); }}
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent searches */}
              {query.length === 0 && recent.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase text-muted-foreground">
                    <Clock size={14} /> عمليات البحث الأخيرة
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button
                        key={r}
                        onClick={() => { setQuery(r); handleSubmit(r); }}
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary"
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular searches */}
              {query.length === 0 && (
                <div>
                  <h3 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase text-muted-foreground">
                    <TrendingUp size={14} /> عمليات البحث الشائعة
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((s) => (
                      <button
                        key={s}
                        onClick={() => { setQuery(s); handleSubmit(s); }}
                        className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {query.length >= 2 && results.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">لا توجد نتائج لـ "{query}"</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
