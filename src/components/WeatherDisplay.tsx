import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { WeatherData } from '../hooks/useWeather';

export default function WeatherDisplay({
  weather,
  onAddFavorite
}: {
  weather: WeatherData | null;
  onAddFavorite: (city: string) => void;
}) {
  if (!weather) return null;

  return (
    <View style={{ alignItems: 'center', marginTop: 20 }}>
      <Text style={{ fontSize: 36, fontWeight: 'bold', color: '#fff' }}>
        {weather.name}
      </Text>

      <Text style={{ fontSize: 48, fontWeight: 'bold', color: '#fff' }}>
        {Math.round(weather.main.temp)}°C
      </Text>

      <Text style={{ fontSize: 24, color: '#fff', marginBottom: 12 }}>
        {weather.weather[0].description}
      </Text>

      <Image
        style={{ width: 100, height: 100 }}
        source={{
          uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
        }}
      />

      <TouchableOpacity
        onPress={() => onAddFavorite(weather.name)}
        style={{
          backgroundColor: '#1e90ff',
          padding: 12,
          borderRadius: 8,
          marginTop: 12
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          Lisää suosikkeihin
        </Text>
      </TouchableOpacity>
    </View>
  );
}