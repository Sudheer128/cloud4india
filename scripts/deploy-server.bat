@echo off
REM Cloud4India Server Docker Deployment Script for Windows

echo 🚀 Starting Cloud4India Server Deployment...

REM Configuration
set SERVER_IP=161.97.155.89
set FRONTEND_PORT=4001
set CMS_PORT=4002

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose and try again.
    exit /b 1
)

REM Create data directory for SQLite database
echo 📁 Creating data directory...
if not exist "data" mkdir data

REM Stop any existing containers
echo 🛑 Stopping existing containers...
docker-compose down --remove-orphans

REM Build and start containers
echo 🔨 Building and starting containers...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 15 /nobreak >nul

REM Check if CMS is healthy
echo 🏥 Checking CMS health...
for /L %%i in (1,1,30) do (
    curl -f http://localhost:%CMS_PORT%/api/health >nul 2>&1
    if not errorlevel 1 (
        echo ✅ CMS is healthy!
        goto :frontend_check
    )
    if %%i==30 (
        echo ❌ CMS health check failed after 30 attempts
        docker-compose logs cloud4india-cms
        exit /b 1
    )
    echo ⏳ Waiting for CMS... (attempt %%i/30)
    timeout /t 2 /nobreak >nul
)

:frontend_check
REM Check if Frontend is accessible
echo 🌐 Checking Frontend accessibility...
for /L %%i in (1,1,15) do (
    curl -f http://localhost:%FRONTEND_PORT% >nul 2>&1
    if not errorlevel 1 (
        echo ✅ Frontend is accessible!
        goto :external_check
    )
    if %%i==15 (
        echo ❌ Frontend accessibility check failed after 15 attempts
        docker-compose logs cloud4india-frontend
        exit /b 1
    )
    echo ⏳ Waiting for Frontend... (attempt %%i/15)
    timeout /t 2 /nobreak >nul
)

:external_check
REM Check external accessibility (if on server)
echo 🌍 Checking external accessibility...
curl -f http://%SERVER_IP%:%FRONTEND_PORT% >nul 2>&1
if not errorlevel 1 (
    echo ✅ External Frontend is accessible!
) else (
    echo ⚠️  External Frontend check failed - this might be normal if firewall rules are not configured
)

curl -f http://%SERVER_IP%:%CMS_PORT%/api/health >nul 2>&1
if not errorlevel 1 (
    echo ✅ External CMS is accessible!
) else (
    echo ⚠️  External CMS check failed - this might be normal if firewall rules are not configured
)

echo.
echo 🎉 Cloud4India Server Deployment Complete!
echo.
echo 🌐 External URLs:
echo 📱 Frontend: http://%SERVER_IP%:%FRONTEND_PORT%
echo 🔧 CMS API: http://%SERVER_IP%:%CMS_PORT%/api
echo ❤️  Health Check: http://%SERVER_IP%:%CMS_PORT%/api/health
echo.
echo 🏠 Local URLs (for server access):
echo 📱 Frontend: http://localhost:%FRONTEND_PORT%
echo 🔧 CMS API: http://localhost:%CMS_PORT%/api
echo.
echo 📊 Container Status:
docker-compose ps
echo.
echo 📝 To view logs: docker-compose logs -f
echo 🛑 To stop: docker-compose down
