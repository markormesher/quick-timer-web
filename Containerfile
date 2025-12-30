FROM docker.io/node:24.12.0-slim@sha256:b83af04d005d8e3716f542469a28ad2947ba382f6b4a76ddca0827a21446a540 AS builder
WORKDIR /app

RUN corepack enable

COPY ./package.json ./pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY ./vite.config.js ./tsconfig.json ./
COPY ./src ./src
RUN pnpm build

# ---

FROM docker.io/joseluisq/static-web-server:2.40.1@sha256:63528bfba5d86b00572e23b4e44ed0f7a791f931df650125156d0c24f7a8f877
WORKDIR /app

COPY --from=builder /app/dist /app/dist

LABEL image.registry=ghcr.io
LABEL image.name=markormesher/quick-timer-web

EXPOSE 3000
CMD ["--host", "0.0.0.0", "--port", "3000", "--root", "/app/dist", "-g", "info"]
