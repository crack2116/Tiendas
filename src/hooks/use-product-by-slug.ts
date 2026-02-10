'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { fetchProductBySlug } from '@/supabase/db';

export function useProductBySlug(slug: string | null) {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!slug) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const product = await fetchProductBySlug(slug);
      setData(product);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
