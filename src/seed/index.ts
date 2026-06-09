import { getPayload } from 'payload'
import config from '../payload.config'

// Minimal valid Lexical document for a single paragraph of text.
const lexicalDoc = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        version: 1,
        children: [{ type: 'text', version: 1, text }],
      },
    ],
    direction: null,
    format: '',
    indent: 0,
    version: 1,
  },
})

// Idempotent: upsert by slug `example-post`. One published EN+PL post + one approved comment.
const run = async (): Promise<void> => {
  const payload = await getPayload({ config })
  const existing = await payload.find({
    collection: 'posts',
    where: { slug: { equals: 'example-post' } },
    limit: 1,
  })
  let post = existing.docs[0]
  if (!post) {
    post = await payload.create({
      collection: 'posts',
      locale: 'en',
      data: {
        title: 'First Transmission',
        slug: 'example-post',
        status: 'published',
        publishedDate: new Date().toISOString(),
        excerpt: 'A test post from the photocopier.',
        content: lexicalDoc('Hello from the zine.') as never,
      },
    })
    await payload.update({
      collection: 'posts',
      id: post.id,
      locale: 'pl',
      data: {
        title: 'Pierwsza transmisja',
        excerpt: 'Testowy wpis z ksero.',
        content: lexicalDoc('Witaj z zinu.') as never,
      },
    })
    await payload.create({
      collection: 'comments',
      data: { post: post.id, nickname: 'xerox_kid', body: 'first!', approved: true },
    })
  }
  console.log('Seed complete:', post.slug)
  process.exit(0)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
