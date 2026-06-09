// Maps a user-supplied URL to a safe, embeddable iframe src. Returns null for unrecognized
// hosts so callers can render a plain fallback link instead of an iframe.

export type EmbedProvider = 'youtube' | 'bandcamp' | 'soundcloud'

export type ParsedEmbed = { provider: EmbedProvider; embedUrl: string }

// Extracts the 11-char YouTube video id from watch?v=, youtu.be/ or /embed/ forms.
const youtubeId = (u: URL): string | null => {
  const host = u.hostname.replace(/^www\./, '')
  if (host === 'youtu.be') return u.pathname.slice(1).split('/')[0] || null
  if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (u.pathname === '/watch') return u.searchParams.get('v')
    const m = u.pathname.match(/^\/(?:embed|shorts)\/([^/?]+)/)
    if (m) return m[1]
  }
  return null
}

export const parseEmbed = (url: string): ParsedEmbed | null => {
  let u: URL
  try {
    u = new URL(url)
  } catch {
    return null
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null

  const host = u.hostname.replace(/^www\./, '')

  const ytId = youtubeId(u)
  if (ytId) return { provider: 'youtube', embedUrl: `https://www.youtube.com/embed/${ytId}` }

  // SoundCloud has a stable player endpoint that takes the original track/set URL.
  if (host === 'soundcloud.com' || host.endsWith('.soundcloud.com')) {
    return {
      provider: 'soundcloud',
      embedUrl: `https://w.soundcloud.com/player/?url=${encodeURIComponent(u.toString())}`,
    }
  }

  // Bandcamp does NOT expose a clean iframe src derivable from a page URL — their real embed
  // requires the album/track numeric id from their oEmbed/embed code. We can't fetch that here,
  // so we keep the provider tag and pass the original URL through; the renderer iframes the page
  // directly (works for most Bandcamp pages) and falls back to a link if it refuses to frame.
  if (host === 'bandcamp.com' || host.endsWith('.bandcamp.com')) {
    return { provider: 'bandcamp', embedUrl: u.toString() }
  }

  return null
}
