import { spawn } from 'child_process';
import axios from 'axios';
import path from 'path';
import FormData from 'form-data';
import fs from 'fs';
import { Readable } from 'stream';

// Configuration for the Flask API
let FLASK_URL = 'http://localhost:5000'; // Default, will be updated dynamically
let flaskProcess = null;
let isStarting = false;
const YOLO_VERSION = 'v8'; // Explicitly set YOLO version

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

// Function to start the Flask API
async function startFlaskApi() {
  if (flaskProcess || isStarting) return;
  
  isStarting = true;
  
  // Get the path to the Python script
  const scriptPath = path.join(process.cwd(), 'api', 'yolo_api.py');
  
  console.log('Starting YOLOv8 API:', scriptPath);
  
  try {
    // Start the Python API
    flaskProcess = spawn('python', [scriptPath], {
      detached: false,
      stdio: 'pipe'
    });
    
    // Log stdout (for debugging)
    flaskProcess.stdout.on('data', (data) => {
      const message = data.toString();
      console.log(`YOLOv8 API stdout: ${message}`);
      
      // Check if the message contains the port information
      const portMatch = message.match(/Starting YOLOv8 API server on port: (\d+)/);
      if (portMatch && portMatch[1]) {
        const port = parseInt(portMatch[1], 10);
        FLASK_URL = `http://localhost:${port}`;
        console.log(`Updated API URL to: ${FLASK_URL}`);
      }
    });
    
    // Log stderr (for debugging)
    flaskProcess.stderr.on('data', (data) => {
      console.error(`YOLOv8 API stderr: ${data}`);
    });
    
    // Handle process exit
    flaskProcess.on('close', (code) => {
      console.log(`YOLOv8 API process exited with code ${code}`);
      flaskProcess = null;
      isStarting = false;
    });
    
    // Wait a bit for the API to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Get the port from the file after waiting
    const port = getApiPort();
    FLASK_URL = `http://localhost:${port}`;
    console.log(`API URL after waiting: ${FLASK_URL}`);
    
    isStarting = false;
    console.log('YOLOv8 API started successfully');
  } catch (error) {
    console.error('Error starting YOLOv8 API:', error);
    flaskProcess = null;
    isStarting = false;
    throw error;
  }
}

// Export API route configuration
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  const { method } = req;
  
  // Update the API URL each time the handler is called
  const port = getApiPort();
  FLASK_URL = `http://localhost:${port}`;
  console.log(`Current API URL: ${FLASK_URL}`);
  
  switch (method) {
    case 'GET':
      // Check if the API is running
      try {
        const response = await axios.get(FLASK_URL, { timeout: 2000 });
        return res.status(200).json({
          status: 'running',
          message: response.data,
          yoloVersion: YOLO_VERSION
        });
      } catch (error) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
          return res.status(200).json({
            status: 'stopped',
            message: 'YOLOv8 API is not running',
            yoloVersion: YOLO_VERSION
          });
        }
        
        console.error('Error in GET handler:', error.message);
        return res.status(200).json({
          status: 'error',
          message: `Error connecting to API: ${error.message}`,
          yoloVersion: YOLO_VERSION
        });
      }
      
    case 'PUT':
      // Start or restart the API
      try {
        // Kill existing process if it exists
        if (flaskProcess) {
          flaskProcess.kill();
          flaskProcess = null;
        }
        
        await startFlaskApi();
        
        return res.status(200).json({
          status: 'starting',
          message: 'YOLOv8 API is restarting'
        });
      } catch (error) {
        console.error('Error in PUT handler:', error);
        return res.status(500).json({
          status: 'error',
          message: error.message
        });
      }
      
    case 'POST':
      // Proxy the image analysis request to Flask API
      try {
        // Make sure API is running
        if (!flaskProcess && !isStarting) {
          await startFlaskApi();
          // Wait a bit for the API to initialize
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
        
        // Update the URL with the latest port
        const port = getApiPort();
        FLASK_URL = `http://localhost:${port}`;
        
        // Get the buffer from the request body
        const buffer = Buffer.from(req.body);
        
        // Debug info
        console.log(`Image data size: ${buffer.length} bytes`);
        
        // Create FormData instance
        const formData = new FormData();
        
        // Check if the buffer looks like an image by examining the first few bytes
        let imageFormat = 'jpeg';
        if (buffer.length > 2 && buffer[0] === 0xFF && buffer[1] === 0xD8) {
          console.log('Detected JPEG format');
          imageFormat = 'jpeg';
        } else if (buffer.length > 8 && 
                  buffer[0] === 0x89 && buffer[1] === 0x50 && 
                  buffer[2] === 0x4E && buffer[3] === 0x47) {
          console.log('Detected PNG format');
          imageFormat = 'png';
        } else {
          console.log('Unknown image format, assuming JPEG');
        }
        
        // Create a Buffer instance to hold our image data
        const stream = Readable.from(buffer);
        
        // Append to form data with appropriate filename and content type
        formData.append('file', stream, {
          filename: `image.${imageFormat}`,
          contentType: `image/${imageFormat}`,
          knownLength: buffer.length
        });
        
        console.log(`Sending request to ${FLASK_URL}/analyze with content type ${imageFormat}`);
        
        // Send request to Flask API with extra debug options
        const response = await axios.post(`${FLASK_URL}/analyze`, formData, {
          headers: {
            ...formData.getHeaders()
          },
          timeout: 60000, // 60 second timeout
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        });
        
        // Return the results
        return res.status(200).json(response.data);
      } catch (error) {
        console.error('Error in POST handler:', error);
        
        // Get detailed error information
        let errorMessage;
        if (error.response) {
          errorMessage = `API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`;
          console.error('Error response data:', error.response.data);
        } else if (error.request) {
          errorMessage = `No response received: ${error.message}`;
        } else {
          errorMessage = `Request setup error: ${error.message}`;
        }
        
        return res.status(500).json({
          status: 'error',
          message: errorMessage
        });
      }
      
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'POST']);
      return res.status(405).json({ status: 'error', message: `Method ${method} Not Allowed` });
  }
}
