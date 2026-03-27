FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY prisma.config.js ./
RUN npm ci --omit=dev

# Copy Prisma schema + generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY src ./src

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/ || exit 1

# Start
ENV NODE_ENV=production
CMD ["node", "src/server.js"]
