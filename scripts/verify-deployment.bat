@echo off
REM Cloud4India Deployment Verification Script for Windows

echo 🔍 Verifying Cloud4India Deployment...

REM Configuration
set FRONTEND_PORT=4001
set CMS_PORT=4002
set SERVER_IP=161.97.155.89

REM Check Docker containers
echo 📦 Checking Docker containers...
docker-compose ps | findstr "Up" >nul
if errorlevel 1 (
    echo ❌ Docker containers are not running
    echo Run: docker-compose ps
    exit /b 1
) else (
    echo ✅ Docker containers are running
)

echo.

REM Check local endpoints
echo 🏠 Checking local endpoints...

echo Checking Frontend (localhost:%FRONTEND_PORT%)...
curl -f http://localhost:%FRONTEND_PORT% >nul 2>&1
if errorlevel 1 (
    echo ❌ Frontend check failed
) else (
    echo ✅ Frontend OK
)

echo Checking CMS Health (localhost:%CMS_PORT%)...
curl -f http://localhost:%CMS_PORT%/api/health >nul 2>&1
if errorlevel 1 (
    echo ❌ CMS Health check failed
) else (
    echo ✅ CMS Health OK
)

echo Checking CMS Homepage API (localhost:%CMS_PORT%)...
curl -f http://localhost:%CMS_PORT%/api/homepage >nul 2>&1
if errorlevel 1 (
    echo ❌ CMS Homepage API check failed
) else (
    echo ✅ CMS Homepage API OK
)

echo.

REM Check external endpoints
echo 🌍 Checking external endpoints...

echo Checking Frontend (%SERVER_IP%:%FRONTEND_PORT%)...
curl -f http://%SERVER_IP%:%FRONTEND_PORT% >nul 2>&1
if errorlevel 1 (
    echo ⚠️  External Frontend check failed - this might be normal if firewall rules are not configured
) else (
    echo ✅ External Frontend OK
)

echo Checking CMS Health (%SERVER_IP%:%CMS_PORT%)...
curl -f http://%SERVER_IP%:%CMS_PORT%/api/health >nul 2>&1
if errorlevel 1 (
    echo ⚠️  External CMS Health check failed - this might be normal if firewall rules are not configured
) else (
    echo ✅ External CMS Health OK
)

echo.

REM Check database
echo 💾 Checking database...
docker-compose exec -T cloud4india-cms test -f /app/data/cms.db >nul 2>&1
if errorlevel 1 (
    echo ❌ SQLite database not found
) else (
    echo ✅ SQLite database exists
)

echo.

REM Resource usage
echo 📊 Resource usage...
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | findstr cloud4india

echo.

REM Summary
echo 📋 Deployment Summary:
echo 🌐 Frontend URL: http://%SERVER_IP%:%FRONTEND_PORT%
echo 🔧 CMS API URL: http://%SERVER_IP%:%CMS_PORT%/api
echo ❤️  Health Check: http://%SERVER_IP%:%CMS_PORT%/api/health
echo 📊 Admin Panel: http://%SERVER_IP%:%FRONTEND_PORT%/admin

echo.
echo 🎉 Deployment verification completed!
