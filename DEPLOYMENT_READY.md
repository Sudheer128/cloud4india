# ✅ Cloud4India - Ready for Deployment on Port 80

## 🎯 Configuration Summary

Your application is now configured to be accessible directly at **http://149.13.60.6** (no port number needed).

### Port Configuration:
- **Frontend**: Port 80 (http://149.13.60.6) ✅
- **Backend API**: Port 4002 (http://149.13.60.6:4002)
- **Database Admin**: Port 4003 (http://149.13.60.6:4003)

## ✅ All Changes Completed

1. ✅ **docker-compose.yml** - Frontend mapped to port 80
2. ✅ **src/utils/config.js** - BASE_URL set to http://149.13.60.6 (no port)
3. ✅ **config/production.env** - FRONTEND_PORT set to 80
4. ✅ **nginx.conf** - Server name updated to 149.13.60.6
5. ✅ **Deployment scripts** - Updated to use port 80
6. ✅ **Server script** - Added check to stop existing web servers on port 80

## 🚀 Quick Deployment

### Option 1: Automated Deployment (Recommended)

```bash
cd /root/cloud4india
./scripts/deploy-new-server.sh
```

### Option 2: Server-Side Deployment

**Step 1: Upload files**
```bash
cd /root/cloud4india
tar --exclude='node_modules' --exclude='.git' --exclude='dist' --exclude='*.log' \
    -czf cloud4india-deploy.tar.gz .
scp cloud4india-deploy.tar.gz root@149.13.60.6:/opt/
scp server-deploy.sh root@149.13.60.6:/opt/
rm cloud4india-deploy.tar.gz
```

**Step 2: Deploy on server**
```bash
ssh root@149.13.60.6
cd /opt
mkdir -p cloud4india && cd cloud4india
tar -xzf ../cloud4india-deploy.tar.gz
chmod +x server-deploy.sh
bash server-deploy.sh
```

## ⚠️ Important Notes

### Port 80 Requirements

The deployment script will automatically:
- ✅ Stop Apache if running
- ✅ Stop Nginx if running
- ✅ Kill any process using port 80
- ✅ Open port 80 in firewall

**Note**: If you have other web servers or applications using port 80, they will be stopped. The Docker container will use port 80 for the frontend.

### After Deployment

Once deployed, your application will be accessible at:
- **Frontend**: http://149.13.60.6 (main URL - no port needed)
- **Admin Panel**: http://149.13.60.6/admin
- **Backend API**: http://149.13.60.6:4002/api
- **Database Admin**: http://149.13.60.6:4003

## 🔍 Verification

After deployment, verify everything works:

```bash
# Test frontend (should return HTML)
curl http://149.13.60.6

# Test backend health
curl http://149.13.60.6:4002/api/health

# Check services on server
ssh root@149.13.60.6
cd /opt/cloud4india
docker-compose ps
docker-compose logs -f
```

## 🆘 Troubleshooting Port 80

If port 80 is still in use after deployment:

```bash
# Check what's using port 80
sudo lsof -i :80
sudo netstat -tulpn | grep :80

# Stop specific service
sudo systemctl stop apache2
sudo systemctl stop nginx

# Check Docker container
docker ps | grep cloud4india-website
docker logs cloud4india-website
```

## 📊 Service Management

```bash
# View all services
docker-compose ps

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Start services
docker-compose up -d
```

---

**Status**: ✅ Ready to Deploy
**Frontend URL**: http://149.13.60.6
**Server**: 149.13.60.6
**Deployment Date**: $(date)

