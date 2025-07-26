/**
 * Recommendation utilities for products and ingredients
 */

import { getAllProducts, getProductsByCategory } from '@/data/products';
import { getAllIngredients, getIngredientsByCategory, getIngredientsBySkinType } from '@/data/ingredients';

/**
 * Get product recommendations based on skin type and concerns
 * @param {string} skinType - The user's skin type (normal, dry, oily, combination, sensitive)
 * @param {string[]} concerns - Array of skin concerns
 * @param {string} category - Optional product category filter
 * @param {number} limit - Maximum number of recommendations to return
 * @returns {Object[]} Array of recommended products
 */
export function getProductRecommendations(skinType, concerns = [], category = null, limit = 5) {
  let products = category ? getProductsByCategory(category) : getAllProducts();
  
  // Filter products suitable for the skin type
  if (skinType && skinType !== 'all') {
    products = products.filter(product => {
      const skinTypes = product.skinTypes || {};
      return skinTypes[skinType.toLowerCase()] === true;
    });
  }
  
  // Score products based on how well they match concerns
  const scoredProducts = products.map(product => {
    let score = product.rank || 0; // Base score from product rating
    
    // Boost score if product addresses specific concerns
    if (concerns.length > 0) {
      const description = (product.description || '').toLowerCase();
      const name = (product.name || '').toLowerCase();
      
      concerns.forEach(concern => {
        const concernLower = concern.toLowerCase();
        if (description.includes(concernLower) || name.includes(concernLower)) {
          score += 1;
        }
        
        // Specific concern matching
        if (concernLower.includes('acne') && (description.includes('acne') || description.includes('bha') || description.includes('salicylic'))) {
          score += 2;
        }
        if (concernLower.includes('aging') && (description.includes('retinol') || description.includes('vitamin c') || description.includes('anti-aging'))) {
          score += 2;
        }
        if (concernLower.includes('dryness') && (description.includes('hydrat') || description.includes('moistur') || description.includes('hyaluronic'))) {
          score += 2;
        }
        if (concernLower.includes('dark spots') && (description.includes('brighten') || description.includes('vitamin c') || description.includes('niacinamide'))) {
          score += 2;
        }
      });
    }
    
    return { ...product, score };
  });
  
  // Sort by score (highest first) and return top results
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get ingredient recommendations based on skin type and concerns
 * @param {string} skinType - The user's skin type
 * @param {string[]} concerns - Array of skin concerns
 * @param {number} limit - Maximum number of recommendations to return
 * @returns {Object[]} Array of recommended ingredients
 */
export function getIngredientRecommendations(skinType, concerns = [], limit = 5) {
  let ingredients = getAllIngredients();
  
  // Filter ingredients suitable for the skin type
  if (skinType && skinType !== 'All' && skinType !== 'all') {
    ingredients = ingredients.filter(ingredient => {
      const skinTypes = ingredient.skinTypes || [];
      return skinTypes.includes('All') || 
             skinTypes.some(type => type.toLowerCase() === skinType.toLowerCase());
    });
  }
  
  // Score ingredients based on how well they match concerns and safety
  const scoredIngredients = ingredients.map(ingredient => {
    let score = (ingredient.safetyRating || 0) + (ingredient.scientificEvidence || 0);
    
    if (concerns.length > 0) {
      const description = (ingredient.description || '').toLowerCase();
      const benefits = (ingredient.benefits || []).join(' ').toLowerCase();
      const name = (ingredient.name || '').toLowerCase();
      
      concerns.forEach(concern => {
        const concernLower = concern.toLowerCase();
        
        if (description.includes(concernLower) || benefits.includes(concernLower) || name.includes(concernLower)) {
          score += 2;
        }
        
        // Specific concern matching
        if (concernLower.includes('acne') && (benefits.includes('acne') || name.includes('salicylic') || name.includes('benzoyl'))) {
          score += 3;
        }
        if (concernLower.includes('aging') && (benefits.includes('aging') || benefits.includes('wrinkle') || name.includes('retinol') || name.includes('vitamin c'))) {
          score += 3;
        }
        if (concernLower.includes('dryness') && (benefits.includes('hydrat') || benefits.includes('moistur') || name.includes('hyaluronic'))) {
          score += 3;
        }
        if (concernLower.includes('dark spots') && (benefits.includes('brighten') || benefits.includes('pigment') || name.includes('vitamin c') || name.includes('niacinamide'))) {
          score += 3;
        }
        if (concernLower.includes('sensitive') && (ingredient.safetyRating >= 4)) {
          score += 2;
        }
      });
    }
    
    return { ...ingredient, score };
  });
  
  // Sort by score and return top results
  return scoredIngredients
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Get products by specific ingredient
 * @param {string} ingredientName - Name of the ingredient to search for
 * @param {number} limit - Maximum number of products to return
 * @returns {Object[]} Array of products containing the ingredient
 */
export function getProductsByIngredient(ingredientName, limit = 5) {
  const products = getAllProducts();
  const ingredient = ingredientName.toLowerCase();
  
  return products
    .filter(product => {
      const description = (product.description || '').toLowerCase();
      const name = (product.name || '').toLowerCase();
      return description.includes(ingredient) || name.includes(ingredient);
    })
    .sort((a, b) => (b.rank || 0) - (a.rank || 0))
    .slice(0, limit);
}

/**
 * Format recommendations for chatbot response
 * @param {Object[]} items - Array of products or ingredients
 * @param {string} type - 'products' or 'ingredients'
 * @returns {string} Formatted recommendation text
 */
export function formatRecommendations(items, type = 'products') {
  if (!items || items.length === 0) {
    return `I couldn't find any ${type} recommendations based on your criteria. Please try different skin type or concerns.`;
  }
  
  let response = `Here are my top ${type} recommendations for you:\n\n`;
  
  items.forEach((item, index) => {
    if (type === 'products') {
      response += `${index + 1}. **[PRODUCT_LINK:${item.category}/${item.id}]${item.brand} ${item.name}[/PRODUCT_LINK]**\n`;
      response += `   - Price: $${item.price}\n`;
      response += `   - Rating: ${item.rank}/5\n`;
      response += `   - ${item.description}\n`;
      if (item.purchaseUrl) {
        response += `   - [Buy here](${item.purchaseUrl})\n`;
      }
      response += '\n';
    } else {
      response += `${index + 1}. **[INGREDIENT_LINK:${item.id}]${item.name}[/INGREDIENT_LINK]**\n`;
      response += `   - Category: ${item.category}\n`;
      response += `   - Safety Rating: ${item.safetyRating}/5\n`;
      response += `   - ${item.description}\n`;
      if (item.benefits && item.benefits.length > 0) {
        response += `   - Benefits: ${item.benefits.slice(0, 3).join(', ')}\n`;
      }
      response += '\n';
    }
  });
  
  return response;
}

/**
 * Parse user message to extract skin type and concerns
 * @param {string} message - User's message
 * @returns {Object} Parsed skin type and concerns
 */
export function parseUserMessage(message) {
  const messageLower = message.toLowerCase();
  
  // Extract skin type with more variations
  let skinType = 'all';
  const skinTypePatterns = {
    'dry': ['dry skin', 'dry', 'dehydrated skin', 'dehydrated', 'flaky skin', 'tight skin'],
    'oily': ['oily skin', 'oily', 'greasy skin', 'greasy', 'shiny skin', 'excess oil'],
    'combination': ['combination skin', 'combination', 'mixed skin', 'combo skin', 't-zone'],
    'sensitive': ['sensitive skin', 'sensitive', 'irritated skin', 'reactive skin', 'easily irritated'],
    'normal': ['normal skin', 'normal', 'balanced skin', 'regular skin']
  };
  
  for (const [type, patterns] of Object.entries(skinTypePatterns)) {
    if (patterns.some(pattern => messageLower.includes(pattern))) {
      skinType = type;
      break;
    }
  }
  
  // Extract concerns with comprehensive patterns
  const concerns = [];
  const concernPatterns = {
    'acne': [
      'acne', 'pimple', 'breakout', 'zit', 'blemish', 'spot', 'blackhead', 
      'whitehead', 'cystic acne', 'hormonal acne', 'adult acne'
    ],
    'aging': [
      'aging', 'anti-aging', 'age', 'wrinkle', 'fine line', 'crow feet', 
      'laugh line', 'expression line', 'sagging', 'firmness', 'elasticity',
      'mature skin', 'prevention'
    ],
    'dark spots': [
      'dark spot', 'age spot', 'sun spot', 'liver spot', 'hyperpigmentation', 
      'discoloration', 'melasma', 'post-inflammatory hyperpigmentation', 
      'pih', 'uneven skin tone', 'brown spot'
    ],
    'dryness': [
      'dryness', 'dry', 'dehydration', 'dehydrated', 'flaky', 'tight', 
      'rough', 'scaly', 'moisture', 'hydration', 'parched'
    ],
    'dullness': [
      'dullness', 'dull', 'lackluster', 'tired looking', 'glow', 'radiance', 
      'brighten', 'luminous', 'vibrant', 'glowing skin'
    ],
    'redness': [
      'redness', 'red', 'rosacea', 'inflammation', 'irritation', 'flushing', 
      'ruddy', 'blotchy', 'inflamed'
    ],
    'large pores': [
      'large pore', 'big pore', 'visible pore', 'pore size', 'minimize pore', 
      'shrink pore', 'refine pore'
    ],
    'texture': [
      'texture', 'rough texture', 'uneven texture', 'bumpy', 'smooth', 
      'refinement', 'surface'
    ],
    'oiliness': [
      'oily', 'greasy', 'shine', 'shiny', 'excess oil', 'sebum', 'control oil'
    ]
  };
  
  for (const [concern, patterns] of Object.entries(concernPatterns)) {
    if (patterns.some(pattern => messageLower.includes(pattern))) {
      concerns.push(concern);
    }
  }
  
  // Extract product category with more variations
  let category = null;
  const categoryPatterns = {
    'cleansers': ['cleanser', 'cleaner', 'face wash', 'facial cleanser', 'washing', 'cleansing'],
    'serums': ['serum', 'essence', 'treatment', 'concentrate', 'ampoule'],
    'moisturizers': ['moisturizer', 'cream', 'lotion', 'hydrating cream', 'face cream', 'night cream', 'day cream'],
    'sunscreens': ['sunscreen', 'spf', 'sun protection', 'uv protection', 'sun block'],
    'exfoliants': ['exfoliant', 'exfoliate', 'peel', 'scrub', 'aha', 'bha', 'chemical exfoliant'],
    'toners': ['toner', 'astringent', 'refreshing', 'balancing'],
    'masks': ['mask', 'face mask', 'sheet mask', 'clay mask', 'treatment mask']
  };
  
  for (const [cat, patterns] of Object.entries(categoryPatterns)) {
    if (patterns.some(pattern => messageLower.includes(pattern))) {
      category = cat;
      break;
    }
  }
  
  // Extract specific ingredients mentioned
  const mentionedIngredients = [];
  const ingredientPatterns = {
    'retinol': ['retinol', 'retinoid', 'vitamin a', 'tretinoin', 'adapalene'],
    'vitamin c': ['vitamin c', 'ascorbic acid', 'l-ascorbic acid', 'magnesium ascorbyl phosphate'],
    'hyaluronic acid': ['hyaluronic acid', 'hyaluronic', 'sodium hyaluronate'],
    'niacinamide': ['niacinamide', 'nicotinamide', 'vitamin b3'],
    'salicylic acid': ['salicylic acid', 'salicylic', 'bha', 'beta hydroxy acid'],
    'glycolic acid': ['glycolic acid', 'glycolic', 'aha', 'alpha hydroxy acid'],
    'ceramides': ['ceramide', 'ceramides'],
    'peptides': ['peptide', 'peptides', 'collagen peptide'],
    'zinc': ['zinc', 'zinc oxide'],
    'tea tree': ['tea tree', 'melaleuca']
  };
  
  for (const [ingredient, patterns] of Object.entries(ingredientPatterns)) {
    if (patterns.some(pattern => messageLower.includes(pattern))) {
      mentionedIngredients.push(ingredient);
    }
  }
  
  return { skinType, concerns, category, mentionedIngredients };
}
