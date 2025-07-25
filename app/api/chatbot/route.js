import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { message, model = 'orca-mini:latest' } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Create system prompt for skincare assistance
    const systemPrompt = `You are a knowledgeable skincare assistant for Dermify, a skincare analysis platform. 
    You help users with:
    - Skincare ingredient analysis and safety
    - Product recommendations based on skin type and concerns
    - Understanding skincare routines
    - Explaining safety scores and ingredient effects
    - General skincare advice and education
    
    Keep responses helpful, accurate, and focused on skincare topics. If asked about medical conditions, advise users to consult a dermatologist.
    Be concise but informative. Use a friendly, professional tone.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];

    // Call Ollama API
    const ollamaResponse = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: false,
        options: {
          temperature: 0.7,
          top_p: 0.9,
          max_tokens: 500
        }
      }),
    });

    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      console.error('Ollama API error:', ollamaResponse.status, errorText);
      
      return NextResponse.json(
        { 
          error: 'Chatbot service unavailable',
          details: `Ollama API returned ${ollamaResponse.status}`,
          suggestion: 'Please ensure Docker container is running with: docker-compose up -d'
        },
        { status: 503 }
      );
    }

    const data = await ollamaResponse.json();
    
    return NextResponse.json({
      message: data.message?.content || "I'm sorry, I couldn't process your request.",
      model: model,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message,
        suggestion: 'Check if Docker container is running: docker-compose ps'
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const healthResponse = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      timeout: 5000
    });

    if (healthResponse.ok) {
      return NextResponse.json({ 
        status: 'healthy', 
        ollama: 'connected',
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({ 
        status: 'unhealthy', 
        ollama: 'disconnected',
        suggestion: 'Run: docker-compose up -d ollama'
      }, { status: 503 });
    }
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      ollama: 'unreachable',
      error: error.message,
      suggestion: 'Ensure Docker is running and Ollama container is started'
    }, { status: 503 });
  }
}
