#!/bin/bash

# Deploy About Us CMS updates to server
# This will upload updated files and rebuild the frontend container

set -e

SERVER_IP="149.13.60.6"
SERVER_USER="root"
PROJECT_DIR="/opt/cloud4india"

echo "🚀 Deploying About Us CMS updates to server..."

# Upload updated files
echo "📤 Uploading updated files..."

# Upload all updated component files
scp src/components/AboutHeroSection.jsx $SERVER_USER@$SERVER_IP:$PROJECT_DIR/src/components/
scp src/components/OurStorySection.jsx $SERVER_USER@$SERVER_IP:$PROJECT_DIR/src/components/
scp src/components/OurLegacySection.jsx $SERVER_USER@$SERVER_IP:$PROJECT_DIR/src/components/
scp src/components/TestimonialsSection.jsx $SERVER_USER@$SERVER_IP:$PROJECT_DIR/src/components/
scp src/components/OurApproachSection.jsx $SERVER_USER@$SERVER_IP:$PROJECT_DIR/src/components/

# Upload admin panel
scp src/pages/AboutUsAdmin.jsx $SERVER_USER@$SERVER_IP:$PROJECT_DIR/src/pages/

# Upload API service
scp src/services/cmsApi.js $SERVER_USER@$SERVER_IP:$PROJECT_DIR/src/services/

# Upload App.jsx and AdminSidebar.jsx
scp src/App.jsx $SERVER_USER@$SERVER_IP:$PROJECT_DIR/src/
scp src/components/AdminSidebar.jsx $SERVER_USER@$SERVER_IP:$PROJECT_DIR/src/components/

echo "✅ Files uploaded successfully"
echo ""
echo "🔨 Now rebuilding frontend container on server..."
echo "   (You may need to SSH and run: cd /opt/cloud4india && docker-compose build cloud4india-web && docker-compose up -d cloud4india-web)"




