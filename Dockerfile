# Railway Voice Proxy - Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source
COPY . .

# Build the custom server (if build:server script exists)
RUN npm run build:server || echo "Using pre-built .server-build if present"

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built server from builder
COPY --from=builder /app/.server-build ./server

# Create healthcheck endpoint support
RUN echo '{"type":"module"}' > package.json.tmp && \
    cat package.json >> package.json.tmp && \
    mv package.json.tmp package.json 2>/dev/null || true

# Expose port (Railway overrides with $PORT)
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); }).on('error', () => process.exit(1))" || exit 1

# Start the voice proxy server
CMD ["node", "server/server.js"]
