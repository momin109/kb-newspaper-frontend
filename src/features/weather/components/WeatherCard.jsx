import {
  AdIcon,
  Cloud,
  CloudRain,
  CloudSun,
  Droplets,
  MapPin,
  Sun,
  Wind,
} from "lucide-react";

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

  if (value.includes("sun") || value.includes("রোদ")) {
    return Sun;
  }

  return CloudSun;
}

export function WeatherCard({ weather }) {
  if (!weather) return null;

  const Icon = getWeatherIcon(weather.condition);

  return (
    <section className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{weather.city || "ঢাকা"}</span>
          </div>

          <h2 className="mt-1 text-lg font-bold">আজকের আবহাওয়া</h2>
        </div>

        <AdIcon className="h-10 w-10 text-primary" />
      </div>

      <div className="flex items-center gap-5">
        <div>
          <p className="text-4xl font-bold">{weather.temperature}°</p>

          <p className="mt-1 text-sm text-muted-foreground">
            {weather.condition}
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
