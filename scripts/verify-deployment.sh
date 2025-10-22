#!/bin/bash

# Cloud4India Deployment Verification Script

set -e

echo "🔍 Verifying Cloud4India Deployment..."

# Configuration
FRONTEND_PORT=${FRONTEND_PORT:-4001}
CMS_PORT=${CMS_PORT:-4002}
SERVER_IP=${SERVER_IP:-"localhost"}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check URL
check_url() {
    local url=$1
    local description=$2
    local timeout=${3:-10}
    
    echo -n "Checking $description... "
    
    if curl -f -s --max-time $timeout "$url" > /dev/null; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

# Function to check JSON API
check_json_api() {
    local url=$1
    local description=$2
    local timeout=${3:-10}
    
    echo -n "Checking $description... "
    
    local response=$(curl -f -s --max-time $timeout "$url" 2>/dev/null)
    if [ $? -eq 0 ] && echo "$response" | grep -q "{"; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

# Check Docker containers
echo "📦 Checking Docker containers..."
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Docker containers are running${NC}"
else
    echo -e "${RED}❌ Docker containers are not running${NC}"
    echo "Run: docker-compose ps"
    exit 1
fi

echo ""

# Check local endpoints
echo "🏠 Checking local endpoints..."
check_url "http://localhost:$FRONTEND_PORT" "Frontend (localhost:$FRONTEND_PORT)"
check_json_api "http://localhost:$CMS_PORT/api/health" "CMS Health (localhost:$CMS_PORT)"
check_json_api "http://localhost:$CMS_PORT/api/homepage" "CMS Homepage API (localhost:$CMS_PORT)"

echo ""

# Check external endpoints (if not localhost)
if [ "$SERVER_IP" != "localhost" ]; then
    echo "🌍 Checking external endpoints..."
    check_url "http://$SERVER_IP:$FRONTEND_PORT" "Frontend ($SERVER_IP:$FRONTEND_PORT)" 15
    check_json_api "http://$SERVER_IP:$CMS_PORT/api/health" "CMS Health ($SERVER_IP:$CMS_PORT)" 15
    check_json_api "http://$SERVER_IP:$CMS_PORT/api/homepage" "CMS Homepage API ($SERVER_IP:$CMS_PORT)" 15
    echo ""
fi

# Check database
echo "💾 Checking database..."
if docker-compose exec -T cloud4india-cms test -f /app/data/cms.db; then
    echo -e "${GREEN}✅ SQLite database exists${NC}"
    
    # Check database tables
    tables=$(docker-compose exec -T cloud4india-cms sqlite3 /app/data/cms.db ".tables" 2>/dev/null || echo "")
    if echo "$tables" | grep -q "hero_section"; then
        echo -e "${GREEN}✅ Database tables exist${NC}"
    else
        echo -e "${YELLOW}⚠️  Database tables may not be initialized${NC}"
    fi
else
    echo -e "${RED}❌ SQLite database not found${NC}"
fi

echo ""

# Performance check
echo "⚡ Performance check..."
frontend_time=$(curl -o /dev/null -s -w "%{time_total}" "http://localhost:$FRONTEND_PORT" 2>/dev/null || echo "0")
cms_time=$(curl -o /dev/null -s -w "%{time_total}" "http://localhost:$CMS_PORT/api/health" 2>/dev/null || echo "0")

if (( $(echo "$frontend_time < 2.0" | bc -l 2>/dev/null || echo "1") )); then
    echo -e "${GREEN}✅ Frontend response time: ${frontend_time}s${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend response time: ${frontend_time}s (slow)${NC}"
fi

if (( $(echo "$cms_time < 1.0" | bc -l 2>/dev/null || echo "1") )); then
    echo -e "${GREEN}✅ CMS response time: ${cms_time}s${NC}"
else
    echo -e "${YELLOW}⚠️  CMS response time: ${cms_time}s (slow)${NC}"
fi

echo ""

# Resource usage
echo "📊 Resource usage..."
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | grep cloud4india

echo ""

# Summary
echo "📋 Deployment Summary:"
echo "🌐 Frontend URL: http://$SERVER_IP:$FRONTEND_PORT"
echo "🔧 CMS API URL: http://$SERVER_IP:$CMS_PORT/api"
echo "❤️  Health Check: http://$SERVER_IP:$CMS_PORT/api/health"
echo "📊 Admin Panel: http://$SERVER_IP:$FRONTEND_PORT/admin"

echo ""
echo -e "${GREEN}🎉 Deployment verification completed!${NC}"
