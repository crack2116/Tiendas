'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define routes that should use the public layout
  const publicRoutes = ['/', '/cart', '/checkout', '/login'];
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/products');

  // Admin and account sections will have their own layouts
  if (pathname.startsWith('/admin') || pathname.startsWith('/account')) {
    return <>{children}</>;
  }

  // Render public layout only for specified routes
  if (isPublicRoute) {
    return (
      <>
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </>
    );
  }

  // Fallback for any other routes if needed, or just render children
  return <>{children}</>;
}
