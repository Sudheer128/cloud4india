#!/bin/bash

# Cloud4India New Server Deployment Script
# This script deploys the application to the new server: 149.13.60.6

set -e

# Configuration
SERVER_IP="149.13.60.6"
SERVER_USER="root"
PROJECT_DIR="/opt/cloud4india"
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
    
    if ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP "echo 'Connection successful'" 2>/dev/null; then
        print_success "Connection to server successful"
        return 0
    else
        print_warning "Cannot connect via SSH with passwordless auth. You may need to enter password manually."
        print_status "Please ensure you can SSH to the server: ssh $SERVER_USER@$SERVER_IP"
        read -p "Continue anyway? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
        return 1
    fi
}

# Setup server environment
setup_server() {
    print_status "Setting up server environment..."
    
    ssh $SERVER_USER@$SERVER_IP << 'EOF'
        set -e
        
        # Update system
        echo "Updating system packages..."
        apt update && apt upgrade -y || true
        
        # Install Docker if not installed
        if ! command -v docker &> /dev/null; then
            echo "Installing Docker..."
            curl -fsSL https://get.docker.com -o get-docker.sh
            sh get-docker.sh
            systemctl start docker
            systemctl enable docker
            rm get-docker.sh
        fi
        
        # Install Docker Compose if not installed
        if ! command -v docker-compose &> /dev/null; then
            echo "Installing Docker Compose..."
            curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            chmod +x /usr/local/bin/docker-compose
        fi
        
        # Create project directory
        mkdir -p /opt/cloud4india
        
        # Configure firewall
        echo "Configuring firewall..."
        ufw allow 80/tcp || true
        ufw allow 4002/tcp || true
        ufw allow 4003/tcp || true
        ufw allow 22/tcp || true
        ufw --force enable || true
        
        echo "Server setup completed"
EOF
    
    print_success "Server environment setup completed"
}

# Copy application files to server
copy_application() {
    print_status "Copying application files to server..."
    
    # Create temporary archive
    print_status "Creating application archive..."
    cd /root/cloud4india
    tar --exclude='node_modules' \
        --exclude='.git' \
        --exclude='dist' \
        --exclude='*.log' \
        -czf /tmp/cloud4india-deploy.tar.gz .
    
    # Copy to server
    print_status "Uploading files to server..."
    scp /tmp/cloud4india-deploy.tar.gz $SERVER_USER@$SERVER_IP:/tmp/
    
    # Extract on server
    print_status "Extracting files on server..."
    ssh $SERVER_USER@$SERVER_IP << 'EOF'
        cd /opt/cloud4india
        if [ -f /tmp/cloud4india-deploy.tar.gz ]; then
            tar -xzf /tmp/cloud4india-deploy.tar.gz
            rm /tmp/cloud4india-deploy.tar.gz
        else
            echo "Archive already extracted or not found, continuing..."
        fi
        chmod +x scripts/*.sh 2>/dev/null || true
EOF
    
    # Cleanup local archive
    rm /tmp/cloud4india-deploy.tar.gz
    
    print_success "Application files copied successfully"
}

# Copy database to server (if exists)
copy_database() {
    if [ -f "$LOCAL_DB_PATH" ]; then
        print_status "Copying local database to server..."
        ssh $SERVER_USER@$SERVER_IP "mkdir -p /opt/cloud4india/cloud4india-cms"
        scp "$LOCAL_DB_PATH" "$SERVER_USER@$SERVER_IP:/opt/cloud4india/cloud4india-cms/"
        print_success "Database copied successfully"
    else
        print_warning "Local database not found at $LOCAL_DB_PATH"
        print_warning "Server will start with default/migrated data"
    fi
}

# Deploy application
deploy_application() {
    print_status "Deploying application on server..."
    
    ssh $SERVER_USER@$SERVER_IP << 'EOF'
        set -e
        
        # Navigate to project directory
        cd /opt/cloud4india
        
        # Stop existing services
        echo "Stopping existing services..."
        docker-compose down 2>/dev/null || echo "No existing services to stop"
        
        # Clean up old containers/images
        echo "Cleaning up old Docker resources..."
        docker container prune -f || true
        docker image prune -f || true
        
        # Build and start services
        echo "Building and starting services..."
        docker-compose up --build -d
        
        # Wait for services to start
        echo "Waiting for services to start..."
        sleep 30
        
        # Check service status
        echo "Checking service status..."
        docker-compose ps
        
        echo "Deployment completed on server"
EOF
    
    print_success "Application deployed successfully"
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    sleep 10
    
    # Test frontend
    print_status "Checking frontend (port 80)..."
    if curl -f -s -m 10 "http://$SERVER_IP" > /dev/null 2>&1; then
        print_success "Frontend is accessible on http://$SERVER_IP"
    else
        print_warning "Frontend may not be ready yet. Please check manually: http://$SERVER_IP"
    fi
    
    # Test backend
    print_status "Checking backend (port 4002)..."
    if curl -f -s -m 10 "http://$SERVER_IP:4002/api/health" > /dev/null 2>&1; then
        print_success "Backend API is running on http://$SERVER_IP:4002"
    else
        print_warning "Backend may not be ready yet. Please check manually: http://$SERVER_IP:4002/api/health"
    fi
    
    # Test database admin
    print_status "Checking database admin (port 4003)..."
    if curl -f -s -m 10 "http://$SERVER_IP:4003" > /dev/null 2>&1; then
        print_success "Database admin is accessible on http://$SERVER_IP:4003"
    else
        print_warning "Database admin may not be ready yet. Please check manually: http://$SERVER_IP:4003"
    fi
}

# Show access URLs
show_access_info() {
    print_success "Deployment completed!"
    echo ""
    echo "🌐 Access your application:"
    echo "   Frontend:     http://$SERVER_IP"
    echo "   Admin Panel:  http://$SERVER_IP/admin"
    echo "   API:          http://$SERVER_IP:4002/api"
    echo "   DB Admin:     http://$SERVER_IP:4003"
    echo ""
    echo "📊 Monitor your application:"
    echo "   ssh $SERVER_USER@$SERVER_IP"
    echo "   cd $PROJECT_DIR"
    echo "   docker-compose logs -f"
    echo "   docker-compose ps"
    echo ""
    echo "🔧 Useful commands:"
    echo "   View logs:    ssh $SERVER_USER@$SERVER_IP 'cd $PROJECT_DIR && docker-compose logs -f'"
    echo "   Restart:      ssh $SERVER_USER@$SERVER_IP 'cd $PROJECT_DIR && docker-compose restart'"
    echo "   Stop:         ssh $SERVER_USER@$SERVER_IP 'cd $PROJECT_DIR && docker-compose down'"
    echo "   Status:       ssh $SERVER_USER@$SERVER_IP 'cd $PROJECT_DIR && docker-compose ps'"
    echo ""
}

# Main deployment function
main() {
    print_status "Starting Cloud4India deployment to new server..."
    echo "Server: $SERVER_IP"
    echo "Project Directory: $PROJECT_DIR"
    echo ""
    
    check_prerequisites
    test_connection
    setup_server
    copy_application
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

