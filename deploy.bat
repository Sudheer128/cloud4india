@echo off
REM Cloud4India Windows Deployment Script

echo 🚀 Starting Cloud4India deployment...
echo.

REM Configuration
set APP_NAME=cloud4india-website
set CONTAINER_NAME=cloud4india-website
set PORT=3004
set SERVER_IP=161.97.155.89

echo 📋 Deployment Configuration:
echo   App Name: %APP_NAME%
echo   Container: %CONTAINER_NAME%
echo   Port: %PORT%
echo   Server IP: %SERVER_IP%
echo.

REM Step 1: Clean up existing containers
echo 🧹 Cleaning up existing containers...
docker stop %CONTAINER_NAME% 2>nul
docker rm %CONTAINER_NAME% 2>nul

REM Step 2: Remove old images
echo 🗑️ Removing old images...
docker rmi %APP_NAME%:latest 2>nul

REM Step 3: Build new image
echo 🔨 Building Docker image...
docker build -t %APP_NAME%:latest .

if %errorlevel% neq 0 (
    echo ❌ Build failed!
    pause
    exit /b 1
)

REM Step 4: Run the container
echo 🚀 Starting new container...
docker run -d --name %CONTAINER_NAME% --restart unless-stopped -p %PORT%:80 -e NODE_ENV=production %APP_NAME%:latest

if %errorlevel% neq 0 (
    echo ❌ Container start failed!
    pause
    exit /b 1
)

REM Step 5: Verify deployment
echo 🔍 Verifying deployment...
timeout /t 5 /nobreak >nul

docker ps | findstr %CONTAINER_NAME% >nul
if %errorlevel% equ 0 (
    echo ✅ Deployment successful!
    echo 🌐 Application is running at:
    echo   Local: http://localhost:%PORT%
    echo   Server: http://%SERVER_IP%:%PORT%
    echo.
    echo 📊 Container status:
    docker ps | findstr %CONTAINER_NAME%
) else (
    echo ❌ Deployment failed!
    echo 📋 Container logs:
    docker logs %CONTAINER_NAME%
    pause
    exit /b 1
)

echo.
echo 🎉 Cloud4India deployment completed successfully!
echo 💡 Useful commands:
echo   View logs: docker logs %CONTAINER_NAME%
echo   Stop app: docker stop %CONTAINER_NAME%
echo   Restart: docker restart %CONTAINER_NAME%
echo   Remove: docker stop %CONTAINER_NAME% ^&^& docker rm %CONTAINER_NAME%
echo.
pause
