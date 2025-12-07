import * as Location from 'expo-location';
import { useState } from 'react';

const apiKey = 'c7dde26473480e8a5877750001f5b008';

export interface WeatherData {
  name: string;
  main: { temp: number };
  weather: { description: string; icon: string; main: string }[];
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeatherByCity = async (city: string) => {
    if (!city) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );

      const data = await response.json();
      if (data.cod !== 200) throw new Error('Not found');
      setWeather(data);

    } catch {
      setError('Kaupunkia ei löytynyt.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async () => {
    setLoading(true);
    setError('');

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') throw new Error('No permission');

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
      );

      const data = await response.json();
      if (data.cod !== 200) throw new Error('Not found');
      setWeather(data);

    } catch {
      setError('Virhe haettaessa sijainnin säätietoja.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    weather,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByLocation
  };
}