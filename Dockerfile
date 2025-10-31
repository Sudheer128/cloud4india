# Multi-stage build for production-ready React app

# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Accept build arguments for Vite environment variables
ARG VITE_API_URL
ARG VITE_CMS_URL

# Set environment variables for Vite (these will be embedded at build time)
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CMS_URL=$VITE_CMS_URL

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built app from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy public assets
COPY --from=build /app/public /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
