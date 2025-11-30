#!/bin/bash

# Restart services without running migrations
# Since we already have the database with data

SERVER_IP="149.13.60.6"
SERVER_USER="root"
PROJECT_DIR="/opt/cloud4india"

echo "🔄 Restarting services with RUN_MIGRATIONS=false..."
echo "This will use your existing database without running migrations."

ssh $SERVER_USER@$SERVER_IP << 'EOF'
    cd /opt/cloud4india
    
    echo "Stopping existing services..."
    docker-compose down
    
    echo "Rebuilding and starting services..."
    docker-compose up --build -d
    
    echo "Waiting for services to start..."
    sleep 15
    
    echo "Service status:"
    docker-compose ps
    
    echo ""
    echo "✅ Services restarted. Migrations will be skipped."
EOF

echo ""
echo "🌐 Your application should be accessible at:"
echo "   Frontend: http://$SERVER_IP"
echo "   Backend:  http://$SERVER_IP:4002/api"
echo ""
echo "📊 Check logs: ssh $SERVER_USER@$SERVER_IP 'cd $PROJECT_DIR && docker-compose logs -f'"




