#!/bin/bash

# Continue deployment from where it stopped
# This script assumes files are already on the server

set -e

SERVER_IP="149.13.60.6"
SERVER_USER="root"
PROJECT_DIR="/opt/cloud4india"
LOCAL_DB_PATH="./cloud4india-cms/cms.db"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Copy database if exists
if [ -f "$LOCAL_DB_PATH" ]; then
    print_status "Copying local database to server..."
    ssh $SERVER_USER@$SERVER_IP "mkdir -p $PROJECT_DIR/cloud4india-cms"
    scp "$LOCAL_DB_PATH" "$SERVER_USER@$SERVER_IP:$PROJECT_DIR/cloud4india-cms/" || print_warning "Database copy failed"
    print_success "Database copied"
else
    print_warning "Local database not found - server will use default/migrated data"
fi

# Deploy application
print_status "Deploying application on server..."
ssh $SERVER_USER@$SERVER_IP << 'DEPLOY_EOF'
    set -e
    cd /opt/cloud4india
    
    echo "Stopping existing services..."
    docker-compose down 2>/dev/null || echo "No existing services to stop"
    
    echo "Cleaning up old Docker resources..."
    docker container prune -f || true
    docker image prune -f || true
    
    echo "Building and starting services..."
    docker-compose up --build -d
    
    echo "Waiting for services to start..."
    sleep 30
    
    echo "Service status:"
    docker-compose ps
    
    echo "Deployment completed!"
DEPLOY_EOF

print_success "Application deployed successfully"

# Verify deployment
print_status "Verifying deployment..."
sleep 10

print_status "Checking frontend (http://$SERVER_IP)..."
if curl -f -s -m 10 "http://$SERVER_IP" > /dev/null 2>&1; then
    print_success "Frontend is accessible on http://$SERVER_IP"
else
    print_warning "Frontend may not be ready yet"
fi

print_status "Checking backend (http://$SERVER_IP:4002/api/health)..."
if curl -f -s -m 10 "http://$SERVER_IP:4002/api/health" > /dev/null 2>&1; then
    print_success "Backend API is accessible"
else
    print_warning "Backend may not be ready yet"
fi

echo ""
print_success "🎉 Deployment process completed!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend:     http://$SERVER_IP"
echo "   Admin Panel:  http://$SERVER_IP/admin"
echo "   API:          http://$SERVER_IP:4002/api"
echo "   DB Admin:     http://$SERVER_IP:4003"
echo ""
echo "📊 To check status:"
echo "   ssh $SERVER_USER@$SERVER_IP"
echo "   cd $PROJECT_DIR"
echo "   docker-compose ps"
echo "   docker-compose logs -f"



