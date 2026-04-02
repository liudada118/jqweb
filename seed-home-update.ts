import { getPayload } from 'payload'
import config from './src/payload.config'

async function updateHomePage() {
  const payload = await getPayload({ config })

  // Get the home page
  const { docs: pages } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })

  if (pages.length === 0) {
    console.error('Home page not found!')
    process.exit(1)
  }

  const homePage = pages[0]
  console.log(`Found home page: id=${homePage.id}, title=${homePage.title}`)
  console.log(`Current blocks: ${(homePage.layout || []).map((b: any) => b.blockType).join(', ')}`)

  // Get existing layout blocks
  const existingLayout = homePage.layout || []

  // Find the contactInfo block (should be last)
  const contactInfoIndex = existingLayout.findIndex((b: any) => b.blockType === 'contactInfo')
  
  // Create new blocks to insert before contactInfo
  const productShowcaseBlock = {
    blockType: 'productShowcase',
    sectionTitle: '产品和解决方案',
    sectionSubtitle: '基于自主研发的智能纤维传感技术，为工业、医疗、汽车等领域提供全方位的解决方案。',
    products: [
      {
        name: 'CU7+ 光纤传感器',
        description: '高精度FBG光纤传感器，测量精度达到纳米级别',
        linkUrl: '/products',
      },
      {
        name: 'ICU11 智能监测平台',
        description: '集成AI数据分析的智能监测平台',
        linkUrl: '/products',
      },
    ],
  }

  const socialChannelsBlock = {
    blockType: 'socialChannels',
    sectionTitle: '请关注我们',
    channels: [
      { platform: 'wechat', name: '公众号', url: '#' },
      { platform: 'douyin', name: '视频号', url: '#' },
      { platform: 'other', name: 'bilibili', url: '#' },
      { platform: 'weibo', name: '微博', url: '#' },
    ],
  }

  // Build new layout: insert productShowcase and socialChannels before contactInfo
  const newLayout = [...existingLayout]
  if (contactInfoIndex >= 0) {
    // Insert before contactInfo
    newLayout.splice(contactInfoIndex, 0, productShowcaseBlock, socialChannelsBlock)
  } else {
    // Append at end
    newLayout.push(productShowcaseBlock, socialChannelsBlock)
  }

  // Update the home page
  await payload.update({
    collection: 'pages',
    id: homePage.id,
    context: { disableRevalidate: true },
    data: {
      layout: newLayout as any,
      meta: {
        title: '首页',
        description: '柜侨工业 — 以精密光纤传感技术为核心，为全球工业客户提供智能化监测与控制解决方案',
      },
    },
  })

  console.log('✅ Home page updated with productShowcase and socialChannels blocks!')
  console.log(`New blocks: ${newLayout.map((b: any) => b.blockType).join(', ')}`)

  // Also update meta titles for all other pages
  const allPages = await payload.find({
    collection: 'pages',
    limit: 20,
  })

  const titleMap: Record<string, string> = {
    'brand-story': '品牌故事',
    'products': '产品与解决方案',
    'care': '关怀事业部',
    'precision': '精密事业部',
    'customsolutions': '定制事业部',
  }

  for (const page of allPages.docs) {
    const metaTitle = titleMap[page.slug]
    if (metaTitle && (!page.meta?.title || page.meta.title !== metaTitle)) {
      await payload.update({
        collection: 'pages',
        id: page.id,
        context: { disableRevalidate: true },
        data: {
          meta: {
            ...page.meta,
            title: metaTitle,
          },
        },
      })
      console.log(`  ✓ Updated meta title for ${page.slug}: "${metaTitle}"`)
    }
  }

  console.log('\n✅ All page meta titles updated!')
  process.exit(0)
}

updateHomePage().catch((err) => {
  console.error('Update failed:', err)
  process.exit(1)
})
