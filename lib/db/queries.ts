import { supabase } from '@/lib/supabase/client';
import type { Product, Category, Review, Order } from '@/lib/types';

function mapReview(r: any): Review {
  return {
    id: r.id,
    author: r.author,
    rating: r.rating,
    date: r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : '',
    comment: r.comment || '',
    verified: r.verified ?? true,
  };
}

function mapProduct(r: any, images: any[] = [], reviews: Review[] = []): Product {
  const specs = Array.isArray(r.specifications) ? r.specifications : [];
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    description: r.description || '',
    longDescription: r.long_description || `${r.description || ''} هذا المنتج جزء من تشكيلة مكتبة المركز العلمي الواسعة. نحن نضمن لك جودة عالية وأسعار منافسة مع خدمة توصيل سريعة لجميع المناطق. منتج أصلي 100% مع إمكانية الاستبدال والاسترجاع خلال 14 يوماً.`,
    specifications: specs.length > 0 ? specs : [
      { label: 'العلامة التجارية', value: r.brand || '' },
      { label: 'الفئة', value: r.category_name || '' },
      { label: 'الضمان', value: 'سنة واحدة' },
      { label: 'بلد المنشأ', value: 'مستورد' },
    ],
    images: images.length > 0 ? images.map((i) => i.image_url) : ['https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800'],
    category: r.category_name || '',
    categorySlug: r.category_slug || '',
    brand: r.brand || '',
    barcode: r.barcode || `629${r.id.padStart(10, '0')}`,
    sku: r.sku || `SC-${r.id.replace('p', '').padStart(4, '0')}`,
    stock: r.stock || 0,
    price: Number(r.price) || 0,
    oldPrice: r.old_price ? Number(r.old_price) : undefined,
    rating: Number(r.rating) || 0,
    reviewsCount: Number(r.reviews_count) || 0,
    reviews,
    tags: r.tags || [],
    relatedIds: [],
    isFeatured: !!r.is_featured,
    isBestSeller: !!r.is_bestseller,
    isNewArrival: !!r.is_new,
    isRecommended: !!r.is_recommended,
    isOnOffer: !!r.old_price,
    createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
  };
}

export async function dbGetCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order');
  if (error) throw error;

  const productCounts = await supabase
    .from('products')
    .select('category_id');

  const countMap: Record<string, number> = {};
  (productCounts.data || []).forEach((p: any) => {
    countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
  });

  return (data || []).map((c: any) => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description || c.name,
    icon: c.icon || 'Package',
    image: c.image,
    productCount: countMap[c.id] || 0,
  }));
}

export async function dbGetCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const { count } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', data.id);

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    description: data.description || data.name,
    icon: data.icon || 'Package',
    image: data.image,
    productCount: count || 0,
  };
}

export async function dbGetProducts(): Promise<Product[]> {
  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      categories!inner(slug, name)
    `)
    .order('created_at', { ascending: false });
  if (error) throw error;

  const { data: images } = await supabase
    .from('product_images')
    .select('product_id, image_url')
    .order('sort_order');

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  return (products || []).map((r: any) => {
    const imgs = (images || []).filter((i: any) => i.product_id === r.id);
    const revs = (reviews || []).filter((rv: any) => rv.product_id === r.id).map(mapReview);
    return mapProduct({
      ...r,
      category_slug: r.categories?.slug,
      category_name: r.categories?.name,
    }, imgs, revs);
  });
}

export async function dbGetProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories!inner(slug, name)
    `)
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;

  const { data: images } = await supabase
    .from('product_images')
    .select('image_url')
    .eq('product_id', data.id)
    .order('sort_order');

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('product_id', data.id)
    .order('created_at', { ascending: false });

  return mapProduct({
    ...data,
    category_slug: data.categories?.slug,
    category_name: data.categories?.name,
  }, images || [], (reviews || []).map(mapReview));
}

