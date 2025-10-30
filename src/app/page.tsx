
'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import { placeholderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"
import { Filter } from 'lucide-react';
import { ProductFilters } from '@/components/product-filters';
import { useCollection } from '@/firebase/use-collection';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';


const carouselSlides = [
  {
    id: 'carousel-perfume',
    title: 'Aromas Inolvidables',
    description: 'Encuentra tu fragancia perfecta.',
    buttonText: 'Descubrir Perfumes',
    href: '#products',
    imageHint: 'perfume bottle',
  },
  {
    id: 'carousel-accessories',
    title: 'El Toque Final',
    description: 'Accesorios que definen tu estilo.',
    buttonText: 'Ver Accesorios',
    href: '#',
    imageHint: 'fashion accessories',
  },
  {
    id: 'carousel-clothing',
    title: 'Nueva Colección',
    description: 'Descubre las últimas tendencias.',
    buttonText: 'Explorar Colección',
    href: '#',
    imageHint: 'fashion model',
  },
  {
    id: 'carousel-beauty',
    title: 'Esencia de Belleza',
    description: 'Realza tu belleza natural.',
    buttonText: 'Comprar Belleza',
    href: '#',
    imageHint: 'beauty products',
  },
];


export default function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const { data: products, loading, error } = useCollection<Product>('products');
  
  return (
    <main className="flex-1">
      <section className="relative w-full">
        <Carousel 
            className="w-full" 
            opts={{ loop: true }} 
            plugins={[
                Autoplay({
                  delay: 5000,
                  stopOnInteraction: true,
                }),
            ]}
        >
          <CarouselContent>
            {carouselSlides.map((slide, index) => {
              const slideImage = placeholderImages.find(img => img.id === slide.id);
              return (
                <CarouselItem key={slide.id}>
                  <div className="relative w-full h-[60vh] md:h-[80vh]">
                    {slideImage && (
                      <Image
                        src={slideImage.imageUrl}
                        alt={slideImage.description}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        data-ai-hint={slide.imageHint}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
                      <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
                        {slide.title}
                      </h1>
                      <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200">
                        {slide.description}
                      </p>
                      <Button asChild size="lg" className="mt-8 font-bold">
                        <Link href={slide.href}>{slide.buttonText}</Link>
                      </Button>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden md:flex" />
        </Carousel>
      </section>

      <section id="products" className="py-12 md:py-16">
        <div className="w-full px-4 sm:px-6 md:px-8 mb-8 flex justify-start">
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? 'Ocultar Filtros' : 'Mostrar Filtros'}
          </Button>
        </div>
        <div className="w-full px-4 sm:px-6 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            {showFilters && (
                <div className="md:col-span-1">
                    <ProductFilters />
                </div>
            )}
            <div className={showFilters ? "md:col-span-3" : "md:col-span-4"}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                    {loading && Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-64" />
                        <Skeleton className="h-6" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                    {error && <p className='text-destructive col-span-full'>Error al cargar los productos: {error.message}</p>}
                    {products?.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </div>
      </section>
    </main>
  );
}
