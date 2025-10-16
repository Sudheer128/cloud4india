#!/bin/bash

# Cloud4India Docker Compose Deployment Script
# Usage: ./scripts/deploy-docker-compose.sh

set -e

echo "🚀 Deploying Cloud4India with Docker Compose..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Stop existing services
echo -e "${YELLOW}🛑 Stopping existing services...${NC}"
docker-compose down 2>/dev/null || true

# Step 2: Build and start services
echo -e "${BLUE}🔨 Building and starting services...${NC}"
docker-compose up --build -d

# Step 3: Verify deployment
echo -e "${BLUE}🔍 Verifying deployment...${NC}"
sleep 5

if docker-compose ps | grep -q "Up"; then
  echo -e "${GREEN}✅ Deployment successful!${NC}"
  echo -e "${GREEN}🌐 Application is running at:${NC}"
  echo -e "  Local: http://localhost:3004"
  echo -e "  Server: http://161.97.155.89:3004"
  echo ""
  echo -e "${BLUE}📊 Service status:${NC}"
  docker-compose ps
else
  echo -e "${RED}❌ Deployment failed!${NC}"
  docker-compose logs
  exit 1
fi

echo ""
echo -e "${GREEN}🎉 Cloud4India deployment completed!${NC}"
echo -e "${BLUE}💡 Useful commands:${NC}"
echo -e "  View logs: docker-compose logs -f"
echo -e "  Stop: docker-compose down"
echo -e "  Restart: docker-compose restart"
