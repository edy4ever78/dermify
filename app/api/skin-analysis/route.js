'use server'

import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import axios from 'axios'
import FormData from 'form-data'
import fs from 'fs'
import os from 'os'

// Get the port from the port file
const getApiPort = () => {
  try {
    const portFilePath = join(process.cwd(), 'api', 'yolo_api_port.txt')
    if (fs.existsSync(portFilePath)) {
      const port = fs.readFileSync(portFilePath, 'utf8').trim()
      console.log(`Found YOLOv8 API port in file: ${port}`)
      return parseInt(port, 10)
    }
  } catch (error) {
    console.error('Error reading port file:', error)
  }
  return 5000 // Default port if file doesn't exist
}

// Ensure temp directory exists
async function ensureTempDir() {
  // Get system temp directory
  const tempDir = join(os.tmpdir(), 'dermify')
  
  try {
    // Check if directory exists, if not create it
    await fs.promises.mkdir(tempDir, { recursive: true })
    console.log(`Temporary directory created/verified: ${tempDir}`)
    return tempDir
  } catch (error) {
    console.error(`Error creating temporary directory: ${error}`)
    throw error
  }
}

export async function uploadImageForAnalysis(formData) {
  try {
    // Get the file data from the FormData object
    const file = formData.get('file')
    
    if (!file) {
      return { error: 'No file provided' }
    }

    // Create a buffer from the file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create a unique filename
    const uniqueId = uuidv4()
    const filename = `image-${uniqueId}.jpg`
    
    // Ensure temp directory exists and get its path
    const tempDir = await ensureTempDir()
    const filepath = join(tempDir, filename)

    // Write the file to disk
    await writeFile(filepath, buffer)
    console.log(`File saved to ${filepath}`)

    // Get the API port
    const port = getApiPort()
    const FLASK_URL = `http://localhost:${port}`

    // Create a FormData object for the API request
    const apiFormData = new FormData()
    const fileStream = fs.createReadStream(filepath)
    apiFormData.append('file', fileStream)

    // Make the API request
    console.log(`Sending request to ${FLASK_URL}/analyze`)
    const response = await axios.post(`${FLASK_URL}/analyze`, apiFormData, {
      headers: apiFormData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    })

    // Delete the temporary file
    try {
      fs.unlinkSync(filepath)
      console.log(`Deleted temporary file: ${filepath}`)
    } catch (error) {
      console.error(`Error deleting temporary file: ${error.message}`)
    }

    // Return the API response
    return response.data
  } catch (error) {
    console.error('Error in uploadImageForAnalysis:', error)
    
    // Get detailed error information
    let errorMessage
    if (error.response) {
      errorMessage = `API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`
      console.error('Error response data:', error.response.data)
    } else if (error.request) {
      errorMessage = `No response received: ${error.message}`
    } else {
      errorMessage = `Request setup error: ${error.message}`
    }
    
    return { error: errorMessage }
  }
}