# Code Backup System Guide

This local backup system ensures your code is safely backed up before Docker rebuilds, without depending on GitHub.

## 📁 Backup Location

All backups are stored in: `/root/cloud4india-backups/`

Each backup is a timestamped directory containing a complete snapshot of your codebase.

## 🚀 Quick Start

### Option 1: Rebuild Docker with Automatic Backup (Recommended)

```bash
./rebuild-with-backup.sh
```

This script will:
1. ✅ Automatically create a backup of your current code
2. ✅ Stop Docker containers
3. ✅ Rebuild and start containers
4. ✅ Show container status

**This is the safest way to rebuild Docker!**

### Option 2: Manual Backup

```bash
# Create a backup manually
./backup-code.sh

# Then rebuild Docker normally
docker-compose up --build -d
```

## 📋 Available Commands

### 1. Create Backup
```bash
./backup-code.sh
```
Creates a timestamped backup in `/root/cloud4india-backups/`

### 2. List Backups
```bash
./list-backups.sh
```
Shows all available backups with details (date, size, info)

### 3. Restore Backup
```bash
./restore-backup.sh <backup_name>
```
Example:
```bash
./restore-backup.sh cloud4india_backup_20250113_143022
```

**Note:** Before restoring, it will:
- Ask for confirmation
- Create a safety backup of your current code
- Stop Docker containers
- Restore the backup

### 4. Rebuild with Backup
```bash
./rebuild-with-backup.sh
```
Automatically backs up before rebuilding Docker

## 🔄 Workflow Example

### Making Changes Safely

1. **Before making changes:**
   ```bash
   ./backup-code.sh
   ```

2. **Make your changes to the code**

3. **If something goes wrong, restore:**
   ```bash
   ./list-backups.sh  # Find the backup name
   ./restore-backup.sh cloud4india_backup_20250113_143022
   ```

4. **Rebuild Docker safely:**
   ```bash
   ./rebuild-with-backup.sh
   ```

## 💾 What Gets Backed Up

- ✅ All source code (`src/`, `public/`, etc.)
- ✅ Configuration files (Dockerfile, docker-compose.yml, etc.)
- ✅ Package files (package.json, package-lock.json)
- ✅ Scripts and documentation
- ✅ CMS files and database

### What's Excluded (to save space)

- ❌ `node_modules/` (will be reinstalled)
- ❌ `dist/` (build output, will be rebuilt)
- ❌ `.git/` (version control, not needed)
- ❌ Log files
- ❌ Build cache

## 🛠️ Maintenance

### View Backup Storage Usage
```bash
du -sh /root/cloud4india-backups/
```

### Clean Old Backups (Manual)
```bash
# List backups by date
ls -lt /root/cloud4india-backups/

# Remove old backup (example)
rm -rf /root/cloud4india-backups/cloud4india_backup_20250110_120000
```

### Recommended: Keep Last 5-10 Backups

You can manually delete older backups to save disk space.

## ⚠️ Important Notes

1. **Backups are stored locally** - They don't depend on GitHub
2. **Each backup is independent** - You can restore any backup anytime
3. **Backups exclude build artifacts** - `node_modules` and `dist` are excluded to save space
4. **Database is included** - The CMS database (`cloud4india-cms/cms.db`) is backed up

## 🔐 Safety Features

- Before restoring, a safety backup of current code is created
- Confirmation required before restore
- Docker containers are stopped before restore
- Backup info file contains git status at backup time

## 📞 Troubleshooting

### Backup fails?
- Check disk space: `df -h`
- Check permissions: `ls -la backup-code.sh`

### Restore fails?
- Make sure backup exists: `ls /root/cloud4india-backups/`
- Check backup name matches exactly
- Ensure you have write permissions in project directory

### Can't find backups?
- Check backup directory exists: `ls -la /root/cloud4india-backups/`
- Run `./list-backups.sh` to see all available backups


