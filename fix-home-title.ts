import { getPayload } from 'payload'
import config from './src/payload.config'

async function fixHomeTitle() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })

  if (docs.length > 0) {
    const home = docs[0]
    await payload.update({
      collection: 'pages',
      id: home.id,
      context: { disableRevalidate: true },
      data: {
        meta: {
          ...home.meta,
          title: '柜侨工业 | 精密工业解决方案',
        },
      },
    })
    console.log('✅ Home page meta.title updated to "柜侨工业 | 精密工业解决方案"')
  }

  process.exit(0)
}

fixHomeTitle().catch(console.error)
