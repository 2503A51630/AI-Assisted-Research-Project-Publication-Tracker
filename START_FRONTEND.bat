@echo off
title AI Research Tracker - Frontend

cd /d "%~dp0frontend"

echo ==========================================
echo       AI RESEARCH TRACKER FRONTEND
echo ==========================================
echo.
echo Starting React...
echo.

npm.cmd run dev

echo.
echo ==========================================
echo Frontend stopped.
echo ==========================================
pause