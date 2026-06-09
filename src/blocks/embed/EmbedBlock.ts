import type { Block } from 'payload'

// Lexical block (for BlocksFeature) letting Karol embed a YouTube / Bandcamp / SoundCloud URL
// inside post content. We store BOTH the url and a provider tag:
//  - `url`: the canonical page/track URL the author pastes.
//  - `provider`: picked by the author; the renderer also re-derives via parseEmbed(url), but
//    storing it keeps the stored data self-describing and lets the admin label the block.
export const EmbedBlock: Block = {
  slug: 'embed',
  interfaceName: 'EmbedBlock',
  labels: { singular: 'Embed', plural: 'Embeds' },
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: { description: 'Paste a YouTube, Bandcamp, or SoundCloud URL.' },
    },
    {
      name: 'provider',
      type: 'select',
      required: true,
      defaultValue: 'youtube',
      options: [
        { label: 'YouTube', value: 'youtube' },
        { label: 'Bandcamp', value: 'bandcamp' },
        { label: 'SoundCloud', value: 'soundcloud' },
      ],
    },
  ],
}
