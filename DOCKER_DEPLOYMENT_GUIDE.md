# Cloud4India Docker Deployment Guide

This guide provides comprehensive instructions for deploying the Cloud4India application using Docker, supporting both local development and production server deployment.

## 🏗️ Architecture Overview

The application consists of three main components:

1. **Frontend (React)** - Port 4001 (External)
2. **CMS Backend (Node.js/Express)** - Port 4002 (External)
3. **Database (SQLite)** - Embedded in CMS container

## 📋 Prerequisites

### Required Software
- Docker (version 20.0 or higher)
- Docker Compose (version 1.29 or higher)
- Git
- curl (for health checks)

### System Requirements
- **RAM**: Minimum 2GB, Recommended 4GB
- **Storage**: Minimum 5GB free space
- **Network**: Internet connection for image downloads

## 🚀 Quick Start

### Local Development Deployment

```bash
# Clone the repository
git clone <repository-url>
cd cloud4india-master

# Run local deployment
./scripts/deploy-local.sh    # Linux/Mac
# OR
scripts\deploy-local.bat     # Windows

# Access the application
# Frontend: http://localhost:4001
# CMS API: http://localhost:4002/api
```

### Production Server Deployment

```bash
# On your Contabo server (161.97.155.89)
git clone <repository-url>
cd cloud4india-master

# Run server deployment
./scripts/deploy-server.sh   # Linux
# OR
scripts\deploy-server.bat    # Windows

# Access the application
# Frontend: http://161.97.155.89:4001
# CMS API: http://161.97.155.89:4002/api
```

## 📁 Project Structure

```
cloud4india-master/
├── Dockerfile.frontend          # Frontend Docker configuration
├── Dockerfile.cms              # CMS Backend Docker configuration
├── docker-compose.yml          # Production deployment
├── docker-compose.local.yml    # Local development deployment
├── nginx.conf                  # Nginx configuration for frontend
├── scripts/
│   ├── deploy-local.sh         # Local deployment script (Linux/Mac)
│   ├── deploy-local.bat        # Local deployment script (Windows)
│   ├── deploy-server.sh        # Server deployment script (Linux)
│   └── deploy-server.bat       # Server deployment script (Windows)
├── env.local                   # Local environment variables
├── env.production              # Production environment variables
├── data/                       # SQLite database storage (created automatically)
└── cloud4india-cms/           # CMS backend source code
```

## 🔧 Configuration

### Environment Variables

#### Local Development (`env.local`)
```env
NODE_ENV=development
VITE_CMS_API_URL=http://localhost:4002
VITE_BASE_URL=http://localhost:4001
FRONTEND_PORT=4001
CMS_PORT_EXTERNAL=4002
```

#### Production (`env.production`)
```env
NODE_ENV=production
VITE_CMS_API_URL=http://161.97.155.89:4002
VITE_BASE_URL=http://161.97.155.89:4001
SERVER_IP=161.97.155.89
FRONTEND_PORT=4001
CMS_PORT_EXTERNAL=4002
```

### Port Configuration

| Service | Internal Port | External Port | Description |
|---------|---------------|---------------|-------------|
| Frontend | 80 | 4001 | React application served by Nginx |
| CMS Backend | 3000 | 4002 | Node.js/Express API server |
| SQLite DB | N/A | N/A | Embedded in CMS container |

## 🐳 Docker Commands

### Basic Operations

```bash
# Start services (production)
docker-compose up -d

# Start services (local development)
docker-compose -f docker-compose.local.yml up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f cloud4india-frontend
docker-compose logs -f cloud4india-cms

# Rebuild and restart
docker-compose up --build -d

# Remove everything (including volumes)
docker-compose down -v --rmi all
```

### Health Checks

```bash
# Check CMS health
curl http://localhost:4002/api/health

# Check frontend accessibility
curl http://localhost:4001

# Check external accessibility (on server)
curl http://161.97.155.89:4001
curl http://161.97.155.89:4002/api/health
```

## 🔥 Firewall Configuration (Server Only)

If deploying on a server, ensure the following ports are open:

```bash
# Ubuntu/Debian
sudo ufw allow 4001/tcp
sudo ufw allow 4002/tcp
sudo ufw reload

# CentOS/RHEL
sudo firewall-cmd --permanent --add-port=4001/tcp
sudo firewall-cmd --permanent --add-port=4002/tcp
sudo firewall-cmd --reload
```

