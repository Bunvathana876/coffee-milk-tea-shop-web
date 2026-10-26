import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'coffee_cute_favorites';

export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
    } catch {
      // Ignore storage errors
    }
  }, [favoriteIds]);

  const isFavorite = (productId: number) => favoriteIds.includes(productId);

  const toggleFavorite = (productId: number) => {
    setFavoriteIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
    hasFavorites: favoriteIds.length > 0,
  };
}

