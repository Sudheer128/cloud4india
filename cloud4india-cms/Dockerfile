FROM node:18-slim

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create data directory for database and uploads directory
RUN mkdir -p /app/data /app/uploads/images /app/uploads/videos && chown -R node:node /app/data /app/uploads

# Expose port 3000
EXPOSE 3000

# Start the CMS server
CMD ["node", "server.js"]
