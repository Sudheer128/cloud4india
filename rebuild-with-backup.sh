#!/bin/bash

# Cloud4India Docker Rebuild with Automatic Backup
# This script automatically backs up your code before rebuilding Docker containers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/root/cloud4india"

echo -e "${BLUE}🚀 Docker Rebuild with Automatic Backup${NC}"
echo ""

# Step 1: Create backup
echo -e "${BLUE}📦 Step 1: Creating backup of current code...${NC}"
cd "${PROJECT_DIR}"
./backup-code.sh
echo ""

# Step 2: Stop existing containers
echo -e "${BLUE}🛑 Step 2: Stopping existing containers...${NC}"
docker-compose down || echo "No containers to stop"
echo ""

# Step 3: Rebuild and start
echo -e "${BLUE}🔨 Step 3: Rebuilding Docker containers...${NC}"
docker-compose up --build -d
echo ""

# Step 4: Wait for services
echo -e "${BLUE}⏳ Step 4: Waiting for services to start...${NC}"
sleep 10
echo ""

# Step 5: Show status
echo -e "${BLUE}📊 Step 5: Container status:${NC}"
docker-compose ps
echo ""

echo -e "${GREEN}✅ Rebuild completed successfully!${NC}"
echo ""
echo -e "${BLUE}💡 Your code was backed up before rebuilding.${NC}"
echo -e "${BLUE}   Check the latest backup in: /root/cloud4india-backups/${NC}"


