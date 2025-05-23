import { NextResponse } from 'next/server';
import { getProductById, getValidImageUrl } from '@/data/products';

export async function GET(request, { params }) {
  const { id } = params;
  
  const product = getProductById(id);
  
  if (!product) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }
  
  // Ensure the product has valid image URL
  const productWithValidImage = {
    ...product,
    imageUrl: getValidImageUrl(product.imageUrl, product.category, 0)
  };
  
  // If there are additional images, validate them too
  if (productWithValidImage.additionalImages && Array.isArray(productWithValidImage.additionalImages)) {
    productWithValidImage.additionalImages = productWithValidImage.additionalImages.map((img, index) => 
      getValidImageUrl(img, product.category, index + 1)
    );
  }
  
  return NextResponse.json(productWithValidImage);
}
