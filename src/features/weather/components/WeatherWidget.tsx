import { getWeather } from "../services/weather.service";
import { WeatherCard } from "./WeatherCard";

/** Server Component — ডেটা fetch হয় সার্ভারে, ক্লায়েন্টে অতিরিক্ত JS লাগে না। */
export async function WeatherWidget() {
  const weather = await getWeather();

  if (!weather) return null;

  return <WeatherCard weather={weather} />;
}
