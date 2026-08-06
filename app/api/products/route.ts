import { NextResponse } from 'next/server';
import { dbGetCategories, dbGetProducts } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [categories, products] = await Promise.all([dbGetCategories(), dbGetProducts()]);
    return NextResponse.json({
      categories,
      products,
      featured: products.filter((p) => p.isFeatured),
      bestSellers: products.filter((p) => p.isBestSeller),
      newArrivals: products.filter((p) => p.isNewArrival),
      recommended: products.filter((p) => p.isRecommended),
      onOffer: products.filter((p) => p.isOnOffer),
    });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
}
