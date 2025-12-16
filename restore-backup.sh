#!/bin/bash

# Cloud4India Code Restore Script
# Usage: ./restore-backup.sh <backup_name>

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/root/cloud4india"
BACKUP_DIR="/root/cloud4india-backups"

if [ -z "$1" ]; then
    echo -e "${RED}❌ Error: Backup name is required${NC}"
    echo -e "${YELLOW}Usage: ./restore-backup.sh <backup_name>${NC}"
    echo ""
    echo -e "${BLUE}Available backups:${NC}"
    ls -1 "${BACKUP_DIR}" 2>/dev/null | sed 's/^/  - /' || echo "  No backups found"
    exit 1
fi

BACKUP_NAME="$1"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

if [ ! -d "${BACKUP_PATH}" ]; then
    echo -e "${RED}❌ Error: Backup '${BACKUP_NAME}' not found${NC}"
    echo -e "${YELLOW}Available backups:${NC}"
    ls -1 "${BACKUP_DIR}" 2>/dev/null | sed 's/^/  - /' || echo "  No backups found"
    exit 1
fi

echo -e "${YELLOW}⚠️  WARNING: This will restore code from backup '${BACKUP_NAME}'${NC}"
echo -e "${YELLOW}⚠️  This will overwrite your current code!${NC}"
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${BLUE}Restore cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}🔄 Restoring backup...${NC}"

# First, create a backup of current state
echo -e "${YELLOW}📦 Creating safety backup of current code...${NC}"
./backup-code.sh > /dev/null 2>&1 || echo "Warning: Could not create safety backup"

# Stop Docker containers if running
echo -e "${YELLOW}🛑 Stopping Docker containers...${NC}"
cd "${PROJECT_DIR}"
docker-compose down 2>/dev/null || echo "No containers to stop"

# Remove node_modules and dist to ensure clean restore
echo -e "${YELLOW}🧹 Cleaning build artifacts...${NC}"
rm -rf "${PROJECT_DIR}/node_modules" "${PROJECT_DIR}/dist" 2>/dev/null || true

# Restore files
echo -e "${BLUE}📥 Restoring files from backup...${NC}"
rsync -av --delete \
  --exclude 'node_modules' \
  --exclude 'dist' \
  --exclude '.git' \
  --exclude 'cloud4india-backups' \
  "${BACKUP_PATH}/" "${PROJECT_DIR}/"

echo -e "${GREEN}✅ Backup restored successfully!${NC}"
echo ""
echo -e "${BLUE}💡 Next steps:${NC}"
echo -e "   1. Install dependencies: npm install"
echo -e "   2. Rebuild Docker: docker-compose up --build -d"


