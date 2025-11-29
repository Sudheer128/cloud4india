#!/bin/bash

# Cloud4India Server-Side Deployment Script
# Run this script ON THE SERVER (149.13.60.6)
# Usage: bash server-deploy.sh

set -e

# Configuration
SERVER_IP="149.13.60.6"
PROJECT_DIR="/opt/cloud4india"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Check if running as root
check_root() {
    if [ "$EUID" -ne 0 ]; then 
        print_error "Please run as root"
        exit 1
    fi
}

# Install Docker
install_docker() {
    if command -v docker &> /dev/null; then
        print_success "Docker is already installed"
        return 0
    fi
    
    print_status "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl start docker
    systemctl enable docker
    rm get-docker.sh
    print_success "Docker installed successfully"
}

# Install Docker Compose
install_docker_compose() {
    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose is already installed"
        return 0
    fi
    
    print_status "Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed successfully"
}

# Stop existing web servers on port 80
stop_existing_web_server() {
    print_status "Checking for existing web servers on port 80..."
    
    # Check if Apache is running
    if systemctl is-active --quiet apache2 2>/dev/null; then
        print_warning "Apache is running. Stopping Apache..."
        systemctl stop apache2 || true
        systemctl disable apache2 || true
    fi
    
    # Check if Nginx is running
    if systemctl is-active --quiet nginx 2>/dev/null; then
        print_warning "Nginx is running. Stopping Nginx..."
        systemctl stop nginx || true
        systemctl disable nginx || true
    fi
    
    # Check if anything is using port 80
    if command -v lsof &> /dev/null; then
        PORT80_PID=$(lsof -ti:80 2>/dev/null || true)
        if [ ! -z "$PORT80_PID" ]; then
            print_warning "Port 80 is in use by PID: $PORT80_PID. Stopping..."
            kill -9 $PORT80_PID 2>/dev/null || true
        fi
    fi
    
    print_success "Port 80 is now available"
}

# Configure firewall
configure_firewall() {
    print_status "Configuring firewall..."
    
    # Check if ufw is installed
    if ! command -v ufw &> /dev/null; then
        print_warning "UFW not found. Installing..."
        apt-get update -qq
        apt-get install -y ufw
    fi
    
    # Open required ports
    ufw allow 80/tcp || true
    ufw allow 4002/tcp || true
    ufw allow 4003/tcp || true
    ufw allow 22/tcp || true
    ufw --force enable || true
    
    print_success "Firewall configured"
}

# Deploy application
deploy_application() {
    if [ ! -f "docker-compose.yml" ]; then
        print_error "docker-compose.yml not found. Please ensure you're in the project directory."
        exit 1
    fi
    
    print_status "Deploying application..."
    
    # Stop existing services
    print_status "Stopping existing services..."
    docker-compose down 2>/dev/null || true
    
    # Clean up old resources
    print_status "Cleaning up old Docker resources..."
    docker container prune -f || true
    docker image prune -f || true
    
    # Build and start services
    print_status "Building and starting services..."
    docker-compose up --build -d
    
    # Wait for services to start
    print_status "Waiting for services to start..."
    sleep 30
    
    # Check service status
    print_status "Service status:"
    docker-compose ps
    
    print_success "Application deployed successfully"
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    sleep 5
    
    # Check if containers are running
    if docker-compose ps | grep -q "Up"; then
        print_success "Services are running"
        
        # Test endpoints
        print_status "Testing endpoints..."
        
        if curl -f -s -m 5 "http://localhost" > /dev/null 2>&1; then
            print_success "Frontend is accessible"
        else
            print_warning "Frontend may not be ready yet"
        fi
        
        if curl -f -s -m 5 "http://localhost:4002/api/health" > /dev/null 2>&1; then
            print_success "Backend API is accessible"
        else
            print_warning "Backend API may not be ready yet"
        fi
    else
        print_error "Services are not running. Check logs with: docker-compose logs"
        exit 1
    fi
}

# Main deployment function
main() {
    print_status "Starting Cloud4India deployment on server..."
    echo "Server: $SERVER_IP"
    echo "Project Directory: $PROJECT_DIR"
    echo ""
    
    check_root
    stop_existing_web_server
    install_docker
    install_docker_compose
    configure_firewall
    
    # Check if we're in the project directory
    if [ ! -f "docker-compose.yml" ]; then
        print_status "Navigating to project directory..."
        if [ -d "$PROJECT_DIR" ]; then
            cd "$PROJECT_DIR"
        else
            print_error "Project directory not found: $PROJECT_DIR"
            print_error "Please ensure application files are uploaded to the server"
            exit 1
        fi
    fi
    
    deploy_application
    verify_deployment
    
    print_success "🎉 Deployment completed!"
    echo ""
    echo "🌐 Access your application:"
    echo "   Frontend:     http://$SERVER_IP"
    echo "   Admin Panel:  http://$SERVER_IP/admin"
    echo "   API:          http://$SERVER_IP:4002/api"
    echo "   DB Admin:     http://$SERVER_IP:4003"
    echo ""
    echo "📊 Useful commands:"
    echo "   View logs:    docker-compose logs -f"
    echo "   Status:       docker-compose ps"
    echo "   Restart:      docker-compose restart"
    echo "   Stop:         docker-compose down"
    echo ""
}

# Run main function
main

