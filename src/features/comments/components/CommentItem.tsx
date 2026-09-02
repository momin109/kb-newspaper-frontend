'use client'

import { useState } from 'react'
import { ThumbsUp } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { formatBanglaRelativeTime } from '@/lib/relativeTime'
import { useAppSelector } from '@/store/hooks'
import { toggleLikeComment } from '../services/comments.service'
import type { Comment } from '../types/comment.types'

/** A single comment (+ its one level of replies). Handles the like-toggle interaction. */
export function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)
  const [likeCount, setLikeCount] = useState(comment.likes.length)
  const [isLiked, setIsLiked] = useState(false)
  const [isPending, setIsPending] = useState(false)

  async function handleLike() {
    if (!isAuthenticated || isPending) return
    setIsPending(true)
    const nextLiked = !isLiked
    setIsLiked(nextLiked)
    setLikeCount((c) => (nextLiked ? c + 1 : c - 1))
    try {
      await toggleLikeComment(comment._id)
    } catch {
      // revert on failure
      setIsLiked(!nextLiked)
      setLikeCount((c) => (nextLiked ? c - 1 : c + 1))
      toast.error('কিছু একটা সমস্যা হয়েছে।')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className={cn('flex gap-3', isReply && 'ml-10 mt-3')}>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
        {(comment.user?.fullName ?? 'অ')[0]}
      </div>
      <div className="min-w-0 flex-1">
        <div className="rounded-lg bg-secondary/50 px-3 py-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold">{comment.user?.fullName ?? 'অজ্ঞাত ব্যবহারকারী'}</p>
            {!comment.isApproved && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                অনুমোদনের অপেক্ষায়
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-foreground">{comment.text}</p>
        </div>
        <div className="mt-1 flex items-center gap-3 px-1 text-xs text-muted-foreground">
          <span>{formatBanglaRelativeTime(comment.createdAt)}</span>
          <button
            onClick={handleLike}
            disabled={!isAuthenticated}
            className={cn(
              'flex items-center gap-1 hover:text-primary disabled:cursor-not-allowed disabled:opacity-60',
              isLiked && 'text-primary'
            )}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            {likeCount > 0 && likeCount}
          </button>
        </div>

        {comment.replies?.map((reply) => (
          <CommentItem key={reply._id} comment={reply} isReply />
        ))}
      </div>
    </div>
  )
}
