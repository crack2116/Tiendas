'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';

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

  return (
    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
      <Link href={`/products/${product.slug}`} className="contents">
        <CardContent className="p-0 flex flex-col flex-grow">
          <div className="aspect-[4/5] overflow-hidden relative">
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
            <p className="text-muted-foreground mt-1">${product.price.toFixed(2)}</p>
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
