// Escape the 5 HTML-significant chars so stored/returned text can never inject markup.
const ESCAPE_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

export const escapeHtml = (s: string): string =>
  s.replace(/[&<>"']/g, (c) => ESCAPE_MAP[c] as string)

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
  return { ok: true, nickname: escapeHtml(n), body: escapeHtml(b) }
}
