#!/bin/bash

# Cloud4India Server Docker Deployment Script

set -e

echo "🚀 Starting Cloud4India Server Deployment..."

# Configuration
SERVER_IP="161.97.155.89"
FRONTEND_PORT="4001"
CMS_PORT="4002"

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
docker-compose down --remove-orphans

# Remove old images (optional - uncomment if you want to rebuild from scratch)
# echo "🗑️  Removing old images..."
# docker-compose down --rmi all

# Build and start containers
echo "🔨 Building and starting containers..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check if CMS is healthy
echo "🏥 Checking CMS health..."
for i in {1..30}; do
    if curl -f http://localhost:${CMS_PORT}/api/health > /dev/null 2>&1; then
        echo "✅ CMS is healthy!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ CMS health check failed after 30 attempts"
        docker-compose logs cloud4india-cms
        exit 1
    fi
    echo "⏳ Waiting for CMS... (attempt $i/30)"
    sleep 2
done

# Check if Frontend is accessible
echo "🌐 Checking Frontend accessibility..."
for i in {1..15}; do
    if curl -f http://localhost:${FRONTEND_PORT} > /dev/null 2>&1; then
        echo "✅ Frontend is accessible!"
        break
    fi
    if [ $i -eq 15 ]; then
        echo "❌ Frontend accessibility check failed after 15 attempts"
        docker-compose logs cloud4india-frontend
        exit 1
    fi
    echo "⏳ Waiting for Frontend... (attempt $i/15)"
    sleep 2
done

# Check external accessibility (if on server)
echo "🌍 Checking external accessibility..."
if curl -f http://${SERVER_IP}:${FRONTEND_PORT} > /dev/null 2>&1; then
    echo "✅ External Frontend is accessible!"
else
    echo "⚠️  External Frontend check failed - this might be normal if firewall rules are not configured"
fi

if curl -f http://${SERVER_IP}:${CMS_PORT}/api/health > /dev/null 2>&1; then
    echo "✅ External CMS is accessible!"
else
    echo "⚠️  External CMS check failed - this might be normal if firewall rules are not configured"
fi

echo ""
echo "🎉 Cloud4India Server Deployment Complete!"
echo ""
echo "🌐 External URLs:"
echo "📱 Frontend: http://${SERVER_IP}:${FRONTEND_PORT}"
echo "🔧 CMS API: http://${SERVER_IP}:${CMS_PORT}/api"
echo "❤️  Health Check: http://${SERVER_IP}:${CMS_PORT}/api/health"
echo ""
echo "🏠 Local URLs (for server access):"
echo "📱 Frontend: http://localhost:${FRONTEND_PORT}"
echo "🔧 CMS API: http://localhost:${CMS_PORT}/api"
echo ""
echo "📊 Container Status:"
docker-compose ps
echo ""
echo "📝 To view logs: docker-compose logs -f"
echo "🛑 To stop: docker-compose down"
echo ""
echo "🔥 Firewall Configuration (if needed):"
echo "sudo ufw allow ${FRONTEND_PORT}/tcp"
echo "sudo ufw allow ${CMS_PORT}/tcp"