## 📊 Monitoring and Maintenance

### Container Status
```bash
# Check running containers
docker-compose ps

# Check container resource usage
docker stats

# Check container health
docker-compose exec cloud4india-cms curl http://localhost:3000/api/health
```

### Database Backup
```bash
# Backup SQLite database
docker-compose exec cloud4india-cms cp /app/data/cms.db /app/data/cms_backup_$(date +%Y%m%d_%H%M%S).db

# Copy backup to host
docker cp cloud4india-cms:/app/data/cms_backup_*.db ./backups/
```

### Log Management
```bash
# View recent logs
docker-compose logs --tail=100 -f

# Clear logs (restart containers)
docker-compose restart
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Check what's using the port
netstat -tulpn | grep :4001
# OR
lsof -i :4001

# Kill the process or change ports in docker-compose.yml
```

#### 2. Database Connection Issues
```bash
# Check if data directory exists and has correct permissions
ls -la ./data/
chmod 755 ./data/

# Recreate the CMS container
docker-compose stop cloud4india-cms
docker-compose rm cloud4india-cms
docker-compose up -d cloud4india-cms
```

#### 3. Frontend Not Loading
```bash
# Check if build completed successfully
docker-compose logs cloud4india-frontend

# Rebuild frontend
docker-compose stop cloud4india-frontend
docker-compose build --no-cache cloud4india-frontend
docker-compose up -d cloud4india-frontend
```

#### 4. CMS API Not Responding
```bash
# Check CMS logs
docker-compose logs cloud4india-cms

# Check if CMS container is healthy
docker-compose exec cloud4india-cms curl http://localhost:3000/api/health

# Restart CMS service
docker-compose restart cloud4india-cms
```

### Performance Optimization

#### 1. Resource Limits
Add resource limits to `docker-compose.yml`:

```yaml
services:
  cloud4india-frontend:
    # ... other config
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
        reservations:
          memory: 256M
          cpus: '0.25'
```

#### 2. Image Optimization
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune
```

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up --build -d

# Verify deployment
curl http://localhost:4002/api/health
```

### Database Migration
```bash
# Backup current database
docker-compose exec cloud4india-cms cp /app/data/cms.db /app/data/cms_backup.db

# Update application
git pull origin main
docker-compose up --build -d

# Verify data integrity
docker-compose exec cloud4india-cms sqlite3 /app/data/cms.db ".tables"
```

## 📞 Support

### Useful Commands for Support
```bash
# System information
docker version
docker-compose version
docker info

# Container information
docker-compose ps
docker-compose logs --tail=50

# Network information
docker network ls
docker-compose exec cloud4india-cms netstat -tulpn
```

### Log Collection
```bash
# Collect all logs for support
mkdir -p logs
docker-compose logs > logs/docker-compose.log
docker logs cloud4india-frontend > logs/frontend.log
docker logs cloud4india-cms > logs/cms.log
```

## 🌐 API Endpoints

### CMS API Endpoints
- **Health Check**: `GET /api/health`
- **Homepage Content**: `GET /api/homepage`
- **Products**: `GET /api/products`
- **Solutions**: `GET /api/solutions`
- **Admin Panel**: `GET /api/admin/*`

### Frontend Routes
- **Home**: `/`
- **Products**: `/products/*`
- **Solutions**: `/solutions/*`
- **Admin Panel**: `/admin`

## 🔐 Security Considerations

1. **Environment Variables**: Never commit sensitive data to version control
2. **Database**: SQLite database is stored in a Docker volume for persistence
3. **Network**: Containers communicate through a dedicated Docker network
4. **Firewall**: Only expose necessary ports (4001, 4002)
5. **Updates**: Regularly update Docker images and dependencies

## 📈 Scaling Considerations

For high-traffic deployments, consider:

1. **Load Balancer**: Use Nginx or HAProxy in front of multiple frontend containers
2. **Database**: Migrate from SQLite to PostgreSQL or MySQL
3. **Caching**: Add Redis for session and API response caching
4. **CDN**: Use a CDN for static assets
5. **Monitoring**: Implement Prometheus + Grafana for monitoring

---

**Note**: This deployment uses external ports 4001 (frontend) and 4002 (CMS) as requested. The SQLite database is embedded within the CMS container and persisted using Docker volumes.
