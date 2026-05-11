FROM docker.io/node:24.15.0-slim@sha256:24dc26ef1e3c3690f27ebc4136c9c186c3133b25563ae4d7f0692e4d1fe5db0e AS builder
WORKDIR /app

RUN corepack enable

COPY ./package.json ./pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY ./vite.config.js ./tsconfig.json ./
COPY ./src ./src
RUN pnpm build

# ---

FROM docker.io/joseluisq/static-web-server:2.42.0@sha256:2d67e47e22172235e339908777e692006ffdcf42dc4c531aff5d4337a7559a1e
WORKDIR /app

COPY --from=builder /app/dist /app/dist

EXPOSE 3000
CMD ["--host", "0.0.0.0", "--port", "3000", "--root", "/app/dist", "-g", "info"]

LABEL image.name=markormesher/quick-timer-web
LABEL image.registry=ghcr.io
LABEL org.opencontainers.image.description=""
LABEL org.opencontainers.image.documentation=""
LABEL org.opencontainers.image.title="quick-timer-web"
LABEL org.opencontainers.image.url="https://github.com/markormesher/quick-timer-web"
LABEL org.opencontainers.image.vendor=""
LABEL org.opencontainers.image.version=""
