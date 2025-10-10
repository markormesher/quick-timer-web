FROM docker.io/node:24.10.0-slim@sha256:c0eadb278e6b0b608681b359291592692979133567710eaa703d6f989f33c6c1 AS builder
WORKDIR /app

RUN corepack enable

COPY ./package.json ./pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY ./vite.config.js ./tsconfig.json ./
COPY ./src ./src
RUN pnpm build

# ---

FROM docker.io/joseluisq/static-web-server:2.38.1@sha256:54345a59d7dfd54c1d8d5e14322b73eff5daa5ad6d06998e67ff53e149d93981
WORKDIR /app

COPY --from=builder /app/dist /app/dist

LABEL image.registry=ghcr.io
LABEL image.name=markormesher/quick-timer-web

EXPOSE 3000
CMD ["--host", "0.0.0.0", "--port", "3000", "--root", "/app/dist", "-g", "info"]
