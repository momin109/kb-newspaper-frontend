import { z } from 'zod'

export const commentSchema = z.object({
  text: z.string().min(1, 'মন্তব্য লিখুন').max(1000, 'মন্তব্য অনেক বড় হয়ে গেছে'),
})
export type CommentFormValues = z.infer<typeof commentSchema>
