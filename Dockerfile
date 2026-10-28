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
# Content lives in src/domain as TypeScript, so the build reaches no database
# and needs no network. GOOGLE_PLACES_API_KEY is still a BUILD dependency: the
# homepage reviews are fetched once here and frozen into index.html, so absent
# at build means permanently empty.
ARG GOOGLE_PLACES_API_KEY
ENV PUBLIC_ASSETS_URL=$PUBLIC_ASSETS_URL \
    PUBLIC_TURNSTILE_SITE_KEY=$PUBLIC_TURNSTILE_SITE_KEY \
    PUBLIC_GTM_ID=$PUBLIC_GTM_ID \
    GOOGLE_PLACES_API_KEY=$GOOGLE_PLACES_API_KEY
RUN bun run build

FROM node:lts-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
# Enquiries whose notification email fails are appended here as JSONL so none
# is lost. The path is identical on the host, which is bind-mounted over it:
#   -v /opt/tenants/boholz/website/leads:/opt/tenants/boholz/website/leads
# Without that mount the file still works but dies with the container, and
# logLead also writes every record to stderr, so docker logs keeps a copy.
ENV LEAD_LOG_PATH=/opt/tenants/boholz/website/leads/leads.jsonl
RUN mkdir -p /opt/tenants/boholz/website/leads
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
EXPOSE 4321
CMD ["node", "./dist/server/entry.mjs"]
