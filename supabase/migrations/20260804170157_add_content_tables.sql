/*
# Add content tables: blog_posts, faqs, services, testimonials, coupons, contact_messages, addresses, notifications, store_stats, slides

## Tables
1. blog_posts - blog articles with author, category, content
2. faqs - FAQ items with category
3. services - printing/services offered
4. testimonials - customer reviews for homepage
5. coupons - discount codes
6. contact_messages - messages from contact form
7. addresses - user saved addresses
8. notifications - user notifications
9. store_stats - homepage statistics (editable from admin)
10. slides - hero slider content (editable from admin)
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id text PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text DEFAULT '',
  content text DEFAULT '',
  category text DEFAULT 'نصائح مدرسية',
  tags text[] DEFAULT '{}',
  image text,
  author text DEFAULT 'فريق المركز العلمي',
  author_avatar text DEFAULT 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
  read_time text DEFAULT '5 دقائق',
  published_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text DEFAULT '',
  category text DEFAULT 'عام',
  sort_order int DEFAULT 0
);

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'Printer',
  price text DEFAULT '',
  features text[] DEFAULT '{}',
  sort_order int DEFAULT 0
);

CREATE TABLE IF NOT EXISTS testimonials (
  id text PRIMARY KEY,
  author text NOT NULL,
  role text DEFAULT '',
  avatar text,
  rating int DEFAULT 5,
  comment text DEFAULT '',
  sort_order int DEFAULT 0
);

CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  discount_text text NOT NULL,
  description text DEFAULT '',
  min_order text DEFAULT 'لا حد أدنى',
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  label text NOT NULL,
  address text NOT NULL,
  phone text,
  city text,
  is_default boolean DEFAULT false
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS store_stats (
  id text PRIMARY KEY,
  label text NOT NULL,
  value text NOT NULL,
  icon text DEFAULT 'Package',
  sort_order int DEFAULT 0
);

CREATE TABLE IF NOT EXISTS slides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  badge text DEFAULT '',
  title text NOT NULL,
  subtitle text DEFAULT '',
  description text DEFAULT '',
  cta_label text DEFAULT 'تسوق الآن',
  cta_href text DEFAULT '/',
  cta2_label text DEFAULT 'تصفح الكتب',
  cta2_href text DEFAULT '/category/secondary',
  icon text DEFAULT 'Tag',
  image text,
  sort_order int DEFAULT 0
);

-- RLS on all tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE slides ENABLE ROW LEVEL SECURITY;

-- Public read for content tables
CREATE POLICY "read_blog_posts" ON blog_posts FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "read_faqs" ON faqs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "read_services" ON services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "read_testimonials" ON testimonials FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "read_coupons" ON coupons FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "read_store_stats" ON store_stats FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "read_slides" ON slides FOR SELECT TO anon, authenticated USING (true);

-- Contact messages: anyone can submit, admin can read
CREATE POLICY "insert_contact_messages" ON contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "read_contact_messages_admin" ON contact_messages FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "update_contact_messages_admin" ON contact_messages FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Addresses: users manage their own
CREATE POLICY "read_own_addresses" ON addresses FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "insert_own_addresses" ON addresses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "update_own_addresses" ON addresses FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "delete_own_addresses" ON addresses FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Notifications: users read their own
CREATE POLICY "read_own_notifications" ON notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "update_own_notifications" ON notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Admin write policies for content tables
CREATE POLICY "write_blog_posts_admin" ON blog_posts FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "write_faqs_admin" ON faqs FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "write_services_admin" ON services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "write_testimonials_admin" ON testimonials FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "write_coupons_admin" ON coupons FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "write_store_stats_admin" ON store_stats FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "write_slides_admin" ON slides FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
