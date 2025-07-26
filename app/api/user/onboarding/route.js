import { NextResponse } from 'next/server';
import { updateUser, getUserByEmail } from '@/lib/redis';

export async function POST(request) {
  try {
    const authToken = request.headers.get('authorization');
    
    console.log('Onboarding API: Received auth token:', authToken ? `"${authToken.substring(0, 20)}..."` : 'missing');
    
    if (!authToken) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Extract email from token
    let email;
    let user;
    
    try {
      const decodedToken = Buffer.from(authToken, 'base64').toString('utf8');
      email = decodedToken.split('-')[0];

      console.log('Onboarding API: Decoded token:', decodedToken);
      console.log('Onboarding API: Extracted email:', email);

      if (!email) {
        return NextResponse.json(
          { message: 'Invalid authentication token' },
          { status: 401 }
        );
      }

      // Get user from database
      user = await getUserByEmail(email);
      
      if (!user) {
        return NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        );
      }
    } catch (decodeError) {
      console.error('Token decoding error:', decodeError);
      return NextResponse.json(
        { message: 'Invalid token format' },
        { status: 401 }
      );
    }

    const onboardingData = await request.json();
    
    // Validate required fields
    const { skinType, skinConcerns, ageRange, skincareExperience, budget, lifestyle } = onboardingData;
    
    if (!skinType || !skinConcerns || skinConcerns.length === 0 || !ageRange || !skincareExperience || !budget || !lifestyle) {
      return NextResponse.json(
        { message: 'Missing required onboarding information' },
        { status: 400 }
      );
    }

    // Filter out 'general' concerns as it's a placeholder
    const filteredConcerns = skinConcerns.filter(concern => concern !== 'general');

    // Prepare update data
    const updateData = {
      skinType,
      skinConcerns: filteredConcerns,
      ageRange,
      skincareExperience,
      budget: onboardingData.budget || '',
      lifestyle: onboardingData.lifestyle || '',
      allergies: onboardingData.allergies || '',
      currentRoutine: onboardingData.currentRoutine || '',
      goals: onboardingData.goals || '',
      onboardingCompleted: true,
      onboardingCompletedAt: new Date().toISOString()
    };

    // Update user with onboarding data
    const updatedUser = await updateUser(email, updateData);

    return NextResponse.json({
      message: 'Onboarding completed successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Onboarding API error:', error);
    
    return NextResponse.json(
      { message: error.message || 'Failed to complete onboarding' },
      { status: 500 }
    );
  }
}
