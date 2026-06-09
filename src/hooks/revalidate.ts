import { revalidatePath } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { locales } from '@/i18n/config'

// Revalidate BOTH locales' home + post page so neither language serves stale cache.
export const revalidatePaths = (slug: string): void => {
  try {
    for (const l of locales) {
      revalidatePath(`/${l}`)
      revalidatePath(`/${l}/posts/${slug}`)
    }
  } catch {
    // revalidatePath throws outside a Next request context (e.g. the `pnpm seed` CLI script,
    // where there's no static-generation store). Revalidation is best-effort — never let it
    // break the underlying create/update/delete or abort the seed.
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
