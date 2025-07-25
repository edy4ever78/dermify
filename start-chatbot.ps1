# Dermify Chatbot Startup Script
# PowerShell version for better error handling and cross-platform support

Write-Host "🤖 Starting Dermify Chatbot Services..." -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker version | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    Write-Host "Press any key to exit..."
    $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Check for NVIDIA GPU support
try {
    nvidia-smi | Out-Null
    Write-Host "✅ NVIDIA GPU detected" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Warning: NVIDIA GPU not detected. Chatbot will run on CPU only." -ForegroundColor Yellow
}

# Stop any existing containers
Write-Host ""
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose down

# Start the Ollama service
Write-Host ""
Write-Host "🚀 Starting Ollama container with GPU support..." -ForegroundColor Cyan
docker-compose up -d ollama

# Wait for Ollama to be ready
Write-Host ""
Write-Host "⏳ Waiting for Ollama to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Health check
$maxRetries = 6
$retries = 0
$healthy = $false

do {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:11434/api/health" -TimeoutSec 5 -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $healthy = $true
            Write-Host "✅ Ollama is healthy and ready!" -ForegroundColor Green
        }
    } catch {
        $retries++
        Write-Host "⏳ Waiting for Ollama... (attempt $retries/$maxRetries)" -ForegroundColor Yellow
        Start-Sleep -Seconds 5
    }
} while (-not $healthy -and $retries -lt $maxRetries)

if (-not $healthy) {
    Write-Host "⚠️ Warning: Ollama health check failed. Continuing anyway..." -ForegroundColor Yellow
}

# Initialize models
Write-Host ""
Write-Host "📥 Initializing AI models..." -ForegroundColor Cyan
docker-compose up ollama-init

# Check final status
Write-Host ""
Write-Host "📊 Service Status:" -ForegroundColor Cyan
docker-compose ps

# Test model availability
Write-Host ""
Write-Host "🧠 Testing AI models..." -ForegroundColor Cyan
try {
    $models = docker exec ollama-gpu ollama list
    Write-Host $models
    Write-Host "✅ Models loaded successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Warning: Could not list models. They may still be downloading." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host "🎉 Dermify Chatbot Services Started Successfully!" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Ollama API: http://localhost:11434" -ForegroundColor White
Write-Host "❤️ Health Check: http://localhost:11434/api/health" -ForegroundColor White
Write-Host ""
Write-Host "You can now start your Next.js development server:" -ForegroundColor White
Write-Host "npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Or start everything together:" -ForegroundColor White
Write-Host "npm run dev:full" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
