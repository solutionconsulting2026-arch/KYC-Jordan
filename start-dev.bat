@echo off
setlocal
cd /d "%~dp0"

echo ==============================================
echo   Starting Corporate KYC Workflow App...
echo ==============================================

:: Ensure Node.js is in PATH
set "PATH=%PATH%;C:\Program Files\nodejs;C:\Users\%USERNAME%\AppData\Roaming\npm"

:: Check if node is found
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js was not found in PATH or at C:\Program Files\nodejs.
    echo Please ensure Node.js is installed.
    pause
    exit /b 1
)

echo Node.js version:
node -v
echo.

:: Launch dev server
if exist "node_modules\vite\bin\vite.js" (
    node "node_modules\vite\bin\vite.js"
) else (
    npm.cmd run dev
)

if %ERRORLEVEL% neq 0 (
    pause
)
