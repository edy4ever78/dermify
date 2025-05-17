import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// In a real app, this would come from a database
// This is a simple file-based storage for demo purposes
const HISTORY_FILE = path.join(process.cwd(), 'data', 'analysis-history.json');

// Ensure history file exists
function ensureHistoryFile() {
  const dir = path.dirname(HISTORY_FILE);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  if (!fs.existsSync(HISTORY_FILE)) {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify([]));
  }
}

// Read history from file
function readHistory() {
  ensureHistoryFile();
  try {
    const data = fs.readFileSync(HISTORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading history file:', error);
    return [];
  }
}

// Write history to file
function writeHistory(history) {
  ensureHistoryFile();
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing history file:', error);
    return false;
  }
}

export async function GET(request) {
  try {
    // Get user ID from request header or query parameter
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'anonymous';
    
    // Read all history
    const allHistory = readHistory();
    
    // Filter history by user ID if provided
    let userHistory = allHistory;
    if (userId !== 'anonymous') {
      userHistory = allHistory.filter(item => item.userId === userId);
    }
    
    // Return the history
    return NextResponse.json({ history: userHistory });
  } catch (error) {
    console.error('Error retrieving analysis history:', error);
    return NextResponse.json({ 
      error: 'Failed to retrieve analysis history',
      history: [] 
    }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    if (!data.analysis) {
      return NextResponse.json({ error: 'No analysis data provided' }, { status: 400 });
    }
    
    // Get user ID from the request body instead of cookies
    const userId = data.userId || 'anonymous';
    
    // Ensure skin conditions are unique
    const skinConditions = data.analysis.skinConditions ? 
      [...new Set(data.analysis.skinConditions)] : [];
    
    // Create a history entry
    const historyEntry = {
      id: data.analysis.id,
      date: data.analysis.date || new Date().toISOString(),
      skinType: data.analysis.skinType,
      skinConditions: skinConditions,
      userId: userId,
      // Don't store the full annotated image in history to save space
      hasAnnotatedImage: !!data.analysis.annotatedImage
    };
    
    // Read existing history
    const history = readHistory();
    
    // Add new entry
    history.push(historyEntry);
    
    // Write updated history
    writeHistory(history);
    
    return NextResponse.json({ 
      success: true,
      entry: historyEntry
    });
  } catch (error) {
    console.error('Error saving analysis history:', error);
    return NextResponse.json({ 
      error: 'Failed to save analysis history'
    }, { status: 500 });
  }
}
