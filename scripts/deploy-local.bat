@echo off
REM Cloud4India Local Docker Deployment Script for Windows

echo 🚀 Starting Cloud4India Local Deployment...

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
docker-compose -f docker-compose.local.yml down --remove-orphans

REM Build and start containers
echo 🔨 Building and starting containers...
docker-compose -f docker-compose.local.yml up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check if CMS is healthy
echo 🏥 Checking CMS health...
for /L %%i in (1,1,30) do (
    curl -f http://localhost:4002/api/health >nul 2>&1
    if not errorlevel 1 (
        echo ✅ CMS is healthy!
        goto :frontend_check
    )
    if %%i==30 (
        echo ❌ CMS health check failed after 30 attempts
        docker-compose -f docker-compose.local.yml logs cloud4india-cms
        exit /b 1
    )
    echo ⏳ Waiting for CMS... (attempt %%i/30)
    timeout /t 2 /nobreak >nul
)

:frontend_check
REM Check if Frontend is accessible
echo 🌐 Checking Frontend accessibility...
for /L %%i in (1,1,15) do (
    curl -f http://localhost:4001 >nul 2>&1
    if not errorlevel 1 (
        echo ✅ Frontend is accessible!
        goto :success
    )
    if %%i==15 (
        echo ❌ Frontend accessibility check failed after 15 attempts
        docker-compose -f docker-compose.local.yml logs cloud4india-frontend
        exit /b 1
    )
    echo ⏳ Waiting for Frontend... (attempt %%i/15)
    timeout /t 2 /nobreak >nul
)

:success
echo.
echo 🎉 Cloud4India Local Deployment Complete!
echo.
echo 📱 Frontend: http://localhost:4001
echo 🔧 CMS API: http://localhost:4002/api
echo ❤️  Health Check: http://localhost:4002/api/health
echo.
echo 📊 Container Status:
docker-compose -f docker-compose.local.yml ps
echo.
echo 📝 To view logs: docker-compose -f docker-compose.local.yml logs -f
echo 🛑 To stop: docker-compose -f docker-compose.local.yml down
