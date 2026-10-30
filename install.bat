
@echo off

title Adhyatma Manthan - Installation

echo.
echo  =========================================
echo    Adhyatma Manthan - Windows Setup
echo    AI-Powered Spiritual Guidance Platform
echo  =========================================
echo.

echo [Step 1/4] Checking Python installation...
echo.

python --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo  ERROR: Python is not installed or not found in PATH.
    echo.
    echo  Please follow these steps:
    echo    1. Go to https://www.python.org/downloads/
    echo    2. Download Python 3.x and run the installer
    echo    3. IMPORTANT: Check "Add Python to PATH" during install
    echo    4. After installing, run this script again
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('python --version') do set PYVER=%%i
echo  Found: %PYVER%
echo.

echo [Step 2/4] Checking pip (package installer)...
echo.

pip --version >nul 2>&1
IF ERRORLEVEL 1 (
    echo  pip not found. Trying to fix...
    python -m ensurepip --upgrade >nul 2>&1
    python -m pip install --upgrade pip >nul 2>&1
)

echo  pip is ready.
echo.

echo [Step 3/4] Installing Flask (web framework)...
echo.

pip install flask >nul 2>&1
IF ERRORLEVEL 1 (
    echo  ERROR: Failed to install Flask.
    echo  Please check your internet connection and try again.
    echo  Or run manually: pip install flask
    echo.
    pause
    exit /b 1
)

echo  Flask installed successfully!
echo.

echo [Step 4/4] Verifying installation...
echo.

python -c "import flask; print('  Flask version:', flask.__version__)" 2>&1
IF ERRORLEVEL 1 (
    echo  ERROR: Flask verification failed.
    pause
    exit /b 1
)

echo.
echo  =========================================
echo    Installation Complete!
echo  =========================================
echo.
echo  Starting Adhyatma Manthan...
echo  Open your browser and go to: http://localhost:5000
echo.
echo  Press Ctrl+C in this window to stop the server.
echo  =========================================
echo.

python app.py

echo.
echo  The server has stopped.
pause