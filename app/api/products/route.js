import { NextResponse } from 'next/server';
import products, { getProductsByCategory, getProductsBySkinType, getProductsByBrand } from '@/data/products';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // Parse query parameters
  const category = searchParams.get('category');
  const skinType = searchParams.get('skinType');
  const brand = searchParams.get('brand');
  const search = searchParams.get('search');
  
  let filteredProducts = [...products];
  
  // Filter by category if provided
  if (category) {
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
      product.brand.toLowerCase().includes(searchLower)
    );
  }
  
  return NextResponse.json(filteredProducts);
}
