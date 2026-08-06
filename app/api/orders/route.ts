import { NextRequest, NextResponse } from 'next/server';
import { dbGetOrders, dbCreateOrder } from '@/lib/db/queries';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ orders: [] });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();

  if (profile?.is_admin) {
    const orders = await dbGetOrders();
    return NextResponse.json({ orders });
  }

  const orders = await dbGetOrders();
  return NextResponse.json({ orders: orders.filter((o: any) => o.user_id === user.id) });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderId = await dbCreateOrder(body);
    return NextResponse.json({ success: true, orderId });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
