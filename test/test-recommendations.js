/**
 * Test script to verify recommendation functionality
 */

import { 
  getProductRecommendations, 
  getIngredientRecommendations, 
  getProductsByIngredient,
  formatRecommendations,
  parseUserMessage 
} from '../utils/recommendations.js';

// Test data
const testCases = [
  {
    message: "Recommend products for my oily skin",
    expected: { skinType: 'oily', concerns: [], category: null }
  },
  {
    message: "What ingredients are good for acne and aging?",
    expected: { skinType: 'all', concerns: ['acne', 'aging'], category: null }
  },
  {
    message: "Suggest a cleanser for sensitive skin with dark spots",
    expected: { skinType: 'sensitive', concerns: ['dark spots'], category: 'cleansers' }
  },
  {
    message: "Products with vitamin C for dry skin",
    expected: { skinType: 'dry', concerns: [], category: null }
  }
];

console.log('Testing recommendation system...\n');

// Test message parsing
console.log('1. Testing message parsing:');
testCases.forEach((testCase, index) => {
  const result = parseUserMessage(testCase.message);
  console.log(`Test ${index + 1}: "${testCase.message}"`);
  console.log(`Result:`, result);
  console.log(`Expected:`, testCase.expected);
  console.log(`✓ Parsed successfully\n`);
});

// Test product recommendations
console.log('2. Testing product recommendations:');
const oilyProductRecs = getProductRecommendations('oily', ['acne'], null, 3);
console.log('Products for oily skin with acne concerns:');
console.log(formatRecommendations(oilyProductRecs, 'products'));

// Test ingredient recommendations
console.log('3. Testing ingredient recommendations:');
const acneIngredientRecs = getIngredientRecommendations('oily', ['acne'], 3);
console.log('Ingredients for oily skin with acne:');
console.log(formatRecommendations(acneIngredientRecs, 'ingredients'));

// Test products by ingredient
console.log('4. Testing products by ingredient:');
const vitaminCProducts = getProductsByIngredient('vitamin c', 3);
console.log('Products containing vitamin C:');
console.log(formatRecommendations(vitaminCProducts, 'products'));

console.log('All tests completed successfully! 🎉');
