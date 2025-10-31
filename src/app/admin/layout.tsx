'use client';

import Link from "next/link"
import {
  Package,
  Home,
  User,
  LogOut,
  Shield,
  Warehouse,
  ShoppingCart,
  LayoutDashboard,
} from "lucide-react"
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useEffect } from 'react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/logo"
import { useTheme } from "@/hooks/use-theme";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout, loading, isAdmin } = useAuth();
  const router = useRouter();
  const { setTheme } = useTheme();

  // Set the theme to dark for the admin layout
  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);


  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (!isAdmin) {
        router.push('/');
      }
    }
  }, [user, loading, router, isAdmin]);

  if (loading || !user || !isAdmin) {
    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-background">
            <p>Cargando...</p>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center space-x-2 p-2">
                <Link href="/admin">
                    <Logo className="h-10 w-10" />
                </Link>
                <span className="font-bold font-headline text-lg text-sidebar-primary-foreground">
                    Admin Panel
                </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link href="/admin">
                        <LayoutDashboard />
                        Dashboard
                    </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link href="/admin/inventory">
                        <Warehouse />
                        Inventario
                    </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link href="/admin/orders">
                        <ShoppingCart />
                        Pedidos
                    </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter>
             <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link href="/">
                        <Home />
                        Volver a la Tienda
                    </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={logout}>
                    <LogOut />
                    Cerrar Sesión
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1 bg-muted/40 p-4 sm:p-6 md:p-8">
            {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
