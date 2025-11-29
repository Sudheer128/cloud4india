#!/bin/bash

# Quick deployment completion script
# Run this to complete the deployment from the server side

echo "🚀 Completing Cloud4India deployment..."
echo ""
echo "This will:"
echo "1. Copy database (if exists locally)"
echo "2. Deploy application with Docker Compose"
echo "3. Verify deployment"
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
fi

cd /root/cloud4india
./continue-deployment.sh



