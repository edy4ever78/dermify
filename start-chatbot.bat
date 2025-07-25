@echo off
echo Starting Dermify Chatbot Services...
echo.

REM Check if Docker is running
docker version >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Error: Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Stop any existing containers
echo Stopping existing containers...
docker-compose down

REM Start the services
echo Starting Ollama container with GPU support...
docker-compose up -d ollama

REM Wait for Ollama to be ready
echo Waiting for Ollama to be ready...
timeout /t 10

REM Check if Ollama is responsive
curl -f http://localhost:11434/api/health >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo Warning: Ollama might not be fully ready yet. Starting model initialization anyway...
)

REM Initialize models
echo Initializing AI models...
docker-compose up ollama-init

REM Check status
echo.
echo Checking service status...
docker-compose ps

echo.
echo ===============================================
echo Dermify Chatbot Services Started Successfully!
echo ===============================================
echo.
echo Ollama API: http://localhost:11434
echo Health Check: http://localhost:11434/api/health
echo.
echo You can now start your Next.js development server:
echo npm run dev
echo.
echo Press any key to continue...
pause >nul
