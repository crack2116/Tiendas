'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Order } from '@/lib/types';
import { fetchOrdersByUserId } from '@/supabase/db';

export function useUserOrders(userId: string | null) {
  const [data, setData] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!userId) {
      setData(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const orders = await fetchOrdersByUserId(userId);
      setData(orders);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}
