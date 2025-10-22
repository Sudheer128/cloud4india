#!/bin/bash

# Cloud4India Complete Deployment Script
# Supports both local and server deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DEPLOYMENT_TYPE=${1:-"local"}
SERVER_IP="161.97.155.89"
FRONTEND_PORT="4001"
CMS_PORT="4002"

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

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker and try again."
        exit 1
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    print_success "All prerequisites met"
}

# Function to setup environment
setup_environment() {
    print_status "Setting up environment for $DEPLOYMENT_TYPE deployment..."
    
    # Create data directory
    mkdir -p ./data
    chmod 755 ./data
    
    # Set environment variables based on deployment type
    if [ "$DEPLOYMENT_TYPE" = "server" ]; then
        export VITE_CMS_API_URL="http://$SERVER_IP:$CMS_PORT"
        export VITE_BASE_URL="http://$SERVER_IP:$FRONTEND_PORT"
        export NODE_ENV="production"
    else
        export VITE_CMS_API_URL="http://localhost:$CMS_PORT"
        export VITE_BASE_URL="http://localhost:$FRONTEND_PORT"
        export NODE_ENV="development"
    fi
    
    print_success "Environment configured for $DEPLOYMENT_TYPE"
}

# Function to deploy application
deploy_application() {
    print_status "Deploying Cloud4India application..."
    
    # Stop existing containers
    print_status "Stopping existing containers..."
    if [ "$DEPLOYMENT_TYPE" = "server" ]; then
        docker-compose down --remove-orphans 2>/dev/null || true
    else
        docker-compose -f docker-compose.local.yml down --remove-orphans 2>/dev/null || true
    fi
    
    # Build and start containers
    print_status "Building and starting containers..."
    if [ "$DEPLOYMENT_TYPE" = "server" ]; then
        docker-compose up --build -d
    else
        docker-compose -f docker-compose.local.yml up --build -d
    fi
    
    print_success "Containers started successfully"
}

# Function to wait for services
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for CMS to be healthy
    print_status "Checking CMS health..."
    for i in {1..30}; do
        if curl -f http://localhost:$CMS_PORT/api/health > /dev/null 2>&1; then
            print_success "CMS is healthy!"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "CMS health check failed after 30 attempts"
            return 1
        fi
        print_status "Waiting for CMS... (attempt $i/30)"
        sleep 2
    done
    
    # Wait for Frontend to be accessible
    print_status "Checking Frontend accessibility..."
    for i in {1..15}; do
        if curl -f http://localhost:$FRONTEND_PORT > /dev/null 2>&1; then
            print_success "Frontend is accessible!"
            break
        fi
        if [ $i -eq 15 ]; then
            print_error "Frontend accessibility check failed after 15 attempts"
            return 1
        fi
        print_status "Waiting for Frontend... (attempt $i/15)"
        sleep 2
    done
}

# Function to verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Check container status
    if [ "$DEPLOYMENT_TYPE" = "server" ]; then
        docker-compose ps
    else
        docker-compose -f docker-compose.local.yml ps
    fi
    
    # Run verification script if it exists
    if [ -f "./scripts/verify-deployment.sh" ]; then
        if [ "$DEPLOYMENT_TYPE" = "server" ]; then
            SERVER_IP=$SERVER_IP ./scripts/verify-deployment.sh
        else
            SERVER_IP="localhost" ./scripts/verify-deployment.sh
        fi
    fi
}

# Function to display final information
display_info() {
    echo ""
    print_success "🎉 Cloud4India deployment completed successfully!"
    echo ""
    
    if [ "$DEPLOYMENT_TYPE" = "server" ]; then
        echo "🌐 External URLs:"
        echo "📱 Frontend: http://$SERVER_IP:$FRONTEND_PORT"
        echo "🔧 CMS API: http://$SERVER_IP:$CMS_PORT/api"
        echo "❤️  Health Check: http://$SERVER_IP:$CMS_PORT/api/health"
        echo "📊 Admin Panel: http://$SERVER_IP:$FRONTEND_PORT/admin"
        echo ""
        echo "🏠 Local URLs (for server access):"
        echo "📱 Frontend: http://localhost:$FRONTEND_PORT"
        echo "🔧 CMS API: http://localhost:$CMS_PORT/api"
        echo ""
        echo "🔥 Firewall Configuration (if needed):"
        echo "sudo ufw allow $FRONTEND_PORT/tcp"
        echo "sudo ufw allow $CMS_PORT/tcp"
    else
        echo "🏠 Local URLs:"
        echo "📱 Frontend: http://localhost:$FRONTEND_PORT"
        echo "🔧 CMS API: http://localhost:$CMS_PORT/api"
        echo "❤️  Health Check: http://localhost:$CMS_PORT/api/health"
        echo "📊 Admin Panel: http://localhost:$FRONTEND_PORT/admin"
    fi
    
    echo ""
    echo "📝 Useful Commands:"
    if [ "$DEPLOYMENT_TYPE" = "server" ]; then
        echo "View logs: docker-compose logs -f"
        echo "Stop services: docker-compose down"
        echo "Restart services: docker-compose restart"
    else
        echo "View logs: docker-compose -f docker-compose.local.yml logs -f"
        echo "Stop services: docker-compose -f docker-compose.local.yml down"
        echo "Restart services: docker-compose -f docker-compose.local.yml restart"
    fi
}

# Main execution
main() {
    echo "🚀 Cloud4India Docker Deployment Script"
    echo "========================================"
    
    # Validate deployment type
    if [ "$DEPLOYMENT_TYPE" != "local" ] && [ "$DEPLOYMENT_TYPE" != "server" ]; then
        print_error "Invalid deployment type. Use 'local' or 'server'"
        echo "Usage: $0 [local|server]"
        exit 1
    fi
    
    print_status "Starting $DEPLOYMENT_TYPE deployment..."
    
    # Execute deployment steps
    check_prerequisites
    setup_environment
    deploy_application
    wait_for_services
    verify_deployment
    display_info
    
    print_success "Deployment completed successfully! 🎉"
}

# Run main function
main "$@"
