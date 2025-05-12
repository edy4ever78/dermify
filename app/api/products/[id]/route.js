import { NextResponse } from 'next/server';
import { getProductById } from '@/data/products';

export async function GET(request, { params }) {
  const { id } = params;
  
  const product = getProductById(id);
  
  if (!product) {
    return NextResponse.json(
      { error: 'Product not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(product);
}
