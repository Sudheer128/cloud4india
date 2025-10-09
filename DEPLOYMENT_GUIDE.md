# 🚀 Cloud4India Deployment Guide

Complete guide for deploying Cloud4India React application on Contabo server with aaPanel using Docker.

## 📋 Prerequisites

### Server Requirements
- **Contabo VPS** with minimum 2GB RAM, 2 CPU cores
- **aaPanel** installed and configured
- **Docker & Docker Compose** installed
- **Port 3004** available and open in firewall
- **Server IP**: 161.97.155.89

### Local Requirements
- **Node.js 18+** installed
- **Docker Desktop** (for Windows/Mac) or Docker Engine (for Linux)
- **Git** for version control

## 🏗️ Application Architecture

```
Cloud4India Application
├── Frontend: React 18 + Vite + Tailwind CSS
├── Container: Docker + Nginx
├── Port: 3004 (mapped to container port 80)
└── Environment: Dual mode (localhost/production)
```

## 🛠️ Local Development Setup

### 1. Install Dependencies
```bash
cd /path/to/cloud4india-project
npm install
```

### 2. Start Development Server

**Windows:**
```bash
dev.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/dev.sh
./scripts/dev.sh
```

**Or manually:**
```bash
npm run dev
```

**Development URL:** `http://localhost:3001`

## 🚀 Production Deployment

### Method 1: Direct Docker Deployment (Recommended)

**Windows:**
```bash
deploy.bat
```

**Linux/Mac:**
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Method 2: Docker Compose Deployment

```bash
# Build and start
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🌐 Contabo Server Deployment Steps

### Step 1: Prepare Server Environment

1. **Access aaPanel**
   ```
   URL: http://161.97.155.89:8888
   Login with your aaPanel credentials
   ```

2. **Install Docker (if not installed)**
   ```bash
   # SSH into your server
   ssh root@161.97.155.89
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   chmod +x /usr/local/bin/docker-compose
   ```

3. **Configure Firewall**
   ```bash
   # Open port 3004
   ufw allow 3004
   
   # Or in aaPanel Security section, add port 3004
   ```

### Step 2: Upload Application Files

1. **Create Project Directory**
   ```bash
   mkdir -p /www/wwwroot/cloud4india
   cd /www/wwwroot/cloud4india
   ```

2. **Upload Files via aaPanel File Manager or SCP**
   ```bash
   # Using SCP from local machine
   scp -r /path/to/cloud4india/* root@161.97.155.89:/www/wwwroot/cloud4india/
   ```

   **Or use Git:**
   ```bash
   git clone your-repository-url .
   ```

### Step 3: Deploy Application

1. **Navigate to Project Directory**
   ```bash
   cd /www/wwwroot/cloud4india
   ```

2. **Run Deployment Script**
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

   **Or use Docker Compose:**
   ```bash
   docker-compose up --build -d
   ```

### Step 4: Configure aaPanel (Optional)

1. **Add Site in aaPanel**
   - Go to Website → Add Site
   - Domain: `161.97.155.89` or your domain
   - Port: `3004`
   - Root Directory: `/www/wwwroot/cloud4india`

2. **Setup Reverse Proxy (Optional)**
   - Go to Website → Site Settings → Reverse Proxy
   - Target URL: `http://localhost:3004`
   - This allows access via port 80/443

## 🔧 Configuration Details

### Environment Configuration
- **Local Development**: `http://localhost:3001`
- **Production**: `http://161.97.155.89:3004`
- **Auto-detection**: Application automatically detects environment

### Docker Configuration
- **Base Image**: `nginx:alpine` (Production)
- **Port Mapping**: `3004:80`
- **Restart Policy**: `unless-stopped`
- **Build**: Multi-stage build for optimization

### Nginx Configuration
- **Static File Serving**: Optimized for React SPA
- **Client-side Routing**: Supports React Router
- **Compression**: Gzip enabled
- **Caching**: Static assets cached for 1 year
- **Security Headers**: Basic security headers included

## 📊 Monitoring & Management

### Container Management
```bash
# View running containers
docker ps

# View container logs
docker logs cloud4india-website

# Restart container
docker restart cloud4india-website

# Stop container
docker stop cloud4india-website

# Remove container
docker rm cloud4india-website

# View resource usage
docker stats cloud4india-website
```

### Health Check
```bash
# Check application health
curl http://161.97.155.89:3004/health

# Response should be: "healthy"
```

### Log Management
```bash
# View real-time logs
docker logs -f cloud4india-website

# View last 100 lines
docker logs --tail 100 cloud4india-website

# Export logs
docker logs cloud4india-website > app.log 2>&1
```

## 🔄 Updates & Maintenance

### Deploying Updates

1. **Pull Latest Code**
   ```bash
   cd /www/wwwroot/cloud4india
   git pull origin main
   ```

2. **Redeploy**
   ```bash
   ./scripts/deploy.sh
   ```

### Backup Strategy
```bash
# Backup application files
tar -czf cloud4india-backup-$(date +%Y%m%d).tar.gz /www/wwwroot/cloud4india

# Store backup in safe location
mv cloud4india-backup-*.tar.gz /www/backup/
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port 3004
   lsof -i :3004
   
   # Kill process
   kill -9 <PID>
   ```

2. **Container Won't Start**
   ```bash
   # Check container logs
   docker logs cloud4india-website
   
   # Check disk space
   df -h
   
   # Check memory usage
   free -h
   ```

3. **Permission Issues**
   ```bash
   # Fix file permissions
   chown -R root:root /www/wwwroot/cloud4india
   chmod -R 755 /www/wwwroot/cloud4india
   ```

4. **Firewall Issues**
   ```bash
   # Check if port is open
   ufw status
   
   # Open port 3004
   ufw allow 3004
   ```

### Performance Optimization

1. **Enable HTTP/2**
   ```nginx
   listen 80 http2;
   ```

2. **Optimize Docker Image**
   ```bash
   # Remove unused images
   docker image prune -a
   
   # Remove unused volumes
   docker volume prune
   ```

## 📞 Support & Access URLs

### Application URLs
- **Local Development**: http://localhost:3001
- **Production**: http://161.97.155.89:3004
- **Health Check**: http://161.97.155.89:3004/health

### aaPanel Access
- **URL**: http://161.97.155.89:8888
- **File Manager**: Access via aaPanel interface
- **Terminal**: Available in aaPanel

### Docker Commands Reference
```bash
# Quick deployment
./deploy.bat                    # Windows
./scripts/deploy.sh            # Linux/Mac

# Development
./dev.bat                      # Windows
npm run dev                    # Cross-platform

# Docker Compose
docker-compose up -d           # Start services
docker-compose down            # Stop services
docker-compose logs -f         # View logs
```

## ✅ Success Verification

After deployment, verify everything is working:

1. ✅ **Application Loading**: Visit http://161.97.155.89:3004
2. ✅ **Logo Display**: Cloud4India logo should be visible
3. ✅ **Navigation**: All menu items should work
4. ✅ **Responsive Design**: Test on mobile/tablet
5. ✅ **Performance**: Page should load quickly
6. ✅ **Health Check**: http://161.97.155.89:3004/health returns "healthy"

## 🎉 Deployment Complete!

Your Cloud4India website is now live and accessible at:
**http://161.97.155.89:3004**

The application supports both local development and production environments with automatic configuration detection.
