import { apiClient } from '@/lib/axios'
import type { NewsletterFormValues } from '../schemas/newsletterSchema'

/**
 * The kb-newspaper-server backend has NO newsletter-subscriber endpoint
 * at all (checked all routes/*.js). This is a no-op stub until that's
 * added — TODO: wire to a real POST /api/newsletter/subscribe once it
 * exists on the backend.
 */
export async function subscribeNewsletter(payload: NewsletterFormValues): Promise<void> {
  const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API !== 'false'
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return
  }
  await apiClient.post('/newsletter/subscribe', payload)
}
