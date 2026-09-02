import type { Comment } from '../types/comment.types'

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString()
}

export function buildMockComments(articleId: string): Comment[] {
  return [
    {
      _id: 'cm1',
      article: articleId,
      user: { _id: 'u10', fullName: 'রহিম উদ্দিন' },
      text: 'খুব গুরুত্বপূর্ণ একটি প্রতিবেদন। ধন্যবাদ।',
      parent: null,
      likes: ['u11', 'u12'],
      isApproved: true,
      createdAt: hoursAgo(5),
      updatedAt: hoursAgo(5),
      replies: [
        {
          _id: 'cm2',
          article: articleId,
          user: { _id: 'u13', fullName: 'করিম হোসেন' },
          text: 'সহমত পোষণ করছি।',
          parent: 'cm1',
          likes: [],
          isApproved: true,
          createdAt: hoursAgo(3),
          updatedAt: hoursAgo(3),
        },
      ],
    },
    {
      _id: 'cm3',
      article: articleId,
      user: { _id: 'u14', fullName: 'সুমাইয়া আক্তার' },
      text: 'আরও বিস্তারিত জানতে চাই এই বিষয়ে।',
      parent: null,
      likes: [],
      isApproved: true,
      createdAt: hoursAgo(8),
      updatedAt: hoursAgo(8),
      replies: [],
    },
  ]
}
