import { getPayload } from 'payload'
import config from './src/payload.config'

async function seedContent() {
  const payload = await getPayload({ config })

  // First, get admin user for auth
  const { docs: users } = await payload.find({
    collection: 'users',
    limit: 1,
  })
  console.log(`Found ${users.length} users`)

  // Upload media images from unsplash URLs
  const mediaMap: Record<string, number> = {}

  const imagesToUpload = [
    { key: 'brand-story-hero', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&h=1080&fit=crop', alt: '品牌故事' },
    { key: 'innovation', url: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800&h=500&fit=crop', alt: '创新基因' },
    { key: 'mission', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop', alt: '使命愿景' },
    { key: 'forward', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=500&fit=crop', alt: '积极推动创新' },
    { key: 'products-hero', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1920&h=1080&fit=crop', alt: '产品与解决方案' },
    { key: 'care-hero', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1920&h=1080&fit=crop', alt: '关怀事业部' },
    { key: 'precision-hero', url: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1920&h=1080&fit=crop', alt: '精密事业部' },
    { key: 'custom-hero', url: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?w=1920&h=1080&fit=crop', alt: '定制事业部' },
    { key: 'pressure-sensor', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&h=400&fit=crop', alt: '柔性压力传感垫' },
    { key: 'seat-system', url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&h=400&fit=crop', alt: '智能座椅系统' },
    { key: 'rehab', url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop', alt: '康复监测设备' },
    { key: 'fbg-sensor', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop', alt: 'FBG光纤传感器' },
    { key: 'distributed', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop', alt: '分布式光纤传感系统' },
    { key: 'monitoring', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop', alt: '智能监测平台' },
    { key: 'bridge', url: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=600&h=400&fit=crop', alt: '桥梁监测' },
    { key: 'tunnel', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop', alt: '隧道监测' },
    { key: 'energy', url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=600&h=400&fit=crop', alt: '能源监测' },
  ]

  console.log('Uploading media images...')
  for (const img of imagesToUpload) {
    try {
      // Download the image
      const response = await fetch(img.url)
      const buffer = Buffer.from(await response.arrayBuffer())

      const media = await payload.create({
        collection: 'media',
        data: {
          alt: img.alt,
        },
        file: {
          data: buffer,
          mimetype: 'image/jpeg',
          name: `${img.key}.jpg`,
          size: buffer.length,
        },
      })
      mediaMap[img.key] = media.id as number
      console.log(`  ✓ Uploaded: ${img.key} (id: ${media.id})`)
    } catch (e: any) {
      console.log(`  ✗ Failed to upload ${img.key}: ${e.message}`)
    }
  }

  // Get existing pages
  const { docs: pages } = await payload.find({
    collection: 'pages',
    limit: 20,
  })
  console.log(`\nFound ${pages.length} pages:`, pages.map(p => `${p.slug} (id:${p.id})`))

  // Helper to find page by slug
  const findPage = (slug: string) => pages.find(p => p.slug === slug)

  // ============================================
  // UPDATE: 品牌故事页面
  // ============================================
  const brandStoryPage = findPage('brand-story')
  if (brandStoryPage) {
    console.log('\nUpdating brand-story page...')
    await payload.update({
      collection: 'pages',
      id: brandStoryPage.id,
      context: { disableRevalidate: true },
      data: {
        title: '品牌故事',
        layout: [
          {
            blockType: 'heroBanner',
            title: '品牌故事',
            subtitle: 'BRAND STORY',
            description: '从一根光纤开始，编织智能感知的未来',
            backgroundImage: mediaMap['brand-story-hero'] || undefined,
            ctaText: '了解更多',
            ctaLink: '#belief',
          },
          {
            blockType: 'richContent',
            sectionTitle: '持久的信念',
            sectionSubtitle: 'BELIEF',
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: '柜侨工业创立于对智能纤维传感技术的坚定信念。我们相信，通过将先进的光纤传感技术与智能算法相结合，可以为工业制造、医疗健康、智能出行等领域带来革命性的变化。' }],
                    version: 1,
                  },
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: '自创立以来，柜侨始终坚持自主研发、技术创新的发展道路。我们的核心团队来自全球顶尖高校和研究机构，在光纤传感、材料科学、人工智能等领域拥有深厚的技术积累。' }],
                    version: 1,
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
          {
            blockType: 'richContent',
            sectionTitle: '使命愿景',
            sectionSubtitle: 'MISSION',
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: '柜侨工业的使命是通过智能纤维传感技术，为人类创造更安全、更舒适、更智能的生活体验。我们致力于成为全球智能纤维传感领域的技术引领者和产业推动者。' }],
                    version: 1,
                  },
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: '我们相信，纤维传感技术将深刻改变工业制造、医疗健康、智能出行等领域，为社会创造持久的价值。柜侨将持续探索技术边界，推动产业变革。' }],
                    version: 1,
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
          {
            blockType: 'richContent',
            sectionTitle: '创新基因',
            sectionSubtitle: 'INNOVATION',
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: '第一代智能纤维传感器的诞生，标志着柜侨在材料科学与传感技术交叉领域取得了突破性进展。我们的研发团队汇聚了来自全球顶尖高校和研究机构的科学家与工程师。' }],
                    version: 1,
                  },
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: '创新是柜侨的基因。我们建立了完善的研发体系，从基础材料研究到应用技术开发，从实验室验证到工程化量产，每一个环节都追求极致的技术突破。' }],
                    version: 1,
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
          {
            blockType: 'timeline',
            sectionTitle: '发展历程',
            events: [
              { year: '2018', title: '公司创立', description: '柜侨工业在深圳成立，开始智能纤维传感技术的研发之路' },
              { year: '2019', title: '技术突破', description: '第一代CU系列光纤传感器研发成功，获得多项发明专利' },
              { year: '2020', title: '产品量产', description: '建立自动化生产线，CU7+系列传感器实现量产，产品精度达到纳米级' },
              { year: '2022', title: '市场拓展', description: '产品进入桥梁监测、隧道安全、电力能源等多个行业领域' },
              { year: '2024', title: '全球布局', description: '与50+全球合作伙伴建立战略合作，业务覆盖亚太、欧洲、北美市场' },
              { year: '2025', title: '智能升级', description: 'ICU11系列智能传感平台发布，集成AI数据分析能力' },
            ],
          },
          {
            blockType: 'featureGrid',
            sectionTitle: '核心价值观',
            sectionSubtitle: '驱动我们前行的力量',
            features: [
              { title: '技术创新', description: '持续投入研发，追求技术突破，保持行业领先地位', icon: 'lightbulb' },
              { title: '品质至上', description: '严格的质量管控体系，确保每一件产品都达到最高标准', icon: 'shield' },
              { title: '客户为本', description: '深入理解客户需求，提供定制化的解决方案和全方位服务', icon: 'users' },
              { title: '合作共赢', description: '与全球合作伙伴携手，共同推动智能传感技术的发展', icon: 'globe' },
            ],
          },
        ] as any,
      },
    })
    console.log('  ✓ brand-story page updated')
  }

  // ============================================
  // UPDATE: 产品中心页面
  // ============================================
  const productsPage = findPage('products')
  if (productsPage) {
    console.log('\nUpdating products page...')
    await payload.update({
      collection: 'pages',
      id: productsPage.id,
      context: { disableRevalidate: true },
      data: {
        title: '产品与解决方案',
        layout: [
          {
            blockType: 'heroBanner',
            title: '产品与解决方案',
            subtitle: 'PRODUCTS & SOLUTIONS',
            description: '从传感器到智能系统，为各行业提供全方位的监测解决方案',
            backgroundImage: mediaMap['products-hero'] || undefined,
            ctaText: '了解更多',
            ctaLink: '#products',
          },
          {
            blockType: 'productShowcase',
            sectionTitle: '核心产品',
            sectionSubtitle: '行业领先的传感器产品线',
            products: [
              {
                name: 'CU7+ 光纤传感器',
                description: '高精度FBG光纤传感器，测量精度达到纳米级别。适用于桥梁、隧道、大坝等大型基础设施的结构健康监测。',
                image: mediaMap['fbg-sensor'] || undefined,
                link: '/precision',
              },
              {
                name: 'ICU11 智能监测平台',
                description: '集成AI数据分析的智能监测平台，支持分布式光纤传感，单根光纤可实现数千个测点的同时监测。',
                image: mediaMap['distributed'] || undefined,
                link: '/precision',
              },
              {
                name: '柔性压力传感垫',
                description: '超薄柔性传感器阵列，可精确测量压力分布。适用于医疗健康、汽车座椅、运动分析等领域。',
                image: mediaMap['pressure-sensor'] || undefined,
                link: '/care',
              },
              {
                name: '智能座椅分析系统',
                description: '汽车座椅智能压力分析系统，实时监测坐姿分布，预防驾驶疲劳，提升驾乘舒适性。',
                image: mediaMap['seat-system'] || undefined,
                link: '/care',
              },
            ],
          },
          {
            blockType: 'featureGrid',
            sectionTitle: '技术优势',
            sectionSubtitle: '行业领先的核心技术',
            features: [
              { title: '纳米级精度', description: '传感器测量精度达到纳米级别，确保数据的准确性和可靠性', icon: 'target' },
              { title: '超长寿命', description: '产品设计寿命超过25年，大幅降低维护和更换成本', icon: 'clock' },
              { title: '抗干扰能力', description: '光纤传感器天然抗电磁干扰，适用于各种恶劣工业环境', icon: 'shield' },
              { title: '分布式监测', description: '单根光纤可实现数千个测点的同时监测，大幅降低布线成本', icon: 'network' },
              { title: '实时数据', description: '毫秒级响应速度，支持高频动态监测和实时预警', icon: 'zap' },
              { title: '智能分析', description: 'AI驱动的数据分析平台，自动识别异常并生成诊断报告', icon: 'brain' },
            ],
          },
          {
            blockType: 'businessCards',
            sectionTitle: '行业解决方案',
            sectionSubtitle: '覆盖多个行业领域的专业方案',
            cards: [
              {
                title: '桥梁与隧道监测',
                description: '为桥梁、隧道等交通基础设施提供全生命周期的结构健康监测方案',
                image: mediaMap['bridge'] || undefined,
                link: '/precision',
              },
              {
                title: '能源与电力监测',
                description: '石油化工管道、电力电缆、风电叶片等能源设施的在线监测',
                image: mediaMap['energy'] || undefined,
                link: '/precision',
              },
              {
                title: '医疗健康监测',
                description: '柔性压力传感技术在康复训练、睡眠监测、人体工程学等领域的应用',
                image: mediaMap['rehab'] || undefined,
                link: '/care',
              },
              {
                title: '智能汽车应用',
                description: '汽车座椅压力分析、驾驶行为监测、车身结构健康评估',
                image: mediaMap['seat-system'] || undefined,
                link: '/care',
              },
            ],
          },
          {
            blockType: 'contactInfo',
            sectionTitle: '咨询产品方案',
            companyName: '柜侨工业科技有限公司',
            address: '中国广东省深圳市南山区科技园\n高新南一道88号 柜侨工业大厦',
            phone: '+86-755-8888-6666',
            email: 'products@guiqiao.com',
          },
        ] as any,
      },
    })
    console.log('  ✓ products page updated')
  }

  // ============================================
  // UPDATE: 关怀事业部页面
  // ============================================
  const carePage = findPage('care')
  if (carePage) {
    console.log('\nUpdating care page...')
    await payload.update({
      collection: 'pages',
      id: carePage.id,
      context: { disableRevalidate: true },
      data: {
        title: '关怀事业部',
        layout: [
          {
            blockType: 'heroBanner',
            title: '关怀事业部',
            subtitle: 'CARE DIVISION',
            description: '以柔性传感技术守护健康，让关怀触手可及',
            backgroundImage: mediaMap['care-hero'] || undefined,
            ctaText: '了解更多',
            ctaLink: '#intro',
          },
          {
            blockType: 'richContent',
            sectionTitle: '关怀事业部简介',
            sectionSubtitle: 'ABOUT CARE DIVISION',
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: '关怀事业部专注于将先进的传感技术应用于医疗健康、养老护理和人体工程学领域。我们的柔性压力传感器和智能监测系统，能够精确感知人体的细微变化，为健康管理提供数据支持。' }],
                    version: 1,
                  },
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: '核心产品包括：柔性压力传感垫、智能座椅压力分析系统、康复训练监测设备等。产品已广泛应用于医院、养老院、汽车座椅、运动训练等场景，服务数百家客户。' }],
                    version: 1,
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
          {
            blockType: 'productShowcase',
            sectionTitle: '核心产品',
            sectionSubtitle: '关怀事业部产品线',
            products: [
              {
                name: '柔性压力传感垫',
                description: '超薄柔性传感器阵列，厚度仅0.3mm，可精确测量压力分布。支持1024个传感点位，分辨率达到5mm。适用于医疗诊断、睡眠监测、运动分析等场景。',
                image: mediaMap['pressure-sensor'] || undefined,
              },
              {
                name: '智能座椅压力分析系统',
                description: '汽车座椅智能压力分析系统，实时监测坐姿分布和体压变化。通过AI算法分析驾驶员疲劳状态，预防交通事故。已与多家知名汽车厂商达成合作。',
                image: mediaMap['seat-system'] || undefined,
              },
              {
                name: '康复训练监测设备',
                description: '用于康复训练过程中的力量和运动监测，帮助医生和治疗师制定个性化康复方案。实时数据反馈，精确评估康复进度。',
                image: mediaMap['rehab'] || undefined,
              },
            ],
          },
          {
            blockType: 'featureGrid',
            sectionTitle: '应用场景',
            sectionSubtitle: '关怀技术的广泛应用',
            features: [
              { title: '医疗诊断', description: '压力分布分析辅助医生进行足底压力、脊柱侧弯等诊断', icon: 'heart' },
              { title: '养老护理', description: '智能床垫监测老人睡眠状态和翻身情况，预防褥疮', icon: 'users' },
              { title: '汽车座椅', description: '实时监测驾驶员坐姿和疲劳状态，提升驾乘安全', icon: 'car' },
              { title: '运动训练', description: '精确测量运动员的力量分布和动作模式，优化训练方案', icon: 'activity' },
              { title: '人体工程学', description: '办公椅、床垫等产品的舒适度评估和设计优化', icon: 'monitor' },
              { title: '康复医学', description: '康复训练过程中的实时力量监测和进度评估', icon: 'trending-up' },
            ],
          },
          {
            blockType: 'contactInfo',
            sectionTitle: '咨询关怀解决方案',
            companyName: '柜侨工业科技有限公司 · 关怀事业部',
            address: '中国广东省深圳市南山区科技园\n高新南一道88号 柜侨工业大厦',
            phone: '+86-755-8888-6688',
            email: 'care@guiqiao.com',
          },
        ] as any,
      },
    })
    console.log('  ✓ care page updated')
  }

  // ============================================
  // UPDATE: 精密事业部页面
  // ============================================
  const precisionPage = findPage('precision')
  if (precisionPage) {
    console.log('\nUpdating precision page...')
    await payload.update({
      collection: 'pages',
      id: precisionPage.id,
      context: { disableRevalidate: true },
      data: {
        title: '精密事业部',
        layout: [
          {
            blockType: 'heroBanner',
            title: '精密事业部',
            subtitle: 'PRECISION DIVISION',
            description: '高精度光纤传感技术，守护大型基础设施安全',
            backgroundImage: mediaMap['precision-hero'] || undefined,
            ctaText: '了解更多',
            ctaLink: '#intro',
          },
          {
            blockType: 'richContent',
            sectionTitle: '精密事业部简介',
            sectionSubtitle: 'ABOUT PRECISION DIVISION',
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: '精密事业部是柜侨工业的核心业务板块，专注于高精度光纤传感器的研发和制造。我们的产品广泛应用于桥梁、隧道、大坝、建筑等大型基础设施的结构健康监测，以及石油化工、电力能源等行业的工艺过程监控。' }],
                    version: 1,
                  },
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: '核心产品包括：FBG光纤传感器（CU7+系列、ICU11系列）、分布式光纤传感系统、智能监测平台等。产品精度达到纳米级别，设计寿命超过25年，已服务于国内外数百个重大工程项目。' }],
                    version: 1,
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
          {
            blockType: 'productShowcase',
            sectionTitle: '核心产品',
            sectionSubtitle: '精密事业部产品线',
            products: [
              {
                name: 'CU7+ FBG光纤传感器',
                description: '第七代高精度光纤布拉格光栅传感器，测量精度±1pm，温度范围-40°C至+300°C。支持应变、温度、压力、加速度等多参数测量。',
                image: mediaMap['fbg-sensor'] || undefined,
              },
              {
                name: 'ICU11 智能监测平台',
                description: '新一代集成AI数据分析的智能监测平台，支持最多11个通道同时采集。内置机器学习算法，自动识别结构异常并生成预警报告。',
                image: mediaMap['monitoring'] || undefined,
              },
              {
                name: '分布式光纤传感系统',
                description: '基于BOTDA/OTDR技术的分布式传感系统，单根光纤可实现50km范围内的连续监测。空间分辨率达到0.5m，适用于长距离线性结构监测。',
                image: mediaMap['distributed'] || undefined,
              },
            ],
          },
          {
            blockType: 'featureGrid',
            sectionTitle: '应用领域',
            sectionSubtitle: '精密传感技术的广泛应用',
            features: [
              { title: '桥梁监测', description: '桥梁结构应力、变形、振动的实时监测，保障桥梁运营安全', icon: 'building' },
              { title: '隧道安全', description: '隧道围岩变形、衬砌应力、渗漏水等参数的在线监测', icon: 'shield' },
              { title: '大坝监测', description: '大坝渗流、变形、应力等关键参数的长期稳定监测', icon: 'droplet' },
              { title: '石油化工', description: '管道泄漏检测、储罐变形监测、工艺温度控制', icon: 'flame' },
              { title: '电力能源', description: '电缆温度监测、风电叶片应变分析、变压器状态评估', icon: 'zap' },
              { title: '轨道交通', description: '铁路轨道变形监测、地铁隧道结构健康评估', icon: 'train' },
            ],
          },
          {
            blockType: 'stats',
            items: [
              { value: '500+', unit: '', label: '服务工程项目' },
              { value: '25', unit: '年+', label: '产品设计寿命' },
              { value: '±1', unit: 'pm', label: '测量精度' },
              { value: '50', unit: 'km', label: '最大监测距离' },
            ],
          },
          {
            blockType: 'contactInfo',
            sectionTitle: '咨询精密解决方案',
            companyName: '柜侨工业科技有限公司 · 精密事业部',
            address: '中国广东省深圳市南山区科技园\n高新南一道88号 柜侨工业大厦',
            phone: '+86-755-8888-6699',
            email: 'precision@guiqiao.com',
          },
        ] as any,
      },
    })
    console.log('  ✓ precision page updated')
  }

  // ============================================
  // UPDATE: 定制事业部页面
  // ============================================
  const customPage = findPage('customsolutions')
  if (customPage) {
    console.log('\nUpdating customsolutions page...')
    await payload.update({
      collection: 'pages',
      id: customPage.id,
      context: { disableRevalidate: true },
      data: {
        title: '定制事业部',
        layout: [
          {
            blockType: 'heroBanner',
            title: '定制事业部',
            subtitle: 'CUSTOM SOLUTIONS',
            description: '从需求到交付，提供一站式定制化传感解决方案',
            backgroundImage: mediaMap['custom-hero'] || undefined,
            ctaText: '联系我们',
            ctaLink: '#contact',
          },
          {
            blockType: 'richContent',
            sectionTitle: '定制服务流程',
            sectionSubtitle: 'CUSTOM SERVICE',
            content: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: '柜侨工业定制事业部拥有丰富的项目经验和强大的技术团队，能够根据客户的具体需求，从传感器选型、系统设计、安装调试到数据分析，提供一站式定制化服务。' }],
                    version: 1,
                  },
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: '我们已为石油化工、航空航天、新能源汽车、智慧城市等多个领域的客户提供了定制化解决方案，累计完成200+个定制项目，客户满意度达98%以上。' }],
                    version: 1,
                  },
                ],
                direction: null,
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
          {
            blockType: 'featureGrid',
            sectionTitle: '服务流程',
            sectionSubtitle: '从需求到交付的全流程服务',
            features: [
              { title: '需求分析', description: '深入了解客户应用场景和技术需求，制定初步方案', icon: 'search' },
              { title: '方案设计', description: '根据需求定制传感器规格、系统架构和数据处理方案', icon: 'edit' },
              { title: '生产制造', description: '按照定制规格进行传感器生产和系统集成', icon: 'settings' },
              { title: '部署运维', description: '现场安装调试，提供长期运维和技术支持服务', icon: 'check-circle' },
            ],
          },
          {
            blockType: 'featureGrid',
            sectionTitle: '定制能力',
            sectionSubtitle: '全方位的定制化服务能力',
            features: [
              { title: '传感器定制', description: '根据应用场景定制传感器尺寸、灵敏度、测量范围等参数', icon: 'tool' },
              { title: '系统集成', description: '将传感器与数据采集、传输、分析系统进行一体化集成', icon: 'layers' },
              { title: '软件开发', description: '定制数据可视化平台、预警系统和分析报告模块', icon: 'code' },
              { title: '技术培训', description: '为客户团队提供系统使用、维护和数据分析培训', icon: 'book' },
            ],
          },
          {
            blockType: 'stats',
            items: [
              { value: '200+', unit: '', label: '定制项目' },
              { value: '98', unit: '%', label: '客户满意度' },
              { value: '50+', unit: '', label: '行业覆盖' },
              { value: '7×24', unit: '', label: '技术支持' },
            ],
          },
          {
            blockType: 'contactInfo',
            sectionTitle: '咨询定制方案',
            companyName: '柜侨工业科技有限公司 · 定制事业部',
            address: '中国广东省深圳市南山区科技园\n高新南一道88号 柜侨工业大厦',
            phone: '+86-755-8888-6666',
            email: 'custom@guiqiao.com',
          },
        ] as any,
      },
    })
    console.log('  ✓ customsolutions page updated')
  }

  console.log('\n✅ All pages content updated successfully!')
  process.exit(0)
}

seedContent().catch((err) => {
  console.error('Seed content failed:', err)
  process.exit(1)
})
