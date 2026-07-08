FROM docker.io/node:24.18.0-slim@sha256:cb4e8f7c443347358b7875e717c29e27bf9befc8f5a26cf18af3c3dec80e58c5 AS builder
WORKDIR /app

RUN corepack enable

COPY ./package.json ./pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY ./vite.config.js ./tsconfig.json ./
COPY ./src ./src
RUN pnpm build

# ---

FROM docker.io/joseluisq/static-web-server:2.43.0@sha256:6acea6260b14e08dda986361e42640082fbfaab8d88c327de532bb13a3b22994
WORKDIR /app

COPY --from=builder /app/dist /app/dist

EXPOSE 3000
CMD ["--host", "0.0.0.0", "--port", "3000", "--root", "/app/dist", "-g", "info"]

LABEL image.name=markormesher/quick-timer-web
LABEL image.registry=ghcr.io
LABEL org.opencontainers.image.description=""
LABEL org.opencontainers.image.documentation=""
LABEL org.opencontainers.image.title="quick-timer-web"
LABEL org.opencontainers.image.url=""
LABEL org.opencontainers.image.vendor=""
LABEL org.opencontainers.image.version=""
