// We deliberately do NOT HTML-escape comment text here. The React client renders comment
// nickname/body as text children (e.g. {comment.body}), and JSX auto-escapes text at render —
// that is the correct, sufficient XSS protection (the text is never fed to
// dangerouslySetInnerHTML). Escaping at write time would double-encode, so users would literally
// see entities like &#39; and &amp; on screen. So we store and return RAW trimmed text and keep
// only validation here.

// Fraction of the string made up of URL text. Used to reject link-spam comments.
const linkRatio = (s: string): number => {
  const urls = (s.match(/https?:\/\/\S+/gi) || []).join('').length
  return s.length ? urls / s.length : 0
}

export type CleanResult =
  | { ok: true; nickname: string; body: string }
  | { ok: false; reason: 'empty' | 'too-long' | 'links-only' }

export const cleanComment = (nickname: string, body: string): CleanResult => {
  const n = (nickname || '').trim()
  const b = (body || '').trim()
  if (!n || !b) return { ok: false, reason: 'empty' }
  if (n.length > 60 || b.length > 2000) return { ok: false, reason: 'too-long' }
  if (linkRatio(b) > 0.5) return { ok: false, reason: 'links-only' }
  return { ok: true, nickname: n, body: b }
}
