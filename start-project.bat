@echo off
echo ========================================
echo    MUASAMVIET PROJECT STARTUP SCRIPT
echo ========================================
echo.

echo Starting Backend Server...
cd server
start "MuaSamViet Backend" cmd /k "npm run dev"

echo.
echo Starting Frontend Server...
cd ..\client
start "MuaSamViet Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo    SERVERS STARTING...
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul
