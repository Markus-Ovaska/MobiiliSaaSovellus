import React, { useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity
} from 'react-native';

import FavoritesList from '../src/components/FavoritesList';
import SearchBar from '../src/components/SearchBar';
import WeatherDisplay from '../src/components/WeatherDisplay';

import { useFavorites } from '../src/hooks/useFavorites';
import { useWeather, WeatherData } from '../src/hooks/useWeather';
import { getBackgroundColor } from '../src/utils/getBackgroundColor';

export default function App() {
  const [city, setCity] = useState('');

  const {
    weather,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByLocation
  } = useWeather();

  const { favorites, addFavorite, removeFavorite } = useFavorites();

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        minHeight: '100%',
        backgroundColor: getBackgroundColor(weather)
      }}
    >
      
      <SearchBar
        city={city}
        setCity={setCity}
        onSearch={() => fetchWeatherByCity(city)}
      />

      <TouchableOpacity onPress={fetchWeatherByLocation}>
        <Text
          style={{
            backgroundColor: '#1e90ff',
            color: '#fff',
            padding: 12,
            textAlign: 'center',
            borderRadius: 8,
            marginBottom: 16,
            fontWeight: 'bold'
          }}
        >
          Hae sää sijainnin perusteella
        </Text>
      </TouchableOpacity>

      <FavoritesList
        favorites={favorites}
        onSelect={(cityName: string) => fetchWeatherByCity(cityName)}
        onRemove={(cityName: string) => removeFavorite(cityName)}
      />

      {loading && <ActivityIndicator size="large" color="#fff" />}

      {error && (
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 16 }}>
          {error}
        </Text>
      )}

      <WeatherDisplay weather={weather as WeatherData} onAddFavorite={addFavorite} />
    </ScrollView>
  );
}