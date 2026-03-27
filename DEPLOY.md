# 柜侨工业官网 - 部署说明

## 技术架构

本项目基于 **Next.js 15 + Payload CMS 3** 构建，采用 SQLite 数据库，支持一键部署。

| 组件 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Next.js 15 | React 19, App Router, SSR |
| CMS系统 | Payload CMS 3 | 专业内容管理，可视化编辑 |
| 数据库 | SQLite (libSQL) | 轻量级，无需额外数据库服务 |
| 样式 | Tailwind CSS 4 | 原子化CSS，响应式设计 |
| 动画 | CSS + Intersection Observer | SSR兼容的滚动动画 |

## 快速启动

### 环境要求

- Node.js 18+
- pnpm（推荐）或 npm

### 一键启动

```bash
chmod +x start.sh
./start.sh
```

### 手动启动

```bash
# 1. 安装依赖
pnpm install

# 2. 配置环境变量（首次运行）
cp .env.example .env
# 编辑 .env 修改 PAYLOAD_SECRET

# 3. 启动开发服务器
PORT=3001 pnpm dev
```

启动后访问：
- 前端页面：http://localhost:3001
- CMS后台：http://localhost:3001/admin

### 管理员账号

| 字段 | 值 |
|------|------|
| 邮箱 | admin@guiqiao.com |
| 密码 | admin123 |

**注意：** 生产环境请务必修改管理员密码。

## 生产部署

### 构建

```bash
pnpm build
pnpm start
```

### Docker 部署（推荐）

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/guiqiao-payload.db ./guiqiao-payload.db

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001
CMD ["pnpm", "start"]
```

### 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| PAYLOAD_SECRET | 是 | CMS加密密钥，生产环境请使用强随机字符串 |
| DATABASE_URI | 否 | 数据库连接，默认 `file:./guiqiao-payload.db` |
| NEXT_PUBLIC_SERVER_URL | 否 | 公开访问URL，如 `https://www.guiqiao.com` |
| PORT | 否 | 服务端口，默认 3001 |

### 数据库

项目默认使用 SQLite，数据库文件为 `guiqiao-payload.db`。如需使用 PostgreSQL 或其他数据库，请参考 [Payload CMS 数据库文档](https://payloadcms.com/docs/database/overview)。

## 项目结构

```
guiqiao-payload/
├── src/
│   ├── app/
│   │   ├── (frontend)/     # 前端页面（Next.js App Router）
│   │   └── (payload)/      # CMS后台（Payload Admin）
│   ├── blocks/             # 自定义内容区块（11个）
│   │   ├── HeroBanner/     # Hero横幅
│   │   ├── Stats/          # 数据统计
│   │   ├── BusinessCards/  # 业务板块
│   │   ├── FeatureGrid/    # 特性网格
│   │   ├── NewsHighlight/  # 新闻资讯
│   │   ├── Timeline/       # 发展历程
│   │   ├── ContactInfo/    # 联系信息
│   │   ├── SocialChannels/ # 社交渠道
│   │   ├── ProductShowcase/# 产品展示
│   │   ├── ImageGallery/   # 图片画廊
│   │   └── RichContent/    # 富文本内容
│   ├── Header/             # 页头组件
│   ├── Footer/             # 页脚组件
│   ├── components/         # 共享组件
│   │   └── motion/         # 动画组件（ScrollReveal, MountReveal）
│   └── collections/        # Payload集合定义
├── seed.ts                 # 种子数据脚本
├── start.sh                # 一键启动脚本
├── guiqiao-payload.db      # SQLite数据库
└── .env                    # 环境变量配置
```

## CMS 使用指南

### 编辑首页内容

1. 登录 CMS 后台（/admin）
2. 进入 Pages > 首页
3. 点击 Content 标签
4. 展开需要编辑的区块
5. 修改内容后点击 "Publish changes"

### 管理新闻文章

1. 进入 Posts 集合
2. 创建新文章，填写标题、内容、封面图
3. 设置状态为 "Published" 并发布
4. 首页新闻资讯区块会自动显示最新文章

### 添加新页面

1. 进入 Pages 集合
2. 点击 "Create New"
3. 使用 Layout Builder 添加内容区块
4. 发布后通过 slug 访问（如 /about）

## 自定义开发

### 添加新的内容区块

1. 在 `src/blocks/` 下创建新目录
2. 创建 `config.ts`（Payload Block 配置）和 `Component.tsx`（React 组件）
3. 在 `src/payload.config.ts` 中注册 Block
4. 在 `src/blocks/RenderBlocks.tsx` 中导入并映射组件

### 修改样式主题

全局样式在 `src/app/(frontend)/globals.css` 中，使用 CSS 变量定义颜色主题。修改 `:root` 中的变量即可全局更换配色。
