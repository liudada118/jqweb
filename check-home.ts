import { getPayload } from 'payload'
import config from './src/payload.config'

async function check() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'pages',
    limit: 10,
    overrideAccess: true,
    where: { slug: { equals: 'home' } },
  })
  console.log('Total home pages:', result.totalDocs)
  for (const doc of result.docs) {
    console.log('id:', doc.id, 'slug:', doc.slug, 'status:', (doc as any)._status, 'hero.type:', doc.hero?.type)
    const blocks = (doc.layout || []).map((b: any) => b.blockType)
    console.log('blocks:', blocks)
  }
  process.exit(0)
}
check()
