# Cloud4India Docker Deployment - Complete Setup

## 🎯 Overview

Your Cloud4India application has been successfully configured for Docker deployment with the following specifications:

- **Frontend (React)**: External Port 4001
- **CMS Backend (Node.js/Express)**: External Port 4002  
- **Database (SQLite)**: Embedded in CMS container
- **Server IP**: 161.97.155.89

## 🚀 Quick Deployment Commands

### For Local Development:
```bash
# Option 1: Use the comprehensive deployment script
./deploy.sh local

# Option 2: Use Docker Compose directly
docker-compose -f docker-compose.local.yml up --build -d

# Option 3: Use npm scripts
npm run deploy:local
```

### For Production Server (161.97.155.89):
```bash
# Option 1: Use the comprehensive deployment script
./deploy.sh server

# Option 2: Use Docker Compose directly
docker-compose up --build -d

# Option 3: Use npm scripts
npm run deploy:server
```

### For Windows Users:
```cmd
# Local deployment
scripts\deploy-local.bat

# Server deployment  
scripts\deploy-server.bat
```

## 📁 Key Files Created/Modified

### Docker Configuration:
- `Dockerfile.frontend` - React app containerization
- `Dockerfile.cms` - CMS backend containerization
- `docker-compose.yml` - Production deployment
- `docker-compose.local.yml` - Local development deployment

### Environment Configuration:
- `env.local` - Local environment variables
- `env.production` - Production environment variables
- `src/utils/config.js` - Updated with Docker-compatible URLs
- `src/services/cmsApi.js` - Updated API configuration

### Deployment Scripts:
- `deploy.sh` - Comprehensive deployment script (Linux/Mac)
- `scripts/deploy-local.sh` - Local deployment (Linux/Mac)
- `scripts/deploy-server.sh` - Server deployment (Linux/Mac)
- `scripts/deploy-local.bat` - Local deployment (Windows)
- `scripts/deploy-server.bat` - Server deployment (Windows)
- `scripts/verify-deployment.sh` - Deployment verification (Linux/Mac)
- `scripts/verify-deployment.bat` - Deployment verification (Windows)

### Configuration Updates:
- `nginx.conf` - Enhanced with performance and security settings
- `package.json` - Added Docker deployment scripts
- `cloud4india-cms/server.js` - Updated for Docker compatibility

### Documentation:
- `DOCKER_DEPLOYMENT_GUIDE.md` - Comprehensive deployment guide
- `DEPLOYMENT_SUMMARY.md` - This summary document

## 🌐 Access URLs

### Local Development:
- **Frontend**: http://localhost:4001
- **CMS API**: http://localhost:4002/api
- **Health Check**: http://localhost:4002/api/health
- **Admin Panel**: http://localhost:4001/admin

### Production Server:
- **Frontend**: http://161.97.155.89:4001
- **CMS API**: http://161.97.155.89:4002/api
- **Health Check**: http://161.97.155.89:4002/api/health
- **Admin Panel**: http://161.97.155.89:4001/admin

## 🔧 Management Commands

### Container Management:
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f
docker-compose logs -f cloud4india-frontend
docker-compose logs -f cloud4india-cms

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build -d
```

### Health Checks:
```bash
# Check CMS health
curl http://localhost:4002/api/health

# Check frontend
curl http://localhost:4001

# Run verification script
./scripts/verify-deployment.sh
```

### Database Management:
```bash
# Access SQLite database
docker-compose exec cloud4india-cms sqlite3 /app/data/cms.db

# Backup database
docker-compose exec cloud4india-cms cp /app/data/cms.db /app/data/cms_backup_$(date +%Y%m%d).db

# View database tables
docker-compose exec cloud4india-cms sqlite3 /app/data/cms.db ".tables"
```

## 🔥 Server Firewall Configuration

If deploying on your Contabo server, ensure these ports are open:

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

## 🛠️ Troubleshooting

### Common Issues:

1. **Port conflicts**: Check if ports 4001/4002 are already in use
2. **Permission issues**: Ensure the `data` directory has correct permissions
3. **Memory issues**: Ensure at least 2GB RAM is available
4. **Network issues**: Check firewall settings and Docker network configuration

### Debug Commands:
```bash
# Check port usage
netstat -tulpn | grep :4001
netstat -tulpn | grep :4002

# Check Docker logs
docker-compose logs cloud4india-cms
docker-compose logs cloud4india-frontend

# Check container status
docker-compose ps
docker stats
```

## 📊 API Endpoints

### CMS API:
- `GET /api/health` - Health check
- `GET /api/homepage` - Homepage content
- `GET /api/products` - Products data
- `GET /api/solutions` - Solutions data
- `GET /api/admin/*` - Admin panel APIs

### Frontend Routes:
- `/` - Homepage
- `/products/*` - Product pages
- `/solutions/*` - Solution pages
- `/admin` - Admin panel

## 🔒 Security Features

- **Nginx Security Headers**: X-Frame-Options, X-Content-Type-Options, CSP
- **Gzip Compression**: Enabled for better performance
- **Docker Network Isolation**: Services communicate through dedicated network
- **Health Checks**: Automated container health monitoring
- **Resource Limits**: Configurable CPU and memory limits

## 📈 Performance Optimizations

- **Multi-stage Docker builds**: Smaller production images
- **Nginx caching**: Static asset caching with appropriate headers
- **Gzip compression**: Reduced bandwidth usage
- **Keep-alive connections**: Better connection reuse
- **Optimized Docker layers**: Faster builds and deployments

## 🎉 Success!

Your Cloud4India application is now fully containerized and ready for deployment! The setup supports:

✅ **Local development** with hot reloading  
✅ **Production deployment** on your Contabo server  
✅ **External port access** (4001 for frontend, 4002 for CMS)  
✅ **SQLite database** with persistent storage  
✅ **Health monitoring** and verification scripts  
✅ **Cross-platform support** (Linux, Mac, Windows)  
✅ **Comprehensive documentation** and troubleshooting guides  

To get started, simply run:
```bash
./deploy.sh server  # For production deployment
# OR
./deploy.sh local   # For local development
```

Your application will be accessible at:
- **Frontend**: http://161.97.155.89:4001
- **CMS API**: http://161.97.155.89:4002/api
