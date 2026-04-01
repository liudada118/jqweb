import { getPayload } from 'payload'
import config from './src/payload.config'

async function seedPages() {
  const payload = await getPayload({ config })

  console.log('🌱 Creating missing pages...')

  const pages = [
    {
      title: '品牌故事',
      slug: 'brand-story',
      _status: 'published' as const,
      hero: { type: 'none' as const },
      layout: [
        {
          blockType: 'heroBanner' as const,
          title: '品牌故事',
          subtitle: 'BRAND STORY',
          description: '柜侨工业 — 二十年匠心铸就精密传感领域的行业标杆',
          ctaButtons: [],
        },
        {
          blockType: 'richContent' as const,
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading',
                  tag: 'h2',
                  children: [{ type: 'text', text: '我们的故事', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
                  direction: 'ltr', format: '', indent: 0, version: 1,
                },
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: '柜侨工业成立于2003年，总部位于中国深圳。作为一家专注于精密光纤传感技术的高新技术企业，我们始终以"让工业更智能、更安全"为使命，致力于为全球客户提供最先进的传感解决方案。', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
                  direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
                },
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: '从最初的三人创业团队，到如今拥有超过500名员工的国际化企业，柜侨工业始终坚持自主创新，在光纤布拉格光栅（FBG）传感器、分布式光纤传感系统等核心技术领域取得了多项突破性成果。', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
                  direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
                },
                {
                  type: 'heading',
                  tag: 'h2',
                  children: [{ type: 'text', text: '企业愿景', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
                  direction: 'ltr', format: '', indent: 0, version: 1,
                },
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: '成为全球领先的工业传感技术解决方案提供商，以科技创新推动工业智能化转型，让每一座桥梁、每一条隧道、每一个工厂都拥有智慧感知能力。', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
                  direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
                },
              ],
              direction: 'ltr', format: '', indent: 0, version: 1,
            },
          },
        },
        {
          blockType: 'timeline' as const,
          sectionTitle: '发展历程',
          events: [
            { year: '2003', title: '公司成立', description: '柜侨工业在深圳成立，专注精密光纤传感技术研发' },
            { year: '2008', title: '首款产品发布', description: '成功研发第一代FBG光纤传感器，填补国内技术空白' },
            { year: '2013', title: '产业化突破', description: '建成国内首条全自动光纤传感器生产线，年产能突破10万支' },
            { year: '2018', title: '国际化布局', description: '成立欧洲和北美分公司，产品出口至30多个国家和地区' },
            { year: '2023', title: '智能化升级', description: '推出新一代AI驱动的智能监测平台，实现预测性维护' },
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
    },
    {
      title: '产品中心',
      slug: 'products',
      _status: 'published' as const,
      hero: { type: 'none' as const },
      layout: [
        {
          blockType: 'heroBanner' as const,
          title: '产品与解决方案',
          subtitle: 'PRODUCTS & SOLUTIONS',
          description: '以精密传感技术为核心，覆盖工业监测全场景',
          ctaButtons: [],
        },
        {
          blockType: 'businessCards' as const,
          sectionTitle: '产品线总览',
          sectionSubtitle: '满足不同行业的精密传感需求',
          cards: [
            {
              title: '光纤传感器',
              description: '高精度光纤布拉格光栅（FBG）传感器，适用于温度、应变、压力等多参数监测。产品涵盖CU7+、ICU11等多个系列。',
              icon: 'Lightbulb' as const,
            },
            {
              title: '智能监测系统',
              description: '基于物联网的分布式监测平台，实现数据采集、传输、分析一体化。支持远程监控和智能预警。',
              icon: 'Shield' as const,
            },
            {
              title: '行业解决方案',
              description: '针对桥梁、隧道、电力、石化等行业提供定制化的结构健康监测方案。已成功应用于数百个重大工程项目。',
              icon: 'Wrench' as const,
            },
            {
              title: '技术咨询服务',
              description: '专业的工程技术团队提供从方案设计到系统集成的全流程技术支持。7×24小时在线服务。',
              icon: 'Cog' as const,
            },
          ],
        },
        {
          blockType: 'featureGrid' as const,
          sectionTitle: '技术优势',
          sectionSubtitle: '行业领先的核心技术',
          columns: '3' as const,
          features: [
            { title: '纳米级精度', description: '传感器测量精度达到纳米级别，确保数据的准确性和可靠性', icon: 'Target' },
            { title: '超长寿命', description: '产品设计寿命超过25年，大幅降低维护和更换成本', icon: 'Clock' },
            { title: '抗干扰能力', description: '光纤传感器天然抗电磁干扰，适用于各种恶劣工业环境', icon: 'Shield' },
            { title: '分布式监测', description: '单根光纤可实现数千个测点的同时监测，大幅降低布线成本', icon: 'Network' },
            { title: '实时数据', description: '毫秒级响应速度，支持高频动态监测和实时预警', icon: 'Zap' },
            { title: '智能分析', description: 'AI驱动的数据分析平台，自动识别异常并生成诊断报告', icon: 'Brain' },
          ],
        },
      ],
    },
    {
      title: '关怀事业部',
      slug: 'care',
      _status: 'published' as const,
      hero: { type: 'none' as const },
      layout: [
        {
          blockType: 'heroBanner' as const,
          title: '关怀事业部',
          subtitle: 'CARE DIVISION',
          description: '以人为本，用传感技术守护生命安全与健康',
          ctaButtons: [],
        },
        {
          blockType: 'richContent' as const,
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading', tag: 'h2',
                  children: [{ type: 'text', text: '关怀事业部简介', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
                  direction: 'ltr', format: '', indent: 0, version: 1,
                },
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: '关怀事业部专注于将先进的传感技术应用于医疗健康、养老护理和人体工程学领域。我们的柔性压力传感器和智能监测系统，能够精确感知人体的细微变化，为健康管理提供数据支持。', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
                  direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
                },
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: '核心产品包括：柔性压力传感垫、智能座椅压力分析系统、康复训练监测设备等。产品已广泛应用于医院、养老院、汽车座椅等场景。', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
                  direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
                },
              ],
              direction: 'ltr', format: '', indent: 0, version: 1,
            },
          },
        },
        {
          blockType: 'featureGrid' as const,
          sectionTitle: '核心产品',
          sectionSubtitle: '关怀事业部产品线',
          columns: '3' as const,
          features: [
            { title: '柔性压力传感垫', description: '超薄柔性传感器阵列，可精确测量压力分布，适用于医疗和人体工程学研究', icon: 'Heart' },
            { title: '智能座椅系统', description: '汽车座椅智能压力分析系统，实时监测坐姿，预防驾驶疲劳', icon: 'Car' },
            { title: '康复监测设备', description: '用于康复训练过程中的力量和运动监测，帮助制定个性化康复方案', icon: 'Activity' },
          ],
        },
      ],
    },
    {
      title: '精密事业部',
      slug: 'precision',
      _status: 'published' as const,
      hero: { type: 'none' as const },
      layout: [
        {
          blockType: 'heroBanner' as const,
          title: '精密事业部',
          subtitle: 'PRECISION DIVISION',
          description: '纳米级精度，工业级可靠，为关键基础设施保驾护航',
          ctaButtons: [],
        },
        {
          blockType: 'richContent' as const,
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading', tag: 'h2',
                  children: [{ type: 'text', text: '精密事业部简介', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
                  direction: 'ltr', format: '', indent: 0, version: 1,
                },
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: '精密事业部是柜侨工业的核心业务板块，专注于高精度光纤传感器的研发和制造。我们的产品广泛应用于桥梁、隧道、大坝、建筑等大型基础设施的结构健康监测，以及石油化工、电力能源等行业的工艺过程监控。', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
                  direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
                },
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: '核心产品包括：FBG光纤传感器（CU7+系列、ICU11系列）、分布式光纤传感系统、智能监测平台等。产品精度达到纳米级别，设计寿命超过25年。', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
                  direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
                },
              ],
              direction: 'ltr', format: '', indent: 0, version: 1,
            },
          },
        },
        {
          blockType: 'featureGrid' as const,
          sectionTitle: '应用领域',
          sectionSubtitle: '精密传感技术的广泛应用',
          columns: '4' as const,
          features: [
            { title: '桥梁监测', description: '大跨度桥梁的应变、温度、位移等参数的长期在线监测', icon: 'Building' },
            { title: '隧道安全', description: '隧道结构变形、渗漏水、围岩压力等多参数综合监测', icon: 'Mountain' },
            { title: '电力能源', description: '输电线路、变压器、发电机组的温度和应力监测', icon: 'Zap' },
            { title: '石油化工', description: '管道泄漏检测、储罐液位监测、井下温压监测', icon: 'Flame' },
          ],
        },
      ],
    },
    {
      title: '定制解决方案',
      slug: 'custom/solutions',
      _status: 'published' as const,
      hero: { type: 'none' as const },
      layout: [
        {
          blockType: 'heroBanner' as const,
          title: '定制事业部',
          subtitle: 'CUSTOM SOLUTIONS',
          description: '根据您的需求，量身定制最优传感解决方案',
          ctaButtons: [
            { label: '联系我们', url: '#contact', variant: 'primary' as const },
          ],
        },
        {
          blockType: 'richContent' as const,
          content: {
            root: {
              type: 'root',
              children: [
                {
                  type: 'heading', tag: 'h2',
                  children: [{ type: 'text', text: '定制服务流程', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
                  direction: 'ltr', format: '', indent: 0, version: 1,
                },
                {
                  type: 'paragraph',
                  children: [{ type: 'text', text: '柜侨工业定制事业部拥有丰富的项目经验和强大的技术团队，能够根据客户的具体需求，从传感器选型、系统设计、安装调试到数据分析，提供一站式定制化服务。', format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
                  direction: 'ltr', format: '', indent: 0, version: 1, textFormat: 0, textStyle: '',
                },
              ],
              direction: 'ltr', format: '', indent: 0, version: 1,
            },
          },
        },
        {
          blockType: 'featureGrid' as const,
          sectionTitle: '服务流程',
          sectionSubtitle: '从需求到交付的全流程服务',
          columns: '4' as const,
          features: [
            { title: '需求分析', description: '深入了解客户应用场景和技术需求，制定初步方案', icon: 'Search' },
            { title: '方案设计', description: '根据需求定制传感器规格、系统架构和数据处理方案', icon: 'PenTool' },
            { title: '生产制造', description: '按照定制规格进行传感器生产和系统集成', icon: 'Factory' },
            { title: '部署运维', description: '现场安装调试，提供长期运维和技术支持服务', icon: 'Settings' },
          ],
        },
        {
          blockType: 'contactInfo' as const,
          sectionTitle: '咨询定制方案',
          companyName: '柜侨工业科技有限公司 · 定制事业部',
          address: '中国广东省深圳市南山区科技园\n高新南一道88号\n柜侨工业大厦',
          phone: '+86-755-8888-6666',
          email: 'custom@guiqiao.com',
          fax: '+86-755-8888-6667',
        },
      ],
    },
  ]

  for (const page of pages) {
    try {
      const existing = await payload.find({
        collection: 'pages',
        where: { slug: { equals: page.slug } },
      })

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'pages',
          id: existing.docs[0].id,
          data: page as any,
        })
        console.log(`✅ Updated: ${page.title}`)
      } else {
        await payload.create({
          collection: 'pages',
          data: page as any,
        })
        console.log(`✅ Created: ${page.title}`)
      }
    } catch (e: any) {
      console.error(`❌ Error with ${page.title}: ${e.message}`)
    }
  }

  console.log('🎉 Pages seed complete!')
  process.exit(0)
}

seedPages()
