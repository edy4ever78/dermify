import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createBackup } from '@/lib/backup';
import { getAllProducts } from '@/data/products';

const PRODUCTS_FILE_PATH = path.join(process.cwd(), 'data', 'products.js');

// Helper function to read the current products file
function readProductsFile() {
  try {
    // Use the existing getAllProducts function for reading
    return getAllProducts();
  } catch (error) {
    console.error('Error reading products file:', error);
    return [];
  }
}

// Helper function to write products to file
function writeProductsFile(products) {
  try {
    // Create backup before modifying
    createBackup(PRODUCTS_FILE_PATH);
    
    const fileContent = `/**
 * Products data based on Cosmopolitan's best skincare products
 * Source: https://www.cosmopolitan.com/uk/beauty-hair/skincare/g14191580/best-skin-care-products/
 */

const products = ${JSON.stringify(products, null, 2)};

export { products };
export const getAllProducts = () => products;
export const getProductsByCategory = (category) => products.filter(p => p.category === category);
export const getProductById = (id) => products.find(p => p.id === id);

export const getValidImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return \`/images/products/\${imageUrl}\`;
};`;

    fs.writeFileSync(PRODUCTS_FILE_PATH, fileContent, 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing products file:', error);
    return false;
  }
}

// GET - Get all products (for the dev interface)
export async function GET() {
  try {
    const products = readProductsFile();
    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// POST - Add new product
export async function POST(request) {
  try {
    const newProduct = await request.json();
    const products = [...readProductsFile()]; // Create a copy of the array
    
    // Check if product with same ID already exists
    if (products.find(p => p.id === newProduct.id)) {
      return NextResponse.json({ error: 'Product with this ID already exists' }, { status: 400 });
    }
    
    // Add the new product
    products.push(newProduct);
    
    // Write back to file
    const success = writeProductsFile(products);
    if (!success) {
      return NextResponse.json({ error: 'Failed to save product' }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}

// PUT - Update existing product
export async function PUT(request) {
  try {
    const updatedProduct = await request.json();
    const products = [...readProductsFile()]; // Create a copy of the array
    
    // Find the product index
    const productIndex = products.findIndex(p => p.id === updatedProduct.id);
    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Update the product
    products[productIndex] = updatedProduct;
    
    // Write back to file
    const success = writeProductsFile(products);
    if (!success) {
      return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
    }
    
    return NextResponse.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE - Remove product
export async function DELETE(request) {
  try {
    console.log('DELETE request received for products');
    
    // Parse request body
    let requestData;
    try {
      requestData = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { id } = requestData;
    
    // Validate input
    if (!id || typeof id !== 'string' || id.trim() === '') {
      console.error('Invalid or missing product ID:', id);
      return NextResponse.json({ error: 'Valid product ID is required' }, { status: 400 });
    }

    console.log('Attempting to delete product with ID:', id);
    
    // Read current products
    let products;
    try {
      products = [...readProductsFile()]; // Create a copy of the array
    } catch (readError) {
      console.error('Failed to read products file:', readError);
      return NextResponse.json({ error: 'Failed to read products data' }, { status: 500 });
    }

    console.log(`Found ${products.length} products in database`);
    
    // Find the product index
    const productIndex = products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      console.error('Product not found with ID:', id);
      return NextResponse.json({ error: `Product with ID '${id}' not found` }, { status: 404 });
    }

    console.log(`Found product at index ${productIndex}:`, products[productIndex].name);
    
    // Remove the product
    const removedProduct = products.splice(productIndex, 1)[0];
    console.log('Product removed from array, new count:', products.length);
    
    // Write back to file
    let success;
    try {
      success = writeProductsFile(products);
    } catch (writeError) {
      console.error('Failed to write products file:', writeError);
      return NextResponse.json({ error: 'Failed to save changes to file' }, { status: 500 });
    }

    if (!success) {
      console.error('writeProductsFile returned false');
      return NextResponse.json({ error: 'Failed to delete product from file' }, { status: 500 });
    }
    
    console.log('Product deleted successfully:', removedProduct.name);
    return NextResponse.json({ 
      message: 'Product deleted successfully', 
      product: removedProduct,
      remainingCount: products.length
    });
  } catch (error) {
    console.error('Unexpected error in DELETE handler:', error);
    return NextResponse.json({ 
      error: 'Internal server error occurred while deleting product',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}
