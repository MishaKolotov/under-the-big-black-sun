'use client'

import { useState } from 'react'
import { useLocale, useTranslations, useFormatter } from 'next-intl'
import PostCardItem from '@/components/PostCardItem'
import type { PostCard, Cursor } from '@/lib/getPosts'

type ApiResponse = { items: PostCard[]; nextCursor: Cursor | null }

export interface LoadMoreProps {
  /** Cursor for the page AFTER the server-rendered first page. Null hides the button. */
  initialCursor: Cursor | null
  /** Page size — matches the server's first-page limit. */
  limit?: number
}

/**
 * CLIENT cursor-pagination control. Fetches /api/public/posts with the seeded keyset cursor,
 * appends the returned cards, and hides itself when nextCursor is null. Not infinite
 * scroll, not numbered pages.
 */
export function LoadMore({ initialCursor, limit = 6 }: LoadMoreProps) {
  const locale = useLocale()
  const t = useTranslations('Home')
  const format = useFormatter()

  const [items, setItems] = useState<PostCard[]>([])
  const [cursor, setCursor] = useState<Cursor | null>(initialCursor)
  const [loading, setLoading] = useState(false)

  const formatDate = (iso: string) => format.dateTime(new Date(iso), { dateStyle: 'long' })

  const loadMore = async () => {
    if (!cursor || loading) return
    setLoading(true)
    try {
      const params = new URLSearchParams({
        locale,
        limit: String(limit),
        cursorDate: cursor.date,
        cursorId: cursor.id,
      })
      const res = await fetch(`/api/public/posts?${params.toString()}`)
      if (!res.ok) return
      const data: ApiResponse = await res.json()
      setItems((prev) => [...prev, ...data.items])
      setCursor(data.nextCursor)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {items.length > 0 ? (
        <div className="post-grid">
          {items.map((post) => (
            <PostCardItem key={post.id} post={post} formattedDate={formatDate(post.publishedDate)} />
          ))}
        </div>
      ) : null}

      {cursor ? (
        <div className="load-more">
          <button
            type="button"
            className="btn-zine zine-border zine-shadow-sm"
            onClick={loadMore}
            disabled={loading}
          >
            {t('loadMore')}
          </button>
        </div>
      ) : null}
    </>
  )
}

export default LoadMore
