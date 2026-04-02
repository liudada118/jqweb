import { getPayload } from 'payload'
import config from './src/payload.config'

async function enrichPages() {
  const payload = await getPayload({ config })

  const { docs: pages } = await payload.find({
    collection: 'pages',
    limit: 20,
  })
  console.log(`Found ${pages.length} pages`)

  const findPage = (slug: string) => pages.find(p => p.slug === slug)

  // ============================================
  // ENRICH: 关怀事业部 - 添加stats和更多内容
  // ============================================
  const carePage = findPage('care')
  if (carePage) {
    console.log('\nEnriching care page...')
    const existingLayout = carePage.layout || []
    
    // Find contactInfo block
    const contactIdx = existingLayout.findIndex((b: any) => b.blockType === 'contactInfo')
    
    // Add stats block and application cases before contactInfo
    const statsBlock = {
      blockType: 'stats',
      items: [
        { value: '500+', unit: '', label: '医疗机构合作' },
        { value: '10万+', unit: '', label: '设备部署量' },
        { value: '99.5', unit: '%', label: '系统可靠性' },
        { value: '24/7', unit: '', label: '技术支持' },
      ],
    }

    const casesBlock = {
      blockType: 'richContent',
      sectionTitle: '典型应用案例',
      sectionSubtitle: 'APPLICATION CASES',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: '案例一：某三甲医院ICU智能床垫系统。通过在ICU病床上部署柜侨柔性压力传感垫，实时监测患者体压分布，自动调节支撑区域，有效降低压疮发生率85%。系统同时监测患者翻身频率和呼吸状态，为护理人员提供实时预警。' }],
              version: 1,
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: '案例二：某知名汽车品牌座椅舒适性评估。为国内某头部新能源汽车品牌提供座椅压力分布分析系统，覆盖驾驶座和副驾驶座。通过采集不同体型驾乘人员的压力数据，优化座椅人体工学设计，提升驾乘舒适性评分15%。' }],
              version: 1,
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: '案例三：运动康复中心步态分析。为专业运动康复中心部署足底压力分析系统，精确测量运动员步态参数，辅助制定个性化康复方案。系统支持动态和静态两种测量模式，数据精度达到±0.5%。' }],
              version: 1,
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    }

    const newLayout = [...existingLayout]
    if (contactIdx >= 0) {
      newLayout.splice(contactIdx, 0, statsBlock, casesBlock)
    } else {
      newLayout.push(statsBlock, casesBlock)
    }

    await payload.update({
      collection: 'pages',
      id: carePage.id,
      context: { disableRevalidate: true },
      data: { layout: newLayout as any },
    })
    console.log('  ✓ care page enriched with stats and application cases')
  }

  // ============================================
  // ENRICH: 精密事业部 - 添加应用案例
  // ============================================
  const precisionPage = findPage('precision')
  if (precisionPage) {
    console.log('\nEnriching precision page...')
    const existingLayout = precisionPage.layout || []
    const contactIdx = existingLayout.findIndex((b: any) => b.blockType === 'contactInfo')

    const casesBlock = {
      blockType: 'richContent',
      sectionTitle: '工程应用案例',
      sectionSubtitle: 'ENGINEERING CASES',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: '案例一：港珠澳大桥结构健康监测。柜侨为港珠澳大桥提供了全桥光纤传感监测系统，部署超过2000个FBG传感器节点，实时监测桥梁应变、温度、位移等关键参数。系统运行5年来，成功预警多次异常载荷事件，保障了大桥的安全运营。' }],
              version: 1,
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: '案例二：深圳地铁隧道安全监测。为深圳地铁多条线路提供隧道结构安全监测方案，采用分布式光纤传感技术，单根光纤实现数公里隧道的连续监测。系统能够精确定位隧道变形位置，精度达到厘米级，为地铁安全运营提供数据支撑。' }],
              version: 1,
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: '案例三：海上风电塔筒监测。为某大型海上风电场提供塔筒结构健康监测系统，在恶劣海洋环境下持续监测塔筒应力、振动和倾斜。传感器耐腐蚀、抗电磁干扰的特性，确保了监测数据的长期可靠性。' }],
              version: 1,
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    }

    const timelineBlock = {
      blockType: 'timeline',
      sectionTitle: '技术发展里程碑',
      events: [
        { year: '2019', title: 'CU系列发布', description: '第一代CU系列FBG光纤传感器研发成功，测量精度达到pm级' },
        { year: '2020', title: '量产突破', description: '建成自动化生产线，CU7+系列传感器实现规模化量产' },
        { year: '2022', title: '分布式突破', description: '分布式光纤传感系统研发成功，单根光纤支持数千测点' },
        { year: '2024', title: 'AI集成', description: 'ICU11智能监测平台发布，集成AI数据分析和预测性维护' },
        { year: '2025', title: '全球部署', description: '产品部署覆盖30+国家，累计监测节点超过50万个' },
      ],
    }

    const newLayout = [...existingLayout]
    if (contactIdx >= 0) {
      newLayout.splice(contactIdx, 0, casesBlock, timelineBlock)
    } else {
      newLayout.push(casesBlock, timelineBlock)
    }

    await payload.update({
      collection: 'pages',
      id: precisionPage.id,
      context: { disableRevalidate: true },
      data: { layout: newLayout as any },
    })
    console.log('  ✓ precision page enriched with cases and timeline')
  }

  // ============================================
  // ENRICH: 定制事业部 - 添加应用案例和客户评价
  // ============================================
  const customPage = findPage('customsolutions')
  if (customPage) {
    console.log('\nEnriching customsolutions page...')
    const existingLayout = customPage.layout || []
    const contactIdx = existingLayout.findIndex((b: any) => b.blockType === 'contactInfo')

    const casesBlock = {
      blockType: 'richContent',
      sectionTitle: '定制项目案例',
      sectionSubtitle: 'CUSTOM PROJECT CASES',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: '案例一：石油化工管道泄漏监测系统。为某大型石化企业定制了基于分布式光纤传感的管道泄漏监测系统，覆盖200公里输油管道。系统能够在泄漏发生后30秒内精确定位泄漏点，定位精度达到1米，大幅降低了环境污染风险和经济损失。' }],
              version: 1,
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: '案例二：航空航天复合材料监测。为某航空制造企业定制了嵌入式光纤传感方案，将FBG传感器嵌入碳纤维复合材料中，实时监测制造过程中的应变和温度变化。该方案帮助客户将复合材料制造良品率提升了12%。' }],
              version: 1,
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: '案例三：智慧城市地下管廊监测。为某新区智慧城市项目定制了综合管廊监测系统，集成温度、应变、振动多参数监测，覆盖电力、通信、给排水等多种管线。系统支持3D可视化展示和智能预警，为城市基础设施管理提供了数字化解决方案。' }],
              version: 1,
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    }

    const newLayout = [...existingLayout]
    if (contactIdx >= 0) {
      newLayout.splice(contactIdx, 0, casesBlock)
    } else {
      newLayout.push(casesBlock)
    }

    await payload.update({
      collection: 'pages',
      id: customPage.id,
      context: { disableRevalidate: true },
      data: { layout: newLayout as any },
    })
    console.log('  ✓ customsolutions page enriched with project cases')
  }

  // ============================================
  // ENRICH: 产品中心 - 添加技术参数和应用案例
  // ============================================
  const productsPage = findPage('products')
  if (productsPage) {
    console.log('\nEnriching products page...')
    const existingLayout = productsPage.layout || []
    const contactIdx = existingLayout.findIndex((b: any) => b.blockType === 'contactInfo')

    const techSpecBlock = {
      blockType: 'richContent',
      sectionTitle: '技术参数',
      sectionSubtitle: 'TECHNICAL SPECIFICATIONS',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'CU7+ 光纤传感器系列：波长范围 1510-1590nm，测量精度 ±1pm，温度灵敏度 10pm/°C，应变灵敏度 1.2pm/με，工作温度 -40°C ~ +120°C，光纤类型 SMF-28e+，反射率 >90%。' }],
              version: 1,
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: 'ICU11 智能监测平台：通道数 4/8/16可选，采样速率 最高4kHz，动态范围 >40dB，接口 以太网/4G/WiFi，存储 本地+云端，AI分析 支持趋势预测和异常检测，供电 AC220V/太阳能可选。' }],
              version: 1,
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: '柔性压力传感垫：传感器密度 最高256点/100cm²，压力范围 0-200kPa，分辨率 0.1kPa，响应时间 <5ms，厚度 <0.3mm，可弯曲半径 >5mm，防水等级 IP67。' }],
              version: 1,
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    }

    const statsBlock = {
      blockType: 'stats',
      items: [
        { value: '8', unit: '项', label: '发明专利' },
        { value: '50+', unit: '', label: '全球合作伙伴' },
        { value: '30+', unit: '', label: '覆盖国家' },
        { value: '99.9', unit: '%', label: '产品可靠性' },
      ],
    }

    const newLayout = [...existingLayout]
    if (contactIdx >= 0) {
      newLayout.splice(contactIdx, 0, techSpecBlock, statsBlock)
    } else {
      newLayout.push(techSpecBlock, statsBlock)
    }

    await payload.update({
      collection: 'pages',
      id: productsPage.id,
      context: { disableRevalidate: true },
      data: { layout: newLayout as any },
    })
    console.log('  ✓ products page enriched with tech specs and stats')
  }

  // ============================================
  // ENRICH: 品牌故事 - 添加更多内容
  // ============================================
  const brandPage = findPage('brand-story')
  if (brandPage) {
    console.log('\nEnriching brand-story page...')
    const existingLayout = brandPage.layout || []
    
    // Add a team section and global presence section before the featureGrid
    const featureIdx = existingLayout.findIndex((b: any) => b.blockType === 'featureGrid')

    const teamBlock = {
      blockType: 'richContent',
      sectionTitle: '研发团队',
      sectionSubtitle: 'R&D TEAM',
      content: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [{ type: 'text', text: '柜侨工业拥有一支由博士、硕士组成的高水平研发团队，核心成员来自清华大学、浙江大学、中科院等国内顶尖高校和研究机构。团队在光纤传感、材料科学、人工智能、嵌入式系统等领域拥有深厚的技术积累和丰富的工程经验。' }],
              version: 1,
            },
            {
              type: 'paragraph',
              children: [{ type: 'text', text: '公司每年将营收的15%以上投入研发，建有国家级光纤传感技术实验室和智能制造中心。截至目前，已获得发明专利8项、实用新型专利12项、软件著作权20余项，参与制定行业标准3项。' }],
              version: 1,
            },
          ],
          direction: null,
          format: '',
          indent: 0,
          version: 1,
        },
      },
    }

    const globalBlock = {
      blockType: 'stats',
      items: [
        { value: '30+', unit: '', label: '覆盖国家' },
        { value: '50+', unit: '', label: '全球合作伙伴' },
        { value: '200+', unit: '', label: '成功项目' },
        { value: '15', unit: '%+', label: '年研发投入' },
      ],
    }

    const newLayout = [...existingLayout]
    if (featureIdx >= 0) {
      newLayout.splice(featureIdx, 0, teamBlock, globalBlock)
    } else {
      newLayout.push(teamBlock, globalBlock)
    }

    await payload.update({
      collection: 'pages',
      id: brandPage.id,
      context: { disableRevalidate: true },
      data: { layout: newLayout as any },
    })
    console.log('  ✓ brand-story page enriched with team and global stats')
  }

  console.log('\n✅ All pages enriched successfully!')
  process.exit(0)
}

enrichPages().catch((err) => {
  console.error('Enrich failed:', err)
  process.exit(1)
})
