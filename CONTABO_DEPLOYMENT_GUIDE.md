# Cloud4India - Contabo Server Deployment Guide

## 🚀 Quick Deployment Overview

Your Cloud4India application will be deployed on your Contabo server `161.97.155.89` with the following external ports:

- **Frontend (React)**: `http://161.97.155.89:4001`
- **Backend (CMS API)**: `http://161.97.155.89:4002`
- **Database Admin (Adminer)**: `http://161.97.155.89:4003`

## 📋 Prerequisites

1. **Contabo Server Access**: SSH access to `161.97.155.89`
2. **Docker & Docker Compose**: Installed on the server
3. **Git**: To clone the repository
4. **Firewall**: Ports 4001, 4002, 4003 open

## 🔧 Server Setup

### 1. Connect to Your Contabo Server

```bash
ssh root@161.97.155.89
# or
ssh your-username@161.97.155.89
```

### 2. Install Docker & Docker Compose (if not installed)

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Start Docker service
systemctl start docker
systemctl enable docker
```

### 3. Configure Firewall

```bash
# Open required ports
ufw allow 4001/tcp
ufw allow 4002/tcp
ufw allow 4003/tcp
ufw allow 22/tcp
ufw --force enable
```

## 📦 Application Deployment

### 1. Clone the Repository

```bash
cd /opt
git clone https://github.com/your-username/cloud4india-master.git
cd cloud4india-master
```

### 2. Copy Your Local Database (Optional)

If you want to migrate your existing local database:

```bash
# On your local machine, copy the database file to the server
scp ./cloud4india-cms/cms.db root@161.97.155.89:/opt/cloud4india-master/cloud4india-cms/
```

### 3. Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up --build -d

# Check if all services are running
docker-compose ps

# View logs
docker-compose logs -f
```

### 4. Verify Deployment

Check each service:

```bash
# Frontend
curl http://161.97.155.89:4001/health

# Backend API
curl http://161.97.155.89:4002/api/health

# Database Migrations Status
curl http://161.97.155.89:4002/api/migrations

# Database Admin (in browser)
# Visit: http://161.97.155.89:4003
```

### 5. Database Migrations

Your application includes comprehensive database migrations that will run automatically:

**Migration Files Included:**
- Basic Cloud Servers product data
- Financial Services sections and content
- HSBC success story metrics
- Implementation journey timeline
- Technology solutions content
- Use cases and real-world examples
- Resource documentation
- All section items and configurations

**Migration Status:**
- Check migration status: `curl http://161.97.155.89:4002/api/migrations`
- Manually trigger migrations: `curl -X POST http://161.97.155.89:4002/api/migrations/run`
- View in admin panel: http://161.97.155.89:4001/admin

## 🌐 Access Your Application

- **Website**: http://161.97.155.89:4001
- **Admin Panel**: http://161.97.155.89:4001/admin
- **API Endpoints**: http://161.97.155.89:4002/api/*
- **Database Management**: http://161.97.155.89:4003

## 🔄 Management Commands

### Start Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### Restart Services
```bash
docker-compose restart
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f cloud4india-web
docker-compose logs -f cloud4india-cms
```

### Update Application
```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

## 💾 Database Management

### Backup Database
```bash
# Create backup
docker exec cloud4india-cms sqlite3 /app/data/cms.db ".backup /app/data/cms_backup_$(date +%Y%m%d_%H%M%S).db"

# Copy backup to host
docker cp cloud4india-cms:/app/data/cms_backup_*.db ./backups/
```

### Restore Database
```bash
# Copy backup to container
docker cp ./backups/cms_backup.db cloud4india-cms:/app/data/

# Restore backup
docker exec cloud4india-cms sqlite3 /app/data/cms.db ".restore /app/data/cms_backup.db"
```

## 🔍 Troubleshooting

### Check Service Status
```bash
docker-compose ps
docker-compose logs [service-name]
```

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -tulpn | grep :4001
   
   # Kill the process if needed
   kill -9 <PID>
   ```

2. **Database Permission Issues**
   ```bash
   # Fix database permissions
   docker exec cloud4india-cms chown -R node:node /app/data
   ```

3. **Memory Issues**
   ```bash
   # Check system resources
   free -h
   df -h
   
   # Clean up Docker
   docker system prune -a
   ```

### Service Health Checks

```bash
# Frontend health
curl -f http://161.97.155.89:4001/health || echo "Frontend down"

# Backend health
curl -f http://161.97.155.89:4002/api/health || echo "Backend down"

# Database connectivity
docker exec cloud4india-cms sqlite3 /app/data/cms.db "SELECT 1;" || echo "Database issue"
```

## 🔒 Security Recommendations

1. **Firewall**: Only open necessary ports
2. **SSL/TLS**: Consider adding HTTPS with Let's Encrypt
3. **Backup**: Regular database backups
4. **Updates**: Keep Docker and system updated
5. **Monitoring**: Set up monitoring for services

## 📊 Monitoring & Logs

### Log Locations
- **Application Logs**: `docker-compose logs`
- **System Logs**: `/var/log/`
- **Docker Logs**: `/var/lib/docker/containers/`

### Performance Monitoring
```bash
# Resource usage
docker stats

# System monitoring
htop
iotop
```

## 🚨 Emergency Procedures

### Quick Restart
```bash
cd /opt/cloud4india-master
docker-compose restart
```

### Full Reset
```bash
cd /opt/cloud4india-master
docker-compose down -v
docker-compose up --build -d
```

### Rollback
```bash
git checkout <previous-commit>
docker-compose down
docker-compose up --build -d
```

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify network connectivity
3. Check system resources
4. Review this guide for troubleshooting steps

---

**Deployment Date**: $(date)
**Server**: 161.97.155.89
**Ports**: 4001 (Frontend), 4002 (Backend), 4003 (Database Admin)
