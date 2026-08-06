import { Header } from '@/components/shared/header';
import { Footer } from '@/components/shared/footer';
import { AnnouncementBar } from '@/components/shared/announcement-bar';

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
