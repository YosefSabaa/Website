import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderNumber = searchParams.get('number');
  if (!orderNumber) return NextResponse.json({ error: 'رقم الطلب مطلوب' }, { status: 400 });

  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      order_items(*)
    `)
    .ilike('id', `%${orderNumber.replace('SC-', '').replace(/-/g, '')}%`)
    .maybeSingle();

  if (error || !data) {
    const { data: byNumber } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
      .limit(20);

    const found = (byNumber || []).find((o: any) =>
      `SC-${new Date(o.created_at).getFullYear()}-${String(o.id).slice(-4)}`.toLowerCase() === orderNumber.toLowerCase()
    );

    if (!found) return NextResponse.json({ order: null });
    return NextResponse.json({ order: found });
  }

  return NextResponse.json({ order: data });
}
