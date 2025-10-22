@echo off
REM Cloud4India Contabo Deployment Script for Windows
REM This script deploys the application to your Contabo server

setlocal enabledelayedexpansion

REM Configuration
set SERVER_IP=161.97.155.89
set SERVER_USER=root
set PROJECT_DIR=/opt/cloud4india-master
set LOCAL_DB_PATH=.\cloud4india-cms\cms.db

echo ========================================
echo Cloud4India Contabo Deployment
echo ========================================
echo Server: %SERVER_IP%
echo Project Directory: %PROJECT_DIR%
echo.

REM Check if SSH is available
where ssh >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] SSH is not available. Please install OpenSSH or use WSL.
    echo You can install OpenSSH from Windows Features or use Git Bash.
    pause
    exit /b 1
)

REM Check if SCP is available
where scp >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] SCP is not available. Please install OpenSSH or use WSL.
    pause
    exit /b 1
)

echo [INFO] Testing connection to server...
ssh -o ConnectTimeout=10 -o BatchMode=yes %SERVER_USER%@%SERVER_IP% exit >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Cannot connect to server. Please check:
    echo 1. Server IP: %SERVER_IP%
    echo 2. SSH key authentication
    echo 3. Server is running
    pause
    exit /b 1
)
echo [SUCCESS] Connection to server successful

REM Copy database if exists
if exist "%LOCAL_DB_PATH%" (
    echo [INFO] Copying local database to server...
    scp "%LOCAL_DB_PATH%" %SERVER_USER%@%SERVER_IP%:%PROJECT_DIR%/cloud4india-cms/
    if %errorlevel% equ 0 (
        echo [SUCCESS] Database copied successfully
    ) else (
        echo [WARNING] Database copy failed
    )
) else (
    echo [WARNING] Local database not found at %LOCAL_DB_PATH%
    echo [WARNING] Server will start with default data
)

echo [INFO] Deploying application to server...

REM Deploy application
ssh %SERVER_USER%@%SERVER_IP% "cd %PROJECT_DIR% && echo 'Stopping existing services...' && docker-compose down && echo 'Building and starting services...' && docker-compose up --build -d && echo 'Waiting for services to start...' && sleep 30 && echo 'Checking service status...' && docker-compose ps"

if %errorlevel% equ 0 (
    echo [SUCCESS] Application deployed successfully
) else (
    echo [ERROR] Deployment failed
    pause
    exit /b 1
)

echo [INFO] Verifying deployment...

REM Test frontend (using curl if available, otherwise skip)
where curl >nul 2>nul
if %errorlevel% equ 0 (
    curl -f -s "http://%SERVER_IP%:4001/health" >nul 2>nul
    if !errorlevel! equ 0 (
        echo [SUCCESS] Frontend is running on port 4001
    ) else (
        echo [WARNING] Frontend health check failed
    )
    
    curl -f -s "http://%SERVER_IP%:4002/api/health" >nul 2>nul
    if !errorlevel! equ 0 (
        echo [SUCCESS] Backend is running on port 4002
    ) else (
        echo [WARNING] Backend health check failed
    )
) else (
    echo [INFO] curl not available, skipping health checks
)

echo.
echo ========================================
echo Deployment Completed!
echo ========================================
echo.
echo 🌐 Access your application:
echo    Frontend:     http://%SERVER_IP%:4001
echo    Admin Panel:  http://%SERVER_IP%:4001/admin
echo    API:          http://%SERVER_IP%:4002/api
echo    DB Admin:     http://%SERVER_IP%:4003
echo.
echo 📊 Monitor your application:
echo    ssh %SERVER_USER%@%SERVER_IP%
echo    cd %PROJECT_DIR%
echo    docker-compose logs -f
echo.

pause
