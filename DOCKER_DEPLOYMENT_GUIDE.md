# 🐳 Dermify Docker Deployment Guide

## 📋 Prerequisites

1. **Docker & Docker Compose** installed on your system
2. **NVIDIA GPU** (optional, for AI model acceleration)
3. **8GB+ RAM** recommended for running AI models locally

## 🚀 Quick Start

### 1. **Environment Setup**
```bash
# Copy the environment template
cp .env.example .env.production

# Edit the environment file with your configurations
# (Optional: Most defaults work for local deployment)
```

### 2. **Build and Start Services**
```bash
# Build and start all services
docker-compose up --build -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f dermify-app
```

### 3. **Access the Application**
- **Dermify App**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health
- **Ollama API**: http://localhost:11434
- **Redis**: localhost:6379

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Dermify App   │────│     Redis       │    │     Ollama      │
│   (Next.js)     │    │   (Database)    │    │   (AI Models)   │
│   Port: 3000    │    │   Port: 6379    │    │  Port: 11434    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📊 Services Overview

### **dermify-app** (Main Application)
- **Image**: Built from local Dockerfile
- **Port**: 3000
- **Dependencies**: Redis, Ollama
- **Features**: 
  - Personalized chatbot
  - Product recommendations
  - User authentication
  - Skincare analysis

### **dermify-redis** (Database)
- **Image**: redis:7-alpine
- **Port**: 6379
- **Purpose**: User data, session storage, caching
- **Persistence**: Data volume mounted

### **dermify-ollama** (AI Models)
- **Image**: ollama/ollama
- **Port**: 11434
- **Models**: orca-mini:latest, llama3:8b
- **GPU**: NVIDIA GPU support enabled

### **dermify-ollama-init** (Model Setup)
- **Purpose**: Downloads AI models on first run
- **Models**: Automatically pulls required models
- **Lifecycle**: Runs once, then stops

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `production` |
| `REDIS_URL` | Redis connection string | `redis://dermify-redis:6379` |
| `OLLAMA_HOST` | Ollama API endpoint | `http://dermify-ollama:11434` |
| `NEXT_PUBLIC_API_URL` | Public API URL | `http://localhost:3000` |

### Docker Compose Override

Create `docker-compose.override.yml` for custom configurations:

```yaml
version: '3.8'
services:
  dermify-app:
    environment:
      - DEBUG=true
      - CUSTOM_VAR=value
    ports:
      - "3001:3000"  # Use different port
```

## 🚀 Deployment Commands

### **Development Mode**
```bash
# Start with live logs
docker-compose up --build

# Start in background
docker-compose up --build -d
```

### **Production Mode**
```bash
# Build production images
docker-compose build --no-cache

# Start production services
docker-compose -f docker-compose.yml up -d

# Update single service
docker-compose up --build -d dermify-app
```

### **Maintenance Commands**
```bash
# View logs
docker-compose logs -f [service-name]

# Restart services
docker-compose restart

# Stop services
docker-compose down

# Remove volumes (⚠️ deletes data)
docker-compose down -v

# Update images
docker-compose pull
docker-compose up -d
```

## 🔍 Monitoring & Health Checks

### **Health Check Endpoints**
- **App Health**: `GET /api/health`
- **Ollama Health**: `GET http://localhost:11434/api/tags`
- **Redis Health**: `redis-cli ping`

### **Service Status**
```bash
# Check all services
docker-compose ps

# Check specific service health
docker-compose exec dermify-app curl http://localhost:3000/api/health

# Check logs for errors
docker-compose logs dermify-app | grep ERROR
```

## 🐛 Troubleshooting

### **Common Issues**

#### **Service Won't Start**
```bash
# Check logs
docker-compose logs [service-name]

# Restart service
docker-compose restart [service-name]

# Rebuild service
docker-compose up --build [service-name]
```

#### **Port Already in Use**
```bash
# Find process using port
netstat -tulpn | grep :3000

# Kill process
kill -9 [PID]

# Or use different port in docker-compose.yml
```

#### **Models Not Loading**
```bash
# Check ollama-init logs
docker-compose logs ollama-init

# Manually pull models
docker-compose exec ollama ollama pull orca-mini:latest
```

#### **Database Connection Issues**
```bash
# Check Redis connection
docker-compose exec redis redis-cli ping

# Reset Redis data
docker-compose down
docker volume rm dermify_redis_data
docker-compose up -d
```

### **Performance Optimization**

#### **For GPU Acceleration**
```yaml
# Ensure NVIDIA Docker runtime is installed
# Add to docker-compose.yml under ollama service:
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: all
          capabilities: [gpu]
```

#### **For Memory Optimization**
```yaml
# Add memory limits to services:
services:
  dermify-app:
    mem_limit: 1g
  ollama:
    mem_limit: 4g
```

## 📈 Scaling & Production

### **Horizontal Scaling**
```bash
# Scale app instances
docker-compose up --scale dermify-app=3 -d

# Use load balancer (nginx, traefik, etc.)
```

### **Production Considerations**
1. **SSL/TLS**: Use reverse proxy (nginx, traefik)
2. **Environment**: Set production environment variables
3. **Monitoring**: Add logging and monitoring stack
4. **Backups**: Implement Redis data backup strategy
5. **Security**: Use secrets management for sensitive data

## 🔐 Security

### **Production Security Checklist**
- [ ] Change default passwords/secrets
- [ ] Use HTTPS in production
- [ ] Limit Redis access to internal network
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities

### **Network Security**
```yaml
# Create custom network
networks:
  dermify:
    driver: bridge

# Assign services to network
services:
  dermify-app:
    networks:
      - dermify
```

## 📚 Additional Resources

- **Docker Documentation**: https://docs.docker.com/
- **Docker Compose Reference**: https://docs.docker.com/compose/
- **Ollama Documentation**: https://ollama.ai/docs
- **Next.js Docker Guide**: https://nextjs.org/docs/deployment#docker-image

---

## 🎉 Success!

Your Dermify application is now running in Docker containers! 

- **🌐 Access**: http://localhost:3000
- **🔍 Monitor**: Check health endpoints and logs
- **🚀 Scale**: Use Docker Compose scaling commands

For support, check the troubleshooting section or application logs.
