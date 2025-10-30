
'use client';
import Image from 'next/image';
import Link from 'next/link';

import { products } from '@/lib/data';
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


const carouselSlides = [
  {
    id: 'carousel-clothing',
    title: 'Nueva Colección',
    description: 'Descubre las últimas tendencias en moda.',
    buttonText: 'Comprar Ropa',
    href: '#products',
    imageHint: 'fashion model',
  },
  {
    id: 'carousel-beauty',
    title: 'Esencia de Belleza',
    description: 'Cuida tu piel con nuestros productos premium.',
    buttonText: 'Ver Belleza',
    href: '#',
    imageHint: 'beauty products',
  },
  {
    id: 'carousel-perfume',
    title: 'Aromas Inolvidables',
    description: 'Encuentra tu fragancia perfecta.',
    buttonText: 'Descubrir Perfumes',
    href: '#',
    imageHint: 'perfume bottle',
  },
  {
    id: 'carousel-accessories',
    title: 'El Toque Final',
    description: 'Completa tu look con nuestros accesorios.',
    buttonText: 'Explorar Accesorios',
    href: '#',
    imageHint: 'fashion accessories',
  },
];


export default function Home() {
  
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

      <section id="products" className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-headline">
              Featured Collection
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">
              Handpicked for the modern trendsetter.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
