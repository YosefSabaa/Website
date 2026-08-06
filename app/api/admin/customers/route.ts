import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, phone, created_at, is_admin')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: orders } = await supabase
    .from('orders')
    .select('user_id, total');

  const stats: Record<string, { orders: number; spending: number }> = {};
  (orders || []).forEach((o: any) => {
    if (!o.user_id) return;
    if (!stats[o.user_id]) stats[o.user_id] = { orders: 0, spending: 0 };
    stats[o.user_id].orders++;
    stats[o.user_id].spending += Number(o.total);
  });

  const customers = (data || []).map((p: any) => ({
    id: p.id,
    full_name: p.full_name || 'مستخدم',
    phone: p.phone || '',
    is_admin: p.is_admin,
    created_at: p.created_at,
    orders: stats[p.id]?.orders || 0,
    spending: stats[p.id]?.spending || 0,
  }));

  return NextResponse.json({ customers });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  if (!profile?.is_admin) return NextResponse.json({ error: 'صلاحيات غير كافية' }, { status: 403 });

  const { error } = await supabase
    .from('profiles')
    .update({ is_admin: body.is_admin })
    .eq('id', body.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
