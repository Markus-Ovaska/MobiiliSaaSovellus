import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem('favorites');
      setFavorites(stored ? JSON.parse(stored) : []);
    } catch (err) {
      console.log(err);
    }
  };

  const addFavorite = async (city: string) => {
    if (!city) return;
    if (favorites.includes(city)) return;

    const newFavs = [...favorites, city];
    setFavorites(newFavs);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
  };

  const removeFavorite = async (city: string) => {
    const newFavs = favorites.filter((c) => c !== city);
    setFavorites(newFavs);
    await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
  };

  return { favorites, addFavorite, removeFavorite };
}