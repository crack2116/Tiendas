'use client';

import Link from 'next/link';
import { Menu, Search, Heart, User, LogOut, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import { CartSheet } from './cart-sheet';
import { useState } from 'react';
import { Logo } from './logo';
import { LoginDialog } from './login-dialog';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';


const navLinks = [
  { href: '#', label: 'Natura Days', variant: 'primary' as const },
  { href: '#', label: 'Best Seller' },
  { href: '#', label: 'Promociones' },
  { href: '#', label: 'Perfumería' },
  { href: '#', label: 'Rostro' },
  { href: '#', label: 'Cabello' },
  { href: '#', label: 'Cuerpo' },
  { href: '#', label: 'Maquillaje' },
  { href: '#', label: 'Regalos' },
  { href: '#', label: 'Casa' },
  { href: '#', label: 'Hombre' },
  { href: '#', label: 'Marcas' },
];

export function Header() {
  const [isCartOpen, setCartOpen] = useState(false);
  const { user, logout } = useAuth();
  
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-8">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 pb-4 border-b">
                    <Logo className="h-8" />
                  </div>
                  <nav className="flex flex-col space-y-4 mt-6">
                    {navLinks.map(link => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="text-lg"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <Link href="/" className="hidden md:flex">
              <Logo className="h-10 w-auto" />
            </Link>
          </div>

          <div className="flex-1 min-w-0">
            <form className="w-full max-w-xl mx-auto">
              <div className="relative">
                <Input
                  className="w-full appearance-none bg-secondary pl-4 pr-10 h-12 rounded-full text-base"
                  placeholder="¿Qué buscas hoy?"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </form>
          </div>

          <div className="flex items-center justify-end space-x-1">
             <CartSheet open={isCartOpen} onOpenChange={setCartOpen} />
            <Button
              variant="ghost"
              asChild
              className="text-foreground/80 font-normal hidden md:inline-flex"
            >
              <Link href="#">
                <Heart className="h-5 w-5 mr-1" />
                Favoritos
              </Link>
            </Button>
            
            {user ? (
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                       <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                     <Link href="/account/orders">
                        <Package className="mr-2 h-4 w-4" />
                        <span>Mis Pedidos</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
                <LoginDialog>
                    <Button
                        variant="ghost"
                        className="text-foreground/80 font-normal hidden md:inline-flex"
                    >
                        <User className="h-5 w-5 mr-1" />
                        Entrar
                    </Button>
                </LoginDialog>
            )}
          </div>
        </div>
      </div>

      <nav className="hidden md:flex container items-center justify-center space-x-2 text-sm font-medium py-2">
        {navLinks.map(link => (
          <Button
            key={link.label}
            variant={link.variant === 'primary' ? 'default' : 'ghost'}
            size="sm"
            asChild
            className={
              link.variant === 'primary'
                ? 'bg-[#f37423] hover:bg-[#f37423]/90 text-white rounded-full'
                : 'text-foreground/80 font-normal'
            }
          >
            <Link
              href={link.href}
              className={`transition-colors hover:text-foreground/80 `}
            >
              {link.label}
            </Link>
          </Button>
        ))}
      </nav>
    </header>
  );
}
