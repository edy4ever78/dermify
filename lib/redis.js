import { Redis } from 'ioredis';
import bcrypt from 'bcryptjs';

// Only create the Redis client on the server side
let redis;

// Check if we're on the server side before creating Redis client
if (typeof window === 'undefined') {
  // Create Redis client connecting to Docker instance on port 6379
  redis = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1', 
    port: parseInt(process.env.REDIS_PORT || '6379'), 
    connectTimeout: 15000,
    lazyConnect: true,
    enableReadyCheck: true,
    retryStrategy: (times) => {
      const delay = Math.min(times * 200, 5000);
      console.log(`Redis connection attempt ${times} failed. Retrying in ${delay}ms...`);
      return delay;
    },
    maxRetriesPerRequest: 5
  });

  // Improved error handling with more detailed messages
  redis.on('error', (error) => {
    console.error('Redis connection error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Make sure your Redis server is running and accessible at 127.0.0.1:6379');
      console.error('Docker container "redis" is running, but connection might be blocked by:');
      console.error('1. Network configuration issue');
      console.error('2. Docker container networking issue');
      console.error('3. Redis server configuration');
      console.error('Try running: telnet 127.0.0.1 6379 to test connectivity');
    }
  });

  redis.on('connect', () => {
    console.log('Successfully connected to Redis');
  });
}

// Utility functions for user management
export async function saveUser(user) {
  if (!redis) {
    throw new Error('Redis client not available - this function can only be called from server-side code');
  }
  
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(user.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Generate a unique ID if not provided
    const userId = user.id || `user:${Date.now()}`;
    
    // Hash the password before storing (10 rounds of salt)
    const hashedPassword = await bcrypt.hash(user.password, 10);
    
    // Store user data in a hash with hashed password
    await redis.hset(
      `user:${user.email}`, 
      {
        id: userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: hashedPassword, // Store hashed password instead of plaintext
        createdAt: Date.now()
      }
    );
    
    // Add the user's email to the "users" set
    await redis.sadd('users', user.email);
    
    // Return user with ID but without the hashed password
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, id: userId };
  } catch (error) {
    console.error('Error saving user to Redis:', error);
    throw error;
  }
}

export async function getUserByEmail(email, options = {}) {
  if (!redis) {
    throw new Error('Redis client not available - this function can only be called from server-side code');
  }
  
  try {
    console.log(`Fetching user data for email: ${email}`);
    const user = await redis.hgetall(`user:${email}`);
    
    // Return null if user not found
    if (!Object.keys(user).length) {
      console.log('No user found with email:', email);
      return null;
    }
    
    // Parse data and format it for frontend use
    const formattedUser = {
      ...user,
      // Ensure createdAt is a proper date string
      dateJoined: user.createdAt ? new Date(parseInt(user.createdAt)).toISOString() : new Date().toISOString(),
      // Parse skin concerns from string if it exists, or provide default empty array
      skinConcerns: user.skinConcerns ? 
        JSON.parse(user.skinConcerns) : 
        ['Acne', 'Hyperpigmentation'],
      // Add any default fields for user profile if they don't exist
      skinType: user.skinType || 'Normal',
      name: `${user.firstName} ${user.lastName}`,
      // Add placeholder data that would normally come from a real database
      preferences: {
        notifications: true,
        newsletter: false,
        productRecommendations: true
      },
      savedRoutines: ['morning-basic', 'acne-prone'],
      recentlyViewed: [
        { 
          type: 'product', 
          id: 'vitamin-c-serum', 
          name: 'Vitamin C Brightening Serum',
          viewedAt: new Date().toISOString()
        }
      ]
    };
    
    // If keepPassword is not true, remove the password
    if (!options.keepPassword) {
      formattedUser.password = undefined;
    }
    
    console.log('Returning formatted user data:', formattedUser);
    return formattedUser;
  } catch (error) {
    console.error('Error fetching user from Redis:', error);
    return null;
  }
}

export async function validateCredentials(email, password) {
  if (!redis) {
    throw new Error('Redis client not available - this function can only be called from server-side code');
  }
  
  try {
    // Get user with password for validation
    const user = await getUserByEmail(email, { keepPassword: true });
    if (!user) return null;
    
    // Compare plaintext password with stored hash
    const isValid = await bcrypt.compare(password, user.password);
    
    if (isValid) {
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    
    return null;
  } catch (error) {
    console.error('Error validating credentials:', error);
    return null;
  }
}

export async function updateUserProfile(email, profileData) {
  if (!redis) {
    throw new Error('Redis client not available - this function can only be called from server-side code');
  }
  
  try {
    console.log(`Updating profile for user: ${email}`, profileData);
    
    // Extract the fields we want to update
    const { skinType, skinConcerns, firstName, lastName } = profileData;
    
    // Prepare update data
    const updateData = {};
    
    if (skinType) updateData.skinType = skinType;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    
    // Handle skin concerns specially - convert array to JSON string
    if (skinConcerns && Array.isArray(skinConcerns)) {
      updateData.skinConcerns = JSON.stringify(skinConcerns);
      console.log('Storing skin concerns as:', updateData.skinConcerns);
    }
    
    // Update user data in Redis
    if (Object.keys(updateData).length > 0) {
      await redis.hset(`user:${email}`, updateData);
      console.log(`Profile updated successfully for ${email}`);
    }
    
    // Return the updated user
    return await getUserByEmail(email);
  } catch (error) {
    console.error('Error updating user profile in Redis:', error);
    throw error;
  }
}

export default redis;
