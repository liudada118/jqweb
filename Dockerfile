# ============================================
# 柜侨工业官网 - Docker 部署
# Payload CMS + Next.js + SQLite/Turso
# ============================================

FROM node:22.17.0-alpine AS base

# --- Stage 1: Dependencies ---
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# --- Stage 2: Build ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments
ARG PAYLOAD_SECRET
ARG SQLITE_URL=file:./guiqiao-payload.db
ARG SQLITE_AUTH_TOKEN
ARG NEXT_PUBLIC_SERVER_URL

ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
ENV SQLITE_URL=${SQLITE_URL}
ENV SQLITE_AUTH_TOKEN=${SQLITE_AUTH_TOKEN}
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL}
ENV NODE_OPTIONS=--no-deprecation
ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable pnpm && pnpm run build

# --- Stage 3: Production ---
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NODE_OPTIONS=--no-deprecation
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/redirects.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src

# Create writable directories for media uploads and SQLite
RUN mkdir -p /app/public/media /app/data
RUN chown -R nextjs:nodejs /app/public/media /app/data /app/.next

USER nextjs

EXPOSE 3000
ENV PORT=3000

CMD ["pnpm", "start"]
