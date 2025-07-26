import { NextResponse } from 'next/server';
import { 
  getProductRecommendations, 
  getIngredientRecommendations, 
  getProductsByIngredient,
  formatRecommendations,
  parseUserMessage 
} from '@/utils/recommendations';
import { getUserByEmail } from '@/lib/redis';

// Helper function to extract user data from auth token
async function getUserFromToken(authToken) {
  if (!authToken) return null;
  
  try {
    const decodedToken = Buffer.from(authToken, 'base64').toString('utf8');
    const email = decodedToken.split('-')[0];
    
    if (!email) return null;
    
    const user = await getUserByEmail(email);
    return user;
  } catch (error) {
    console.error('Error extracting user from token:', error);
    return null;
  }
}

export async function POST(request) {
  try {
    const { message, model = 'orca-mini:latest' } = await request.json();
    
    // Get auth token from headers to identify the user
    const authToken = request.headers.get('authorization');
    
    // Extract user data for personalized recommendations
    const userData = await getUserFromToken(authToken);

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
    
    // Detect personal profile questions
    const isPersonalProfileQuery = messageLower.includes('about me') || 
      messageLower.includes('about myself') || 
      messageLower.includes('my profile') || 
      messageLower.includes('my skin') || 
      messageLower.includes('tell me about') ||
      (messageLower.includes('what') && (messageLower.includes('my skin type') || messageLower.includes('my concerns')));

    // Handle recommendation requests with our local data
    if (isProductRecommendationRequest || isIngredientRecommendationRequest || 
        isSpecificIngredientQuery || isGeneralSkincareQuery) {
      
      // Parse user message for explicit preferences
      const { skinType, concerns, category, mentionedIngredients } = parseUserMessage(message);
      
      // Use user's profile data if available, otherwise use parsed data from message
      const finalSkinType = userData?.skinType?.toLowerCase() || skinType;
      const finalConcerns = userData?.skinConcerns?.length > 0 ? 
        userData.skinConcerns.map(c => c.toLowerCase()) : concerns;
      
      let recommendationResponse = '';
      
      // Add personalized greeting if user is logged in
      if (userData) {
        const userFirstName = userData.firstName || 'there';
        recommendationResponse += `Hi ${userFirstName}! Based on your profile `;
        
        if (userData.skinType) {
          recommendationResponse += `(${userData.skinType} skin`;
          if (userData.skinConcerns?.length > 0) {
            recommendationResponse += `, concerns: ${userData.skinConcerns.join(', ')}`;
          }
          recommendationResponse += '), ';
        }
        
        recommendationResponse += `here are my personalized recommendations:\n\n`;
      }
      
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
            getProductRecommendations(finalSkinType, finalConcerns, category, 3);
          
          const responsePrefix = mentionedIngredients.length === 1 
            ? `Based on your request for products with ${mentionedIngredients[0]}:\n\n`
            : `Based on your request for products with specific ingredients:\n\n`;
          
          if (!userData) {
            recommendationResponse += responsePrefix;
          }
        } else {
          // Regular product recommendations using user profile or parsed data
          products = getProductRecommendations(finalSkinType, finalConcerns, category, 3);
          
          if (!userData) {
            const skinTypeText = finalSkinType !== 'all' ? ` for ${finalSkinType} skin` : '';
            const concernText = finalConcerns.length > 0 ? ` targeting ${finalConcerns.join(' and ')}` : '';
            const categoryText = category ? ` in the ${category} category` : '';
            
            recommendationResponse += `Here are my product recommendations${skinTypeText}${concernText}${categoryText}:\n\n`;
          }
        }
        
        recommendationResponse += formatRecommendations(products, 'products');
      }
      
      // Handle ingredient recommendations
      if (isIngredientRecommendationRequest || (isGeneralSkincareQuery && finalConcerns.length > 0)) {
        const ingredients = getIngredientRecommendations(finalSkinType, finalConcerns, 3);
        
        if (recommendationResponse) {
          recommendationResponse += `\n\n**Recommended Ingredients for your ${finalSkinType} skin:**\n\n`;
        } else {
          const ingredientPrefix = userData ? 
            `Based on your profile, here are the best ingredients for your skin:\n\n` :
            `Here are the best ingredients${finalSkinType !== 'all' ? ` for ${finalSkinType} skin` : ''}${finalConcerns.length > 0 ? ` to address ${finalConcerns.join(' and ')}` : ''}:\n\n`;
          recommendationResponse += ingredientPrefix;
        }
        
        recommendationResponse += formatRecommendations(ingredients, 'ingredients');
      }
      
      // Add helpful tips if no specific recommendations found
      if (!recommendationResponse || recommendationResponse.includes("I couldn't find any")) {
        const personalizedTip = userData ? 
          `Based on your profile (${userData.skinType} skin), I can provide better recommendations if you're more specific about what you're looking for!\n\n` :
          `I understand you're looking for skincare advice! While I didn't find specific matches in our database, I can help you with general guidance.\n\n`;
          
        recommendationResponse = personalizedTip +
          `For better recommendations, try being more specific about:\n` +
          `- Product type you're looking for (cleanser, serum, moisturizer)\n` +
          `- Specific concerns you want to address\n` +
          `- Ingredients you're interested in\n\n` +
          `For example: "Recommend a vitamin C serum for acne" or "Best moisturizer for my skin type"`;
      }
      
      // Add allergy warning if user has specified allergies
      if (userData?.allergies && recommendationResponse && !recommendationResponse.includes("allergy")) {
        recommendationResponse += `\n\n⚠️ **Important**: You mentioned having allergies to: ${userData.allergies}. Please check product ingredients carefully before use.`;
      }
      
      // Add user-specific context to the response data
      const responseData = {
        skinType: finalSkinType, 
        concerns: finalConcerns, 
        category, 
        mentionedIngredients,
        userProfile: userData ? {
          skinType: userData.skinType,
          skinConcerns: userData.skinConcerns,
          name: userData.firstName,
          allergies: userData.allergies,
          experience: userData.skincareExperience,
          goals: userData.goals
        } : null
      };
      
      // Return recommendation without calling Ollama
      return NextResponse.json({
        message: recommendationResponse,
        model: 'dermify-recommendations',
        timestamp: new Date().toISOString(),
        isRecommendation: true,
        parsedData: responseData
      });
    }

    // Handle personal profile questions
    if (isPersonalProfileQuery && userData) {
      const userFirstName = userData.firstName || 'User';
      let profileResponse = `Hi ${userFirstName}! Here's what I know about your skincare profile:\n\n`;
      
      profileResponse += `**👤 Personal Information:**\n`;
      profileResponse += `- Name: ${userData.firstName} ${userData.lastName || ''}\n`;
      profileResponse += `- Age Range: ${userData.ageRange || 'Not specified'}\n\n`;
      
      profileResponse += `**🔬 Skin Profile:**\n`;
      profileResponse += `- Skin Type: ${userData.skinType || 'Not specified'}\n`;
      profileResponse += `- Main Concerns: ${userData.skinConcerns?.length > 0 ? userData.skinConcerns.join(', ') : 'None specified'}\n`;
      if (userData.allergies) {
        profileResponse += `- Allergies/Sensitivities: ${userData.allergies}\n`;
      }
      profileResponse += `\n`;
      
      profileResponse += `**💡 Experience & Goals:**\n`;
      profileResponse += `- Skincare Experience: ${userData.skincareExperience || 'Not specified'}\n`;
      profileResponse += `- Goals: ${userData.goals || 'Not specified'}\n`;
      profileResponse += `- Budget: ${userData.budget || 'Not specified'}\n`;
      profileResponse += `- Lifestyle: ${userData.lifestyle || 'Not specified'}\n\n`;
      
      if (userData.currentRoutine) {
        profileResponse += `**🧴 Current Routine:**\n${userData.currentRoutine}\n\n`;
      }
      
      profileResponse += `Based on this profile, I can provide personalized skincare recommendations! Try asking me:\n`;
      profileResponse += `- "What products should I use?"\n`;
      profileResponse += `- "Help me with my ${userData.skinConcerns?.[0] || 'skin concerns'}"\n`;
      profileResponse += `- "Recommend a routine for my skin type"\n`;
      
      if (userData.allergies) {
        profileResponse += `\n⚠️ **Important**: I'll always consider your allergies (${userData.allergies}) when making recommendations.`;
      }
      
      return NextResponse.json({
        message: profileResponse,
        model: 'dermify-profile',
        timestamp: new Date().toISOString(),
        isRecommendation: false,
        parsedData: {
          userProfile: {
            skinType: userData.skinType,
            skinConcerns: userData.skinConcerns,
            name: userData.firstName,
            allergies: userData.allergies,
            experience: userData.skincareExperience,
            goals: userData.goals
          }
        }
      });
    } else if (isPersonalProfileQuery && !userData) {
      const profileResponse = `I'd love to tell you about your skincare profile, but I don't have access to your personal information right now.\n\n` +
        `To get personalized skincare advice, please:\n` +
        `1. **Sign in** to your account\n` +
        `2. **Complete your profile** in the onboarding process\n\n` +
        `Once you've done that, I'll be able to provide personalized recommendations based on your:\n` +
        `- Skin type and concerns\n` +
        `- Age and experience level\n` +
        `- Allergies and preferences\n` +
        `- Skincare goals\n\n` +
        `In the meantime, feel free to ask me general skincare questions!`;
      
      return NextResponse.json({
        message: profileResponse,
        model: 'dermify-profile',
        timestamp: new Date().toISOString(),
        isRecommendation: false,
        parsedData: { userProfile: null }
      });
    }

    // Create system prompt for skincare assistance with user context
    let systemPrompt = `You are a knowledgeable skincare assistant for Dermify, a skincare analysis platform. 
    You help users with:
    - Skincare ingredient analysis and safety
    - Product recommendations based on skin type and concerns
    - Understanding skincare routines
    - Explaining safety scores and ingredient effects
    - General skincare advice and education
    
    Keep responses helpful, accurate, and focused on skincare topics. If asked about medical conditions, advise users to consult a dermatologist.
    Be concise but informative. Use a friendly, professional tone.`;
    
    // Add user-specific context to system prompt if available
    if (userData) {
      systemPrompt += `\n\nUSER PROFILE CONTEXT:
      - Name: ${userData.firstName || 'User'}
      - Skin Type: ${userData.skinType || 'Not specified'}
      - Skin Concerns: ${userData.skinConcerns?.length > 0 ? userData.skinConcerns.join(', ') : 'Not specified'}
      - Age Range: ${userData.ageRange || 'Not specified'}
      - Skincare Experience: ${userData.skincareExperience || 'Not specified'}
      - Allergies/Sensitivities: ${userData.allergies || 'None specified'}
      - Current Routine: ${userData.currentRoutine || 'Not specified'}
      - Goals: ${userData.goals || 'Not specified'}
      - Budget: ${userData.budget || 'Not specified'}
      - Lifestyle: ${userData.lifestyle || 'Not specified'}
      
      IMPORTANT PERSONALIZATION GUIDELINES:
      - Address the user by their first name when appropriate
      - Always consider their specific skin type and concerns when giving advice
      - Adjust complexity of explanations based on their skincare experience level
      - If they have allergies, always mention to check ingredients and avoid known allergens
      - Reference their goals when making recommendations
      - Consider their lifestyle when suggesting routine complexity
      - Use this profile information to provide highly personalized and relevant advice`;
    }
    
    systemPrompt += `\n\nIMPORTANT: Our system has an intelligent recommendation engine that can provide personalized product and ingredient suggestions. 
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
