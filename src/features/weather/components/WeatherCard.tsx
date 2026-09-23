import {
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  Sun,
  Wind,
} from "lucide-react";

import type { Weather } from "../services/weather.service";

function getWeatherIcon(condition = "") {
  const value = condition.toLowerCase();

  if (
    value.includes("rain") ||
    value.includes("বৃষ্টি") ||
    value.includes("storm") ||
    value.includes("ঝড়")
  ) {
    return CloudRain;
  }

  if (value.includes("cloud") || value.includes("মেঘ")) {
    return Cloud;
  }

  if (
    value.includes("clear") ||
    value.includes("sun") ||
    value.includes("রোদ")
  ) {
    return Sun;
  }

  return CloudSun;
}

export function WeatherCard({ weather }: { weather: Weather | null }) {
  if (!weather) return null;

  const Icon = getWeatherIcon(weather.condition);

  return (
    <section className="w-full max-w-xs rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{weather.city || "ঢাকা"}</span>
          </div>
          <h2 className="mt-1 text-base font-bold text-foreground">
            আজকের আবহাওয়া
          </h2>
        </div>

        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="h-6 w-6" />
        </span>
      </div>

      <div className="flex items-center gap-5">
        <div>
          <p className="text-4xl font-bold text-foreground">
            {weather.temperature}°
          </p>
          <p className="mt-1 text-sm capitalize text-muted-foreground">
            {weather.description || weather.condition}
          </p>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          {weather.humidity !== undefined && (
            <div className="flex items-center gap-2">
              <Droplets className="h-4 w-4" />
              <span>আর্দ্রতা {weather.humidity}%</span>
            </div>
          )}
          {weather.windSpeed !== undefined && (
            <div className="flex items-center gap-2">
              <Wind className="h-4 w-4" />
              <span>বাতাস {weather.windSpeed} km/h</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
