# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS base

# Install dependencies needed for Prisma and other native modules
RUN apk add --no-cache libc6-compat openssl curl

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --legacy-peer-deps --omit=dev && npm cache clean --force

# Development stage
FROM base AS development
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Production stage
FROM base AS production

# Copy built application from development stage
COPY --from=development /app/dist ./dist
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/prisma ./prisma

# Copy any additional files needed at runtime
COPY package*.json ./
COPY chama-b57f4-firebase-adminsdk-fbsvc-a743d47717.json ./

# Generate Prisma client
RUN npx prisma generate

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Change ownership of the app directory
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start the application
CMD ["node", "dist/src/main.js"]

