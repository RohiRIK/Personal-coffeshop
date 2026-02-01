# ---- Base ----
FROM oven/bun:1-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---- Builder ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set dummy Firebase env vars for build (real ones passed at runtime)
ENV NEXT_PUBLIC_FIREBASE_API_KEY=build-placeholder
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=build-placeholder
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=build-placeholder
ENV NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=build-placeholder
ENV NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=build-placeholder
ENV NEXT_PUBLIC_FIREBASE_APP_ID=build-placeholder
ENV NEXT_TELEMETRY_DISABLED=1

RUN bun run build

# ---- Runner ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 appuser

# Copy built assets
COPY --from=builder /app/public ./public
COPY --from=builder --chown=appuser:appgroup /app/.next/standalone ./
COPY --from=builder --chown=appuser:appgroup /app/.next/static ./.next/static

USER appuser

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["bun", "run", "server.js"]
