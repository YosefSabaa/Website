'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, TrendingUp, Clock, X, Package } from 'lucide-react';
import { SiteLayout } from '@/components/shared/site-layout';
import { ProductCard } from '@/components/shared/product-card';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';

const popularSearches = ['كتب خارجية', 'أقلام', 'دفاتر', 'حقائب مدرسية', 'ألوان'];

export default function SearchPage() {
  return (
    <React.Suspense fallback={<div className="py-20" />}>
      <SearchPageContent />
    </React.Suspense>
  );
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = React.useState(initialQuery);
  const [recent, setRecent] = React.useState<string[]>([]);
  const [hasSearched, setHasSearched] = React.useState(Boolean(initialQuery));
  const [results, setResults] = React.useState<Product[]>([]);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);

  React.useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) setRecent(JSON.parse(stored));
  }, []);

  React.useEffect(() => {
    if (!query.trim()) { setResults([]); setSuggestions([]); return; }
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`).then(r => r.json()).then(d => {
        setResults(d.products || []);
        setSuggestions((d.products || []).slice(0, 5).map((p: Product) => p.name));
      }).catch(() => setResults([]));
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (q: string) => {
    setQuery(q);
    setHasSearched(true);
    if (q.trim()) {
      const updated = [q, ...recent.filter(r => r !== q)].slice(0, 5);
      setRecent(updated);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
    }
  };

  const clearRecent = () => { setRecent([]); localStorage.removeItem('recentSearches'); };

  return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-7xl py-6">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center gap-3 rounded-2xl glass-card p-3">
            <Search size={24} className="text-primary" />
            <input autoFocus value={query} onChange={(e) => { setQuery(e.target.value); setHasSearched(false); }} onKeyDown={(e) => e.key === 'Enter' && handleSearch(query)} placeholder="ابحث عن منتجات، كتب، أدوات مدرسية..." className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground" />
            {query && <button onClick={() => { setQuery(''); setHasSearched(false); }} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>}
          </div>
          {suggestions.length > 0 && !hasSearched && (
            <div className="mt-2 rounded-xl glass-card p-3">
              {suggestions.map(s => (
                <button key={s} onClick={() => handleSearch(s)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-right text-sm transition-colors hover:bg-muted"><Search size={14} className="text-muted-foreground" /> {s}</button>
              ))}
            </div>
          )}
        </div>

        {!hasSearched && (
          <div className="mx-auto mt-8 max-w-2xl space-y-6">
            {recent.length > 0 && (
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-foreground"><Clock size={16} /> عمليات البحث الأخيرة</h3>
                  <button onClick={clearRecent} className="text-xs text-muted-foreground hover:text-foreground">مسح</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recent.map(r => <button key={r} onClick={() => handleSearch(r)} className="flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1.5 text-sm transition-colors hover:border-primary">{r} <X size={12} className="text-muted-foreground" /></button>)}
                </div>
              </div>
            )}
            <div>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground"><TrendingUp size={16} /> عمليات البحث الشائعة</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map(s => <button key={s} onClick={() => handleSearch(s)} className="rounded-full bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20">{s}</button>)}
              </div>
            </div>
          </div>
        )}

        {hasSearched && (
          <div className="mt-8">
            <p className="mb-4 text-sm text-muted-foreground">{results.length > 0 ? <>وجدنا <span className="font-bold text-foreground">{results.length}</span> نتيجة لـ &ldquo;{query}&rdquo;</> : <>لا توجد نتائج لـ &ldquo;{query}&rdquo;</>}</p>
            {results.length === 0 ? (
              <div className="glass-card flex flex-col items-center justify-center gap-3 rounded-2xl py-20 text-center">
                <Package size={48} className="text-muted-foreground" />
                <h3 className="font-bold">لا توجد منتجات مطابقة</h3>
                <Button asChild><a href="/category/stationery">تصفح الفئات</a></Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
