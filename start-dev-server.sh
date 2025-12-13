#!/bin/bash

# Development Server Starter - Auto-refresh on changes
# This runs both frontend and backend in development mode

echo "========================================"
echo "Starting Cloud4India Development Mode"
echo "========================================"
echo ""
echo "This will:"
echo "  - Frontend: Auto-refresh on file changes (Vite HMR)"
echo "  - Backend: Auto-restart on file changes (nodemon)"
echo "  - Database: Uses existing MySQL container"
echo ""

# Check if nodemon is installed
if ! command -v nodemon &> /dev/null; then
    echo "Installing nodemon for auto-restart..."
    cd /root/cloud4india/cloud4india-cms
    npm install -g nodemon
fi

# Kill any existing dev servers
echo "Stopping any existing dev servers..."
pkill -f "vite" || true
pkill -f "nodemon.*server.js" || true
sleep 2

echo ""
echo "========================================"
echo "Starting Backend (CMS) with auto-restart"
echo "========================================"
cd /root/cloud4india/cloud4india-cms
nodemon server.js &
BACKEND_PID=$!
echo "✓ Backend started (PID: $BACKEND_PID)"
echo "  URL: http://149.13.60.6:4002"
echo "  Changes to cloud4india-cms/* will auto-restart"
echo ""

sleep 3

echo "========================================"
echo "Starting Frontend with hot-reload"
echo "========================================"
cd /root/cloud4india
npm run dev -- --host 0.0.0.0 --port 3000 &
FRONTEND_PID=$!
echo "✓ Frontend started (PID: $FRONTEND_PID)"
echo "  URL: http://149.13.60.6:3000"
echo "  Changes to src/* will auto-refresh in browser"
echo ""

echo "========================================"
echo "✅ Development servers running!"
echo "========================================"
echo ""
echo "Access your application:"
echo "  Frontend: http://149.13.60.6:3000"
echo "  Backend:  http://149.13.60.6:4002"
echo "  Admin:    http://149.13.60.6:3000/admin/products-new/74"
echo ""
echo "Features:"
echo "  ✓ Frontend auto-refreshes on save (Vite HMR)"
echo "  ✓ Backend auto-restarts on save (nodemon)"
echo "  ✓ No Docker rebuild needed"
echo "  ✓ Instant feedback on changes"
echo ""
echo "To stop servers:"
echo "  Press Ctrl+C or run: pkill -f 'vite|nodemon'"
echo ""
echo "Logs will appear below..."
echo "========================================"
echo ""

# Wait for both processes
wait

