#!/bin/bash

# Build and start YOLO API container
echo "🚀 Building YOLO API Docker container..."
docker-compose -f docker-compose.yolo.yml build

echo "📋 Starting YOLO API container..."
docker-compose -f docker-compose.yolo.yml up -d

echo "✅ YOLO API container is starting!"
echo "🌐 API will be available at: http://localhost:5000"
echo "❤️ Health check: http://localhost:5000/health"
echo "📊 Model status: http://localhost:5000/model-status"

echo ""
echo "To view logs: docker-compose -f docker-compose.yolo.yml logs -f"
echo "To stop: docker-compose -f docker-compose.yolo.yml down"
