import Image from 'next/image'
import { Link } from '@/i18n/routing'
import { Halftone } from '@/components/zine/Halftone'
import type { PostCard } from '@/lib/getPosts'

// Presentational only — NO server-only imports (no `payload`). Usable from both the
// server-rendered home list and the client-side LoadMore appended items.
export interface PostCardItemProps {
  post: PostCard
  /** Locale-formatted date string (formatting done by the caller so this stays presentational). */
  formattedDate: string
}

export function PostCardItem({ post, formattedDate }: PostCardItemProps) {
  return (
    <article className="post-card zine-border zine-shadow-sm">
      <Link href={`/posts/${post.slug}`} className="post-card__link">
        {post.coverImage ? (
          <Halftone className="post-card__cover">
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt}
              width={post.coverImage.width || 800}
              height={post.coverImage.height || 600}
              sizes="(max-width: 720px) 100vw, 360px"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </Halftone>
        ) : null}
        <div className="post-card__body">
          <h2 className="post-card__title zine-display">{post.title}</h2>
          <p className="post-card__date zine-stamp">{formattedDate}</p>
          {post.excerpt ? <p className="post-card__excerpt zine-body">{post.excerpt}</p> : null}
        </div>
      </Link>
    </article>
  )
}

export default PostCardItem
