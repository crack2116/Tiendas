'use client';
import { useState, useEffect, useRef } from 'react';
import {
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  startAt,
  endAt,
  collection,
  type DocumentData,
  type Query,
} from 'firebase/firestore';
import { useFirestore } from './provider';

interface UseCollectionOptions {
  where?: [string, any, any][];
  orderBy?: [string, 'asc' | 'desc'][];
  limit?: number;
  startAt?: any[];
  endAt?: any[];
}

export function useCollection<T>(
  collectionName: string,
  options: UseCollectionOptions = {}
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const optionsRef = useRef(options);

  useEffect(() => {
    if (!firestore) {
      setLoading(false);
      return;
    }

    let collectionQuery: Query<DocumentData>;
    try {
      let q: any = collection(firestore, collectionName);

      if (optionsRef.current.where) {
        optionsRef.current.where.forEach(w => {
          q = query(q, where(w[0], w[1], w[2]));
        });
      }

      if (optionsRef.current.orderBy) {
        optionsRef.current.orderBy.forEach(o => {
          q = query(q, orderBy(o[0], o[1]));
        });
      }

      if (optionsRef.current.limit) {
        q = query(q, limit(optionsRef.current.limit));
      }
      
      if (optionsRef.current.startAt) {
        q = query(q, startAt(...optionsRef.current.startAt));
      }

      if (optionsRef.current.endAt) {
        q = query(q, endAt(...optionsRef.current.endAt));
      }

      collectionQuery = q;
    } catch (e: any) {
      setError(e);
      setLoading(false);
      return;
    }
    
    const unsubscribe = onSnapshot(
      collectionQuery,
      snapshot => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
        setData(docs);
        setLoading(false);
      },
      err => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, firestore]);

  return { data, loading, error };
}
