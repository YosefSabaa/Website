import { NextResponse } from 'next/server';
import { dbGetProductBySlug, dbGetRelatedProducts } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

    const product = await dbGetProductBySlug(slug);
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const related = await dbGetRelatedProducts(product);
    return NextResponse.json({ product, related });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load product' }, { status: 500 });
  }
}
