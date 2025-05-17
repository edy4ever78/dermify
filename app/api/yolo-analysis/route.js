import { spawn } from 'child_process';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';
import { promises as fsPromises } from 'fs';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import FormData from 'form-data';

// Configuration for the YOLOv8 API
let YOLO_URL = 'http://localhost:5000'; // Default, will be updated dynamically
let yoloProcess = null;
let isStarting = false;
const YOLO_VERSION = 'v8';

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
      const message = data.toString();
      console.log(`YOLOv8 API stdout: ${message}`);
      
      // Check if the message contains the port information
      const portMatch = message.match(/Starting YOLOv8 API server on port: (\d+)/);
      if (portMatch && portMatch[1]) {
        const port = parseInt(portMatch[1], 10);
        YOLO_URL = `http://localhost:${port}`;
        console.log(`Updated API URL to: ${YOLO_URL}`);
      }
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
    
    // Wait for the API to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Get the port from the file after waiting
    const port = getApiPort();
    YOLO_URL = `http://localhost:${port}`;
    console.log(`API URL after waiting: ${YOLO_URL}`);
    
    isStarting = false;
    console.log('YOLOv8 API started successfully');
  } catch (error) {
    console.error('Error starting YOLOv8 API:', error);
    yoloProcess = null;
    isStarting = false;
    throw error;
  }
}

// Function to ensure temporary directory exists
async function ensureTempDir() {
  // Get system temp directory
  const tempDir = path.join(os.tmpdir(), 'dermify');
  
  try {
    // Check if directory exists, if not create it
    await fsPromises.mkdir(tempDir, { recursive: true });
    console.log(`Temporary directory created/verified: ${tempDir}`);
    return tempDir;
  } catch (error) {
    console.error(`Error creating temporary directory: ${error}`);
    throw error;
  }
}

// Function to upload image for analysis
async function uploadImageForAnalysis(formData) {
  try {
    // Get form data file
    const file = formData.get('file');
    if (!file) {
      throw new Error('No file provided');
    }
    
    // Generate unique filename
    const uniqueId = uuidv4();
    let fileExtension = '.jpg'; // Default extension
    
    // Determine file extension from file type if available
    if (file.name) {
      const extMatch = file.name.match(/\.([^.]+)$/);
      if (extMatch) fileExtension = extMatch[0];
    }
    
    // Ensure temp directory exists
    const tempDir = await ensureTempDir();
    const filepath = path.join(tempDir, `image-${uniqueId}${fileExtension}`);
    
    // Get file buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    console.log(`Image buffer size: ${buffer.length} bytes`);
    
    // Write the file to disk
    await fsPromises.writeFile(filepath, buffer);
    console.log(`File saved to ${filepath}`);
    
    // Get the API port
    const port = getApiPort();
    YOLO_URL = `http://localhost:${port}`;
    
    // Create form data for YOLOv8 API
    const apiFormData = new FormData();
    apiFormData.append('file', fs.createReadStream(filepath));
    
    // Send to YOLOv8 API
    console.log(`Sending request to ${YOLO_URL}/analyze`);
    const response = await axios.post(`${YOLO_URL}/analyze`, apiFormData, {
      headers: {
        ...apiFormData.getHeaders()
      },
      timeout: 60000,
    });
    
    // Clean up temporary file
    try {
      await fsPromises.unlink(filepath);
      console.log(`Temporary file removed: ${filepath}`);
    } catch (cleanupError) {
      console.error(`Error removing temporary file: ${cleanupError}`);
    }
    
    // Add YOLO version info to the response
    const results = response.data;
    results.yoloVersion = YOLO_VERSION;
    results.api = 'local';
    
    return results;
  } catch (error) {
    console.error(`Error in uploadImageForAnalysis: ${error}`);
    throw error;
  }
}

// GET endpoint to check API status
export async function GET() {
  try {
    // Update the URL with the latest port
    const port = getApiPort();
    YOLO_URL = `http://localhost:${port}`;
    
    // Check if the API is running
    const response = await axios.get(YOLO_URL, { timeout: 2000 });
    return NextResponse.json({
      status: 'running',
      message: response.data,
      yoloVersion: YOLO_VERSION,
      api: 'local'
    });
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      return NextResponse.json({
        status: 'stopped',
        message: 'YOLOv8 API is not running',
        yoloVersion: YOLO_VERSION,
        api: 'local'
      });
    }
    
    console.error('Error checking API status:', error.message);
    return NextResponse.json({
      status: 'error',
      message: `Error connecting to API: ${error.message}`,
      yoloVersion: YOLO_VERSION,
      api: 'local'
    });
  }
}

// PUT endpoint to start/restart the API
export async function PUT() {
  try {
    // Kill existing process if it exists
    if (yoloProcess) {
      yoloProcess.kill();
      yoloProcess = null;
    }
    
    await startYoloApi();
    
    return NextResponse.json({
      status: 'starting',
      message: 'YOLOv8 API is starting',
      yoloVersion: YOLO_VERSION,
      api: 'local'
    });
  } catch (error) {
    console.error('Error starting API:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message,
      yoloVersion: YOLO_VERSION,
      api: 'local'
    }, { status: 500 });
  }
}

// POST endpoint to analyze image
export async function POST(request) {
  try {
    // Make sure API is running
    if (!yoloProcess && !isStarting) {
      await startYoloApi();
      // Wait for the API to initialize
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
    
    // Parse the form data
    const formData = await request.formData();
    
    // Upload the image and get analysis results
    const results = await uploadImageForAnalysis(formData);
    
    return NextResponse.json({
      status: 'success',
      results,
      yoloVersion: YOLO_VERSION,
      api: 'local'
    });
  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Get detailed error information
    let errorMessage = error.message;
    if (error.response) {
      errorMessage = `API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
    }
    
    return NextResponse.json({
      status: 'error',
      message: errorMessage,
      yoloVersion: YOLO_VERSION,
      api: 'local'
    }, { status: 500 });
  }
}