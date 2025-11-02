'use client';

import Link from 'next/link';
import { Menu, Search, Heart, User, LogOut, Package, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useCart } from '@/hooks/use-cart';
import { CartSheet } from './cart-sheet';
import { useState, Suspense } from 'react';
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
import { useTheme } from '@/hooks/use-theme';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';


const navLinks = [
  { href: '/?category=Lanzamientos', label: 'Lanzamientos', category: 'Lanzamientos' },
  { href: '/?category=Más vendidos', label: 'Más vendidos', category: 'Más vendidos' },
  { href: '/?category=Promociones', label: 'Promociones', category: 'Promociones' },
  { href: '/?category=Perfumería', label: 'Perfumería', category: 'Perfumería' },
  { href: '/?category=Rostro', label: 'Rostro', category: 'Rostro' },
  { href: '/?category=Cabello', label: 'Cabello', category: 'Cabello' },
  { href: '/?category=Cuerpo', label: 'Cuerpo', category: 'Cuerpo' },
  { href: '/?category=Maquillaje', label: 'Maquillaje', category: 'Maquillaje' },
  { href: '/?category=Regalos', label: 'Regalos', category: 'Regalos' },
  { href: '/?category=Hombre', label: 'Hombre', category: 'Hombre' },
];

function NavigationBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  return (
    <nav className="hidden md:flex container items-center justify-center space-x-2 text-sm font-medium py-2">
      {navLinks.map(link => {
        const isActive = pathname === '/' && currentCategory === link.category;
        return (
          <Button
            key={link.label}
            variant='ghost'
            size="sm"
            asChild
            className={`rounded-full ${
              isActive 
                ? 'bg-[#f37423] text-white' 
                : 'hover:bg-[#f37423] hover:text-white'
            }`}
          >
            <Link
              href={`/?category=${encodeURIComponent(link.category)}#products`}
            >
              {link.label}
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}

export function Header() {
  const [isCartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}#products`);
    }
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
                    <Logo className="h-8 w-auto" />
                  </div>
                  <nav className="flex flex-col space-y-4 mt-6">
                    {navLinks.map(link => (
                      <Link
                        key={link.label}
                        href={`/?category=${encodeURIComponent(link.category)}#products`}
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
            <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto">
              <div className="relative">
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full appearance-none bg-secondary pl-4 pr-10 h-12 rounded-full text-base"
                  placeholder="¿Qué buscas hoy?"
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full"
                >
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <span className="sr-only">Buscar</span>
                </Button>
              </div>
            </form>
          </div>

          <div className="flex items-center justify-end space-x-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="hidden md:inline-flex"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Cambiar tema</span>
            </Button>
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

      <Suspense fallback={
        <nav className="hidden md:flex container items-center justify-center space-x-2 text-sm font-medium py-2">
          {navLinks.map(link => (
            <Button
              key={link.label}
              variant='ghost'
              size="sm"
              className="rounded-full hover:bg-[#f37423] hover:text-white"
              disabled
            >
              {link.label}
            </Button>
          ))}
        </nav>
      }>
        <NavigationBar />
      </Suspense>
    </header>
  );
}
