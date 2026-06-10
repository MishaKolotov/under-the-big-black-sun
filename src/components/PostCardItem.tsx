import { Link } from '@/i18n/routing'
import type { PostCard } from '@/lib/getPosts'

// Presentational only — NO server-only imports (no `payload`). Usable from both the
// server-rendered home list and the client-side LoadMore appended items.
// Direction A: a numbered ledger row — circle index, italic serif title, date.
export interface PostCardItemProps {
  post: PostCard
  /** 1-based position in the wall — printed in the circle. */
  index: number
  /** Locale-formatted date string (formatting done by the caller so this stays presentational). */
  formattedDate: string
}

export function PostCardItem({ post, index, formattedDate }: PostCardItemProps) {
  return (
    <li className="post-row">
      <Link href={`/posts/${post.slug}`} className="post-row__link">
        <span className="post-row__num" aria-hidden="true">
          {index}
        </span>
        <h2 className="post-row__title">{post.title}</h2>
        <time className="post-row__date" dateTime={post.publishedDate}>
          {formattedDate}
        </time>
        {post.excerpt ? <p className="post-row__excerpt">{post.excerpt}</p> : null}
      </Link>
    </li>
  )
}

export default PostCardItem
