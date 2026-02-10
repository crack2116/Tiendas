'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Order } from '@/lib/types';
import { fetchOrders } from '@/supabase/db';

export type UseOrdersOptions = {
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  limit?: number;
};

export function useOrders(options: UseOrdersOptions = {}) {
  const [data, setData] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const orders = await fetchOrders({
        orderBy: options.orderBy || 'created_at',
        orderDirection: options.orderDirection || 'desc',
        limit: options.limit,
      });
      setData(orders);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [options.orderBy, options.orderDirection, options.limit]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
