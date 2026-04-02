import 'dotenv/config'

import { getPayload } from 'payload'
import config from '../src/payload.config'

const makeRichText = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            text,
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

const pages = [
  {
    slug: 'about',
    title: '关于我们',
    hero: { type: 'none' as const },
    layout: [
      {
        blockType: 'richContent' as const,
        sectionTitle: '关于柜侨工业',
        content: makeRichText(
          '柜侨工业专注于精密工业设备、光纤传感与智能监测解决方案，持续为制造、桥梁、电力与工业自动化场景提供稳定可靠的产品与服务。',
        ),
        layout: 'fullWidth' as const,
        backgroundColor: 'none' as const,
      },
    ],
  },
  {
    slug: 'brand-story',
    title: '品牌故事',
    hero: { type: 'none' as const },
    layout: [
      {
        blockType: 'richContent' as const,
        sectionTitle: '品牌故事',
        content: makeRichText(
          '从精密制造到智能感知，柜侨工业持续投入研发与工程化能力建设，围绕真实工业场景打磨产品，形成了从传感器到系统方案的完整能力。',
        ),
        layout: 'fullWidth' as const,
        backgroundColor: 'gray' as const,
      },
    ],
  },
  {
    slug: 'products',
    title: '产品中心',
    hero: { type: 'none' as const },
    layout: [
      {
        blockType: 'richContent' as const,
        sectionTitle: '产品中心',
        content: makeRichText(
          '这里集中展示柜侨工业的核心产品方向，包括光纤传感器、智能监测系统与行业级解决方案。当前站点已补齐基础产品页，后续可以继续细化到具体产品线。',
        ),
        layout: 'fullWidth' as const,
        backgroundColor: 'none' as const,
      },
    ],
  },
  {
    slug: 'care',
    title: '关怀事业部',
    hero: { type: 'none' as const },
    layout: [
      {
        blockType: 'richContent' as const,
        sectionTitle: '关怀事业部',
        content: makeRichText(
          '关怀事业部聚焦贴近用户与人体感知相关的柔性监测与智能应用场景，强调稳定、舒适与长期可用性。',
        ),
        layout: 'fullWidth' as const,
        backgroundColor: 'none' as const,
      },
    ],
  },
  {
    slug: 'precision',
    title: '精密事业部',
    hero: { type: 'none' as const },
    layout: [
      {
        blockType: 'richContent' as const,
        sectionTitle: '精密事业部',
        content: makeRichText(
          '精密事业部面向高精度工业检测与复杂结构监测场景，提供更强调精度、耐用性和环境适应性的产品与方案。',
        ),
        layout: 'fullWidth' as const,
        backgroundColor: 'gray' as const,
      },
    ],
  },
  {
    slug: 'customsolutions',
    title: '定制解决方案',
    hero: { type: 'none' as const },
    layout: [
      {
        blockType: 'richContent' as const,
        sectionTitle: '定制解决方案',
        content: makeRichText(
          '针对非标准化项目，柜侨工业支持按场景定制传感器、结构件、监测逻辑与数据呈现方式，帮助客户更快完成从需求到落地。',
        ),
        layout: 'fullWidth' as const,
        backgroundColor: 'none' as const,
      },
    ],
  },
  {
    slug: 'contact',
    title: '联系我们',
    hero: { type: 'none' as const },
    layout: [
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
]

async function main() {
  const payload = await getPayload({ config })

  for (const page of pages) {
    const existing = await payload.find({
      collection: 'pages',
      depth: 0,
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: page.slug,
        },
      },
    })

    if (existing.docs[0]) {
      await payload.update({
        collection: 'pages',
        id: existing.docs[0].id,
        data: {
          ...page,
          _status: 'published',
        } as any,
        context: {
          disableRevalidate: true,
        },
      })
      console.log(`updated: ${page.slug}`)
      continue
    }

    await payload.create({
      collection: 'pages',
      data: {
        ...page,
        _status: 'published',
      } as any,
      context: {
        disableRevalidate: true,
      },
    })
    console.log(`created: ${page.slug}`)
  }
}

main()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
