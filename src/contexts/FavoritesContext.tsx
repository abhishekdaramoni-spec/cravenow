import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { StorageService } from '@/services/storageService';

interface FavoritesContextType {
  favoriteRestaurantIds: string[];
  favoriteDishIds: string[];
  toggleFavoriteRestaurant: (id: string) => boolean;
  toggleFavoriteDish: (id: string) => boolean;
  isRestaurantFavorite: (id: string) => boolean;
  isDishFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id || 'guest';

  const [favs, setFavs] = useState(() => StorageService.getUserFavorites(userId));

  // Sync favorites when active user changes
  useEffect(() => {
    setFavs(StorageService.getUserFavorites(userId));
  }, [userId]);

  const toggleFavoriteRestaurant = (id: string) => {
    const isNowFav = StorageService.toggleFavoriteRestaurant(userId, id);
    setFavs(StorageService.getUserFavorites(userId));
    return isNowFav;
  };

  const toggleFavoriteDish = (id: string) => {
    const isNowFav = StorageService.toggleFavoriteDish(userId, id);
    setFavs(StorageService.getUserFavorites(userId));
    return isNowFav;
  };

  const isRestaurantFavorite = (id: string) => favs.restaurantIds.includes(id);
  const isDishFavorite = (id: string) => favs.dishIds.includes(id);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteRestaurantIds: favs.restaurantIds,
        favoriteDishIds: favs.dishIds,
        toggleFavoriteRestaurant,
        toggleFavoriteDish,
        isRestaurantFavorite,
        isDishFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
