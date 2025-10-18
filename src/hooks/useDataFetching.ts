import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { getFirestore, collection, getDocs, query, where, orderBy, limit, QueryConstraint } from 'firebase/firestore';
import { useToast } from './use-toast';

interface FetchingOptions {
  limit?: number;
  filterByUser?: boolean;
}

export const useDataFetching = <T>(collectionName: string, orderByField: string, options: FetchingOptions = {}) => {
  const { limit: _limit = 100, filterByUser = true } = options;
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const db = getFirestore();
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates on unmounted component

    // Set loading true at the beginning of the effect,
    // ensuring immediate feedback when dependencies change.
    setLoading(true);

    if (filterByUser && authLoading) {
      // If still loading auth and filtering by user, we can't fetch data yet.
      // Keep loading true (set above) and return.
      return;
    }

    if (filterByUser && !user) {
      // Auth is resolved, no user, and filtering by user. Redirect.
      // Note: A small delay before navigate might be added if immediate redirect
      // causes flickering, but for performance, immediate is often preferred.
      navigate('/auth');
      return;
    }

    const fetchData = async () => {
      try {
        const constraints: QueryConstraint[] = [orderBy(orderByField, 'desc'), limit(_limit)];

        if (filterByUser && user) {
          constraints.unshift(where('user_id', '==', user.uid));
        }

        const q = query(collection(db, collectionName), ...constraints);
        const querySnapshot = await getDocs(q);
        const fetchedData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));

        if (isMounted) {
          setData(fetchedData);
        }
      } catch (error: any) {
        console.error(`Error fetching ${collectionName}:`, error);
        if (isMounted) {
          toast({
            title: `Error fetching ${collectionName}`,
            description: `There was a problem loading your ${collectionName}. You may need to create a Firestore index. Check the developer console for a link to create it.`,
            variant: 'destructive',
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading, collectionName, db, navigate, toast, orderByField, _limit, filterByUser]);

  return { data, loading, authLoading };
};
