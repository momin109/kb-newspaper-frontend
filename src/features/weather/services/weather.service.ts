import { apiGet } from "@/lib/api-fetch";

export interface Weather {
  city: string;
  country: string;
  temperature: number;
  feelsLike: number;
  minTemperature: number;
  maxTemperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  description: string;
  condition: string;
  icon: string | null;
}

interface WeatherResponse {
  success: boolean;
  message: string;
  data: Weather;
}

/**
 * GET /api/weather — ওপেনওয়েদার API-নির্ভর, key কনফিগার না থাকলে বা
 * city না পেলে backend 404/500 দেয়। সেক্ষেত্রে null রিটার্ন করি যাতে
 * হোমপেজ ক্র্যাশ না করে।
 */
export async function getWeather(): Promise<Weather | null> {
  try {
    const res = await apiGet<WeatherResponse>("/weather", {
      revalidate: 900, // ১৫ মিনিট পরপর রিফ্রেশ, প্রতি রিকোয়েস্টে না
    });
    return res.data;
  } catch {
    return null;
  }
}
