# Multi-stage build for production-ready React app

# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Accept build arguments for Vite environment variables
ARG VITE_API_URL
ARG VITE_CMS_URL
ARG VITE_AI_API_KEY

# Set environment variables for Vite (these will be embedded at build time)
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CMS_URL=$VITE_CMS_URL
ENV VITE_AI_API_KEY=$VITE_AI_API_KEY

# Copy package files first (for better layer caching)
COPY package*.json ./

# Install dependencies (this layer will be cached if package.json doesn't change)
RUN npm ci --no-audit --no-fund

# Copy source code (only this layer rebuilds on code changes)
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Note: Vite automatically copies public assets to dist during build, so no separate copy needed

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
