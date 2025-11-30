#!/bin/bash

# Quick deployment status check script
SERVER_IP="149.13.60.6"
SERVER_USER="root"

echo "🔍 Checking deployment status on $SERVER_IP..."
echo ""

# Check if Docker containers are running
echo "📦 Docker Containers:"
ssh $SERVER_USER@$SERVER_IP "cd /opt/cloud4india && docker-compose ps 2>/dev/null || echo 'Services not running yet or docker-compose not found'" 2>/dev/null || echo "Cannot connect to server"

echo ""
echo "🌐 Service Health Checks:"
echo -n "  Frontend (http://$SERVER_IP): "
curl -f -s -m 5 "http://$SERVER_IP" > /dev/null 2>&1 && echo "✅ Online" || echo "❌ Offline"

echo -n "  Backend API (http://$SERVER_IP:4002/api/health): "
curl -f -s -m 5 "http://$SERVER_IP:4002/api/health" > /dev/null 2>&1 && echo "✅ Online" || echo "❌ Offline"

echo -n "  DB Admin (http://$SERVER_IP:4003): "
curl -f -s -m 5 "http://$SERVER_IP:4003" > /dev/null 2>&1 && echo "✅ Online" || echo "❌ Offline"

echo ""
echo "💡 To view logs: ssh $SERVER_USER@$SERVER_IP 'cd /opt/cloud4india && docker-compose logs -f'"




