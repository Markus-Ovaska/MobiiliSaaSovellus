import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface WeatherData {
  name: string;
  main: {
    temp: number;
  };
  weather: {
    description: string;
    icon: string;
    main: string;
  }[];
}

const { width } = Dimensions.get('window');

export default function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const apiKey = 'c7dde26473480e8a5877750001f5b008'; // Vaihda oma OpenWeatherMap API-avain tähän

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favs = await AsyncStorage.getItem('favorites');
      setFavorites(favs ? JSON.parse(favs) : []);
    } catch (err) {
      console.error(err);
    }
  };

  const addFavorite = async (cityName: string) => {
    try {
      if (!cityName) return;
      let newFavs = [...favorites];
      if (!newFavs.includes(cityName)) {
        newFavs.push(cityName);
        await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
        setFavorites(newFavs);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeFavorite = async (cityName: string) => {
    try {
      const newFavs = favorites.filter((c) => c !== cityName);
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavs));
      setFavorites(newFavs);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchWeatherByCity = async (cityName?: string) => {
    const query = cityName || city;
    if (!query) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();
      if (data.cod !== 200) {
        setError('Kaupunkia ei löytynyt.');
        setWeather(null);
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError('Virhe haettaessa säätä.');
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
      if (status !== 'granted') {
        setError('Sijaintioikeudet puuttuvat!');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
      );
      const data = await response.json();
      if (data.cod !== 200) {
        setError('Sijainnin sää ei löytynyt.');
        setWeather(null);
      } else {
        setWeather(data);
      }
    } catch (err) {
      setError('Virhe haettaessa säätä.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const getBackgroundColor = () => {
    if (!weather) return '#87ceeb';
    const icon = weather.weather[0].icon;
    const main = weather.weather[0].main.toLowerCase();

    if (icon.includes('n')) return '#001f3f'; // yö
    if (main.includes('rain')) return '#4a90e2';
    if (main.includes('cloud')) return '#7f8c8d';
    if (main.includes('snow')) return '#b0c4de';
    return '#f5a623'; // aurinko / selkeä
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: getBackgroundColor() }]}
    >
      <Text style={styles.title}>Sääsovellus</Text>

      <TextInput
        style={styles.input}
        placeholder="Kirjoita kaupunki"
        value={city}
        onChangeText={setCity}
      />
      <TouchableOpacity style={styles.button} onPress={() => fetchWeatherByCity()}>
        <Text style={styles.buttonText}>Hae sää kaupungin perusteella</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={fetchWeatherByLocation}>
        <Text style={styles.buttonText}>Hae sää sijainnin perusteella</Text>
      </TouchableOpacity>

      {favorites.length > 0 && (
        <View style={styles.favoritesContainer}>
          <Text style={styles.subtitle}>Suosikit:</Text>
          <FlatList
            horizontal
            data={favorites}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.favoriteCardContainer}>
                <TouchableOpacity
                  style={styles.favoriteCard}
                  onPress={() => fetchWeatherByCity(item)}
                >
                  <Text style={styles.favoriteText}>{item}</Text>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => removeFavorite(item)}
                  >
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {weather && (
        <View style={styles.weatherContainer}>
          <Text style={styles.city}>{weather.name}</Text>
          <Text style={styles.temp}>{Math.round(weather.main.temp)}°C</Text>
          <Text style={styles.description}>{weather.weather[0].description}</Text>
          <Image
            style={styles.icon}
            source={{ uri: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png` }}
          />
          <TouchableOpacity
            style={[styles.button, { marginTop: 10 }]}
            onPress={() => addFavorite(weather.name)}
          >
            <Text style={styles.buttonText}>Lisää suosikkeihin</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    justifyContent: 'flex-start',
    minHeight: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#fff',
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    fontSize: 18,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  weatherContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  city: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  temp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  description: {
    fontSize: 24,
    color: '#fff',
    textTransform: 'capitalize',
    marginBottom: 16,
  },
  icon: {
    width: 100,
    height: 100,
  },
  favoritesContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  favoriteCardContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 12, // Lisää ylätilaa, jotta ruksi näkyy kokonaan
  },
  favoriteCard: {
    backgroundColor: '#27c0efff',
    paddingVertical: 16, // suurempi korkeus
    paddingHorizontal: 16,
    borderRadius: 12,
    width: width / 4,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  favoriteText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#ff4d4d',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  removeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
    fontSize: 18,
  },
});