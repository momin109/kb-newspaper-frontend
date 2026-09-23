import { apiGet } from "@/lib/api-fetch";

import type { Media, MediaType } from "../types/media.types";

interface MediaListResponse {
  success: boolean;
  message: string;
  total: number;
  page: number;
  limit: number;
  data: Media[];
}

const EMPTY_RESPONSE = (page: number, limit: number): MediaListResponse => ({
  success: false,
  message: "Media temporarily unavailable",
  total: 0,
  page,
  limit,
  data: [],
});

/**
 * GET /api/media/all — Server Component-এ ব্যবহারের জন্য apiGet (fetch)
 * ব্যবহার করা হচ্ছে, axios apiClient না (সেটা শুধু client-side mutation-এর
 * জন্য)। backend ডাউন থাকলে বা error দিলে পুরো পেজ ক্র্যাশ না করে খালি
 * লিস্ট রিটার্ন করে — homepage graceful-ভাবে render হবে।
 */
export async function getPublicMedia(
  type: MediaType,
  page = 1,
  limit = 10,
): Promise<MediaListResponse> {
  try {
    return await apiGet<MediaListResponse>(
      `/media/all?type=${type}&page=${page}&limit=${limit}`,
      { revalidate: 120 },
    );
  } catch (error) {
    console.error(`getPublicMedia(${type}) failed:`, error);
    return EMPTY_RESPONSE(page, limit);
  }
}
