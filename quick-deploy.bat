@echo off
REM Quick Deploy Cloud4India - One-Click Deployment

echo.
echo  ██████╗██╗      ██████╗ ██╗   ██╗██████╗ ██╗  ██╗██╗███╗   ██╗██████╗ ██╗ █████╗ 
echo ██╔════╝██║     ██╔═══██╗██║   ██║██╔══██╗██║  ██║██║████╗  ██║██╔══██╗██║██╔══██╗
echo ██║     ██║     ██║   ██║██║   ██║██║  ██║███████║██║██╔██╗ ██║██║  ██║██║███████║
echo ██║     ██║     ██║   ██║██║   ██║██║  ██║╚════██║██║██║╚██╗██║██║  ██║██║██╔══██║
echo ╚██████╗███████╗╚██████╔╝╚██████╔╝██████╔╝     ██║██║██║ ╚████║██████╔╝██║██║  ██║
echo  ╚═════╝╚══════╝ ╚═════╝  ╚═════╝ ╚═════╝      ╚═╝╚═╝╚═╝  ╚═══╝╚═════╝ ╚═╝╚═╝  ╚═╝
echo.
echo 🚀 Quick Deploy Script - Production Ready!
echo.

echo [1] Deploy to Production (161.97.155.89:3004)
echo [2] Start Local Development (localhost:3001)
echo [3] View Application Logs
echo [4] Stop Application
echo [5] Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo 🚀 Deploying to Production...
    call deploy.bat
) else if "%choice%"=="2" (
    echo 🛠️ Starting Local Development...
    call dev.bat
) else if "%choice%"=="3" (
    echo 📋 Viewing Application Logs...
    docker logs cloud4india-website -f
    pause
) else if "%choice%"=="4" (
    echo 🛑 Stopping Application...
    docker stop cloud4india-website
    docker rm cloud4india-website
    echo ✅ Application stopped successfully!
    pause
) else if "%choice%"=="5" (
    echo 👋 Goodbye!
    exit
) else (
    echo ❌ Invalid choice. Please try again.
    pause
    goto start
)

:start
cls
quick-deploy.bat
