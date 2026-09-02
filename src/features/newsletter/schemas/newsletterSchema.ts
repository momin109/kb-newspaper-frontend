import { z } from 'zod'

export const newsletterSchema = z.object({
  email: z.string().min(1, 'ইমেইল আবশ্যক').email('সঠিক ইমেইল ঠিকানা দিন'),
})
export type NewsletterFormValues = z.infer<typeof newsletterSchema>
