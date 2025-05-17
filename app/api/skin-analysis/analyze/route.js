import { NextResponse } from 'next/server';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import os from 'os';
import path from 'path';

// Function to get the current port from the port file
const getApiPort = () => {
  try {
    const portFilePath = path.join(process.cwd(), 'api', 'yolo_api_port.txt');
    if (fs.existsSync(portFilePath)) {  // Using synchronous fs instead of promises
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

// Function to save base64 image to temp file
async function saveBase64ImageToFile(base64Data) {
  try {
    // Remove the data URL prefix if present
    let imageData = base64Data;
    if (base64Data.includes(',')) {
      imageData = base64Data.split(',')[1];
    }
    
    // Decode base64 data
    const buffer = Buffer.from(imageData, 'base64');
    
    // Create unique filename in temp directory
    const tempDir = await ensureTempDir();
    const imagePath = path.join(tempDir, `analysis-${uuidv4()}.jpg`);
    
    // Write file
    await fsPromises.writeFile(imagePath, buffer);
    console.log(`Image saved to ${imagePath}`);
    
    return imagePath;
  } catch (error) {
    console.error(`Error saving base64 image: ${error}`);
    throw error;
  }
}

// Function to check if YOLOv8 API is running and model is loaded
async function checkYoloApiStatus() {
  try {
    // Get the API port
    const port = getApiPort();
    const YOLO_URL = `http://localhost:${port}`;
    
    // Check API status including model status
    const response = await axios.get(`${YOLO_URL}/model-status`, {
      timeout: 2000
    });
    
    // Log model status for debugging
    console.log('YOLO model status:', response.data);
    
    // Check if model path matches expected path
    const expectedPath = path.join(process.cwd(), 'api', 'best.pt');
    const actualPath = response.data.model_path;
    
    if (actualPath && actualPath !== expectedPath) {
      console.warn(`Model loaded from unexpected path: ${actualPath}`);
    }
    
    return {
      isRunning: true,
      modelLoaded: response.data.model_loaded,
      details: response.data,
      modelPath: actualPath
    };
  } catch (error) {
    console.error(`Error checking YOLO API status: ${error.message}`);
    return {
      isRunning: false,
      modelLoaded: false,
      details: { error: error.message }
    };
  }
}

// Function to process image through YOLOv8 API
async function processImageWithYolo(imagePath) {
  try {
    // Get API URL
    const port = getApiPort();
    const YOLO_URL = `http://localhost:${port}`;
    
    // Create form data for the API request
    const formData = new FormData();
    const fileStream = fs.createReadStream(imagePath);  // Using synchronous fs
    formData.append('file', fileStream);
    
    // Call the YOLOv8 API
    console.log(`Sending request to ${YOLO_URL}/analyze`);
    const response = await axios.post(`${YOLO_URL}/analyze`, formData, {
      headers: formData.getHeaders(),
      timeout: 30000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error calling YOLOv8 API: ${error}`);
    throw error;
  }
}

// Function to interpret YOLO results for skin analysis
function interpretYoloResults(yoloResults) {
  // Default response structure
  const analysis = {
    skinConditions: [],
    skinType: "Normal",
    annotatedImage: yoloResults.annotated_image || null
  };
  
  // Process the detections
  if (yoloResults.detections && yoloResults.detections.length > 0) {
    const detections = yoloResults.detections;
    
    // Map detected classes to skin conditions
    const detectedClasses = detections.map(d => d.class);
    
    // Add each unique class to skin conditions
    detectedClasses.forEach(cls => {
      if (!analysis.skinConditions.includes(cls)) {
        analysis.skinConditions.push(cls);
      }
    });
    
    // Determine skin type based on detected conditions (simplified logic)
    if (analysis.skinConditions.includes('acne') || analysis.skinConditions.includes('pimples')) {
      analysis.skinType = "Oily/Acne-Prone";
    } else if (analysis.skinConditions.includes('dryness')) {
      analysis.skinType = "Dry";
    } else if (analysis.skinConditions.includes('redness') || analysis.skinConditions.includes('sensitivity')) {
      analysis.skinType = "Sensitive";
    }
  }
  
  return analysis;
}

// POST handler for analyzing skin images
export async function POST(request) {
  let imagePath = null;
  
  try {
    // Parse the request body
    const body = await request.json();
    
    // Check if image data is provided
    const base64Image = body.image;
    if (!base64Image) {
      return NextResponse.json({
        status: 'error',
        message: 'No image data provided'
      }, { status: 400 });
    }
    
    // Check YOLO API status
    const apiStatus = await checkYoloApiStatus();
    
    // If API is not running or model is not loaded, return informative error
    if (!apiStatus.isRunning) {
      return NextResponse.json({
        status: 'error',
        message: 'YOLOv8 API is not running. Please try starting it first.',
        apiStatus
      }, { status: 500 });
    }
    
    if (!apiStatus.modelLoaded) {
      return NextResponse.json({
        status: 'error',
        message: 'YOLOv8 model is not loaded. Please check model installation.',
        apiStatus
      }, { status: 500 });
    }
    
    // Save image to temp file
    imagePath = await saveBase64ImageToFile(base64Image);
    
    // Process image with YOLO
    const yoloResults = await processImageWithYolo(imagePath);
    
    // Interpret YOLO results for skin analysis
    const analysis = interpretYoloResults(yoloResults);
    
    // Clean up temporary file
    if (imagePath) {
      try {
        await fsPromises.unlink(imagePath);
      } catch (cleanupError) {
        console.error(`Error deleting temporary file: ${cleanupError}`);
      }
    }
    
    // Return analysis results
    return NextResponse.json({
      status: 'success',
      ...analysis
    });
  } catch (error) {
    // Clean up temporary file if there was an error
    if (imagePath) {
      try {
        await fsPromises.unlink(imagePath);
        console.log(`Deleted temporary file after error: ${imagePath}`);
      } catch (cleanupError) {
        console.error(`Error deleting temporary file: ${cleanupError}`);
      }
    }
    
    console.error(`Error in skin analysis: ${error.message}`);
    return NextResponse.json({
      status: 'error',
      message: error.message || 'An error occurred during skin analysis'
    }, { status: 500 });
  }
}
