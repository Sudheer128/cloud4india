#!/bin/bash

# Cloud4India Code Backup Script
# This script creates a timestamped backup of your entire codebase

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
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="cloud4india_backup_${TIMESTAMP}"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"

echo -e "${BLUE}🔄 Creating code backup...${NC}"
echo -e "${BLUE}Backup Name: ${BACKUP_NAME}${NC}"
echo ""

# Create backup directory if it doesn't exist
mkdir -p "${BACKUP_DIR}"

# Create the backup
echo -e "${YELLOW}📦 Backing up codebase...${NC}"

cd "${PROJECT_DIR}"

# Create backup directory
mkdir -p "${BACKUP_PATH}"

# Copy all project files except node_modules, dist, .git, and backup directories
rsync -av \
  --exclude 'node_modules' \
  --exclude 'dist' \
  --exclude '.git' \
  --exclude '*.log' \
  --exclude 'cloud4india-backups' \
  --exclude '.cache' \
  --exclude 'build' \
  --exclude '.next' \
  --exclude 'coverage' \
  . "${BACKUP_PATH}/"

# Create a backup info file
cat > "${BACKUP_PATH}/BACKUP_INFO.txt" << EOF
Backup Created: $(date)
Backup Name: ${BACKUP_NAME}
Project Directory: ${PROJECT_DIR}
Git Status:
$(cd "${PROJECT_DIR}" && git status --short 2>/dev/null || echo "Git not available")
EOF

echo -e "${GREEN}✅ Backup created successfully!${NC}"
echo -e "${GREEN}📍 Location: ${BACKUP_PATH}${NC}"
echo ""
echo -e "${BLUE}📊 Backup size:$(du -sh "${BACKUP_PATH}" | cut -f1)${NC}"
echo ""
echo -e "${BLUE}💡 To restore this backup, run:${NC}"
echo -e "   ./restore-backup.sh ${BACKUP_NAME}"


