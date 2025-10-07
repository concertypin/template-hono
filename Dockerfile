# Dockerfile for a Hono-based Node.js app (multi-stage, pnpm)
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Enable Corepack and activate pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy only manifest(s) first for better layer caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies with pnpm (use frozen lockfile when present)
RUN if [ -f pnpm-lock.yaml ]; then \
    pnpm install --frozen-lockfile --prefer-offline; \
    else \
    pnpm install --prefer-offline; \
    fi

# Copy source and run build if defined
COPY . .
RUN if pnpm run | grep -q ' build'; then pnpm run build; fi

# Final lightweight image
FROM node:${NODE_VERSION}-slim
LABEL org.opencontainers.image.source="template-hono"
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app

# Create a non-root user
RUN groupadd -g 1000 app || true \
 && useradd -m -u 1000 -g 1000 app || true

# Install curl (for optional healthcheck) and ensure pnpm is available in the final image
RUN apt-get update \
 && apt-get install -y --no-install-recommends curl ca-certificates \
 && corepack enable \
 && corepack prepare pnpm@latest --activate \
 && rm -rf /var/lib/apt/lists/*

# Copy app from builder and set ownership
COPY --from=builder /app /app
RUN chown -R app:app /app

USER app
EXPOSE ${PORT}

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:${PORT}/ || exit 1

# Use pnpm to start the app; ensure package.json defines "start"
CMD ["pnpm", "start"]