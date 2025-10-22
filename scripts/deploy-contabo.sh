#!/bin/bash

# Cloud4India Contabo Deployment Script
# This script deploys the application to your Contabo server

set -e

# Configuration
SERVER_IP="161.97.155.89"
SERVER_USER="root"
PROJECT_DIR="/opt/cloud4india-master"
LOCAL_DB_PATH="./cloud4india-cms/cms.db"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command_exists ssh; then
        print_error "SSH is not installed"
        exit 1
    fi
    
    if ! command_exists scp; then
        print_error "SCP is not installed"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
}

# Test server connection
test_connection() {
    print_status "Testing connection to $SERVER_IP..."
    
    if ssh -o ConnectTimeout=10 -o BatchMode=yes $SERVER_USER@$SERVER_IP exit 2>/dev/null; then
        print_success "Connection to server successful"
    else
        print_error "Cannot connect to server. Please check:"
        print_error "1. Server IP: $SERVER_IP"
        print_error "2. SSH key authentication"
        print_error "3. Server is running"
        exit 1
    fi
}

# Copy local database to server
copy_database() {
    if [ -f "$LOCAL_DB_PATH" ]; then
        print_status "Copying local database to server..."
        scp "$LOCAL_DB_PATH" "$SERVER_USER@$SERVER_IP:$PROJECT_DIR/cloud4india-cms/"
        print_success "Database copied successfully"
    else
        print_warning "Local database not found at $LOCAL_DB_PATH"
        print_warning "Server will start with default data"
    fi
}

# Deploy application
deploy_application() {
    print_status "Deploying application to server..."
    
    ssh $SERVER_USER@$SERVER_IP << 'EOF'
        set -e
        
        # Navigate to project directory
        cd /opt/cloud4india-master
        
        # Pull latest changes (if git repo exists)
        if [ -d ".git" ]; then
            echo "Pulling latest changes..."
            git pull origin main || echo "Git pull failed, continuing with existing code"
        fi
        
        # Stop existing services
        echo "Stopping existing services..."
        docker-compose down || echo "No services to stop"
        
        # Build and start services
        echo "Building and starting services..."
        docker-compose up --build -d
        
        # Wait for services to start
        echo "Waiting for services to start..."
        sleep 30
        
        # Check service status
        echo "Checking service status..."
        docker-compose ps
EOF
    
    print_success "Application deployed successfully"
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Test frontend
    if curl -f -s "http://$SERVER_IP:4001/health" > /dev/null; then
        print_success "Frontend is running on port 4001"
    else
        print_warning "Frontend health check failed"
    fi
    
    # Test backend
    if curl -f -s "http://$SERVER_IP:4002/api/health" > /dev/null; then
        print_success "Backend is running on port 4002"
    else
        print_warning "Backend health check failed"
    fi
    
    # Test database admin
    if curl -f -s "http://$SERVER_IP:4003" > /dev/null; then
        print_success "Database admin is running on port 4003"
    else
        print_warning "Database admin health check failed"
    fi
    
    # Check migration status
    print_status "Checking database migrations..."
    MIGRATION_RESPONSE=$(curl -s "http://$SERVER_IP:4002/api/migrations" 2>/dev/null)
    if [ $? -eq 0 ]; then
        MIGRATION_COUNT=$(echo "$MIGRATION_RESPONSE" | grep -o '"total":[0-9]*' | cut -d':' -f2)
        COMPLETED_COUNT=$(echo "$MIGRATION_RESPONSE" | grep -o '"completed":[0-9]*' | cut -d':' -f2)
        if [ "$MIGRATION_COUNT" -gt 0 ]; then
            print_success "Database migrations: $COMPLETED_COUNT/$MIGRATION_COUNT completed"
        else
            print_warning "No migrations found - this might be expected for a fresh installation"
        fi
    else
        print_warning "Could not check migration status"
    fi
}

# Show access URLs
show_access_info() {
    print_success "Deployment completed!"
    echo ""
    echo "🌐 Access your application:"
    echo "   Frontend:     http://$SERVER_IP:4001"
    echo "   Admin Panel:  http://$SERVER_IP:4001/admin"
    echo "   API:          http://$SERVER_IP:4002/api"
    echo "   DB Admin:     http://$SERVER_IP:4003"
    echo ""
    echo "📊 Monitor your application:"
    echo "   ssh $SERVER_USER@$SERVER_IP"
    echo "   cd $PROJECT_DIR"
    echo "   docker-compose logs -f"
    echo ""
}

# Main deployment function
main() {
    print_status "Starting Cloud4India deployment to Contabo server..."
    echo "Server: $SERVER_IP"
    echo "Project Directory: $PROJECT_DIR"
    echo ""
    
    check_prerequisites
    test_connection
    copy_database
    deploy_application
    verify_deployment
    show_access_info
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "verify")
        verify_deployment
        ;;
    "logs")
        ssh $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && docker-compose logs -f"
        ;;
    "status")
        ssh $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && docker-compose ps"
        ;;
    "restart")
        ssh $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && docker-compose restart"
        ;;
    "stop")
        ssh $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && docker-compose down"
        ;;
    "start")
        ssh $SERVER_USER@$SERVER_IP "cd $PROJECT_DIR && docker-compose up -d"
        ;;
    *)
        echo "Usage: $0 {deploy|verify|logs|status|restart|stop|start}"
        echo ""
        echo "Commands:"
        echo "  deploy  - Full deployment (default)"
        echo "  verify  - Verify deployment status"
        echo "  logs    - Show application logs"
        echo "  status  - Show service status"
        echo "  restart - Restart services"
        echo "  stop    - Stop services"
        echo "  start   - Start services"
        exit 1
        ;;
esac
