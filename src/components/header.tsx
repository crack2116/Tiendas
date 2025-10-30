'use client';

import Link from 'next/link';
import { Menu, Search, ShoppingCart, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import { CartSheet } from './cart-sheet';
import { useState } from 'react';
import { Logo } from './logo';

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
  const { itemCount } = useCart();
  const [isCartOpen, setCartOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center">
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
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
        </div>

        <div className="hidden md:flex items-center">
            <Link href="/" className="mr-6">
                <Logo className="h-10 w-auto" />
            </Link>
        </div>

        <div className="flex-1 flex justify-center w-full px-4">
            <form className="w-full max-w-xl">
              <div className="relative">
                <Input
                  className="w-full appearance-none bg-secondary pl-4 pr-10 h-12 rounded-full text-base"
                  placeholder="¿Qué buscas hoy?"
                />
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </form>
        </div>

        <div className="hidden md:flex items-center justify-end space-x-4 flex-shrink-0 ml-4">
            <Button variant="ghost" asChild className="text-foreground/80 font-normal">
              <Link href="#">
                <Heart className="h-5 w-5 mr-1" />
                Favoritos
              </Link>
            </Button>
            <Button variant="ghost" asChild className="text-foreground/80 font-normal">
              <Link href="/login">
                <User className="h-5 w-5 mr-1" />
                Entrar
              </Link>
            </Button>
            <CartSheet open={isCartOpen} onOpenChange={setCartOpen}>
                <SheetTrigger asChild>
                <Button variant="ghost" className="relative text-foreground/80 font-normal">
                    <ShoppingCart className="h-5 w-5 mr-1" />
                    Mi Carrito
                    {itemCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {itemCount}
                    </span>
                    )}
                </Button>
                </SheetTrigger>
            </CartSheet>
        </div>

         <div className="md:hidden ml-auto">
            <CartSheet open={isCartOpen} onOpenChange={setCartOpen}>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5 text-foreground/80" />
                    <span className="sr-only">Shopping Cart</span>
                    {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {itemCount}
                    </span>
                    )}
                </Button>
                </SheetTrigger>
            </CartSheet>
         </div>
      </div>

      <nav className="hidden md:flex container items-center justify-center space-x-2 text-sm font-medium py-2">
            {navLinks.map(link => (
               <Button
               key={link.label}
               variant={link.variant === 'primary' ? 'default' : 'ghost'}
               size="sm"
               asChild
               className={link.variant === 'primary' ? 'bg-[#f37423] hover:bg-[#f37423]/90 text-white rounded-full' : 'text-foreground/80 font-normal'}
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
