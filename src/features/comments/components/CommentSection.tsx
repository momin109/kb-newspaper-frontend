'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'

import { CommentForm } from './CommentForm'
import { CommentList } from './CommentList'
import type { Comment } from '../types/comment.types'

const toBn = (n: number) =>
  String(n).replace(/[0-9]/g, (d) => '০১২৩৪৫৬৭৮৯'[Number(d)])

/**
 * Client wrapper: takes the server-fetched initial comment list and
 * holds it in local state so a freshly posted (pending-approval)
 * comment can be shown immediately without a full page refetch.
 */
export function CommentSection({
  articleId,
  initialComments,
}: {
  articleId: string
  initialComments: Comment[]
}) {
  const [comments, setComments] = useState(initialComments)

  function countAll(list: Comment[]): number {
    return list.reduce((sum, c) => sum + 1 + (c.replies?.length ?? 0), 0)
  }

  return (
    <section className="mt-8">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-extrabold">
        <MessageSquare className="h-5 w-5" />
        মন্তব্য ({toBn(countAll(comments))})
      </h2>

      <div className="mb-6">
        <CommentForm
          articleId={articleId}
          onPosted={(newComment) => {
            setComments((prev) => [{ ...newComment, replies: [] }, ...prev])
          }}
        />
      </div>

      <CommentList comments={comments} />
    </section>
  )
}
