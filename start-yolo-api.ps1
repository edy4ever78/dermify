# PowerShell script to build and start YOLO API container

Write-Host "🚀 Building YOLO API Docker container..." -ForegroundColor Cyan
docker-compose -f docker-compose.yolo.yml build

Write-Host "📋 Starting YOLO API container..." -ForegroundColor Cyan
docker-compose -f docker-compose.yolo.yml up -d

Write-Host "✅ YOLO API container is starting!" -ForegroundColor Green
Write-Host "🌐 API will be available at: http://localhost:5000" -ForegroundColor White
Write-Host "❤️ Health check: http://localhost:5000/health" -ForegroundColor White
Write-Host "📊 Model status: http://localhost:5000/model-status" -ForegroundColor White

Write-Host ""
Write-Host "To view logs: docker-compose -f docker-compose.yolo.yml logs -f" -ForegroundColor Yellow
Write-Host "To stop: docker-compose -f docker-compose.yolo.yml down" -ForegroundColor Yellow
