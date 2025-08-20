@echo off
echo Starting MuaSamViet Project...
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd server && npm start"

echo Waiting 3 seconds...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd client && npm start"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5174
echo.
echo Press any key to close this window...
pause > nul
