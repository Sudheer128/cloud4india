FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create data directory for database
RUN mkdir -p /app/data && chown -R node:node /app/data

# Change to non-root user
USER node

# Expose port 3000
EXPOSE 3000

# Start the CMS server
CMD ["node", "server.js"]
