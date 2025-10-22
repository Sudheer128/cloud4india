#!/bin/bash

# Cloud4India Server Setup Script for Contabo
# Run this script on your Contabo server to prepare it for deployment

set -e

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

# Update system
update_system() {
    print_status "Updating system packages..."
    apt update && apt upgrade -y
    print_success "System updated successfully"
}

# Install Docker
install_docker() {
    if command -v docker >/dev/null 2>&1; then
        print_success "Docker is already installed"
        docker --version
    else
        print_status "Installing Docker..."
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        rm get-docker.sh
        
        # Start and enable Docker
        systemctl start docker
        systemctl enable docker
        
        print_success "Docker installed successfully"
        docker --version
    fi
}

# Install Docker Compose
install_docker_compose() {
    if command -v docker-compose >/dev/null 2>&1; then
        print_success "Docker Compose is already installed"
        docker-compose --version
    else
        print_status "Installing Docker Compose..."
        curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        chmod +x /usr/local/bin/docker-compose
        
        print_success "Docker Compose installed successfully"
        docker-compose --version
    fi
}

# Install Git
install_git() {
    if command -v git >/dev/null 2>&1; then
        print_success "Git is already installed"
        git --version
    else
        print_status "Installing Git..."
        apt install -y git
        print_success "Git installed successfully"
        git --version
    fi
}

# Configure firewall
configure_firewall() {
    print_status "Configuring firewall..."
    
    # Install ufw if not present
    if ! command -v ufw >/dev/null 2>&1; then
        apt install -y ufw
    fi
    
    # Configure firewall rules
    ufw --force reset
    ufw default deny incoming
    ufw default allow outgoing
    
    # Allow SSH
    ufw allow 22/tcp
    
    # Allow application ports
    ufw allow 4001/tcp comment 'Cloud4India Frontend'
    ufw allow 4002/tcp comment 'Cloud4India Backend'
    ufw allow 4003/tcp comment 'Cloud4India DB Admin'
    
    # Enable firewall
    ufw --force enable
    
    print_success "Firewall configured successfully"
    ufw status
}

# Create project directory
create_project_directory() {
    print_status "Creating project directory..."
    
    PROJECT_DIR="/opt/cloud4india-master"
    
    if [ -d "$PROJECT_DIR" ]; then
        print_warning "Project directory already exists"
    else
        mkdir -p "$PROJECT_DIR"
        print_success "Project directory created: $PROJECT_DIR"
    fi
}

# Clone repository
clone_repository() {
    print_status "Cloning repository..."
    
    PROJECT_DIR="/opt/cloud4india-master"
    
    if [ -d "$PROJECT_DIR/.git" ]; then
        print_warning "Repository already exists, pulling latest changes..."
        cd "$PROJECT_DIR"
        git pull origin main || print_warning "Git pull failed"
    else
        print_status "Please provide the Git repository URL:"
        read -p "Repository URL: " REPO_URL
        
        if [ -n "$REPO_URL" ]; then
            git clone "$REPO_URL" "$PROJECT_DIR"
            print_success "Repository cloned successfully"
        else
            print_warning "No repository URL provided, skipping clone"
            print_warning "You can manually copy your files to $PROJECT_DIR"
        fi
    fi
}

# Set up monitoring
setup_monitoring() {
    print_status "Setting up basic monitoring..."
    
    # Install htop for system monitoring
    apt install -y htop iotop
    
    # Create log rotation for Docker
    cat > /etc/logrotate.d/docker << 'EOF'
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
EOF
    
    print_success "Basic monitoring tools installed"
}

# Create backup directory
create_backup_directory() {
    print_status "Creating backup directory..."
    
    BACKUP_DIR="/opt/backups/cloud4india"
    mkdir -p "$BACKUP_DIR"
    
    # Create backup script
    cat > /opt/backups/backup-cloud4india.sh << 'EOF'
#!/bin/bash
# Cloud4India Backup Script

BACKUP_DIR="/opt/backups/cloud4india"
DATE=$(date +%Y%m%d_%H%M%S)
PROJECT_DIR="/opt/cloud4india-master"

# Create backup
echo "Creating backup: $DATE"

# Backup database
docker exec cloud4india-cms sqlite3 /app/data/cms.db ".backup /app/data/cms_backup_$DATE.db" 2>/dev/null || echo "Database backup failed"
docker cp cloud4india-cms:/app/data/cms_backup_$DATE.db "$BACKUP_DIR/" 2>/dev/null || echo "Database copy failed"

# Backup project files
tar -czf "$BACKUP_DIR/project_backup_$DATE.tar.gz" -C /opt cloud4india-master --exclude=node_modules --exclude=.git

# Clean old backups (keep last 7 days)
find "$BACKUP_DIR" -name "*.db" -mtime +7 -delete
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
EOF
    
    chmod +x /opt/backups/backup-cloud4india.sh
    
    print_success "Backup directory and script created"
}

# Show summary
show_summary() {
    print_success "Server setup completed!"
    echo ""
    echo "📋 Installation Summary:"
    echo "   ✅ System updated"
    echo "   ✅ Docker installed"
    echo "   ✅ Docker Compose installed"
    echo "   ✅ Git installed"
    echo "   ✅ Firewall configured"
    echo "   ✅ Project directory created"
    echo "   ✅ Monitoring tools installed"
    echo "   ✅ Backup system setup"
    echo ""
    echo "🔥 Firewall Status:"
    ufw status
    echo ""
    echo "📁 Project Directory: /opt/cloud4india-master"
    echo "💾 Backup Directory: /opt/backups/cloud4india"
    echo ""
    echo "🚀 Next Steps:"
    echo "   1. Copy your application files to /opt/cloud4india-master"
    echo "   2. Run: cd /opt/cloud4india-master"
    echo "   3. Run: docker-compose up --build -d"
    echo ""
    echo "📊 Monitor your application:"
    echo "   docker-compose ps"
    echo "   docker-compose logs -f"
    echo ""
}

# Main function
main() {
    print_status "Starting Cloud4India server setup..."
    echo "This script will install Docker, Docker Compose, Git, and configure the server"
    echo ""
    
    # Check if running as root
    if [ "$EUID" -ne 0 ]; then
        print_error "Please run this script as root (use sudo)"
        exit 1
    fi
    
    update_system
    install_docker
    install_docker_compose
    install_git
    configure_firewall
    create_project_directory
    setup_monitoring
    create_backup_directory
    show_summary
}

# Run main function
main
