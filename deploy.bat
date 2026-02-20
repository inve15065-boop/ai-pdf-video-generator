@echo off
echo ========================================
echo Deploying AI PDF to Video Generator
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo Error: .env file not found!
    echo Please create .env file with required environment variables
    exit /b 1
)

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not running!
    echo Please start Docker Desktop first
    exit /b 1
)

echo Prerequisites check passed
echo.

REM Stop existing containers
echo Stopping existing containers...
docker-compose down

REM Build and start containers
echo Building containers...
docker-compose build

echo Starting services...
docker-compose up -d

echo.
echo ========================================
echo Deployment complete!
echo ========================================
echo.
echo Service Status:
docker-compose ps

echo.
echo Access the application:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo    Health:   http://localhost:5000/health
echo.
echo View logs:
echo    docker-compose logs -f
echo.
echo Stop services:
echo    docker-compose down
echo.
pause
