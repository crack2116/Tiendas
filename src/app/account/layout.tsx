'use client';

import Link from "next/link"
import {
  Package,
  Home,
  User,
  LogOut,
  Shield,
  Warehouse,
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

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="w-full min-h-screen flex items-center justify-center">
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
                <Logo className="h-10 w-10" />
                <span className="font-bold font-headline text-lg text-sidebar-primary-foreground">
                    Mi Cuenta
                </span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Link href="/account/orders">
                        <Package />
                        Pedidos
                    </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
               {user.role === 'admin' && (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/admin">
                        <Shield />
                        Panel de Admin
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
                </>
              )}
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
        <SidebarInset className="flex-1 bg-background p-4 sm:p-6 md:p-8">
            {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
