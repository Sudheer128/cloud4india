# 🚀 Cloud4India - New Server Deployment Guide

## Server Information
- **Server IP**: 149.13.60.6
- **Frontend Port**: 4001
- **Backend API Port**: 4002
- **Database Admin Port**: 4003

## ✅ Configuration Updates Completed

All configuration files have been updated with the new server IP (149.13.60.6):
- ✅ `docker-compose.yml` - Updated API URLs and Traefik labels
- ✅ `src/utils/config.js` - Updated production BASE_URL and OPENROUTER_SITE_URL
- ✅ `config/production.env` - Updated SERVER_IP and all API URLs

## 📋 Deployment Steps

### Option 1: Automated Deployment Script (Recommended)

1. **Ensure SSH access to the server:**
   ```bash
   ssh root@149.13.60.6
   ```

2. **From your local machine, run the deployment script:**
   ```bash
   cd /root/cloud4india
   ./scripts/deploy-new-server.sh
   ```

   The script will:
   - Check prerequisites
   - Test server connection
   - Setup server environment (Docker, Docker Compose)
   - Upload application files
   - Copy database (if available locally)
   - Deploy and start services

### Option 2: Manual Deployment

#### Step 1: Connect to Server

```bash
ssh root@149.13.60.6
```

#### Step 2: Install Docker & Docker Compose

```bash
# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
systemctl start docker
systemctl enable docker
rm get-docker.sh

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Verify installations
docker --version
docker-compose --version
```

#### Step 3: Configure Firewall

```bash
# Open required ports
ufw allow 4001/tcp
ufw allow 4002/tcp
ufw allow 4003/tcp
ufw allow 22/tcp
ufw --force enable

# Verify firewall status
ufw status
```

#### Step 4: Upload Application Files

**From your local machine:**

```bash
# Create a tarball of the application (excluding node_modules, .git, dist)
cd /root/cloud4india
tar --exclude='node_modules' \
    --exclude='.git' \
    --exclude='dist' \
    --exclude='*.log' \
    -czf cloud4india-deploy.tar.gz .

# Copy to server
scp cloud4india-deploy.tar.gz root@149.13.60.6:/opt/

# Clean up local tarball
rm cloud4india-deploy.tar.gz
```

**On the server:**

```bash
# Create project directory
mkdir -p /opt/cloud4india
cd /opt/cloud4india

# Extract application files
tar -xzf /opt/cloud4india-deploy.tar.gz
rm /opt/cloud4india-deploy.tar.gz

# Make scripts executable
chmod +x scripts/*.sh
```

#### Step 5: Deploy with Docker Compose

**On the server:**

```bash
cd /opt/cloud4india

# Stop any existing services
docker-compose down 2>/dev/null || true

# Build and start services
docker-compose up --build -d

# Wait for services to start
sleep 30

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

#### Step 6: Verify Deployment

```bash
# Test frontend
curl http://149.13.60.6:4001

# Test backend API
curl http://149.13.60.6:4002/api/health

# Test database admin
curl http://149.13.60.6:4003
```

## 🌐 Access Your Application

Once deployed, access your application at:

- **Frontend (Website)**: http://149.13.60.6:4001
- **Admin Panel**: http://149.13.60.6:4001/admin
- **Backend API**: http://149.13.60.6:4002/api
- **Database Admin (Adminer)**: http://149.13.60.6:4003

## 🔧 Management Commands

### View Logs
```bash
ssh root@149.13.60.6
cd /opt/cloud4india
docker-compose logs -f                    # All services
docker-compose logs -f cloud4india-web    # Frontend only
docker-compose logs -f cloud4india-cms    # Backend only
```

### Check Service Status
```bash
ssh root@149.13.60.6
cd /opt/cloud4india
docker-compose ps
```

### Restart Services
```bash
ssh root@149.13.60.6
cd /opt/cloud4india
docker-compose restart
```

### Stop Services
```bash
ssh root@149.13.60.6
cd /opt/cloud4india
docker-compose down
```

### Start Services
```bash
ssh root@149.13.60.6
cd /opt/cloud4india
docker-compose up -d
```

### Update Application

```bash
# On server
cd /opt/cloud4india
docker-compose down
docker-compose up --build -d
```

## 🚨 Troubleshooting

### Services Won't Start

1. **Check logs:**
   ```bash
   docker-compose logs
   ```

2. **Check disk space:**
   ```bash
   df -h
   ```

3. **Check memory:**
   ```bash
   free -h
   ```

4. **Check if ports are in use:**
   ```bash
   netstat -tulpn | grep -E '4001|4002|4003'
   ```

### Port Already in Use

```bash
# Find process using the port
lsof -i :4001  # or 4002, 4003

# Kill the process if needed
kill -9 <PID>
```

### Database Issues

```bash
# Check database file
ls -lh /opt/cloud4india/cloud4india-cms/cms.db

# Check database permissions
docker exec cloud4india-cms ls -la /app/data/cms.db
```

### Permission Issues

```bash
# Fix file permissions
chown -R root:root /opt/cloud4india
chmod -R 755 /opt/cloud4india
```

### Firewall Issues

```bash
# Check firewall status
ufw status

# Open ports
ufw allow 4001/tcp
ufw allow 4002/tcp
ufw allow 4003/tcp

# Reload firewall
ufw reload
```

## 📊 Monitoring

### Resource Usage
```bash
# Docker stats
docker stats

# System monitoring
htop
```

### Service Health Checks
```bash
# Frontend
curl -f http://149.13.60.6:4001 || echo "Frontend down"

# Backend
curl -f http://149.13.60.6:4002/api/health || echo "Backend down"

# Database
docker exec cloud4india-cms sqlite3 /app/data/cms.db "SELECT 1;" || echo "Database issue"
```

## 🔄 Quick Deployment Script Usage

The deployment script (`scripts/deploy-new-server.sh`) supports multiple commands:

```bash
# Full deployment
./scripts/deploy-new-server.sh deploy

# Verify deployment
./scripts/deploy-new-server.sh verify

# View logs
./scripts/deploy-new-server.sh logs

# Check status
./scripts/deploy-new-server.sh status

# Restart services
./scripts/deploy-new-server.sh restart

# Stop services
./scripts/deploy-new-server.sh stop

# Start services
./scripts/deploy-new-server.sh start
```

## ✅ Deployment Checklist

- [ ] Server IP: 149.13.60.6 accessible
- [ ] Docker installed on server
- [ ] Docker Compose installed on server
- [ ] Firewall ports 4001, 4002, 4003 opened
- [ ] Application files uploaded to server
- [ ] Database file copied (if needed)
- [ ] Docker Compose services started
- [ ] Frontend accessible at http://149.13.60.6:4001
- [ ] Backend API accessible at http://149.13.60.6:4002/api/health
- [ ] Database admin accessible at http://149.13.60.6:4003

## 📞 Support

If you encounter issues:

1. Check the logs: `docker-compose logs -f`
2. Verify network connectivity
3. Check system resources (disk, memory)
4. Review firewall settings
5. Check service status: `docker-compose ps`

---

**Deployment Date**: $(date)
**Server**: 149.13.60.6
**Application**: Cloud4India
**Ports**: 4001 (Frontend), 4002 (Backend), 4003 (Database Admin)

