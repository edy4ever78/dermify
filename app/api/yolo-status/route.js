import { spawn } from 'child_process';
import { NextResponse } from 'next/server';
import axios from 'axios';
import path from 'path';
import fs from 'fs';

// Keep track of the YOLOv8 API process
let yoloProcess = null;
let isStarting = false;

// Function to get the current port from the port file
const getApiPort = () => {
  try {
    const portFilePath = path.join(process.cwd(), 'api', 'yolo_api_port.txt');
    if (fs.existsSync(portFilePath)) {
      const port = fs.readFileSync(portFilePath, 'utf8').trim();
      console.log(`Found YOLOv8 API port in file: ${port}`);
      return parseInt(port, 10);
    }
  } catch (error) {
    console.error('Error reading port file:', error);
  }
  return 5000; // Default port if file doesn't exist
};

// Function to start the YOLOv8 API
async function startYoloApi() {
  if (yoloProcess || isStarting) return;
  
  isStarting = true;
  
  // Get the path to the Python script
  const scriptPath = path.join(process.cwd(), 'api', 'yolo_api.py');
  
  console.log('Starting YOLOv8 API:', scriptPath);
  
  try {
    // Start the Python API
    yoloProcess = spawn('python', [scriptPath], {
      detached: false,
      stdio: 'pipe'
    });
    
    // Log stdout
    yoloProcess.stdout.on('data', (data) => {
      console.log(`YOLOv8 API stdout: ${data}`);
    });
    
    // Log stderr
    yoloProcess.stderr.on('data', (data) => {
      console.error(`YOLOv8 API stderr: ${data}`);
    });
    
    // Handle process exit
    yoloProcess.on('close', (code) => {
      console.log(`YOLOv8 API process exited with code ${code}`);
      yoloProcess = null;
      isStarting = false;
    });
    
    // Wait for API to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    isStarting = false;
    return true;
  } catch (error) {
    console.error('Error starting YOLOv8 API:', error);
    yoloProcess = null;
    isStarting = false;
    return false;
  }
}

// GET endpoint to check API status
export async function GET() {
  try {
    const port = getApiPort();
    const YOLO_URL = `http://localhost:${port}`;
    
    try {
      const response = await axios.get(YOLO_URL, { timeout: 2000 });
      return NextResponse.json({
        status: 'running',
        message: response.data
      });
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
        return NextResponse.json({
          status: 'stopped',
          message: 'YOLOv8 API is not running'
        });
      }
      
      return NextResponse.json({
        status: 'error',
        message: `Error connecting to API: ${error.message}`
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: `Unknown error: ${error.message}`
    }, { status: 500 });
  }
}

// POST endpoint to start the API
export async function POST(request) {
  try {
    // Start the YOLOv8 API if it's not already running
    if (!yoloProcess && !isStarting) {
      const started = await startYoloApi();
      
      if (started) {
        return NextResponse.json({
          status: 'started',
          message: 'YOLOv8 API has been started'
        });
      } else {
        return NextResponse.json({
          status: 'error',
          message: 'Failed to start YOLOv8 API'
        }, { status: 500 });
      }
    } else if (isStarting) {
      return NextResponse.json({
        status: 'starting',
        message: 'YOLOv8 API is already starting'
      });
    } else {
      return NextResponse.json({
        status: 'running',
        message: 'YOLOv8 API is already running'
      });
    }
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: `Error starting YOLOv8 API: ${error.message}`
    }, { status: 500 });
  }
}
