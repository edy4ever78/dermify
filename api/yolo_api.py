from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import uvicorn
import os
import shutil
import tempfile
from PIL import Image
import io
import base64
import socket
import random
import logging
import requests
import traceback

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("yolo_api")

app = FastAPI()

# Add CORS middleware to allow requests from the Next.js application
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your actual domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables to track model status
model = None
model_path = None
model_error = None

def load_model():
    global model, model_path, model_error
    
    # Reset error state
    model_error = None
    
    # List of possible model locations to try, with the known location first
    possible_paths = [
        os.path.join(os.path.dirname(__file__), "best.pt"),  # This should find the model
        os.path.join(os.path.dirname(os.path.dirname(__file__)), "public", "models", "best.pt"),
        os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "best.pt"),
    ]
    
    # Log all possible paths for debugging
    for path in possible_paths:
        logger.info(f"Checking for model at: {path}")
        if os.path.exists(path):
            logger.info(f"Found model file at: {path}")
    
    # Try to load the model from each location
    for path in possible_paths:
        try:
            if os.path.exists(path):
                logger.info(f"Attempting to load model from: {path}")
                model = YOLO(path)
                model_path = path
                logger.info(f"Successfully loaded YOLOv8 model from: {path}")
                return True
        except Exception as e:
            error_msg = f"Error loading model from {path}: {str(e)}"
            logger.error(error_msg)
            model_error = error_msg
    
    # If we get here, we couldn't find the model
    model = None
    if not model_error:
        model_error = "Model file not found in any of the expected locations"
    logger.error(model_error)
    return False

# Try to load the model on startup
load_model()

@app.get("/")
def read_root():
    return {"status": "YOLOv8 Skin Analysis API is running", "model_loaded": model is not None}

@app.get("/model-status")
def model_status():
    """Endpoint to check if the model is loaded and its status"""
    return {
        "model_loaded": model is not None,
        "status": "YOLOv8 model is loaded and ready" if model is not None else "YOLOv8 model is not loaded",
        "model_path": model_path if model is not None else None,
        "error": model_error
    }

@app.post("/analyze")
async def analyze_image(file: UploadFile = File(...)):
    if model is None:
        # Try to load the model again
        load_model()
        if model is None:
            raise HTTPException(status_code=500, detail="YOLOv8 model is not loaded")
    
    # Log information about the received file
    logger.info(f"Received file: {file.filename}, content_type: {file.content_type}")
    
    # Read the content of the file first
    file_content = await file.read()
    logger.info(f"Read file content, size: {len(file_content)} bytes")
    
    if len(file_content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")
    
    # Create a temporary file
    with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp:
        temp.write(file_content)
        temp_path = temp.name
    
    try:
        # Log the temp file path
        logger.info(f"Processing image file: {temp_path}")
        
        # Verify the file exists and has content
        file_size = os.path.getsize(temp_path)
        logger.info(f"File size: {file_size} bytes")
        
        if file_size == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty after writing to disk")
            
        # Try to open with PIL to verify it's a valid image
        try:
            with Image.open(io.BytesIO(file_content)) as img:
                img_format = img.format
                img_size = img.size
                logger.info(f"Successfully verified image with PIL: format={img_format}, size={img_size}")
                
                # Save the verified image to the temp file
                img.save(temp_path)
        except Exception as e:
            logger.error(f"Error opening image with PIL: {str(e)}")
            
            # Try to debug the file content
            logger.info(f"First 20 bytes of file: {file_content[:20]}")
            if len(file_content) > 2 and file_content[:2] == b'\xff\xd8':
                logger.info("File starts with JPEG magic bytes")
            elif len(file_content) > 8 and file_content[:8] == b'\x89PNG\r\n\x1a\n':
                logger.info("File starts with PNG magic bytes")
            else:
                logger.info("File does not start with recognized image format bytes")
            
            raise HTTPException(status_code=400, detail=f"Invalid image file: {str(e)}")
        
        # Run YOLOv8 inference on the image
        try:
            results = model(temp_path)
            logger.info("Successfully ran YOLO model on image")
        except Exception as e:
            logger.error(f"Error during model inference: {str(e)}")
            logger.error(traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"Model inference error: {str(e)}")
        
        # Process results
        result_data = []
        for result in results:
            boxes = result.boxes
            for i, box in enumerate(boxes):
                # Get box coordinates
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                
                # Get confidence
                confidence = box.conf[0].item()
                
                # Get class name
                class_id = int(box.cls[0].item())
                class_name = result.names[class_id]
                
                # Add to results
                result_data.append({
                    "box": [x1, y1, x2, y2],
                    "confidence": confidence,
                    "class": class_name
                })
        
        logger.info(f"Found {len(result_data)} detections")
        
        # Generate an annotated image
        try:
            annotated_img = results[0].plot()
            
            # Convert to base64 for sending to client
            img_pil = Image.fromarray(annotated_img)
            buffer = io.BytesIO()
            img_pil.save(buffer, format="JPEG")
            img_base64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
        except Exception as e:
            logger.error(f"Error generating annotated image: {str(e)}")
            img_base64 = None
        
        # Remove the temporary file
        os.unlink(temp_path)
        
        return {
            "status": "success",
            "detections": result_data,
            "annotated_image": img_base64
        }
    
    except Exception as e:
        # Log the error
        logger.error(f"Error during image analysis: {str(e)}")
        logger.error(traceback.format_exc())
        
        # Ensure temp file is removed even if there's an error
        if os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
                logger.info(f"Deleted temporary file after error: {temp_path}")
            except Exception as del_err:
                logger.error(f"Error deleting temporary file: {str(del_err)}")
        
        raise HTTPException(status_code=500, detail=str(e))

def find_available_port(start_port=5000, max_attempts=20):
    """Find an available port starting from start_port."""
    for attempt in range(max_attempts):
        port = start_port + attempt
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        try:
            sock.bind(('0.0.0.0', port))
            sock.close()
            return port
        except socket.error:
            logger.info(f"Port {port} is already in use, trying next port...")
            continue
    
    # If we couldn't find a port in sequence, try a random port in a higher range
    return random.randint(8000, 9000)

if __name__ == "__main__":
    # Find an available port
    port = find_available_port()
    logger.info(f"Starting YOLOv8 API server on port: {port}")
    
    # Create a file to store the current port
    port_file = os.path.join(os.path.dirname(__file__), "yolo_api_port.txt")
    with open(port_file, "w") as f:
        f.write(str(port))
    
    # Run the API server
    uvicorn.run(app, host="0.0.0.0", port=port)