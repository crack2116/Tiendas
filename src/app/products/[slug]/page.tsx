'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Star, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import AiSuggestions from '@/components/ai-suggestions';
import { useCollection } from '@/firebase/use-collection';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const { data, loading, error } = useCollection<Product>('products', {
    where: [['slug', '==', params.slug]],
    limit: 1,
  });

  const product = data?.[0];
  const [mainImage, setMainImage] = useState(product?.images[0]);

  useEffect(() => {
    if (product && product.images.length > 0) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          <div>
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-4 mt-4">
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="aspect-square w-full rounded-md" />
            </div>
          </div>
          <div>
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-8 w-1/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-6" />
            <Skeleton className="h-20 w-full mb-8" />
            <Skeleton className="h-12 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: 'Añadido al carrito',
      description: `${quantity} x ${product.name}`,
    });
  };

  const averageRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div>
          {mainImage && (
            <div className="aspect-square w-full overflow-hidden rounded-lg shadow-lg mb-4">
              <Image
                src={mainImage.url}
                alt={mainImage.alt}
                width={800}
                height={800}
                className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              />
            </div>
          )}
          <div className="grid grid-cols-4 gap-4">
            {product.images.map(image => (
              <button
                key={image.id}
                onClick={() => setMainImage(image)}
                className={`aspect-square w-full overflow-hidden rounded-md transition-all ${mainImage?.id === image.id ? 'ring-2 ring-primary ring-offset-2' : 'hover:opacity-80'}`}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={200}
                  height={200}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h1 className="text-3xl md:text-4xl font-bold font-headline">
            {product.name}
          </h1>
          <div className="mt-2">
            {product.originalPrice ? (
              <div className="flex items-baseline gap-3">
                <p className="text-red-500 font-bold text-3xl">S/{product.price.toFixed(2)}</p>
                <p className="text-muted-foreground line-through text-xl">S/{product.originalPrice.toFixed(2)}</p>
              </div>
            ) : (
              <p className="text-2xl md:text-3xl font-light text-primary">S/{product.price.toFixed(2)}</p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(averageRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span>({product.reviews?.length || 0} reseñas)</span>
          </div>
          <p className="mt-6 text-lg">{product.description}</p>
          
          <div className="mt-8">
            <Button size="lg" className="w-full md:w-auto" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Añadir al carrito
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full mt-8">
            <AccordionItem value="details">
              <AccordionTrigger className="font-headline text-lg">Detalles del Producto</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {product.details?.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="reviews">
              <AccordionTrigger className="font-headline text-lg">Reseñas</AccordionTrigger>
              <AccordionContent>
                {product.reviews && product.reviews.length > 0 ? (
                  <div className="space-y-6">
                    {product.reviews.map(review => (
                      <div key={review.id}>
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">{review.author}</p>
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                                />
                                ))}
                            </div>
                        </div>
                        <p className="text-muted-foreground text-sm mt-1">{review.date}</p>
                        <p className="mt-2">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Aún no hay reseñas.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <Separator className="my-12 md:my-16" />
      <AiSuggestions 
        productDescription={product.description}
        productCategory={product.category}
      />
    </div>
  );
}
