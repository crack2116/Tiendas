import Image from 'next/image';
import Link from 'next/link';

import { products } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product-card';
import heroImage from '@/lib/placeholder-images.json';

export default function Home() {
  const heroImgData = heroImage.placeholderImages.find(
    img => img.id === 'hero'
  );

  return (
    <main className="flex-1">
      <section className="relative w-full h-[60vh] md:h-[80vh] bg-gray-200">
        {heroImgData && (
          <Image
            src={heroImgData.imageUrl}
            alt={heroImgData.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImgData.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
            Style Redefined
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-200">
            Discover the latest trends and curated collections that express your
            unique style. Welcome to Noemia.
          </p>
          <Button asChild size="lg" className="mt-8 font-bold">
            <Link href="#products">Shop Now</Link>
          </Button>
        </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
