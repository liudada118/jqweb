#!/bin/bash
# 柜侨工业官网 - 一键启动脚本
# Next.js + Payload CMS

echo "🏭 柜侨工业官网 - 启动中..."
echo ""

cd "$(dirname "$0")"

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js，请先安装 Node.js 18+"
    exit 1
fi

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 安装 pnpm..."
    npm install -g pnpm
fi

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装项目依赖..."
    pnpm install
fi

# 检查 .env 文件
if [ ! -f ".env" ]; then
    echo "⚙️  创建 .env 配置文件..."
    cat > .env << 'EOF'
# Payload CMS 配置
PAYLOAD_SECRET=your-secret-key-change-this-in-production
DATABASE_URI=file:./guiqiao-payload.db
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
EOF
    echo "✅ .env 文件已创建，请根据需要修改配置"
fi

# 设置端口
export PORT=${PORT:-3001}

echo ""
echo "🚀 启动开发服务器..."
echo "   前端页面: http://localhost:$PORT"
echo "   CMS后台:  http://localhost:$PORT/admin"
echo "   管理员账号: admin@guiqiao.com"
echo "   管理员密码: admin123"
echo ""

pnpm dev
