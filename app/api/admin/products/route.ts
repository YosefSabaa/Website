import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET() {
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      categories!inner(slug, name)
    `)
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: images } = await supabase
    .from('product_images')
    .select('product_id, image_url')
    .order('sort_order');

  const result = (products || []).map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    description: p.description,
    long_description: p.long_description,
    category_id: p.category_id,
    category_name: p.categories?.name,
    category_slug: p.categories?.slug,
    brand: p.brand,
    sku: p.sku,
    barcode: p.barcode,
    stock: p.stock,
    price: Number(p.price),
    old_price: p.old_price ? Number(p.old_price) : null,
    is_featured: p.is_featured,
    is_bestseller: p.is_bestseller,
    is_new: p.is_new,
    is_recommended: p.is_recommended,
    tags: p.tags,
    images: (images || []).filter((i: any) => i.product_id === p.id).map((i: any) => i.image_url),
    created_at: p.created_at,
  }));

  return NextResponse.json({ products: result });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  if (!profile?.is_admin) return NextResponse.json({ error: 'صلاحيات غير كافية' }, { status: 403 });

  const { images, ...productData } = body;
  const productId = body.id || `p${Date.now()}`;
  const slug = body.slug || body.name.replace(/\s+/g, '-').replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, '').toLowerCase();

  const { error } = await supabase.from('products').upsert({
    ...productData,
    id: productId,
    slug,
    price: Number(body.price),
    old_price: body.old_price ? Number(body.old_price) : null,
    stock: Number(body.stock),
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (images && images.length > 0) {
    await supabase.from('product_images').delete().eq('product_id', productId);
    const imgData = images.map((url: string, i: number) => ({
      product_id: productId,
      image_url: url,
      sort_order: i,
    }));
    await supabase.from('product_images').insert(imgData);
  }

  return NextResponse.json({ success: true, id: productId });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'معرف المنتج مطلوب' }, { status: 400 });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'غير مصرح' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .maybeSingle();
  if (!profile?.is_admin) return NextResponse.json({ error: 'صلاحيات غير كافية' }, { status: 403 });

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
