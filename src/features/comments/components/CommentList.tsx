import { CommentItem } from './CommentItem'
import { EmptyState } from '@/components/common/EmptyState'
import type { Comment } from '../types/comment.types'

export function CommentList({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return <EmptyState message="এখনো কোনো মন্তব্য নেই। প্রথম মন্তব্যটি করুন।" />
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <CommentItem key={comment._id} comment={comment} />
      ))}
    </div>
  )
}
