import { getPayload } from 'payload'
import config from './src/payload.config'

async function fixHomeStatus() {
  const payload = await getPayload({ config })
  
  const result = await payload.find({
    collection: 'pages',
    limit: 1,
    overrideAccess: true,
    where: { slug: { equals: 'home' } },
  })
  
  if (result.docs.length === 0) {
    console.error('Home page not found!')
    process.exit(1)
  }
  
  const home = result.docs[0]
  console.log(`Current status: ${(home as any)._status}`)
  
  await payload.update({
    collection: 'pages',
    id: home.id,
    context: { disableRevalidate: true },
    data: {
      _status: 'published',
    },
  })
  
  // Verify
  const verify = await payload.findByID({
    collection: 'pages',
    id: home.id,
    overrideAccess: true,
  })
  console.log(`Updated status: ${(verify as any)._status}`)
  console.log('✅ Home page published!')
  process.exit(0)
}

fixHomeStatus().catch(err => {
  console.error('Failed:', err)
  process.exit(1)
})
