@echo off
cls
echo ===============================================
echo        Dermify Complete Setup
echo ===============================================
echo.
echo This script will:
echo 1. Start Docker containers (Ollama + Redis)
echo 2. Download AI models
echo 3. Start Next.js development server
echo 4. Open the website for testing
echo.
echo Press any key to continue or Ctrl+C to cancel...
pause >nul

echo.
echo [1/4] Starting Docker services (Ollama + Redis)...
call npm run services:start
if %ERRORLEVEL% neq 0 (
    echo Error starting Docker services. Please check Docker Desktop.
    pause
    exit /b 1
)

echo.
echo [2/4] Waiting for Ollama to be ready...
timeout /t 20

echo.
echo [3/4] Starting Next.js development server...
start "Dermify Dev Server" cmd /k "npm run dev"

echo.
echo [4/4] Waiting for services to initialize...
timeout /t 10

echo.
echo Testing services...
call test-chatbot.bat

echo.
echo ===============================================
echo        Setup Complete!
echo ===============================================
echo.
echo Services running:
echo - Dermify Website: http://localhost:3000
echo - Ollama API: http://localhost:11434
echo - Redis Server: localhost:6379
echo - Chatbot API: http://localhost:3000/api/chatbot
echo.
echo The chatbot icon should appear in the bottom-right corner.
echo Test it with skincare-related questions!
echo.
echo To stop services:
echo - Press Ctrl+C in the dev server window
echo - Run: npm run services:stop
echo.
pause
