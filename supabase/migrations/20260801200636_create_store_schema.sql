/*
# Create store schema for Scientific Center e-commerce

## Overview
Creates all tables needed for a full e-commerce site: categories, products, product images,
reviews, orders, and order items. Also creates a profiles table linked to Supabase auth
for user account information.

## New Tables

1. `categories` - Product categories (e.g., "المرحلة الابتدائية", "القرطاسية")
   - id (text, primary key), slug (text, unique), name (text), description (text),
     icon (text), image (text), sort_order (int)

2. `products` - Products in the store
   - id (text, primary key), slug (text, unique), name (text), description (text),
     long_description (text), category_id (text, FK to categories), brand (text),
     barcode (text), sku (text), stock (int), price (numeric), old_price (numeric),
     rating (numeric), reviews_count (int), tags (text[]), specifications (jsonb),
     is_featured (bool), is_bestseller (bool), is_new (bool), is_recommended (bool),
     created_at (timestamptz)

3. `product_images` - Multiple images per product
   - id (uuid, pk), product_id (text, FK), image_url (text), sort_order (int)

4. `reviews` - Product reviews
   - id (uuid, pk), product_id (text, FK), author (text), rating (int),
     comment (text), verified (bool), created_at (timestamptz)

5. `orders` - Customer orders
   - id (text, pk), user_id (uuid, FK to auth.users, nullable for guest orders),
     customer_name (text), customer_email (text), customer_phone (text),
     shipping_address (text), city (text), status (text), subtotal (numeric),
     shipping_cost (numeric), discount (numeric), total (numeric),
     payment_method (text), notes (text), created_at (timestamptz)

6. `order_items` - Items within an order
   - id (uuid, pk), order_id (text, FK), product_id (text),
     product_name (text), product_image (text), price (numeric), quantity (int)

7. `profiles` - Extended user profile data linked to auth.users
   - id (uuid, pk, FK to auth.users), full_name (text), phone (text),
     created_at (timestamptz)

## Security
- RLS enabled on all tables.
- categories, products, product_images, reviews: public read (TO anon, authenticated),
  no public write (admin-managed data).
- orders: anyone can insert (guest checkout), users can read their own orders.
- order_items: anyone can insert, readable through join with orders.
- profiles: users can read and update only their own profile.
*/

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  icon text DEFAULT 'Package',
  image text,
  sort_order int DEFAULT 0
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  long_description text DEFAULT '',
  category_id text REFERENCES categories(id) ON DELETE SET NULL,
  brand text DEFAULT '',
  barcode text DEFAULT '',
  sku text DEFAULT '',
  stock int DEFAULT 0,
  price numeric(10,2) DEFAULT 0,
  old_price numeric(10,2),
  rating numeric(2,1) DEFAULT 0,
  reviews_count int DEFAULT 0,
  tags text[] DEFAULT '{}',
  specifications jsonb DEFAULT '[]',
  is_featured boolean DEFAULT false,
  is_bestseller boolean DEFAULT false,
  is_new boolean DEFAULT false,
  is_recommended boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Product images
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text REFERENCES products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  sort_order int DEFAULT 0
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text REFERENCES products(id) ON DELETE CASCADE,
  author text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  comment text DEFAULT '',
  verified boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  shipping_address text,
  city text,
  status text DEFAULT 'pending',
  subtotal numeric(10,2) DEFAULT 0,
  shipping_cost numeric(10,2) DEFAULT 0,
  discount numeric(10,2) DEFAULT 0,
  total numeric(10,2) DEFAULT 0,
  payment_method text DEFAULT 'cod',
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id text REFERENCES orders(id) ON DELETE CASCADE,
  product_id text,
  product_name text NOT NULL,
  product_image text,
  price numeric(10,2) DEFAULT 0,
  quantity int DEFAULT 1
);

-- Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Categories: public read, no public write
DROP POLICY IF EXISTS "read_categories" ON categories;
CREATE POLICY "read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- Products: public read, no public write
DROP POLICY IF EXISTS "read_products" ON products;
CREATE POLICY "read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- Product images: public read
DROP POLICY IF EXISTS "read_product_images" ON product_images;
CREATE POLICY "read_product_images" ON product_images FOR SELECT
  TO anon, authenticated USING (true);

-- Reviews: public read, authenticated insert
DROP POLICY IF EXISTS "read_reviews" ON reviews;
CREATE POLICY "read_reviews" ON reviews FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_reviews" ON reviews;
CREATE POLICY "insert_reviews" ON reviews FOR INSERT
  TO authenticated WITH CHECK (true);

-- Orders: public insert (guest checkout), users read own orders
DROP POLICY IF EXISTS "insert_orders" ON orders;
CREATE POLICY "insert_orders" ON orders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "read_own_orders" ON orders;
CREATE POLICY "read_own_orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_orders" ON orders;
CREATE POLICY "update_own_orders" ON orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Order items: public insert, readable by order owner
DROP POLICY IF EXISTS "insert_order_items" ON order_items;
CREATE POLICY "insert_order_items" ON order_items FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "read_own_order_items" ON order_items;
CREATE POLICY "read_own_order_items" ON order_items FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
  );

-- Profiles: users read and update only their own
DROP POLICY IF EXISTS "read_own_profile" ON profiles;
CREATE POLICY "read_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
