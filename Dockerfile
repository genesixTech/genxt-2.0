# syntax=docker/dockerfile:1.7

FROM node:20-bookworm-slim AS base
ENV PNPM_HOME="/root/.local/share/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS frontend-deps
WORKDIR /app/frontend
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS frontend-build
WORKDIR /app/frontend
COPY --from=frontend-deps /app/frontend/node_modules ./node_modules
COPY frontend ./
RUN pnpm build

FROM base AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev

FROM backend-deps AS backend-build
WORKDIR /app/backend
COPY backend ./

FROM node:20-bookworm-slim AS runner
ENV NODE_ENV=production \
    PORT=3001 \
    SERVE_FRONTEND=true
WORKDIR /app/backend

RUN apt-get update && apt-get install -y nginx && rm -rf /var/lib/apt/lists/* && rm -f /etc/nginx/sites-enabled/default /etc/nginx/conf.d/default.conf

COPY --from=backend-build /app/backend ./
COPY --from=frontend-build /app/frontend/dist ./public
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/entrypoint.sh"]
EXPOSE 3001
CMD ["node", "src/server.js"]
