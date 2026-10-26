import { useEffect, useState, useCallback } from 'react';
import { getProducts, type ProductFilters } from '../services/api';

import type { Product } from '../types';

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const categoryId = filters?.categoryId;
  const category = filters?.category;
  const search = filters?.search;
  const isAvailable = filters?.isAvailable;

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts({

        categoryId,
        category,
        search,
        isAvailable,
      });
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load drinks');
    } finally {
      setLoading(false);
    }
  }, [categoryId, category, search, isAvailable]);

  useEffect(() => {
    let ignore = false;
    async function init() {
      setLoading(true);
      setError(null);
      try {
        const data = await getProducts({

          categoryId,
          category,
          search,
          isAvailable,
        });
        if (!ignore) {
          setProducts(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Failed to load drinks');
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
  }, [categoryId, category, search, isAvailable]);

  return { products, loading, error, refetch: loadProducts };
}

