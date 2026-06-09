'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { useTranslations, useFormatter } from 'next-intl'
import { getAnonId } from '@/lib/anonId'

type CommentDTO = {
  id: string
  nickname: string
  body: string
  createdAt: string
  likeCount: number
}

export interface CommentsProps {
  postId: string
}

/**
 * CLIENT comments + likes. Comments are fetched on mount (never baked into static HTML).
 * Comment bodies are rendered as React text ({comment.body}) — backend returns RAW text and
 * React auto-escapes it; we NEVER use dangerouslySetInnerHTML.
 */
export default function Comments({ postId }: CommentsProps) {
  const t = useTranslations('Post')
  const tc = useTranslations('Comments')
  const format = useFormatter()

  const [comments, setComments] = useState<CommentDTO[]>([])
  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const [pendingLikes, setPendingLikes] = useState<Set<string>>(new Set())

  const [nickname, setNickname] = useState('')
  const [body, setBody] = useState('')
  const [website, setWebsite] = useState('') // honeypot — must stay empty
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    void (async () => {
      try {
        const res = await fetch(`/api/comments?post=${encodeURIComponent(postId)}`)
        if (!res.ok) {
          if (active) setLoadError(true)
          return
        }
        const data: { comments: CommentDTO[] } = await res.json()
        if (active) setComments(data.comments)
      } catch {
        if (active) setLoadError(true)
      } finally {
        if (active) setLoaded(true)
      }
    })()
    return () => {
      active = false
    }
  }, [postId])

  const toggleLike = async (commentId: string) => {
    // Per-comment in-flight guard — ignore rapid double-clicks on the same comment.
    if (pendingLikes.has(commentId)) return
    setPendingLikes((s) => {
      const next = new Set(s)
      next.add(commentId)
      return next
    })

    const wasLiked = liked[commentId] ?? false
    // Optimistic update.
    setLiked((m) => ({ ...m, [commentId]: !wasLiked }))
    setComments((cs) =>
      cs.map((c) =>
        c.id === commentId ? { ...c, likeCount: c.likeCount + (wasLiked ? -1 : 1) } : c,
      ),
    )

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment: commentId, anonId: getAnonId() }),
      })
      if (!res.ok) throw new Error('like failed')
      const data: { liked: boolean; likeCount: number } = await res.json()
      // Reconcile with server truth.
      setLiked((m) => ({ ...m, [commentId]: data.liked }))
      setComments((cs) =>
        cs.map((c) => (c.id === commentId ? { ...c, likeCount: data.likeCount } : c)),
      )
    } catch {
      // Roll back optimistic change on failure.
      setLiked((m) => ({ ...m, [commentId]: wasLiked }))
      setComments((cs) =>
        cs.map((c) =>
          c.id === commentId ? { ...c, likeCount: c.likeCount + (wasLiked ? 1 : -1) } : c,
        ),
      )
    } finally {
      setPendingLikes((s) => {
        const next = new Set(s)
        next.delete(commentId)
        return next
      })
    }
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setNotice(null)

    if (!nickname.trim() || !body.trim()) {
      setError(tc('emptyField'))
      return
    }
    if (body.length > 2000) {
      setError(tc('tooLong'))
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ post: postId, nickname, body, website }),
      })

      if (res.status === 429) {
        setError(tc('rateLimited'))
        return
      }
      if (!res.ok) {
        setError(tc('errorGeneric'))
        return
      }

      const data: { comment: CommentDTO; pending: boolean } = await res.json()
      if (data.pending) {
        setNotice(t('awaitingModeration'))
      } else {
        setComments((cs) => [data.comment, ...cs])
      }
      setNickname('')
      setBody('')
    } catch {
      setError(tc('errorGeneric'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="comments" aria-labelledby="comments-heading">
      <h2 id="comments-heading" className="comments__heading zine-display">
        {t('comments')}
      </h2>

      <form className="comment-form zine-border" onSubmit={onSubmit} noValidate>
        <h3 className="zine-stamp">{t('leaveComment')}</h3>

        <label className="comment-form__field">
          <span className="zine-stamp">{t('nickname')}</span>
          <input
            type="text"
            name="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            maxLength={60}
            autoComplete="off"
            required
          />
        </label>

        <label className="comment-form__field">
          <span className="zine-stamp">{t('commentBody')}</span>
          <textarea
            name="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={2000}
            rows={4}
            required
          />
        </label>

        {/* Honeypot: hidden from users and assistive tech; real submitters leave it empty. */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            whiteSpace: 'nowrap',
          }}
        >
          <label>
            Website
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </label>
        </div>

        {error ? (
          <p className="comment-form__error" role="alert">
            {error}
          </p>
        ) : null}
        {notice ? (
          <p className="comment-form__notice" role="status">
            {notice}
          </p>
        ) : null}

        <button
          type="submit"
          className="btn-zine zine-border zine-shadow-sm"
          disabled={submitting}
        >
          {t('submit')}
        </button>
      </form>

      <ul className="comment-list">
        {loaded && comments.length === 0 ? (
          loadError ? (
            <li className="comment-list__error zine-body" role="alert">
              {tc('errorGeneric')}
            </li>
          ) : (
            <li className="comment-list__empty zine-body">{tc('empty')}</li>
          )
        ) : null}

        {comments.map((c) => (
          <li key={c.id} className="comment zine-border">
            <div className="comment__meta">
              <span className="comment__nickname zine-stamp">{c.nickname}</span>
              <time className="comment__date zine-stamp" dateTime={c.createdAt}>
                {format.dateTime(new Date(c.createdAt), { dateStyle: 'medium' })}
              </time>
            </div>
            {/* RAW text from backend — React escapes it. Never dangerouslySetInnerHTML. */}
            <p className="comment__body zine-body">{c.body}</p>
            <button
              type="button"
              className="comment__like btn-zine"
              aria-pressed={liked[c.id] ?? false}
              onClick={() => toggleLike(c.id)}
              disabled={pendingLikes.has(c.id)}
            >
              <span aria-hidden="true">♥</span> {t('likes', { count: c.likeCount })}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
