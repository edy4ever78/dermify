@echo off
echo Testing Dermify Services Integration...
echo.

REM Check if the development server is running
echo Checking if Next.js server is running...
curl -s http://localhost:3000 >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Warning: Next.js development server is not running.
    echo Please run: npm run dev
    echo.
)

REM Check if Ollama is running
echo Checking if Ollama API is running...
curl -s http://localhost:11434/api/tags >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Warning: Ollama API is not running.
    echo Please run: npm run services:start
    echo.
) else (
    echo ✓ Ollama API is running
)

REM Check if Redis is running
echo Checking if Redis is running...
docker exec dermify-redis redis-cli ping >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Warning: Redis is not running.
    echo Please run: npm run services:start
    echo.
) else (
    echo ✓ Redis is running
)

REM Check chatbot API health
echo Checking chatbot API health...
curl -s http://localhost:3000/api/chatbot >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Warning: Chatbot API health check failed.
) else (
    echo ✓ Chatbot API is healthy
)

echo.
echo ===============================================
echo Opening Dermify in your browser...
echo ===============================================
echo.
echo Test the chatbot by:
echo 1. Clicking the chat icon in bottom-right
echo 2. Asking: "What ingredients should I avoid for sensitive skin?"
echo 3. Checking that the AI responds appropriately
echo.
echo Redis is available for caching and session management.
echo You can also test the dev dashboard if you have access.
echo.

REM Open the website in default browser
start http://localhost:3000

echo Browser opened. Check the chatbot functionality!
echo Press any key to exit...
pause >nul
