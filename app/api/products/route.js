import { NextResponse } from 'next/server';
import { getAllProducts, getProductsByCategory, getValidImageUrl } from '@/data/products';
import { getAllIngredients } from '@/data/ingredients';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // Parse query parameters
  const category = searchParams.get('category');
  const skinType = searchParams.get('skinType');
  const brand = searchParams.get('brand');
  const search = searchParams.get('search');
  const searchType = searchParams.get('searchType') || 'products'; // Default to products

  let results = {
    products: [],
    ingredients: []
  };

  // Get base data depending on search type
  if (searchType === 'all' || searchType === 'products') {
    let filteredProducts = getAllProducts();
    
    // Filter by category if provided
    if (category && category !== 'all') {
      filteredProducts = getProductsByCategory(category);
    }
    
    // Filter by skin type if provided
    if (skinType) {
      filteredProducts = filteredProducts.filter(product => 
        product.skinTypes && product.skinTypes[skinType.toLowerCase()]
      );
    }
    
    // Filter by brand if provided
    if (brand) {
      filteredProducts = filteredProducts.filter(product => 
        product.brand.toLowerCase() === brand.toLowerCase()
      );
    }
    
    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.brand.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower)
      );
    }

    // Ensure all products have valid image URLs
    const productsWithValidImages = filteredProducts.map((product, index) => ({
      ...product,
      imageUrl: getValidImageUrl(product.imageUrl, product.category, index)
    }));
    
    // Return products array directly if not searching for all
    if (searchType === 'products') {
      return new Response(JSON.stringify(productsWithValidImages), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    results.products = productsWithValidImages;
  }

  // Search ingredients if requested
  if (searchType === 'all' || searchType === 'ingredients') {
    let filteredIngredients = getAllIngredients();
    
    // Filter by search term if provided
    if (search) {
      const searchLower = search.toLowerCase();
      filteredIngredients = filteredIngredients.filter(ingredient =>
        ingredient.name.toLowerCase().includes(searchLower) ||
        ingredient.description.toLowerCase().includes(searchLower)
      );
    }

    results.ingredients = filteredIngredients;
  }

  return new Response(JSON.stringify(results), {
    headers: { 'Content-Type': 'application/json' },
  });
}

// Sample product data with added skin type information
const products = [
  {
    id: '1',
    name: 'Hydrating Facial Cleanser',
    brand: 'CeraVe',
    price: 14.99,
    category: 'Cleansers',
    imageUrl: 'https://example.com/images/cerave-hydrating-cleanser.jpg',
    description: 'A gentle face wash with ceramides and hyaluronic acid.',
    skinType: ['Dry', 'Normal', 'Sensitive'],
    rank: '4.8'
  },
  {
    id: '2',
    name: 'Salicylic Acid Exfoliating Cleanser',
    brand: 'Paula\'s Choice',
    price: 29.99,
    category: 'Cleansers',
    imageUrl: 'https://example.com/images/paulas-choice-cleanser.jpg',
    description: 'Removes excess oil and unclogs pores with 2% salicylic acid.',
    skinType: ['Oily', 'Combination', 'Acne-Prone'],
    rank: '4.7'
  },
  {
    id: '3',
    name: 'Vitamin C Serum',
    brand: 'Timeless',
    price: 19.99,
    category: 'Serums',
    imageUrl: 'https://example.com/images/timeless-vitamin-c.jpg',
    description: '20% Vitamin C + E + Ferulic Acid for brightening.',
    skinType: ['All'],
    rank: '4.6'
  },
  {
    id: '4',
    name: 'Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    price: 5.99,
    category: 'Serums',
    imageUrl: 'https://example.com/images/ordinary-niacinamide.jpg',
    description: 'Reduces appearance of blemishes and congestion.',
    skinType: ['Oily', 'Combination', 'Acne-Prone'],
    rank: '4.5'
  },
  {
    id: '5',
    name: 'Daily Moisturizing Lotion',
    brand: 'Cetaphil',
    price: 11.99,
    category: 'Moisturizers',
    imageUrl: 'https://example.com/images/cetaphil-moisturizer.jpg',
    description: 'Lightweight, non-greasy moisturizer for all skin types.',
    skinType: ['All'],
    rank: '4.3'
  },
  {
    id: '6',
    name: 'Ultra Repair Cream',
    brand: 'First Aid Beauty',
    price: 34.99,
    category: 'Moisturizers',
    imageUrl: 'https://example.com/images/fab-repair-cream.jpg',
    description: 'Rich, whipped moisturizer that provides immediate relief for dry, distressed skin.',
    skinType: ['Dry', 'Sensitive'],
    rank: '4.8'
  },
  {
    id: '7',
    name: 'Invisible UV Fluid SPF 50+',
    brand: 'La Roche-Posay',
    price: 39.99,
    category: 'Sunscreen',
    imageUrl: 'https://example.com/images/laroche-posay-sunscreen.jpg',
    description: 'Ultra-light, fast-absorbing sunscreen with broad spectrum protection.',
    skinType: ['All'],
    rank: '4.9'
  },
  {
    id: '8',
    name: 'Clear Extra Strength Anti-Redness Exfoliating Solution',
    brand: 'Paula\'s Choice',
    price: 29.99,
    category: 'Exfoliants',
    imageUrl: 'https://example.com/images/paulas-choice-bha.jpg',
    description: '2% BHA (salicylic acid) liquid exfoliant for unclogging pores.',
    skinType: ['Oily', 'Combination', 'Acne-Prone'],
    rank: '4.7'
  },
  {
    id: '9',
    name: 'Glycolic Acid 7% Toning Solution',
    brand: 'The Ordinary',
    price: 8.99,
    category: 'Toners',
    imageUrl: 'https://example.com/images/ordinary-glycolic.jpg',
    description: 'Offers mild exfoliation for improved skin radiance and clarity.',
    skinType: ['Normal', 'Combination'],
    rank: '4.4'
  },
  {
    id: '10',
    name: 'Retinol 1% in Squalane',
    brand: 'The Ordinary',
    price: 7.99,
    category: 'Treatments',
    imageUrl: 'https://example.com/images/ordinary-retinol.jpg',
    description: 'High-strength retinol serum to target signs of aging.',
    skinType: ['Normal', 'Combination', 'Dry'],
    rank: '4.5'
  }
];
