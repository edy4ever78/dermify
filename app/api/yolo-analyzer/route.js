import { NextResponse } from 'next/server';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import { promises as fsPromises } from 'fs';

// Configuration
const YOLO_VERSION = 'v8';

// Function to get the current port from the port file for local YOLO API
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

// Function to process image with local YOLO API
async function processImageWithYolo(imageBuffer) {
  try {
    // Get the API port for local YOLO service
    const port = getApiPort();
    const YOLO_URL = `http://localhost:${port}`;
    
    // Create FormData for the local API request
    const formData = new FormData();
    formData.append('file', new Blob([imageBuffer]), 'image.jpg');
    
    // Send request to local YOLO API
    console.log(`Sending request to local YOLO API: ${YOLO_URL}/analyze`);
    const response = await axios.post(`${YOLO_URL}/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 60000,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error calling local YOLO API:', error);
    throw error;
  }
}

// GET endpoint to check API status
export async function GET() {
  try {
    // Check local YOLO API status
    const port = getApiPort();
    const YOLO_URL = `http://localhost:${port}`;
    
    const response = await axios.get(YOLO_URL, { timeout: 2000 });
    return NextResponse.json({
      status: 'running',
      message: response.data,
      api: 'local',
      yoloVersion: YOLO_VERSION
    });
  } catch (error) {
    return NextResponse.json({
      status: 'stopped',
      message: 'Local YOLOv8 API is not running',
      api: 'local',
      yoloVersion: YOLO_VERSION
    });
  }
}

// POST endpoint to analyze image
export async function POST(request) {
  try {
    // Parse the form data
    const formData = await request.formData();
    
    // Get form data file
    const file = formData.get('file');
    if (!file) {
      return NextResponse.json({
        status: 'error', 
        message: 'No file provided'
      }, { status: 400 });
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
    
    // Process the image with YOLOv8
    console.log('Using local YOLO API for analysis');
    const results = await processImageWithYolo(buffer);
    results.api = 'local';
    results.yoloVersion = YOLO_VERSION;
    
    // Clean up temporary file
    try {
      await fsPromises.unlink(filepath);
      console.log(`Temporary file removed: ${filepath}`);
    } catch (cleanupError) {
      console.error(`Error removing temporary file: ${cleanupError}`);
    }
    
    return NextResponse.json({
      status: 'success',
      results,
      modelInfo: {
        version: 'local',
        type: 'local-yolov8'
      }
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
      message: errorMessage
    }, { status: 500 });
  }
}
