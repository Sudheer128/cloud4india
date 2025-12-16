#!/bin/bash

# Cloud4India List Backups Script
# Shows all available backups

# Colors for output
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BACKUP_DIR="/root/cloud4india-backups"

echo -e "${BLUE}📦 Available Backups:${NC}"
echo ""

if [ ! -d "${BACKUP_DIR}" ] || [ -z "$(ls -A ${BACKUP_DIR} 2>/dev/null)" ]; then
    echo -e "${YELLOW}No backups found${NC}"
    exit 0
fi

# List backups with details
for backup in "${BACKUP_DIR}"/*; do
    if [ -d "$backup" ]; then
        backup_name=$(basename "$backup")
        backup_date=$(stat -c %y "$backup" 2>/dev/null | cut -d' ' -f1,2 | cut -d'.' -f1)
        backup_size=$(du -sh "$backup" 2>/dev/null | cut -f1)
        
        echo -e "${GREEN}📁 ${backup_name}${NC}"
        echo -e "   Created: ${backup_date}"
        echo -e "   Size: ${backup_size}"
        
        # Show backup info if available
        if [ -f "${backup}/BACKUP_INFO.txt" ]; then
            echo -e "   ${BLUE}Info:${NC}"
            cat "${backup}/BACKUP_INFO.txt" | sed 's/^/      /'
        fi
        echo ""
    fi
done

echo -e "${BLUE}💡 To restore a backup:${NC}"
echo -e "   ./restore-backup.sh <backup_name>"


