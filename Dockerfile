# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY .npmrc package.json package-lock.json* ./
RUN npm ci --include=dev

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Install PM2 globally and libcap2-bin for setcap
RUN npm install -g pm2
RUN apk add --no-cache libcap2-bin

# Create logs directory
RUN mkdir -p /app/logs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=root:root /app/.next/standalone ./
COPY --from=builder --chown=root:root /app/.next/static ./.next/static

# Copy PM2 configuration
COPY --chown=root:root ecosystem.config.js ./

# Give Node.js permission to bind to port 80
RUN setcap 'cap_net_bind_service=+ep' /usr/local/bin/node

# Set ownership and switch to nextjs user
RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 80

ENV PORT 80
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

# Start with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"] 