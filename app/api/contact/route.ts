import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { error } = await supabase.from('contact_messages').insert({
    name: body.name,
    email: body.email,
    phone: body.phone || null,
    subject: body.subject || null,
    message: body.message,
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
