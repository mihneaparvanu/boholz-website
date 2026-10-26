# syntax=docker/dockerfile:1.7
# ─────────────────────────────────────────────────────────────────────────────
# BoHolz site image. Bun for install + build; node 22-alpine for runtime
# (Astro's node adapter targets node, not bun, so we don't carry the bun
# runtime into prod — smaller final image, same SSR behavior).
#
# CI uses Railpack, which auto-detects bun.lock and builds the same way.
# This Dockerfile is kept so `docker build .` works locally / on the host
# without Railpack.
# ─────────────────────────────────────────────────────────────────────────────

FROM oven/bun:alpine AS deps
WORKDIR /app
# Lockfile-only install first → cache layer survives source edits.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# PUBLIC_* vars are inlined into the client bundle at BUILD time by Astro/Vite.
# They MUST be present here, not just at runtime — pass via --build-arg.
# (Non-secret by definition; they end up in View-Source anyway.)
ARG PUBLIC_ASSETS_URL
ARG PUBLIC_TURNSTILE_SITE_KEY
ARG PUBLIC_GTM_ID
# Since the switch to output: "static", the build itself queries the database —
# getStaticPaths enumerates every house, showhouse, article and landing page.
# So DATABASE_URL is a BUILD dependency now, not only a runtime one, and the
# builder needs to reach sn-c1-db: build with --network web-network.
# GOOGLE_PLACES_API_KEY moved the same way: the homepage reviews are fetched
# once here and frozen into index.html. Absent at build = permanently empty.
ARG DATABASE_URL
ARG GOOGLE_PLACES_API_KEY
ENV PUBLIC_ASSETS_URL=$PUBLIC_ASSETS_URL \
    PUBLIC_TURNSTILE_SITE_KEY=$PUBLIC_TURNSTILE_SITE_KEY \
    PUBLIC_GTM_ID=$PUBLIC_GTM_ID \
    DATABASE_URL=$DATABASE_URL \
    GOOGLE_PLACES_API_KEY=$GOOGLE_PLACES_API_KEY
RUN bun run build

FROM node:lts-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
