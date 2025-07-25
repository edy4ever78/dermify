# Dermify AI Chatbot - Complete Setup Guide

**AI-Powered Skincare Assistant with GPU Support**

This guide explains how to set up the AI-powered chatbot for Dermify using Docker and Ollama with NVIDIA GPU acceleration.

## Quick Start (Recommended)

### Option 1: One-Click Setup
```cmd
setup-complete.bat
```
This automated script will:
- Start Docker container with GPU support
- Download AI models (orca-mini for optimal performance)
- Start Next.js development server
- Open website in browser for testing

### Option 2: PowerShell Setup
```powershell
.\start-chatbot.ps1
npm run dev
```

### Option 3: Manual Step-by-Step
```cmd
# 1. Start chatbot services
npm run chatbot:start

# 2. Wait for initialization (30 seconds)
# 3. Start development server
npm run dev

# 4. Test the setup
test-chatbot.bat
```

## Prerequisites

- **Docker Desktop** with GPU support enabled
- **NVIDIA GPU** with CUDA support (GTX 1650 Ti or better)
- **8GB+ System RAM** (4GB+ GPU VRAM recommended)
- **Node.js 18+** and npm
- **Windows 10/11** with WSL2 (for Docker)

## Available Commands

| Command | Description | Use Case |
|---------|-------------|----------|
| `setup-complete.bat` | **Complete automated setup** | First-time setup |
| `start-chatbot.ps1` | Start chatbot services (PowerShell) | Development |
| `test-chatbot.bat` | Test chatbot functionality | Verification |
| `npm run chatbot:start` | Start Ollama container | Manual control |
| `npm run chatbot:init` | Download AI models | Model management |
| `npm run chatbot:stop` | Stop all services | Cleanup |
| `npm run chatbot:status` | Check container status | Debugging |
| `npm run chatbot:logs` | View container logs | Troubleshooting |
| `npm run dev:full` | Start chatbot + dev server | Development |

## AI Models & Performance

### Primary Model: orca-mini:latest (2GB)
- **80% GPU usage** on GTX 1650 Ti
- **Fast responses** (1-3 seconds)
- **Low memory usage**
- **Optimized for skincare questions**

### Alternative Model: llama3:8b (6.5GB)
- **53% GPU, 47% CPU** (mixed processing)
- **Slower responses** (3-8 seconds)
- **Higher memory usage**
- **More detailed responses**

### Model Switching
Edit `app/api/chatbot/route.js`:
```javascript
const { message, model = 'orca-mini:latest' } = await request.json();
```

## Service URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Dermify Website** | http://localhost:3000 | Main application |
| **Chatbot API** | http://localhost:3000/api/chatbot | Internal API |
| **Ollama API** | http://localhost:11434 | AI model interface |
| **Health Check** | http://localhost:3000/api/chatbot | Service status |

## Testing the Chatbot

1. **Open the website**: http://localhost:3000
2. **Look for the chat icon** in the bottom-right corner
3. **Check the status indicator**:
   - Green dot = AI online
   - Red dot = AI offline
4. **Test with sample questions**:
   - "What ingredients should I avoid for sensitive skin?"
   - "Explain what niacinamide does for my skin"
   - "Is retinol safe for daily use?"

## Troubleshooting

### Chatbot Shows "Offline" Status

**1. Check Docker Container**
```cmd
npm run chatbot:status
```
Expected output: `dermify-ollama` should be "Up" and "healthy"

**2. View Logs**
```cmd
npm run chatbot:logs
```
Look for errors or model loading messages

**3. Restart Services**
```cmd
npm run chatbot:stop
npm run chatbot:start
```

### GPU Not Being Used

**1. Verify GPU in Container**
```cmd
docker exec dermify-ollama nvidia-smi
```
Should show your NVIDIA GPU

**2. Check Model Loading**
```cmd
docker exec dermify-ollama ollama ps
```
Should show GPU percentage usage

**3. Ensure NVIDIA Docker Runtime**
- Install NVIDIA Container Toolkit
- Restart Docker Desktop
- Enable GPU support in Docker settings

### Models Not Downloading

**1. Check Internet Connection**
```cmd
ping huggingface.co
```

**2. Manual Model Download**
```cmd
docker exec dermify-ollama ollama pull orca-mini:latest
```

**3. Check Disk Space**
- Ensure 10GB+ free space
- Models are stored in Docker volume

### API Errors

**1. Check Next.js Server**
```cmd
curl http://localhost:3000/api/chatbot
```
Should return JSON with status

**2. Check CORS Issues**
- API calls are internal (no CORS issues expected)
- If issues persist, check browser console

**3. Port Conflicts**
```cmd
netstat -an | findstr ":3000"
netstat -an | findstr ":11434"
```

## Configuration

### Environment Variables
```env
# Optional: Add to .env.local
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=orca-mini:latest
CHATBOT_TIMEOUT=30000
```

### Docker Compose Customization
Edit `docker-compose.yml` to:
- Change ports
- Modify GPU settings
- Add custom models
- Configure memory limits

### Chatbot Personality
Edit `app/api/chatbot/route.js` to customize:
- System prompt
- Response style
- Temperature settings
- Token limits

## Security & Privacy

- **All AI processing is local** (no external API calls)
- **No user data is logged or stored**
- **Models run in isolated Docker container**
- **API is localhost-only** (not exposed externally)
- **No internet required** for chat (after initial setup)

## Performance Monitoring

### Check GPU Usage
```cmd
docker exec dermify-ollama nvidia-smi
```

### Monitor Container Resources
```cmd
docker stats dermify-ollama
```

### Check Model Performance
```cmd
docker exec dermify-ollama ollama ps
```

## Updates & Maintenance

### Update Models
```cmd
docker exec dermify-ollama ollama pull orca-mini:latest
```

### Update Container
```cmd
npm run chatbot:stop
docker pull ollama/ollama
npm run chatbot:start
```

### Clean Up Storage
```cmd
docker exec dermify-ollama ollama rm old-model-name
docker system prune -f
```

## Support

If you encounter issues:

1. **Check logs**: `npm run chatbot:logs`
2. **Verify GPU**: `docker exec dermify-ollama nvidia-smi`
3. **Test health**: Visit http://localhost:3000/api/chatbot
4. **Restart services**: `npm run chatbot:stop && npm run chatbot:start`

For optimal performance on your GTX 1650 Ti, stick with `orca-mini:latest` model for the best balance of speed and quality.

---

**Enjoy your AI-powered skincare assistant!**
