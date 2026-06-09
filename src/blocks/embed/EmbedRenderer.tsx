import { parseEmbed, type EmbedProvider } from './provider'

// Responsive embed renderer used by the frontend post-content renderer. Renders a 16:9 iframe
// for recognized providers, or a safe fallback link otherwise.
//
// SECURITY NOTE: this project sets NO Content-Security-Policy, so third-party iframes load
// without a frame-src allowlist. If a CSP is ever added, embed hosts (youtube.com,
// w.soundcloud.com, *.bandcamp.com) must be added to frame-src or these will be blocked.

export type EmbedRendererProps = {
  url: string
  // provider is authored in the block but we re-derive the embed src from the url at render time.
  provider?: EmbedProvider
}

// Per-provider iframe permissions. SoundCloud/Bandcamp are audio; YouTube needs the video set.
const ALLOW: Record<EmbedProvider, string> = {
  youtube:
    'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
  soundcloud: 'autoplay',
  bandcamp: 'autoplay',
}

export function EmbedRenderer({ url }: EmbedRendererProps) {
  const parsed = parseEmbed(url)

  if (!parsed) {
    // Unrecognized host: never iframe arbitrary URLs — show a plain external link.
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {url}
      </a>
    )
  }

  return (
    <div
      style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}
      data-embed-provider={parsed.provider}
    >
      <iframe
        src={parsed.embedUrl}
        title={`${parsed.provider} embed`}
        loading="lazy"
        allow={ALLOW[parsed.provider]}
        allowFullScreen
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
      />
    </div>
  )
}

export default EmbedRenderer
