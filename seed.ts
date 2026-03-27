import { getPayload } from 'payload'
import config from './src/payload.config'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

async function seed() {
  const payload = await getPayload({ config })

  console.log('🌱 Starting seed...')

  // Create admin user
  try {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@guiqiao.com',
        password: 'admin123',
        name: '管理员',
      },
    })
    console.log('✅ Admin user created')
  } catch (e: any) {
    if (e.message?.includes('unique') || e.message?.includes('already')) {
      console.log('ℹ️ Admin user already exists')
    } else {
      console.error('❌ Error creating admin:', e.message)
    }
  }

  // Create categories
  const categoryTitles = ['公司新闻', '行业动态', '产品发布', '技术文章']
  const categoryIds: Record<string, number> = {}
  for (const title of categoryTitles) {
    try {
      const cat = await payload.create({
        collection: 'categories',
        data: {
          title,
          slug: slugify(title),
        },
      })
      categoryIds[title] = cat.id
      console.log(`✅ Category: ${title}`)
    } catch (e: any) {
      console.log(`ℹ️ Category ${title}: ${e.message}`)
    }
  }

  // Lexical rich text content helper
  const makeRichText = (text: string) => ({
    root: {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              text: text,
              format: 0,
              detail: 0,
              mode: 'normal',
              style: '',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
          textFormat: 0,
          textStyle: '',
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  })

  // Create sample posts
  const posts = [
    {
      title: '柜侨工业荣获2024年度精密制造创新奖',
      slug: 'guiqiao-innovation-award-2024',
      _status: 'published' as const,
      publishedAt: new Date('2024-12-15').toISOString(),
      content: makeRichText('在第十二届中国精密制造技术大会上，柜侨工业凭借其在光纤传感器领域的突破性创新，荣获年度精密制造创新奖。这一荣誉不仅是对柜侨工业技术实力的认可，更是对公司长期坚持自主研发路线的肯定。'),
      meta: {
        title: '柜侨工业荣获2024年度精密制造创新奖',
        description: '在第十二届中国精密制造技术大会上，柜侨工业凭借其在光纤传感器领域的突破性创新，荣获年度精密制造创新奖。',
      },
    },
    {
      title: 'CU7+系列新品发布：重新定义工业传感精度',
      slug: 'cu7-plus-series-launch',
      _status: 'published' as const,
      publishedAt: new Date('2024-11-20').toISOString(),
      content: makeRichText('全新CU7+系列产品正式发布，采用第三代智能光纤传感技术，精度提升40%，适用于更广泛的工业场景。CU7+系列在温度稳定性、抗干扰能力和使用寿命方面均实现了质的飞跃。'),
      meta: {
        title: 'CU7+系列新品发布',
        description: '全新CU7+系列产品正式发布，采用第三代智能光纤传感技术，精度提升40%，适用于更广泛的工业场景。',
      },
    },
    {
      title: '柜侨工业与德国西门子达成战略合作',
      slug: 'siemens-strategic-partnership',
      _status: 'published' as const,
      publishedAt: new Date('2024-10-08').toISOString(),
      content: makeRichText('双方将在智能制造和工业物联网领域展开深度合作，共同推动工业4.0技术在亚太地区的应用。此次合作标志着柜侨工业在国际化战略上迈出了重要一步。'),
      meta: {
        title: '柜侨工业与德国西门子达成战略合作',
        description: '双方将在智能制造和工业物联网领域展开深度合作，共同推动工业4.0技术在亚太地区的应用。',
      },
    },
    {
      title: '智能光纤传感技术在桥梁健康监测中的应用',
      slug: 'fiber-sensor-bridge-monitoring',
      _status: 'published' as const,
      publishedAt: new Date('2024-09-15').toISOString(),
      content: makeRichText('柜侨工业的光纤传感解决方案成功应用于多座大型桥梁的结构健康监测，实现24/7实时数据采集与预警。该系统能够精确检测桥梁结构的微小变形和应力变化，为桥梁安全运营提供可靠保障。'),
      meta: {
        title: '智能光纤传感技术在桥梁健康监测中的应用',
        description: '柜侨工业的光纤传感解决方案成功应用于多座大型桥梁的结构健康监测，实现24/7实时数据采集与预警。',
      },
    },
    {
      title: '柜侨工业参展2024中国国际工业博览会',
      slug: 'ciif-2024-exhibition',
      _status: 'published' as const,
      publishedAt: new Date('2024-08-20').toISOString(),
      content: makeRichText('柜侨工业携全系列产品亮相第24届中国国际工业博览会，展示最新的精密传感与智能制造解决方案。展会期间，公司接待了来自全球30多个国家和地区的专业观众。'),
      meta: {
        title: '柜侨工业参展2024中国国际工业博览会',
        description: '柜侨工业携全系列产品亮相第24届中国国际工业博览会，展示最新的精密传感与智能制造解决方案。',
      },
    },
    {
      title: '行业报告：2024全球精密传感器市场趋势分析',
      slug: 'global-sensor-market-2024',
      _status: 'published' as const,
      publishedAt: new Date('2024-07-10').toISOString(),
      content: makeRichText('根据最新市场研究数据，全球精密传感器市场预计到2028年将达到450亿美元，年复合增长率超过8%。亚太地区将成为增长最快的市场，其中中国市场占据重要份额。'),
      meta: {
        title: '2024全球精密传感器市场趋势分析',
        description: '根据最新市场研究数据，全球精密传感器市场预计到2028年将达到450亿美元，年复合增长率超过8%。',
      },
    },
  ]

  for (const post of posts) {
    try {
      await payload.create({
        collection: 'posts',
        data: post,
      })
      console.log(`✅ Post: ${post.title}`)
    } catch (e: any) {
      console.log(`ℹ️ Post ${post.slug}: ${e.message}`)
    }
  }

  // Create homepage with custom blocks
  try {
    const existingHome = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'home' } },
    })

    const homeData = {
      title: '首页',
      slug: 'home',
      _status: 'published' as const,
      hero: {
        type: 'none' as const,
      },
      layout: [
        {
          blockType: 'heroBanner' as const,
          title: '纤维本身就是传感器',
          subtitle: 'SMART FIBER SENSOR TECHNOLOGY',
          description: '柜侨工业 — 以精密光纤传感技术为核心，为全球工业客户提供智能化监测与控制解决方案',
          ctaButtons: [
            { label: '了解更多', url: '/about', variant: 'primary' as const },
            { label: '产品中心', url: '/products', variant: 'outline' as const },
          ],
        },
        {
          blockType: 'stats' as const,
          items: [
            { value: 'CU7+', label: '产品系列', icon: 'Factory' as const },
            { value: 'ICU11', label: '应用场景', icon: 'Globe' as const },
            { value: '8', unit: '项', label: '发明专利', icon: 'Award' as const },
            { value: '8', label: '行业解决方案', icon: 'TrendingUp' as const },
            { value: '50+', label: '全球伙伴', icon: 'Users' as const },
          ],
        },
        {
          blockType: 'businessCards' as const,
          sectionTitle: '核心业务',
          sectionSubtitle: '以精密传感技术为核心，覆盖工业监测全场景',
          cards: [
            {
              title: '光纤传感器',
              description: '高精度光纤布拉格光栅（FBG）传感器，适用于温度、应变、压力等多参数监测',
              icon: 'Lightbulb' as const,
            },
            {
              title: '智能监测系统',
              description: '基于物联网的分布式监测平台，实现数据采集、传输、分析一体化',
              icon: 'Shield' as const,
            },
            {
              title: '行业解决方案',
              description: '针对桥梁、隧道、电力、石化等行业提供定制化的结构健康监测方案',
              icon: 'Wrench' as const,
            },
            {
              title: '技术咨询服务',
              description: '专业的工程技术团队提供从方案设计到系统集成的全流程技术支持',
              icon: 'Cog' as const,
            },
          ],
        },
        {
          blockType: 'featureGrid' as const,
          sectionTitle: '为什么选择柜侨',
          sectionSubtitle: '20年精密制造经验，值得信赖的工业合作伙伴',
          columns: '4' as const,
          features: [
            {
              title: '精密制造',
              description: '纳米级精度的光纤传感器制造工艺，确保每一件产品的可靠性',
              icon: 'Target',
            },
            {
              title: '自主研发',
              description: '拥有完整的核心技术自主知识产权，持续创新驱动发展',
              icon: 'Lightbulb',
            },
            {
              title: '全球服务',
              description: '服务网络覆盖亚太、欧洲、北美，提供本地化技术支持',
              icon: 'Globe',
            },
            {
              title: '品质保障',
              description: 'ISO 9001认证，严格的质量管控体系确保产品一致性',
              icon: 'Shield',
            },
          ],
        },
        {
          blockType: 'newsHighlight' as const,
          sectionTitle: '新闻资讯',
          sectionSubtitle: '了解柜侨工业最新动态',
          showMoreLink: '/posts',
          maxItems: 6,
        },
        {
          blockType: 'timeline' as const,
          sectionTitle: '发展历程',
          events: [
            {
              year: '2003',
              title: '公司成立',
              description: '柜侨工业在深圳成立，专注精密光纤传感技术研发',
            },
            {
              year: '2008',
              title: '首款产品发布',
              description: '成功研发第一代FBG光纤传感器，填补国内技术空白',
            },
            {
              year: '2013',
              title: '产业化突破',
              description: '建成国内首条全自动光纤传感器生产线，年产能突破10万支',
            },
            {
              year: '2018',
              title: '国际化布局',
              description: '成立欧洲和北美分公司，产品出口至30多个国家和地区',
            },
            {
              year: '2023',
              title: '智能化升级',
              description: '推出新一代AI驱动的智能监测平台，实现预测性维护',
            },
          ],
        },
        {
          blockType: 'contactInfo' as const,
          sectionTitle: '联系我们',
          companyName: '柜侨工业科技有限公司',
          address: '中国广东省深圳市南山区科技园\n高新南一道88号\n柜侨工业大厦',
          phone: '+86-755-8888-6666',
          email: 'info@guiqiao.com',
          fax: '+86-755-8888-6667',
        },
      ],
    }

    if (existingHome.docs.length > 0) {
      await payload.update({
        collection: 'pages',
        id: existingHome.docs[0].id,
        data: homeData,
      })
      console.log('✅ Homepage updated')
    } else {
      await payload.create({
        collection: 'pages',
        data: homeData,
      })
      console.log('✅ Homepage created')
    }
  } catch (e: any) {
    console.error('❌ Error creating homepage:', e.message)
    if (e.data) console.error('Details:', JSON.stringify(e.data, null, 2))
  }

  console.log('🎉 Seed complete!')
  process.exit(0)
}

seed()
