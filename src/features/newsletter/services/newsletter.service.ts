import { apiClient } from "@/lib/axios";
import type { NewsletterFormValues } from "../schemas/newsletterSchema";

interface NewsletterResponse {
  success: boolean;
  message: string;
  data?: {
    _id: string;
    email: string;
    isActive: boolean;
    subscribedAt: string;
    source: string;
  };
}

/**
 * Subscribe to newsletter
 *
 * Backend:
 * POST /api/newsletter/subscribe
 */
export async function subscribeNewsletter(
  payload: NewsletterFormValues,
): Promise<NewsletterResponse> {
  const response = await apiClient.post<NewsletterResponse>(
    "/newsletter/subscribe",
    payload,
  );

  return response.data;
}
