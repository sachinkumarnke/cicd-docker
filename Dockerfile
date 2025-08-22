# Multi-stage build for optimized production image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci --include=dev && npm cache clean --force

# Copy source code
COPY . .

# Run tests and build (if you have a build step)
RUN npm test

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /usr/src/app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force && \
    rm -rf /tmp/*

# Copy application code with proper ownership
COPY --chown=nodejs:nodejs --from=builder /usr/src/app/app.js ./
COPY --chown=nodejs:nodejs --from=builder /usr/src/app/package.json ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Add labels for better container management
LABEL maintainer="DevOps Team" \
      version="1.0.1" \
      description="CI/CD Docker App with Enhanced API" \
      org.opencontainers.image.source="https://github.com/your-org/cicd-docker"

# Health check with improved configuration
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { \
    let body = ''; \
    res.on('data', chunk => body += chunk); \
    res.on('end', () => { \
      try { \
        const health = JSON.parse(body); \
        process.exit(health.status === 'healthy' ? 0 : 1); \
      } catch(e) { \
        process.exit(1); \
      } \
    }); \
  }).on('error', () => process.exit(1))"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "start"]
