import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  const [slides, faqs, services, testimonials, coupons, stats, settings] = await Promise.all([
    supabase.from('slides').select('*').order('sort_order'),
    supabase.from('faqs').select('*').order('sort_order'),
    supabase.from('services').select('*').order('sort_order'),
    supabase.from('testimonials').select('*').order('sort_order'),
    supabase.from('coupons').select('*').eq('is_active', true).order('sort_order'),
    supabase.from('store_stats').select('*').order('sort_order'),
    supabase.from('store_settings').select('*').eq('id', 1).maybeSingle(),
  ]);

  return NextResponse.json({
    slides: slides.data || [],
    faqs: faqs.data || [],
    services: services.data || [],
    testimonials: testimonials.data || [],
    coupons: coupons.data || [],
    stats: stats.data || [],
    settings: settings.data || null,
  });
}
