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

### 方案一：Vercel 部署（推荐）

Vercel 是 Next.js 官方推荐的部署平台，配合 Turso 云数据库可实现零运维。

**第一步：创建 Turso 数据库**

```bash
# 安装 Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# 登录并创建数据库
turso auth login
turso db create guiqiao-website --location hkg

# 获取连接信息
turso db show guiqiao-website --url
# 输出：libsql://guiqiao-website-yourname.turso.io

turso db tokens create guiqiao-website
# 输出：token 字符串
```

**第二步：部署到 Vercel**

1. 将代码推送到 GitHub 仓库
2. 访问 [vercel.com](https://vercel.com)，导入仓库
3. 配置环境变量（见下表），点击 Deploy

**第三步：初始化**

部署完成后访问 `/admin` 创建管理员账号，登录后自动进入可视化编辑器。

### 方案二：Docker 部署

项目根目录已包含 `Dockerfile`，支持多阶段构建。

**使用 Docker Compose（推荐）：**

```yaml
# docker-compose.yml
version: '3.8'
services:
  web:
    build:
      context: .
      args:
        PAYLOAD_SECRET: your-strong-secret-key
    ports:
      - "3000:3000"
    environment:
      - PAYLOAD_SECRET=your-strong-secret-key
      - SQLITE_URL=file:/app/data/guiqiao-payload.db
      - NODE_ENV=production
    volumes:
      - sqlite-data:/app/data
      - media-data:/app/public/media
    restart: unless-stopped

volumes:
  sqlite-data:
  media-data:
```

```bash
docker compose up -d
```

**使用 Turso 云数据库：**

```bash
docker build \
  --build-arg PAYLOAD_SECRET=your-secret \
  --build-arg SQLITE_URL=libsql://your-db.turso.io \
  --build-arg SQLITE_AUTH_TOKEN=your-token \
  -t guiqiao-website .

docker run -d -p 3000:3000 \
  -e PAYLOAD_SECRET=your-secret \
  -e SQLITE_URL=libsql://your-db.turso.io \
  -e SQLITE_AUTH_TOKEN=your-token \
  guiqiao-website
```

### 方案三：直接部署到服务器

```bash
# 安装依赖并构建
pnpm install
cp .env.example .env  # 编辑 .env 填入实际值
pnpm build

# 使用 PM2 守护进程
npm install -g pm2
pm2 start pnpm --name guiqiao-website -- start
pm2 startup && pm2 save
```

配合 Nginx 反向代理使用，参考 `DEPLOY.md` 中的 Nginx 配置示例。

### 环境变量

| 变量 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `PAYLOAD_SECRET` | 是 | 无 | CMS 加密密钥，生产环境必须使用强随机密码 |
| `SQLITE_URL` | 否 | `file:./guiqiao-payload.db` | 数据库连接 URL（支持 Turso） |
| `SQLITE_AUTH_TOKEN` | 否 | 无 | Turso 数据库认证 Token |
| `NEXT_PUBLIC_SERVER_URL` | 否 | 自动检测 | 网站公开 URL |
| `PORT` | 否 | `3000` | 服务端口 |
| `CRON_SECRET` | 否 | 无 | 定时任务认证密钥 |

### 数据库

项目默认使用 SQLite，数据库文件为 `guiqiao-payload.db`。生产环境推荐使用 [Turso](https://turso.tech)（SQLite 云端托管，免费额度充足）。如需使用 PostgreSQL，请参考 [Payload CMS 数据库文档](https://payloadcms.com/docs/database/overview)。

### Nginx 反向代理配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location /media/ {
        alias /path/to/guiqiao-website/public/media/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

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
