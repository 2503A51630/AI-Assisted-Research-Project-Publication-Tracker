@echo off
title AI Research Tracker - START

cd /d "%~dp0"

echo ==========================================
echo       AI RESEARCH TRACKER
echo       STARTING APPLICATION
echo ==========================================
echo.

echo Checking Backend...

netstat -ano | findstr ":8001" | findstr "LISTENING" >nul

if %errorlevel%==0 (
    echo Backend is already running on port 8001.
    echo.
) else (
    echo Backend is not running.
    echo Starting Backend...
    start "AI Research Tracker - Backend" cmd /k call "%~dp0START_BACKEND.bat"
    timeout /t 5 /nobreak >nul
)

echo.
echo Checking Frontend...

netstat -ano | findstr ":5173" | findstr "LISTENING" >nul

if %errorlevel%==0 (
    echo Frontend is already running on port 5173.
    echo.
) else (
    echo Frontend is not running.
    echo Starting Frontend...
    start "AI Research Tracker - Frontend" cmd /k call "%~dp0START_FRONTEND.bat"
    timeout /t 5 /nobreak >nul
)

echo.
echo ==========================================
echo       APPLICATION READY
echo ==========================================
echo.
echo Backend:  http://127.0.0.1:8001
echo Frontend: http://localhost:5173
echo.
echo Open Chrome:
echo http://localhost:5173
echo.
pause