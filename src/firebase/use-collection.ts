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
  collectionPath: string | null, // Allow null to disable the query
  options: UseCollectionOptions = {}
) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Use a ref to store a stringified version of the options to avoid re-running the effect on every render.
  const optionsStr = JSON.stringify(options);

  useEffect(() => {
    // Don't run if firestore is not available or if the path is null
    if (!firestore || !collectionPath) {
      setLoading(false);
      return;
    }
    
    setLoading(true);

    try {
      const currentOptions = JSON.parse(optionsStr);
      let collectionQuery: Query<DocumentData> = collection(firestore, collectionPath);

      if (currentOptions.where) {
        currentOptions.where.forEach((w: [string, any, any]) => {
          collectionQuery = query(collectionQuery, where(w[0], w[1], w[2]));
        });
      }

      if (currentOptions.orderBy) {
        currentOptions.orderBy.forEach((o: [string, 'asc' | 'desc']) => {
          collectionQuery = query(collectionQuery, orderBy(o[0], o[1]));
        });
      }

      if (currentOptions.limit) {
        collectionQuery = query(collectionQuery, limit(currentOptions.limit));
      }
      
      if (currentOptions.startAt) {
        collectionQuery = query(collectionQuery, startAt(...currentOptions.startAt));
      }

      if (currentOptions.endAt) {
        collectionQuery = query(collectionQuery, endAt(...currentOptions.endAt));
      }
      
      const unsubscribe = onSnapshot(
        collectionQuery,
        snapshot => {
          const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
          setData(docs);
          setLoading(false);
        },
        err => {
          console.error(`Error fetching collection ${collectionPath}:`, err)
          setError(err);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (e: any) {
      console.error(`Error building query for ${collectionPath}:`, e)
      setError(e);
      setLoading(false);
      return;
    }
    
  }, [collectionPath, firestore, optionsStr]);

  return { data, loading, error };
}
