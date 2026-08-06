import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: items } = await supabase
    .from('order_items')
    .select('*');

  const result = (orders || []).map((o: any) => ({
    id: o.id,
    number: `SC-${new Date(o.created_at).getFullYear()}-${String(o.id).slice(-4)}`,
    date: o.created_at,
    customer_name: o.customer_name,
    customer_email: o.customer_email,
    customer_phone: o.customer_phone,
    shipping_address: o.shipping_address,
    city: o.city,
    status: o.status,
    subtotal: Number(o.subtotal),
    shipping_cost: Number(o.shipping_cost),
    total: Number(o.total),
    payment_method: o.payment_method,
    notes: o.notes,
    items: (items || []).filter((i: any) => i.order_id === o.id).map((i: any) => ({
      name: i.product_name,
      image: i.product_image,
      price: Number(i.price),
      quantity: Number(i.quantity),
    })),
  }));

  return NextResponse.json({ orders: result });
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
    .from('orders')
    .update({ status: body.status })
    .eq('id', body.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
