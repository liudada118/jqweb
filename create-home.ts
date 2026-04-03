import { getPayload } from 'payload'
import config from './src/payload.config'

async function createHomePage() {
  const payload = await getPayload({ config })
  
  // Check if home exists
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })
  
  if (docs.length > 0) {
    console.log('Home page already exists, updating...')
    await payload.update({
      collection: 'pages',
      id: docs[0].id,
      context: { disableRevalidate: true },
      data: {
        title: '首页',
        hero: { type: 'none' as const },
        layout: getHomeLayout(),
        meta: {
          title: '首页',
          description: '柜侨工业 — 以精密光纤传感技术为核心，为全球工业客户提供智能化监测与控制解决方案',
        },
      },
    })
    console.log('✅ Home page updated!')
  } else {
    console.log('Creating new home page...')
    await payload.create({
      collection: 'pages',
      context: { disableRevalidate: true },
      data: {
        title: '首页',
        slug: 'home',
        _status: 'published',
        hero: { type: 'none' as const },
        layout: getHomeLayout(),
        meta: {
          title: '首页',
          description: '柜侨工业 — 以精密光纤传感技术为核心，为全球工业客户提供智能化监测与控制解决方案',
        },
      } as any,
    })
    console.log('✅ Home page created!')
  }
  
  // Verify
  const { docs: verify } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    limit: 1,
  })
  if (verify.length > 0) {
    const blocks = (verify[0].layout || []).map((b: any) => b.blockType)
    console.log(`Verified: id=${verify[0].id}, slug=${verify[0].slug}, blocks=${blocks.join(', ')}`)
  }
  
  process.exit(0)
}

function getHomeLayout(): any[] {
  return [
    {
      blockType: 'heroBanner',
      title: '柜侨工业',
      subtitle: 'GUIQIAO INDUSTRIAL',
      description: '以精密光纤传感技术为核心，为全球工业客户提供智能化监测与控制解决方案',
      ctaButtons: [
        { label: '了解更多', url: '/brand-story' },
        { label: '产品中心', url: '/products' },
      ],
    },
    {
      blockType: 'stats',
      items: [
        { value: '20+', unit: '年', label: '行业深耕' },
        { value: '500+', unit: '人', label: '专业团队' },
        { value: '30+', unit: '个', label: '覆盖国家' },
        { value: '1000+', unit: '项', label: '成功案例' },
      ],
    },
    {
      blockType: 'businessCards',
      sectionTitle: '认识部门',
      sectionSubtitle: '三大事业部，覆盖工业传感全场景',
      cards: [
        { title: '关怀事业部', description: '专注医疗健康领域的柔性压力传感技术，为智慧医疗提供精准监测方案', linkUrl: '/care', linkText: '了解更多' },
        { title: '精密事业部', description: '以FBG光纤传感技术为核心，为基础设施和工业领域提供高精度监测系统', linkUrl: '/precision', linkText: '了解更多' },
        { title: '定制事业部', description: '根据客户特定需求，提供从传感器设计到系统集成的一站式定制化解决方案', linkUrl: '/customsolutions', linkText: '了解更多' },
      ],
    },
    {
      blockType: 'newsHighlight',
      sectionTitle: '新闻资讯',
      sectionSubtitle: 'NEWS & UPDATES',
      maxItems: 3,
      showMoreLink: true,
      showMoreUrl: '/posts',
    },
    {
      blockType: 'productShowcase',
      sectionTitle: '产品和解决方案',
      sectionSubtitle: '基于自主研发的智能纤维传感技术，为工业、医疗、汽车等领域提供全方位的解决方案。',
      products: [
        { name: 'CU7+ 光纤传感器', description: '高精度FBG光纤传感器，测量精度达到纳米级别', linkUrl: '/products' },
        { name: 'ICU11 智能监测平台', description: '集成AI数据分析的智能监测平台', linkUrl: '/products' },
      ],
    },
    {
      blockType: 'socialChannels',
      sectionTitle: '请关注我们',
      channels: [
        { platform: 'wechat', name: '公众号', url: '#' },
        { platform: 'douyin', name: '视频号', url: '#' },
        { platform: 'other', name: 'bilibili', url: '#' },
        { platform: 'weibo', name: '微博', url: '#' },
      ],
    },
    {
      blockType: 'contactInfo',
      sectionTitle: '联系我们',
      companyName: '柜侨工业科技有限公司',
      address: '中国广东省深圳市南山区科技园\n高新南一道88号\n柜侨工业大厦',
      phone: '+86-755-8888-6666',
      email: 'info@guiqiao.com',
      fax: '+86-755-8888-6667',
    },
  ]
}

createHomePage().catch(err => {
  console.error('Failed:', err)
  process.exit(1)
})
