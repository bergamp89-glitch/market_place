import { createContext, useContext, useEffect, useMemo, useState } from "react";

const FavoritesContext = createContext();

const STORAGE_KEY = "tealmarket_favorites_v2";

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      //
    }
  }, [favorites]);

  const toggleFavorite = (product) => {
    if (!product?.id) return;

    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      }
      return [product, ...prev];
    });
  };

  const isFavorite = (productId) => {
    return favorites.some((item) => item.id === productId);
  };

  const clearFavorites = () => setFavorites([]);

  const value = useMemo(
    () => ({
      favorites,
      totalFavorites: favorites.length,
      toggleFavorite,
      isFavorite,
      clearFavorites,
    }),
    [favorites]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  return useContext(FavoritesContext);
}