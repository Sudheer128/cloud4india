FROM node:18-slim

# Install curl for health checks (optimized: combine commands and use cache)
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean

WORKDIR /app

# Copy package files first (for better layer caching)
COPY package*.json ./

# Install dependencies (this layer will be cached if package.json doesn't change)
RUN npm ci --only=production --no-audit --no-fund

# Copy source code (only this layer rebuilds on code changes)
COPY . .

# Create data directory for database and uploads directory
RUN mkdir -p /app/data /app/uploads/images /app/uploads/videos && \
    chown -R node:node /app/data /app/uploads

# Expose port 3000
EXPOSE 3000

# Start the CMS server
CMD ["node", "server.js"]
