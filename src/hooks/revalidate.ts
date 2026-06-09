import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

// Revalidate BOTH locales' home + post page so neither language serves stale cache.
export const revalidatePaths = (slug: string): void => {
  for (const l of ['en', 'pl']) {
    revalidatePath(`/${l}`)
    revalidatePath(`/${l}/posts/${slug}`)
  }
}

export const revalidatePost: CollectionAfterChangeHook = ({ doc }) => {
  if (doc?.slug) revalidatePaths(doc.slug as string)
  return doc
}

// afterDelete has a different (no previousDoc/data) signature, so it gets its own typed variant.
export const revalidatePostDelete: CollectionAfterDeleteHook = ({ doc }) => {
  if (doc?.slug) revalidatePaths(doc.slug as string)
  return doc
}
