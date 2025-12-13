# 🚀 Development Mode - Auto-Refresh Setup

## 🎯 What This Does

Instead of rebuilding Docker every time you make a change, you can run in **development mode** where:
- ✅ **Frontend changes** auto-refresh in browser instantly (Vite HMR)
- ✅ **Backend changes** auto-restart the server (nodemon)
- ✅ **No Docker rebuild** needed
- ✅ **Instant feedback** when you save files

## 📍 Quick Start

### Option 1: One Command (Recommended)
```bash
cd /root/cloud4india
./start-dev-server.sh
```

This starts both frontend and backend in development mode!

### Option 2: Manual Start

**Terminal 1 - Backend (CMS):**
```bash
cd /root/cloud4india/cloud4india-cms
nodemon server.js
```

**Terminal 2 - Frontend:**
```bash
cd /root/cloud4india
npm run dev -- --host 0.0.0.0 --port 3000
```

## 🌐 Access URLs

When running in dev mode:
- **Frontend:** http://149.13.60.6:3000
- **Backend API:** http://149.13.60.6:4002
- **Admin Panel:** http://149.13.60.6:3000/admin/products-new/74
- **GPU Compute Page:** http://149.13.60.6:3000/products/gpu-compute

## ✨ Features

### Frontend (Port 3000)
- **Hot Module Replacement (HMR)** - Changes appear instantly
- **No page refresh** needed for most changes
- **Fast development** - See changes in <1 second
- Watches: All files in `/src` folder

### Backend (Port 4002)
- **Auto-restart** on file changes
- **Watches:** `server.js` and all `.js` files
- **Delay:** 1 second after save before restart
- See restart messages in console

## 🔄 What Auto-Refreshes

| Change Type | Auto-Refresh | Notes |
|-------------|--------------|-------|
| Frontend React components | ✅ Instant | HMR updates without reload |
| Frontend styles (CSS) | ✅ Instant | Injected without reload |
| Frontend routing | ⚠️ Manual | Refresh browser page |
| Backend API endpoints | ✅ Auto-restart | Server restarts in ~1-2 sec |
| Backend server.js | ✅ Auto-restart | Server restarts in ~1-2 sec |
| Database changes | ❌ Manual | Run SQL/scripts separately |

## 🛑 Stopping Dev Servers

**Option 1:** Press `Ctrl+C` in the terminal

**Option 2:** Kill processes manually:
```bash
pkill -f 'vite|nodemon'
```

**Option 3:** Kill specific ports:
```bash
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:4002 | xargs kill -9  # Backend
```

## 🔧 Troubleshooting

### Port already in use?
```bash
# Check what's running
lsof -i:3000  # Frontend
lsof -i:4002  # Backend

# Kill and restart
pkill -f 'vite|nodemon'
./start-dev-server.sh
```

### Changes not reflecting?

**Frontend:**
- Hard refresh browser: `Ctrl+Shift+R` or `Cmd+Shift+R`
- Check terminal for errors
- Restart dev server

**Backend:**
- Check terminal for restart messages
- Look for syntax errors in console
- Restart nodemon

### Module not found errors?
```bash
cd /root/cloud4india
npm install

cd /root/cloud4india/cloud4india-cms
npm install
```

## 📊 Production vs Development

### Production (Docker):
- **URL:** http://149.13.60.6 (port 80)
- **Build required:** Yes
- **Performance:** Optimized
- **Use for:** Live site, testing final version

### Development (Local servers):
- **URL:** http://149.13.60.6:3000 (port 3000)
- **Build required:** No
- **Performance:** Fast development
- **Use for:** Active development, quick iterations

## 💡 Best Workflow

1. **Start dev servers:**
   ```bash
   ./start-dev-server.sh
   ```

2. **Make changes:**
   - Edit files in `/src` (frontend)
   - Edit `server.js` (backend)
   - Save files

3. **See changes instantly:**
   - Frontend: Browser auto-updates
   - Backend: Server auto-restarts

4. **When satisfied, deploy to production:**
   ```bash
   npm run build
   docker-compose up -d --build
   ```

## 🎯 Common Development Tasks

### Editing Admin Interface:
1. Start dev servers
2. Go to http://149.13.60.6:3000/admin/products-new/74
3. Edit files in `/src/components/ProductEditor/`
4. Save → Browser updates instantly

### Editing Product Pages:
1. Start dev servers
2. Go to http://149.13.60.6:3000/products/gpu-compute
3. Edit files in `/src/components/DynamicProductSection.jsx`
4. Save → Browser updates instantly

### Editing Backend API:
1. Start dev servers
2. Edit `/cloud4india-cms/server.js`
3. Save → Server restarts automatically (~1-2 sec)
4. Test API changes immediately

### Database Changes:
1. Run SQL scripts or migrations
2. Backend will use updated data automatically
3. Frontend will fetch new data

## ⚙️ Configuration Files

- **`nodemon.json`** - Backend auto-restart config
- **`vite.config.js`** - Frontend dev server config
- **`start-dev-server.sh`** - One-command starter

## 📝 Example Session

```bash
# Start development mode
cd /root/cloud4india
./start-dev-server.sh

# Output:
# ✓ Backend started on port 4002
# ✓ Frontend started on port 3000
# ✓ Auto-refresh enabled

# Now edit files and save
# Browser updates automatically!
# No Docker rebuild needed!
```

## 🎉 Benefits

✅ **10x faster development** - No build wait times  
✅ **Instant feedback** - See changes in <1 second  
✅ **Hot reload** - No manual browser refresh  
✅ **Backend auto-restart** - No manual server restart  
✅ **Work on server** - No need to develop locally  
✅ **Same environment** - Uses same database  

---

**Ready to start?** Run `./start-dev-server.sh` and enjoy instant auto-refresh! 🚀

