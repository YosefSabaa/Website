import { NextResponse } from 'next/server';
import { dbSearchProducts } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    if (!q.trim()) return NextResponse.json({ products: [] });
    const products = await dbSearchProducts(q);
    return NextResponse.json({ products });
  } catch (e) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
