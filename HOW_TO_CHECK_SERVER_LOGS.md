# How to Check Server Console Logs

## Your Server Status
- **Process ID**: 107597
- **Running**: nodemon server.js
- **Location**: /root/cloud4india/cloud4india-cms
- **Terminal**: pts/0 (a terminal session)

## Method 1: Find the Terminal Window (Easiest)

The server is running in a terminal session. Look for:
- A terminal/console window that's open
- It should show output like:
  ```
  🚀 Cloud4India CMS Server running on http://localhost:4002
  📊 Admin API available at http://localhost:4002/api/homepage
  ```

**If you can't find it:**
- The terminal might be minimized or in another workspace
- Check all your open terminal windows/tabs

## Method 2: Check if Logs are Saved to a File

Some servers save logs to files. Check:

```bash
cd /root/cloud4india/cloud4india-cms
ls -la *.log 2>/dev/null || echo "No log files found"
```

## Method 3: Restart Server in Visible Terminal (Recommended)

If you can't find the original terminal, restart the server in a new terminal:

1. **Stop the current server:**
   ```bash
   cd /root/cloud4india/cloud4india-cms
   pkill -f "nodemon server.js"
   ```

2. **Start it in a new terminal window:**
   ```bash
   cd /root/cloud4india/cloud4india-cms
   nodemon server.js
   ```

   OR if you don't have nodemon:
   ```bash
   cd /root/cloud4india/cloud4india-cms
   node server.js
   ```

3. **Keep this terminal window open** - you'll see all the logs here!

## Method 4: View Logs via System Logs (if available)

```bash
# Check system logs (if server logs are there)
journalctl -u cloud4india-cms -f 2>/dev/null || echo "Not using systemd"
```

## What to Look For

When you update the description, you should see logs like:

```
📝 Description update: { original: 'Test Description Updateddddddddd', ... }
🔧 Backend UPDATE query: UPDATE integrity_pages SET description = ?, title = ?, ...
🔧 Backend UPDATE values: [ 'Test Description Updateddddddddd', 'Privacy Policyyy', ... ]
✅ Backend UPDATE successful: { changes: 1, ... }
🔍 Backend verified updated row: { description: 'Test Description Updateddddddddd', ... }
```

If you see a mismatch warning:
```
⚠️ WARNING: Description mismatch after update!
```

That means the UPDATE ran but the database didn't actually update.

## Quick Test

To test if you can see logs, try updating the description in admin panel and watch the terminal where the server is running. You should see the log messages appear in real-time.

