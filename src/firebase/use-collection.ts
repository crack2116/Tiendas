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
    let q: Query<DocumentData>;
    try {
      let collectionRef: any = firestore.collection(collectionName);

      if (optionsRef.current.where) {
        optionsRef.current.where.forEach(w => {
          collectionRef = query(collectionRef, where(w[0], w[1], w[2]));
        });
      }

      if (optionsRef.current.orderBy) {
        optionsRef.current.orderBy.forEach(o => {
          collectionRef = query(collectionRef, orderBy(o[0], o[1]));
        });
      }

      if (optionsRef.current.limit) {
        collectionRef = query(collectionRef, limit(optionsRef.current.limit));
      }
      
      if (optionsRef.current.startAt) {
        collectionRef = query(collectionRef, startAt(...optionsRef.current.startAt));
      }

      if (optionsRef.current.endAt) {
        collectionRef = query(collectionRef, endAt(...optionsRef.current.endAt));
      }

      q = collectionRef;
    } catch (e: any) {
      setError(e);
      setLoading(false);
      return;
    }
    
    const unsubscribe = onSnapshot(
      q,
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
