import { NextResponse } from 'next/server';
import { dbGetProductsByCategory, dbGetCategoryBySlug } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    if (!slug) return NextResponse.json({ error: 'Missing slug' }, { status: 400 });

    const [category, products] = await Promise.all([dbGetCategoryBySlug(slug), dbGetProductsByCategory(slug)]);
    if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

    const brands = Array.from(new Set(products.map((p) => p.brand)));
    return NextResponse.json({ category, products, brands });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load category' }, { status: 500 });
  }
}
