import { apiGet } from "@/lib/api-fetch";

export async function getWeather() {
  const res = await apiGet("/weather");

  return res.data;
}
