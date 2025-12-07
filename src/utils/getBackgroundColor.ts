import { WeatherData } from '../hooks/useWeather';

export function getBackgroundColor(weather: WeatherData | null) {
  if (!weather) return '#87ceeb';

  const icon = weather.weather[0].icon;
  const main = weather.weather[0].main.toLowerCase();

  if (icon.includes('n')) return '#001f3f';
  if (main.includes('rain')) return '#4a90e2';
  if (main.includes('cloud')) return '#7f8c8d';
  if (main.includes('snow')) return '#b0c4de';
  return '#f5a623';
}