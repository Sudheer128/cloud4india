#!/bin/bash

# Cloud4India Deployment Script for Contabo Server
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 Starting Cloud4India deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="cloud4india-website"
CONTAINER_NAME="cloud4india-website"
PORT="3004"
SERVER_IP="161.97.155.89"

echo -e "${BLUE}📋 Deployment Configuration:${NC}"
echo -e "  App Name: ${APP_NAME}"
echo -e "  Container: ${CONTAINER_NAME}"
echo -e "  Port: ${PORT}"
echo -e "  Server IP: ${SERVER_IP}"
echo ""

# Step 1: Clean up existing containers
echo -e "${YELLOW}🧹 Cleaning up existing containers...${NC}"
docker stop ${CONTAINER_NAME} 2>/dev/null || true
docker rm ${CONTAINER_NAME} 2>/dev/null || true

# Step 2: Remove old images
echo -e "${YELLOW}🗑️  Removing old images...${NC}"
docker rmi ${APP_NAME}:latest 2>/dev/null || true

# Step 3: Build new image
echo -e "${BLUE}🔨 Building Docker image...${NC}"
docker build -t ${APP_NAME}:latest .

# Step 4: Run the container
echo -e "${BLUE}🚀 Starting new container...${NC}"
docker run -d \
  --name ${CONTAINER_NAME} \
  --restart unless-stopped \
  -p ${PORT}:80 \
  -e NODE_ENV=production \
  ${APP_NAME}:latest

# Step 5: Verify deployment
echo -e "${BLUE}🔍 Verifying deployment...${NC}"
sleep 5

if docker ps | grep -q ${CONTAINER_NAME}; then
  echo -e "${GREEN}✅ Deployment successful!${NC}"
  echo -e "${GREEN}🌐 Application is running at:${NC}"
  echo -e "  Local: http://localhost:${PORT}"
  echo -e "  Server: http://${SERVER_IP}:${PORT}"
  echo ""
  echo -e "${BLUE}📊 Container status:${NC}"
  docker ps | grep ${CONTAINER_NAME}
else
  echo -e "${RED}❌ Deployment failed!${NC}"
  echo -e "${RED}📋 Container logs:${NC}"
  docker logs ${CONTAINER_NAME}
  exit 1
fi

echo ""
echo -e "${GREEN}🎉 Cloud4India deployment completed successfully!${NC}"
echo -e "${BLUE}💡 Useful commands:${NC}"
echo -e "  View logs: docker logs ${CONTAINER_NAME}"
echo -e "  Stop app: docker stop ${CONTAINER_NAME}"
echo -e "  Restart: docker restart ${CONTAINER_NAME}"
echo -e "  Remove: docker stop ${CONTAINER_NAME} && docker rm ${CONTAINER_NAME}"
