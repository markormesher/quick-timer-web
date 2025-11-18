FROM docker.io/node:24.11.1-slim@sha256:0afb7822fac7bf9d7c1bf3b6e6c496dee6b2b64d8dfa365501a3c68e8eba94b2 AS builder
WORKDIR /app

RUN corepack enable

COPY ./package.json ./pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY ./vite.config.js ./tsconfig.json ./
COPY ./src ./src
RUN pnpm build

# ---

FROM docker.io/joseluisq/static-web-server:2.39.0@sha256:97e580189199439560f2e89980fea6c5243518ca53f96898026e835526371d49
WORKDIR /app

COPY --from=builder /app/dist /app/dist

LABEL image.registry=ghcr.io
LABEL image.name=markormesher/quick-timer-web

EXPOSE 3000
CMD ["--host", "0.0.0.0", "--port", "3000", "--root", "/app/dist", "-g", "info"]
