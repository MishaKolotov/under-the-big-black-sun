import Image from 'next/image'
import {
  RichText,
  type JSXConvertersFunction,
} from '@payloadcms/richtext-lexical/react'
import type {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedUploadNode,
} from '@payloadcms/richtext-lexical'
import type { JSXConverterArgs } from '@payloadcms/richtext-lexical/react'
import type { EmbedBlock, Media } from '@/payload-types'
import EmbedRenderer from '@/blocks/embed/EmbedRenderer'

// The post content's serialized editor state. Payload's generated `content` type is a loose
// `{ root: ... }` shape; RichText accepts that data directly, so we type the prop minimally
// and cast at the single call boundary below.
export type LexicalContentData = { root: unknown } & Record<string, unknown>

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<EmbedBlock>

// Render inline upload nodes as responsive next/image (Blob URL + alt from the Media doc),
// overriding the default upload converter so images get proper optimization + alt text.
const renderUpload = ({ node }: JSXConverterArgs<SerializedUploadNode>) => {
  const value = node.value
  const media = value && typeof value === 'object' ? (value as Media) : null
  if (!media || !media.url) return null

  const width = media.width ?? 1200
  const height = media.height ?? 800
  return (
    <Image
      src={media.url}
      alt={media.alt ?? ''}
      width={width}
      height={height}
      sizes="(max-width: 720px) 100vw, 720px"
      style={{ width: '100%', height: 'auto' }}
    />
  )
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  upload: renderUpload,
  blocks: {
    embed: ({ node }) => {
      const fields = node.fields
      if (!fields?.url) return null
      return <EmbedRenderer url={fields.url} provider={fields.provider} />
    },
  },
})

export interface LexicalContentProps {
  data: LexicalContentData
  className?: string
}

/**
 * Server component: renders Payload Lexical richText JSON to React via the official
 * @payloadcms/richtext-lexical/react `RichText` converter. Paragraphs, headings, lists,
 * quotes, links, code blocks, dividers and inline upload images are handled by the default
 * converters (upload overridden for next/image); the custom `embed` block is wired through
 * EmbedRenderer.
 */
export default function LexicalContent({ data, className }: LexicalContentProps) {
  return (
    <RichText
      className={['prose', className].filter(Boolean).join(' ')}
      converters={jsxConverters}
      // RichText's `data` is the serialized editor state; Payload's generated type is looser.
      data={data as Parameters<typeof RichText>[0]['data']}
    />
  )
}
