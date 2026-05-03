# Build from the REPO ROOT so the full pnpm workspace is available:
#   docker build -f apps/web/Dockerfile -t server-monitor-web .
#
# At runtime, Fluent Bit tails /app/logs/*.log and forwards to the monitor:
#   docker run \
#     -e MONITOR_HOST=<nestjs-host> \
#     -e MONITOR_PORT=4000 \
#     -v $(pwd)/logs:/app/logs \
#     server-monitor-web

# ── Stage 1: install all workspace dependencies ─────────────────────────────
FROM node:22-alpine AS deps

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json                     ./apps/web/
COPY packages/ui/package.json                  ./packages/ui/
COPY packages/typescript-config/package.json   ./packages/typescript-config/
COPY packages/eslint-config/package.json       ./packages/eslint-config/

RUN pnpm install --frozen-lockfile

# ── Stage 2: build the Next.js app ──────────────────────────────────────────
FROM node:22-alpine AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

WORKDIR /app

COPY --from=deps /app/node_modules            ./node_modules
COPY --from=deps /app/apps/web/node_modules   ./apps/web/node_modules

COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter web build

# ── Stage 3: production runtime ─────────────────────────────────────────────
# ubuntu:24.04 (glibc 2.39) is required by the latest Fluent Bit binary.
# Node.js 22 is installed via NodeSource; Fluent Bit via its official apt repo.
FROM ubuntu:24.04 AS runner

WORKDIR /app

ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV LOG_DIR=/app/logs
ENV MONITOR_HOST=host.docker.internal
ENV MONITOR_PORT=4000

# Install Node.js 22 + Fluent Bit via their official apt repos
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates curl gnupg \
 && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
 && curl -fsSL https://packages.fluentbit.io/fluentbit.key \
      | gpg --dearmor -o /usr/share/keyrings/fluentbit.gpg \
 && echo "deb [signed-by=/usr/share/keyrings/fluentbit.gpg] https://packages.fluentbit.io/ubuntu/noble noble main" \
      > /etc/apt/sources.list.d/fluentbit.list \
 && apt-get update && apt-get install -y --no-install-recommends nodejs fluent-bit \
 && rm -rf /var/lib/apt/lists/*

ENV PATH="/opt/fluent-bit/bin:$PATH"

RUN groupadd --system --gid 1001 nodejs \
 && useradd  --system --uid 1001 --gid nodejs nextjs

# Fluent Bit config: tail all logs and POST to the NestJS monitor via HTTP
RUN mkdir -p /etc/fluent-bit
COPY apps/web/fluent-bit.conf /etc/fluent-bit/fluent-bit.conf

# ── Next.js standalone output ────────────────────────────────────────────────
COPY --from=builder /app/apps/web/public                             ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

COPY apps/web/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

RUN mkdir -p /app/logs && chown nextjs:nodejs /app/logs

USER nextjs

EXPOSE 3001
ENV PORT=3001
ENV HOSTNAME=0.0.0.0

CMD ["/entrypoint.sh"]
