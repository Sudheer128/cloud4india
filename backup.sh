#!/bin/bash

#############################################
# Cloud4India Automatic Backup Script
# Runs daily at 11:45 PM
# Creates full backup of entire codebase
# Keeps only last 3 days, deletes older backups
#############################################

# Configuration
SOURCE_DIR="/root/cloud4india"
BACKUP_DIR="/root/cloud4india/backups"
DATE=$(date +"%d%b%Y")  # Format: 28Dec2025
BACKUP_FILE="backup_${DATE}.zip"
LOG_FILE="${BACKUP_DIR}/backup.log"
RETENTION_DAYS=3  # Keep backups for 3 days only

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# Log start
echo "========================================" >> "${LOG_FILE}"
echo "[$(date '+%Y-%m-%d %H:%M:%S')] Backup started" >> "${LOG_FILE}"
echo "Backup file: ${BACKUP_FILE}" >> "${LOG_FILE}"

# Create backup (exclude the backups folder itself to avoid recursion)
cd /root
zip -r "${BACKUP_DIR}/${BACKUP_FILE}" cloud4india \
  -x "cloud4india/backups/*" \
  >> "${LOG_FILE}" 2>&1

# Check if backup was successful
if [ $? -eq 0 ]; then
  BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_FILE}" | cut -f1)
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ✅ Backup completed successfully" >> "${LOG_FILE}"
  echo "Backup size: ${BACKUP_SIZE}" >> "${LOG_FILE}"
  echo "Location: ${BACKUP_DIR}/${BACKUP_FILE}" >> "${LOG_FILE}"
  
  # Delete backups older than RETENTION_DAYS
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] 🗑️  Checking for old backups to delete..." >> "${LOG_FILE}"
  DELETED_COUNT=0
  
  # Find and delete backup files older than RETENTION_DAYS
  find "${BACKUP_DIR}" -name "backup_*.zip" -type f -mtime +${RETENTION_DAYS} | while read OLD_BACKUP; do
    BACKUP_NAME=$(basename "$OLD_BACKUP")
    OLD_SIZE=$(du -h "$OLD_BACKUP" | cut -f1)
    rm -f "$OLD_BACKUP"
    echo "   Deleted: ${BACKUP_NAME} (${OLD_SIZE})" >> "${LOG_FILE}"
    DELETED_COUNT=$((DELETED_COUNT + 1))
  done
  
  # Count remaining backups
  REMAINING_BACKUPS=$(find "${BACKUP_DIR}" -name "backup_*.zip" -type f | wc -l)
  echo "Backups retained: ${REMAINING_BACKUPS} (last ${RETENTION_DAYS} days)" >> "${LOG_FILE}"
  
else
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] ❌ Backup failed!" >> "${LOG_FILE}"
fi

echo "========================================" >> "${LOG_FILE}"
echo "" >> "${LOG_FILE}"

# Optional: Send notification (uncomment if needed)
# echo "Backup completed: ${BACKUP_FILE} (${BACKUP_SIZE})" | mail -s "Cloud4India Backup Status" admin@example.com

