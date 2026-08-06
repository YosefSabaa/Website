import './globals.css';
import type { Metadata } from 'next';
import { Cairo, Tajawal } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { CartProvider } from '@/lib/context/cart-context';
import { WishlistProvider } from '@/lib/context/wishlist-context';
import { CompareProvider } from '@/lib/context/compare-context';
import { AuthProvider } from '@/lib/context/auth-context';
import { Toaster } from '@/components/ui/sonner';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-cairo',
  display: 'swap',
});

const tajawal = Tajawal({
  subsets: ['arabic', 'latin'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-tajawal',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'مكتبة المركز العلمي | Scientific Center',
  description:
    'مكتبة المركز العلمي - وجهتك الأولى للكتب الخارجية والأدوات المدرسية والقرطاسية والهدايا وخدمات الطباعة. تسوق بأفضل الأسعار مع توصيل سريع.',
  keywords: [
    'مكتبة',
    'كتب خارجية',
    'أدوات مدرسية',
    'قرطاسية',
    'هدايا',
    'طباعة',
    'مكتبة المركز العلمي',
  ],
  openGraph: {
    title: 'مكتبة المركز العلمي | Scientific Center',
    description: 'وجهتك الأولى للكتب والأدوات المدرسية والقرطاسية',
    locale: 'ar_AR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} ${tajawal.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <CompareProvider>
                  {children}
                  <Toaster position="top-center" richColors closeButton />
                </CompareProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
