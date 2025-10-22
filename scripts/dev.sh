#!/bin/bash

# Cloud4India Local Development Script
# Usage: ./scripts/dev.sh

echo "🚀 Starting Cloud4India in development mode..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Development Configuration:${NC}"
echo -e "  Environment: Local Development"
echo -e "  Port: 3001"
echo -e "  Hot Reload: Enabled"
echo ""

# Start development server
echo -e "${GREEN}🌐 Starting development server...${NC}"
echo -e "${GREEN}📍 Application will be available at: http://localhost:3001${NC}"
echo ""

npm run dev