export async function dbGetProductsByCategory(categorySlug: string): Promise<Product[]> {
  const { data: cat } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .maybeSingle();
  if (!cat) return [];

  const { data: products, error } = await supabase
    .from('products')
    .select(`
      *,
      categories!inner(slug, name)
    `)
    .eq('category_id', cat.id)
    .order('created_at', { ascending: false });
  if (error) throw error;

  const ids = (products || []).map((p: any) => p.id);
  if (ids.length === 0) return [];

  const { data: images } = await supabase
    .from('product_images')
    .select('product_id, image_url')
    .in('product_id', ids)
    .order('sort_order');

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .in('product_id', ids)
    .order('created_at', { ascending: false });

  return (products || []).map((r: any) => {
    const imgs = (images || []).filter((i: any) => i.product_id === r.id);
    const revs = (reviews || []).filter((rv: any) => rv.product_id === r.id).map(mapReview);
    return mapProduct({
      ...r,
      category_slug: r.categories?.slug,
      category_name: r.categories?.name,
    }, imgs, revs);
  });
}

export async function dbGetRelatedProducts(product: Product): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories!inner(slug, name)
    `)
    .eq('category_id', product.categorySlug ? (
      supabase.from('categories').select('id').eq('slug', product.categorySlug).maybeSingle()
    ) : '')
    .neq('id', product.id)
    .limit(4);
  if (error || !data) {
    const { data: fallback } = await supabase
      .from('products')
      .select(`*, categories!inner(slug, name)`)
      .neq('id', product.id)
      .limit(4);
    return (fallback || []).map((r: any) => mapProduct({
      ...r,
      category_slug: r.categories?.slug,
      category_name: r.categories?.name,
    }));
  }
  return data.map((r: any) => mapProduct({
    ...r,
    category_slug: r.categories?.slug,
    category_name: r.categories?.name,
  }));
}

export async function dbSearchProducts(q: string): Promise<Product[]> {
  const term = `%${q}%`;
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories!inner(slug, name)
    `)
    .or(`name.ilike.${term},description.ilike.${term},brand.ilike.${term}`)
    .order('created_at', { ascending: false });
  if (error) throw error;

  return (data || []).map((r: any) => mapProduct({
    ...r,
    category_slug: r.categories?.slug,
    category_name: r.categories?.name,
  }));
}

export async function dbCreateOrder(orderData: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  paymentMethod: string;
  notes?: string;
  items: { productId: string; name: string; image: string; price: number; quantity: number }[];
}): Promise<string> {
  const orderId = `o${Date.now()}`;

  const { data: userData } = await supabase.auth.getUser();
  const userId = userData.user?.id || null;

  const { error: orderError } = await supabase.from('orders').insert({
    id: orderId,
    user_id: userId,
    customer_name: orderData.customerName,
    customer_email: orderData.customerEmail,
    customer_phone: orderData.customerPhone,
    shipping_address: orderData.shippingAddress,
    city: orderData.city,
    status: 'pending',
    subtotal: orderData.subtotal,
    shipping_cost: orderData.shippingCost,
    discount: orderData.discount,
    total: orderData.total,
    payment_method: orderData.paymentMethod,
    notes: orderData.notes || null,
  });
  if (orderError) throw orderError;

  const items = orderData.items.map((item) => ({
    order_id: orderId,
    product_id: item.productId,
    product_name: item.name,
    product_image: item.image,
    price: item.price,
    quantity: item.quantity,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(items);
  if (itemsError) throw itemsError;

  return orderId;
}

export async function dbGetOrders(): Promise<Order[]> {
  const { data: orderRows, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;

  const { data: itemRows } = await supabase
    .from('order_items')
    .select('*')
    .order('id');

  return (orderRows || []).map((o: any) => {
    const items = (itemRows || []).filter((i: any) => i.order_id === o.id);
    return {
      id: o.id,
      user_id: o.user_id,
      number: `SC-${new Date(o.created_at).getFullYear()}-${String(o.id).slice(-4)}`,
      date: o.created_at ? new Date(o.created_at).toISOString().split('T')[0] : '',
      status: o.status,
      total: Number(o.total),
      items: items.map((i: any) => ({
        name: i.product_name,
        image: i.product_image || '',
        price: Number(i.price),
        quantity: Number(i.quantity),
      })),
      address: o.shipping_address,
      trackingSteps: [
        { label: 'تم استلام الطلب', date: o.created_at ? new Date(o.created_at).toLocaleString('ar-SA') : '', done: true },
        { label: 'جاري التجهيز', date: '', done: ['processing', 'shipped', 'delivered'].includes(o.status) },
        { label: 'تم الشحن', date: '', done: ['shipped', 'delivered'].includes(o.status) },
        { label: 'تم التوصيل', date: '', done: o.status === 'delivered' },
      ],
    };
  });
}
