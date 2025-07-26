/**
 * Test script for personalized profile chatbot functionality
 * Tests the "tell me about myself" feature
 */

const BASE_URL = 'http://localhost:3000';

// Test credentials (create a test user if needed)
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'testpass123';

async function testProfileChatbot() {
  console.log('🧪 Testing Personalized Profile Chatbot...\n');

  try {
    // First, let's test with a mock token to simulate a logged-in user
    const mockUserData = {
      email: TEST_EMAIL,
      firstName: 'John',
      lastName: 'Doe',
      ageRange: '25-30',
      skinType: 'Combination',
      skinConcerns: ['Acne', 'Dark spots'],
      allergies: 'Fragrance, alcohol',
      skincareExperience: 'Intermediate',
      goals: 'Clear skin and anti-aging',
      budget: '$50-100',
      lifestyle: 'Active',
      currentRoutine: 'Morning: Cleanser, Vitamin C serum, Moisturizer, SPF\nEvening: Cleanser, Retinol (3x week), Moisturizer'
    };

    // Create a mock auth token (base64 encoded email + timestamp)
    const tokenData = `${TEST_EMAIL}:${Date.now()}`;
    const mockToken = Buffer.from(tokenData).toString('base64');

    console.log('📝 Testing personal profile queries...\n');

    // Test cases for personal profile questions
    const profileQuestions = [
      'tell me about myself',
      'what do you know about me',
      'what is my profile',
      'show my information',
      'what\'s my skin type',
      'tell me my skincare profile'
    ];

    for (const question of profileQuestions) {
      console.log(`❓ Question: "${question}"`);
      
      const response = await fetch(`${BASE_URL}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`
        },
        body: JSON.stringify({
          message: question,
          chatHistory: []
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Response received (${data.model})`);
        console.log(`📄 Response: ${data.message.substring(0, 200)}${data.message.length > 200 ? '...' : ''}\n`);
        
        if (data.parsedData?.userProfile) {
          console.log(`👤 Profile data detected: ${JSON.stringify(data.parsedData.userProfile, null, 2)}\n`);
        }
      } else {
        console.log(`❌ Error: ${response.status} ${response.statusText}\n`);
      }
    }

    console.log('🔄 Testing without authentication...\n');
    
    // Test without auth token
    const response = await fetch(`${BASE_URL}/api/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'tell me about myself',
        chatHistory: []
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log(`✅ Response without auth received (${data.model})`);
      console.log(`📄 Response: ${data.message.substring(0, 200)}${data.message.length > 200 ? '...' : ''}\n`);
    }

    console.log('✨ Testing mixed queries...\n');
    
    // Test product recommendation with profile context
    const mixedQuestions = [
      'recommend products for my skin',
      'what skincare routine should I use',
      'help me with my acne problem'
    ];

    for (const question of mixedQuestions) {
      console.log(`❓ Question: "${question}"`);
      
      const response = await fetch(`${BASE_URL}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${mockToken}`
        },
        body: JSON.stringify({
          message: question,
          chatHistory: []
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Response received (${data.model})`);
        console.log(`📊 Is recommendation: ${data.isRecommendation || false}`);
        console.log(`📄 Response: ${data.message.substring(0, 200)}${data.message.length > 200 ? '...' : ''}\n`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Instructions for running the test
console.log('🚀 Starting Profile Chatbot Test');
console.log('📋 Make sure your Next.js server is running on localhost:3000');
console.log('📋 This test will check if personal profile questions work correctly\n');

testProfileChatbot();
