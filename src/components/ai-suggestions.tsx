'use client';

import { useState, useEffect } from 'react';
import { suggestComplementaryProducts, SuggestComplementaryProductsOutput } from '@/ai/flows/ai-suggests-complementary-products';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Wand2 } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

type AiSuggestionsProps = {
  productDescription: string;
  productCategory: string;
};

export default function AiSuggestions({ productDescription, productCategory }: AiSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SuggestComplementaryProductsOutput | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        setLoading(true);
        const result = await suggestComplementaryProducts({
          productDescription,
          productCategory,
        });
        setSuggestions(result);
      } catch (err) {
        setError('No se pudieron obtener las sugerencias de la IA. Por favor, inténtalo de nuevo más tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchSuggestions();
  }, [productDescription, productCategory]);

  return (
    <section>
      <h2 className="text-2xl md:text-3xl font-bold font-headline mb-6 text-center">
        <Wand2 className="inline-block mr-2 -mt-1 h-7 w-7 text-accent" />
        Asistente de Estilo IA
      </h2>
      <Card className="bg-card/80 border-primary/20 border-dashed">
        <CardHeader>
          <CardTitle>Completa Tu Look</CardTitle>
          <CardDescription>
            Nuestro estilista de IA sugiere artículos que combinan perfectamente con lo que estás viendo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <LoadingState />}
          {error && <p className="text-destructive">{error}</p>}
          {suggestions && (
            <div>
              <p className="mb-4 text-muted-foreground">{suggestions.reasoning}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {suggestions.suggestedProducts.map((product, index) => (
                  <div key={index} className="p-3 rounded-lg border bg-background text-center">
                     <p className="font-semibold text-sm">{product}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

function LoadingState() {
  return (
    <div>
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-4 w-1/2 mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    </div>
  )
}
