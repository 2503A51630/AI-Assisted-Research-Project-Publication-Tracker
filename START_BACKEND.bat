@echo off
title AI Research Tracker - Backend

cd /d "%~dp0"

echo ==========================================
echo       AI RESEARCH TRACKER BACKEND
echo ==========================================
echo.
echo Starting FastAPI...
echo.

"%~dp0venv\Scripts\python.exe" -c "import asyncio; import uvicorn; config=uvicorn.Config('main:app', host='127.0.0.1', port=8001); server=uvicorn.Server(config); asyncio.run(server.serve())"

echo.
echo ==========================================
echo Backend stopped.
echo ==========================================
pause