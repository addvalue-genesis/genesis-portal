@echo off
setlocal
cd /d "%~dp0frontend"
if not exist node_modules\webpack-cli\bin\cli.js (
  call npm ci --no-audit --no-fund
  if errorlevel 1 goto failed
)
call npm run start:0550
if errorlevel 1 goto failed
exit /b 0
:failed
echo Startup failed. If port 3001 is occupied, stop the older server and retry.
pause
exit /b 1
