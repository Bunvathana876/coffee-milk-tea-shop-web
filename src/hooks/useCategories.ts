import { useEffect, useState, useCallback } from 'react';
import { getCategories } from '../services/api';
import type { Category } from '../types';


export function useCategories(activeOnly: boolean = true) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCategories(activeOnly);

      setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [activeOnly]);

  useEffect(() => {
    let ignore = false;
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCategories(activeOnly);

        if (!ignore) {
          setCategories(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load categories');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    init();
    return () => {
      ignore = true;
    };
  }, [activeOnly]);

  return { categories, loading, error, refetch: loadCategories };
}

