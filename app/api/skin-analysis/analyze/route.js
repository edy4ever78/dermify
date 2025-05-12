import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import FormData from 'form-data';
import axios from 'axios';

// Get the port from the port file
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

// Ensure temp directory exists
async function ensureTempDir() {
  const tempDir = path.join(os.tmpdir(), 'dermify');
  
  try {
    // Check if directory exists, if not create it
    await fs.promises.mkdir(tempDir, { recursive: true });
    console.log(`Temporary directory created/verified: ${tempDir}`);
    return tempDir;
  } catch (error) {
    console.error(`Error creating temporary directory: ${error}`);
    throw error;
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.image) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }
    
    // Get base64 image data
    const base64Image = data.image;
    const imageBuffer = Buffer.from(base64Image, 'base64');
    
    // Create a temporary file
    const tempDir = await ensureTempDir();
    const filename = `analysis-${uuidv4()}.jpg`;
    const tempFilePath = path.join(tempDir, filename);
    
    // Write the file to disk
    await writeFile(tempFilePath, imageBuffer);
    console.log(`Image saved to ${tempFilePath}`);
    
    try {
      // Get the API port
      const port = getApiPort();
      const YOLO_URL = `http://localhost:${port}`;
      
      // Create form data for API request
      const formData = new FormData();
      formData.append('file', fs.createReadStream(tempFilePath));
      
      console.log(`Sending request to ${YOLO_URL}/analyze`);
      
      // Call the YOLOv8 API
      const response = await axios.post(`${YOLO_URL}/analyze`, formData, {
        headers: formData.getHeaders(),
        timeout: 30000, // 30 second timeout
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      });
      
      // Process the API response
      const result = response.data;
      console.log('Successfully received analysis results from YOLOv8 API');
      
      // Clean up the temporary file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
        console.log(`Deleted temporary file: ${tempFilePath}`);
      }
      
      // Get the detections from the result
      const detections = result.detections || [];
      
      // Extract skin conditions and deduplicate them
      const skinConditionSet = new Set(detections.map(detection => detection.class));
      const skinConditions = Array.from(skinConditionSet);
      
      // Determine skin type based on detected conditions
      let skinType = "Normal";
      if (skinConditions.includes('oily') || skinConditions.includes('acne')) {
        skinType = "Oily";
      } else if (skinConditions.includes('dry') || skinConditions.includes('flaky')) {
        skinType = "Dry";
      } else if (skinConditions.includes('sensitive') || skinConditions.includes('redness')) {
        skinType = "Sensitive";
      } else if (skinConditions.includes('combination')) {
        skinType = "Combination";
      }
      
      // Save analysis to history (would normally use database)
      const analysisRecord = {
        id: uuidv4(),
        date: new Date().toISOString(),
        skinType: skinType,
        skinConditions: skinConditions.length > 0 ? skinConditions : ['normal skin'],
        annotatedImage: result.annotated_image
      };
      
      // Here you would typically save to a database
      // For now, we'll simply return the analysis
      
      return NextResponse.json({
        skinConditions: skinConditions.length > 0 ? skinConditions : ['normal skin'],
        skinType,
        annotatedImage: result.annotated_image || null,
        date: analysisRecord.date,
        id: analysisRecord.id
      });
    } catch (error) {
      // Clean up the temporary file in case of error
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
        console.log(`Deleted temporary file after error: ${tempFilePath}`);
      }
      
      console.error('Error calling YOLOv8 API:', error);
      
      if (error.code === 'ECONNREFUSED') {
        // YOLOv8 API is not running
        return NextResponse.json({ 
          error: 'The skin analysis service is currently not running. Please try again in a moment.'
        }, { status: 503 });
      }
      
      // Detailed error logging
      if (error.response) {
        // The request was made but the server responded with an error
        console.error('API error response:', error.response.status, error.response.data);
        return NextResponse.json({ 
          error: `YOLOv8 API error: ${error.response.status}` 
        }, { status: error.response.status });
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from YOLOv8 API');
        return NextResponse.json({ 
          error: 'No response from skin analysis service' 
        }, { status: 504 });
      }
      
      return NextResponse.json({ 
        error: `An error occurred: ${error.message}` 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ 
      error: 'An unexpected error occurred during analysis'
    }, { status: 500 });
  }
}
