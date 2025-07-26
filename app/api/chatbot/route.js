import { NextResponse } from 'next/server';
import { 
  getProductRecommendations, 
  getIngredientRecommendations, 
  getProductsByIngredient,
  formatRecommendations,
  parseUserMessage 
} from '@/utils/recommendations';

export async function POST(request) {
  try {
    const { message, model = 'orca-mini:latest' } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Check if the message is asking for recommendations - Enhanced pattern matching
    const messageLower = message.toLowerCase();
    
    // More comprehensive recommendation detection patterns
    const recommendationKeywords = [
      'recommend', 'suggest', 'advice', 'help', 'what should', 'best', 'good for',
      'find', 'looking for', 'need', 'want', 'show me', 'give me', 'tell me about'
    ];
    
    const productKeywords = [
      'product', 'cleanser', 'serum', 'moisturizer', 'cream', 'lotion', 
      'sunscreen', 'spf', 'exfoliant', 'toner', 'mask', 'treatment', 'routine'
    ];
    
    const ingredientKeywords = [
      'ingredient', 'retinol', 'vitamin c', 'hyaluronic', 'niacinamide', 
      'salicylic', 'glycolic', 'peptide', 'ceramide', 'zinc', 'aha', 'bha'
    ];
    
    const skinConcernKeywords = [
      'acne', 'pimple', 'breakout', 'aging', 'wrinkle', 'fine line', 
      'dark spot', 'hyperpigmentation', 'dryness', 'oily', 'sensitive', 
      'redness', 'dullness', 'blackhead', 'whitehead', 'scar'
    ];
    
    // Check if message contains recommendation patterns
    const hasRecommendationIntent = recommendationKeywords.some(keyword => 
      messageLower.includes(keyword)
    );
    
    const hasProductContext = productKeywords.some(keyword => 
      messageLower.includes(keyword)
    );
    
    const hasIngredientContext = ingredientKeywords.some(keyword => 
      messageLower.includes(keyword)
    );
    
    const hasSkinConcernContext = skinConcernKeywords.some(keyword => 
      messageLower.includes(keyword)
    );
    
    // Enhanced detection logic
    const isProductRecommendationRequest = (
      hasRecommendationIntent && hasProductContext
    ) || (
      hasProductContext && hasSkinConcernContext
    ) || (
      messageLower.includes('product') && (
        messageLower.includes('for') || messageLower.includes('with') || 
        messageLower.includes('that') || messageLower.includes('to')
      )
    );
    
    const isIngredientRecommendationRequest = (
      hasRecommendationIntent && hasIngredientContext && 
      !messageLower.includes('product')
    ) || (
      messageLower.includes('ingredient') && (
        hasRecommendationIntent || hasSkinConcernContext
      )
    );
    
    const isSpecificIngredientQuery = hasIngredientContext && (
      messageLower.includes('product') || messageLower.includes('with') || 
      messageLower.includes('contain') || messageLower.includes('have')
    );
    
    // Also detect general skincare advice that could benefit from recommendations
    const isGeneralSkincareQuery = (
      hasSkinConcernContext && !hasRecommendationIntent && 
      !messageLower.includes('what is') && !messageLower.includes('explain')
    );

    // Handle recommendation requests with our local data
    if (isProductRecommendationRequest || isIngredientRecommendationRequest || 
        isSpecificIngredientQuery || isGeneralSkincareQuery) {
      
      const { skinType, concerns, category, mentionedIngredients } = parseUserMessage(message);
      
      let recommendationResponse = '';
      
      // Handle product recommendations
      if (isProductRecommendationRequest || isSpecificIngredientQuery || isGeneralSkincareQuery) {
        let products;
        let responsePrefix = '';
        
        // Check for specific ingredients mentioned
        if (mentionedIngredients.length > 0) {
          // Find products with specific ingredients
          const ingredientProducts = mentionedIngredients.flatMap(ingredient => 
            getProductsByIngredient(ingredient, 2)
          );
          
          // Remove duplicates and get top products
          const uniqueProducts = Array.from(
            new Map(ingredientProducts.map(p => [p.id, p])).values()
          ).slice(0, 3);
          
          products = uniqueProducts.length > 0 ? uniqueProducts : 
            getProductRecommendations(skinType, concerns, category, 3);
          
          responsePrefix = mentionedIngredients.length === 1 
            ? `Based on your request for products with ${mentionedIngredients[0]}, here are my recommendations:\n\n`
            : `Based on your request for products with specific ingredients, here are my recommendations:\n\n`;
        } else {
          // Regular product recommendations
          products = getProductRecommendations(skinType, concerns, category, 3);
          
          const skinTypeText = skinType !== 'all' ? ` for ${skinType} skin` : '';
          const concernText = concerns.length > 0 ? ` targeting ${concerns.join(' and ')}` : '';
          const categoryText = category ? ` in the ${category} category` : '';
          
          responsePrefix = `Here are my product recommendations${skinTypeText}${concernText}${categoryText}:\n\n`;
        }
        
        recommendationResponse += responsePrefix + formatRecommendations(products, 'products');
      }
      
      // Handle ingredient recommendations
      if (isIngredientRecommendationRequest || (isGeneralSkincareQuery && concerns.length > 0)) {
        const ingredients = getIngredientRecommendations(skinType, concerns, 3);
        
        const skinTypeText = skinType !== 'all' ? ` for ${skinType} skin` : '';
        const concernText = concerns.length > 0 ? ` to address ${concerns.join(' and ')}` : '';
        
        if (recommendationResponse) {
          recommendationResponse += `\n\n**Recommended Ingredients${skinTypeText}${concernText}:**\n\n`;
        } else {
          recommendationResponse += `Here are the best ingredients${skinTypeText}${concernText}:\n\n`;
        }
        
        recommendationResponse += formatRecommendations(ingredients, 'ingredients');
      }
      
      // Add helpful tips if no specific recommendations found
      if (!recommendationResponse || recommendationResponse.includes("I couldn't find any")) {
        recommendationResponse = `I understand you're looking for skincare advice! While I didn't find specific matches in our database, I can help you with general guidance.\n\n` +
          `For better recommendations, try being more specific about:\n` +
          `- Your skin type (oily, dry, combination, sensitive, normal)\n` +
          `- Your main concerns (acne, aging, dark spots, dryness)\n` +
          `- Product type you're looking for (cleanser, serum, moisturizer)\n\n` +
          `For example: "Recommend a vitamin C serum for oily skin with dark spots"`;
      }
      
      // Return recommendation without calling Ollama
      return NextResponse.json({
        message: recommendationResponse,
        model: 'dermify-recommendations',
        timestamp: new Date().toISOString(),
        isRecommendation: true,
        parsedData: { skinType, concerns, category, mentionedIngredients }
      });
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
    Be concise but informative. Use a friendly, professional tone.
    
    IMPORTANT: Our system has an intelligent recommendation engine that can provide personalized product and ingredient suggestions. 
    If users ask about skincare concerns, skin types, or need product advice, encourage them to be specific about their needs.
    
    Examples of questions our recommendation system handles:
    - "I have oily skin with acne, what should I use?"
    - "Best moisturizer for dry sensitive skin"
    - "Products with vitamin C for dark spots"
    - "What ingredients help with aging?"
    - "My skin is dull and needs glow"
    - "Help with large pores and blackheads"
    
    When users ask general skincare questions, provide helpful information but also suggest they can get specific product recommendations by describing their skin type and concerns.`;

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
