# Personalized Chatbot Enhancement

## Overview
The Dermify chatbot has been enhanced to provide personalized skincare recommendations based on user profile information from onboarding and dashboard data. The chatbot now recognizes authenticated users and tailors its responses using their skin type, concerns, preferences, and other profile data.

## 🚀 New Features

### 1. User Profile Integration
- **Automatic User Detection**: The chatbot extracts user information from authentication tokens
- **Profile-Based Recommendations**: Uses actual user skin type, concerns, and preferences instead of relying only on message parsing
- **Personalized Greetings**: Addresses users by their first name and references their specific profile

### 2. Enhanced Recommendation Engine
- **Priority System**: User profile data takes precedence over message-parsed information
- **Context-Aware Responses**: Combines user profile with message intent for better accuracy
- **Fallback Mechanism**: Still works for non-authenticated users with message parsing

### 3. Improved User Experience
- **Personalized Quick Actions**: Suggests profile-based queries like "Recommend products for my skin type"
- **Context Retention**: Remembers user preferences throughout the conversation
- **Smart Suggestions**: Provides targeted advice based on known user characteristics

## 🔧 Technical Implementation

### Backend Changes (`/api/chatbot/route.js`)

#### New User Data Extraction
```javascript
async function getUserFromToken(authToken) {
  if (!authToken) return null;
  
  try {
    const decodedToken = Buffer.from(authToken, 'base64').toString('utf8');
    const email = decodedToken.split('-')[0];
    const user = await getUserByEmail(email);
    return user;
  } catch (error) {
    return null;
  }
}
```

#### Enhanced Recommendation Logic
- Uses `userData.skinType` instead of parsed skin type when available
- Combines `userData.skinConcerns` with message-parsed concerns
- Adds personalized greeting with user's name and profile information

#### System Prompt Enhancement
- Includes user profile context in AI system prompt
- Provides specific user information (skin type, concerns, age, experience, etc.)
- Enables AI to give more targeted and relevant advice

### Frontend Changes (`/components/ChatbotIcon.js`)

#### Authentication Integration
```javascript
const authToken = localStorage.getItem('authToken');

const response = await fetch('/api/chatbot', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(authToken && { 'Authorization': authToken })
  },
  body: JSON.stringify({ message: userMessage })
});
```

#### Enhanced Quick Actions
- Added personalized prompts like "Recommend products for my skin type"
- Smarter suggestion system based on user context

## 📋 User Profile Data Used

The chatbot now utilizes the following user profile information:

### Core Profile Data
- **firstName**: For personalized greetings
- **skinType**: Primary factor for product/ingredient recommendations
- **skinConcerns**: Array of specific skin issues to address
- **ageRange**: Influences product recommendations
- **skincareExperience**: Affects complexity of advice given

### Extended Profile Data
- **allergies**: Filters out products with problematic ingredients
- **currentRoutine**: Provides context for routine improvements
- **goals**: Aligns recommendations with user objectives
- **budget**: Could influence product price ranges (future enhancement)
- **lifestyle**: Affects routine complexity and time requirements

## 🎯 Example Usage Scenarios

### Scenario 1: Authenticated User with Complete Profile
**User Profile**: Alice, Combination skin, concerns: acne + large pores, intermediate experience

**User Query**: "What moisturizer should I use?"

**Enhanced Response**:
```
Hi Alice! Based on your profile (Combination skin, concerns: acne, large pores), 
here are my personalized recommendations:

**CeraVe PM Facial Moisturizing Lotion**
- Price: $13-16
- Rating: 4.3/5 stars  
- Perfect for combination skin with niacinamide to minimize pores
- Non-comedogenic formula won't clog pores or worsen acne
- Contains ceramides and hyaluronic acid for balanced hydration

[Additional recommendations...]
```

### Scenario 2: Non-Authenticated User
**User Query**: "What moisturizer should I use?"

**Standard Response**:
```
Here are my product recommendations:

**CeraVe Daily Moisturizing Lotion**
- Price: $12-15
- Rating: 4.2/5 stars
- Great for normal to dry skin types
- [Standard recommendation without personalization]
```

### Scenario 3: General Skincare Question
**User Query**: "What causes acne?"

**AI-Powered Response**: Routes to Ollama AI with user profile context included in system prompt for personalized educational content.

## 🔒 Privacy & Security

### Authentication Flow
1. User logs in and receives auth token
2. Token is stored in browser localStorage
3. Chatbot includes token in API requests
4. Server validates token and extracts user email
5. User profile is fetched from Redis database
6. Profile data is used for personalization (not stored in chat logs)

### Data Protection
- No user profile data is logged or permanently stored in chat history
- Authentication tokens are validated on each request
- Fallback to non-personalized mode if authentication fails
- User data is only used for the current conversation context

## 🧪 Testing

### Test Script
A comprehensive test script (`test-personalized-chatbot.js`) is available to verify:
- User authentication and profile setup
- Non-personalized vs personalized responses
- Profile data integration
- Fallback mechanisms

### Running Tests
```bash
node test-personalized-chatbot.js
```

## 🔮 Future Enhancements

### Planned Improvements
1. **Conversation Memory**: Remember past recommendations and avoid repetition
2. **Learning System**: Adapt recommendations based on user feedback
3. **Product History**: Consider previously viewed/purchased products
4. **Routine Building**: Help users build complete personalized routines
5. **Budget Filtering**: Filter recommendations by user's budget preferences
6. **Seasonal Adjustments**: Modify recommendations based on climate/season
7. **Allergy Filtering**: Automatically exclude products with user's allergens

### Integration Opportunities
- **Skin Analysis Results**: Use AI skin analysis results for recommendations
- **Product Reviews**: Incorporate user's product ratings and reviews
- **Routine Tracking**: Monitor user's routine adherence and success
- **Professional Consultation**: Connect with dermatologists for complex cases

## 📚 API Response Format

### Enhanced Response Structure
```javascript
{
  "message": "Hi Alice! Based on your profile...",
  "model": "dermify-recommendations",
  "timestamp": "2025-01-26T...",
  "isRecommendation": true,
  "parsedData": {
    "skinType": "combination",
    "concerns": ["acne", "large_pores"],
    "category": null,
    "mentionedIngredients": [],
    "userProfile": {
      "skinType": "Combination",
      "skinConcerns": ["acne", "large_pores"],
      "name": "Alice"
    }
  }
}
```

### Response Indicators
- **userProfile**: Present when user is authenticated and profile is used
- **isRecommendation**: True for product/ingredient recommendations
- **model**: "dermify-recommendations" for local data, AI model name for general questions

## 🤝 User Experience Benefits

### For New Users
- **Guided Experience**: Chatbot encourages profile completion for better recommendations
- **Educational Content**: Provides general skincare education while building profile

### For Existing Users
- **Instant Personalization**: No need to repeat skin type and concerns in every query
- **Contextual Advice**: Recommendations consider full user profile and history
- **Efficiency**: Faster, more accurate responses based on known preferences

### For All Users
- **Consistent Experience**: Seamless transition between personalized and general advice
- **Transparent Process**: Clear indication when personalization is being used
- **Privacy Control**: Easy to opt out by logging out (falls back to general mode)

This enhancement significantly improves the chatbot's ability to provide relevant, personalized skincare advice while maintaining privacy and offering value to both authenticated and anonymous users.
