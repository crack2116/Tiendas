'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { fetchProducts } from '@/supabase/db';

export type UseProductsOptions = {
  category?: string;
  search?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  limit?: number;
};

export function useProducts(options: UseProductsOptions = {}) {
  const [data, setData] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const products = await fetchProducts(options);
      setData(products);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [options.category, options.search, options.orderBy, options.orderDirection, options.limit]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
