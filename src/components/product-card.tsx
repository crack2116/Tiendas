'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from './ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: 'Añadido al carrito',
      description: `${product.name} ha sido añadido a tu carrito.`,
    });
  };

  const getBadgeClass = (badgeText?: string) => {
    if (badgeText === 'Mega Promo') {
      return 'bg-blue-600 text-white';
    }
    if (badgeText === 'natura days') {
      return 'bg-purple-300 text-purple-900';
    }
    return 'bg-primary text-primary-foreground';
  }

  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <Link href={`/products/${product.slug}`} className="contents">
        <CardContent className="p-0 flex flex-col flex-grow">
          <div className="aspect-[4/5] overflow-hidden relative">
            {product.badge && (
              <Badge className={`absolute top-0 left-0 z-10 rounded-none rounded-br-lg px-3 py-1 text-xs ${getBadgeClass(product.badge)}`}>
                {product.badge}
              </Badge>
            )}
             <Button variant="ghost" size="icon" className="absolute top-2 right-2 z-10 bg-white/50 backdrop-blur-sm rounded-full h-8 w-8 hover:bg-white">
              <Heart className="h-4 w-4 text-gray-700" />
            </Button>
            <Image
              src={product.images[0].url}
              alt={product.images[0].alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              data-ai-hint={product.images[0].hint}
            />
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <div className="mt-1">
              {product.originalPrice ? (
                <div className="flex items-baseline gap-2">
                  <p className="text-red-500 font-bold text-lg">S/{product.price.toFixed(2)}</p>
                  <p className="text-muted-foreground line-through text-sm">S/{product.originalPrice.toFixed(2)}</p>
                </div>
              ) : (
                <p className="text-muted-foreground text-lg">S/{product.price.toFixed(2)}</p>
              )}
            </div>
            <div className="mt-4 flex-grow flex items-end">
              <Button onClick={handleAddToCart} className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Añadir al carrito
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
