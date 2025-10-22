#!/bin/bash

# Cloud4India Local Docker Deployment Script

set -e

echo "🚀 Starting Cloud4India Local Deployment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
    exit 1
fi

# Create data directory for SQLite database
echo "📁 Creating data directory..."
mkdir -p ./data
chmod 755 ./data

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.local.yml down --remove-orphans

# Remove old images (optional - uncomment if you want to rebuild from scratch)
# echo "🗑️  Removing old images..."
# docker-compose -f docker-compose.local.yml down --rmi all

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose -f docker-compose.local.yml up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if CMS is healthy
echo "🏥 Checking CMS health..."
for i in {1..30}; do
    if curl -f http://localhost:4002/api/health > /dev/null 2>&1; then
        echo "✅ CMS is healthy!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ CMS health check failed after 30 attempts"
        docker-compose -f docker-compose.local.yml logs cloud4india-cms
        exit 1
    fi
    echo "⏳ Waiting for CMS... (attempt $i/30)"
    sleep 2
done

# Check if Frontend is accessible
echo "🌐 Checking Frontend accessibility..."
for i in {1..15}; do
    if curl -f http://localhost:4001 > /dev/null 2>&1; then
        echo "✅ Frontend is accessible!"
        break
    fi
    if [ $i -eq 15 ]; then
        echo "❌ Frontend accessibility check failed after 15 attempts"
        docker-compose -f docker-compose.local.yml logs cloud4india-frontend
        exit 1
    fi
    echo "⏳ Waiting for Frontend... (attempt $i/15)"
    sleep 2
done

echo ""
echo "🎉 Cloud4India Local Deployment Complete!"
echo ""
echo "📱 Frontend: http://localhost:4001"
echo "🔧 CMS API: http://localhost:4002/api"
echo "❤️  Health Check: http://localhost:4002/api/health"
echo ""
echo "📊 Container Status:"
docker-compose -f docker-compose.local.yml ps
echo ""
echo "📝 To view logs: docker-compose -f docker-compose.local.yml logs -f"
echo "🛑 To stop: docker-compose -f docker-compose.local.yml down"
