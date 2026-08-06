/*
# Add admin role system and store settings

## Overview
Adds is_admin to profiles, creates store_settings table, adds admin RLS policies.

## Security
- Only admin users can INSERT/UPDATE/DELETE on products, categories, product_images, reviews
- Public read remains for all content tables
- Admin can read all orders and profiles
*/

-- Step 1: Add is_admin column to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false;

-- Step 2: Create is_admin() helper function FIRST
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM profiles WHERE id = auth.uid()),
    false
  );
$$;

-- Step 3: Create store_settings table
CREATE TABLE IF NOT EXISTS store_settings (
  id int PRIMARY KEY DEFAULT 1,
  store_name text DEFAULT 'مكتبة المركز العلمي',
  store_name_en text DEFAULT 'Scientific Center Library',
  logo_url text,
  description text DEFAULT 'مكتبة المركز العلمي - كتب خارجية وأدوات مدرسية وقرطاسية',
  phone text DEFAULT '800-124-5678',
  email text DEFAULT 'info@sc-library.com',
  address text DEFAULT 'الرياض، المملكة العربية السعودية',
  facebook_url text DEFAULT '',
  instagram_url text DEFAULT '',
  twitter_url text DEFAULT '',
  whatsapp_number text DEFAULT '',
  facebook_shop_url text DEFAULT '',
  free_shipping_threshold numeric DEFAULT 200,
  shipping_cost numeric DEFAULT 25,
  express_shipping_cost numeric DEFAULT 35,
  tax_rate numeric DEFAULT 15,
  facebook_catalog_id text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

INSERT INTO store_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_store_settings" ON store_settings;
CREATE POLICY "read_store_settings" ON store_settings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "update_store_settings" ON store_settings;
CREATE POLICY "update_store_settings" ON store_settings FOR UPDATE
  TO authenticated USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Step 4: Admin-only writes on products
DROP POLICY IF EXISTS "insert_products" ON products;
CREATE POLICY "insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "update_products" ON products;
CREATE POLICY "update_products" ON products FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "delete_products" ON products;
CREATE POLICY "delete_products" ON products FOR DELETE
  TO authenticated USING (public.is_admin());

-- Step 5: Admin-only writes on categories
DROP POLICY IF EXISTS "insert_categories" ON categories;
CREATE POLICY "insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "update_categories" ON categories;
CREATE POLICY "update_categories" ON categories FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "delete_categories" ON categories;
CREATE POLICY "delete_categories" ON categories FOR DELETE
  TO authenticated USING (public.is_admin());

-- Step 6: Admin-only writes on product_images
DROP POLICY IF EXISTS "insert_product_images" ON product_images;
CREATE POLICY "insert_product_images" ON product_images FOR INSERT
  TO authenticated WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "update_product_images" ON product_images;
CREATE POLICY "update_product_images" ON product_images FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "delete_product_images" ON product_images;
CREATE POLICY "delete_product_images" ON product_images FOR DELETE
  TO authenticated USING (public.is_admin());

-- Step 7: Admin can manage reviews
DROP POLICY IF EXISTS "delete_reviews" ON reviews;
CREATE POLICY "delete_reviews" ON reviews FOR DELETE
  TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "update_reviews" ON reviews;
CREATE POLICY "update_reviews" ON reviews FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Step 8: Admin can read ALL orders
DROP POLICY IF EXISTS "read_all_orders_admin" ON orders;
CREATE POLICY "read_all_orders_admin" ON orders FOR SELECT
  TO authenticated USING (public.is_admin() OR auth.uid() = user_id);

DROP POLICY IF EXISTS "update_orders_admin" ON orders;
CREATE POLICY "update_orders_admin" ON orders FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Step 9: Admin can read all order_items
DROP POLICY IF EXISTS "read_all_order_items_admin" ON order_items;
CREATE POLICY "read_all_order_items_admin" ON order_items FOR SELECT
  TO authenticated USING (
    public.is_admin() OR
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- Step 10: Admin can read all profiles
DROP POLICY IF EXISTS "read_all_profiles_admin" ON profiles;
CREATE POLICY "read_all_profiles_admin" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id OR public.is_admin());

-- Step 11: Admin can update profiles
DROP POLICY IF EXISTS "update_all_profiles_admin" ON profiles;
CREATE POLICY "update_all_profiles_admin" ON profiles FOR UPDATE
  TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
