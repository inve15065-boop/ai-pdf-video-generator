@echo off
echo ========================================
echo AI PDF to Video Generator - Local Setup
echo ========================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed!
    echo Please install Python 3.8 or higher
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed!
    echo Please install Node.js 16 or higher
    exit /b 1
)

echo Prerequisites check passed
echo.

REM Create virtual environment if it doesn't exist
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install Python dependencies
echo Installing Python dependencies...
pip install -r requirements.txt

REM Create directories
if not exist uploads mkdir uploads
if not exist outputs mkdir outputs

REM Start backend in a new window
echo Starting backend server...
start "Backend Server" cmd /k "venv\Scripts\activate.bat && python app.py"

REM Wait a bit for backend to start
timeout /t 3 /nobreak >nul

REM Install frontend dependencies and start
echo Setting up frontend...
cd frontend

if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)

echo Starting frontend server...
start "Frontend Server" cmd /k "npm start"

cd ..

echo.
echo ========================================
echo Application is starting!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to stop all servers...
pause >nul

REM Kill the servers
taskkill /FI "WindowTitle eq Backend Server*" /F >nul 2>&1
taskkill /FI "WindowTitle eq Frontend Server*" /F >nul 2>&1

echo.
echo Servers stopped.
pause
