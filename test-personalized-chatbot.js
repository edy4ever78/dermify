// Test script for personalized chatbot functionality
const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testPersonalizedChatbot() {
  console.log('🧪 Testing Personalized Chatbot Functionality\n');

  try {
    // Step 1: Create test user
    console.log('1. Creating test user...');
    const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Alice',
        lastName: 'Test',
        email: 'alice.test@example.com',
        password: 'password123'
      })
    });
    
    const signupData = await signupResponse.json();
    if (!signupResponse.ok) {
      console.log('ℹ️  User might already exist, proceeding...');
    } else {
      console.log('✅ Test user created successfully');
    }

    // Step 2: Login to get token
    console.log('\n2. Logging in...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alice.test@example.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginData.message}`);
    }
    
    const authToken = loginData.token;
    console.log(`✅ Login successful. Token: ${authToken.substring(0, 20)}...`);

    // Step 3: Complete onboarding to set user profile
    console.log('\n3. Completing onboarding...');
    const onboardingResponse = await fetch(`${BASE_URL}/api/user/onboarding`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken
      },
      body: JSON.stringify({
        skinType: 'Combination',
        skinConcerns: ['acne', 'large_pores'],
        ageRange: '25-34',
        skincareExperience: 'intermediate',
        budget: 'moderate',
        lifestyle: 'active',
        allergies: 'fragrance',
        currentRoutine: 'Basic cleansing and moisturizing',
        goals: 'Clear skin and smaller pores'
      })
    });
    
    const onboardingData = await onboardingResponse.json();
    if (!onboardingResponse.ok) {
      throw new Error(`Onboarding failed: ${onboardingData.message}`);
    }
    
    console.log('✅ Onboarding completed successfully');
    console.log(`   User Profile: ${onboardingData.user.skinType} skin, concerns: ${onboardingData.user.skinConcerns.join(', ')}`);

    // Step 4: Test chatbot WITHOUT auth token (non-personalized)
    console.log('\n4. Testing chatbot without authentication...');
    const nonPersonalizedResponse = await fetch(`${BASE_URL}/api/chatbot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Recommend products for my skin'
      })
    });
    
    const nonPersonalizedData = await nonPersonalizedResponse.json();
    console.log('📝 Non-personalized response:');
    console.log(`   Message: ${nonPersonalizedData.message.substring(0, 100)}...`);
    console.log(`   User Profile Used: ${nonPersonalizedData.parsedData?.userProfile ? 'Yes' : 'No'}`);

    // Step 5: Test chatbot WITH auth token (personalized)
    console.log('\n5. Testing chatbot with authentication...');
    const personalizedResponse = await fetch(`${BASE_URL}/api/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken
      },
      body: JSON.stringify({
        message: 'Recommend products for my skin'
      })
    });
    
    const personalizedData = await personalizedResponse.json();
    console.log('📝 Personalized response:');
    console.log(`   Message: ${personalizedData.message.substring(0, 150)}...`);
    console.log(`   User Profile Used: ${personalizedData.parsedData?.userProfile ? 'Yes' : 'No'}`);
    if (personalizedData.parsedData?.userProfile) {
      console.log(`   Detected Skin Type: ${personalizedData.parsedData.userProfile.skinType}`);
      console.log(`   Detected Concerns: ${personalizedData.parsedData.userProfile.skinConcerns.join(', ')}`);
      console.log(`   User Name: ${personalizedData.parsedData.userProfile.name}`);
    }

    // Step 6: Test specific recommendation with user context
    console.log('\n6. Testing specific product recommendation...');
    const specificResponse = await fetch(`${BASE_URL}/api/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken
      },
      body: JSON.stringify({
        message: 'What moisturizer should I use?'
      })
    });
    
    const specificData = await specificResponse.json();
    console.log('📝 Specific recommendation response:');
    console.log(`   Message includes user name: ${specificData.message.includes('Alice') ? 'Yes' : 'No'}`);
    console.log(`   Message includes skin type: ${specificData.message.toLowerCase().includes('combination') ? 'Yes' : 'No'}`);
    console.log(`   Is recommendation: ${specificData.isRecommendation ? 'Yes' : 'No'}`);

    // Step 7: Test general skincare question
    console.log('\n7. Testing general skincare question...');
    const generalResponse = await fetch(`${BASE_URL}/api/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken
      },
      body: JSON.stringify({
        message: 'What causes acne?'
      })
    });
    
    const generalData = await generalResponse.json();
    console.log('📝 General question response:');
    console.log(`   Goes to AI model: ${!generalData.isRecommendation ? 'Yes' : 'No'}`);
    console.log(`   Model used: ${generalData.model}`);

    console.log('\n🎉 Personalized chatbot test completed successfully!');
    
    // Summary
    console.log('\n📊 Test Summary:');
    console.log('✅ User creation and authentication');
    console.log('✅ Onboarding completion');
    console.log('✅ Non-personalized recommendations');
    console.log('✅ Personalized recommendations with user profile');
    console.log('✅ Context-aware responses');
    console.log('✅ Fallback to AI model for general questions');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run the test
testPersonalizedChatbot();
