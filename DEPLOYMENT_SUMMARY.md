# ✅ Cloud4India Deployment Preparation - Complete

## 📋 Summary

All configuration files have been updated for the new server **149.13.60.6** and deployment scripts have been created. The application is ready to be deployed.

## ✅ Completed Tasks

1. ✅ Updated `docker-compose.yml` with new server IP (149.13.60.6)
2. ✅ Updated `src/utils/config.js` with new server IP for production
3. ✅ Updated `config/production.env` with new server IP
4. ✅ Created automated deployment script (`scripts/deploy-new-server.sh`)
5. ✅ Created server-side deployment script (`server-deploy.sh`)
6. ✅ Created comprehensive deployment guide (`NEW_SERVER_DEPLOYMENT.md`)

## 🚀 Quick Deployment (Choose One Method)

### Method 1: Automated Deployment (From Local Machine)

**Prerequisites:**
- SSH access to server 149.13.60.6
- SSH key configured OR password access

**Steps:**
```bash
cd /root/cloud4india
./scripts/deploy-new-server.sh
```

This script will:
- Test server connection
- Install Docker & Docker Compose (if needed)
- Configure firewall
- Upload application files
- Deploy and start services
- Verify deployment

### Method 2: Manual Upload & Server-Side Deployment

**Step 1: Upload files to server**

From your local machine:
```bash
cd /root/cloud4india
tar --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='*.log' \
    -czf cloud4india-deploy.tar.gz .

# Upload to server
scp cloud4india-deploy.tar.gz root@149.13.60.6:/opt/
scp server-deploy.sh root@149.13.60.6:/opt/

# Clean up
rm cloud4india-deploy.tar.gz
```

**Step 2: Deploy on server**

SSH into the server:
```bash
ssh root@149.13.60.6
cd /opt
mkdir -p cloud4india
cd cloud4india
tar -xzf ../cloud4india-deploy.tar.gz
chmod +x server-deploy.sh ../server-deploy.sh
bash server-deploy.sh
```

### Method 3: Git Clone & Deploy (If Using Git)

```bash
ssh root@149.13.60.6
cd /opt
git clone <your-repo-url> cloud4india
cd cloud4india
chmod +x server-deploy.sh
bash server-deploy.sh
```

## 📝 Configuration Changes Made

### 1. docker-compose.yml
- Updated `VITE_API_URL` to `http://149.13.60.6:4002`
- Updated `VITE_CMS_URL` to `http://149.13.60.6:4002`
- Updated Traefik host label to `149.13.60.6`

### 2. src/utils/config.js
- Updated `BASE_URL` to `http://149.13.60.6:4001`
- Updated `OPENROUTER_SITE_URL` to `http://149.13.60.6:4001`

### 3. config/production.env
- Updated `SERVER_IP` to `149.13.60.6`
- Updated all API URLs to use new server IP

## 🌐 Access URLs (After Deployment)

- **Frontend**: http://149.13.60.6:4001
- **Admin Panel**: http://149.13.60.6:4001/admin
- **Backend API**: http://149.13.60.6:4002/api
- **Database Admin**: http://149.13.60.6:4003

## 🔧 Server Requirements

- Ubuntu/Debian Linux server
- Minimum 2GB RAM
- Minimum 20GB disk space
- Ports 4001, 4002, 4003 available
- Root or sudo access

## 📚 Additional Documentation

- **Full Deployment Guide**: `NEW_SERVER_DEPLOYMENT.md`
- **Server-Side Script**: `server-deploy.sh`
- **Automated Script**: `scripts/deploy-new-server.sh`

## 🚨 Important Notes

1. **SSH Access Required**: You need SSH access to the server (149.13.60.6) to deploy
2. **Firewall**: The deployment script will configure firewall to open required ports
3. **Docker**: Docker and Docker Compose will be installed automatically if not present
4. **Database**: If you have a local database file (`cloud4india-cms/cms.db`), it will be copied automatically
5. **Time**: Initial deployment may take 5-10 minutes (Docker image builds)

## 🔍 Verification After Deployment

After deployment, verify:

```bash
# Check services are running
curl http://149.13.60.6:4001
curl http://149.13.60.6:4002/api/health
curl http://149.13.60.6:4003

# Or SSH and check
ssh root@149.13.60.6
cd /opt/cloud4india
docker-compose ps
docker-compose logs -f
```

## 🆘 Troubleshooting

If deployment fails:

1. **Check SSH access**: `ssh root@149.13.60.6`
2. **Check disk space**: `df -h`
3. **Check memory**: `free -h`
4. **Check ports**: `netstat -tulpn | grep -E '4001|4002|4003'`
5. **View logs**: `docker-compose logs -f`

For detailed troubleshooting, see `NEW_SERVER_DEPLOYMENT.md`

## ✅ Next Steps

1. **Ensure SSH access** to server 149.13.60.6
2. **Choose deployment method** (automated or manual)
3. **Run deployment script**
4. **Verify deployment** using the access URLs
5. **Test the application** in browser

---

**Status**: ✅ Ready for Deployment
**Server**: 149.13.60.6
**Prepared Date**: $(date)

